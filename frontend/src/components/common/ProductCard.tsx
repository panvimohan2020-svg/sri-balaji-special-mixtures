import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Flame, Check, Sparkles, Heart, Eye, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { QuickViewModal } from './QuickViewModal';
import { Product, ProductVariant } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { initialBusinessSettings } from '../../data/initialData';
import { generateSingleProductInquiryUrl } from '../../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  cardStyle?: 'standard' | 'featured' | 'collection';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cardStyle = 'standard',
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants?.find((v) => v.is_in_stock) || product.variants?.[0]
  );
  const [added, setAdded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const { isWholesaleMode, addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addToast } = useNotificationStore();

  if (!selectedVariant) return null;

  const isFavorited = isInWishlist(product.id);

  const currentPrice = isWholesaleMode
    ? selectedVariant.wholesale_price || selectedVariant.retail_price
    : selectedVariant.retail_price || selectedVariant.wholesale_price;

  const primaryImage =
    product.images?.[0]?.image_url || '/images/products/onion-mixture.png';

  const savingsPercent =
    isWholesaleMode && selectedVariant.retail_price && selectedVariant.wholesale_price
      ? Math.round(
          ((selectedVariant.retail_price - selectedVariant.wholesale_price) /
            selectedVariant.retail_price) *
            100
        )
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, selectedVariant, 1);
    setAdded(true);
    addToast({
      title: `Added ${product.name}`,
      description: `1 pkg (${selectedVariant.weight_label}) • ₹${currentPrice}`,
      type: isWholesaleMode ? 'wholesale' : 'success',
      actionLabel: 'View Cart',
      actionUrl: '/cart',
    });
    setTimeout(() => setAdded(false), 1400);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    addToast({
      title: isFavorited ? 'Removed from Wishlist' : 'Saved to Wishlist',
      description: product.name,
      type: 'info',
    });
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = generateSingleProductInquiryUrl(
      product.name,
      selectedVariant.weight_label,
      initialBusinessSettings.whatsapp_number
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // -------------------------------------------------------------
  // STYLE A: FEATURED PRODUCT CARD (Editorial Highlight Layout)
  // -------------------------------------------------------------
  if (cardStyle === 'featured') {
    return (
      <>
        <div className="relative rounded-3xl bg-gradient-to-br from-plum-900 via-plum-950 to-cocoa-dark text-white p-6 sm:p-8 overflow-hidden shadow-plum border border-plum-800 transition-all group">
          {/* Subtle decorative circles */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-turmeric/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-chilli/15 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Image Box */}
            <div className="md:col-span-5 relative">
              <div className="relative aspect-square rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-center overflow-hidden">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all"
                  aria-label="Toggle Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'text-chilli fill-chilli' : ''}`} />
                </button>
              </div>
            </div>

            {/* Content & Actions */}
            <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-turmeric text-plum-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3 h-3 fill-plum-950" />
                    Signature Bestseller
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-ivory text-xs font-semibold">
                    {product.category?.name || 'Savouries'}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-ivory/80 mt-2 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Weight Selector */}
              <div>
                <span className="text-[11px] font-bold text-ivory/70 uppercase tracking-wider block mb-1.5">
                  Choose Pack Size:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants?.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedVariant.id === v.id
                          ? 'bg-turmeric text-plum-900 border-turmeric shadow-glow'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {v.weight_label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Primary CTA */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-black text-turmeric">
                      ₹{currentPrice}
                    </span>
                    <span className="text-xs text-ivory/60 font-medium">
                      /{selectedVariant.weight_label}
                    </span>
                  </div>
                  {isWholesaleMode && savingsPercent > 0 && (
                    <span className="text-[11px] text-pista-300 font-bold block">
                      Save {savingsPercent}% Wholesale Margin
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickViewOpen(true)}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Quick View"
                    aria-label="Quick preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-chilli active:scale-95 ${
                      added ? 'bg-pista-600 text-white' : 'bg-chilli hover:bg-chilli-600 text-white'
                    }`}
                  >
                    {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    <span>{added ? 'Added to Bag' : 'Add to Bag'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <QuickViewModal
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      </>
    );
  }

  // -------------------------------------------------------------
  // STYLE C: SIGNATURE COLLECTION CARD (Editorial Combo Showcase)
  // -------------------------------------------------------------
  if (cardStyle === 'collection') {
    return (
      <>
        <div className="relative rounded-3xl bg-peach-50 border border-peach-200 p-6 flex flex-col justify-between hover:shadow-elevated transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-chilli text-white text-[10px] font-bold uppercase tracking-wider">
                Special Collection
              </span>
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="w-8 h-8 rounded-full bg-white hover:bg-peach-100 flex items-center justify-center text-cocoa transition-colors"
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'text-chilli fill-chilli' : ''}`} />
              </button>
            </div>

            <div className="aspect-[4/3] rounded-2xl bg-white p-3 mb-4 overflow-hidden flex items-center justify-center border border-peach-200">
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <h4 className="font-display font-bold text-lg text-plum-900 group-hover:text-chilli transition-colors">
              {product.name}
            </h4>
            <p className="text-xs text-cocoa-muted mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-peach-200 flex items-center justify-between">
            <div>
              <span className="text-xl font-display font-black text-plum-900">
                ₹{currentPrice}
              </span>
              <span className="text-[10px] text-cocoa-muted block">
                {selectedVariant.weight_label}
              </span>
            </div>

            <Link
              to={`/product/${product.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-plum-900 text-white font-bold text-xs hover:bg-plum-800 transition-colors"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <QuickViewModal
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      </>
    );
  }

  // -------------------------------------------------------------
  // STYLE B: STANDARD PRODUCT CARD (Default Modern Food-Brand Card)
  // -------------------------------------------------------------
  return (
    <>
      <div className="group relative bg-white rounded-3xl border border-ivory-border overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between hover:border-turmeric-400">
        
        {/* Top Image Section (1:1 Aspect Ratio) */}
        <div className="relative aspect-square bg-gradient-to-b from-ivory-warm to-white overflow-hidden p-3">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={primaryImage}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {/* Pure Veg Indicator */}
            {product.food_classification === 'VEGETARIAN' && (
              <div className="w-5 h-5 rounded border border-veg bg-white flex items-center justify-center shadow-xs" title="100% Pure Vegetarian">
                <div className="w-2.5 h-2.5 rounded-full bg-veg" />
              </div>
            )}

            {/* Spice Badge */}
            {product.spice_level && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-chilli-700 text-[10px] font-bold border border-chilli-200 shadow-xs">
                <Flame className="w-3 h-3 text-chilli fill-chilli" />
                <span>{product.spice_level}</span>
              </span>
            )}

            {/* Taste Tag */}
            {product.taste_profiles?.[0] && (
              <span className="inline-block px-2 py-0.5 rounded-full bg-turmeric-100/90 backdrop-blur-md text-cocoa-dark text-[10px] font-bold border border-turmeric-300 shadow-xs">
                {product.taste_profiles[0]}
              </span>
            )}
          </div>

          {/* Top-Right Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            {/* Wishlist Toggle */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
                isFavorited
                  ? 'bg-chilli text-white'
                  : 'bg-white/90 text-cocoa hover:text-chilli hover:bg-white'
              }`}
              aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
            </button>

            {/* Quick View Button */}
            <button
              type="button"
              onClick={() => setIsQuickViewOpen(true)}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-cocoa hover:text-chilli flex items-center justify-center shadow-sm opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
              aria-label="Quick View"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Wholesale Margin Tag */}
          {isWholesaleMode && savingsPercent > 0 && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-turmeric text-plum-950 font-black text-[10px] shadow-sm">
              Save {savingsPercent}%
            </div>
          )}
        </div>

        {/* Card Body & Details */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
          
          <div>
            <div className="flex items-center justify-between text-[11px] text-cocoa-muted mb-1">
              <span>{product.category?.name || 'Savouries'}</span>
              {selectedVariant.is_in_stock ? (
                <span className="text-pista-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-pista" /> Fresh Batch
                </span>
              ) : (
                <span className="text-chilli-600 font-semibold">Out of Stock</span>
              )}
            </div>

            <Link to={`/product/${product.slug}`} className="block group-hover:text-chilli transition-colors">
              <h3 className="font-display font-bold text-base sm:text-lg text-plum-900 leading-snug line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-cocoa-muted line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>

          {/* Weight Variant Chips */}
          <div>
            <div className="flex flex-wrap gap-1.5">
              {product.variants?.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                    selectedVariant.id === v.id
                      ? 'bg-plum-900 text-white border-plum-900 shadow-xs'
                      : 'bg-ivory-warm text-cocoa border-ivory-border hover:bg-peach-50'
                  }`}
                >
                  {v.weight_label}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Add to Bag */}
          <div className="pt-3 border-t border-ivory-border flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-display font-extrabold text-plum-900">
                  ₹{currentPrice}
                </span>
                <span className="text-[10px] text-cocoa-muted">
                  /{selectedVariant.weight_label}
                </span>
              </div>
              {isWholesaleMode && selectedVariant.retail_price && (
                <span className="text-[10px] text-stone-400 line-through block">
                  MRP: ₹{selectedVariant.retail_price}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-9 h-9 rounded-xl bg-pista-50 hover:bg-pista-100 border border-pista-200 flex items-center justify-center transition-colors"
                title="Wholesale WhatsApp Enquiry"
                aria-label="Enquire on WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" variant="green" />
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={added || !selectedVariant.is_in_stock}
                className={`flex items-center gap-1 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                  added
                    ? 'bg-pista-600 text-white'
                    : 'bg-chilli hover:bg-chilli-600 text-white shadow-chilli'
                }`}
              >
                {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{added ? 'Added' : 'Add'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};
