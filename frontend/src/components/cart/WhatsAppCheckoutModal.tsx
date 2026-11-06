import React, { useRef, useEffect, useState } from 'react';
import { MessageCircle, X, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { initialBusinessSettings } from '../../data/initialData';
import { generateWhatsAppOrderUrl } from '../../utils/whatsapp';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phoneNumber.trim() || !city.trim()) {
      setFormError('Please enter your name, phone number, and delivery city.');
      return;
    }

    setFormError('');

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

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Close modal
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="checkout-dialog-title"
      className="p-0 rounded-2xl bg-white shadow-elevated border border-cream-border text-spice max-w-lg w-[92vw] sm:w-full overflow-hidden m-auto"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-crimson-800 to-crimson-900 text-cream-warm p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-gold-300" />
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
          <strong>Important Note:</strong> Clicking below generates a structured quotation on WhatsApp. The order is finalized only after stock and transport confirmation with Sri Balaji.
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-md text-xs sm:text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Enquiry to WhatsApp</span>
          </button>
        </div>

      </form>
    </dialog>
  );
};

