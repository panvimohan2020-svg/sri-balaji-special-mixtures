import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  ArrowRight, 
  Store, 
  ShieldCheck, 
  Scale,
  RotateCcw,
  Clock,
  History
} from 'lucide-react';
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
          <div className="w-20 h-20 mx-auto rounded-3xl bg-cream-surface border-2 border-cream-border flex items-center justify-center text-crimson-800 shadow-soft">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-3xl text-spice-dark">
              Your Cart is Empty
            </h1>
            <p className="text-sm text-spice-muted max-w-md mx-auto leading-relaxed">
              You haven't added any snacks yet. Explore our crispy mixtures, potato chips, and traditional savouries to build your order.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm font-bold text-sm shadow-elevated transition-all"
            >
              <span>Explore Snack Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Reorder History for returning wholesale buyers */}
        {orderHistory.length > 0 && (
          <div className="p-6 rounded-3xl bg-white border border-cream-border shadow-soft space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-cream-border">
              <History className="w-5 h-5 text-crimson-800" />
              <div>
                <h3 className="font-display font-bold text-lg text-spice-dark">
                  Recent Orders &amp; Quick Reordering
                </h3>
                <p className="text-xs text-spice-muted">
                  Reorder your regular wholesale batch with one click.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {orderHistory.map((past, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-cream-surface border border-cream-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-spice-dark">
                      <span>Order #{past.orderNumber}</span>
                      <span className="text-[10px] text-spice-muted font-normal">• {past.date}</span>
                    </div>
                    <div className="text-spice-muted line-clamp-1">
                      {past.items.map((i: any) => `${i.productName} (${i.weightLabel} x ${i.quantity})`).join(', ')}
                    </div>
                    <div className="text-[11px] font-semibold text-brand-700">
                      Total: ₹{past.totalAmount.toLocaleString('en-IN')} ({past.totalWeightKg} kg)
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickReorder(past)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm font-bold shrink-0 transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-gold-300" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
            Review Your Selection
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-crimson-900 mt-1">
            {isWholesaleMode ? 'Wholesale Order & Quotation' : 'Retail Shopping Cart'}
          </h1>
        </div>

        {/* Pricing Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleWholesaleMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isWholesaleMode
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-cream-surface text-spice border-cream-border hover:bg-cream-warm'
            }`}
          >
            <Store className="w-4 h-4 text-amber-800" />
            <span>Mode: {isWholesaleMode ? 'Wholesale Rate Active' : 'Retail Price'}</span>
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-bold text-crimson-700 hover:text-crimson-900 px-3 py-2 rounded-lg hover:bg-crimson-50 transition-colors"
          >
            Clear Cart
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
                className="p-4 sm:p-5 rounded-2xl bg-white border border-cream-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                {/* Product Info & Thumb */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-cream-surface overflow-hidden shrink-0 border border-cream-border">
                    <img
                      src={item.imageUrl || '/images/products/onion-mixture.png'}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded border border-veg bg-white flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-veg"></span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                        {item.categoryName}
                      </span>
                    </div>

                    <Link
                      to={`/product/${item.productSlug}`}
                      className="font-display font-bold text-base text-spice-dark hover:text-crimson-800 transition-colors block line-clamp-1"
                    >
                      {item.productName}
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-spice-muted">
                      <span className="font-semibold px-2 py-0.5 rounded bg-cream-warm border border-cream-border">
                        {item.weightLabel}
                      </span>
                      <span>Rate: ₹{item.unitPrice} / pkg</span>
                    </div>
                  </div>
                </div>

                {/* Stepper & Price Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-cream-border">
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-cream-warm rounded-xl border border-cream-border overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-spice hover:bg-cream-surface transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-spice-dark min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-spice hover:bg-cream-surface transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[5rem]">
                    <span className="font-display font-extrabold text-lg text-crimson-900 block">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-spice-muted block">
                      {(item.weightInGrams * item.quantity / 1000).toFixed(2)} kg
                    </span>
                  </div>

                  {/* Delete Item */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-xl text-spice-muted hover:text-crimson-700 hover:bg-crimson-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })}

          {/* Quick Reorder History drawer under cart items */}
          {orderHistory.length > 0 && (
            <div className="p-5 rounded-2xl bg-cream-warm border border-cream-border space-y-3">
              <span className="text-xs font-bold text-spice-dark flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-700" />
                <span>Previously Inquired Orders</span>
              </span>
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar text-xs">
                {orderHistory.slice(0, 3).map((past, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-cream-border shrink-0 min-w-[220px] space-y-2">
                    <div className="flex justify-between items-baseline font-bold text-spice-dark">
                      <span>#{past.orderNumber}</span>
                      <span className="text-[10px] text-spice-muted">{past.date}</span>
                    </div>
                    <p className="text-[11px] text-spice-muted line-clamp-1">
                      {past.items.length} items • ₹{past.totalAmount}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleQuickReorder(past)}
                      className="w-full py-1.5 bg-cream-surface hover:bg-cream-border text-spice-dark font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Load This Batch</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-cream-surface border-2 border-cream-border shadow-soft space-y-5">
            <h3 className="font-display font-bold text-xl text-spice-dark">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-spice">
              <div className="flex justify-between items-center">
                <span className="text-spice-muted">Total Snack Packages:</span>
                <span className="font-bold text-spice-dark">{totalItemsCount} packages</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-spice-muted flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-brand-700" />
                  <span>Estimated Net Weight:</span>
                </span>
                <span className="font-bold text-spice-dark">{totalWeightKg} kg</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-spice-muted">Pricing Tier:</span>
                <span className={`font-bold text-xs px-2 py-0.5 rounded ${
                  isWholesaleMode ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-800'
                }`}>
                  {isWholesaleMode ? 'Wholesale Factory Rates' : 'Retail Rates'}
                </span>
              </div>

              <div className="pt-3 border-t border-cream-border flex justify-between items-baseline">
                <div>
                  <span className="font-display font-bold text-base text-spice-dark block">
                    Estimated Subtotal
                  </span>
                  <span className="text-[11px] text-spice-muted">
                    Excludes road transport &amp; taxes
                  </span>
                </div>
                <span className="font-display font-extrabold text-2xl text-crimson-900">
                  ₹{totalAmount.toLocaleString('en-IN')}*
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base flex items-center justify-center gap-2 shadow-elevated transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <span>{isWholesaleMode ? 'Submit Wholesale Enquiry' : 'Order on WhatsApp'}</span>
              </button>

              <p className="text-[11px] text-center text-spice-muted leading-tight">
                Generates a structured order quotation on WhatsApp directly to Sri Balaji's sales counter.
              </p>
            </div>

            {/* Quality & Packing Assurance */}
            <div className="p-3.5 rounded-xl bg-white border border-cream-border text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Wholesale Packaging Assurance</span>
              </div>
              <p className="text-[11px] text-spice-muted leading-relaxed">
                Carton packing with moisture barrier film. Freshly packed on receipt of order.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* WhatsApp Checkout Modal */}
      <WhatsAppCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />

    </div>
  );
};
