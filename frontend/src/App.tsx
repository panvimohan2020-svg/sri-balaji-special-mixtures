import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';
import { BackToTopButton } from './components/common/BackToTopButton';
import { ToastContainer } from './components/common/ToastContainer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BundlesPage } from './pages/BundlesPage';
import { WholesalePage } from './pages/WholesalePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Download, X } from 'lucide-react';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// PWA Install Prompt Banner Component
const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 md:bottom-24 left-4 right-4 md:left-auto md:right-24 md:max-w-sm z-40 p-4 rounded-2xl bg-crimson-900 text-cream-warm shadow-elevated border-2 border-gold-400 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-gold-300" />
        </div>
        <div className="text-left">
          <span className="font-display font-bold text-sm text-white block">Install Sri Balaji App</span>
          <span className="text-[11px] text-gold-200 block">Offline snack menu &amp; instant mobile ordering</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="px-3 py-1.5 rounded-lg bg-gold-500 text-spice-dark text-xs font-bold hover:bg-gold-400 transition-colors shadow-xs"
        >
          Install
        </button>
        <button
          type="button"
          onClick={() => setShowBanner(false)}
          className="p-1 text-gold-200 hover:text-white"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-cream text-spice">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/bundles" element={<BundlesPage />} />
            <Route path="/wholesale" element={<WholesalePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            
            {/* Admin Portal Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>

        <Footer />
        <MobileBottomNav />
        <FloatingWhatsAppButton />
        <BackToTopButton />
        <ToastContainer />
        <PWAInstallBanner />
      </div>
    </BrowserRouter>
  );
};

export default App;
