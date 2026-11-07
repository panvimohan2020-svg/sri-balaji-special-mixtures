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
    sm: isCrest ? 'h-10 w-auto' : 'h-8 sm:h-9 w-auto max-w-[200px]',
    md: isCrest ? 'h-14 w-auto' : 'h-11 sm:h-12 w-auto max-w-[240px]',
    lg: isCrest ? 'h-20 w-auto' : 'h-14 sm:h-16 w-auto max-w-[280px]',
    xl: isCrest ? 'h-28 w-auto' : 'h-18 sm:h-20 w-auto max-w-[340px]',
  };

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Sri Balaji Special Mixtures – Taste the Tradition"
        className={`${sizeStyles[size]} object-contain drop-shadow-sm transition-transform hover:scale-[1.02] duration-300`}
        loading="eager"
      />
    </div>
  );
};
