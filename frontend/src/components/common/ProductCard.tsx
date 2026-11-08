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
import { useTranslation } from '../../store/useLanguageStore';
import { trackMarketingEvent } from '../../utils/analytics';

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
  const { t } = useTranslation();

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
    trackMarketingEvent('ADD_TO_CART', { productId: product.id });
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
  // STYLE A: FEATURED PRODUCT CARD (Royal Imperial Highlight)
  // -------------------------------------------------------------
  if (cardStyle === 'featured') {
    return (
      <>
        <div className="relative rounded-3xl bg-gradient-to-br from-imperial via-imperial-secondary to-imperial-dark text-white p-6 sm:p-8 overflow-hidden shadow-royal border-2 border-gold/40 transition-all group">
          {/* Subtle decorative radiant glows */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-emerald/15 blur-3xl pointer-events-none" />

          {/* Decorative traditional corner stars */}
          <div className="absolute top-3 left-4 text-gold/40 text-xs pointer-events-none select-none">✦</div>
          <div className="absolute top-3 right-4 text-gold/40 text-xs pointer-events-none select-none">✦</div>
          <div className="absolute bottom-3 left-4 text-gold/40 text-xs pointer-events-none select-none">✦</div>
          <div className="absolute bottom-3 right-4 text-gold/40 text-xs pointer-events-none select-none">✦</div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Image Box */}
            <div className="md:col-span-5 relative">
              <div className="relative aspect-square rounded-2xl bg-white/5 border border-gold/30 p-4 flex items-center justify-center overflow-hidden">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-lg"
                />
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-imperial-dark/80 hover:bg-imperial backdrop-blur-md flex items-center justify-center text-white border border-gold/30 transition-all active:scale-95"
                  aria-label="Toggle Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'text-gold fill-gold' : 'text-white'}`} />
                </button>
              </div>
            </div>

            {/* Content & Actions */}
            <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {(product.product_label?.toUpperCase() === 'NEW LAUNCH' || product.slug === 'kastha-gatiya') ? (
                    <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600 via-crimson to-amber-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-gold border border-gold animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 fill-gold text-gold" />
                      New Launch • Diwali Special 2026
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-gold text-imperial text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-gold">
                      <Sparkles className="w-3 h-3 fill-imperial" />
                      Signature Bestseller
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-gold-light border border-gold/30 text-xs font-semibold">
                    {product.category?.name || 'Savouries'}
                  </span>
                  {product.tagline && (
                    <span className="font-script text-gold text-sm italic">
                      &ldquo;{product.tagline}&rdquo;
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                  {product.name}
                </h3>
                <p className="font-serif text-sm sm:text-base text-ivory/85 mt-2 line-clamp-2 leading-relaxed italic">
                  &ldquo;{product.description}&rdquo;
                </p>
              </div>

              {/* Weight Selector */}
              <div>
                <span className="text-[11px] font-sans font-bold text-gold uppercase tracking-wider block mb-1.5">
                  Choose Pack Size:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants?.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all border ${
                        selectedVariant.id === v.id
                          ? 'bg-gold text-imperial border-gold shadow-gold font-black'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {v.weight_label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Primary CTA */}
              <div className="pt-4 border-t border-gold/20 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-sans font-black text-gold">
                      ₹{currentPrice}
                    </span>
                    <span className="text-xs text-ivory/70 font-sans font-medium">
                      /{selectedVariant.weight_label}
                    </span>
                  </div>
                  {isWholesaleMode && savingsPercent > 0 && (
                    <span className="text-[11px] text-emerald-soft font-bold block">
                      Save {savingsPercent}% Wholesale Margin
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickViewOpen(true)}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-gold border border-gold/30 transition-colors"
                    title="Quick View"
                    aria-label="Quick preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Primary CTA: Saffron Gold background with Deep Purple text */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`btn-royal-gold inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-gold active:scale-95 ${
                      added ? 'bg-emerald text-white' : ''
                    }`}
                  >
                    {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    <span>{added ? t('catalog.added', 'Added to Bag') : t('catalog.addToBag', 'Add to Bag')}</span>
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
        <div className="relative rounded-3xl bg-white border border-gold/30 p-6 flex flex-col justify-between hover:shadow-royal hover:border-gold transition-all duration-300 group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald text-white text-[10px] font-sans font-bold uppercase tracking-wider shadow-xs">
                {t('catalog.specialCollection', 'Special Collection')}
              </span>
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="w-8 h-8 rounded-full bg-white hover:bg-cream flex items-center justify-center text-cocoa border border-gold/20 transition-colors"
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'text-gold fill-gold' : ''}`} />
              </button>
            </div>

            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-b from-ivory to-white p-3 mb-4 overflow-hidden flex items-center justify-center border border-gold/20">
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-sm"
              />
            </div>

            <h4 className="font-display font-bold text-lg text-imperial group-hover:text-gold-deep transition-colors tracking-tight">
              {product.name}
            </h4>
            <p className="font-serif text-xs text-cocoa-muted mt-1 line-clamp-2 italic leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-gold/15 flex items-center justify-between">
            <div>
              <span className="text-xl font-sans font-black text-imperial">
                ₹{currentPrice}
              </span>
              <span className="text-[10px] text-cocoa-muted font-sans block">
                {selectedVariant.weight_label}
              </span>
            </div>

            {/* Secondary CTA: Deep Purple with Gold borders & text */}
            <Link
              to={`/product/${product.slug}`}
              className="btn-royal-purple inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
            >
              <span>{t('catalog.explore', 'Explore')}</span>
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
  // STYLE B: STANDARD PRODUCT CARD (Ivory/Cream with Gold & Emerald Trim)
  // -------------------------------------------------------------
  return (
    <>
      <div className="group relative bg-white rounded-3xl border border-gold/25 overflow-hidden shadow-soft hover:shadow-royal hover:border-gold transition-all duration-300 flex flex-col justify-between">
        
        {/* Top Image Section (1:1 Aspect Ratio) */}
        <div className="relative aspect-square bg-gradient-to-b from-ivory to-white overflow-hidden p-3 border-b border-gold/15">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={primaryImage}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-sm"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {/* New Launch Festive Badge */}
            {(product.product_label?.toUpperCase() === 'NEW LAUNCH' || product.slug === 'kastha-gatiya') && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600 via-crimson to-amber-600 text-white text-[10px] font-sans font-black uppercase tracking-wider shadow-md border border-gold animate-pulse">
                <Sparkles className="w-3 h-3 fill-gold text-gold" />
                <span>NEW LAUNCH</span>
              </span>
            )}

            {/* Collection Tag */}
            {product.collection && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-imperial-dark/95 text-gold text-[9px] font-sans font-bold border border-gold/40 shadow-xs">
                <span>✦ {product.collection}</span>
              </span>
            )}

            {/* Pure Veg Indicator */}
            {product.food_classification === 'VEGETARIAN' && (
              <div className="w-5 h-5 rounded border border-emerald bg-white flex items-center justify-center shadow-xs" title="100% Pure Vegetarian">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald" />
              </div>
            )}

            {/* Spice Badge */}
            {product.spice_level && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-cocoa text-[10px] font-sans font-bold border border-gold/30 shadow-xs">
                <Flame className="w-3 h-3 text-gold-rich fill-gold" />
                <span>{product.spice_level}</span>
              </span>
            )}

            {/* Taste Tag */}
            {product.taste_profiles?.[0] && (
              <span className="inline-block px-2 py-0.5 rounded-full bg-gold-light/40 backdrop-blur-md text-imperial text-[10px] font-sans font-bold border border-gold/30 shadow-xs">
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
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all border border-gold/20 ${
                isFavorited
                  ? 'bg-gold text-imperial border-gold'
                  : 'bg-white/90 text-cocoa hover:text-gold-deep hover:bg-white'
              }`}
              aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-imperial' : ''}`} />
            </button>

            {/* Quick View Button */}
            <button
              type="button"
              onClick={() => setIsQuickViewOpen(true)}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-cocoa hover:text-gold-deep border border-gold/20 flex items-center justify-center shadow-sm opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
              aria-label="Quick View"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Wholesale Margin Tag */}
          {isWholesaleMode && savingsPercent > 0 && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-gold text-imperial font-sans font-black text-[10px] shadow-sm">
              {t('catalog.savePercent', 'Save')} {savingsPercent}%
            </div>
          )}
        </div>

        {/* Card Body & Details */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
          
          <div>
            <div className="flex items-center justify-between text-[11px] text-cocoa-muted mb-1 font-sans">
              <span>{product.category?.name || 'Savouries'}</span>
              {selectedVariant.is_in_stock ? (
                <span className="text-emerald font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald" /> {t('catalog.inStock', 'Fresh Batch')}
                </span>
              ) : (
                <span className="text-cocoa-muted font-semibold">{t('catalog.outOfStock', 'Out of Stock')}</span>
              )}
            </div>

            <Link to={`/product/${product.slug}`} className="block group-hover:text-gold-deep transition-colors">
              <h3 className="font-display font-bold text-base sm:text-lg text-imperial leading-snug line-clamp-1 tracking-tight">
                {product.name}
              </h3>
            </Link>

            <p className="font-serif text-xs text-cocoa-muted line-clamp-2 mt-1 italic leading-relaxed">
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
                  className={`px-2 py-1 rounded-lg text-[11px] font-sans font-bold transition-all border ${
                    selectedVariant.id === v.id
                      ? 'bg-imperial text-gold border-gold/40 font-black shadow-xs'
                      : 'bg-ivory text-cocoa border-gold/20 hover:bg-cream'
                  }`}
                >
                  {v.weight_label}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Add to Bag */}
          <div className="pt-3 border-t border-gold/15 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-sans font-black text-imperial">
                  ₹{currentPrice}
                </span>
                <span className="text-[10px] text-cocoa-muted font-sans">
                  /{selectedVariant.weight_label}
                </span>
              </div>
              {isWholesaleMode && selectedVariant.retail_price && (
                <span className="text-[10px] text-cocoa-muted/70 line-through block font-sans">
                  MRP: ₹{selectedVariant.retail_price}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-9 h-9 rounded-xl bg-emerald/10 hover:bg-emerald/20 border border-emerald/30 flex items-center justify-center transition-colors"
                title="Wholesale WhatsApp Enquiry"
                aria-label="Enquire on WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" variant="green" />
              </button>

              {/* Primary Add to Cart Button: Radiant Saffron Gold with Deep Purple text */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={added || !selectedVariant.is_in_stock}
                className={`btn-royal-gold flex items-center gap-1 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-sans font-black transition-all shadow-gold active:scale-95 ${
                  added ? 'bg-emerald text-white' : ''
                }`}
              >
                {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{added ? t('catalog.added', 'Added') : t('catalog.addToBag', 'Add')}</span>
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
