import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Flame, 
  Check, 
  Info,
  Package,
  Plus,
  Minus,
  QrCode,
  Heart,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { initialProducts, initialBusinessSettings } from '../data/initialData';
import type { ProductVariant } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useRecentlyViewedStore } from '../store/useRecentlyViewedStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { generateSingleProductInquiryUrl } from '../utils/whatsapp';
import { ProductCard } from '../components/common/ProductCard';
import { ProductQRModal } from '../components/common/ProductQRModal';
import { ReviewsSection } from '../components/common/ReviewsSection';
import { trackMarketingEvent } from '../utils/analytics';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const product = initialProducts.find(p => p.slug === slug);

  const { isWholesaleMode, addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addRecentlyViewed } = useRecentlyViewedStore();
  const { addToast } = useNotificationStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(
    product ? (isWholesaleMode ? product.minimum_order_qty : 1) : 1
  );
  const [added, setAdded] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Track recently viewed
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      setSelectedVariant(product.variants?.[0]);
      setActiveImageIndex(0);
      setQuantity(isWholesaleMode ? product.minimum_order_qty : 1);
      trackMarketingEvent('PRODUCT_VIEW', { productId: product.id });
    }
  }, [product?.id, isWholesaleMode]);

  // If product not found
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-imperial">Snack Not Found</h2>
        <p className="text-sm text-cocoa-muted">The snack product you are looking for does not exist or is currently unavailable.</p>
        <Link to="/catalog" className="inline-block px-5 py-2.5 bg-gold hover:bg-gold-rich text-imperial rounded-xl font-black text-sm shadow-gold">
          Browse All Snacks
        </Link>
      </div>
    );
  }

  const activeVariant = selectedVariant || product.variants[0];
  const isFavorited = isInWishlist(product.id);

  const currentPrice = isWholesaleMode
    ? (activeVariant.wholesale_price || activeVariant.retail_price)
    : (activeVariant.retail_price || activeVariant.wholesale_price);

  const relatedProducts = initialProducts
    .filter(p => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addItem(product, activeVariant, quantity);
    setAdded(true);
    addToast({
      title: `Added ${product.name}`,
      description: `${quantity} pkg (${activeVariant.weight_label}) • ₹${currentPrice * quantity}`,
      type: isWholesaleMode ? 'wholesale' : 'success',
      actionLabel: 'View Cart',
      actionUrl: '/cart'
    });
    setTimeout(() => setAdded(false), 1600);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    addToast({
      title: isFavorited ? 'Removed from Wishlist' : 'Saved to Wishlist',
      description: product.name,
      type: 'info'
    });
  };

  const handleWhatsAppEnquiry = () => {
    const url = generateSingleProductInquiryUrl(
      product.name,
      activeVariant.weight_label,
      initialBusinessSettings.whatsapp_number
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Breadcrumb Navigation & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-border text-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-cocoa-muted">
          <Link to="/" className="hover:text-gold-deep transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <Link to="/catalog" className="hover:text-gold-deep transition-colors">Snacks</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <span className="font-bold text-imperial truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="flex items-center gap-2">
          {/* Wishlist toggle */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isFavorited ? "Remove from wishlist" : "Save to wishlist"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
              isFavorited
                ? 'bg-gold text-imperial border-gold shadow-gold font-black'
                : 'bg-white hover:bg-cream text-cocoa border-ivory-border'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-imperial' : ''}`} />
            <span>{isFavorited ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
          </button>

          {/* QR Code trigger */}
          <button
            type="button"
            onClick={() => setIsQRModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-ivory-border bg-white hover:bg-cream text-xs font-bold text-cocoa transition-colors shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 text-imperial" />
            <span>Packaging QR</span>
          </button>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left: Large 1:1 Product Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-ivory to-white border-2 border-gold/30 shadow-royal p-4 sm:p-6 flex items-center justify-center">
            <img
              src={product.images?.[activeImageIndex]?.image_url || product.images?.[0]?.image_url || '/images/products/onion-mixture.png'}
              alt={product.images?.[activeImageIndex]?.alt_text || product.name}
              className="w-full h-full object-contain"
            />
            
            {/* Vegetarian Badge Overlay */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xs border border-ivory-border flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-emerald bg-white flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald"></span>
              </div>
              <span className="text-xs font-bold text-imperial">100% Pure Vegetarian</span>
            </div>

            {/* Spice Level */}
            <div className="absolute top-4 right-4 bg-imperial/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xs text-white text-xs font-bold flex items-center gap-1.5 border border-gold/30">
              <Flame className="w-4 h-4 text-gold fill-gold" />
              <span>{product.spice_level} Spice</span>
            </div>

            {/* Authentic Heritage Badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-gold/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold fill-gold" />
                <span className="font-bold text-imperial">Fresh Batch Fried Daily</span>
              </div>
              <span className="text-cocoa-muted font-semibold">Paralakhemundi, Odisha</span>
            </div>
          </div>

          {/* Multi-Image Gallery Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl p-1 bg-white border-2 transition-all overflow-hidden shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-gold shadow-gold scale-105'
                      : 'border-gold/25 opacity-75 hover:opacity-100 hover:border-gold/60'
                  }`}
                  title={img.alt_text || `View image ${idx + 1}`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications & Ordering */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {(product.product_label?.toUpperCase() === 'NEW LAUNCH' || product.slug === 'kastha-gatiya') && (
                <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600 via-crimson to-amber-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-gold border border-gold animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 fill-gold text-gold" />
                  New Launch
                </span>
              )}
              {product.collection && (
                <span className="px-3 py-1 rounded-full bg-imperial text-gold text-xs font-bold border border-gold/40 shadow-xs">
                  ✦ {product.collection}
                </span>
              )}
              <span className="text-xs font-bold uppercase tracking-widest text-gold-deep px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/25">
                {product.category?.name || 'Fresh Savouries'}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-imperial mt-1">
              {product.name}
            </h1>

            {product.tagline && (
              <span className="font-script text-gold-deep text-2xl block mt-1">
                {product.tagline}
              </span>
            )}

            <p className="mt-3 text-sm sm:text-base text-cocoa-muted leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing & Tier Switcher Notice */}
          <div className="p-4 rounded-2xl bg-ivory border border-gold/25 space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-cocoa-muted block">
                  {isWholesaleMode ? 'Wholesale Price per Pack (B2B)' : 'Standard Retail Price'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-black text-imperial">
                    ₹{currentPrice}
                  </span>
                  <span className="text-xs text-cocoa-muted font-medium">
                    / {activeVariant.weight_label}
                  </span>
                  {isWholesaleMode && activeVariant.retail_price && (
                    <span className="text-xs text-stone-400 line-through">
                      MRP: ₹{activeVariant.retail_price}
                    </span>
                  )}
                </div>
              </div>

              {isWholesaleMode && (
                <span className="px-3 py-1 rounded-full bg-gold text-imperial text-xs font-black uppercase shadow-xs">
                  Wholesale Active
                </span>
              )}
            </div>

            {isWholesaleMode && (
              <p className="text-xs text-emerald font-semibold pt-1 border-t border-ivory-border">
                ✓ Minimum Order Quantity: <strong>{product.minimum_order_qty} packages</strong>. Bulk cartons packed with moisture seals.
              </p>
            )}
          </div>

          {/* Package Weight Selection */}
          <div>
            <label className="text-xs font-bold text-imperial uppercase tracking-wider block mb-2">
              Select Package Weight:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {product.variants.map((v) => {
                const isSelected = activeVariant.id === v.id;
                const vPrice = isWholesaleMode
                  ? (v.wholesale_price || v.retail_price)
                  : (v.retail_price || v.wholesale_price);

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-imperial text-gold border-imperial shadow-royal font-black'
                        : 'bg-white hover:bg-cream text-cocoa border-ivory-border'
                    }`}
                  >
                    <span className="font-bold text-sm block">{v.weight_label}</span>
                    <span className={`text-xs mt-0.5 block ${isSelected ? 'text-gold' : 'text-cocoa-muted'}`}>
                      ₹{vPrice} {isWholesaleMode ? 'b2b' : 'retail'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector & Add to Bag CTA */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gold/30 rounded-2xl bg-white overflow-hidden p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(isWholesaleMode ? product.minimum_order_qty : 1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-cocoa hover:bg-cream rounded-xl font-bold transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-base text-imperial">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-cocoa hover:bg-cream rounded-xl font-bold transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Add to Bag Button: Saffron Gold with Deep Purple text */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={added || !activeVariant.is_in_stock}
                className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold active:scale-95 transition-all ${
                  added
                    ? 'bg-emerald text-white shadow-emerald'
                    : 'bg-gold hover:bg-gold-rich text-imperial'
                }`}
              >
                {added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                <span>{added ? 'Added to Bag!' : `Add to Bag • ₹${currentPrice * quantity}`}</span>
              </button>
            </div>

            {/* Direct WhatsApp Action */}
            <button
              type="button"
              onClick={handleWhatsAppEnquiry}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald/10 hover:bg-emerald/20 border border-emerald/30 text-emerald-deep font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" variant="green" />
              <span>Ask Questions or Place Order via WhatsApp</span>
            </button>
          </div>

          {/* Key Facts Sheet */}
          <div className="border-t border-ivory-border pt-6 grid grid-cols-2 gap-4 text-xs text-cocoa-muted">
            <div>
              <strong className="text-imperial block font-bold mb-0.5">Ingredients &amp; Blend:</strong>
              <span>{product.ingredients || 'Gram flour (Besan), peanuts, curry leaves, cold-pressed oil, salt, authentic Indian spices.'}</span>
            </div>
            <div>
              <strong className="text-imperial block font-bold mb-0.5">Storage &amp; Shelf Life:</strong>
              <span>Store in an airtight container away from moisture. Stays crispy for 90 days.</span>
            </div>
          </div>

        </div>

      </div>

      {/* CUSTOMER REVIEWS & RATINGS SECTION */}
      <ReviewsSection
        productId={product.id}
        productName={product.name}
        title={`Reviews for ${product.name}`}
        subtitle="Read real crunch and taste feedback from customers who have savoured this exact batch."
      />

      {/* Related Savouries */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-ivory-border">
          <h3 className="font-display font-extrabold text-2xl text-imperial mb-6">
            You May Also Enjoy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(rp => (
              <ProductCard key={rp.id} product={rp} cardStyle="standard" />
            ))}
          </div>
        </section>
      )}

      {/* QR Code Packaging Modal */}
      <ProductQRModal
        product={product}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

    </div>
  );
};
