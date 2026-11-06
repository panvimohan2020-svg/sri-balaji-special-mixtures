import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  MessageCircle, 
  Phone, 
  Menu, 
  X, 
  Search, 
  Store 
} from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { useCartStore, type CartState } from '../../store/useCartStore';
import { initialBusinessSettings } from '../../data/initialData';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isWholesaleMode, toggleWholesaleMode, getItemCount, getTotalWeightKg } = useCartStore();
  
  const itemCount = getItemCount();
  const totalWeight = getTotalWeightKg();

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
      {/* Top Wholesale Hotline Banner */}
      <div className="bg-crimson-800 text-cream-warm text-xs sm:text-sm py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-gold-500 text-spice-dark text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              {initialBusinessSettings.years_in_business} Years of Heritage
            </span>
            <span className="hidden sm:inline font-semibold">
              "{initialBusinessSettings.tagline}" • Fresh Wholesale Savouries from Paralakhemundi, Odisha
            </span>
            <span className="sm:hidden font-semibold">
              Wholesale Snacks • Paralakhemundi
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <a 
              href="tel:9437135342" 
              className="flex items-center gap-1.5 hover:text-gold-300 transition-colors"
              title="Call Sales Office"
            >
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>9437135342</span>
            </a>

            <a 
              href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to inquire about wholesale snacks.')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-gold-300 hover:text-white transition-colors"
              title="WhatsApp Ordering Hotline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: 9861789602</span>
            </a>

            {initialBusinessSettings.instagram_url && (
              <a 
                href={initialBusinessSettings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-300 hover:text-pink-100 transition-colors p-0.5"
                title="Follow @sri_balaji_special_mixtures on Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity / Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-crimson-700 to-crimson-900 border-2 border-gold-400 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <span className="font-display font-bold text-gold-300 text-xl tracking-wider">SB</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl tracking-wide text-crimson-900 leading-tight">
                SRI BALAJI
              </span>
              <span className="text-[11px] font-semibold text-brand-700 uppercase tracking-widest">
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
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-crimson-800 bg-crimson-50 shadow-sm font-bold'
                    : 'text-spice hover:text-crimson-700 hover:bg-cream-surface'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wholesale Mode Toggle */}
            <button
              type="button"
              onClick={toggleWholesaleMode}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isWholesaleMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
              title="Click to switch between Wholesale & Retail pricing"
            >
              <Store className="w-3.5 h-3.5 text-amber-700" />
              <span>{isWholesaleMode ? 'Wholesale Pricing Active' : 'Retail Pricing'}</span>
              <span className={`w-2 h-2 rounded-full ${isWholesaleMode ? 'bg-amber-600 animate-pulse' : 'bg-stone-400'}`} />
            </button>

            {/* Quick Search Link */}
            <Link 
              to="/catalog" 
              className="p-2.5 rounded-xl text-spice hover:bg-cream-surface hover:text-crimson-800 transition-colors"
              title="Search Snacks"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Cart / Quotation Trigger */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm transition-all shadow-soft group"
              title="View Cart & Quotation"
            >
              <ShoppingBag className="w-5 h-5 text-gold-300 group-hover:scale-110 transition-transform" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-gold-200 font-semibold uppercase leading-none">
                  {isWholesaleMode ? 'Wholesale Cart' : 'My Cart'}
                </span>
                <span className="text-xs font-bold leading-tight">
                  {itemCount > 0 ? `${itemCount} items (${totalWeight} kg)` : 'Empty'}
                </span>
              </div>
              {itemCount > 0 && (
                <span className="sm:hidden absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-spice-dark text-xs font-extrabold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-spice hover:bg-cream-surface"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-border bg-cream-warm px-4 pt-3 pb-6 space-y-3 shadow-elevated animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-cream-border">
            <span className="text-xs font-bold text-spice-muted uppercase tracking-wider">Price Mode</span>
            <button
              type="button"
              onClick={toggleWholesaleMode}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isWholesaleMode ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-amber-700" />
              <span>{isWholesaleMode ? 'Wholesale Rates' : 'Retail Rates'}</span>
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-crimson-800 bg-crimson-50 font-bold'
                    : 'text-spice hover:bg-cream-surface'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-cream-border flex flex-col gap-2">
            <a
              href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to inquire about wholesale snacks.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Inquire on WhatsApp (9861789602)</span>
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
                  <InstagramIcon className="w-3.5 h-3.5" />
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
