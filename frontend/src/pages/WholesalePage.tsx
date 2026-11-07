import React, { useState } from 'react';
import { 
  Store, 
  Truck, 
  ShieldCheck, 
  Send,
  Building2,
  PackageCheck,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { initialBusinessSettings } from '../data/initialData';

export const WholesalePage: React.FC = () => {
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
          <Store className="w-4 h-4 text-amber-700" />
          <span>B2B Wholesale &amp; Bulk Distribution • 30 Years Heritage</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-crimson-900 tracking-tight">
          Partner with Sri Balaji for Factory-Direct Savouries
        </h1>
        <p className="text-sm sm:text-base text-spice-muted leading-relaxed">
          Supplying grocery stores, retail kiranas, supermarkets, event caterers, and distribution houses with authentic fresh mixtures and chips from Paralakhemundi, Odisha.
        </p>
      </div>

      {/* 4 Pillars of Wholesale Advantage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-xl bg-crimson-50 text-crimson-800 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-spice-dark">High Retail Margins</h3>
          <p className="text-xs text-spice-muted leading-relaxed">
            Direct manufacturer wholesale rates allow Kirana stores and distributors in Odisha to maximize profit margins while retaining repeat customer trust.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-spice-dark">Flexible Packaging</h3>
          <p className="text-xs text-spice-muted leading-relaxed">
            Supplied in retail packets (100g, 250g, 500g, 1kg) or bulk cartons (5kg, 10kg) suited for counter display or loose weight sales.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-spice-dark">30 Years Batch Consistency</h3>
          <p className="text-xs text-spice-muted leading-relaxed">
            Time-tested recipes by Adari Krishna Rao ensuring consistent crispness, oil quality, and authentic taste in every batch.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-spice-dark">Reliable Road Dispatch</h3>
          <p className="text-xs text-spice-muted leading-relaxed">
            Dispatches across Gajapati, Odisha and regional road transport networks with heavy transit cartons.
          </p>
        </div>

      </div>

      {/* Wholesale Enquiry Form & Contact Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Wholesale Enquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-cream-border shadow-soft space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-spice-dark">
              Request Wholesale Quotation &amp; Samples
            </h2>
            <p className="text-xs sm:text-sm text-spice-muted mt-1">
              Submit your shop requirements below. Our wholesale desk in Paralakhemundi will share the latest rate card and MOQ terms.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-display font-bold text-lg text-emerald-900">Enquiry Forwarded!</h3>
              <p className="text-xs text-emerald-700">
                Your enquiry was prepared for WhatsApp dispatch. If the chat window did not open, click the button below:
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-spice-dark mb-1">
                    Contact Person Name <span className="text-crimson-700">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="e.g. Ramesh Sahoo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-spice-dark mb-1">
                    Store / Firm Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Sahoo Kirana Store"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-spice-dark mb-1">
                    Phone / WhatsApp Number <span className="text-crimson-700">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9437135342"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-spice-dark mb-1">
                    City / Town <span className="text-crimson-700">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Paralakhemundi / Berhampur"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-spice-dark mb-1">
                  Expected Monthly Requirement
                </label>
                <select
                  value={formData.monthlyVolume}
                  onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                >
                  <option value="25kg - 50kg (Trial Order)">25kg - 50kg (Trial Order)</option>
                  <option value="50kg - 100kg">50kg - 100kg</option>
                  <option value="100kg - 300kg">100kg - 300kg</option>
                  <option value="300kg - 500kg">300kg - 500kg</option>
                  <option value="500kg+ Bulk Distributor Tier">500kg+ Bulk Distributor Tier</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-spice-dark mb-1">
                  Specific Snack Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Inquiring for Sri Balaji Special Mixture & Salted Chips in 250g packets"
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm font-bold flex items-center justify-center gap-2 shadow-elevated transition-all"
              >
                <Send className="w-4 h-4 text-gold-300" />
                <span>Submit Wholesale Request via WhatsApp</span>
              </button>
            </form>
          )}

        </div>

        {/* Right: Quick Direct Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-cream-surface border-2 border-cream-border shadow-soft space-y-5">
            <h3 className="font-display font-bold text-xl text-spice-dark">
              Direct Wholesale Desk
            </h3>
            
            <p className="text-xs text-spice-muted leading-relaxed">
              Connect directly with Adari Krishna Rao &amp; Adari Dilleshwar Rao for wholesale inquiries, volume pricing, and sample packets.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <a
                href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I am a retailer looking for wholesale snack supply.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold transition-all shadow-sm"
              >
                <WhatsAppIcon className="w-5 h-5 shrink-0 text-white" variant="white" />
                <div className="text-left">
                  <span className="block text-xs font-bold">WhatsApp Hotline: 9861789602</span>
                  <span className="block text-[11px] font-normal text-emerald-100">Instant quotation support</span>
                </div>
              </a>

              <a
                href="tel:9437135342"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-cream-border hover:bg-cream-warm text-spice font-bold transition-all shadow-sm"
              >
                <Phone className="w-5 h-5 text-crimson-800 shrink-0" />
                <div className="text-left">
                  <span className="block text-xs">Primary Call: +91 94371 35342</span>
                  <span className="block text-[11px] font-normal text-spice-muted">Alternate: +91 77353 33542</span>
                </div>
              </a>

              {initialBusinessSettings.instagram_url && (
                <a
                  href={initialBusinessSettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-cream-border hover:bg-cream-warm text-spice font-bold transition-all shadow-sm"
                >
                  <InstagramIcon className="w-5 h-5 text-pink-700 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs">Instagram: @sri_balaji_special_mixtures</span>
                    <span className="block text-[11px] font-normal text-spice-muted">Follow our official page</span>
                  </div>
                </a>
              )}
            </div>

            <div className="p-4 rounded-xl bg-white border border-cream-border space-y-2 text-xs">
              <span className="font-bold text-spice-dark block">Location:</span>
              <p className="text-[11px] text-spice-muted leading-relaxed">
                Gandhi School Road, Near Post Office, Paralakhemundi, Gajapati, Odisha - 761200
              </p>
            </div>

            {/* Authentic Wholesale Store Counter Photo */}
            <div className="rounded-2xl overflow-hidden border border-cream-border shadow-soft bg-white">
              <img
                src="/images/brand/wholesale-counter.png"
                alt="Sri Balaji Wholesale Store Counter with Founders"
                className="w-full h-auto object-cover"
              />
              <div className="p-3 bg-white text-center">
                <span className="text-[11px] font-bold text-crimson-900 block">
                  Wholesale Counter &amp; Direct Supplies
                </span>
                <span className="text-[10px] text-spice-muted">
                  Fresh transparent wholesale packets ready for dispatch
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
