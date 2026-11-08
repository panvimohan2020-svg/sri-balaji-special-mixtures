import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ========================================================= */}
      {/* 1. ROYAL IMPERIAL PURPLE, SAFFRON GOLD & EMERALD AURORAS */}
      {/* ========================================================= */}
      
      {/* Top Right Imperial Purple Glow */}
      <div 
        className="absolute -top-24 -right-24 w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] rounded-full bg-gradient-to-br from-imperial-soft/12 via-imperial-secondary/8 to-transparent blur-3xl animate-sun-glow"
      />

      {/* Center Left Radiant Saffron Gold Pool */}
      <div 
        className="absolute top-1/3 -left-32 w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] rounded-full bg-gradient-to-tr from-gold/16 via-gold-rich/8 to-transparent blur-3xl animate-sun-glow [animation-delay:3s]"
      />

      {/* Bottom Right Deep Emerald Green Mist */}
      <div 
        className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-tl from-emerald/14 via-emerald-deep/6 to-transparent blur-3xl animate-emerald-mist"
      />

      {/* Bottom Left Royal Purple & Gold Hearth */}
      <div 
        className="absolute bottom-10 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-imperial-secondary/10 via-gold/8 to-transparent blur-3xl animate-sun-glow [animation-delay:6s]"
      />


      {/* ========================================================= */}
      {/* 2. FLOATING CRISP SPICES & SAVOURY PARTICLES              */}
      {/* ========================================================= */}

      {/* A. Radiant Gold Boondi Pearls */}
      <div className="absolute top-[12%] left-[8%] w-3 h-3 rounded-full bg-gradient-to-br from-gold-light to-gold shadow-sm opacity-60 animate-spice-slow" />
      <div className="absolute top-[28%] right-[10%] w-2.5 h-2.5 rounded-full bg-gradient-to-br from-gold to-gold-rich shadow-sm opacity-70 animate-spice-medium [animation-delay:1.5s]" />
      <div className="absolute top-[48%] left-[14%] w-3.5 h-3.5 rounded-full bg-gradient-to-br from-gold-light to-gold shadow-sm opacity-50 animate-spice-fast [animation-delay:2.5s]" />
      <div className="absolute top-[68%] right-[16%] w-2 h-2 rounded-full bg-gradient-to-br from-gold to-gold-deep shadow-sm opacity-65 animate-spice-slow [animation-delay:4s]" />
      <div className="absolute top-[82%] left-[22%] w-3 h-3 rounded-full bg-gradient-to-br from-gold to-gold-rich shadow-sm opacity-60 animate-spice-medium [animation-delay:3.5s]" />
      <div className="absolute top-[92%] right-[25%] w-2.5 h-2.5 rounded-full bg-gradient-to-br from-gold-light to-gold shadow-sm opacity-55 animate-spice-fast [animation-delay:5s]" />

      {/* B. Crispy Sev & Cashew Crescents (Subtle Gold Curves) */}
      {/* Cashew Curve Top Left */}
      <div className="absolute top-[20%] left-[18%] opacity-45 animate-spice-medium [animation-delay:2s]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M 4 12 C 4 6, 12 4, 18 8 C 22 11, 20 18, 14 18 C 9 18, 5 15, 4 12 Z" fill="#D6A52D" />
        </svg>
      </div>

      {/* Cashew Curve Mid Right */}
      <div className="absolute top-[58%] right-[12%] opacity-40 animate-spice-slow [animation-delay:4.5s]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M 4 12 C 4 6, 12 4, 18 8 C 22 11, 20 18, 14 18 C 9 18, 5 15, 4 12 Z" fill="#A97819" />
        </svg>
      </div>

      {/* Sev Curl Top Right */}
      <div className="absolute top-[35%] right-[22%] opacity-45 animate-spice-fast [animation-delay:1s]">
        <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
          <path d="M 2 8 Q 8 2 14 8 T 26 8" stroke="#F4C45E" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Sev Curl Bottom Left */}
      <div className="absolute top-[75%] left-[9%] opacity-40 animate-spice-medium [animation-delay:3s]">
        <svg width="30" height="18" viewBox="0 0 28 16" fill="none">
          <path d="M 2 8 Q 8 14 14 8 T 26 8" stroke="#D6A52D" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* C. Aromatic Curry Leaves (Crisp Emerald Accents) */}
      {/* Curry Leaf Top Right */}
      <div className="absolute top-[16%] right-[14%] opacity-55 animate-leaf-sway">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
          <path d="M 4 28 C 6 18, 16 8, 28 4 C 28 16, 18 26, 4 28 Z" fill="#126044" opacity="0.85" />
          <path d="M 4 28 Q 16 16 28 4" stroke="#72A88A" strokeWidth="1" />
        </svg>
      </div>

      {/* Curry Leaf Mid Left */}
      <div className="absolute top-[62%] left-[6%] opacity-50 animate-leaf-sway [animation-delay:3.5s]">
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M 4 28 C 6 18, 16 8, 28 4 C 28 16, 18 26, 4 28 Z" fill="#0B4433" opacity="0.85" />
          <path d="M 4 28 Q 16 16 28 4" stroke="#72A88A" strokeWidth="1" />
        </svg>
      </div>

      {/* Curry Leaf Lower Right */}
      <div className="absolute top-[86%] right-[8%] opacity-55 animate-leaf-sway [animation-delay:6s]">
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <path d="M 4 28 C 6 18, 16 8, 28 4 C 28 16, 18 26, 4 28 Z" fill="#126044" opacity="0.85" />
          <path d="M 4 28 Q 16 16 28 4" stroke="#72A88A" strokeWidth="1" />
        </svg>
      </div>

      {/* D. Twinkling Saffron Gold Stars (✦) */}
      <div className="absolute top-[8%] left-[26%] text-gold opacity-65 animate-star-twinkle text-lg">
        ✦
      </div>
      <div className="absolute top-[24%] right-[32%] text-gold-light opacity-75 animate-star-twinkle [animation-delay:1.8s] text-base">
        ✦
      </div>
      <div className="absolute top-[44%] left-[30%] text-gold-rich opacity-60 animate-star-twinkle [animation-delay:3.2s] text-sm">
        ✦
      </div>
      <div className="absolute top-[72%] right-[28%] text-gold opacity-70 animate-star-twinkle [animation-delay:2.4s] text-lg">
        ✦
      </div>
      <div className="absolute top-[90%] left-[35%] text-gold-light opacity-55 animate-star-twinkle [animation-delay:4s] text-base">
        ✦
      </div>

    </div>
  );
};

