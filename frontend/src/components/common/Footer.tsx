import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { initialBusinessSettings } from '../../data/initialData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-spice-dark text-cream-warm pt-16 pb-24 md:pb-12 border-t-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-spice-muted/40">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-crimson-800 border border-gold-400 flex items-center justify-center">
                <span className="font-display font-bold text-gold-300 text-lg">SB</span>
              </div>
              <span className="font-display font-extrabold text-2xl text-cream tracking-wide">
                SRI BALAJI
              </span>
            </div>
            
            <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
              "{initialBusinessSettings.tagline}"
            </p>

            <p className="text-sm text-cream-surface/80 leading-relaxed">
              {initialBusinessSettings.business_description}
            </p>

            <div className="pt-1 flex flex-col gap-2">
              <span className="text-xs text-cream-surface/90">
                <strong>Founders &amp; Management:</strong><br />
                Adari Krishna Rao (Father) &amp; Adari Dilleshwar Rao (Son)
              </span>

              {initialBusinessSettings.instagram_url && (
                <a
                  href={initialBusinessSettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-800 to-pink-700 text-white text-xs font-bold hover:opacity-90 transition-opacity w-fit"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>@sri_balaji_special_mixtures</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-gold-300 text-lg tracking-wide uppercase text-sm">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-cream-surface/80">
              <li>
                <Link to="/catalog" className="hover:text-gold-400 transition-colors">
                  Snack Catalogue
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=mixtures" className="hover:text-gold-400 transition-colors">
                  Special Mixtures
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=chips" className="hover:text-gold-400 transition-colors">
                  Potato &amp; Banana Chips
                </Link>
              </li>
              <li>
                <Link to="/bundles" className="hover:text-gold-400 transition-colors">
                  Smart Snack Bundles
                </Link>
              </li>
              <li>
                <Link to="/wholesale" className="hover:text-gold-400 transition-colors">
                  Bulk Wholesale Ordering (B2B)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors">
                  Our 30-Year Heritage
                </Link>
              </li>
            </ul>
          </div>

          {/* Food Quality & Transparency */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-gold-300 text-lg tracking-wide uppercase text-sm">
              Quality &amp; Hygiene Standards
            </h3>
            <div className="space-y-3 text-xs text-cream-surface/80">
              <p>
                <strong className="text-cream">Experience:</strong> 30 Years of trusted snack making in Gajapati, Odisha.
              </p>
              <p>
                <strong className="text-cream">Cooking Process:</strong> Traditional frying with temperature-regulated pure edible oils.
              </p>
              <p>
                <strong className="text-cream">Packaging:</strong> Airtight moisture-barrier food-grade pouches preserving crispness.
              </p>
              <p>
                <strong className="text-cream">Wholesale Supply:</strong> Daily batches supplied across Paralakhemundi and regional distributor hubs.
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-gold-300 text-lg tracking-wide uppercase text-sm">
              Location &amp; Order Hotlines
            </h3>
            <div className="space-y-2.5 text-xs text-cream-surface/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  {initialBusinessSettings.address}, {initialBusinessSettings.city}, {initialBusinessSettings.state}, India - {initialBusinessSettings.pin_code}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a href="tel:9437135342" className="hover:text-gold-300 font-bold">
                    +91 94371 35342
                  </a>
                  <a href="tel:7735333542" className="hover:text-gold-300 font-bold">
                    +91 77353 33542
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to order wholesale snacks.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 text-emerald-400 font-bold"
                >
                  WhatsApp: +91 98617 89602
                </a>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-gold-300 text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>30 Years • Authentic Taste</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-surface/60 gap-4">
          <p>© {new Date().getFullYear()} Sri Balaji. All rights reserved. Paralakhemundi, Gajapati, Odisha.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-gold-400 transition-colors">Our Story</Link>
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
