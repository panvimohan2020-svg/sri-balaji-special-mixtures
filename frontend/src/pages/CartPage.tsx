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
  History,
  Tag,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { useCartStore } from '../store/useCartStore';
import { useCustomerAuthStore } from '../store/useCustomerAuthStore';
import { apiService, CouponValidateResult, LoyaltyAccountItem } from '../services/api';
import { WhatsAppCheckoutModal } from '../components/cart/WhatsAppCheckoutModal';
import { useTranslation } from '../store/useLanguageStore';
import { trackMarketingEvent } from '../utils/analytics';
import type { CartItem } from '../types';

export const CartPage: React.FC = () => {
  const { t } = useTranslation();
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

  const { token, customer } = useCustomerAuthStore();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidateResult | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyAccountItem | null>(null);
  const [redeemPoints, setRedeemPoints] = useState(false);

  useEffect(() => {
    if (token) {
      apiService.getMyLoyaltyAccount(token).then((acc) => setLoyaltyAccount(acc)).catch(() => {});
    }
  }, [token]);

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

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await apiService.validateCoupon(couponInput.trim(), totalAmount, isWholesaleMode ? 'WHOLESALE' : 'RETAIL');
      if (res.is_valid) {
        setAppliedCoupon(res);
      } else {
        setCouponError(res.message);
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError('Could not validate coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  const couponDiscount = appliedCoupon?.is_valid ? appliedCoupon.discount_amount : 0;
  const maxRedeemable = loyaltyAccount ? Math.min(loyaltyAccount.points_balance, Math.floor((totalAmount - couponDiscount) * 0.25)) : 0;
  const pointsDiscount = redeemPoints ? maxRedeemable : 0;
  const grandTotal = Math.max(0, totalAmount - couponDiscount - pointsDiscount);

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
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gold-light/40 border-2 border-gold/40 flex items-center justify-center text-imperial shadow-royal">
            <ShoppingBag className="w-10 h-10 text-gold-deep" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-3xl text-imperial">
              {t('cart.empty', 'Your Snack Bag is Empty')}
            </h1>
            <p className="text-sm text-cocoa-muted max-w-md mx-auto leading-relaxed">
              {t('cart.emptyDesc', 'You haven\'t added any snacks yet. Explore our crispy mixtures, potato chips, and traditional savouries to build your order.')}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gold hover:bg-gold-rich text-imperial font-black text-sm shadow-gold transition-all active:scale-95"
            >
              <span>{t('hero.exploreBtn', 'Explore Snack Catalogue')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Reorder History for returning buyers */}
        {orderHistory.length > 0 && (
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-ivory-border">
              <History className="w-5 h-5 text-imperial" />
              <div>
                <h3 className="font-display font-bold text-lg text-imperial">
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
                  className="p-4 rounded-2xl bg-ivory border border-gold/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-imperial">
                      <span>Order #{past.orderNumber}</span>
                      <span className="text-[10px] text-cocoa-muted font-normal">• {past.date}</span>
                    </div>
                    <div className="text-cocoa-muted line-clamp-1">
                      {past.items.map((i: any) => `${i.productName} (${i.weightLabel} x ${i.quantity})`).join(', ')}
                    </div>
                    <div className="text-[11px] font-bold text-imperial">
                      Total: ₹{past.totalAmount.toLocaleString('en-IN')} ({past.totalWeightKg} kg)
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickReorder(past)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-imperial hover:bg-imperial-secondary text-gold border border-gold/30 font-bold shrink-0 transition-colors shadow-royal"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-gold" />
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
          <span className="text-xs font-bold uppercase tracking-widest text-gold-deep block">
            Review Your Selection
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-imperial mt-1">
            {isWholesaleMode ? t('nav.wholesaleMode', 'Wholesale Order & Quotation') : t('cart.title', 'Retail Shopping Bag')}
          </h1>
        </div>

        {/* Pricing Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleWholesaleMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
              isWholesaleMode
                ? 'bg-imperial text-gold border-gold/40 shadow-royal font-black'
                : 'bg-white text-cocoa border-ivory-border hover:bg-cream'
            }`}
          >
            <Store className="w-4 h-4 text-gold" />
            <span>Mode: {isWholesaleMode ? t('nav.wholesaleMode', 'Wholesale Rate Active') : t('nav.retailMode', 'Retail Price')}</span>
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-bold text-gold-deep hover:text-gold px-3 py-2 rounded-xl hover:bg-cream transition-colors"
          >
            {t('cart.clearCart', 'Clear Bag')}
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
                className="p-4 sm:p-5 rounded-3xl bg-white border border-ivory-border hover:border-gold/40 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                {/* Product Info & 1:1 Thumb */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-ivory p-2 overflow-hidden shrink-0 border border-ivory-border flex items-center justify-center">
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
                      <h3 className="font-display font-bold text-base text-imperial">
                        {item.productName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-cocoa-muted">
                      <span className="font-bold text-imperial bg-gold-light/40 px-2 py-0.5 rounded-md border border-gold/30">
                        {item.weightLabel}
                      </span>
                      <span>Rate: ₹{item.unitPrice} each</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-ivory-border">
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gold/30 rounded-xl bg-ivory overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-cocoa hover:bg-cream transition-colors font-bold text-xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-xs text-imperial">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-cocoa hover:bg-cream transition-colors font-bold text-xs"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[70px]">
                    <span className="font-display font-black text-base text-imperial block">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Delete Item */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-stone-400 hover:text-gold-deep transition-colors"
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-deep hover:text-gold"
            >
              <span>← Continue Shopping Savouries</span>
            </Link>
          </div>
        </div>

        {/* Right: Sticky Order Summary */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-5">
            <h2 className="font-display font-extrabold text-xl text-imperial pb-3 border-b border-ivory-border">
              {t('cart.cartSummary', 'Order Summary')}
            </h2>

            <div className="space-y-3 text-xs text-cocoa">
              <div className="flex items-center justify-between">
                <span>Total Items</span>
                <span className="font-bold">{totalItemsCount} packages</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-gold-deep" />
                  <span>Consignment Weight</span>
                </span>
                <span className="font-bold text-imperial">{totalWeightKg} kg</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Pricing Tier</span>
                <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${isWholesaleMode ? 'bg-gold text-imperial font-black' : 'bg-gold-light/40 text-imperial'}`}>
                  {isWholesaleMode ? 'Wholesale B2B' : 'Retail MRP'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Packaging &amp; Handling</span>
                <span className="text-emerald font-bold">Standard Included</span>
              </div>

              {/* Coupon Code Section */}
              <div className="pt-2 border-t border-ivory-border space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cocoa-muted" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon Code (e.g. BALAJI10)"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-ivory-border bg-ivory text-xs font-mono uppercase focus:border-gold outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-3.5 py-2 rounded-xl bg-imperial hover:bg-imperial-secondary text-gold font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-40"
                  >
                    {couponLoading ? '...' : t('cart.apply', 'Apply')}
                  </button>
                </form>

                {appliedCoupon && appliedCoupon.is_valid && (
                  <div className="p-2 rounded-xl bg-emerald/10 border border-emerald/30 text-emerald-deep text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Check className="w-3.5 h-3.5 text-emerald" />
                      <span>{appliedCoupon.message}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-stone-400 hover:text-red-500 font-bold ml-2"
                    >
                      ×
                    </button>
                  </div>
                )}
                {couponError && (
                  <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{couponError}</span>
                  </div>
                )}
              </div>

              {/* Loyalty Reward Points Redemption */}
              {loyaltyAccount && loyaltyAccount.points_balance > 0 && maxRedeemable > 0 && (
                <div className="p-3 rounded-2xl bg-gold/10 border border-gold/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-imperial">
                      <Sparkles className="w-3.5 h-3.5 text-gold-deep" />
                      <span>Balaji Crunch Points</span>
                    </div>
                    <span className="font-mono text-gold-deep font-bold">{loyaltyAccount.points_balance} pts</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-cocoa">
                    <input
                      type="checkbox"
                      checked={redeemPoints}
                      onChange={(e) => setRedeemPoints(e.target.checked)}
                      className="rounded text-gold focus:ring-gold"
                    />
                    <span>Redeem {maxRedeemable} points for <strong>₹{maxRedeemable}</strong> off</span>
                  </label>
                </div>
              )}

              {/* Discount Line Items */}
              {couponDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-deep font-bold">
                  <span>Coupon Discount ({appliedCoupon?.coupon_code})</span>
                  <span>-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}

              {pointsDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-deep font-bold">
                  <span>Loyalty Points Discount</span>
                  <span>-₹{pointsDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-ivory-border flex items-baseline justify-between">
                <span className="font-display font-bold text-base text-imperial">
                  {t('cart.estimatedTotal', 'Estimated Total')}
                </span>
                <div className="text-right">
                  <span className="font-display font-black text-2xl text-imperial">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                  {(couponDiscount > 0 || pointsDiscount > 0) && (
                    <span className="text-xs text-stone-400 line-through block">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Checkout Action: Primary Saffron Gold with Deep Purple text */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => {
                  trackMarketingEvent('CHECKOUT_START');
                  setIsCheckoutModalOpen(true);
                }}
                className="w-full py-4 rounded-2xl bg-gold hover:bg-gold-rich text-imperial font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-gold active:scale-95"
              >
                <WhatsAppIcon className="w-4 h-4 text-imperial" variant="currentColor" />
                <span>{t('cart.checkoutWhatsApp', 'Submit Order via WhatsApp')}</span>
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
        couponCode={appliedCoupon?.is_valid ? appliedCoupon.coupon_code : undefined}
        discountAmount={couponDiscount}
        pointsRedeemed={pointsDiscount}
        pointsDiscount={pointsDiscount}
      />

    </div>
  );
};
