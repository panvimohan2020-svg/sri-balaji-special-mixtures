import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { initialBusinessSettings } from '../data/initialData';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Wholesale Inquiry',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryText = `👋 *MESSAGE FROM SRI BALAJI WEBSITE*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 *Name:* ${formData.name}\n📱 *Phone:* ${formData.phone}\n✉️ *Email:* ${formData.email || 'N/A'}\n📌 *Subject:* ${formData.subject}\n💬 *Message:* ${formData.message}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    const url = `https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent(queryText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
          Get in Touch
        </span>
        <h1 className="font-display font-extrabold text-4xl text-crimson-900 tracking-tight">
          Contact Sri Balaji Manufacturing
        </h1>
        <p className="text-sm text-spice-muted leading-relaxed">
          Reach our wholesale desk for bulk trade inquiries, order dispatches, distributor applications, or general product feedback.
        </p>
      </div>

      {/* Grid: Contact Cards + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-crimson-100 text-crimson-800 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-spice-dark">Business Location</h3>
                <p className="text-xs text-spice-muted leading-relaxed">
                  {initialBusinessSettings.address}, {initialBusinessSettings.city}, {initialBusinessSettings.state} - {initialBusinessSettings.pin_code}
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

          <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-spice-dark">Phone &amp; WhatsApp</h3>
                <p className="text-xs text-spice-muted">
                  Call: <a href={`tel:${initialBusinessSettings.contact_number.replace(/\s+/g, '')}`} className="font-bold text-spice-dark hover:underline">{initialBusinessSettings.contact_number}</a>
                </p>
                <p className="text-xs text-spice-muted">
                  WhatsApp: <a href={`https://wa.me/${initialBusinessSettings.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-700 hover:underline">+{initialBusinessSettings.whatsapp_number}</a>
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-spice-dark">Operating Hours</h3>
                <p className="text-xs text-spice-muted leading-relaxed">
                  {initialBusinessSettings.business_hours}
                </p>
                <p className="text-[11px] text-brand-700 font-medium">
                  Dispatch desk operational during factory hours.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-spice-dark">Email Inquiries</h3>
                <p className="text-xs text-spice-muted">
                  {initialBusinessSettings.email_address}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-cream-border shadow-soft space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-spice-dark">
              Send a Direct Message
            </h2>
            <p className="text-xs sm:text-sm text-spice-muted mt-1">
              Have a question about our ingredients, custom bulk orders, or shipping? Fill out the form below.
            </p>
          </div>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-display font-bold text-lg text-emerald-900">Message Prepared!</h3>
              <p className="text-xs text-emerald-700">
                Your message was routed to WhatsApp. Click below if you need to submit another enquiry:
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
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. anand@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-spice-dark mb-1">
                  Subject / Inquiry Type
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none"
                >
                  <option value="General Wholesale Inquiry">General Wholesale Inquiry</option>
                  <option value="Kirana Store Supply">Kirana Store Regular Supply</option>
                  <option value="Distributor Application">Distributor / Agency Application</option>
                  <option value="Event Catering Bulk Order">Event / Wedding Catering Bulk Order</option>
                  <option value="Quality or Ingredient Feedback">Quality or Ingredient Question</option>
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
                  placeholder="Please describe your enquiry..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 focus:border-crimson-700 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm font-bold flex items-center justify-center gap-2 shadow-elevated transition-all"
              >
                <Send className="w-4 h-4 text-gold-300" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Embedded Google Maps Section */}
      <div className="rounded-3xl overflow-hidden border-2 border-cream-border shadow-soft bg-cream-surface p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-bold text-xl text-spice-dark">
              Interactive Map &amp; Directions
            </h3>
            <p className="text-xs text-spice-muted">
              {initialBusinessSettings.address}, {initialBusinessSettings.city}
            </p>
          </div>
          <a
            href={initialBusinessSettings.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-cream-border text-xs font-bold text-crimson-800 hover:bg-cream-warm shadow-sm"
          >
            <MapPin className="w-4 h-4" />
            <span>Get Directions on Google Maps</span>
          </a>
        </div>

        {/* Map iframe placeholder with clean visual styling */}
        <div className="w-full h-72 sm:h-96 rounded-2xl bg-stone-200 overflow-hidden relative flex items-center justify-center border border-cream-border">
          <iframe
            title="Sri Balaji Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121820.35824578848!2d78.3846665243164!3d17.412348700000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

    </div>
  );
};

