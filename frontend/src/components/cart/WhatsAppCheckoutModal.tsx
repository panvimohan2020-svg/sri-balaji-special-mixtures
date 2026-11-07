import React, { useRef, useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { useCartStore } from '../../store/useCartStore';
import { initialBusinessSettings } from '../../data/initialData';
import { generateWhatsAppOrderUrl } from '../../utils/whatsapp';
import { apiService } from '../../services/api';

interface WhatsAppCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppCheckoutModal: React.FC<WhatsAppCheckoutModalProps> = ({
  isOpen,
  onClose
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const { items, getTotalAmount, getTotalWeightKg, isWholesaleMode, clearCart } = useCartStore();
  const totalAmount = getTotalAmount();
  const totalWeightKg = getTotalWeightKg();

  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill customer details from past session if available
  useEffect(() => {
    const savedCustomer = localStorage.getItem('sri_balaji_last_customer');
    if (savedCustomer) {
      try {
        const parsed = JSON.parse(savedCustomer);
        if (parsed.customerName) setCustomerName(parsed.customerName);
        if (parsed.businessName) setBusinessName(parsed.businessName);
        if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
        if (parsed.city) setCity(parsed.city);
        if (parsed.deliveryAddress) setDeliveryAddress(parsed.deliveryAddress);
      } catch {
        // Ignore parse error
      }
    }
  }, []);

  // Handle native dialog showModal / close according to modern-web-guidance
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phoneNumber.trim() || !city.trim()) {
      setFormError('Please enter your name, phone number, and delivery city.');
      return;
    }

    setFormError('');
    setSubmitting(true);

    // Save customer details for frictionless repeat ordering
    localStorage.setItem(
      'sri_balaji_last_customer',
      JSON.stringify({ customerName, businessName, phoneNumber, city, deliveryAddress })
    );

    // Prepare order payload
    const orderPayload = {
      customer_name: customerName.trim(),
      business_name: isWholesaleMode ? businessName.trim() : undefined,
      phone_number: phoneNumber.trim(),
      whatsapp_number: phoneNumber.trim(),
      order_type: isWholesaleMode ? 'WHOLESALE' : 'RETAIL',
      delivery_address: deliveryAddress.trim() || undefined,
      city: city.trim(),
      notes: notes.trim() || undefined,
      total_estimated_amount: totalAmount,
      total_estimated_weight_kg: totalWeightKg,
      items: items.map(item => ({
        product_name: item.productName,
        weight_label: item.weightLabel,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.unitPrice * item.quantity
      }))
    };

    let generatedOrderNum = `SB-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Attempt background logging to API if backend available
      const apiResult = await apiService.submitOrder(orderPayload as any);
      if (apiResult && apiResult.order_number) {
        generatedOrderNum = apiResult.order_number;
      }
    } catch {
      // Graceful offline fallback: continue to WhatsApp with client order code
    }

    // Persist order in local history for rapid 1-click reordering
    try {
      const pastOrders = JSON.parse(localStorage.getItem('sri_balaji_order_history') || '[]');
      const newHistoryEntry = {
        orderNumber: generatedOrderNum,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        totalAmount,
        totalWeightKg,
        isWholesale: isWholesaleMode,
        items: items.map(i => ({
          productName: i.productName,
          weightLabel: i.weightLabel,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        }))
      };
      localStorage.setItem(
        'sri_balaji_order_history',
        JSON.stringify([newHistoryEntry, ...pastOrders.slice(0, 9)])
      );
    } catch {
      // Ignore local storage error
    }

    // Construct WhatsApp message with formatted order details
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
    clearCart();
    onClose();

    // Direct user to official WhatsApp chat
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="checkout-title"
      className="p-0 rounded-3xl bg-white shadow-elevated border border-ivory-border text-cocoa max-w-lg w-[92vw] overflow-hidden m-auto backdrop:bg-plum-950/70 backdrop:backdrop-blur-sm"
    >
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-plum-900 to-plum-950 text-ivory p-5 flex items-center justify-between border-b border-plum-800">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-turmeric block">
            {isWholesaleMode ? 'Wholesale Quotation Request' : 'Direct Order Dispatch'}
          </span>
          <h2 id="checkout-title" className="font-display font-bold text-xl text-white">
            Complete WhatsApp Order
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        
        {/* Order Summary Snapshot */}
        <div className="p-3.5 rounded-2xl bg-ivory-warm border border-ivory-border flex items-center justify-between text-xs">
          <div>
            <span className="text-cocoa-muted block">Estimated Total</span>
            <strong className="text-base text-plum-900 font-display">
              ₹{totalAmount.toLocaleString('en-IN')}
            </strong>
          </div>
          <div className="text-right">
            <span className="text-cocoa-muted block">Weight / Items</span>
            <span className="font-bold text-plum-900">
              {totalWeightKg} kg • {items.reduce((s, i) => s + i.quantity, 0)} pkgs
            </span>
          </div>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-chilli-50 border border-chilli-200 text-chilli-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-plum-900 mb-1" htmlFor="cust-name">
              Full Name <span className="text-chilli">*</span>
            </label>
            <input
              id="cust-name"
              type="text"
              required
              autoFocus
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border focus:border-chilli focus:ring-1 focus:ring-chilli outline-none bg-ivory-warm/40 text-cocoa"
            />
          </div>

          {isWholesaleMode && (
            <div>
              <label className="block font-bold text-plum-900 mb-1" htmlFor="biz-name">
                Shop / Kirana / Business Name (Optional)
              </label>
              <input
                id="biz-name"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Sri Venkateshwara Traders"
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border focus:border-chilli focus:ring-1 focus:ring-chilli outline-none bg-ivory-warm/40 text-cocoa"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-plum-900 mb-1" htmlFor="phone-num">
                Phone Number <span className="text-chilli">*</span>
              </label>
              <input
                id="phone-num"
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border focus:border-chilli focus:ring-1 focus:ring-chilli outline-none bg-ivory-warm/40 text-cocoa"
              />
            </div>

            <div>
              <label className="block font-bold text-plum-900 mb-1" htmlFor="city-name">
                Delivery City / Town <span className="text-chilli">*</span>
              </label>
              <input
                id="city-name"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Paralakhemundi / Berhampur"
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border focus:border-chilli focus:ring-1 focus:ring-chilli outline-none bg-ivory-warm/40 text-cocoa"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-plum-900 mb-1" htmlFor="delivery-addr">
              Complete Delivery Address (Optional)
            </label>
            <input
              id="delivery-addr"
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Shop No., Street, Landmark, PIN code"
              className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border focus:border-chilli focus:ring-1 focus:ring-chilli outline-none bg-ivory-warm/40 text-cocoa"
            />
          </div>

          <div>
            <label className="block font-bold text-plum-900 mb-1" htmlFor="order-notes">
              Special Transport Instructions / Notes
            </label>
            <textarea
              id="order-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Need dispatch by Friday; prefer lorry transport"
              className="w-full px-3.5 py-2 rounded-xl border border-ivory-border focus:border-chilli focus:ring-1 focus:ring-chilli outline-none bg-ivory-warm/40 text-cocoa resize-none"
            />
          </div>
        </div>

        {/* Notice regarding order confirmation */}
        <p className="text-[11px] text-cocoa-muted leading-relaxed">
          ⚡ Clicking submit will open your WhatsApp application with an itemized, pre-calculated message sent to Sri Balaji management (+91 98617 89602).
        </p>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-cocoa hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" variant="white" />
            <span>Send to WhatsApp</span>
          </button>
        </div>

      </form>
    </dialog>
  );
};
