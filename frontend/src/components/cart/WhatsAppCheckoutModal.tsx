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

    // 1. Submit to Backend API (async, non-blocking)
    try {
      const orderResult = await apiService.submitOrder(orderPayload);
      
      // Save to local past orders list for Quick Reorder feature
      const existingHistory = JSON.parse(localStorage.getItem('sri_balaji_order_history') || '[]');
      const newEntry = {
        orderNumber: orderResult?.order_number || `SB-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [...items],
        totalAmount,
        totalWeightKg,
        isWholesale: isWholesaleMode
      };
      localStorage.setItem('sri_balaji_order_history', JSON.stringify([newEntry, ...existingHistory.slice(0, 9)]));
    } catch {
      // Offline fallback
    }

    // 2. Generate WhatsApp URL
    const whatsappUrl = generateWhatsAppOrderUrl({
      customerName,
      businessName: isWholesaleMode ? businessName : undefined,
      phoneNumber,
      deliveryAddress,
      city,
      notes,
      items,
      totalAmount,
      totalWeightKg,
      isWholesale: isWholesaleMode,
      storeWhatsAppNumber: initialBusinessSettings.whatsapp_number
    });

    // 3. Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setSubmitting(false);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="checkout-dialog-title"
      className="p-0 rounded-3xl bg-white shadow-elevated border-2 border-gold-400/40 text-spice max-w-lg w-[92vw] sm:w-full overflow-hidden m-auto backdrop:bg-spice-dark/70 backdrop:backdrop-blur-sm"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-crimson-800 to-crimson-900 text-cream-warm p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center shadow-xs">
            <WhatsAppIcon className="w-5 h-5 text-white" variant="white" />
          </div>
          <div>
            <h2 id="checkout-dialog-title" className="font-display font-bold text-lg text-white">
              {isWholesaleMode ? 'Submit Wholesale Enquiry' : 'Place WhatsApp Order'}
            </h2>
            <p className="text-xs text-gold-200">
              Direct connection with Sri Balaji manufacturing
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-cream-surface/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
        
        {/* Order Summary Snapshot */}
        <div className="p-3.5 rounded-xl bg-cream-surface border border-cream-border flex items-center justify-between text-xs sm:text-sm">
          <div>
            <span className="font-semibold text-spice-dark block">
              {items.length} snacks ({totalWeightKg} kg total)
            </span>
            <span className="text-[11px] text-brand-700 font-medium">
              {isWholesaleMode ? 'Wholesale Pricing Applied' : 'Retail Order'}
            </span>
          </div>
          <div className="text-right">
            <span className="font-display font-extrabold text-base text-crimson-900 block">
              ₹{totalAmount.toLocaleString('en-IN')}*
            </span>
            <span className="text-[10px] text-spice-muted">Estimated amount</span>
          </div>
        </div>

        {formError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-spice-dark mb-1" htmlFor="cust-name">
              Full Name <span className="text-crimson-700">*</span>
            </label>
            <input
              id="cust-name"
              type="text"
              required
              autoFocus
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border focus:border-crimson-700 focus:ring-1 focus:ring-crimson-700 outline-none bg-cream-warm/40 text-spice"
            />
          </div>

          {isWholesaleMode && (
            <div>
              <label className="block font-bold text-spice-dark mb-1" htmlFor="biz-name">
                Shop / Kirana / Business Name (Optional)
              </label>
              <input
                id="biz-name"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Sri Venkateshwara Traders"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border focus:border-crimson-700 focus:ring-1 focus:ring-crimson-700 outline-none bg-cream-warm/40 text-spice"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-spice-dark mb-1" htmlFor="phone-num">
                Phone Number <span className="text-crimson-700">*</span>
              </label>
              <input
                id="phone-num"
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border focus:border-crimson-700 focus:ring-1 focus:ring-crimson-700 outline-none bg-cream-warm/40 text-spice"
              />
            </div>

            <div>
              <label className="block font-bold text-spice-dark mb-1" htmlFor="city-name">
                Delivery City / Town <span className="text-crimson-700">*</span>
              </label>
              <input
                id="city-name"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Hyderabad / Warangal"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border focus:border-crimson-700 focus:ring-1 focus:ring-crimson-700 outline-none bg-cream-warm/40 text-spice"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-spice-dark mb-1" htmlFor="delivery-addr">
              Complete Delivery Address (Optional)
            </label>
            <input
              id="delivery-addr"
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Shop No., Street, Landmark, PIN code"
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border focus:border-crimson-700 focus:ring-1 focus:ring-crimson-700 outline-none bg-cream-warm/40 text-spice"
            />
          </div>

          <div>
            <label className="block font-bold text-spice-dark mb-1" htmlFor="order-notes">
              Special Transport Instructions / Notes
            </label>
            <textarea
              id="order-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Need dispatch by Friday; prefer lorry transport"
              className="w-full px-3.5 py-2 rounded-xl border border-cream-border focus:border-crimson-700 focus:ring-1 focus:ring-crimson-700 outline-none bg-cream-warm/40 text-spice resize-none"
            />
          </div>
        </div>

        {/* Notice regarding order confirmation */}
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
          <strong>Important Note:</strong> Clicking below records your request and generates a structured quotation on WhatsApp. The order is confirmed only after stock and delivery verification with Sri Balaji.
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-cream-border text-spice font-semibold hover:bg-cream-surface transition-colors text-xs sm:text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold transition-all shadow-md text-xs sm:text-sm disabled:opacity-50"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" variant="white" />
            <span>{submitting ? 'Preparing Quotation...' : 'Send Enquiry to WhatsApp'}</span>
          </button>
        </div>

      </form>
    </dialog>
  );
};
