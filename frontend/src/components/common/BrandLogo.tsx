import React from 'react';
import officialLogoImg from '../../assets/brand/sri-balaji-official-logo.jpg';

interface BrandLogoProps {
  variant?: 'compact' | 'with-badge' | 'crest' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
  theme?: 'dark' | 'light';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'compact',
  size = 'md',
  className = '',
  showSubtitle,
  theme = 'dark',
}) => {
  // If variant is 'crest', default to showing only the circular emblem unless showSubtitle is explicitly true.
  // For 'compact', 'horizontal', or 'with-badge', default to showing the brand name typography.
  const isCrest = variant === 'crest';
  const shouldShowText = showSubtitle !== undefined ? showSubtitle : !isCrest;
  const isDark = theme === 'dark';

  const sizeStyles = {
    sm: {
      emblem: 'h-8 w-8 sm:h-9 sm:w-9 max-h-9 max-w-9',
      standaloneEmblem: 'h-9 w-9 sm:h-10 sm:w-10 max-h-10 max-w-10',
      starSize: 'text-[5px] sm:text-[6px]',
      sriText: 'text-[11px] sm:text-[12px]',
      balajiText: 'text-[12px] sm:text-[13px]',
      specialText: 'text-[6px] sm:text-[7px]',
      specialTracking: 'tracking-[0.16em] sm:tracking-[0.18em]',
      taglineText: 'text-[5px] sm:text-[6px]',
      taglineTracking: 'tracking-[0.16em] sm:tracking-[0.18em]',
    },
    md: {
      emblem: 'h-11 w-11 sm:h-12 sm:w-12 lg:h-[50px] lg:w-[50px] xl:h-[54px] xl:w-[54px] max-h-[54px] max-w-[54px]',
      standaloneEmblem: 'h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 xl:h-[68px] xl:w-[68px] max-h-[68px] max-w-[68px]',
      starSize: 'text-[6px] sm:text-[7px] lg:text-[8px]',
      sriText: 'text-[12px] sm:text-[14px] lg:text-[16px] xl:text-[17px]',
      balajiText: 'text-[14px] sm:text-[16px] lg:text-[18px] xl:text-[20px]',
      specialText: 'text-[7px] sm:text-[8px] lg:text-[9.5px] xl:text-[10px]',
      specialTracking: 'tracking-[0.2em] sm:tracking-[0.24em] lg:tracking-[0.26em]',
      taglineText: 'text-[6px] sm:text-[7px] lg:text-[8px] xl:text-[8.5px]',
      taglineTracking: 'tracking-[0.18em] sm:tracking-[0.22em] lg:tracking-[0.24em]',
    },
    lg: {
      emblem: 'h-16 w-16 sm:h-18 sm:w-18 lg:h-20 lg:w-20 max-h-20 max-w-20',
      standaloneEmblem: 'h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 max-h-28 max-w-28',
      starSize: 'text-[8px] sm:text-[10px]',
      sriText: 'text-base sm:text-lg lg:text-xl',
      balajiText: 'text-xl sm:text-2xl lg:text-3xl',
      specialText: 'text-[10px] sm:text-xs lg:text-sm',
      specialTracking: 'tracking-[0.25em]',
      taglineText: 'text-[9px] sm:text-[10px] lg:text-xs',
      taglineTracking: 'tracking-[0.22em]',
    },
    xl: {
      emblem: 'h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 max-h-32 max-w-32',
      standaloneEmblem: 'h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44 max-h-44 max-w-44',
      starSize: 'text-[10px] sm:text-xs',
      sriText: 'text-xl sm:text-2xl',
      balajiText: 'text-2xl sm:text-3xl lg:text-4xl',
      specialText: 'text-xs sm:text-sm',
      specialTracking: 'tracking-[0.28em]',
      taglineText: 'text-[11px] sm:text-xs',
      taglineTracking: 'tracking-[0.25em]',
    },
  };

  const currentSize = sizeStyles[size];

  // If text is not shown, render just the standalone emblem
  if (!shouldShowText) {
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
      {/* 1. Official Sri Balaji Logo Image (Unchanged, 1024x1024 Original Artwork) */}
      <img
        src={officialLogoImg}
        alt="Sri Balaji Special Mixtures Brand Logo"
        className={`${currentSize.emblem} object-contain object-center rounded-xl shadow-xs border border-gold/40 hover:border-gold/80 transition-transform hover:scale-[1.03] duration-300 shrink-0`}
        loading="eager"
      />

      {/* 2. Actual HTML/CSS Brand Typography Arranged in Three Layers with Tagline */}
      <div
        className="flex flex-col items-center justify-center text-center select-text leading-none shrink-0"
        role="text"
        aria-label="Sri Balaji Special Mixtures – Fresh • Crispy • Tasty"
      >
        {/* LAYER 1: Sri (Elegant cursive script with golden accents) */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 leading-none">
          <span
            className={`text-gold ${currentSize.starSize} leading-none pointer-events-none select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]`}
          >
            ✦
          </span>
          <span
            className={`font-script ${
              isDark ? 'text-[#FFF8EB]' : 'text-[#0B3B24]'
            } ${currentSize.sriText} font-normal tracking-wide leading-none select-text drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]`}
          >
            Sri
          </span>
          <span
            className={`text-gold ${currentSize.starSize} leading-none pointer-events-none select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]`}
          >
            ✦
          </span>
        </div>

        {/* LAYER 2: BALAJI (Large, bold, premium serif typography) */}
        <div className="leading-none my-0.5 sm:my-0.8">
          <span
            className={`font-display font-black uppercase ${currentSize.balajiText} ${
              isDark
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5DC] via-[#F4C45E] to-[#E5B242] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]'
                : 'text-[#28143F] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'
            } tracking-[0.08em] sm:tracking-[0.1em] block select-text`}
          >
            BALAJI
          </span>
        </div>

        {/* LAYER 3: SPECIAL MIXTURES (Smaller uppercase, bold lettering with letter spacing) */}
        <div className="leading-none mb-0.5 sm:mb-1">
          <span
            className={`font-sans font-black uppercase ${currentSize.specialText} ${
              isDark ? 'text-[#FFF8EB]' : 'text-[#0B3B24]'
            } ${currentSize.specialTracking} block select-text drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]`}
          >
            SPECIAL MIXTURES
          </span>
        </div>

        {/* TAGLINE: FRESH • CRISPY • TASTY (Underneath with golden hairline divider) */}
        <div
          className={`w-full pt-0.5 sm:pt-0.8 border-t ${
            isDark ? 'border-gold/35' : 'border-gold/50'
          } flex items-center justify-center leading-none`}
        >
          <span
            className={`font-sans font-bold uppercase ${currentSize.taglineText} ${
              isDark ? 'text-gold-light' : 'text-[#A97819]'
            } ${currentSize.taglineTracking} whitespace-nowrap select-text`}
          >
            FRESH{' '}
            <span className="text-emerald-400 font-black mx-0.5 sm:mx-1 drop-shadow-[0_0_2px_rgba(74,222,128,0.5)]">
              •
            </span>{' '}
            CRISPY{' '}
            <span className="text-emerald-400 font-black mx-0.5 sm:mx-1 drop-shadow-[0_0_2px_rgba(74,222,128,0.5)]">
              •
            </span>{' '}
            TASTY
          </span>
        </div>
      </div>
    </div>
  );
};

export default BrandLogo;
