import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Clock,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
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
        <span className="text-xs font-bold uppercase tracking-widest text-chilli block">
          30+ Years of Tradition • Paralakhemundi, Odisha
        </span>
        <h1 className="font-display font-extrabold text-4xl text-plum-900 tracking-tight">
          Contact Sri Balaji
        </h1>
        <p className="text-sm text-cocoa-muted leading-relaxed">
          Reach our wholesale desk for bulk trade orders, retail Kirana supplies, festive bundles, or product inquiries.
        </p>
      </div>

      {/* Grid: Contact Cards + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Address */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-peach-50 border border-peach-200 text-chilli flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-plum-900">Business &amp; Manufacturing Address</h3>
                <p className="text-xs text-cocoa-muted leading-relaxed">
                  {initialBusinessSettings.address},<br />
                  {initialBusinessSettings.city}, Gajapati, {initialBusinessSettings.state}, India – {initialBusinessSettings.pin_code}
                </p>
                <a
                  href={initialBusinessSettings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-chilli font-bold hover:underline pt-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pista-50 border border-pista-200 text-pista-800 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-plum-900">Direct Phone Calling</h3>
                <p className="text-xs text-cocoa">
                  Primary Line: <a href="tel:9437135342" className="font-bold text-plum-900 hover:text-chilli">+91 94371 35342</a>
                </p>
                <p className="text-xs text-cocoa">
                  Alternate Line: <a href="tel:7735333542" className="font-bold text-plum-900 hover:text-chilli">+91 77353 33542</a>
                </p>
                <p className="text-[11px] text-chilli font-medium pt-1">
                  Adari Krishna Rao &amp; Adari Dilleshwar Rao
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pista-50 border border-pista-200 text-pista flex items-center justify-center shrink-0">
                <WhatsAppIcon className="w-5 h-5" variant="green" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-plum-900">Wholesale WhatsApp Desk</h3>
                <p className="text-xs text-cocoa-muted">
                  Send your purchase lists, order quantities, or transport questions:
                </p>
                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20I%20have%20an%20enquiry%20regarding%20savouries`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-bold text-sm text-pista-800 hover:underline block pt-1"
                >
                  +91 98617 89602
                </a>
              </div>
            </div>
          </div>

          {/* Instagram Profile */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white flex items-center justify-center shrink-0">
                <InstagramIcon className="w-5 h-5" useGradient={false} />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-plum-900">Official Instagram</h3>
                <p className="text-xs text-cocoa-muted">
                  Follow our snack making, fresh batch frying, and community stories:
                </p>
                <a
                  href={initialBusinessSettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-plum-900 hover:text-chilli flex items-center gap-1.5 pt-1"
                >
                  <span>@sri_balaji_special_mixtures</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Quick Direct WhatsApp Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-ivory-border shadow-soft space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-plum-900">
              Send a Direct Message
            </h2>
            <p className="text-xs sm:text-sm text-cocoa-muted mt-1">
              Have questions regarding our mixtures, retail dealership, or bulk cartons? Fill out the details below to chat instantly with Sri Balaji management.
            </p>
          </div>

          {sent ? (
            <div className="p-6 rounded-2xl bg-pista-50 border border-pista-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-pista-700 mx-auto" />
              <h3 className="font-display font-bold text-lg text-plum-900">Message Prepared!</h3>
              <p className="text-xs text-cocoa">
                Your message was formatted and directed to our WhatsApp line (+91 98617 89602).
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="px-4 py-2 bg-pista text-plum-950 rounded-xl text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-plum-900 mb-1">
                  Your Full Name <span className="text-chilli">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Adarsh Mohanty"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-ivory-warm/40 focus:border-chilli outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-plum-900 mb-1">
                  Phone Number <span className="text-chilli">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9861789602"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-ivory-warm/40 focus:border-chilli outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-plum-900 mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-ivory-warm/40 focus:border-chilli outline-none text-xs cursor-pointer"
                >
                  <option value="Wholesale Snack Supply Inquiry">Wholesale Snack Supply Inquiry (Kirana / Supermarket)</option>
                  <option value="Retail Packets Order Inquiry">Retail Packets Order Inquiry (Household / Family)</option>
                  <option value="Bulk Event / Festive Snack Assortment">Bulk Event / Festive Snack Assortment</option>
                  <option value="Regional Transport / Dealership Terms">Regional Transport / Dealership Terms</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-plum-900 mb-1">
                  Message / Requirements <span className="text-chilli">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message, order quantities, delivery town, or specific questions here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border bg-ivory-warm/40 focus:border-chilli outline-none text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-chilli text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-chilli-600 transition-colors shadow-chilli active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send via WhatsApp (+91 98617 89602)</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
