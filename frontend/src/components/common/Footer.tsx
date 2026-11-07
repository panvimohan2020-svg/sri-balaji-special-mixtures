import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, ShieldCheck, Heart, ExternalLink, Clock, Store } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { InstagramIcon } from './InstagramIcon';
import { initialBusinessSettings } from '../../data/initialData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-spice-dark text-cream-warm pt-16 pb-28 md:pb-14 border-t-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-spice-muted/40">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-crimson-800 to-crimson-900 border border-gold-400 flex items-center justify-center shadow-md">
                <span className="font-display font-bold text-gold-300 text-xl">SB</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-2xl text-cream tracking-wide">
                  SRI BALAJI
                </span>
                <span className="text-[10px] text-gold-400 uppercase tracking-widest font-bold">
                  Special Mixtures • Since 1995
                </span>
              </div>
            </div>
            
            <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
              "{initialBusinessSettings.tagline}"
            </p>

            <p className="text-sm text-cream-surface/80 leading-relaxed">
              {initialBusinessSettings.business_description}
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-cream-surface/90">
                <strong className="text-gold-300 block mb-0.5">Founders &amp; Proprietors:</strong>
                Adari Krishna Rao (Father) &amp; Adari Dilleshwar Rao (Son)
              </div>

              {initialBusinessSettings.instagram_url && (
                <a
                  href={initialBusinessSettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-800 via-pink-700 to-amber-600 text-white text-xs font-bold hover:opacity-95 transition-all shadow-sm w-fit"
                >
                  <InstagramIcon className="w-4 h-4" useGradient={false} />
                  <span>@sri_balaji_special_mixtures</span>
                  <ExternalLink className="w-3 h-3 text-white/70" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-gold-300 text-lg tracking-wide uppercase text-sm border-b border-white/10 pb-2">
              Explore Snacks
            </h3>
            <ul className="space-y-2.5 text-sm text-cream-surface/80">
              <li>
                <Link to="/catalog" className="hover:text-gold-400 transition-colors flex items-center gap-2">
                  <span>Snack Catalogue</span>
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=mixtures" className="hover:text-gold-400 transition-colors">
                  Special Mixtures (Onion &amp; Chuda)
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=traditional-snacks" className="hover:text-gold-400 transition-colors">
                  Traditional Savouries (Murrukulu &amp; Rings)
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=spicy-snacks" className="hover:text-gold-400 transition-colors">
                  Spicy Peanuts Pakodi
                </Link>
              </li>
              <li>
                <Link to="/bundles" className="hover:text-gold-400 transition-colors">
                  Smart Snack Bundles
                </Link>
              </li>
              <li>
                <Link to="/wholesale" className="hover:text-gold-400 transition-colors flex items-center gap-1.5 text-gold-300 font-semibold">
                  <Store className="w-3.5 h-3.5 text-gold-400" />
                  <span>Wholesale B2B Rate Card</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors">
                  Our 30-Year Heritage &amp; Kitchen
                </Link>
              </li>
            </ul>
          </div>

          {/* Food Quality & Transparency */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-gold-300 text-lg tracking-wide uppercase text-sm border-b border-white/10 pb-2">
              Quality &amp; Hygiene Standards
            </h3>
            <div className="space-y-3 text-xs text-cream-surface/80">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-bold text-gold-300 block">30+ Years Trust</span>
                <p>Consistent South Indian and Odia recipes prepared in pure refined oils.</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-bold text-gold-300 block">Moisture-Barrier Pouching</span>
                <p>Heavy-gauge sealed pouches preventing sogginess and preserving crunch.</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-bold text-gold-300 block">Daily Road Dispatches</span>
                <p>Supplying kirana stores, tea vendors, and caterers across Gajapati district.</p>
              </div>
            </div>
          </div>

          {/* Contact Details & WhatsApp */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-gold-300 text-lg tracking-wide uppercase text-sm border-b border-white/10 pb-2">
              Direct Contact &amp; Desk
            </h3>
            <div className="space-y-3 text-xs text-cream-surface/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  {initialBusinessSettings.address}, {initialBusinessSettings.city}, {initialBusinessSettings.state}, India - {initialBusinessSettings.pin_code}
                </span>
              </div>
              
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a href="tel:9437135342" className="hover:text-gold-300 font-bold text-cream">
                    +91 94371 35342 (Primary)
                  </a>
                  <a href="tel:7735333542" className="hover:text-gold-300 font-bold text-cream">
                    +91 77353 33542 (Alternate)
                  </a>
                </div>
              </div>

              {/* Official WhatsApp Action in Footer */}
              <div className="pt-1">
                <a 
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to place an order for wholesale snacks.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold transition-all shadow-sm w-full justify-center"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" variant="white" />
                  <span>WhatsApp: +91 98617 89602</span>
                </a>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-cream-surface/70">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Pure Vegetarian</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  <span>Open Daily</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-surface/60 gap-4">
          <p>© {new Date().getFullYear()} Sri Balaji. All rights reserved. Gandhi School Road, Paralakhemundi, Gajapati, Odisha - 761200.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-gold-400 transition-colors">Our 30-Yr Heritage</Link>
            <span>•</span>
            <Link to="/wholesale" className="hover:text-gold-400 transition-colors">Wholesale Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-gold-400 transition-colors">Contact</Link>
            {initialBusinessSettings.instagram_url && (
              <>
                <span>•</span>
                <a href={initialBusinessSettings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
                  Instagram
                </a>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
