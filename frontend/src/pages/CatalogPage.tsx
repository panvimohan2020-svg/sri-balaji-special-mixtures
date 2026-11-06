import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Store, Sparkles, X, SlidersHorizontal } from 'lucide-react';
import { initialCategories, initialProducts } from '../data/initialData';
import { ProductCard } from '../components/common/ProductCard';
import { useCartStore } from '../store/useCartStore';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedTaste, setSelectedTaste] = useState('all');
  const [selectedSpice, setSelectedSpice] = useState('all');

  const { isWholesaleMode, toggleWholesaleMode } = useCartStore();

  // Sync category param if updated via URL
  React.useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category match
      if (selectedCategory !== 'all') {
        const cat = initialCategories.find(c => c.slug === selectedCategory);
        if (cat && product.category_id !== cat.id) return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesIng = product.ingredients?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }

      // Taste profile match
      if (selectedTaste !== 'all') {
        const hasTaste = product.taste_profiles.some(t => t.toLowerCase() === selectedTaste.toLowerCase());
        if (!hasTaste) return false;
      }

      // Spice match
      if (selectedSpice !== 'all') {
        if (product.spice_level.toLowerCase() !== selectedSpice.toLowerCase()) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, selectedTaste, selectedSpice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header & Mode Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cream-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
            Complete Product Catalogue
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-crimson-900 mt-1">
            Crispy Savouries &amp; Wafers
          </h1>
          <p className="text-xs sm:text-sm text-spice-muted mt-1">
            Handcrafted with authentic spices, fresh batches, and multiple packaging options.
          </p>
        </div>

        {/* Pricing Mode Toggle Card */}
        <div className="inline-flex items-center gap-3 p-2 rounded-2xl bg-cream-surface border border-cream-border">
          <div className="flex flex-col text-left pl-2">
            <span className="text-[10px] uppercase font-bold text-spice-muted">Current View</span>
            <span className="text-xs font-extrabold text-spice-dark">
              {isWholesaleMode ? 'Wholesale Pricing (B2B)' : 'Retail Family Pricing'}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleWholesaleMode}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isWholesaleMode
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-spice border border-cream-border hover:bg-cream-warm'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Switch to {isWholesaleMode ? 'Retail' : 'Wholesale'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-white p-5 rounded-2xl border border-cream-border shadow-soft">
        
        {/* Top Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-spice-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by snack name, ingredient (e.g. cashews, potato, garlic)..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-cream-border focus:border-crimson-700 focus:ring-1 focus:ring-crimson-700 outline-none bg-cream-warm/40 text-spice text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-spice-muted hover:text-spice"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold transition-all border ${
              selectedCategory === 'all'
                ? 'bg-crimson-800 text-cream-warm border-crimson-900 shadow-sm'
                : 'bg-cream-warm text-spice border-cream-border hover:bg-cream-surface'
            }`}
          >
            All Snacks ({initialProducts.length})
          </button>
          {initialCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold transition-all border ${
                selectedCategory === cat.slug
                  ? 'bg-crimson-800 text-cream-warm border-crimson-900 shadow-sm'
                  : 'bg-cream-warm text-spice border-cream-border hover:bg-cream-surface'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Taste & Spice Subfilters */}
        <div className="pt-3 border-t border-cream-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-spice-muted flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Taste:</span>
            </span>
            {['all', 'Crunchy', 'Spicy', 'Traditional', 'Mild', 'Salty'].map((taste) => (
              <button
                key={taste}
                type="button"
                onClick={() => setSelectedTaste(taste)}
                className={`px-2.5 py-1 rounded-lg font-semibold border ${
                  selectedTaste.toLowerCase() === taste.toLowerCase()
                    ? 'bg-gold-500 text-spice-dark border-gold-600 font-bold'
                    : 'bg-white text-spice-muted border-cream-border hover:bg-cream-warm'
                }`}
              >
                {taste === 'all' ? 'Any' : taste}
              </button>
            ))}
          </div>

          <div className="text-spice-muted font-medium">
            Showing <strong className="text-spice-dark">{filteredProducts.length}</strong> items
          </div>
        </div>

      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-border p-8 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-cream-surface flex items-center justify-center text-spice-muted">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-spice-dark">No snacks match your search</h3>
          <p className="text-xs text-spice-muted max-w-md mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedTaste('all');
              setSelectedSpice('all');
              searchParams.delete('category');
              setSearchParams(searchParams);
            }}
            className="px-4 py-2 bg-crimson-800 text-cream-warm rounded-xl text-xs font-bold hover:bg-crimson-900 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};

