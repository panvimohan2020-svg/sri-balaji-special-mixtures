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
import { useTranslation } from '../store/useLanguageStore';

export const ContactPage: React.FC = () => {
  const { t } = useTranslation();
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
        <span className="text-xs font-black uppercase tracking-widest text-gold-deep block">
          {t('hero.badge', '30+ Years of Tradition • Paralakhemundi, Odisha')}
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-imperial tracking-tight">
          {t('contact.title', 'Contact Sri Balaji')}
        </h1>
        <p className="text-sm text-cocoa/80 leading-relaxed">
          {t('contact.subtitle', 'Reach our wholesale desk for bulk trade orders, retail Kirana supplies, festive bundles, or product inquiries.')}
        </p>
      </div>

      {/* Grid: Contact Cards + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Address */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-gold/20 shadow-royal hover:border-gold/40 transition-all space-y-3">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-imperial text-gold border border-gold/30 flex items-center justify-center shrink-0 shadow-gold">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-base text-imperial">Business &amp; Manufacturing Address</h3>
                <p className="text-xs text-cocoa/80 leading-relaxed">
                  {initialBusinessSettings.address},<br />
                  {initialBusinessSettings.city}, Gajapati, {initialBusinessSettings.state}, India – {initialBusinessSettings.pin_code}
                </p>
                <a
                  href={initialBusinessSettings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gold-deep font-black hover:text-gold hover:underline pt-1 transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-gold/20 shadow-royal hover:border-gold/40 transition-all space-y-3">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold-deep border border-gold/30 flex items-center justify-center shrink-0 shadow-soft">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-base text-imperial">Direct Phone Calling</h3>
                <p className="text-xs text-cocoa">
                  Primary Line: <a href="tel:9437135342" className="font-bold text-imperial hover:text-gold-deep transition-colors">+91 94371 35342</a>
                </p>
                <p className="text-xs text-cocoa">
                  Alternate Line: <a href="tel:7735333542" className="font-bold text-imperial hover:text-gold-deep transition-colors">+91 77353 33542</a>
                </p>
                <p className="text-[11px] text-emerald-deep font-black pt-1">
                  Adari Krishna Rao &amp; Adari Dilleshwar Rao
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-emerald/25 shadow-emerald/10 hover:border-emerald/50 transition-all space-y-3">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald/15 text-emerald border border-emerald/30 flex items-center justify-center shrink-0 shadow-soft">
                <WhatsAppIcon className="w-5 h-5" variant="green" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-base text-imperial">Wholesale WhatsApp Desk</h3>
                <p className="text-xs text-cocoa/80">
                  Send your purchase lists, order quantities, or transport questions:
                </p>
                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20I%20have%20an%20enquiry%20regarding%20savouries`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-black text-sm text-emerald hover:underline block pt-1"
                >
                  +91 98617 89602
                </a>
              </div>
            </div>
          </div>

          {/* Instagram Profile */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-gold/20 shadow-royal hover:border-gold/40 transition-all space-y-3">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-imperial via-purple-700 to-gold text-white flex items-center justify-center shrink-0 shadow-soft">
                <InstagramIcon className="w-5 h-5" useGradient={false} />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-base text-imperial">Official Instagram</h3>
                <p className="text-xs text-cocoa/80">
                  Follow our snack making, fresh batch frying, and community stories:
                </p>
                <a
                  href={initialBusinessSettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-black text-imperial hover:text-gold-deep flex items-center gap-1.5 pt-1 transition-colors"
                >
                  <span>@sri_balaji_special_mixtures</span>
                  <ExternalLink className="w-3 h-3 text-gold-deep" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Quick Direct WhatsApp Message Form */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-gold/25 shadow-royal space-y-6">
          <div>
            <h2 className="font-display font-black text-2xl text-imperial">
              Send a Direct Message
            </h2>
            <p className="text-xs sm:text-sm text-cocoa/80 mt-1">
              Have questions regarding our mixtures, retail dealership, or bulk cartons? Fill out the details below to chat instantly with Sri Balaji management.
            </p>
          </div>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald/10 border border-emerald/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald mx-auto" />
              <h3 className="font-display font-black text-lg text-imperial">Message Prepared!</h3>
              <p className="text-xs text-cocoa/90">
                Your message was formatted and directed to our WhatsApp line (+91 98617 89602).
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="px-5 py-2.5 bg-imperial hover:bg-imperial-secondary text-gold border border-gold/30 rounded-xl text-xs font-black shadow-gold transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-black text-imperial mb-1">
                  Your Full Name <span className="text-gold-deep">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Adarsh Mohanty"
                  className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-ivory/60 focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-xs text-cocoa transition-all"
                />
              </div>

              <div>
                <label className="block font-black text-imperial mb-1">
                  Phone Number <span className="text-gold-deep">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9861789602"
                  className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-ivory/60 focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-xs text-cocoa transition-all"
                />
              </div>

              <div>
                <label className="block font-black text-imperial mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-ivory/60 focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-xs text-cocoa cursor-pointer transition-all"
                >
                  <option value="Wholesale Snack Supply Inquiry">Wholesale Snack Supply Inquiry (Kirana / Supermarket)</option>
                  <option value="Retail Packets Order Inquiry">Retail Packets Order Inquiry (Household / Family)</option>
                  <option value="Bulk Event / Festive Snack Assortment">Bulk Event / Festive Snack Assortment</option>
                  <option value="Regional Transport / Dealership Terms">Regional Transport / Dealership Terms</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-imperial mb-1">
                  Message / Requirements <span className="text-gold-deep">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message, order quantities, delivery town, or specific questions here..."
                  className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-ivory/60 focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-xs text-cocoa resize-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gold hover:bg-gold-rich text-imperial font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-gold hover:shadow-royal active:scale-95"
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
