import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Store, 
  Sparkles, 
  X, 
  SlidersHorizontal, 
  Heart, 
  ArrowUpDown, 
  Clock, 
  RotateCcw,
  Flame,
  Check
} from 'lucide-react';
import { initialCategories, initialProducts } from '../data/initialData';
import { ProductCard } from '../components/common/ProductCard';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useRecentlyViewedStore } from '../store/useRecentlyViewedStore';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const filterParam = searchParams.get('filter') || 'all';
  const searchFocus = searchParams.get('focus') === 'search';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedTaste, setSelectedTaste] = useState('all');
  const [selectedSpice, setSelectedSpice] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [onlyWishlist, setOnlyWishlist] = useState(filterParam === 'wishlist');

  const { isWholesaleMode, toggleWholesaleMode } = useCartStore();
  const { isInWishlist, getWishlistCount } = useWishlistStore();
  const { recentProductIds } = useRecentlyViewedStore();

  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchFocus]);

  // Sync category param if updated via URL
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    setOnlyWishlist(filterParam === 'wishlist');
  }, [filterParam]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleToggleWishlistFilter = () => {
    const nextState = !onlyWishlist;
    setOnlyWishlist(nextState);
    if (nextState) {
      searchParams.set('filter', 'wishlist');
    } else {
      searchParams.delete('filter');
    }
    setSearchParams(searchParams);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTaste('all');
    setSelectedSpice('all');
    setSortBy('featured');
    setOnlyWishlist(false);
    searchParams.delete('category');
    searchParams.delete('filter');
    searchParams.delete('focus');
    setSearchParams(searchParams);
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = initialProducts.filter((product) => {
      // Wishlist only filter
      if (onlyWishlist && !isInWishlist(product.id)) {
        return false;
      }

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

    // Sorting
    return list.sort((a, b) => {
      const getMinPrice = (p: typeof a) => {
        const v = p.variants[0];
        if (!v) return 0;
        return isWholesaleMode ? (v.wholesale_price || v.retail_price) : (v.retail_price || v.wholesale_price);
      };

      if (sortBy === 'price-asc') {
        return getMinPrice(a) - getMinPrice(b);
      }
      if (sortBy === 'price-desc') {
        return getMinPrice(b) - getMinPrice(a);
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      // 'featured'
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, selectedTaste, selectedSpice, onlyWishlist, sortBy, isWholesaleMode, isInWishlist]);

  // Recently viewed products
  const recentlyViewedProducts = useMemo(() => {
    return recentProductIds
      .map(id => initialProducts.find(p => p.id === id))
      .filter((p): p is (typeof initialProducts)[0] => Boolean(p));
  }, [recentProductIds]);

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedTaste !== 'all' ? 1 : 0) +
    (selectedSpice !== 'all' ? 1 : 0) +
    (onlyWishlist ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header & Mode Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cream-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
            Authentic Odisha &amp; South Indian Flavours
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-crimson-900 mt-1">
            Crispy Savouries &amp; Wafers Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-spice-muted mt-1">
            Handcrafted with 30 years of spice consistency. Available in retail packs and bulk wholesale boxes.
          </p>
        </div>

        {/* Pricing Mode Toggle Card */}
        <div className="inline-flex items-center gap-3 p-2.5 rounded-2xl bg-cream-surface border border-cream-border shadow-xs">
          <div className="flex flex-col text-left pl-2">
            <span className="text-[10px] uppercase font-bold text-spice-muted">Active Pricing Tier</span>
            <span className="text-xs font-extrabold text-spice-dark">
              {isWholesaleMode ? 'Wholesale Pricing (B2B)' : 'Retail Family Pricing'}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleWholesaleMode}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isWholesaleMode
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                : 'bg-white text-spice border border-cream-border hover:bg-cream-warm'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Switch to {isWholesaleMode ? 'Retail' : 'Wholesale'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-white p-5 rounded-3xl border border-cream-border shadow-soft">
        
        {/* Top Search Input & Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-grow w-full">
            <Search className="w-5 h-5 text-spice-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by snack name, ingredients (e.g. onion, groundnuts, chuda, sesame)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-cream-border focus:border-crimson-700 focus:ring-1 focus:ring-crimson-700 outline-none bg-cream-warm/40 text-spice text-sm placeholder:text-spice-muted/70"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-spice-muted hover:text-spice p-1"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <div className="relative w-full sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort snacks by"
                className="w-full py-3 px-3.5 bg-cream-warm/60 border border-cream-border rounded-2xl text-xs font-bold text-spice outline-none focus:border-crimson-800"
              >
                <option value="featured">Featured / Bestsellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            {/* Wishlist quick filter toggle button */}
            <button
              type="button"
              onClick={handleToggleWishlistFilter}
              aria-label="Toggle wishlist filter"
              className={`flex items-center gap-1.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all border shrink-0 ${
                onlyWishlist
                  ? 'bg-crimson-800 text-white border-crimson-900 shadow-sm'
                  : 'bg-cream-warm/60 text-spice border-cream-border hover:bg-cream-surface'
              }`}
            >
              <Heart className={`w-4 h-4 ${onlyWishlist ? 'fill-white' : ''}`} />
              <span className="hidden sm:inline">Wishlist</span>
              <span className="text-[11px] opacity-90">({getWishlistCount()})</span>
            </button>
          </div>
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

        {/* Taste Profile & Spice Subfilters */}
        <div className="pt-3 border-t border-cream-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-spice-muted flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-700" />
              <span>Taste:</span>
            </span>
            {['all', 'Crunchy', 'Savory', 'Spicy', 'Sweet & Spicy', 'Light'].map((taste) => (
              <button
                key={taste}
                type="button"
                onClick={() => setSelectedTaste(taste)}
                className={`px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                  selectedTaste.toLowerCase() === taste.toLowerCase()
                    ? 'bg-gold-500 text-spice-dark border-gold-600 font-bold shadow-xs'
                    : 'bg-white text-spice-muted border-cream-border hover:bg-cream-warm'
                }`}
              >
                {taste === 'all' ? 'All' : taste}
              </button>
            ))}

            <span className="text-cream-border mx-1">|</span>

            <span className="font-bold text-spice-muted flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Spice:</span>
            </span>
            {['all', 'MILD', 'MEDIUM', 'SPICY'].map((spice) => (
              <button
                key={spice}
                type="button"
                onClick={() => setSelectedSpice(spice)}
                className={`px-2.5 py-1 rounded-lg font-semibold border capitalize transition-all ${
                  selectedSpice.toLowerCase() === spice.toLowerCase()
                    ? 'bg-crimson-800 text-white border-crimson-900 font-bold shadow-xs'
                    : 'bg-white text-spice-muted border-cream-border hover:bg-cream-warm'
                }`}
              >
                {spice === 'all' ? 'Any' : spice.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-bold text-crimson-800 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}

            <div className="text-spice-muted font-medium">
              Showing <strong className="text-spice-dark">{filteredProducts.length}</strong> items
            </div>
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
        <div className="text-center py-16 bg-white rounded-3xl border border-cream-border p-8 space-y-4 shadow-soft">
          <div className="w-14 h-14 mx-auto rounded-full bg-cream-surface flex items-center justify-center text-spice-muted">
            <Search className="w-7 h-7 text-brand-700" />
          </div>
          <h3 className="font-display font-bold text-xl text-spice-dark">No snacks match your active filters</h3>
          <p className="text-xs sm:text-sm text-spice-muted max-w-md mx-auto leading-relaxed">
            {onlyWishlist 
              ? "You haven't added any snacks to your wishlist yet. Click the heart icon on any product to save it."
              : "Try adjusting your search terms or clearing taste and spice filters to view all authentic products."}
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="px-5 py-2.5 bg-crimson-800 text-cream-warm rounded-xl text-xs font-bold hover:bg-crimson-900 transition-colors shadow-sm"
          >
            Show All Snacks
          </button>
        </div>
      )}

      {/* Recently Viewed Carousel Shelf */}
      {recentlyViewedProducts.length > 0 && (
        <section className="pt-8 border-t border-cream-border space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-crimson-800" />
            <h3 className="font-display font-bold text-lg text-spice-dark">
              Recently Explored Snacks
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentlyViewedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className="group p-2.5 rounded-2xl bg-white border border-cream-border hover:border-gold-300 hover:shadow-soft transition-all text-center flex flex-col justify-between"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-cream-surface mb-2">
                  <img
                    src={p.images?.[0]?.image_url || '/images/products/onion-mixture.png'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="font-display font-bold text-xs text-spice-dark group-hover:text-crimson-800 line-clamp-1">
                  {p.name}
                </h4>
                <span className="text-[11px] font-bold text-crimson-900 mt-1 block">
                  ₹{p.variants[0]?.retail_price}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
