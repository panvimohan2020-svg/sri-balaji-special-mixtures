import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  Truck, 
  ShieldCheck, 
  Send,
  Building2,
  PackageCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
  Sparkles,
  Search,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { WholesaleBrochureModal } from '../components/common/WholesaleBrochureModal';
import { initialBusinessSettings, initialProducts } from '../data/initialData';
import { useCartStore } from '../store/useCartStore';
import { useTranslation } from '../store/useLanguageStore';
import { apiService, PincodeCheckResult } from '../services/api';
import { RegionalDeliveryCoverage } from '../components/logistics/RegionalDeliveryCoverage';

export const WholesalePage: React.FC = () => {
  const { t } = useTranslation();
  const { isWholesaleMode, toggleWholesaleMode } = useCartStore();

  const [formData, setFormData] = useState({
    contactName: '',
    businessName: '',
    phone: '',
    city: 'Paralakhemundi',
    state: 'Odisha',
    monthlyVolume: '50kg - 100kg',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  // Regional Pincode Serviceability Check
  const [checkPin, setCheckPin] = useState('');
  const [pinResult, setPinResult] = useState<PincodeCheckResult | null>(null);
  const [pinLoading, setPinLoading] = useState(false);
  const [pinSearched, setPinSearched] = useState(false);

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = checkPin.trim();
    if (cleanPin.length !== 6) return;
    setPinLoading(true);
    setPinSearched(true);
    try {
      const res = await apiService.checkPincodeServiceability(cleanPin);
      setPinResult(res);
    } catch {
      setPinResult({
        pincode: cleanPin,
        is_serviceable: false,
        min_delivery_days: 1,
        max_delivery_days: 3,
        standard_shipping_rate: 0,
        cod_available: false,
        message: 'Could not connect to serviceability network.'
      });
    } finally {
      setPinLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp Wholesale Enquiry
    const enquiryText = `🏪 *WHOLESALE B2B INQUIRY – SRI BALAJI*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 *Name:* ${formData.contactName}\n🏢 *Shop/Firm:* ${formData.businessName || 'N/A'}\n📱 *Phone:* ${formData.phone}\n📍 *Location:* ${formData.city}, ${formData.state}\n📦 *Expected Monthly Volume:* ${formData.monthlyVolume}\n📝 *Requirements:* ${formData.message || 'Please share wholesale rate catalog'}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    const url = `https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent(enquiryText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-light/40 text-imperial border border-gold/30 text-xs font-bold">
          <Store className="w-4 h-4 text-gold-deep" />
          <span>B2B Wholesale &amp; Bulk Distribution • 30 Years Heritage</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-imperial tracking-tight">
          {t('wholesale.title', 'Partner with Sri Balaji for Factory-Direct Savouries')}
        </h1>
        <p className="text-sm sm:text-base text-cocoa-muted leading-relaxed">
          {t('wholesale.subtitle', 'Supplying grocery stores, retail Kiranas, supermarkets, event caterers, and distribution houses with authentic fresh mixtures and chips from Paralakhemundi, Odisha.')}
        </p>

        {/* Wholesale Switcher Callout */}
        <div className="pt-2">
          <button
            type="button"
            onClick={toggleWholesaleMode}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border shadow-xs ${
              isWholesaleMode
                ? 'bg-imperial text-gold border-gold/40 shadow-royal font-black'
                : 'bg-white text-cocoa border-ivory-border hover:bg-cream'
            }`}
          >
            <Store className="w-4 h-4 text-gold-deep" />
            <span>Storewide Wholesale Mode: {isWholesaleMode ? 'ACTIVE (Showing Bulk Rates)' : 'INACTIVE (Click to Enable)'}</span>
          </button>
        </div>
      </div>

      {/* Dedicated B2B Portal VIP Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-imperial via-imperial-secondary to-[#190D2B] p-6 sm:p-8 border border-gold/40 shadow-royal">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official B2B Dealer Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Are you a Retailer, Supermarket or Distributor?
            </h2>
            <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed">
              Register as a verified wholesale dealer to unlock tier-based factory pricing, generate downloadable official quotations (<code className="text-gold">SB-QT-XXXX</code>), track road transport lorry receipts (LR), and place bulk orders with real-time weight calculators.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Link
              to="/dealer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-gold to-gold-rich hover:from-gold-light hover:to-gold text-imperial font-black text-xs uppercase tracking-wider transition-all shadow-gold active:scale-95 text-center"
            >
              <span>Access B2B Dealer Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-[11px] text-ivory/60 text-center">
              Requires 1-time business verification
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Wholesale Advantage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/30 text-gold-deep flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-imperial">High Retail Margins</h3>
          <p className="text-xs text-cocoa-muted leading-relaxed">
            Direct manufacturer wholesale rates allow Kirana stores and distributors in Odisha to maximize profit margins while retaining repeat customer trust.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/30 text-gold-deep flex items-center justify-center font-bold">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-imperial">Flexible Packaging</h3>
          <p className="text-xs text-cocoa-muted leading-relaxed">
            Supplied in retail packets (250g, 500g, 1kg) or commercial bulk cartons (3kg, 5kg, 10kg) suited for counter display or loose weight sales.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald/15 border border-emerald/30 text-emerald-deep flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-imperial">30 Years Consistency</h3>
          <p className="text-xs text-cocoa-muted leading-relaxed">
            Time-tested recipes by Adari Krishna Rao ensuring consistent crispness, oil quality, and authentic taste in every batch.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-imperial/10 border border-imperial/20 text-imperial flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-imperial">Reliable Road Dispatch</h3>
          <p className="text-xs text-cocoa-muted leading-relaxed">
            Prompt dispatches across Gajapati, Rayagada, Ganjam, and regional transit corridors in heavy corrugated transit cartons.
          </p>
        </div>

      </div>

      {/* Wholesale Rates & MOQ Table Preview */}
      <div className="rounded-3xl bg-white border border-ivory-border shadow-soft p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-gold-deep uppercase tracking-wider block">
              Wholesale Price Sheet
            </span>
            <h2 className="text-2xl font-display font-extrabold text-imperial">
              Retail vs Wholesale Price Comparison
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBrochureOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-imperial hover:bg-imperial-secondary text-gold font-bold text-xs uppercase tracking-wider transition-all border border-gold/40 shadow-royal cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Printable B2B Brochure</span>
            </button>
            <a
              href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20please%20send%20me%20your%20complete%20wholesale%20rate%20card`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold hover:bg-gold-rich text-imperial font-black text-xs uppercase tracking-wider transition-colors shadow-gold"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" variant="currentColor" />
              <span>WhatsApp Rate Card</span>
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ivory-border text-cocoa-muted uppercase font-bold text-[11px] bg-cream/50">
                <th className="p-3">Snack Variety</th>
                <th className="p-3">Package Weight</th>
                <th className="p-3">Standard Retail MRP</th>
                <th className="p-3">Wholesale Rate</th>
                <th className="p-3">Minimum Order (MOQ)</th>
                <th className="p-3 text-right">Margin Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-border">
              {initialProducts.filter(p => p.variants && p.variants.length > 0).map((p) => {
                const base = p.variants[0];
                const bulk = p.variants[p.variants.length - 1];
                const savings = base.retail_price && base.wholesale_price
                  ? Math.round(((base.retail_price - base.wholesale_price) / base.retail_price) * 100)
                  : 15;

                return (
                  <tr key={p.id} className="hover:bg-cream/30 transition-colors">
                    <td className="p-3 font-bold text-imperial">
                      {p.name}
                    </td>
                    <td className="p-3 text-cocoa font-semibold">
                      {base.weight_label}
                    </td>
                    <td className="p-3 text-stone-400 line-through">
                      ₹{base.retail_price}
                    </td>
                    <td className="p-3 font-display font-black text-sm text-imperial">
                      ₹{base.wholesale_price || base.retail_price}
                    </td>
                    <td className="p-3 font-semibold text-cocoa">
                      {p.minimum_order_qty} packets
                    </td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald/15 text-emerald-deep border border-emerald/30 font-bold text-[10px]">
                        Save {savings}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded Regional Road Transport & Delivery Serviceability Coverage System */}
      <RegionalDeliveryCoverage embedded={true} />


      {/* Wholesale Enquiry Form & Contact Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Wholesale Enquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-ivory-border shadow-soft space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-imperial">
              Request Wholesale Quotation &amp; Samples
            </h2>
            <p className="text-xs sm:text-sm text-cocoa-muted mt-1">
              Submit your shop requirements below. Our wholesale desk in Paralakhemundi will share the latest rate card and MOQ terms.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald/10 border border-emerald/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald mx-auto" />
              <h3 className="font-display font-bold text-lg text-imperial">Enquiry Forwarded!</h3>
              <p className="text-xs text-cocoa">
                Your enquiry was prepared for WhatsApp dispatch. If the chat window did not open, click the button below:
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-gold hover:bg-gold-rich text-imperial font-black rounded-xl text-xs shadow-gold"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-imperial mb-1">
                    Contact Person Name <span className="text-gold-deep">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="e.g. Ramesh Sahoo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-ivory focus:border-gold focus:ring-1 focus:ring-gold outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-imperial mb-1">
                    Store / Firm Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Sahoo Kirana Store"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-ivory focus:border-gold focus:ring-1 focus:ring-gold outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-imperial mb-1">
                    Phone / WhatsApp Number <span className="text-gold-deep">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9437135342"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-ivory focus:border-gold focus:ring-1 focus:ring-gold outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-imperial mb-1">
                    City / Town <span className="text-gold-deep">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Paralakhemundi / Berhampur"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-ivory focus:border-gold focus:ring-1 focus:ring-gold outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-imperial mb-1">
                  Expected Monthly Requirement
                </label>
                <select
                  value={formData.monthlyVolume}
                  onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-ivory focus:border-gold focus:ring-1 focus:ring-gold outline-none text-xs cursor-pointer"
                >
                  <option value="Trial Pack (10kg - 25kg)">Trial Pack (10kg - 25kg)</option>
                  <option value="50kg - 100kg">50kg - 100kg (Small Kirana Store)</option>
                  <option value="100kg - 300kg">100kg - 300kg (Supermarket / Distributor)</option>
                  <option value="500kg+">500kg+ (Regional Wholesale Dealer)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-imperial mb-1">
                  Specific Savouries &amp; Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Need price list for Onion Mixture 250g, Kar Kar Murrukulu 500g, and bulk cartons."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-ivory focus:border-gold focus:ring-1 focus:ring-gold outline-none text-xs resize-none"
                />
              </div>

              {/* Primary submit button: Saffron Gold with Deep Purple text */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-rich text-imperial font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-gold active:scale-95"
              >
                <WhatsAppIcon className="w-4 h-4 text-imperial" variant="currentColor" />
                <span>Submit Wholesale Inquiry via WhatsApp</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Direct Wholesale Hotline Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-imperial-dark via-imperial to-imperial-secondary text-ivory border border-gold/30 shadow-royal space-y-4">
            <h3 className="font-display font-extrabold text-xl text-white">
              Direct Wholesale Desk
            </h3>
            <p className="text-xs text-ivory/80 leading-relaxed">
              Prefer to speak directly with the owners? Call or message Adari Krishna Rao or Adari Dilleshwar Rao during business hours.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-gold/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gold uppercase font-bold block">Wholesale WhatsApp Desk</span>
                  <strong className="text-white font-mono text-sm">+91 98617 89602</strong>
                </div>
                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20I%20am%20calling%20regarding%20wholesale%20distribution`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-gold text-imperial font-black"
                  aria-label="Chat on WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" variant="currentColor" />
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-gold/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gold uppercase font-bold block">Direct Calling Line</span>
                  <strong className="text-white font-mono text-sm">+91 94371 35342 / +91 77353 33542</strong>
                </div>
                <a
                  href="tel:+919437135342"
                  className="p-2 rounded-xl bg-gold text-imperial font-black"
                  aria-label="Call phone"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-ivory/70 border-t border-white/10">
              📍 <strong>Dispatches from:</strong> Gandhi School Road, Near Post Office, Paralakhemundi, Gajapati, Odisha – 761200.
            </div>
          </div>
        </div>

      </div>

      {/* Official B2B Printable Brochure Modal */}
      <WholesaleBrochureModal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)} />

    </div>
  );
};
