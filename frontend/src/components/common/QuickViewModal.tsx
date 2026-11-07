import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Flame, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import type { Product, ProductVariant } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { generateSingleProductInquiryUrl } from '../../utils/whatsapp';
import { initialBusinessSettings } from '../../data/initialData';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { isWholesaleMode, addItem } = useCartStore();
  const { addToast } = useNotificationStore();

  useEffect(() => {
    if (product) {
      const initialVariant = product.variants?.find(v => v.is_in_stock) || product.variants?.[0] || null;
      setSelectedVariant(initialVariant);
      setQuantity(isWholesaleMode ? (product.minimum_order_qty || 1) : 1);
      setAdded(false);
    }
  }, [product, isWholesaleMode]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  if (!product || !selectedVariant) return null;

  const currentPrice = isWholesaleMode 
    ? (selectedVariant.wholesale_price || selectedVariant.retail_price)
    : (selectedVariant.retail_price || selectedVariant.wholesale_price);

  const primaryImage = product.images?.[0]?.image_url || '/images/products/onion-mixture.png';

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setAdded(true);
    addToast({
      title: `Added ${product.name}`,
      description: `${quantity} pkg (${selectedVariant.weight_label}) • ₹${currentPrice * quantity}`,
      type: isWholesaleMode ? 'wholesale' : 'success',
      actionLabel: 'View Cart',
      actionUrl: '/cart'
    });
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleWhatsAppEnquiry = () => {
    const url = generateSingleProductInquiryUrl(
      product.name,
      selectedVariant.weight_label,
      initialBusinessSettings.whatsapp_number
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="quick-view-title"
      className="p-0 rounded-3xl bg-white shadow-elevated border-2 border-gold-400/40 text-spice max-w-2xl w-[92vw] overflow-hidden m-auto backdrop:bg-spice-dark/70 backdrop:backdrop-blur-sm"
    >
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-crimson-900 to-crimson-800 text-cream-warm p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-300 block">
            Quick Taste Preview
          </span>
          <h2 id="quick-view-title" className="font-display font-bold text-lg sm:text-xl text-white">
            {product.name}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-cream-surface/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close product preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
        {/* Left Image */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-surface border border-cream-border shadow-inner">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Spice Badge */}
            <div className="absolute top-3 right-3 bg-spice-dark/85 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{product.spice_level}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {product.taste_profiles?.map(taste => (
              <span key={taste} className="text-[10px] font-bold bg-cream-surface border border-cream-border text-spice px-2.5 py-0.5 rounded-md">
                {taste}
              </span>
            ))}
          </div>
        </div>

        {/* Right Details & Selection */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-spice-muted leading-relaxed">
              {product.description}
            </p>

            {/* Weight Variant Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-spice-dark">Choose Pack Size:</span>
                {isWholesaleMode && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    MOQ: {product.minimum_order_qty} pkgs
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {product.variants?.map(variant => {
                  const isSelected = selectedVariant.id === variant.id;
                  const price = isWholesaleMode ? variant.wholesale_price : variant.retail_price;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-2 rounded-xl text-center border text-xs transition-all ${
                        isSelected
                          ? 'bg-crimson-800 text-cream-warm border-crimson-900 shadow-sm font-bold'
                          : 'bg-cream-warm text-spice border-cream-border hover:bg-cream-surface'
                      }`}
                    >
                      <span className="block font-bold">{variant.weight_label}</span>
                      <span className="block text-[11px] opacity-90">₹{price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="p-3.5 rounded-xl bg-cream-surface border border-cream-border flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-spice-muted uppercase font-bold block">
                  {isWholesaleMode ? 'Wholesale Rate' : 'Retail Price'}
                </span>
                <span className="font-display font-extrabold text-2xl text-crimson-900">
                  ₹{currentPrice}
                </span>
              </div>
              <span className="text-xs text-brand-700 font-semibold">
                Per {selectedVariant.weight_label} package
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-soft transition-all ${
                added 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-crimson-800 hover:bg-crimson-900 text-cream-warm hover:shadow-elevated'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-gold-300" />
                  <span>Add to Cart (₹{currentPrice * quantity})</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleWhatsAppEnquiry}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" variant="white" />
                <span>WhatsApp Quote</span>
              </button>

              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl border border-cream-border hover:bg-cream-warm text-spice text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <span>Full Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

