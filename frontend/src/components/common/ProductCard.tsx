import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, Flame, Check, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { initialBusinessSettings } from '../../data/initialData';
import { generateSingleProductInquiryUrl } from '../../utils/whatsapp';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Default to the first in-stock variant, or first variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants?.find(v => v.is_in_stock) || product.variants?.[0]
  );
  const [added, setAdded] = useState(false);

  const { isWholesaleMode, addItem } = useCartStore();

  if (!selectedVariant) return null;

  const currentPrice = isWholesaleMode 
    ? (selectedVariant.wholesale_price || selectedVariant.retail_price)
    : (selectedVariant.retail_price || selectedVariant.wholesale_price);

  const primaryImage = product.images?.[0]?.image_url || '/images/products/onion-mixture.png';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, selectedVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
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

  return (
    <div className="group relative bg-white rounded-2xl border border-cream-border overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image Section - 1:1 Square aspect ratio perfectly preserves original authentic packaging */}
      <div className="relative aspect-square bg-cream-surface overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {/* Vegetarian Badge */}
          {product.food_classification === 'VEGETARIAN' && (
            <div className="w-5 h-5 rounded border border-veg bg-white flex items-center justify-center shadow-sm" title="100% Vegetarian">
              <span className="w-2.5 h-2.5 rounded-full bg-veg"></span>
            </div>
          )}

          {/* Featured Badge */}
          {product.is_featured && (
            <span className="inline-flex items-center gap-1 bg-gold-500 text-spice-dark text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Bestseller</span>
            </span>
          )}
        </div>

        {/* Spice Level Indicator */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md ${
            product.spice_level === 'SPICY' || product.spice_level === 'EXTRA_SPICY'
              ? 'bg-crimson-800/90 text-white'
              : product.spice_level === 'MEDIUM'
              ? 'bg-amber-600/90 text-white'
              : 'bg-emerald-800/90 text-white'
          }`}>
            <Flame className="w-3 h-3" />
            <span className="capitalize">{product.spice_level.toLowerCase()}</span>
          </span>
        </div>

        {/* Taste Profile chips overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 z-10">
          {product.taste_profiles?.slice(0, 2).map((taste) => (
            <span 
              key={taste} 
              className="text-[10px] font-semibold bg-spice-dark/75 text-cream-warm px-2 py-0.5 rounded-md backdrop-blur-sm"
            >
              {taste}
            </span>
          ))}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
        <div>
          {/* Category */}
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
            {product.category?.name || 'Snacks'}
          </span>

          {/* Title */}
          <Link to={`/product/${product.slug}`} className="block mt-1">
            <h3 className="font-display font-bold text-lg text-spice-dark group-hover:text-crimson-800 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="mt-1 text-xs text-spice-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Weight Variant Selector Pills */}
        <div className="pt-2 border-t border-cream-border">
          <div className="flex items-center justify-between text-xs text-spice-muted mb-1.5">
            <span className="font-semibold">Select Weight:</span>
            {isWholesaleMode && (
              <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                MOQ: {product.minimum_order_qty} pkgs
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
            {product.variants?.map((variant) => {
              const isSelected = selectedVariant.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center border ${
                    isSelected
                      ? 'bg-crimson-800 text-cream-warm border-crimson-900 shadow-sm'
                      : 'bg-cream-warm text-spice border-cream-border hover:bg-cream-surface hover:border-brand-300'
                  }`}
                >
                  {variant.weight_label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-cream-border flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-extrabold text-xl text-crimson-900">
                ₹{currentPrice}
              </span>
              {isWholesaleMode && selectedVariant.retail_price && (
                <span className="text-xs text-spice-muted line-through">
                  ₹{selectedVariant.retail_price}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold text-brand-700">
              {isWholesaleMode ? 'Wholesale Rate / Pkg' : 'Retail Price'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* WhatsApp Single Product Inquiry */}
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              title="Inquire on WhatsApp"
              className="p-2 rounded-xl border border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all shadow-soft ${
                added 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-crimson-800 hover:bg-crimson-900 text-cream-warm hover:shadow-elevated'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-gold-300" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

