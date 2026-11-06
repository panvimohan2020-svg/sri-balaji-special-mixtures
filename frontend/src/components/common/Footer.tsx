import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, Award, Heart } from 'lucide-react';
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
            <p className="text-sm text-cream-surface/80 leading-relaxed">
              Wholesale manufacturer and supplier of authentic, fresh, and crispy Indian savouries, special mixtures, and golden wafers prepared with traditional care.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-spice/70 border border-gold-600/30 text-xs text-gold-300">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Hygienic Preparation • 100% Quality Oils</span>
              </div>
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
                  Crispy Potato &amp; Banana Chips
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
                  Our Manufacturing Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Food Quality & Transparency */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-gold-300 text-lg tracking-wide uppercase text-sm">
              Food Standards &amp; Safety
            </h3>
            <div className="space-y-3 text-xs text-cream-surface/80">
              <p>
                <strong className="text-cream">Edible Oils:</strong> Refined groundnut and sunflower oils with zero re-heating abuse.
              </p>
              <p>
                <strong className="text-cream">Packaging:</strong> Multi-layer moisture-lock pouches preserving natural crispness.
              </p>
              <p>
                <strong className="text-cream">FSSAI Status:</strong>{' '}
                {initialBusinessSettings.fssai_number ? (
                  <span className="text-gold-400 font-semibold">{initialBusinessSettings.fssai_number}</span>
                ) : (
                  <span className="italic text-cream-surface/60">Verified Registration Provided on Invoices</span>
                )}
              </p>
              <p>
                <strong className="text-cream">Wholesale Supply:</strong> {initialBusinessSettings.wholesale_locations}
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-gold-300 text-lg tracking-wide uppercase text-sm">
              Factory &amp; Wholesale Office
            </h3>
            <div className="space-y-2.5 text-xs text-cream-surface/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  {initialBusinessSettings.address}, {initialBusinessSettings.city}, {initialBusinessSettings.state} - {initialBusinessSettings.pin_code}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${initialBusinessSettings.contact_number.replace(/\s+/g, '')}`} className="hover:text-gold-300">
                  {initialBusinessSettings.contact_number}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 text-emerald-400 font-medium"
                >
                  WhatsApp: +{initialBusinessSettings.whatsapp_number}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{initialBusinessSettings.business_hours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-surface/60 gap-4">
          <p>© {new Date().getFullYear()} Sri Balaji. All rights reserved. Wholesale &amp; Bulk Snacks Business Platform.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-gold-400 transition-colors">About Us</Link>
            <span>•</span>
            <Link to="/wholesale" className="hover:text-gold-400 transition-colors">Wholesale Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-gold-400 transition-colors">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

