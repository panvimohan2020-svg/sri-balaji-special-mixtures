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
  Check,
  Filter
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
        const hasTaste = product.taste_profiles.some((t: string) => t.toLowerCase() === selectedTaste.toLowerCase());
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-ivory-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-chilli block">
            Authentic Odisha &amp; South Indian Flavours
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-plum-900 mt-1">
            Crispy Savouries &amp; Mixtures Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-cocoa-muted mt-1">
            Handcrafted with 30 years of spice consistency. Available in retail packs and bulk wholesale boxes.
          </p>
        </div>

        {/* Pricing Mode Toggle Card */}
        <div className="inline-flex items-center gap-3 p-2.5 rounded-2xl bg-ivory-warm border border-ivory-border shadow-xs">
          <div className="flex flex-col text-left pl-2">
            <span className="text-[10px] uppercase font-bold text-cocoa-muted">Active Pricing Tier</span>
            <span className="text-xs font-extrabold text-plum-900">
              {isWholesaleMode ? 'Wholesale Pricing (B2B)' : 'Retail Family Pricing'}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleWholesaleMode}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isWholesaleMode
                ? 'bg-plum-900 text-turmeric shadow-plum'
                : 'bg-white text-cocoa border border-ivory-border hover:bg-peach-50'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Switch to {isWholesaleMode ? 'Retail' : 'Wholesale'}</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Category Chips & Controls */}
      <div className="space-y-4">
        
        {/* Top Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-cocoa-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by snack name, ingredients, or taste..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-ivory-border text-xs sm:text-sm text-cocoa placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-chilli focus:border-transparent shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-cocoa"
                aria-label="Clear search text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:col-span-3">
            <div className="relative">
              <ArrowUpDown className="w-4 h-4 text-cocoa-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-ivory-border text-xs sm:text-sm font-semibold text-cocoa focus:outline-none focus:ring-2 focus:ring-chilli shadow-xs appearance-none cursor-pointer"
              >
                <option value="featured">Sort: Featured &amp; Bestsellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical: A to Z</option>
              </select>
            </div>
          </div>

          {/* Wishlist Quick Toggle */}
          <div className="sm:col-span-3">
            <button
              type="button"
              onClick={handleToggleWishlistFilter}
              className={`w-full h-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all border shadow-xs ${
                onlyWishlist
                  ? 'bg-chilli text-white border-chilli shadow-chilli'
                  : 'bg-white text-cocoa border-ivory-border hover:bg-peach-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${onlyWishlist ? 'fill-white' : 'text-chilli'}`} />
              <span>Wishlist ({getWishlistCount()})</span>
            </button>
          </div>

        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedCategory === 'all'
                ? 'bg-plum-900 text-white border-plum-900 shadow-xs'
                : 'bg-white text-cocoa border-ivory-border hover:bg-peach-50'
            }`}
          >
            All Products ({initialProducts.length})
          </button>

          {initialCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.slug)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-plum-900 text-white border-plum-900 shadow-xs'
                    : 'bg-white text-cocoa border-ivory-border hover:bg-peach-50'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Active Filters & Reset Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-bold text-cocoa-muted uppercase tracking-wider text-[10px]">
              Active Filters ({activeFiltersCount}):
            </span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-plum-100 text-plum-900 font-semibold border border-plum-200">
                Category: {initialCategories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                <button type="button" onClick={() => handleCategoryChange('all')}>
                  <X className="w-3 h-3 hover:text-chilli" />
                </button>
              </span>
            )}

            {onlyWishlist && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-peach-100 text-chilli-800 font-semibold border border-peach-300">
                Saved in Wishlist
                <button type="button" onClick={handleToggleWishlistFilter}>
                  <X className="w-3 h-3 hover:text-chilli" />
                </button>
              </span>
            )}

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-turmeric-100 text-cocoa-dark font-semibold border border-turmeric-300">
                Search: &ldquo;{searchQuery}&rdquo;
                <button type="button" onClick={() => setSearchQuery('')}>
                  <X className="w-3 h-3 hover:text-chilli" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-chilli hover:text-chilli-700 font-bold ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}

      </div>

      {/* Product Grid Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-cocoa-muted">
            Showing <strong className="text-plum-900">{filteredProducts.length}</strong> savouries
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-ivory-warm border-2 border-dashed border-ivory-border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-peach-100 border border-peach-200 flex items-center justify-center text-chilli">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-plum-900 mb-1">
              No matching savouries found
            </h3>
            <p className="text-xs text-cocoa-muted max-w-md mx-auto mb-6">
              We couldn't find snacks matching your selected filter criteria. Try clearing search filters or switching categories.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-5 py-2.5 rounded-xl bg-chilli text-white text-xs font-bold uppercase tracking-wider hover:bg-chilli-600 transition-colors shadow-chilli"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} cardStyle="standard" />
            ))}
          </div>
        )}
      </div>

      {/* Recently Viewed Shelf */}
      {recentlyViewedProducts.length > 0 && (
        <section className="pt-12 border-t border-ivory-border">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-chilli" />
            <h3 className="font-display font-bold text-xl text-plum-900">
              Recently Viewed Snacks
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentlyViewedProducts.slice(0, 6).map((rp) => (
              <Link
                key={rp.id}
                to={`/product/${rp.slug}`}
                className="group p-3 rounded-2xl bg-white border border-ivory-border hover:shadow-soft transition-all text-center"
              >
                <div className="aspect-square rounded-xl bg-ivory-warm p-2 mb-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={rp.images?.[0]?.image_url || '/images/products/onion-mixture.png'}
                    alt={rp.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                    loading="lazy"
                  />
                </div>
                <h4 className="font-display font-bold text-xs text-plum-900 line-clamp-1 group-hover:text-chilli transition-colors">
                  {rp.name}
                </h4>
                <span className="text-[10px] text-chilli font-bold block mt-0.5">
                  ₹{rp.variants[0]?.retail_price || 60}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
