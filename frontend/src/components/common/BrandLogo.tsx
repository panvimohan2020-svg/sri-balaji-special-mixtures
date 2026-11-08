import React from 'react';

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
}) => {
  const isCrest = variant === 'crest' || variant === 'with-badge';

  // Size configurations tailored for responsive navbar and page contexts
  const sizeConfig = {
    sm: {
      padding: 'px-2.5 py-1',
      sriText: 'text-sm sm:text-base',
      balajiText: 'text-lg sm:text-xl',
      specialText: 'text-[7px] sm:text-[8px] tracking-[0.2em]',
      taglineText: 'text-[6.5px] sm:text-[7.5px] tracking-[0.12em]',
      starSize: 'text-[8px]',
      crestWidth: 'w-40 sm:w-44',
    },
    md: {
      padding: 'px-3 sm:px-4 py-1 sm:py-1.5',
      sriText: 'text-base sm:text-lg md:text-xl',
      balajiText: 'text-xl sm:text-2xl md:text-[26px]',
      specialText: 'text-[8px] sm:text-[9.5px] md:text-[10px] tracking-[0.22em] sm:tracking-[0.25em]',
      taglineText: 'text-[7px] sm:text-[8px] md:text-[8.5px] tracking-[0.14em] sm:tracking-[0.18em]',
      starSize: 'text-[9px] sm:text-[10px]',
      crestWidth: 'w-52 sm:w-60',
    },
    lg: {
      padding: 'px-4 sm:px-5 py-2 sm:py-2.5',
      sriText: 'text-xl sm:text-2xl md:text-3xl',
      balajiText: 'text-2xl sm:text-3xl md:text-4xl',
      specialText: 'text-[10px] sm:text-[12px] tracking-[0.26em]',
      taglineText: 'text-[8.5px] sm:text-[10px] tracking-[0.2em]',
      starSize: 'text-[11px] sm:text-xs',
      crestWidth: 'w-64 sm:w-72',
    },
    xl: {
      padding: 'px-6 py-3',
      sriText: 'text-3xl sm:text-4xl',
      balajiText: 'text-4xl sm:text-5xl',
      specialText: 'text-xs sm:text-sm tracking-[0.28em]',
      taglineText: 'text-[10px] sm:text-xs tracking-[0.22em]',
      starSize: 'text-xs sm:text-sm',
      crestWidth: 'w-80 sm:w-96',
    },
  }[size];

  // 1. CREST / EMBLEM VARIANT (Arched Baroque Cartouche with Golden Crest & Ribbon)
  if (isCrest) {
    return (
      <div
        className={`inline-flex flex-col items-center select-none text-center transition-transform hover:scale-[1.02] duration-300 ${className}`}
        role="img"
        aria-label="Sri Balaji Special Mixture – FRESH - CRISPY - TASTY"
      >
        {/* Decorative Top Kalash / Flourish Peak */}
        <div className="flex items-center justify-center gap-1.5 -mb-2 z-10">
          <div className="w-5 sm:w-7 h-[1.5px] bg-gradient-to-r from-transparent to-[#D6A52D]" />
          <div className="w-2 h-2 rounded-full bg-[#D6A52D] border border-[#FFE7A3] shadow-xs" />
          <span className="text-[#D6A52D] text-xs">✦</span>
          <div className="w-2 h-2 rounded-full bg-[#D6A52D] border border-[#FFE7A3] shadow-xs" />
          <div className="w-5 sm:w-7 h-[1.5px] bg-gradient-to-l from-transparent to-[#D6A52D]" />
        </div>

        {/* Main Cartouche Badge */}
        <div
          className={`${sizeConfig.crestWidth} bg-gradient-to-b from-[#FFFDF7] via-[#FFF8EB] to-[#FFF1D6] rounded-3xl sm:rounded-[2rem] border-2 border-[#D6A52D] p-3 sm:p-4 shadow-royal relative overflow-hidden`}
        >
          {/* Subtle inner gold frame */}
          <div className="absolute inset-1 rounded-[1.4rem] border border-[#E5B242]/40 pointer-events-none" />

          {/* Corner traditional accent pips */}
          <div className="absolute top-2 left-2.5 text-[#D9531E] text-[8px] pointer-events-none">❖</div>
          <div className="absolute top-2 right-2.5 text-[#D9531E] text-[8px] pointer-events-none">❖</div>

          {/* LAYER 1: Sri (Elegant cursive script, Dark Forest Green) */}
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="text-[#D6A52D] text-[10px]">✦</span>
            <span className={`font-script text-[#0B3B24] ${sizeConfig.sriText} leading-none font-normal tracking-wide`}>
              Sri
            </span>
            <span className="text-[#D6A52D] text-[10px]">✦</span>
          </div>

          {/* LAYER 2: BALAJI (Bold artistic brush typography, Deep Dark Green) */}
          <div className="text-center leading-none my-0.5">
            <span
              className={`font-brush text-[#072B18] ${sizeConfig.balajiText} font-black tracking-[0.06em] uppercase block drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]`}
            >
              BALAJI
            </span>
          </div>

          {/* LAYER 3: SPECIAL MIXTURE (Smaller uppercase, Dark Green, spaced) */}
          <div className="text-center leading-none mt-1 mb-2">
            <span
              className={`font-sans text-[#0B3B24] ${sizeConfig.specialText} font-black uppercase block`}
            >
              SPECIAL MIXTURE
            </span>
          </div>

          {/* TAGLINE: FRESH - CRISPY - TASTY (Ribbon style bar) */}
          <div className="relative mx-auto mt-1 pt-1.5 border-t border-[#D6A52D]/50">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFF8EB] via-[#FFF0D4] to-[#FFF8EB] border border-[#D6A52D]/60 shadow-xs">
              <span className="text-[#D9531E] text-[7px]">❖</span>
              <span
                className={`font-sans text-[#0B3B24] ${sizeConfig.taglineText} font-extrabold uppercase whitespace-nowrap`}
              >
                FRESH <span className="text-[#D6A52D] mx-0.5">•</span> CRISPY <span className="text-[#D6A52D] mx-0.5">•</span> TASTY
              </span>
              <span className="text-[#D9531E] text-[7px]">❖</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. COMPACT / HORIZONTAL NAVBAR VARIANT (Optimized for sleek navigation bar height & zero clipping)
  return (
    <div
      className={`inline-flex items-center select-none transition-transform hover:scale-[1.015] duration-200 ${className}`}
      role="img"
      aria-label="Sri Balaji Special Mixture – FRESH - CRISPY - TASTY"
    >
      <div
        className={`bg-gradient-to-b from-[#FFFDF8] via-[#FFF9ED] to-[#FFF2D8] ${sizeConfig.padding} rounded-xl sm:rounded-2xl border border-[#D6A52D]/80 shadow-md ring-1 ring-[#D6A52D]/25 relative flex flex-col items-center justify-center`}
      >
        {/* Subtle corner golden ornaments */}
        <div className="absolute top-1 left-1.5 text-[#D6A52D] text-[6px] sm:text-[7px] leading-none pointer-events-none opacity-80">
          ✦
        </div>
        <div className="absolute top-1 right-1.5 text-[#D6A52D] text-[6px] sm:text-[7px] leading-none pointer-events-none opacity-80">
          ✦
        </div>

        {/* LAYER 1: Sri (Elegant cursive script, Dark Forest Green) */}
        <div className="flex items-center justify-center gap-1.5 -mb-1 leading-none">
          <span className={`text-[#D6A52D] ${sizeConfig.starSize} leading-none pointer-events-none`}>
            ✦
          </span>
          <span
            className={`font-script text-[#0B3B24] ${sizeConfig.sriText} font-normal tracking-wide leading-tight`}
          >
            Sri
          </span>
          <span className={`text-[#D6A52D] ${sizeConfig.starSize} leading-none pointer-events-none`}>
            ✦
          </span>
        </div>

        {/* LAYER 2: BALAJI (Bold artistic brush typography, Deep Dark Green) */}
        <div className="text-center leading-none my-0.5">
          <span
            className={`font-brush text-[#072B18] ${sizeConfig.balajiText} font-black tracking-[0.06em] uppercase block drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]`}
          >
            BALAJI
          </span>
        </div>

        {/* LAYER 3: SPECIAL MIXTURE (Smaller uppercase, Bold, Dark Green, Spaced) */}
        <div className="text-center leading-none mb-0.5 sm:mb-1">
          <span
            className={`font-sans text-[#0B3B24] ${sizeConfig.specialText} font-black uppercase block`}
          >
            SPECIAL MIXTURE
          </span>
        </div>

        {/* TAGLINE: FRESH - CRISPY - TASTY (Directly below three-layer brand name) */}
        <div className="w-full pt-0.5 sm:pt-1 border-t border-[#D6A52D]/45 flex items-center justify-center leading-none">
          <span
            className={`font-sans text-[#0B3B24] ${sizeConfig.taglineText} font-extrabold uppercase whitespace-nowrap`}
          >
            FRESH <span className="text-[#D6A52D] font-black mx-0.5">•</span> CRISPY <span className="text-[#D6A52D] font-black mx-0.5">•</span> TASTY
          </span>
        </div>
      </div>
    </div>
  );
};

export default BrandLogo;
