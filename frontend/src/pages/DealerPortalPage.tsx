import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Store, 
  Package, 
  FileText, 
  Truck, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  Minus, 
  Search, 
  MapPin, 
  Phone, 
  Printer, 
  ShieldCheck, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { useCustomerAuthStore } from '../store/useCustomerAuthStore';
import { 
  apiService, 
  DealerProfileItem, 
  WholesaleQuotationItem, 
  PincodeCheckResult 
} from '../services/api';
import { initialProducts, initialBusinessSettings } from '../data/initialData';
import { Product } from '../types';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';

export const DealerPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, customer } = useCustomerAuthStore();

  const [dealerProfile, setDealerProfile] = useState<DealerProfileItem | null>(null);
  const [portalSummary, setPortalSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Tabs for approved dealers
  const [activeTab, setActiveTab] = useState<'bulk-order' | 'quotations' | 'orders' | 'pincode' | 'profile'>('bulk-order');

  // Application form state
  const [bizName, setBizName] = useState('');
  const [bizCategory, setBizCategory] = useState('Kirana Store');
  const [ownerName, setOwnerName] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizGstin, setBizGstin] = useState('');
  const [bizAddress, setBizAddress] = useState('');
  const [bizCity, setBizCity] = useState('Paralakhemundi');
  const [bizState, setBizState] = useState('Odisha');
  const [bizPin, setBizPin] = useState('761200');
  const [bizReqs, setBizReqs] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);

  // Bulk Order Builder state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [bulkQuantities, setBulkQuantities] = useState<{ [variantId: string]: number }>({});
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [orderCreatedMsg, setOrderCreatedMsg] = useState('');

  // Quotations state
  const [quotations, setQuotations] = useState<WholesaleQuotationItem[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<WholesaleQuotationItem | null>(null);

  // PIN code check state
  const [checkPinInput, setCheckPinInput] = useState('');
  const [pinResult, setPinResult] = useState<PincodeCheckResult | null>(null);
  const [pinChecking, setPinChecking] = useState(false);

  const loadDealerData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [profile, summary, prods] = await Promise.all([
        apiService.getMyDealerProfile(token),
        apiService.getDealerPortalSummary(token).catch(() => null),
        apiService.getProducts()
      ]);
      setDealerProfile(profile);
      setPortalSummary(summary);
      if (prods && prods.length > 0) setProducts(prods);

      if (profile && profile.status === 'APPROVED') {
        const quotes = await apiService.getQuotations(token, { dealer_id: profile.id }).catch(() => []);
        setQuotations(quotes);
      }
    } catch (e) {
      console.error('Error loading dealer portal:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDealerData();
  }, [token]);

  useEffect(() => {
    if (customer) {
      setOwnerName(customer.full_name || '');
      setBizPhone(customer.phone_number || '');
      setBizEmail(customer.email || '');
    }
  }, [customer]);

  const handleApplyDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate('/account');
      return;
    }

    setSubmittingApp(true);
    setAppError(null);
    try {
      const res = await apiService.applyForDealer(token, {
        business_name: bizName,
        business_category: bizCategory,
        owner_name: ownerName,
        phone_number: bizPhone,
        email: bizEmail || undefined,
        gstin: bizGstin || undefined,
        business_address: bizAddress,
        city: bizCity,
        state: bizState,
        pin_code: bizPin,
        wholesale_requirements: bizReqs || undefined
      });
      setDealerProfile(res);
      loadDealerData();
    } catch (err: any) {
      setAppError(err.message || 'Application failed');
    } finally {
      setSubmittingApp(false);
    }
  };

  // Bulk Order calculations
  const calculateBulkTotals = () => {
    let totalWeight = 0;
    let totalAmount = 0;
    let totalUnits = 0;
    const selectedItems: any[] = [];

    for (const prod of products) {
      for (const variant of prod.variants) {
        const qty = bulkQuantities[variant.id] || 0;
        if (qty > 0) {
          const unitPrice = variant.wholesale_price || variant.retail_price || 0;
          const subtotal = unitPrice * qty;
          const weightKg = ((variant.weight_in_grams || 250) * qty) / 1000.0;

          totalWeight += weightKg;
          totalAmount += subtotal;
          totalUnits += qty;

          selectedItems.push({
            variant_id: variant.id,
            product_name: prod.name,
            weight_label: variant.weight_label,
            unit_price: unitPrice,
            quantity: qty,
            subtotal
          });
        }
      }
    }

    return { totalWeight: round(totalWeight, 2), totalAmount: round(totalAmount, 2), totalUnits, selectedItems };
  };

  const round = (num: number, dec: number) => Number(Math.round(Number(num + 'e' + dec)) + 'e-' + dec);

  const { totalWeight, totalAmount, totalUnits, selectedItems } = calculateBulkTotals();

  const handleBulkQuantityChange = (variantId: string, val: number) => {
    setBulkQuantities(prev => ({
      ...prev,
      [variantId]: Math.max(0, val)
    }));
  };

  const handleSubmitBulkOrder = async () => {
    if (!token || !dealerProfile) return;
    if (selectedItems.length === 0) {
      alert('Please add at least one product quantity to build a bulk order.');
      return;
    }

    // Minimum Wholesale threshold check (e.g. 5kg or 20 units)
    if (totalWeight < 5 && totalUnits < 10) {
      if (!confirm(`Your bulk order weight is ${totalWeight} kg. Standard wholesale orders are 5kg+. Do you still wish to submit?`)) {
        return;
      }
    }

    setBulkSubmitting(true);
    try {
      const orderPayload = {
        customer_id: customer?.id,
        customer_name: dealerProfile.owner_name,
        business_name: dealerProfile.business_name,
        phone_number: dealerProfile.phone_number,
        whatsapp_number: dealerProfile.phone_number,
        order_type: 'WHOLESALE' as const,
        fulfillment_type: 'DELIVERY' as const,
        delivery_address: dealerProfile.business_address,
        city: dealerProfile.city,
        state: dealerProfile.state,
        pin_code: dealerProfile.pin_code,
        notes: `B2B Wholesale Portal Order from ${dealerProfile.business_name} (${dealerProfile.pricing_tier})`,
        payment_method: 'WHATSAPP_CONFIRMATION',
        total_estimated_amount: totalAmount,
        total_estimated_weight_kg: totalWeight,
        items: selectedItems
      };

      const res = await apiService.submitOrder(orderPayload);
      setBulkSubmitting(false);
      setOrderCreatedMsg(`Wholesale order #${res.order_number} submitted successfully!`);
      setBulkQuantities({});
      loadDealerData();

      // Open WhatsApp confirmation
      const waMsg = `*SRI BALAJI B2B WHOLESALE ORDER: #${res.order_number}*\nDealer: ${dealerProfile.business_name}\nOwner: ${dealerProfile.owner_name}\nPhone: ${dealerProfile.phone_number}\nCity: ${dealerProfile.city}\nTotal Weight: ${totalWeight} kg\nEstimated Amount: Rs. ${totalAmount}\n\nItems:\n${selectedItems.map(i => `• ${i.quantity}x ${i.product_name} (${i.weight_label}) = Rs.${i.subtotal}`).join('\n')}\n\nPlease confirm availability and transport dispatch.`;
      window.open(`https://wa.me/919861789602?text=${encodeURIComponent(waMsg)}`, '_blank');
    } catch (err: any) {
      setBulkSubmitting(false);
      alert(err.message || 'Failed to submit bulk order');
    }
  };

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPinInput.trim()) return;
    setPinChecking(true);
    try {
      const res = await apiService.checkPincodeServiceability(checkPinInput);
      setPinResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setPinChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#190D2B] text-white pt-36 pb-16 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#F4C45E]" />
      </div>
    );
  }

  // Not signed in
  if (!token || !customer) {
    return (
      <div className="min-h-screen bg-[#190D2B] text-white pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-lg mx-auto bg-[#28143F] border border-[#F4C45E]/30 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#392052] border border-[#F4C45E]/40 flex items-center justify-center mx-auto text-[#F4C45E]">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4C45E]">
            Sri Balaji B2B Wholesale Portal
          </h1>
          <p className="text-xs text-gray-300 leading-relaxed">
            Exclusive regional commerce gateway for Kirana stores, supermarkets, tea vendors, and snack distributors. Please sign in to access bulk pricing and customized quotations.
          </p>
          <div className="pt-2">
            <Link
              to="/account"
              className="inline-block px-8 py-3 rounded-2xl bg-gradient-to-r from-[#F4C45E] to-[#D6A52D] text-[#190D2B] font-bold text-xs uppercase tracking-wider shadow-lg hover:from-[#FFE7A3] hover:to-[#F4C45E] transition-all"
            >
              Sign In or Register First →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Application Pending Verification
  if (dealerProfile && dealerProfile.status === 'PENDING_VERIFICATION') {
    return (
      <div className="min-h-screen bg-[#190D2B] text-white pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto bg-[#28143F] border border-[#F4C45E]/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#F4C45E]">Application Under Review</span>
            <h1 className="text-2xl font-serif font-bold text-white mt-1">
              {dealerProfile.business_name}
            </h1>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              Namaste {dealerProfile.owner_name}, thank you for registering your {dealerProfile.business_category}. Our wholesale operations team in Paralakhemundi is verifying your details and will assign your wholesale dealer pricing tier within 24 business hours.
            </p>
          </div>

          <div className="bg-[#190D2B] p-4 rounded-2xl border border-gray-800 text-left text-xs space-y-2">
            <div className="font-bold text-[#F4C45E]">Submitted Business Credentials:</div>
            <div className="text-gray-300">Category: <strong>{dealerProfile.business_category}</strong></div>
            <div className="text-gray-300">Contact: {dealerProfile.phone_number}</div>
            <div className="text-gray-300">Address: {dealerProfile.business_address}, {dealerProfile.city} - {dealerProfile.pin_code}</div>
            {dealerProfile.gstin && <div className="text-gray-300 font-mono">GSTIN: {dealerProfile.gstin}</div>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`https://wa.me/919861789602?text=${encodeURIComponent(`Namaste Sri Balaji, I have submitted a wholesale dealer application for ${dealerProfile.business_name} (${dealerProfile.phone_number}). Please assist with approval.`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-4 h-4" /> Expedite on WhatsApp
            </a>
            <button
              onClick={() => setDealerProfile(null)}
              className="py-3 px-4 rounded-xl border border-gray-700 text-gray-300 hover:text-white text-xs font-semibold"
            >
              Edit Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Application Not Submitted: Registration Form
  if (!dealerProfile) {
    return (
      <div className="min-h-screen bg-[#190D2B] text-white pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#392052] border border-[#F4C45E]/30 text-[#F4C45E] text-xs font-bold uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" /> B2B Merchant Registration
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#F4C45E]">
              Apply for Sri Balaji Wholesale Dealer Account
            </h1>
            <p className="text-xs text-gray-300 max-w-lg mx-auto">
              Unlock factory wholesale rates, volume discounts, flexible carton packing, and direct transport dispatch across South Odisha and border regional distributor hubs.
            </p>
          </div>

          <div className="bg-[#28143F] border border-[#F4C45E]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            {appError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
                {appError}
              </div>
            )}

            <form onSubmit={handleApplyDealer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-300 block mb-1">Business / Shop Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maa Tarini Kirana Store"
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-300 block mb-1">Business Category *</label>
                  <select
                    value={bizCategory}
                    onChange={(e) => setBizCategory(e.target.value)}
                    className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-3.5 py-2.5 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Kirana Store">Kirana / Retail Grocery Store</option>
                    <option value="Supermarket">Supermarket / Departmental Store</option>
                    <option value="Tea/Snacks Vendor">Tea Stall / Snacks Center</option>
                    <option value="Food Distributor">Regional Food Distributor</option>
                    <option value="Wholesaler">Wholesale Merchant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-300 block mb-1">Proprietor / Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-300 block mb-1">Primary Mobile (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={bizPhone}
                    onChange={(e) => setBizPhone(e.target.value)}
                    className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-300 block mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="shop@example.com"
                    value={bizEmail}
                    onChange={(e) => setBizEmail(e.target.value)}
                    className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-300 block mb-1">GSTIN (Optional / If applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. 21AAAAA0000A1Z5"
                    value={bizGstin}
                    onChange={(e) => setBizGstin(e.target.value.toUpperCase())}
                    className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1">Shop / Warehouse Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Street name, landmark, market center"
                  value={bizAddress}
                  onChange={(e) => setBizAddress(e.target.value)}
                  className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-300 block mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={bizCity}
                    onChange={(e) => setBizCity(e.target.value)}
                    className="w-full bg-[#190D2B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-300 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={bizState}
                    onChange={(e) => setBizState(e.target.value)}
                    className="w-full bg-[#190D2B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-300 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={bizPin}
                    onChange={(e) => setBizPin(e.target.value)}
                    className="w-full bg-[#190D2B] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1">Expected Monthly Volume & Product Interest</label>
                <input
                  type="text"
                  placeholder="e.g. 50kg mixture, 20kg banana chips monthly"
                  value={bizReqs}
                  onChange={(e) => setBizReqs(e.target.value)}
                  className="w-full bg-[#190D2B] border border-gray-700 rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingApp}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F4C45E] to-[#D6A52D] hover:from-[#FFE7A3] hover:to-[#F4C45E] text-[#190D2B] font-bold text-xs uppercase tracking-wider transition-all shadow-xl cursor-pointer disabled:opacity-50 mt-2"
              >
                {submittingApp ? 'Submitting Application...' : 'Submit Dealer Application for Approval'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // APPROVED WHOLESALE DEALER PORTAL
  return (
    <div className="min-h-screen bg-[#190D2B] text-white pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Dealer Header Card */}
        <div className="bg-[#28143F] border border-[#F4C45E]/40 rounded-3xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#392052] border border-[#F4C45E]/50 flex items-center justify-center text-[#F4C45E]">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-white">{dealerProfile.business_name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  ✓ Verified Dealer
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 mt-1">
                <span>Proprietor: <strong>{dealerProfile.owner_name}</strong></span>
                <span>•</span>
                <span>Tier: <strong className="text-[#F4C45E]">{dealerProfile.pricing_tier}</strong></span>
                <span>•</span>
                <span>Location: {dealerProfile.city}, {dealerProfile.state}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/919861789602?text=${encodeURIComponent(`Namaste Sri Balaji Wholesale Desk, this is ${dealerProfile.business_name} (${dealerProfile.phone_number}). I need commercial support.`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" /> B2B WhatsApp Desk
            </a>
          </div>
        </div>

        {/* Success order banner */}
        {orderCreatedMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs text-center flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{orderCreatedMsg}</span>
          </div>
        )}

        {/* Portal Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-2">
          {[
            { key: 'bulk-order', label: 'Bulk Order Builder', icon: Package },
            { key: 'quotations', label: 'Official Quotations', icon: FileText, count: quotations.length },
            { key: 'orders', label: 'Wholesale Order History', icon: Clock },
            { key: 'pincode', label: 'PIN Serviceability Check', icon: MapPin },
            { key: 'profile', label: 'Dealer Profile & Terms', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F4C45E] to-[#D6A52D] text-[#190D2B] shadow-md'
                    : 'bg-[#28143F] text-gray-300 hover:text-white border border-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#190D2B] text-[#F4C45E]">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: BULK ORDER BUILDER */}
        {activeTab === 'bulk-order' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Products & Variants Quantity Entry (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#28143F] border border-[#F4C45E]/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#F4C45E]">Wholesale Product Matrix</h3>
                    <p className="text-xs text-gray-400">Directly enter carton or packet units at verified B2B wholesale rates.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {products.map(prod => (
                    <div key={prod.id} className="p-4 rounded-2xl bg-[#190D2B] border border-gray-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm text-white">{prod.name}</div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          MOQ: {prod.minimum_order_qty || 5} units
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {prod.variants.map(v => {
                          const currentQty = bulkQuantities[v.id] || 0;
                          const wholesaleRate = v.wholesale_price || v.retail_price || 0;
                          return (
                            <div key={v.id} className="p-2.5 rounded-xl bg-[#28143F] border border-gray-700/60 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-white block">{v.weight_label}</span>
                                <span className="text-[11px] font-mono text-[#F4C45E]">Rs. {wholesaleRate} / unit</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleBulkQuantityChange(v.id, currentQty - 5)}
                                  className="w-7 h-7 rounded-lg bg-[#392052] hover:bg-[#51336B] text-white flex items-center justify-center font-bold"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={currentQty}
                                  onChange={(e) => handleBulkQuantityChange(v.id, Number(e.target.value))}
                                  className="w-14 text-center bg-[#190D2B] border border-gray-700 rounded-lg py-1 font-mono text-white text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleBulkQuantityChange(v.id, currentQty + 5)}
                                  className="w-7 h-7 rounded-lg bg-[#392052] hover:bg-[#51336B] text-white flex items-center justify-center font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Order Summary Card (1 col) */}
            <div className="space-y-4">
              <div className="bg-[#28143F] border border-[#F4C45E]/40 rounded-3xl p-6 shadow-2xl sticky top-28 space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#F4C45E] border-b border-gray-800 pb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#F4C45E]" /> Bulk Order Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Total Packages:</span>
                    <span className="font-mono font-bold text-white">{totalUnits} units</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Total Net Weight:</span>
                    <span className="font-mono font-bold text-[#F4C45E]">{totalWeight} kg</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Dealer Pricing Tier:</span>
                    <span className="font-bold text-emerald-400">{dealerProfile.pricing_tier}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Dispatch Location:</span>
                    <span className="text-right text-gray-300">Gandhi School Rd, Paralakhemundi</span>
                  </div>
                </div>

                {/* Selected Items Breakdown */}
                {selectedItems.length > 0 && (
                  <div className="border-t border-gray-800 pt-3 max-h-48 overflow-y-auto space-y-1.5 text-[11px] text-gray-300 divide-y divide-gray-800/40">
                    {selectedItems.map((item, i) => (
                      <div key={i} className="flex justify-between pt-1">
                        <span>{item.quantity}x {item.product_name} ({item.weight_label})</span>
                        <span className="font-mono text-white">Rs. {item.subtotal}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-300">Wholesale Total:</span>
                  <span className="text-2xl font-mono font-bold text-[#F4C45E]">Rs. {totalAmount}</span>
                </div>

                <button
                  type="button"
                  disabled={bulkSubmitting || selectedItems.length === 0}
                  onClick={handleSubmitBulkOrder}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F4C45E] to-[#D6A52D] hover:from-[#FFE7A3] hover:to-[#F4C45E] text-[#190D2B] font-bold text-xs uppercase tracking-wider transition-all shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {bulkSubmitting ? 'Recording Wholesale Order...' : 'Submit Wholesale Order Enquiry →'}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: QUOTATIONS */}
        {activeTab === 'quotations' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F4C45E]">Official Wholesale Quotations</h3>
                <p className="text-xs text-gray-400">Formal commercial estimates issued by Sri Balaji management.</p>
              </div>
            </div>

            {quotations.length === 0 ? (
              <div className="bg-[#28143F] border border-gray-800 rounded-3xl p-12 text-center text-gray-400 text-xs">
                No formal quotations generated yet. Inquire via the bulk builder or WhatsApp to request a custom quote.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quotations.map(q => (
                  <div key={q.id} className="bg-[#28143F] border border-[#F4C45E]/20 rounded-3xl p-5 shadow-xl space-y-3 text-xs">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2.5">
                      <div>
                        <span className="font-mono font-bold text-[#F4C45E] text-sm">{q.quote_number}</span>
                        <div className="text-[10px] text-gray-400">
                          Valid Until: {new Date(q.valid_until).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gold text-imperial">
                        {q.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {q.items?.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-gray-300">
                          <span>{it.quantity}x {it.product_name} ({it.weight_label})</span>
                          <span className="font-mono">Rs. {it.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-800 pt-2 flex justify-between items-center">
                      <div>
                        <span className="text-gray-400">Total: </span>
                        <span className="text-base font-mono font-bold text-[#F4C45E]">Rs. {q.total_amount}</span>
                        <span className="text-[10px] text-gray-400 ml-1">({q.total_weight_kg} kg)</span>
                      </div>
                      <button
                        onClick={() => setSelectedQuote(q)}
                        className="px-3 py-1.5 rounded-xl bg-[#392052] hover:bg-[#51336B] text-[#F4C45E] font-bold text-xs"
                      >
                        View Official Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DEALER ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-[#28143F] border border-[#F4C45E]/20 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#F4C45E]">Wholesale Order Records</h3>
            {portalSummary?.recent_orders?.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">No orders recorded yet.</div>
            ) : (
              <div className="divide-y divide-gray-800">
                {portalSummary?.recent_orders?.map((ord: any, idx: number) => (
                  <div key={idx} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-mono font-bold text-white text-sm">{ord.order_number}</div>
                      <div className="text-[11px] text-gray-400">
                        {new Date(ord.created_at).toLocaleDateString('en-IN')} • {ord.weight_kg} kg
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-950 text-amber-300">
                        {ord.status}
                      </span>
                      <span className="font-mono font-bold text-[#F4C45E] text-sm">
                        Rs. {ord.amount}
                      </span>
                      <Link
                        to={`/track/${ord.order_number}`}
                        className="px-3 py-1 rounded-lg bg-[#392052] hover:bg-[#51336B] text-[#F4C45E] font-bold text-[11px]"
                      >
                        Track
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PINCODE SERVICEABILITY */}
        {activeTab === 'pincode' && (
          <div className="bg-[#28143F] border border-[#F4C45E]/20 rounded-3xl p-6 shadow-xl max-w-lg space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#F4C45E]">Regional Transport Coverage</h3>
            <p className="text-xs text-gray-300">
              Check delivery and bulk freight route serviceability from our Paralakhemundi facility.
            </p>

            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit PIN code (e.g. 761200)"
                value={checkPinInput}
                onChange={(e) => setCheckPinInput(e.target.value)}
                className="flex-1 bg-[#190D2B] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#F4C45E]"
              />
              <button
                type="submit"
                disabled={pinChecking}
                className="px-5 py-2 rounded-xl bg-[#F4C45E] text-[#190D2B] font-bold text-xs"
              >
                {pinChecking ? 'Checking...' : 'Check'}
              </button>
            </form>

            {pinResult && (
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                pinResult.serviceability_status === 'REGULAR'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : pinResult.serviceability_status === 'CUSTOM_TRANSIT'
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                  : pinResult.serviceability_status === 'PENDING_VERIFICATION'
                  ? 'bg-blue-950/60 border-blue-500/40 text-blue-200'
                  : 'bg-red-950/60 border-red-500/40 text-red-200'
              }`}>
                <div className="font-bold text-sm flex items-center justify-between">
                  <span>
                    {pinResult.serviceability_status === 'REGULAR' && '✓ Regular Delivery Available'}
                    {pinResult.serviceability_status === 'CUSTOM_TRANSIT' && '⚠ Custom Transit Available'}
                    {pinResult.serviceability_status === 'PENDING_VERIFICATION' && 'ℹ Route Verification Pending'}
                    {pinResult.serviceability_status === 'UNAVAILABLE' && '✕ Outside Direct Network'}
                  </span>
                  <span className="font-mono text-[11px] text-[#F4C45E]">PIN {pinResult.pincode}</span>
                </div>
                <p className="leading-relaxed">{pinResult.message}</p>
                {pinResult.city && (
                  <div className="text-[11px] text-gray-300 pt-1 border-t border-white/10 flex flex-wrap justify-between gap-2">
                    <span>Hub: <strong>{pinResult.city}, {pinResult.state}</strong></span>
                    <span>Transit: <strong>{pinResult.transit_duration_label || `${pinResult.min_delivery_days}-${pinResult.max_delivery_days} days`}</strong></span>
                    <span>Freight: <strong>{pinResult.delivery_charges_text || `₹${pinResult.standard_shipping_rate}/carton`}</strong></span>
                  </div>
                )}
                {pinResult.whatsapp_url && pinResult.serviceability_status !== 'REGULAR' && (
                  <div className="pt-1">
                    <a
                      href={pinResult.whatsapp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                    >
                      <span>Direct WhatsApp Transit Desk (+91 98617 89602)</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: DEALER PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-[#28143F] border border-[#F4C45E]/20 rounded-3xl p-6 shadow-xl max-w-xl space-y-4 text-xs">
            <h3 className="font-serif font-bold text-lg text-[#F4C45E]">Dealer Account Specifications</h3>
            <div className="grid grid-cols-2 gap-3 text-gray-300">
              <div>Business: <strong className="text-white">{dealerProfile.business_name}</strong></div>
              <div>Category: <strong className="text-white">{dealerProfile.business_category}</strong></div>
              <div>Proprietor: <strong className="text-white">{dealerProfile.owner_name}</strong></div>
              <div>Contact Phone: <strong className="font-mono text-white">{dealerProfile.phone_number}</strong></div>
              <div>GSTIN: <strong className="font-mono text-white">{dealerProfile.gstin || 'Unregistered / Composite'}</strong></div>
              <div>Pricing Tier: <strong className="text-[#F4C45E]">{dealerProfile.pricing_tier}</strong></div>
              <div>Approved Credit Limit: <strong>Rs. {dealerProfile.credit_limit}</strong></div>
              <div>Credit Period: <strong>{dealerProfile.credit_days} days</strong></div>
            </div>
            <div className="pt-2 border-t border-gray-800 text-gray-400">
              Registered Address: {dealerProfile.business_address}, {dealerProfile.city}, {dealerProfile.state} - {dealerProfile.pin_code}
            </div>
          </div>
        )}

        {/* QUOTATION MODAL */}
        {selectedQuote && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white text-cocoa rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-scaleUp">
              <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                <div>
                  <h3 className="font-serif font-black text-xl text-imperial">SRI BALAJI SPECIAL MIXTURES</h3>
                  <div className="text-xs text-gray-500">Gandhi School Road, Near Post Office, Paralakhemundi – 761200</div>
                  <div className="text-xs font-mono font-bold text-gold-deep mt-1">QUOTATION REF: {selectedQuote.quote_number}</div>
                </div>
                <button onClick={() => setSelectedQuote(null)} className="text-gray-400 hover:text-black">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Recipient: <strong>{selectedQuote.recipient_name}</strong></div>
                <div>Firm: <strong>{selectedQuote.business_name}</strong></div>
                <div>Date: {new Date(selectedQuote.created_at).toLocaleDateString()}</div>
                <div>Valid Until: <strong>{new Date(selectedQuote.valid_until).toLocaleDateString()}</strong></div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-warm-ivory text-imperial font-bold">
                    <tr>
                      <th className="p-2">Item</th>
                      <th className="p-2">Weight</th>
                      <th className="p-2">Rate</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedQuote.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2">{it.product_name}</td>
                        <td className="p-2">{it.weight_label}</td>
                        <td className="p-2 font-mono">Rs.{it.unit_price}</td>
                        <td className="p-2 font-mono">{it.quantity}</td>
                        <td className="p-2 font-mono text-right font-bold">Rs.{it.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-right text-xs space-y-1">
                <div>Subtotal: <strong>Rs. {selectedQuote.subtotal}</strong></div>
                <div>Delivery Charges: <strong>Rs. {selectedQuote.delivery_charges}</strong></div>
                <div className="text-base font-serif font-bold text-imperial">Grand Total: Rs. {selectedQuote.total_amount}</div>
              </div>

              {selectedQuote.terms_and_conditions && (
                <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl">
                  <strong>Terms &amp; Conditions:</strong>
                  <p className="whitespace-pre-line mt-1">{selectedQuote.terms_and_conditions}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Quotation
                </button>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="px-4 py-2 rounded-xl bg-gray-200 text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
