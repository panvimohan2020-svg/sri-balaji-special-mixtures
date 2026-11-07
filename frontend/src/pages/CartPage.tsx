import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Store, 
  ShieldCheck, 
  Scale,
  RotateCcw,
  Clock,
  History
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { useCartStore } from '../store/useCartStore';
import { WhatsAppCheckoutModal } from '../components/cart/WhatsAppCheckoutModal';
import type { CartItem } from '../types';

export const CartPage: React.FC = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalAmount, 
    getTotalWeightKg, 
    isWholesaleMode, 
    toggleWholesaleMode 
  } = useCartStore();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('sri_balaji_order_history') || '[]');
      if (Array.isArray(history)) {
        setOrderHistory(history);
      }
    } catch {
      // Ignore
    }
  }, []);

  const totalAmount = getTotalAmount();
  const totalWeightKg = getTotalWeightKg();
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuickReorder = (pastOrder: any) => {
    clearCart();
    // Re-populate store items from past order
    useCartStore.setState({
      items: pastOrder.items.map((i: CartItem) => ({ ...i })),
      isWholesaleMode: pastOrder.isWholesale ?? true
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-peach-50 border-2 border-peach-200 flex items-center justify-center text-chilli shadow-soft">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-3xl text-plum-900">
              Your Snack Bag is Empty
            </h1>
            <p className="text-sm text-cocoa-muted max-w-md mx-auto leading-relaxed">
              You haven't added any snacks yet. Explore our crispy mixtures, potato chips, and traditional savouries to build your order.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-chilli hover:bg-chilli-600 text-white font-bold text-sm shadow-chilli transition-all active:scale-95"
            >
              <span>Explore Snack Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Reorder History for returning buyers */}
        {orderHistory.length > 0 && (
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-ivory-border">
              <History className="w-5 h-5 text-plum-900" />
              <div>
                <h3 className="font-display font-bold text-lg text-plum-900">
                  Recent Orders &amp; Quick Reordering
                </h3>
                <p className="text-xs text-cocoa-muted">
                  Reorder your regular batch with one click.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {orderHistory.map((past, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-ivory-warm border border-ivory-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-plum-900">
                      <span>Order #{past.orderNumber}</span>
                      <span className="text-[10px] text-cocoa-muted font-normal">• {past.date}</span>
                    </div>
                    <div className="text-cocoa-muted line-clamp-1">
                      {past.items.map((i: any) => `${i.productName} (${i.weightLabel} x ${i.quantity})`).join(', ')}
                    </div>
                    <div className="text-[11px] font-semibold text-chilli">
                      Total: ₹{past.totalAmount.toLocaleString('en-IN')} ({past.totalWeightKg} kg)
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickReorder(past)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold shrink-0 transition-colors shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-turmeric" />
                    <span>Reorder This Batch</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-chilli block">
            Review Your Selection
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-plum-900 mt-1">
            {isWholesaleMode ? 'Wholesale Order & Quotation' : 'Retail Shopping Bag'}
          </h1>
        </div>

        {/* Pricing Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleWholesaleMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
              isWholesaleMode
                ? 'bg-plum-900 text-turmeric border-plum-900 shadow-plum'
                : 'bg-white text-cocoa border-ivory-border hover:bg-peach-50'
            }`}
          >
            <Store className="w-4 h-4 text-turmeric" />
            <span>Mode: {isWholesaleMode ? 'Wholesale Rate Active' : 'Retail Price'}</span>
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-bold text-chilli hover:text-chilli-700 px-3 py-2 rounded-xl hover:bg-peach-50 transition-colors"
          >
            Clear Bag
          </button>
        </div>
      </div>

      {/* Main Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const subtotal = item.unitPrice * item.quantity;
            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-ivory-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                {/* Product Info & 1:1 Thumb */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-ivory-warm p-2 overflow-hidden shrink-0 border border-ivory-border flex items-center justify-center">
                    <img
                      src={item.imageUrl || '/images/products/onion-mixture.png'}
                      alt={item.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded border border-veg bg-white flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-veg"></span>
                      </div>
                      <h3 className="font-display font-bold text-base text-plum-900">
                        {item.productName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-cocoa-muted">
                      <span className="font-bold text-chilli bg-peach-50 px-2 py-0.5 rounded-md border border-peach-200">
                        {item.weightLabel}
                      </span>
                      <span>Rate: ₹{item.unitPrice} each</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-ivory-border">
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-stone-300 rounded-xl bg-ivory-warm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-cocoa hover:bg-stone-200 transition-colors font-bold text-xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-xs text-plum-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-cocoa hover:bg-stone-200 transition-colors font-bold text-xs"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[70px]">
                    <span className="font-display font-black text-base text-plum-900 block">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Delete Item */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-stone-400 hover:text-chilli transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })}

          <div className="pt-2 flex items-center justify-between">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-chilli hover:text-chilli-700"
            >
              <span>← Continue Shopping Savouries</span>
            </Link>
          </div>
        </div>

        {/* Right: Sticky Order Summary */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-5">
            <h2 className="font-display font-extrabold text-xl text-plum-900 pb-3 border-b border-ivory-border">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-cocoa">
              <div className="flex items-center justify-between">
                <span>Total Items</span>
                <span className="font-bold">{totalItemsCount} packages</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-chilli" />
                  <span>Consignment Weight</span>
                </span>
                <span className="font-bold text-plum-900">{totalWeightKg} kg</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Pricing Tier</span>
                <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${isWholesaleMode ? 'bg-turmeric text-plum-950 font-black' : 'bg-peach-100 text-chilli'}`}>
                  {isWholesaleMode ? 'Wholesale B2B' : 'Retail MRP'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Packaging &amp; Handling</span>
                <span className="text-pista-700 font-bold">Standard Included</span>
              </div>

              <div className="pt-3 border-t border-ivory-border flex items-baseline justify-between">
                <span className="font-display font-bold text-base text-plum-900">
                  Estimated Total
                </span>
                <div className="text-right">
                  <span className="font-display font-black text-2xl text-plum-900">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Action */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full py-4 rounded-2xl bg-chilli text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-chilli-600 transition-colors shadow-chilli active:scale-95"
              >
                <WhatsAppIcon className="w-4 h-4" variant="white" />
                <span>Submit Order via WhatsApp</span>
              </button>

              <p className="text-[10px] text-center text-cocoa-muted leading-relaxed">
                Orders are sent directly to Sri Balaji management for instant confirmation, packaging, and dispatch coordination.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* WhatsApp Checkout Dialog */}
      <WhatsAppCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />

    </div>
  );
};
