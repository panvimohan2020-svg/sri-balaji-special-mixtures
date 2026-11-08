import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  MapPin, 
  RefreshCw, 
  ShoppingBag, 
  CreditCard,
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { apiService } from '../services/api';
import { useCartStore } from '../store/useCartStore';
import { useTranslation } from '../store/useLanguageStore';

const TIMELINE_STEPS = [
  { key: 'NEW ENQUIRY', label: 'Order Received', desc: 'Enquiry recorded in Sri Balaji system' },
  { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Stock reserved & verified by management' },
  { key: 'PREPARING', label: 'Fresh Preparation', desc: 'Crispy snacks packaged hygienically' },
  { key: 'READY FOR PICKUP / DISPATCHED', label: 'Dispatched / Ready', desc: 'Out for delivery or ready at counter' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Fulfilled & received by customer' }
];

export const OrderTrackingPage: React.FC = () => {
  const { t } = useTranslation();
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber?: string }>();
  const [searchParams] = useSearchParams();

  const [inputOrderNumber, setInputOrderNumber] = useState(paramOrderNumber || searchParams.get('ref') || '');
  const [inputPhone, setInputPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState<any | null>(null);
  const [shipment, setShipment] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reorderSuccess, setReorderSuccess] = useState(false);

  const { addItem, setWholesaleMode } = useCartStore();

  const handleTrack = async (numToTrack?: string) => {
    const target = (numToTrack || inputOrderNumber).trim();
    if (!target) {
      setError('Please enter a valid order reference number (e.g., SB-2611-2041)');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await apiService.trackOrder(target, inputPhone);
      setOrder(data);
      if (data && data.id) {
        try {
          const shipData = await apiService.getShipmentByOrder(data.id);
          setShipment(shipData);
        } catch {
          setShipment(null);
        }
      } else {
        setShipment(null);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to find order. Please verify your reference number.');
      setOrder(null);
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramOrderNumber || searchParams.get('ref')) {
      handleTrack(paramOrderNumber || searchParams.get('ref') || undefined);
    }
  }, [paramOrderNumber]);

  // Determine current step index
  const getStepIndex = (status: string) => {
    if (status === 'NEW ENQUIRY' || status === 'CONTACTED') return 0;
    if (status === 'CONFIRMED') return 1;
    if (status === 'PREPARING') return 2;
    if (status === 'READY FOR PICKUP / DISPATCHED') return 3;
    if (status === 'DELIVERED') return 4;
    return -1; // CANCELLED or REJECTED
  };

  const currentStep = order ? getStepIndex(order.status) : 0;
  const isCancelled = order && (order.status === 'CANCELLED' || order.status === 'REJECTED');

  const handleQuickReorder = async () => {
    if (!order || !order.items) return;
    try {
      const allProducts = await apiService.getProducts();
      setWholesaleMode(order.order_type === 'WHOLESALE');

      let addedCount = 0;
      for (const item of order.items) {
        const prod = allProducts.find(p => p.name.toLowerCase() === item.product_name.toLowerCase());
        if (prod) {
          const variant = prod.variants.find(v => v.weight_label === item.weight_label) || prod.variants[0];
          if (variant) {
            addItem(prod, variant, item.quantity);
            addedCount++;
          }
        }
      }

      if (addedCount > 0) {
        setReorderSuccess(true);
        setTimeout(() => setReorderSuccess(false), 5000);
      }
    } catch (e) {
      console.error('Reorder error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#190D2B] text-white pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#392052] border border-[#F4C45E]/30 text-[#F4C45E] text-xs font-semibold tracking-wider uppercase">
            <Truck className="w-3.5 h-3.5" /> Live Order Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F4C45E]">
            {t('track.title', 'Track Your Sri Balaji Order')}
          </h1>
          <p className="text-gray-300 text-sm max-w-lg mx-auto">
            {t('track.subtitle', 'Enter your unique order reference number to monitor fulfillment, preparation status, and delivery milestones in real-time.')}
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-[#28143F] border border-[#F4C45E]/20 rounded-2xl p-6 shadow-xl space-y-4">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleTrack(); }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Order Reference (e.g. SB-2611-2041)"
                value={inputOrderNumber}
                onChange={(e) => setInputOrderNumber(e.target.value.toUpperCase())}
                className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors uppercase font-mono"
              />
            </div>
            <div className="sm:w-48">
              <input
                type="tel"
                placeholder="Phone (Optional)"
                value={inputPhone}
                onChange={(e) => setInputPhone(e.target.value)}
                className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#F4C45E] to-[#D6A52D] hover:from-[#FFE7A3] hover:to-[#F4C45E] text-[#190D2B] font-semibold px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{t('track.searchBtn', 'Track Status')}</span>
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Details Display */}
        {order && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Summary Top Card */}
            <div className="bg-[#28143F] border border-[#F4C45E]/30 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-700/60 pb-5">
                <div>
                  <span className="text-xs uppercase text-gray-400 tracking-wider font-semibold">Order Reference</span>
                  <div className="text-2xl font-mono font-bold text-[#F4C45E]">{order.order_number}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Placed on: {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Status Badge */}
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isCancelled 
                      ? 'bg-red-950 border border-red-500/50 text-red-300' 
                      : order.status === 'DELIVERED'
                      ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                      : 'bg-amber-950 border border-amber-500/50 text-amber-300'
                  }`}>
                    {order.status}
                  </span>

                  {/* Payment Badge */}
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    order.payment_status === 'PAID'
                      ? 'bg-emerald-900/60 border border-emerald-500/40 text-emerald-300'
                      : 'bg-yellow-900/40 border border-yellow-500/40 text-yellow-300'
                  }`}>
                    <CreditCard className="w-3 h-3" />
                    <span>Payment: {order.payment_status || 'UNPAID'}</span>
                  </span>

                  {/* Order Type */}
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#392052] border border-[#F4C45E]/30 text-gray-200">
                    {order.order_type}
                  </span>
                </div>
              </div>

              {/* Visual Timeline */}
              <div className="mt-8">
                {isCancelled ? (
                  <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
                    <div className="text-base font-bold text-red-300">Order Cancelled / Rejected</div>
                    <p className="text-xs text-gray-400 max-w-md mx-auto">
                      This order enquiry was closed or cancelled. Please contact our support on WhatsApp +91 98617 89602 for inquiries or re-order below.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2 z-0" />
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                      {TIMELINE_STEPS.map((step, idx) => {
                        const isCompleted = currentStep >= idx;
                        const isCurrent = currentStep === idx;

                        return (
                          <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                              isCompleted 
                                ? 'bg-gradient-to-br from-[#F4C45E] to-[#D6A52D] text-[#190D2B] ring-4 ring-[#F4C45E]/20'
                                : 'bg-[#190D2B] border border-gray-600 text-gray-500'
                            }`}>
                              {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                            </div>
                            <div className="space-y-0.5">
                              <div className={`text-xs font-bold ${isCurrent ? 'text-[#F4C45E]' : isCompleted ? 'text-white' : 'text-gray-400'}`}>
                                {step.label}
                              </div>
                              <div className="text-[11px] text-gray-400 hidden sm:block">
                                {step.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Carrier & Dispatch Details (if dispatched) */}
            {shipment && (
              <div className="bg-[#28143F] border border-[#F4C45E]/40 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-700/60 pb-3">
                  <h3 className="font-serif font-bold text-[#F4C45E] text-base flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#F4C45E]" /> Carrier & Dispatch Details
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    shipment.status === 'DELIVERED'
                      ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                      : shipment.status === 'IN_TRANSIT' || shipment.status === 'OUT_FOR_DELIVERY'
                      ? 'bg-blue-950 border border-blue-500/50 text-blue-300'
                      : 'bg-amber-950 border border-amber-500/50 text-amber-300'
                  }`}>
                    {shipment.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-[#190D2B] border border-gray-700/60">
                    <span className="text-gray-400 block text-[11px]">Transport / Courier Partner</span>
                    <strong className="text-white text-sm mt-0.5 block">{shipment.courier_partner}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#190D2B] border border-gray-700/60">
                    <span className="text-gray-400 block text-[11px]">Tracking / Lorry Receipt (LR) #</span>
                    <strong className="text-[#F4C45E] font-mono text-sm mt-0.5 block">{shipment.tracking_number}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#190D2B] border border-gray-700/60">
                    <span className="text-gray-400 block text-[11px]">Dispatched Date</span>
                    <strong className="text-white text-xs mt-0.5 block">
                      {shipment.dispatch_date ? new Date(shipment.dispatch_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending'}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#190D2B] border border-gray-700/60">
                    <span className="text-gray-400 block text-[11px]">Est. Delivery</span>
                    <strong className="text-[#F4C45E] text-xs mt-0.5 block">
                      {shipment.estimated_delivery_date ? new Date(shipment.estimated_delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '1 - 3 Days'}
                    </strong>
                  </div>
                </div>

                {shipment.tracking_url && (
                  <div className="pt-2 flex justify-end">
                    <a
                      href={shipment.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F4C45E] hover:bg-[#FFE7A3] text-[#190D2B] font-bold text-xs transition-colors"
                    >
                      <span>Open Carrier Tracking Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Items & Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Items Card (2 cols) */}
              <div className="md:col-span-2 bg-[#28143F] border border-[#F4C45E]/20 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-700/60 pb-3">
                  <h3 className="font-serif font-bold text-[#F4C45E] text-base flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#F4C45E]" /> Ordered Items ({order.items?.length || 0})
                  </h3>
                  <div className="text-xs text-gray-400">
                    Total Weight: <span className="text-[#F4C45E] font-bold">{order.total_estimated_weight_kg} kg</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-800">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="py-3 flex items-center justify-between gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-white">{item.product_name}</div>
                        <div className="text-xs text-gray-400">
                          Weight: <span className="text-[#F4C45E]">{item.weight_label}</span> | Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-[#F4C45E]">Rs. {item.subtotal}</div>
                        <div className="text-[11px] text-gray-400">Rs. {item.unit_price} / unit</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700/60 pt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-300">Total Amount:</span>
                  <span className="text-2xl font-mono font-bold text-[#F4C45E]">Rs. {order.total_estimated_amount}</span>
                </div>

                {/* Quick Reorder Button */}
                <div className="pt-2">
                  <button
                    onClick={handleQuickReorder}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#392052] hover:bg-[#51336B] border border-[#F4C45E]/40 text-[#F4C45E] hover:text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reorder These Items into Bag
                  </button>
                  {reorderSuccess && (
                    <div className="mt-2 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs text-center flex items-center justify-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5" /> Items added to your bag!{' '}
                      <Link to="/cart" className="underline font-bold text-white hover:text-[#F4C45E]">View Bag →</Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery / Pickup Details (1 col) */}
              <div className="bg-[#28143F] border border-[#F4C45E]/20 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="font-serif font-bold text-[#F4C45E] text-base flex items-center gap-2 border-b border-gray-700/60 pb-3">
                  <MapPin className="w-4 h-4 text-[#F4C45E]" /> Fulfillment Information
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-gray-400 block">Customer Name:</span>
                    <span className="text-white font-semibold">{order.customer_name}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 block">Phone:</span>
                    <span className="text-white font-mono">{order.masked_phone}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 block">Fulfillment Type:</span>
                    <span className="text-[#F4C45E] font-semibold uppercase">{order.fulfillment_type}</span>
                  </div>

                  {order.delivery_address && (
                    <div>
                      <span className="text-gray-400 block">Destination Address:</span>
                      <span className="text-gray-200 leading-relaxed block mt-0.5">
                        {order.delivery_address}, {order.city}, {order.state} - {order.pin_code}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-800">
                    <span className="text-gray-400 block">Payment Method:</span>
                    <span className="text-emerald-400 font-semibold">{order.payment_method}</span>
                  </div>
                </div>

                {/* Support shortcut */}
                <div className="pt-3 border-t border-gray-700/60">
                  <a
                    href={`https://wa.me/919861789602?text=${encodeURIComponent(`Namaste Sri Balaji, I am inquiring about my Order Reference ${order.order_number}. Could you please update me?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Contact via WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>

            {/* Status History Timeline */}
            {order.status_history && order.status_history.length > 0 && (
              <div className="bg-[#28143F] border border-[#F4C45E]/20 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="font-serif font-bold text-[#F4C45E] text-base flex items-center gap-2 border-b border-gray-700/60 pb-3">
                  <Clock className="w-4 h-4 text-[#F4C45E]" /> Status Log & Milestones
                </h3>

                <div className="space-y-3">
                  {order.status_history.map((hist: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#F4C45E] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{hist.to_status}</span>
                          <span className="text-gray-400 font-mono text-[11px]">
                            {new Date(hist.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                        {hist.notes && <p className="text-gray-300 mt-0.5">{hist.notes}</p>}
                        <span className="text-[10px] text-gray-400">By: {hist.changed_by}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
