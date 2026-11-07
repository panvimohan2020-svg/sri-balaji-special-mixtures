import React, { useState } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { initialBusinessSettings } from '../../data/initialData';

export const FloatingWhatsAppButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent(
    'Namaste Sri Balaji! I am visiting your digital catalogue and would like to inquire about wholesale snacks availability and rates.'
  )}`;

  return (
    <div 
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-2.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip on Desktop / Hover */}
      <div 
        className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-spice-dark/95 backdrop-blur-md text-white text-xs font-semibold shadow-elevated border border-gold-400/30 transition-all duration-300 pointer-events-none transform ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <div>
          <span className="block font-bold text-gold-300">Wholesale Desk Active</span>
          <span className="text-[11px] text-cream-surface/80">Direct Line: +91 98617 89602</span>
        </div>
      </div>

      {/* Primary Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Sri Balaji wholesale team on WhatsApp (Opens in new window)"
        className="relative group w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-elevated hover:shadow-glow transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
      >
        {/* Subtle pulsating radar ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping -z-10" />

        <WhatsAppIcon className="w-7 h-7 text-white" variant="white" />

        {/* Small verified badge pip */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-400 text-spice-dark font-extrabold text-[9px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          ✓
        </span>
      </a>
    </div>
  );
};
