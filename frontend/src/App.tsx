import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';
import { BackToTopButton } from './components/common/BackToTopButton';
import { ToastContainer } from './components/common/ToastContainer';
import { AnimatedBackground } from './components/common/AnimatedBackground';
import { CinematicIntro } from './components/common/CinematicIntro';
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
import { OwnerActivationPage } from './pages/admin/OwnerActivationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { DealerPortalPage } from './pages/DealerPortalPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/legal/TermsConditionsPage';
import { RefundPolicyPage } from './pages/legal/RefundPolicyPage';
import { ShippingPolicyPage } from './pages/legal/ShippingPolicyPage';
import { DeliveryCoveragePage } from './pages/DeliveryCoveragePage';
import { trackMarketingEvent } from './utils/analytics';
import { Download, X } from 'lucide-react';

// Scroll to top on route change & track page view
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    trackMarketingEvent('PAGE_VIEW');
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
    <div className="fixed bottom-20 md:bottom-24 left-4 right-4 md:left-auto md:right-24 md:max-w-sm z-40 p-4 rounded-2xl bg-gradient-to-r from-imperial-dark to-imperial text-ivory shadow-royal border border-gold/40 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-gold" />
        </div>
        <div className="text-left">
          <span className="font-display font-black text-sm text-white block">Install Sri Balaji App</span>
          <span className="text-[11px] text-gold-light/80 block">Offline snack menu &amp; instant mobile ordering</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="px-3.5 py-1.5 rounded-xl bg-gold text-imperial text-xs font-black hover:bg-gold-rich transition-all shadow-gold"
        >
          Install
        </button>
        <button
          type="button"
          onClick={() => setShowBanner(false)}
          className="p-1 text-gold/60 hover:text-gold transition-colors"
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
      <CinematicIntro />
      <div className="min-h-screen flex flex-col bg-ivory text-cocoa relative">
        <AnimatedBackground />
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/bundles" element={<BundlesPage />} />
            <Route path="/wholesale" element={<WholesalePage />} />
            <Route path="/delivery-coverage" element={<DeliveryCoveragePage />} />
            <Route path="/coverage" element={<DeliveryCoveragePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Customer Account & Order Tracking */}
            <Route path="/track" element={<OrderTrackingPage />} />
            <Route path="/track/:orderNumber" element={<OrderTrackingPage />} />
            <Route path="/account" element={<CustomerAccountPage />} />
            <Route path="/orders" element={<CustomerAccountPage />} />

            {/* Legal & Compliance Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-conditions" element={<TermsConditionsPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            
            {/* Wholesale B2B Dealer Portal */}
            <Route path="/dealer" element={<DealerPortalPage />} />
            <Route path="/dealer/dashboard" element={<DealerPortalPage />} />
            
            {/* Admin Portal Routes */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/owner-activation" element={<OwnerActivationPage />} />
            <Route path="/admin/activate" element={<OwnerActivationPage />} />
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
