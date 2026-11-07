import React from 'react';
import { Phone, Sparkles } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { InstagramIcon } from './InstagramIcon';
import { initialBusinessSettings } from '../../data/initialData';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-crimson-900 via-crimson-800 to-crimson-900 text-cream-warm text-xs sm:text-sm py-2 px-4 font-medium border-b border-gold-400/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
        {/* Left Legacy Highlight */}
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="bg-gold-500 text-spice-dark text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 shadow-sm">
            {initialBusinessSettings.years_in_business} Yrs Heritage
          </span>
          <span className="hidden sm:inline font-semibold text-cream-warm truncate">
            "{initialBusinessSettings.tagline}" • Fresh Wholesale Savouries from Paralakhemundi, Odisha
          </span>
          <span className="sm:hidden font-semibold text-cream-warm truncate">
            Sri Balaji • Paralakhemundi, Odisha
          </span>
        </div>

        {/* Right Contact Quick-Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-xs">
          <a
            href="tel:9437135342"
            className="flex items-center gap-1.5 hover:text-gold-300 transition-colors font-semibold"
            title="Call Sri Balaji Office"
          >
            <Phone className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden md:inline">+91 94371 35342</span>
            <span className="md:hidden">Call</span>
          </a>

          <span className="text-gold-400/40">•</span>

          <a
            href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to inquire about wholesale snack supplies.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors font-bold"
            title="WhatsApp Wholesale Ordering Hotline"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" variant="green" />
            <span className="hidden md:inline">WhatsApp: 9861789602</span>
            <span className="md:hidden">WhatsApp</span>
          </a>

          {initialBusinessSettings.instagram_url && (
            <>
              <span className="text-gold-400/40 hidden sm:inline">•</span>
              <a
                href={initialBusinessSettings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-pink-300 hover:text-pink-100 transition-colors font-semibold"
                title="Follow @sri_balaji_special_mixtures on Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" useGradient={true} />
                <span>Instagram</span>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

