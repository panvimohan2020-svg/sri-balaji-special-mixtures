import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, ShieldCheck, Heart, ExternalLink, Clock, Store, Award } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { InstagramIcon } from './InstagramIcon';
import { initialBusinessSettings } from '../../data/initialData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-plum-950 text-ivory pt-16 pb-28 md:pb-14 border-t-4 border-turmeric">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-plum-800">
          
          {/* Brand Info & Authentic Logo */}
          <div className="space-y-4">
            <Link to="/" className="inline-block" aria-label="Sri Balaji Home">
              <BrandLogo variant="with-badge" size="lg" showSubtitle={true} className="[&_span]:text-white [&_.text-plum-900]:text-turmeric [&_.text-cocoa-muted]:text-ivory/70" />
            </Link>
            
            <p className="text-xs font-bold text-turmeric uppercase tracking-widest">
              &ldquo;{initialBusinessSettings.tagline}&rdquo;
            </p>

            <p className="text-sm text-ivory/80 leading-relaxed">
              {initialBusinessSettings.business_description}
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-ivory/90">
                <strong className="text-turmeric block mb-0.5">Founders &amp; Master Crafters:</strong>
                Adari Krishna Rao (Father) &amp; Adari Dilleshwar Rao (Son)
              </div>

              {initialBusinessSettings.instagram_url && (
                <a
                  href={initialBusinessSettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-800 via-pink-700 to-amber-600 text-white text-xs font-bold hover:opacity-95 transition-all shadow-sm w-fit"
                >
                  <InstagramIcon className="w-4 h-4" useGradient={false} />
                  <span>@sri_balaji_special_mixtures</span>
                  <ExternalLink className="w-3 h-3 text-white/70" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="font-display font-bold text-base text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-chilli" />
              <span>Explore Store</span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-ivory/80 hover:text-turmeric transition-colors">
                  Home &amp; Highlights
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-ivory/80 hover:text-turmeric transition-colors">
                  All Savouries &amp; Mixtures
                </Link>
              </li>
              <li>
                <Link to="/bundles" className="text-ivory/80 hover:text-turmeric transition-colors">
                  Smart Snack Combos &amp; Sets
                </Link>
              </li>
              <li>
                <Link to="/wholesale" className="text-ivory/80 hover:text-turmeric transition-colors">
                  Wholesale Bulk Cartons (B2B)
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-ivory/80 hover:text-turmeric transition-colors">
                  Our 30-Year Heritage Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ivory/80 hover:text-turmeric transition-colors">
                  Store Locator &amp; Enquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Snack Categories & Specialties */}
          <div>
            <h4 className="font-display font-bold text-base text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-turmeric" />
              <span>Specialties</span>
            </h4>
            <ul className="space-y-3 text-sm text-ivory/80">
              <li>
                <Link to="/catalog?category=special-mixtures" className="hover:text-turmeric transition-colors">
                  Onion &amp; Chuda Special Mixtures
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=traditional-murrukulu" className="hover:text-turmeric transition-colors">
                  Kar Kar Murrukulu &amp; Rings
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=crunchy-pakodi" className="hover:text-turmeric transition-colors">
                  Crispy Peanuts Pakodi
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=chivda-special" className="hover:text-turmeric transition-colors">
                  Gujarat Mix &amp; Namkeen
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=kaju-delights" className="hover:text-turmeric transition-colors">
                  Kaju Biscuits Mixture
                </Link>
              </li>
              <li>
                <span className="inline-block mt-2 px-2.5 py-1 rounded-lg bg-turmeric-400/20 text-turmeric font-semibold text-xs border border-turmeric-400/30">
                  ✨ 100% Pure Veg • Trans-fat Safe
                </span>
              </li>
            </ul>
          </div>

          {/* Wholesale & Store Contact */}
          <div>
            <h4 className="font-display font-bold text-base text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pista" />
              <span>Visit &amp; Contact</span>
            </h4>

            <div className="space-y-4 text-xs text-ivory/90">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-turmeric shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Manufacturing &amp; Store:</strong>
                  <span>{initialBusinessSettings.address}</span>
                  <span className="block mt-0.5 text-ivory/70">
                    {initialBusinessSettings.city}, {initialBusinessSettings.state} – {initialBusinessSettings.pin_code}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-chilli shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Store Orders &amp; Calls:</strong>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <a href="tel:+919437135342" className="hover:text-turmeric transition-colors font-mono font-bold">
                      +91 94371 35342
                    </a>
                    <a href="tel:+917735333542" className="hover:text-turmeric transition-colors font-mono font-bold">
                      +91 77353 33542
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <WhatsAppIcon className="w-4 h-4 text-pista shrink-0 mt-0.5" variant="green" />
                <div>
                  <strong className="text-white block font-semibold">Wholesale WhatsApp Desk:</strong>
                  <a
                    href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20I%20am%20interested%20in%20placing%20a%20wholesale%20order`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pista transition-colors font-mono font-bold text-pista-300"
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
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pista text-plum-950 font-bold text-xs uppercase tracking-wider hover:bg-pista-400 active:scale-95 transition-all shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4" variant="currentColor" />
                  <span>Request Wholesale Catalog</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Trust & Legal Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory/60">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-turmeric" />
            <span>&copy; {new Date().getFullYear()} Sri Balaji – Special Mixtures. All rights reserved. 30+ Years of Odia Culinary Heritage.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-pista-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-pista" />
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
