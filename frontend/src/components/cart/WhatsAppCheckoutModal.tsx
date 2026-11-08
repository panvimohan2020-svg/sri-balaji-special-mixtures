import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Lock,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { useCartStore } from '../../store/useCartStore';
import { useCustomerAuthStore } from '../../store/useCustomerAuthStore';
import { initialBusinessSettings } from '../../data/initialData';
import { generateWhatsAppOrderUrl } from '../../utils/whatsapp';
import { apiService } from '../../services/api';
import { trackMarketingEvent } from '../../utils/analytics';

interface WhatsAppCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponCode?: string;
  discountAmount?: number;
  pointsRedeemed?: number;
  pointsDiscount?: number;
}

export const WhatsAppCheckoutModal: React.FC<WhatsAppCheckoutModalProps> = ({
  isOpen,
  onClose,
  couponCode,
  discountAmount = 0,
  pointsRedeemed = 0,
  pointsDiscount = 0
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const { items, getTotalAmount, getTotalWeightKg, isWholesaleMode, clearCart } = useCartStore();
  const totalAmount = getTotalAmount();
  const totalWeightKg = getTotalWeightKg();

  const { token, customer, addresses, fetchAddresses } = useCustomerAuthStore();

  const [paymentChoice, setPaymentChoice] = useState<'ONLINE' | 'WHATSAPP'>('ONLINE');
  const [fulfillmentType, setFulfillmentType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');

  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('Paralakhemundi');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pinCode, setPinCode] = useState('761200');
  const [notes, setNotes] = useState('');

  const [selectedAddressId, setSelectedAddressId] = useState<string>('custom');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{ 
    orderNum: string; 
    orderId?: string;
    waUrl?: string; 
    isPaid?: boolean;
    paymentId?: string;
  } | null>(null);

  // Load customer or past session info
  useEffect(() => {
    if (isOpen) {
      setSubmittedOrder(null);
      if (token) fetchAddresses();
    }

    if (customer) {
      setCustomerName(customer.full_name || '');
      setPhoneNumber(customer.phone_number || '');
    } else {
      const savedCustomer = localStorage.getItem('sri_balaji_last_customer');
      if (savedCustomer) {
        try {
          const parsed = JSON.parse(savedCustomer);
          if (parsed.customerName) setCustomerName(parsed.customerName);
          if (parsed.businessName) setBusinessName(parsed.businessName);
          if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
          if (parsed.city) setCity(parsed.city);
          if (parsed.deliveryAddress) setDeliveryAddress(parsed.deliveryAddress);
        } catch {}
      }
    }
  }, [isOpen, customer, token]);

  // Handle address selection from saved addresses
  const handleAddressSelect = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId === 'custom') return;
    const found = addresses.find(a => a.id === addrId);
    if (found) {
      setCustomerName(found.recipient_name);
      setPhoneNumber(found.phone_number);
      setDeliveryAddress(found.address_line);
      setCity(found.city);
      setPinCode(found.pin_code);
    }
  };

  // Modern dialog open/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phoneNumber.trim()) {
      setFormError('Please enter your name and phone number.');
      return;
    }

    if (fulfillmentType === 'DELIVERY' && (!deliveryAddress.trim() || !city.trim())) {
      setFormError('Please provide delivery address and city.');
      return;
    }

    setFormError('');
    setSubmitting(true);

    // Save for guest reuse
    localStorage.setItem(
      'sri_balaji_last_customer',
      JSON.stringify({ customerName, businessName, phoneNumber, city, deliveryAddress })
    );

    const orderPayload = {
      customer_id: customer?.id,
      customer_name: customerName.trim(),
      business_name: isWholesaleMode ? businessName.trim() : undefined,
      phone_number: phoneNumber.trim(),
      whatsapp_number: phoneNumber.trim(),
      order_type: (isWholesaleMode ? 'WHOLESALE' : 'RETAIL') as 'RETAIL' | 'WHOLESALE',
      fulfillment_type: fulfillmentType,
      delivery_address: fulfillmentType === 'DELIVERY' ? deliveryAddress.trim() : undefined,
      city: fulfillmentType === 'DELIVERY' ? city.trim() : 'Paralakhemundi',
      state: 'Odisha',
      pin_code: pinCode.trim() || '761200',
      notes: notes.trim() || undefined,
      payment_method: paymentChoice === 'ONLINE' ? 'RAZORPAY_UPI' : 'WHATSAPP_CONFIRMATION',
      coupon_code: couponCode || undefined,
      discount_amount: discountAmount || 0,
      points_redeemed: pointsRedeemed || 0,
      points_discount: pointsDiscount || 0,
      total_estimated_amount: Math.max(0, totalAmount - (discountAmount || 0) - (pointsDiscount || 0)),
      total_estimated_weight_kg: totalWeightKg,
      items: items.map(item => ({
        variant_id: item.variantId,
        product_name: item.productName,
        weight_label: item.weightLabel,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.unitPrice * item.quantity
      }))
    };

    try {
      // 1. Submit order to backend
      const apiResult = await apiService.submitOrder(orderPayload);
      const generatedOrderNum = apiResult.order_number;
      const orderId = apiResult.id;

      if (paymentChoice === 'ONLINE' && orderId) {
        // 2. Initialize Payment Order
        const rzpOrder = await apiService.createPaymentOrder(orderId);
        
        // Check if Razorpay Checkout script is available in window
        const rzp = (window as any).Razorpay;
        if (typeof rzp !== 'undefined' && rzpOrder.key_id && !rzpOrder.key_id.startsWith('rzp_test_sribalaji_demo')) {
          const options = {
            key: rzpOrder.key_id,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            name: 'Sri Balaji Special Mixtures',
            description: `Payment for Order #${generatedOrderNum}`,
            order_id: rzpOrder.razorpay_order_id,
            prefill: {
              name: customerName,
              contact: phoneNumber
            },
            theme: { color: '#28143F' },
            handler: async (response: any) => {
              try {
                await apiService.verifyPayment({
                  order_id: orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });
                setSubmitting(false);
                setSubmittedOrder({
                  orderNum: generatedOrderNum,
                  orderId,
                  isPaid: true,
                  paymentId: response.razorpay_payment_id
                });
              } catch (err: any) {
                alert(err.message || 'Payment verification failed');
                setSubmitting(false);
              }
            }
          };
          const rzpInstance = new rzp(options);
          rzpInstance.open();
        } else {
          // Sandbox test mode verification
          const dummyPayId = `pay_sandbox_${Math.floor(100000 + Math.random() * 900000)}`;
          await apiService.verifyPayment({
            order_id: orderId,
            razorpay_order_id: rzpOrder.razorpay_order_id,
            razorpay_payment_id: dummyPayId,
            razorpay_signature: `sb_sandbox_sig_${rzpOrder.razorpay_order_id}`
          });
          setSubmitting(false);
          trackMarketingEvent('ORDER_COMPLETED', { orderId });
          setSubmittedOrder({
            orderNum: generatedOrderNum,
            orderId,
            isPaid: true,
            paymentId: dummyPayId
          });
        }
      } else {
        // WhatsApp route
        const waUrl = generateWhatsAppOrderUrl({
          customerName: customerName.trim(),
          businessName: businessName.trim(),
          phoneNumber: phoneNumber.trim(),
          city: city.trim(),
          deliveryAddress: deliveryAddress.trim(),
          notes: notes.trim(),
          isWholesale: isWholesaleMode,
          items: items,
          totalAmount,
          totalWeightKg,
          storeWhatsAppNumber: initialBusinessSettings.whatsapp_number
        });

        setSubmitting(false);
        trackMarketingEvent('WHATSAPP_ENQUIRY', { orderId });
        setSubmittedOrder({ orderNum: generatedOrderNum, orderId, waUrl, isPaid: false });
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      setSubmitting(false);
      setFormError(err.message || 'Order submission error. Please try again or message via WhatsApp.');
    }
  };

  const handleFinishAndClear = () => {
    clearCart();
    setSubmittedOrder(null);
    onClose();
  };

  const handleFinishKeepCart = () => {
    setSubmittedOrder(null);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="checkout-title"
      className="p-0 rounded-3xl bg-white shadow-2xl border border-gold/30 text-cocoa max-w-lg w-[92vw] overflow-hidden m-auto backdrop:bg-imperial-dark/80 backdrop:backdrop-blur-sm"
    >
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-imperial-dark via-imperial to-imperial-secondary text-white p-5 border-b border-gold/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
            {submittedOrder?.isPaid ? <CreditCard className="w-5 h-5 text-gold" /> : <WhatsAppIcon className="w-5 h-5 text-gold" />}
          </div>
          <div>
            <h2 id="checkout-title" className="font-serif font-bold text-lg text-gold">
              {submittedOrder?.isPaid ? 'Payment Confirmed' : submittedOrder ? 'Order Recorded' : 'Secure Order Checkout'}
            </h2>
            <p className="text-xs text-white/70">Sri Balaji Special Mixtures • Paralakhemundi</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Confirmation View */}
      {submittedOrder ? (
        <div className="p-6 text-center space-y-5 animate-fadeIn">
          <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border ${
            submittedOrder.isPaid 
              ? 'bg-emerald-50 border-emerald-500/40 text-emerald-600'
              : 'bg-gold/15 border-gold/40 text-gold'
          }`}>
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Your Order Reference</span>
            <div className="text-2xl font-mono font-bold text-imperial mt-1">
              {submittedOrder.orderNum}
            </div>
            {submittedOrder.isPaid && (
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                ✓ Online Payment Verified ({submittedOrder.paymentId})
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-gold/30 rounded-2xl p-4 text-left text-xs space-y-2 text-cocoa/90">
            <div className="font-bold text-imperial flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-gold shrink-0" />
              <span>Next Steps & Delivery Fulfillment:</span>
            </div>
            <p className="leading-relaxed">
              {submittedOrder.isPaid
                ? 'Your payment has been received and verified. Our master confectioners in Paralakhemundi are packing your fresh mixture order.'
                : 'Order enquiry submitted. Please confirm terms and availability with Sri Balaji management on WhatsApp.'}
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              to={`/track/${submittedOrder.orderNum}`}
              onClick={handleFinishAndClear}
              className="w-full py-3 rounded-xl bg-imperial hover:bg-imperial-secondary text-gold font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Truck className="w-4 h-4" /> Track Order Progress
            </Link>

            {submittedOrder.waUrl && (
              <a
                href={submittedOrder.waUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" /> Re-open WhatsApp Chat
              </a>
            )}

            <button
              type="button"
              onClick={handleFinishAndClear}
              className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-xs transition-colors cursor-pointer"
            >
              Clear Bag & Done
            </button>
          </div>
        </div>
      ) : (
        /* Checkout Form */
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Customer info header if logged in */}
          {customer ? (
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-imperial font-semibold">
                <User className="w-4 h-4 text-gold" />
                <span>Signed in as <strong>{customer.full_name}</strong> (+91 {customer.phone_number})</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">Verified</span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 border border-gold/30 text-xs flex items-center justify-between text-cocoa">
              <span>Checking out as Guest.</span>
              <Link to="/account" onClick={onClose} className="text-imperial font-bold underline hover:text-gold">
                Sign In for Saved Addresses →
              </Link>
            </div>
          )}

          {/* Saved Addresses dropdown if logged in and addresses exist */}
          {customer && addresses.length > 0 && (
            <div>
              <label className="text-xs font-bold text-cocoa block mb-1">Select Delivery Location</label>
              <select
                value={selectedAddressId}
                onChange={(e) => handleAddressSelect(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-cocoa focus:outline-none focus:border-gold"
              >
                <option value="custom">-- Enter a different address --</option>
                {addresses.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.label} ({a.recipient_name} - {a.address_line}, {a.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Fulfillment Type Toggle */}
          <div className="flex rounded-xl bg-gray-100 p-1 border border-gray-200">
            <button
              type="button"
              onClick={() => setFulfillmentType('DELIVERY')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                fulfillmentType === 'DELIVERY' ? 'bg-imperial text-gold shadow' : 'text-gray-600'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Home Delivery
            </button>
            <button
              type="button"
              onClick={() => setFulfillmentType('PICKUP')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                fulfillmentType === 'PICKUP' ? 'bg-imperial text-gold shadow' : 'text-gray-600'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" /> Counter Pickup (Store)
            </button>
          </div>

          {/* Payment Method Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-cocoa block">Payment Preference *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentChoice('ONLINE')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  paymentChoice === 'ONLINE'
                    ? 'border-gold bg-amber-50/60 ring-2 ring-gold/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 text-imperial font-bold text-xs mb-1">
                  <CreditCard className="w-4 h-4 text-gold" /> Pay Online
                </div>
                <div className="text-[11px] text-gray-500">
                  Instant UPI (GPay, PhonePe), Cards & NetBanking
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentChoice('WHATSAPP')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  paymentChoice === 'WHATSAPP'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" /> WhatsApp Enquiry
                </div>
                <div className="text-[11px] text-gray-500">
                  Direct confirmation & offline payment on dispatch
                </div>
              </button>
            </div>
          </div>

          {/* Form error */}
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Customer Inputs */}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-cocoa block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patnaik"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 focus:border-gold rounded-xl px-3 py-2 text-cocoa focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-cocoa block mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="98617 89602"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 focus:border-gold rounded-xl px-3 py-2 text-cocoa font-mono focus:outline-none"
                />
              </div>
            </div>

            {isWholesaleMode && (
              <div>
                <label className="font-semibold text-cocoa block mb-1">Business / Firm Name</label>
                <input
                  type="text"
                  placeholder="e.g. Balaji Traders, Kirana Store"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 focus:border-gold rounded-xl px-3 py-2 text-cocoa focus:outline-none"
                />
              </div>
            )}

            {fulfillmentType === 'DELIVERY' && (
              <>
                <div>
                  <label className="font-semibold text-cocoa block mb-1">Delivery Street Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Shop No, Street, Landmark"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 focus:border-gold rounded-xl px-3 py-2 text-cocoa focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-cocoa block mb-1">City / Town *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 focus:border-gold rounded-xl px-3 py-2 text-cocoa focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-cocoa block mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 focus:border-gold rounded-xl px-3 py-2 text-cocoa font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="font-semibold text-cocoa block mb-1">Order Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Deliver between 3-5 PM, extra crispy"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 focus:border-gold rounded-xl px-3 py-2 text-cocoa focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-2xl bg-warm-ivory border border-gold/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 block">Total Estimated Amount</span>
              <span className="text-xs text-emerald-800 font-semibold">{totalWeightKg} kg • {items.length} items</span>
            </div>
            <div className="text-2xl font-serif font-bold text-imperial">
              Rs. {totalAmount}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
              paymentChoice === 'ONLINE'
                ? 'bg-gradient-to-r from-imperial-dark via-imperial to-imperial-secondary text-gold hover:text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {submitting ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : paymentChoice === 'ONLINE' ? (
              <>
                <Lock className="w-4 h-4 text-gold" />
                <span>Pay Rs. {totalAmount} Online (Razorpay)</span>
              </>
            ) : (
              <>
                <WhatsAppIcon className="w-4 h-4" />
                <span>Send Enquiry via WhatsApp</span>
              </>
            )}
          </button>
        </form>
      )}
    </dialog>
  );
};
