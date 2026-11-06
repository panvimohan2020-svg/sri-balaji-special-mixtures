import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { initialBusinessSettings } from '../data/initialData';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'Wholesale Snack Supply Inquiry',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryText = `👋 *MESSAGE FROM SRI BALAJI WEBSITE*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 *Name:* ${formData.name}\n📱 *Phone:* ${formData.phone}\n📌 *Subject:* ${formData.subject}\n💬 *Message:* ${formData.message}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    const url = `https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent(queryText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
          30 Years of Tradition • Paralakhemundi, Odisha
        </span>
        <h1 className="font-display font-extrabold text-4xl text-crimson-900 tracking-tight">
          Contact Sri Balaji
        </h1>
        <p className="text-sm text-spice-muted leading-relaxed">
          Reach our wholesale desk for bulk trade orders, retail kirana supplies, festive bundles, or product inquiries.
        </p>
      </div>

      {/* Grid: Contact Cards + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Address */}
          <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-crimson-100 text-crimson-800 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-spice-dark">Business Address</h3>
                <p className="text-xs text-spice-muted leading-relaxed">
                  {initialBusinessSettings.address},<br />
                  {initialBusinessSettings.city}, Gajapati, {initialBusinessSettings.state}, India - {initialBusinessSettings.pin_code}
                </p>
                <a
                  href={initialBusinessSettings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-crimson-800 font-bold hover:underline pt-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-spice-dark">Direct Phone Calling</h3>
                <p className="text-xs text-spice-muted">
                  Primary Line: <a href="tel:9437135342" className="font-bold text-spice-dark hover:underline">+91 94371 35342</a>
                </p>
                <p className="text-xs text-spice-muted">
                  Alternate Line: <a href="tel:7735333542" className="font-bold text-spice-dark hover:underline">+91 77353 33542</a>
                </p>
                <p className="text-[11px] text-brand-700 font-medium pt-1">
                  Adari Krishna Rao &amp; Adari Dilleshwar Rao
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct */}
          <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-spice-dark">WhatsApp Ordering Hotline</h3>
                <p className="text-xs text-spice-muted">
                  WhatsApp Number: <strong className="text-emerald-700">+91 98617 89602</strong>
                </p>
                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to place an order for snacks.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs mt-1 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Instagram */}
          {initialBusinessSettings.instagram_url && (
            <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-700 to-pink-600 text-white flex items-center justify-center shrink-0">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base text-spice-dark">Official Instagram</h3>
                  <p className="text-xs text-spice-muted">
                    Watch fresh frying videos and product updates:
                  </p>
                  <a
                    href={initialBusinessSettings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-pink-700 font-bold hover:underline pt-1"
                  >
                    <span>@sri_balaji_special_mixtures</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-cream-border shadow-soft space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-spice-dark">
              Send an Instant Enquiry
            </h2>
            <p className="text-xs sm:text-sm text-spice-muted mt-1">
              Connect directly with Adari Krishna Rao &amp; Adari Dilleshwar Rao for wholesale quotes, distribution rates, or feedback.
            </p>
          </div>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-display font-bold text-lg text-emerald-900">Enquiry Forwarded!</h3>
              <p className="text-xs text-emerald-700">
                Your message has been formatted for WhatsApp dispatch. If the window did not open automatically, click below:
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-spice-dark mb-1">
                    Your Name <span className="text-crimson-700">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anand Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-spice-dark mb-1">
                    Phone Number <span className="text-crimson-700">*</span>
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
              </div>

              <div>
                <label className="block font-bold text-spice-dark mb-1">
                  Inquiry Purpose
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                >
                  <option value="Wholesale Snack Supply Inquiry">Wholesale Regular Snack Supply (Kirana / Supermarket)</option>
                  <option value="Bulk Order for Event / Function">Bulk Order for Wedding / Festival / Function</option>
                  <option value="Regional Distributor Inquiry">Regional Distributor / Agency Inquiry</option>
                  <option value="General Product & Price Inquiry">General Product &amp; Price Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-spice-dark mb-1">
                  Message Details <span className="text-crimson-700">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please state your requirements (e.g. 50kg special mixture, packet sizes, delivery location)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm font-bold flex items-center justify-center gap-2 shadow-elevated transition-all"
              >
                <Send className="w-4 h-4 text-gold-300" />
                <span>Submit Inquiry via WhatsApp</span>
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Embedded Location Map for Paralakhemundi, Gajapati, Odisha */}
      <div className="rounded-3xl overflow-hidden border-2 border-cream-border shadow-soft bg-cream-surface p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-bold text-xl text-spice-dark">
              Location: Paralakhemundi, Gajapati, Odisha
            </h3>
            <p className="text-xs text-spice-muted">
              {initialBusinessSettings.address}, {initialBusinessSettings.city}, Odisha - {initialBusinessSettings.pin_code}
            </p>
          </div>
          <a
            href={initialBusinessSettings.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-cream-border text-xs font-bold text-crimson-800 hover:bg-cream-warm shadow-sm"
          >
            <MapPin className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </a>
        </div>

        <div className="w-full h-72 sm:h-96 rounded-2xl bg-stone-200 overflow-hidden relative flex items-center justify-center border border-cream-border">
          <iframe
            title="Sri Balaji Location Paralakhemundi"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15250.395166927976!2d84.09545415!3d18.7758334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3c9bb2228bb5b7%3A0xb690b230f37964c0!2sParalakhemundi%2C%20Odisha%20761200!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

    </div>
  );
};
