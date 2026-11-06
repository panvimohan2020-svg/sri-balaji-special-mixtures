import React, { useState } from 'react';
import { 
  Store, 
  Truck, 
  ShieldCheck, 
  MessageCircle, 
  Layers, 
  CheckCircle2, 
  Send,
  Building2,
  PackageCheck
} from 'lucide-react';
import { initialBusinessSettings } from '../data/initialData';

export const WholesalePage: React.FC = () => {
  const [formData, setFormData] = useState({
    contactName: '',
    businessName: '',
    phone: '',
    email: '',
    city: '',
    state: '',
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
          <span>B2B Wholesale &amp; Bulk Distribution</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-crimson-900 tracking-tight">
          Partner with Sri Balaji for Factory-Direct Snacks
        </h1>
        <p className="text-sm sm:text-base text-spice-muted leading-relaxed">
          Supplying grocery stores, retail kiranas, supermarkets, corporate canteens, and distribution houses with authentic South Indian savouries, special mixtures, and potato wafers.
        </p>
      </div>

      {/* 4 Pillars of Wholesale Advantage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-xl bg-crimson-50 text-crimson-800 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-spice-dark">Competitive Margins</h3>
          <p className="text-xs text-spice-muted leading-relaxed">
            Direct-from-plant pricing allows retail vendors and distributors to maximize profit margins while delivering high customer value.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-spice-dark">Flexible Packaging</h3>
          <p className="text-xs text-spice-muted leading-relaxed">
            Supplied in retail pouches (100g, 250g, 500g, 1kg) or bulk sacks (5kg, 10kg) suited for counter display or loose weight sales.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-spice-dark">Fresh Batch Assurance</h3>
          <p className="text-xs text-spice-muted leading-relaxed">
            Fried only upon order scheduling. Zero old stock or stale inventory passing through your retail counters.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-spice-dark">Reliable Logistics</h3>
          <p className="text-xs text-spice-muted leading-relaxed">
            Daily dispatches via regional road transport networks across {initialBusinessSettings.wholesale_locations}.
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
              Submit your store requirements below. Our wholesale manager will respond with the latest price card and MOQ terms.
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
                    placeholder="e.g. Suresh Patel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-spice-dark mb-1">
                    Store / Firm / Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Patel Supermarket"
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
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-spice-dark mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. store@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-spice-dark mb-1">
                    City / Town <span className="text-crimson-700">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Hyderabad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-spice-dark mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Telangana"
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
                  Specific Snacks or Queries
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Interested in Madras Mixture and Potato Chips in 250g pouches; request sample consignment"
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm font-bold flex items-center justify-center gap-2 shadow-elevated transition-all"
              >
                <Send className="w-4 h-4 text-gold-300" />
                <span>Submit Wholesale Request</span>
              </button>
            </form>
          )}

        </div>

        {/* Right: Quick Direct Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-cream-surface border-2 border-cream-border shadow-soft space-y-5">
            <h3 className="font-display font-bold text-xl text-spice-dark">
              Wholesale Desk Helpline
            </h3>
            
            <p className="text-xs text-spice-muted leading-relaxed">
              Prefer speaking with our dispatch manager directly? We welcome shop owners and distribution agents for phone consultations and factory visits.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <a
                href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I am a retailer looking for wholesale snack supply.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-sm"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <span className="block text-xs">Chat on WhatsApp</span>
                  <span className="block text-[11px] font-normal text-emerald-100">Instant quotation support</span>
                </div>
              </a>

              <a
                href={`tel:${initialBusinessSettings.contact_number.replace(/\s+/g, '')}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-cream-border hover:bg-cream-warm text-spice font-bold transition-all shadow-sm"
              >
                <Building2 className="w-5 h-5 text-crimson-800 shrink-0" />
                <div className="text-left">
                  <span className="block text-xs">Direct Factory Line</span>
                  <span className="block text-[11px] font-normal text-spice-muted">{initialBusinessSettings.contact_number}</span>
                </div>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-white border border-cream-border space-y-2 text-xs">
              <span className="font-bold text-spice-dark block">Payment &amp; Credit Terms:</span>
              <p className="text-[11px] text-spice-muted leading-relaxed">
                Initial trial orders are dispatched against advance UPI or NEFT transfer. Repeat trade accounts can access scheduled weekly settlement terms upon trade verification.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

