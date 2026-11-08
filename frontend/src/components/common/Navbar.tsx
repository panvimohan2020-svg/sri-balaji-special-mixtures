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
  Play,
  User,
  Mic
} from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { BrandLogo } from './BrandLogo';
import { SearchModal } from './SearchModal';
import { LanguageSelector } from './LanguageSelector';
import { VoiceOrderModal } from './VoiceOrderModal';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCustomerAuthStore } from '../../store/useCustomerAuthStore';
import { useTranslation } from '../../store/useLanguageStore';
import { initialBusinessSettings } from '../../data/initialData';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const location = useLocation();
  const { isWholesaleMode, toggleWholesaleMode, getItemCount } = useCartStore();
  const { getWishlistCount } = useWishlistStore();
  const { t } = useTranslation();
  
  const itemCount = getItemCount();
  const wishlistCount = getWishlistCount();
  const { customer } = useCustomerAuthStore();

  // Simplified, short navigation labels as requested
  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.shop', 'Shop'), path: '/catalog' },
    { name: t('nav.collections', 'Collections'), path: '/bundles' },
    { name: t('nav.bulkOrders', 'Bulk Orders'), path: '/wholesale' },
    { name: t('nav.trackOrder', 'Track Order'), path: '/track' },
    { name: t('nav.about', 'About'), path: '/about' },
    { name: t('nav.contact', 'Contact'), path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-imperial-dark via-imperial to-imperial-dark text-ivory border-b border-gold/30 shadow-royal transition-all">
        {/* Top Announcement Bar */}
        <AnnouncementBar />

        {/* Main Header Container - Full width with contained inner spacing to prevent clipping */}
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-[76px] xl:h-[80px]">
            
            {/* Authentic Brand Logo - Bold, Prominent & Recognizable */}
            <Link to="/" className="flex items-center group py-0.5 shrink-0" aria-label="Sri Balaji Home">
              <BrandLogo variant="compact" size="md" showSubtitle={true} />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 mx-2" aria-label="Primary Navigation">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-2.5 py-1.5 xl:px-3 rounded-xl text-xs xl:text-[13px] font-sans transition-all whitespace-nowrap ${
                      active
                        ? 'text-gold bg-gold/20 font-bold border border-gold/40 shadow-xs'
                        : 'text-ivory/85 hover:text-gold hover:bg-gold/10 font-semibold'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-0.5 left-2.5 right-2.5 h-0.5 bg-gold rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action CTAs: Retail Mode, Watch Intro, Language, Voice, Search, Wishlist, Account, Bag */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Retail / Wholesale Mode Switcher */}
              <button
                type="button"
                onClick={toggleWholesaleMode}
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-xs ${
                  isWholesaleMode
                    ? 'bg-gold text-imperial border-gold shadow-gold font-black'
                    : 'bg-imperial-dark/90 text-gold border-gold/40 hover:border-gold hover:bg-imperial'
                }`}
                title="Toggle Wholesale B2B vs Retail Pricing"
              >
                <Store className={`w-3.5 h-3.5 ${isWholesaleMode ? 'text-imperial' : 'text-gold'}`} />
                <span className="hidden xl:inline">
                  {isWholesaleMode ? t('nav.wholesaleMode', 'Wholesale') : t('nav.retailMode', 'Retail')}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                  isWholesaleMode ? 'bg-imperial text-gold font-black' : 'bg-gold/20 text-gold'
                }`}>
                  {isWholesaleMode ? t('nav.active', 'Active') : t('nav.switch', 'Switch')}
                </span>
              </button>

              {/* Watch Intro Button */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('sri-balaji-replay-intro'))}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black text-imperial bg-gradient-to-r from-gold to-gold-rich hover:from-gold-light hover:to-gold border border-gold/60 transition-all shadow-gold active:scale-95 cursor-pointer"
                title="Play 4K Cinematic Introduction"
              >
                <Play className="w-3 h-3 fill-current text-imperial" />
                <span>{t('nav.intro', 'Intro')}</span>
              </button>

              {/* Language Selector */}
              <div className="hidden sm:block">
                <LanguageSelector compact={true} variant="royal" />
              </div>

              {/* Voice Ordering Trigger */}
              <button
                type="button"
                onClick={() => setIsVoiceOpen(true)}
                className="w-8 h-8 xl:w-8.5 xl:h-8.5 rounded-xl bg-imperial-dark/80 border border-gold/30 text-gold-light hover:text-gold hover:border-gold hover:bg-imperial flex items-center justify-center transition-all shadow-xs active:scale-95"
                aria-label="Voice ordering"
                title={t('nav.voice', 'Bolke Mangwao (Voice Order)')}
              >
                <Mic className="w-3.5 h-3.5 text-gold" />
              </button>

              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-8 h-8 xl:w-8.5 xl:h-8.5 rounded-xl bg-imperial-dark/80 border border-gold/30 text-gold-light hover:text-gold hover:border-gold hover:bg-imperial flex items-center justify-center transition-all shadow-xs active:scale-95"
                aria-label="Search snacks"
                title={t('nav.search', 'Search snacks')}
              >
                <Search className="w-3.5 h-3.5 text-gold-light" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/catalog?filter=wishlist"
                className="relative w-8 h-8 xl:w-8.5 xl:h-8.5 rounded-xl bg-imperial-dark/80 border border-gold/30 text-gold-light hover:text-gold hover:border-gold hover:bg-imperial flex items-center justify-center transition-all shadow-xs active:scale-95"
                aria-label={`Wishlist with ${wishlistCount} items`}
                title={t('nav.wishlist', 'Wishlist')}
              >
                <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'text-gold fill-gold' : 'text-gold-light'}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-imperial text-[9px] font-black flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Customer Account */}
              <Link
                to="/account"
                className="w-8 h-8 xl:w-8.5 xl:h-8.5 rounded-xl bg-imperial-dark/80 border border-gold/30 text-gold-light hover:text-gold hover:border-gold hover:bg-imperial flex items-center justify-center transition-all shadow-xs active:scale-95"
                aria-label="My Account"
                title={customer ? `Signed in as ${customer.full_name}` : t('nav.account', 'Sign In / Account')}
              >
                <User className={`w-3.5 h-3.5 ${customer ? 'text-gold font-bold' : 'text-gold-light'}`} />
              </Link>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-gold to-gold-rich hover:from-gold-light hover:to-gold text-imperial font-black text-xs transition-all shadow-gold group active:scale-95"
                aria-label={`Cart with ${itemCount} items`}
              >
                <div className="relative">
                  <ShoppingBag className="w-3.5 h-3.5 text-imperial group-hover:scale-110 transition-transform" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-imperial text-gold text-[8px] font-black flex items-center justify-center shadow-xs border border-gold/40">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-imperial font-extrabold">{t('nav.bag', 'Bag')}</span>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-8.5 h-8.5 rounded-xl bg-imperial-dark border border-gold/40 text-gold flex items-center justify-center hover:bg-imperial transition-all active:scale-95"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Animated Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gradient-to-b from-imperial via-imperial-dark to-imperial border-b border-gold/30 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top-3 duration-200">
            {/* Wholesale Mode Toggle (Mobile) */}
            <div className="mb-3 p-3 rounded-2xl bg-imperial-dark/90 border border-gold/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-gold" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isWholesaleMode ? t('nav.wholesaleMode', 'Wholesale Rates') : t('nav.retailMode', 'Retail Mode')}
                  </span>
                  <span className="text-[10px] text-ivory/70">
                    {isWholesaleMode ? 'Bulk carton & Kirana rates' : 'Standard packet rates'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleWholesaleMode}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  isWholesaleMode ? 'bg-gold text-imperial font-black shadow-gold' : 'bg-imperial text-gold border border-gold/40'
                }`}
              >
                {t('nav.switch', 'Switch')}
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
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                      active
                        ? 'bg-gold/20 text-gold border border-gold/40'
                        : 'text-ivory/85 hover:bg-white/5 hover:text-gold'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-gold/60" />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Actions: Watch Intro & Voice */}
            <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-gold/20">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.dispatchEvent(new Event('sri-balaji-replay-intro'));
                }}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-gold text-imperial font-black text-xs shadow-gold"
              >
                <Play className="w-3.5 h-3.5 fill-imperial" />
                <span>{t('nav.watchIntro', 'Watch Intro')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsVoiceOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-imperial-dark border border-gold/30 text-gold text-xs font-bold"
              >
                <Mic className="w-3.5 h-3.5 text-gold" />
                <span>{t('nav.voice', 'Voice Order')}</span>
              </button>
            </div>

            {/* Mobile Language Selector */}
            <div className="py-2.5 mt-2 flex items-center justify-between border-t border-gold/20">
              <span className="text-xs font-bold text-ivory">{t('nav.language', 'Language')} / ଭାଷା:</span>
              <LanguageSelector variant="royal" />
            </div>

            {/* Mobile Contact Quick Actions */}
            <div className="mt-3 pt-3 border-t border-gold/20 grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20I%20would%20like%20to%20enquire%20about%20snacks`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald/20 border border-emerald text-emerald-300 text-xs font-bold"
              >
                <WhatsAppIcon className="w-4 h-4" variant="green" />
                <span>WhatsApp</span>
              </a>

              <a
                href="tel:+919437135342"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-imperial-dark border border-gold/30 text-gold text-xs font-bold"
              >
                <Phone className="w-4 h-4 text-gold" />
                <span>{t('announcement.callStore', 'Call Store')}</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Accessible Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Voice Ordering Assistant Modal */}
      <VoiceOrderModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </>
  );
};
