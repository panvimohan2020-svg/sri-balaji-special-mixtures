import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, ShieldCheck, Heart, ExternalLink, Clock, Store, Award, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { InstagramIcon } from './InstagramIcon';
import { initialBusinessSettings } from '../../data/initialData';
import { useTranslation } from '../../store/useLanguageStore';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-imperial-dark text-ivory pt-16 pb-28 md:pb-14 border-t-4 border-gold shadow-royal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-imperial-border/60">
          
          {/* Brand Info & Authentic Logo */}
          <div className="space-y-4">
            <Link to="/" className="inline-block" aria-label="Sri Balaji Home">
              <BrandLogo variant="with-badge" size="lg" showSubtitle={true} />
            </Link>
            
            <div>
              <span className="font-script text-gold text-2xl block mb-1">Taste the Tradition</span>
              <p className="text-xs font-bold text-gold uppercase tracking-widest">
                &ldquo;{t('footer.tagline', initialBusinessSettings.tagline)}&rdquo;
              </p>
            </div>

            <p className="font-serif text-sm text-ivory/80 leading-relaxed italic">
              {t('footer.desc', initialBusinessSettings.business_description)}
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <div className="p-3 rounded-2xl bg-imperial/60 border border-gold/25 text-xs text-ivory/90">
                <strong className="text-gold block mb-0.5">{t('footer.masterCrafters', 'Founders & Master Crafters:')}</strong>
                {t('footer.craftersNames', 'Adari Krishna Rao (Father) & Adari Dilleshwar Rao (Son)')}
              </div>

              {initialBusinessSettings.instagram_url && (
                <a
                  href={initialBusinessSettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-imperial via-imperial-secondary to-imperial text-gold border border-gold/40 text-xs font-bold hover:opacity-95 transition-all shadow-sm w-fit"
                >
                  <InstagramIcon className="w-4 h-4" useGradient={false} />
                  <span>@sri_balaji_special_mixtures</span>
                  <ExternalLink className="w-3 h-3 text-gold/70" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="font-display font-bold text-base text-gold uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <span>{t('footer.exploreStore', 'Explore Store')}</span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-ivory/80 hover:text-gold transition-colors">
                  Home &amp; Highlights
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-ivory/80 hover:text-gold transition-colors">
                  All Savouries &amp; Mixtures
                </Link>
              </li>
              <li>
                <Link to="/bundles" className="text-ivory/80 hover:text-gold transition-colors">
                  Smart Snack Combos &amp; Sets
                </Link>
              </li>
              <li>
                <Link to="/wholesale" className="text-ivory/80 hover:text-gold transition-colors">
                  Wholesale Bulk Cartons (B2B)
                </Link>
              </li>
              <li>
                <Link to="/delivery-coverage" className="text-ivory/80 hover:text-gold transition-colors flex items-center gap-1.5">
                  <span className="text-gold-light">🚚</span>
                  <span>Regional Delivery Coverage</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-ivory/80 hover:text-gold transition-colors">
                  Our 30-Year Heritage Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ivory/80 hover:text-gold transition-colors">
                  Store Locator &amp; Enquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Snack Categories & Specialties */}
          <div>
            <h4 className="font-display font-bold text-base text-gold uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald" />
              <span>{t('footer.specialties', 'Specialties')}</span>
            </h4>
            <ul className="space-y-3 text-sm text-ivory/80">
              <li>
                <Link to="/catalog?category=special-mixtures" className="hover:text-gold transition-colors">
                  Onion &amp; Chuda Special Mixtures
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=traditional-murrukulu" className="hover:text-gold transition-colors">
                  Kar Kar Murrukulu &amp; Rings
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=crunchy-pakodi" className="hover:text-gold transition-colors">
                  Crispy Peanuts Pakodi
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=chivda-special" className="hover:text-gold transition-colors">
                  Gujarat Mix &amp; Namkeen
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=kaju-delights" className="hover:text-gold transition-colors">
                  Kaju Biscuits Mixture
                </Link>
              </li>
              <li>
                <span className="inline-block mt-2 px-2.5 py-1 rounded-lg bg-emerald/20 text-emerald-soft font-semibold text-xs border border-emerald/40">
                  ✨ 100% Pure Veg • Trans-fat Safe
                </span>
              </li>
            </ul>
          </div>

          {/* Wholesale & Store Contact */}
          <div>
            <h4 className="font-display font-bold text-base text-gold uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald" />
              <span>Visit &amp; Contact</span>
            </h4>

            <div className="space-y-4 text-xs text-ivory/90">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Manufacturing &amp; Store:</strong>
                  <span>{initialBusinessSettings.address}</span>
                  <span className="block mt-0.5 text-ivory/70">
                    {initialBusinessSettings.city}, {initialBusinessSettings.state} – {initialBusinessSettings.pin_code}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Store Orders &amp; Calls:</strong>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <a href="tel:+919437135342" className="hover:text-gold transition-colors font-mono font-bold">
                      +91 94371 35342
                    </a>
                    <a href="tel:+917735333542" className="hover:text-gold transition-colors font-mono font-bold">
                      +91 77353 33542
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <WhatsAppIcon className="w-4 h-4 text-emerald shrink-0 mt-0.5" variant="green" />
                <div>
                  <strong className="text-white block font-semibold">Wholesale WhatsApp Desk:</strong>
                  <a
                    href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20I%20am%20interested%20in%20placing%20a%20wholesale%20order`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-soft transition-colors font-mono font-bold text-emerald-soft"
                  >
                    +91 98617 89602
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20please%20send%20me%20your%20latest%20wholesale%20price%20catalogue`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-royal-gold w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-black uppercase tracking-wider active:scale-95 transition-all shadow-gold"
                >
                  <WhatsAppIcon className="w-4 h-4" variant="currentColor" />
                  <span>Request Wholesale Catalog</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Legal & Compliance Links */}
        <div className="py-4 border-b border-imperial-border/50 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ivory/70">
          <Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link>
          <span className="text-ivory/30">•</span>
          <Link to="/terms-conditions" className="hover:text-gold transition-colors">Terms &amp; Conditions</Link>
          <span className="text-ivory/30">•</span>
          <Link to="/refund-policy" className="hover:text-gold transition-colors">Cancellation &amp; Refund Policy</Link>
          <span className="text-ivory/30">•</span>
          <Link to="/shipping-policy" className="hover:text-gold transition-colors">Shipping &amp; Delivery Policy</Link>
          <span className="text-ivory/30">•</span>
          <Link to="/admin/login" className="hover:text-gold transition-colors inline-flex items-center gap-1.5 text-gold/80 font-bold">
            <Lock className="w-3 h-3 text-gold" />
            <span>Staff &amp; Admin Portal</span>
          </Link>
        </div>

        {/* Bottom Trust & Legal Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory/60">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gold shrink-0" />
            <span>&copy; {new Date().getFullYear()} Sri Balaji. {t('footer.rights', 'All Rights Reserved. Handcrafted with pride in Paralakhemundi, Odisha.')}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-soft font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald" />
              100% Traditional Recipe Guarantee
            </span>
            <span className="text-ivory/30">|</span>
            <span className="text-ivory/60">Crafted with care in Paralakhemundi</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
