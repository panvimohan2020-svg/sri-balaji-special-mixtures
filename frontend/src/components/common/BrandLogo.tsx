import React from 'react';

interface BrandLogoProps {
  variant?: 'compact' | 'with-badge' | 'crest';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'compact',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  // Use the authentic Sri Balaji logo extracted directly from verified brand packaging
  const logoSrc =
    variant === 'crest'
      ? '/images/brand/sri-balaji-full-crest-transparent.png'
      : variant === 'with-badge'
      ? '/images/brand/sri-balaji-logo-with-badge-transparent.png'
      : '/images/brand/sri-balaji-logo-compact-transparent.png';

  const sizeStyles = {
    sm: 'h-9 w-auto max-w-[110px]',
    md: 'h-12 w-auto max-w-[150px]',
    lg: 'h-16 w-auto max-w-[190px]',
    xl: 'h-24 w-auto max-w-[260px]',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Sri Balaji Special Mixtures – Taste the Tradition"
        className={`${sizeStyles[size]} object-contain drop-shadow-sm transition-transform hover:scale-105 duration-300`}
        loading="eager"
      />
      {showSubtitle && (
        <div className="flex flex-col justify-center">
          <span className="font-display font-black text-xl tracking-wider text-plum-900 leading-tight">
            SRI BALAJI
          </span>
          <span className="text-[10px] font-bold text-chilli-600 uppercase tracking-widest leading-none mt-0.5">
            Special Mixtures • Estd 1995
          </span>
          <span className="text-[9px] font-semibold text-cocoa-muted tracking-wide leading-none mt-0.5 hidden sm:block">
            Paralakhemundi, Odisha
          </span>
        </div>
      )}
    </div>
  );
};

