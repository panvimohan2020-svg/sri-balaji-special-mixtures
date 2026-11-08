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
  showSubtitle = true,
}) => {
  // Use official redesigned vector brand assets
  const isCrest = variant === 'crest' || variant === 'with-badge';
  const logoSrc = isCrest
    ? '/images/brand/sri-balaji-brand-logo.svg'
    : '/images/brand/sri-balaji-logo-horizontal.svg';

  const sizeStyles = {
    sm: isCrest 
      ? 'h-10 sm:h-12 w-auto' 
      : 'h-9 sm:h-10 lg:h-11 w-auto max-w-[200px]',
    md: isCrest 
      ? 'h-16 sm:h-18 lg:h-20 w-auto' 
      : 'h-12 sm:h-13 lg:h-[54px] xl:h-[58px] w-auto max-w-[250px] sm:max-w-[285px] lg:max-w-[320px] xl:max-w-[340px]',
    lg: isCrest 
      ? 'h-22 sm:h-26 lg:h-28 w-auto' 
      : 'h-16 sm:h-20 lg:h-24 w-auto max-w-[340px] sm:max-w-[400px]',
    xl: isCrest 
      ? 'h-32 sm:h-36 w-auto' 
      : 'h-24 sm:h-28 lg:h-32 w-auto max-w-[460px]',
  };

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Sri Balaji Special Mixtures – Taste the Tradition"
        className={`${sizeStyles[size]} object-contain filter drop-shadow-md transition-transform hover:scale-[1.02] duration-300`}
        loading="eager"
      />
    </div>
  );
};
