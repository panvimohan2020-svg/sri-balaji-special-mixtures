import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Phone, 
  Menu, 
  X, 
  Search, 
  Store,
  Heart,
  Sparkles
} from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { WhatsAppIcon } from './WhatsAppIcon';
import { InstagramIcon } from './InstagramIcon';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { initialBusinessSettings } from '../../data/initialData';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isWholesaleMode, toggleWholesaleMode, getItemCount, getTotalWeightKg } = useCartStore();
  const { getWishlistCount } = useWishlistStore();
  
  const itemCount = getItemCount();
  const totalWeight = getTotalWeightKg();
  const wishlistCount = getWishlistCount();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Snack Catalogue', path: '/catalog' },
    { name: 'Smart Bundles', path: '/bundles' },
    { name: 'Wholesale B2B', path: '/wholesale' },
    { name: 'Our Story (30 Yrs)', path: '/about' },
    { name: 'Contact & Store', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-warm/95 backdrop-blur-md border-b border-cream-border transition-all">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity / Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-crimson-800 via-crimson-900 to-spice-dark border-2 border-gold-400 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <span className="font-display font-bold text-gold-300 text-xl tracking-wider">SB</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-2xl tracking-wide text-crimson-900 leading-tight">
                  SRI BALAJI
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-gold-500" />
              </div>
              <span className="text-[11px] font-bold text-brand-700 uppercase tracking-widest">
                Wholesale Snacks • Paralakhemundi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-crimson-800 bg-crimson-50 font-bold shadow-xs'
                    : 'text-spice hover:text-crimson-700 hover:bg-cream-surface'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-crimson-800 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wholesale Mode Toggle */}
            <button
              type="button"
              onClick={toggleWholesaleMode}
              className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isWholesaleMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
              title="Click to switch between Wholesale & Retail pricing"
            >
              <Store className="w-3.5 h-3.5 text-amber-700" />
              <span>{isWholesaleMode ? 'Wholesale Mode Active' : 'Retail Pricing'}</span>
              <span className={`w-2 h-2 rounded-full ${isWholesaleMode ? 'bg-amber-600 animate-pulse' : 'bg-stone-400'}`} />
            </button>

            {/* Quick Search Link */}
            <Link 
              to="/catalog" 
              className="p-2.5 rounded-xl text-spice hover:bg-cream-surface hover:text-crimson-800 transition-colors"
              title="Search Snacks"
              aria-label="Search snacks catalogue"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Wishlist Icon */}
            <Link
              to="/catalog?filter=wishlist"
              className="relative p-2.5 rounded-xl text-spice hover:bg-cream-surface hover:text-crimson-800 transition-colors"
              title="View Wishlist / Saved Snacks"
              aria-label="View saved snacks"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-crimson-800 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart / Quotation Trigger */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm transition-all shadow-soft group"
              title="View Cart & Quotation"
              aria-label="View Cart and order summary"
            >
              <ShoppingBag className="w-5 h-5 text-gold-300 group-hover:scale-110 transition-transform" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-gold-200 font-semibold uppercase leading-none">
                  {isWholesaleMode ? 'Wholesale Cart' : 'My Cart'}
                </span>
                <span className="text-xs font-bold leading-tight">
                  {itemCount > 0 ? `${itemCount} pkgs (${totalWeight} kg)` : 'Empty'}
                </span>
              </div>
              {itemCount > 0 && (
                <span className="sm:hidden absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-spice-dark text-xs font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-spice hover:bg-cream-surface"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-border bg-cream-warm px-4 pt-3 pb-6 space-y-4 shadow-elevated animate-in slide-in-from-top-2">
          {/* Wholesale Mode Toggle in Mobile Drawer */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-cream-border">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-spice-dark block">Pricing Tier</span>
              <span className="text-[11px] text-spice-muted block">
                {isWholesaleMode ? 'B2B Wholesale (Volume Rates)' : 'Household Retail'}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleWholesaleMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                isWholesaleMode ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-amber-700" />
              <span>{isWholesaleMode ? 'Wholesale' : 'Retail'}</span>
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-crimson-800 bg-crimson-50 font-bold'
                    : 'text-spice hover:bg-cream-surface'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/catalog?filter=wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-base font-semibold text-spice hover:bg-cream-surface flex items-center justify-between"
            >
              <span>Saved Wishlist</span>
              {wishlistCount > 0 && (
                <span className="px-2 py-0.5 bg-crimson-800 text-white text-xs font-bold rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>

          <div className="pt-3 border-t border-cream-border flex flex-col gap-2.5">
            <a
              href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to inquire about wholesale snacks.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl shadow-soft"
            >
              <WhatsAppIcon className="w-5 h-5 text-white" variant="white" />
              <span>WhatsApp Hotline (9861789602)</span>
            </a>

            <div className="flex items-center justify-between pt-1 text-xs text-spice-muted">
              <span>Call: 9437135342 / 7735333542</span>
              {initialBusinessSettings.instagram_url && (
                <a
                  href={initialBusinessSettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-700 font-bold hover:underline flex items-center gap-1"
                >
                  <InstagramIcon className="w-3.5 h-3.5" useGradient={true} />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
