import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  Heart,
  Store,
  Phone,
  ChevronRight,
  Play
} from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { BrandLogo } from './BrandLogo';
import { SearchModal } from './SearchModal';
import { WhatsAppIcon } from './WhatsAppIcon';
import { InstagramIcon } from './InstagramIcon';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { initialBusinessSettings } from '../../data/initialData';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { isWholesaleMode, toggleWholesaleMode, getItemCount } = useCartStore();
  const { getWishlistCount } = useWishlistStore();
  
  const itemCount = getItemCount();
  const wishlistCount = getWishlistCount();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Snack Catalogue', path: '/catalog' },
    { name: 'Collections', path: '/bundles' },
    { name: 'Wholesale B2B', path: '/wholesale' },
    { name: 'Our Story', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-ivory-light/95 backdrop-blur-md border-b border-ivory-border shadow-xs transition-all">
        {/* Top Announcement Bar */}
        <AnnouncementBar />

        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Authentic Brand Logo */}
            <Link to="/" className="flex items-center group py-1" aria-label="Sri Balaji Home">
              <BrandLogo variant="compact" size="md" showSubtitle={true} />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5" aria-label="Primary Navigation">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? 'text-plum-900 bg-peach-50 font-bold'
                        : 'text-cocoa hover:text-chilli hover:bg-ivory-warm'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-chilli rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action CTAs */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Retail / Wholesale Mode Switcher */}
              <button
                type="button"
                onClick={toggleWholesaleMode}
                className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  isWholesaleMode
                    ? 'bg-plum-900 text-turmeric border-plum-900 shadow-plum'
                    : 'bg-white text-cocoa border-ivory-border hover:border-chilli-300 hover:bg-ivory-warm'
                }`}
                title="Toggle Wholesale B2B vs Retail Pricing"
              >
                <Store className={`w-3.5 h-3.5 ${isWholesaleMode ? 'text-turmeric' : 'text-chilli'}`} />
                <span>{isWholesaleMode ? 'Wholesale Rates' : 'Retail Mode'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isWholesaleMode ? 'bg-turmeric text-plum-900' : 'bg-peach-100 text-chilli-700'}`}>
                  {isWholesaleMode ? 'Active' : 'Switch'}
                </span>
              </button>

              {/* Watch Intro Button */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('sri-balaji-replay-intro'))}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-plum-950 bg-turmeric-400/20 hover:bg-turmeric/30 border border-turmeric/40 transition-all shadow-xs"
                title="Play 4K Cinematic Introduction"
              >
                <Play className="w-3.5 h-3.5 fill-current text-turmeric-600" />
                <span className="font-extrabold text-plum-900">Watch Intro</span>
              </button>

              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-2xl bg-white border border-ivory-border text-cocoa hover:text-chilli hover:border-chilli-200 hover:bg-ivory-warm flex items-center justify-center transition-all shadow-xs"
                aria-label="Search snacks"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/catalog?filter=wishlist"
                className="relative w-10 h-10 rounded-2xl bg-white border border-ivory-border text-cocoa hover:text-chilli hover:border-chilli-200 hover:bg-ivory-warm flex items-center justify-center transition-all shadow-xs"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-chilli fill-chilli' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-chilli text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl bg-plum-900 text-white font-bold text-xs sm:text-sm hover:bg-plum-800 active:scale-95 transition-all shadow-soft group"
                aria-label={`Cart with ${itemCount} items`}
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-turmeric group-hover:scale-110 transition-transform" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-chilli text-white text-[9px] font-black flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Bag</span>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-2xl bg-white border border-ivory-border text-plum-900 flex items-center justify-center hover:bg-ivory-warm transition-all"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Animated Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-ivory-border px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-3 duration-200">
            {/* Wholesale Mode Toggle (Mobile) */}
            <div className="mb-4 p-3 rounded-2xl bg-ivory-warm border border-ivory-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-chilli" />
                <div>
                  <span className="text-xs font-bold text-plum-900 block">
                    {isWholesaleMode ? 'Wholesale Pricing Active' : 'Retail Household Mode'}
                  </span>
                  <span className="text-[10px] text-cocoa-muted">
                    {isWholesaleMode ? 'Bulk carton & Kirana rates' : 'Standard packet rates'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleWholesaleMode}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  isWholesaleMode ? 'bg-plum-900 text-turmeric' : 'bg-chilli text-white'
                }`}
              >
                Switch
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      active
                        ? 'bg-peach-50 text-chilli-700'
                        : 'text-cocoa hover:bg-ivory-warm'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-stone-300" />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Contact Quick Actions */}
            <div className="mt-5 pt-4 border-t border-ivory-border grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20I%20would%20like%20to%20enquire%20about%20snacks`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-pista-50 border border-pista-200 text-pista-800 text-xs font-bold"
              >
                <WhatsAppIcon className="w-4 h-4" variant="green" />
                <span>WhatsApp</span>
              </a>

              <a
                href="tel:+919437135342"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-peach-50 border border-peach-200 text-chilli-800 text-xs font-bold"
              >
                <Phone className="w-4 h-4 text-chilli" />
                <span>Call Store</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Accessible Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
