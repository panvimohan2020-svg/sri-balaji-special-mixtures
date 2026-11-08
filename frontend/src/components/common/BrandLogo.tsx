import React from 'react';
import officialLogoImg from '../../assets/brand/sri-balaji-official-logo.jpg';

interface BrandLogoProps {
  variant?: 'compact' | 'with-badge' | 'crest' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'compact',
  size = 'md',
  className = '',
  showSubtitle,
}) => {
  // If variant is 'crest', default to showing only the grand circular emblem unless showSubtitle is explicitly true.
  // For 'compact', 'horizontal', or 'with-badge', default to showing the brand name box lockup.
  const isCrest = variant === 'crest';
  const shouldShowBox = showSubtitle !== undefined ? showSubtitle : !isCrest;

  const sizeStyles = {
    sm: {
      emblem: 'h-8 w-8 sm:h-9 sm:w-9 max-h-9 max-w-9',
      standaloneEmblem: 'h-9 w-9 sm:h-10 sm:w-10 max-h-10 max-w-10',
      boxPadding: 'px-1.5 py-0.5',
      boxMaxHeight: '38px',
      starSize: 'text-[5px]',
      sriText: 'text-[10px]',
      balajiText: 'text-[10px]',
      specialText: 'text-[6px]',
      taglineText: 'text-[5.5px]',
    },
    md: {
      emblem: 'h-10 w-10 sm:h-12 sm:w-12 lg:h-[50px] lg:w-[50px] xl:h-[54px] xl:w-[54px] max-h-[54px] max-w-[54px]',
      standaloneEmblem: 'h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 xl:h-[68px] xl:w-[68px] max-h-[68px] max-w-[68px]',
      boxPadding: 'px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 lg:py-1',
      boxMaxHeight: '56px',
      starSize: 'text-[5px] sm:text-[6px] lg:text-[7px]',
      sriText: 'text-[10px] sm:text-[12px] lg:text-[13px] xl:text-[14px]',
      balajiText: 'text-[10.5px] sm:text-[12px] lg:text-[13.5px] xl:text-[15px]',
      specialText: 'text-[6.5px] sm:text-[7px] lg:text-[8px] xl:text-[8.5px]',
      taglineText: 'text-[5.5px] sm:text-[6.5px] lg:text-[7.5px] xl:text-[8px]',
    },
    lg: {
      emblem: 'h-16 w-16 sm:h-18 sm:w-18 lg:h-20 lg:w-20 max-h-20 max-w-20',
      standaloneEmblem: 'h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 max-h-28 max-w-28',
      boxPadding: 'px-3 py-1.5 sm:px-4 sm:py-2',
      boxMaxHeight: '80px',
      starSize: 'text-[7px] sm:text-[8px]',
      sriText: 'text-base sm:text-lg',
      balajiText: 'text-base sm:text-lg',
      specialText: 'text-[10px] sm:text-xs',
      taglineText: 'text-[9px] sm:text-[10px]',
    },
    xl: {
      emblem: 'h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 max-h-32 max-w-32',
      standaloneEmblem: 'h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44 max-h-44 max-w-44',
      boxPadding: 'px-4 py-2 sm:px-5 sm:py-3',
      boxMaxHeight: '120px',
      starSize: 'text-[9px] sm:text-[10px]',
      sriText: 'text-xl sm:text-2xl',
      balajiText: 'text-xl sm:text-2xl',
      specialText: 'text-xs sm:text-sm',
      taglineText: 'text-[11px] sm:text-xs',
    },
  };

  const currentSize = sizeStyles[size];

  // If box is not shown, render just the emblem
  if (!shouldShowBox) {
    return (
      <div className={`flex items-center justify-center shrink-0 select-none ${className}`}>
        <img
          src={officialLogoImg}
          alt="Sri Balaji Special Mixtures – Fresh • Crispy • Tasty – Trusted Since 30 Years"
          className={`${currentSize.standaloneEmblem} object-contain object-center rounded-xl shadow-xs border border-gold/40 hover:border-gold/70 transition-transform hover:scale-[1.02] duration-300`}
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 lg:gap-3 shrink-0 select-none ${className}`}>
      {/* Official Circular Logo Emblem (Direct 1024x1024 Artwork) */}
      <img
        src={officialLogoImg}
        alt="Sri Balaji Special Mixtures Emblem"
        className={`${currentSize.emblem} object-contain object-center rounded-xl shadow-xs border border-gold/50 hover:border-gold transition-transform hover:scale-105 duration-300 shrink-0`}
        loading="eager"
      />

      {/* Brand Name & Tagline Box Neatly Beside the Emblem */}
      <div
        className={`bg-gradient-to-b from-[#FFFDF9] via-[#FFF9ED] to-[#FFF2D8] ${currentSize.boxPadding} rounded-xl sm:rounded-2xl border border-[#D6A52D]/80 shadow-md ring-1 ring-[#D6A52D]/25 relative flex flex-col items-center justify-center transition-transform hover:scale-[1.015] duration-200 shrink-0`}
        style={{ maxHeight: currentSize.boxMaxHeight }}
      >
        {/* Subtle corner golden ornaments */}
        <span
          className={`absolute top-0.5 sm:top-1 left-1 sm:left-1.5 text-[#D6A52D] ${currentSize.starSize} leading-none pointer-events-none opacity-80 select-none`}
        >
          ✦
        </span>
        <span
          className={`absolute top-0.5 sm:top-1 right-1 sm:right-1.5 text-[#D6A52D] ${currentSize.starSize} leading-none pointer-events-none opacity-80 select-none`}
        >
          ✦
        </span>

        {/* LAYER 1: Sri (Cursive script, Dark Forest Green) */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 -mb-0.5 sm:-mb-1 leading-none">
          <span className={`text-[#D6A52D] ${currentSize.starSize} leading-none pointer-events-none select-none`}>
            ✦
          </span>
          <span
            className={`font-script text-[#0B3B24] ${currentSize.sriText} font-normal tracking-wide leading-none`}
          >
            Sri
          </span>
          <span className={`text-[#D6A52D] ${currentSize.starSize} leading-none pointer-events-none select-none`}>
            ✦
          </span>
        </div>

        {/* LAYER 2: BALAJI (Bold display font, Deep Dark Green) */}
        <div className="text-center leading-none my-0.2 sm:my-0.5">
          <span
            className={`font-display font-black text-[#072B18] ${currentSize.balajiText} tracking-[0.06em] uppercase block drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]`}
          >
            BALAJI
          </span>
        </div>

        {/* LAYER 3: SPECIAL MIXTURES (Uppercase, Bold Dark Green, Wide Tracking) */}
        <div className="text-center leading-none mb-0.5 sm:mb-1">
          <span
            className={`font-sans font-black text-[#0B3B24] ${currentSize.specialText} uppercase tracking-widest block`}
          >
            SPECIAL MIXTURES
          </span>
        </div>

        {/* TAGLINE: FRESH • CRISPY • TASTY (Directly below brand name with golden divider) */}
        <div className="w-full pt-0.5 sm:pt-1 border-t border-[#D6A52D]/45 flex items-center justify-center leading-none">
          <span
            className={`font-sans font-extrabold text-[#0B3B24] ${currentSize.taglineText} uppercase tracking-wider whitespace-nowrap`}
          >
            FRESH <span className="text-[#D6A52D] font-black mx-0.5">•</span> CRISPY <span className="text-[#D6A52D] font-black mx-0.5">•</span> TASTY
          </span>
        </div>
      </div>
    </div>
  );
};

export default BrandLogo;
