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
    return p.taste_profiles.some(t => t.toLowerCase() === activeTaste.toLowerCase());
  });

  return (
    <section className="py-16 bg-cream-warm border-y border-cream-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold border border-gold-300">
            <Compass className="w-3.5 h-3.5 text-gold-700" />
            <span>Interactive Snack Discovery</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-crimson-900 tracking-tight">
            Find Your Perfect Crunch &amp; Spice
          </h2>
          <p className="text-sm sm:text-base text-spice-muted">
            Whether you run a retail store looking for high-demand tea-time snacks or crave traditional authentic crunch, filter our fresh batches by taste profile.
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
                    ? 'bg-crimson-800 text-cream-warm border-crimson-900 shadow-md scale-105'
                    : 'bg-white text-spice border-cream-border hover:bg-cream-surface hover:border-gold-300'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

