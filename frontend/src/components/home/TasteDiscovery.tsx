import React, { useState } from 'react';
import { Sparkles, Flame, Cookie, Compass } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';
import { useTranslation } from '../../store/useLanguageStore';

interface TasteDiscoveryProps {
  products: Product[];
}

export const TasteDiscovery: React.FC<TasteDiscoveryProps> = ({ products }) => {
  const { t } = useTranslation();
  const [activeTaste, setActiveTaste] = useState<string>('All');

  const tasteTags = [
    { label: 'All Savouries', value: 'All' },
    { label: '🪔 Diwali Special', value: 'Festive' },
    { label: '🔥 Fiery & Spicy', value: 'Spicy' },
    { label: '✨ Ultra Crunchy', value: 'Crunchy' },
    { label: '🍯 Sweet & Spicy', value: 'Sweet & Spicy' },
    { label: '🏛️ Traditional Odia / South', value: 'Traditional' },
    { label: '🍃 Light & Roasted', value: 'Light' },
    { label: '⭐ Bestsellers', value: 'Bestseller' },
  ];

  const filteredProducts = products.filter((p) => {
    if (activeTaste === 'All') return true;
    if (activeTaste === 'Bestseller') return p.is_featured;
    if (activeTaste === 'Mild') return p.spice_level === 'MILD' || p.taste_profiles.includes('Mild');
    if (activeTaste === 'Spicy') return p.spice_level === 'SPICY' || p.spice_level === 'EXTRA_SPICY' || p.taste_profiles.includes('Spicy');
    return p.taste_profiles.some((t: string) => t.toLowerCase() === activeTaste.toLowerCase());
  });

  return (
    <section className="py-20 bg-gradient-to-b from-imperial-dark via-imperial to-imperial-secondary text-white border-y border-gold/30 relative overflow-hidden shadow-royal">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="font-script text-gold text-2xl sm:text-3xl block">Personalised Flavour Guide</span>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-imperial-dark/80 text-gold-light text-xs font-sans font-bold border border-gold/40 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-gold" />
            <span>Interactive Taste Profiler</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            {t('categories.heading', 'Find Your Perfect Crunch & Spice')}
          </h2>
          <div className="royal-divider max-w-xs mx-auto">
            <span className="royal-divider-diamond">✦</span>
          </div>
          <p className="font-serif text-base sm:text-lg text-ivory/85 italic leading-relaxed">
            {t('categories.subheading', 'Whether stocking a Kirana retail store with high-demand tea-time mixtures or craving authentic South Odia savouries for home, explore our fresh batches.')}
          </p>
        </div>

        {/* Taste Profile Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-4 no-scrollbar">
          {tasteTags.map((tag) => {
            const isSelected = activeTaste === tag.value;
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => setActiveTaste(tag.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-sans font-bold transition-all border ${
                  isSelected
                    ? 'bg-gold text-imperial border-gold shadow-gold scale-105 font-black'
                    : 'bg-imperial-dark/80 text-ivory/90 border-gold/30 hover:border-gold hover:text-gold'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Filtered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} cardStyle="standard" />
          ))}
        </div>

      </div>
    </section>
  );
};
