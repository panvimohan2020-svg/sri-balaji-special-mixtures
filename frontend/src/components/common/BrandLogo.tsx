import React from 'react';

interface BrandLogoProps {
  variant?: 'compact' | 'with-badge' | 'crest' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  // Official Sri Balaji Brand Logo Asset (circular emblem with 30 years heritage medal)
  const logoSrc = '/images/brand/sri-balaji-official-logo.jpg';

  const sizeStyles = {
    sm: 'h-9 w-9 sm:h-10 sm:w-10 max-h-10 max-w-10',
    md: 'h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 xl:h-[68px] xl:w-[68px] max-h-[68px] max-w-[68px]',
    lg: 'h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 max-h-28 max-w-28',
    xl: 'h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44 max-h-44 max-w-44',
  };

  return (
    <div className={`flex items-center justify-center shrink-0 select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Sri Balaji Special Mixtures – Fresh • Crispy • Tasty – Trusted Since 30 Years"
        className={`${sizeStyles[size]} object-contain object-center rounded-xl shadow-xs border border-gold/40 hover:border-gold/70 transition-transform hover:scale-[1.02] duration-300`}
        loading="eager"
      />
    </div>
  );
};

