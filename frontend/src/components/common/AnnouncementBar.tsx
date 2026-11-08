import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { InstagramIcon } from './InstagramIcon';
import { useTranslation } from '../../store/useLanguageStore';
import { initialBusinessSettings } from '../../data/initialData';

export const AnnouncementBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-imperial-dark text-ivory text-xs font-semibold py-1.5 px-3 sm:px-4 border-b border-imperial-border/60 transition-colors">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        
        {/* Core Brand Message */}
        <div className="flex items-center gap-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald shrink-0 animate-pulse" />
          <span className="tracking-wide font-medium text-ivory text-[11px] sm:text-xs truncate">
            {t('announcement.tradition', '30+ Years of Tradition')} <span className="text-gold font-bold">|</span> {t('announcement.freshCrispy', 'Fresh & Crispy Savouries from Paralakhemundi')}
          </span>
        </div>

        {/* Quick Social & Contact Accents */}
        <div className="hidden sm:flex items-center gap-3 sm:gap-4 text-[11px] shrink-0">
          <a
            href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20I%20would%20like%20to%20enquire%20about%20your%20fresh%20snacks`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-ivory/90 hover:text-gold transition-colors"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" variant="green" />
            <span className="font-bold text-gold-light">+91 98617 89602</span>
          </a>

          {initialBusinessSettings.instagram_url && (
            <a
              href={initialBusinessSettings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-ivory/90 hover:text-gold transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5" useGradient={true} />
              <span className="font-bold text-gold-light">@sri_balaji_special_mixtures</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
