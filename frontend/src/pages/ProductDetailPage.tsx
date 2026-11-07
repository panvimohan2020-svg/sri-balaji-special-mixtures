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
      setQuantity(isWholesaleMode ? product.minimum_order_qty : 1);
    }
  }, [product?.id, isWholesaleMode]);

  // If product not found
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-crimson-900">Snack Not Found</h2>
        <p className="text-sm text-spice-muted">The snack product you are looking for does not exist or is currently unavailable.</p>
        <Link to="/catalog" className="inline-block px-5 py-2.5 bg-crimson-800 text-cream-warm rounded-xl font-bold text-sm">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Breadcrumb Navigation & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-border text-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-spice-muted">
          <Link to="/" className="hover:text-crimson-800 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-cream-border" />
          <Link to="/catalog" className="hover:text-crimson-800 transition-colors">Snacks</Link>
          <ChevronRight className="w-3.5 h-3.5 text-cream-border" />
          <span className="font-bold text-spice-dark truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="flex items-center gap-2">
          {/* Wishlist toggle */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isFavorited ? "Remove from wishlist" : "Save to wishlist"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
              isFavorited
                ? 'bg-crimson-800 text-white border-crimson-900 shadow-sm'
                : 'bg-white hover:bg-cream-warm text-spice border-cream-border'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white' : ''}`} />
            <span>{isFavorited ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
          </button>

          {/* QR Code trigger */}
          <button
            type="button"
            onClick={() => setIsQRModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cream-border bg-white hover:bg-cream-warm text-xs font-bold text-spice transition-colors shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 text-brand-700" />
            <span>Packaging QR</span>
          </button>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left: Large Product Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-surface border-2 border-cream-border shadow-elevated">
            <img
              src={product.images?.[0]?.image_url || '/images/products/onion-mixture.png'}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            
            {/* Vegetarian Badge Overlay */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-cream-border flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-veg bg-white flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-veg"></span>
              </div>
              <span className="text-xs font-bold text-spice-dark">100% Pure Vegetarian</span>
            </div>

            {/* Spice Level */}
            <div className="absolute top-4 right-4 bg-spice-dark/85 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md text-white text-xs font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{product.spice_level} Spice</span>
            </div>

            {/* Authentic Heritage Badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-cream-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span className="font-bold text-spice-dark">Fresh Batch Fried Daily</span>
              </div>
              <span className="text-spice-muted font-semibold">Paralakhemundi, Odisha</span>
            </div>
          </div>
        </div>

        {/* Right: Specifications & Ordering */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
              {product.category?.name || 'Fresh Savouries'}
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-spice-dark mt-1">
              {product.name}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-spice-muted leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Taste Profiles */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-spice-muted">Flavour Profile:</span>
            {product.taste_profiles.map((taste) => (
              <span key={taste} className="px-3 py-1 rounded-full bg-cream-surface border border-cream-border text-xs font-bold text-spice-dark">
                {taste}
              </span>
            ))}
          </div>

          {/* Multi-Weight Variant Selector */}
          <div className="p-5 rounded-3xl bg-white border border-cream-border shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-spice-dark uppercase tracking-wider">
                Select Package Weight:
              </span>
              {isWholesaleMode && (
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  Minimum Order: {product.minimum_order_qty} Packages
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {product.variants.map((variant) => {
                const isSelected = activeVariant.id === variant.id;
                const price = isWholesaleMode ? variant.wholesale_price : variant.retail_price;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariant(variant);
                    }}
                    className={`p-3 rounded-2xl text-center border transition-all ${
                      isSelected
                        ? 'bg-crimson-800 text-cream-warm border-crimson-900 shadow-sm font-bold'
                        : 'bg-cream-warm text-spice border-cream-border hover:bg-cream-surface hover:border-gold-300'
                    }`}
                  >
                    <span className="block text-sm font-bold">{variant.weight_label}</span>
                    <span className="block text-xs font-semibold opacity-90 mt-0.5">
                      ₹{price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing & Quantity Stepper */}
          <div className="p-5 rounded-3xl bg-cream-surface border border-cream-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-spice-muted uppercase font-bold block">
                {isWholesaleMode ? 'Wholesale Rate / Package' : 'Retail Price'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-display font-extrabold text-3xl text-crimson-900">
                  ₹{currentPrice}
                </span>
                {isWholesaleMode && activeVariant.retail_price && (
                  <span className="text-sm text-spice-muted line-through">
                    ₹{activeVariant.retail_price}
                  </span>
                )}
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-spice-dark">Quantity:</span>
              <div className="flex items-center bg-white rounded-xl border border-cream-border overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="p-2.5 text-spice-dark hover:bg-cream-surface transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-bold text-spice-dark min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="p-2.5 text-spice-dark hover:bg-cream-surface transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-elevated transition-all ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-crimson-800 hover:bg-crimson-900 text-cream-warm hover:shadow-glow'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 text-gold-300" />
                  <span>Add {quantity} to Cart (₹{currentPrice * quantity})</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppEnquiry}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-soft transition-all"
            >
              <WhatsAppIcon className="w-5 h-5 text-white" variant="white" />
              <span>WhatsApp Quote</span>
            </button>
          </div>

          {/* Transparency Accordion / Info Cards */}
          <div className="space-y-3 pt-4 border-t border-cream-border text-xs sm:text-sm">
            {product.ingredients && (
              <div className="p-4 rounded-2xl bg-white border border-cream-border space-y-1">
                <span className="font-bold text-spice-dark flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-brand-700" />
                  <span>Verified Ingredients</span>
                </span>
                <p className="text-spice-muted leading-relaxed pl-5">
                  {product.ingredients}
                </p>
              </div>
            )}

            {product.allergen_info && (
              <div className="p-4 rounded-2xl bg-white border border-cream-border space-y-1">
                <span className="font-bold text-spice-dark flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Allergen Advisory</span>
                </span>
                <p className="text-spice-muted leading-relaxed pl-5">
                  {product.allergen_info}
                </p>
              </div>
            )}

            {product.packaging_info && (
              <div className="p-4 rounded-2xl bg-white border border-cream-border space-y-1">
                <span className="font-bold text-spice-dark flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-emerald-700" />
                  <span>Packaging &amp; Shelf Life</span>
                </span>
                <p className="text-spice-muted leading-relaxed pl-5">
                  {product.packaging_info}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-cream-border space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
                More from {product.category?.name || 'Sri Balaji'}
              </span>
              <h2 className="font-display font-extrabold text-2xl text-spice-dark mt-0.5">
                Complementary Crispy Savouries
              </h2>
            </div>
            <Link to="/catalog" className="text-crimson-800 font-bold text-sm hover:underline">
              View All Catalogue →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Product QR Code Modal */}
      <ProductQRModal
        product={product}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

    </div>
  );
};
