import React, { useState } from 'react';
import { Sparkles, Flame, Cookie, Compass } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';

interface TasteDiscoveryProps {
  products: Product[];
}

export const TasteDiscovery: React.FC<TasteDiscoveryProps> = ({ products }) => {
  const [activeTaste, setActiveTaste] = useState<string>('All');

  const tasteTags = [
    { label: 'All Savouries', value: 'All' },
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
    <section className="py-16 bg-ivory-warm border-y border-ivory-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-turmeric-100 text-cocoa-dark text-xs font-bold border border-turmeric-300">
            <Compass className="w-3.5 h-3.5 text-turmeric-700" />
            <span>Interactive Taste Profiler</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-plum-900 tracking-tight">
            Find Your Perfect Crunch &amp; Spice
          </h2>
          <p className="text-sm sm:text-base text-cocoa-muted">
            Whether stocking a Kirana retail store with high-demand tea-time mixtures or craving authentic South Odia savouries for home, explore our fresh batches.
          </p>
        </div>

        {/* Taste Profile Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {tasteTags.map((tag) => {
            const isSelected = activeTaste === tag.value;
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => setActiveTaste(tag.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all border ${
                  isSelected
                    ? 'bg-plum-900 text-turmeric border-plum-900 shadow-plum scale-105'
                    : 'bg-white text-cocoa border-ivory-border hover:bg-peach-50 hover:border-chilli-200'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Filtered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} cardStyle="standard" />
          ))}
        </div>

      </div>
    </section>
  );
};
