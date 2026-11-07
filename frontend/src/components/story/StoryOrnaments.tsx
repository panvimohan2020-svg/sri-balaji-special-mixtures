import React from 'react';

// 1. Ornate Decorative Diamond (Exact specification + enhancement)
export const OrnateDiamondSVG: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={`inline-block shrink-0 ${className}`}>
    <defs>
      <linearGradient id="diamondGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F9E596" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#AA8222" />
      </linearGradient>
    </defs>
    <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="none" stroke="url(#diamondGold)" strokeWidth="2.5" />
    <path
      d="M50 15 L85 50 L50 85 L15 50 Z"
      fill="rgba(212,175,55,0.12)"
      stroke="#D4AF37"
      strokeWidth="1.2"
      strokeDasharray="4,4"
    />
    <circle cx="50" cy="50" r="20" fill="none" stroke="url(#diamondGold)" strokeWidth="2" />
    <circle cx="50" cy="50" r="10" fill="url(#diamondGold)" />
    <circle cx="50" cy="50" r="4" fill="#2A1132" />
  </svg>
);

// 2. Traditional Mixture Bowl (Exact specification + luxury jewel treatment)
export const MixtureBowlSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={`inline-block shrink-0 ${className}`}>
    <defs>
      <linearGradient id="bowlGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F9E596" />
        <stop offset="70%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8A6715" />
      </linearGradient>
      <radialGradient id="bowlFill" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4A0E1A" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#2A1132" stopOpacity="0.9" />
      </radialGradient>
    </defs>
    {/* Brass bowl body */}
    <path
      d="M10 75 C25 95 75 95 90 75 L82 25 C62 38 38 38 18 25 Z"
      fill="url(#bowlFill)"
      stroke="url(#bowlGold)"
      strokeWidth="2.5"
    />
    {/* Bowl rim */}
    <ellipse cx="50" cy="25" rx="38" ry="14" fill="rgba(212,175,55,0.15)" stroke="url(#bowlGold)" strokeWidth="2.5" />
    {/* Heaping authentic snack mixture mound */}
    <path d="M22 25 Q50 -2 78 25" fill="none" stroke="#F9E596" strokeWidth="3.5" strokeLinecap="round" />
    {/* Golden mixture grains & cashews */}
    <circle cx="42" cy="18" r="3" fill="#F9E596" />
    <circle cx="55" cy="14" r="3.5" fill="#D4AF37" />
    <circle cx="63" cy="20" r="2.5" fill="#F9E596" />
    <circle cx="34" cy="22" r="2.5" fill="#D4AF37" />
    {/* Bowl base ring */}
    <ellipse cx="50" cy="85" rx="20" ry="6" fill="none" stroke="url(#bowlGold)" strokeWidth="2" />
  </svg>
);

// 3. Murrukulu Spiral (Chakli / Murruku snack inspired SVG with golden concentric ridges)
export const MurrukuluSpiralSVG: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={`inline-block shrink-0 ${className}`}>
    <defs>
      <linearGradient id="murrukuGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F9E596" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#9C7418" />
      </linearGradient>
    </defs>
    {/* Star-serrated spiral coils */}
    <path
      d="M50 50 
         m -4, 0 
         a 4,4 0 0,1 8,0 
         a 9,9 0 0,1 -18,0 
         a 15,15 0 0,1 30,0 
         a 22,22 0 0,1 -44,0 
         a 30,30 0 0,1 60,0 
         a 38,38 0 0,1 -76,0 
         a 44,44 0 0,1 88,0"
      fill="none"
      stroke="url(#murrukuGold)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="6,2"
    />
    <circle cx="50" cy="50" r="5" fill="#D4AF37" />
  </svg>
);

// 4. Roasted Peanuts SVG
export const PeanutsSVG: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={`inline-block shrink-0 ${className}`}>
    <defs>
      <linearGradient id="peanutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F9E596" />
        <stop offset="60%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#875317" />
      </linearGradient>
    </defs>
    {/* Double peanut pod silhouette */}
    <g transform="rotate(-20 50 50)">
      <path
        d="M30 35 C20 40 20 60 30 65 C40 68 42 58 50 58 C58 58 60 68 70 65 C80 60 80 40 70 35 C60 32 58 42 50 42 C42 42 40 32 30 35 Z"
        fill="rgba(170,130,34,0.25)"
        stroke="url(#peanutGrad)"
        strokeWidth="3"
      />
      {/* Texture grid marks */}
      <line x1="32" y1="45" x2="68" y2="45" stroke="#F9E596" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
      <line x1="32" y1="55" x2="68" y2="55" stroke="#F9E596" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
      <circle cx="36" cy="50" r="3" fill="#D4AF37" />
      <circle cx="64" cy="50" r="3" fill="#D4AF37" />
    </g>
  </svg>
);

// 5. Traditional Hot Chilli SVG
export const ChilliSVG: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={`inline-block shrink-0 ${className}`}>
    <defs>
      <linearGradient id="chilliRed" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F9E596" />
        <stop offset="25%" stopColor="#E74732" />
        <stop offset="80%" stopColor="#921E12" />
        <stop offset="100%" stopColor="#4A0E1A" />
      </linearGradient>
    </defs>
    {/* Curved chilli body */}
    <path
      d="M75 22 C65 20 45 35 35 52 C25 68 20 82 25 85 C30 87 40 76 52 64 C64 52 82 32 78 24 Z"
      fill="url(#chilliRed)"
      stroke="#D4AF37"
      strokeWidth="1.8"
    />
    {/* Green cap / stem */}
    <path d="M74 20 C76 12 85 8 90 6" fill="none" stroke="#85AE72" strokeWidth="3" strokeLinecap="round" />
    <path d="M70 24 C74 18 80 22 78 26 Z" fill="#4F7040" stroke="#D4AF37" strokeWidth="1" />
  </svg>
);

// 6. 30-Year Heritage Emblem Badge
export const Heritage30YearsSVG: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={`inline-block shrink-0 ${className}`}>
    <defs>
      <linearGradient id="emblemGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F9E596" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#AA8222" />
      </linearGradient>
    </defs>
    {/* Outer decorative teeth */}
    <circle cx="60" cy="60" r="54" fill="none" stroke="url(#emblemGold)" strokeWidth="1.5" strokeDasharray="3,3" />
    <circle cx="60" cy="60" r="48" fill="rgba(42,17,50,0.85)" stroke="url(#emblemGold)" strokeWidth="2.5" />
    <circle cx="60" cy="60" r="42" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2,2" />
    {/* Laurel leaves left */}
    <path d="M26 62 Q20 45 30 35 Q35 48 26 62" fill="url(#emblemGold)" opacity="0.8" />
    {/* Laurel leaves right */}
    <path d="M94 62 Q100 45 90 35 Q85 48 94 62" fill="url(#emblemGold)" opacity="0.8" />
    {/* Text: 30+ */}
    <text
      x="60"
      y="58"
      textAnchor="middle"
      fontFamily="Cinzel, serif"
      fontWeight="900"
      fontSize="26"
      fill="url(#emblemGold)"
    >
      30+
    </text>
    {/* Text: YEARS */}
    <text
      x="60"
      y="74"
      textAnchor="middle"
      fontFamily="Marcellus, serif"
      fontWeight="700"
      fontSize="10"
      letterSpacing="3"
      fill="#F9E596"
    >
      YEARS
    </text>
    {/* Text: 1995 */}
    <text
      x="60"
      y="86"
      textAnchor="middle"
      fontFamily="Cinzel, serif"
      fontSize="8"
      letterSpacing="2"
      fill="#D4AF37"
    >
      ESTD 1995
    </text>
  </svg>
);

// 7. Gold Ornamental Top and Bottom Borders
export const GoldBorderFlourish: React.FC<{ flip?: boolean; className?: string }> = ({
  flip = false,
  className = '',
}) => (
  <div
    className={`w-full overflow-hidden select-none pointer-events-none ${className} ${
      flip ? 'rotate-180' : ''
    }`}
  >
    <svg
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className="w-full h-5 text-jewel-gold opacity-80"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="flourishGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#AA8222" stopOpacity="0.1" />
          <stop offset="20%" stopColor="#D4AF37" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#F9E596" stopOpacity="1" />
          <stop offset="80%" stopColor="#D4AF37" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#AA8222" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Central continuous ornate wave */}
      <path
        d="M0 12 Q150 0 300 12 T600 12 T900 12 T1200 12"
        fill="none"
        stroke="url(#flourishGold)"
        strokeWidth="1.5"
      />
      {/* Center diamond emblem */}
      <polygon points="600,4 608,12 600,20 592,12" fill="#F9E596" />
      <circle cx="580" cy="12" r="2.5" fill="#D4AF37" />
      <circle cx="620" cy="12" r="2.5" fill="#D4AF37" />
      <circle cx="560" cy="12" r="1.5" fill="#AA8222" />
      <circle cx="640" cy="12" r="1.5" fill="#AA8222" />
    </svg>
  </div>
);

// 8. Corner Flourish SVG for Ornate Boxes
export const CornerFlourishSVG: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br'; className?: string }> = ({
  position,
  className = 'w-6 h-6',
}) => {
  const rotation = {
    tl: '',
    tr: 'rotate-90',
    br: 'rotate-180',
    bl: '-rotate-90',
  }[position];

  return (
    <svg
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute ${className} ${rotation} pointer-events-none`}
    >
      <path
        d="M2 28 L2 6 C2 3.8 3.8 2 6 2 L28 2"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="2.5"
      />
      <circle cx="6" cy="6" r="2" fill="#F9E596" />
      <path d="M2 14 Q14 14 14 2" fill="none" stroke="#F9E596" strokeWidth="1" strokeDasharray="2,2" />
    </svg>
  );
};
