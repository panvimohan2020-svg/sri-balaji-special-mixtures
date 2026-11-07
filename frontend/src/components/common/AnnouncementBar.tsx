import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { InstagramIcon } from './InstagramIcon';
import { initialBusinessSettings } from '../../data/initialData';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-plum-900 text-ivory text-xs font-semibold py-2 px-4 border-b border-plum-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Core Brand Message */}
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-turmeric animate-pulse" />
          <span className="tracking-wide font-medium">
            30+ Years of Tradition <span className="text-turmeric font-bold">|</span> Fresh &amp; Crispy Savouries from Paralakhemundi
          </span>
        </div>

        {/* Quick Social & Contact Accents (Uncluttered) */}
        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <a
            href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20I%20would%20like%20to%20enquire%20about%20your%20fresh%20snacks`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-ivory hover:text-turmeric transition-colors"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" variant="green" />
            <span className="font-bold">+91 98617 89602</span>
          </a>

          {initialBusinessSettings.instagram_url && (
            <a
              href={initialBusinessSettings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-ivory hover:text-turmeric transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5" useGradient={true} />
              <span className="font-bold">@sri_balaji_special_mixtures</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
