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
      className="p-0 rounded-3xl bg-white shadow-elevated border border-ivory-border text-cocoa max-w-2xl w-[92vw] overflow-hidden m-auto backdrop:bg-plum-950/70 backdrop:backdrop-blur-sm"
    >
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-plum-900 to-plum-950 text-ivory p-4 sm:p-5 flex items-center justify-between border-b border-plum-800">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-turmeric block">
            Quick Taste Preview
          </span>
          <h2 id="quick-view-title" className="font-display font-bold text-lg sm:text-xl text-white">
            {product.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        {/* Left: Authentic 1:1 Image */}
        <div className="relative aspect-square rounded-2xl bg-gradient-to-b from-ivory-warm to-white p-3 border border-ivory-border overflow-hidden">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain"
          />
          {product.spice_level && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-chilli text-[10px] font-bold border border-chilli-200 shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-chilli" />
              {product.spice_level}
            </span>
          )}
        </div>

        {/* Right: Variants, Pricing, Quantity & CTAs */}
        <div className="flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-turmeric-100 text-turmeric-800 text-xs font-bold">
                {product.category?.name || 'Savouries'}
              </span>
              <span className="text-xs text-cocoa-muted font-medium">
                {product.taste_profiles?.join(', ') || 'Authentic Crunch'}
              </span>
            </div>
            
            <p className="text-xs text-cocoa-muted leading-relaxed line-clamp-3">
              {product.description}
            </p>
          </div>

          {/* Variant Selector */}
          <div>
            <label className="text-[11px] font-bold text-plum-900 uppercase tracking-wider block mb-1.5">
              Select Package Size:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants?.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                const vPrice = isWholesaleMode 
                  ? (v.wholesale_price || v.retail_price) 
                  : (v.retail_price || v.wholesale_price);

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-plum-900 text-white border-plum-900 shadow-xs'
                        : 'bg-ivory-warm text-cocoa border-ivory-border hover:bg-peach-50'
                    }`}
                  >
                    <span>{v.weight_label}</span>
                    <span className="ml-1 opacity-75">₹{vPrice}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-3 rounded-2xl bg-ivory-warm border border-ivory-border flex items-baseline justify-between">
            <div>
              <span className="text-xs text-cocoa-muted block">
                {isWholesaleMode ? 'Wholesale Price per Pack' : 'Retail Price'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-display font-extrabold text-plum-900">
                  ₹{currentPrice}
                </span>
                {isWholesaleMode && selectedVariant.retail_price && (
                  <span className="text-xs text-stone-400 line-through">
                    MRP: ₹{selectedVariant.retail_price}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cocoa">Qty:</span>
              <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-xs font-bold text-cocoa hover:bg-stone-100"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-plum-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-xs font-bold text-cocoa hover:bg-stone-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={added || !selectedVariant.is_in_stock}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-chilli active:scale-95 ${
                added 
                  ? 'bg-pista-600 text-white' 
                  : 'bg-chilli hover:bg-chilli-600 text-white'
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              <span>{added ? 'Added to Bag!' : `Add ${quantity} to Bag (₹${currentPrice * quantity})`}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleWhatsAppEnquiry}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-pista-50 hover:bg-pista-100 border border-pista-200 text-pista-800 text-xs font-bold transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" variant="green" />
                <span>Enquire on WhatsApp</span>
              </button>

              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-ivory-warm hover:bg-peach-50 text-plum-900 text-xs font-bold border border-ivory-border transition-colors"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </dialog>
  );
};
