import React from 'react';
import { 
  ShieldCheck, 
  Heart, 
  Flame, 
  Layers, 
  Users, 
  MapPin, 
  Phone, 
  Award,
  Sparkles
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { initialBusinessSettings } from '../data/initialData';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      
      {/* Brand Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crimson-100 text-crimson-900 border border-crimson-300 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-crimson-700" />
          <span>30 Years of Heritage ({initialBusinessSettings.years_in_business} Years)</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-crimson-900 tracking-tight">
          Taste the Tradition with Sri Balaji
        </h1>
        <p className="text-base sm:text-lg text-spice-dark font-medium leading-relaxed">
          "{initialBusinessSettings.business_description}"
        </p>
      </div>

      {/* Leadership: Father & Son */}
      <div className="bg-gradient-to-r from-cream-surface via-white to-cream-surface p-8 sm:p-10 rounded-3xl border border-cream-border shadow-soft">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold border border-gold-300">
            <Users className="w-4 h-4 text-gold-800" />
            <span>Family Leadership &amp; Heritage</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-spice-dark">
            Founded &amp; Managed by the Adari Family
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block">
                Founder &amp; Mentor
              </span>
              <h3 className="font-display font-bold text-xl text-crimson-900">
                Adari Krishna Rao
              </h3>
              <p className="text-xs text-spice-muted">
                Father • 30 years of authentic recipe mastery, traditional frying expertise, and spice consistency.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block">
                Operations &amp; Growth
              </span>
              <h3 className="font-display font-bold text-xl text-crimson-900">
                Adari Dilleshwar Rao
              </h3>
              <p className="text-xs text-spice-muted">
                Son • Wholesale trade distribution, hygienic modern packaging, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
            Rooted in Paralakhemundi, Odisha
          </span>
          <h2 className="font-display font-extrabold text-3xl text-spice-dark">
            Three Decades of Uncompromised Crunch &amp; Purity
          </h2>
          <p className="text-sm text-spice-muted leading-relaxed">
            Since its inception 30 years ago on Gandhi School Road in Paralakhemundi, <strong>Sri Balaji</strong> has earned a cherished reputation among retailers, tea stalls, grocery merchants, and families for its unmatched freshness and traditional taste.
          </p>
          <p className="text-sm text-spice-muted leading-relaxed">
            Our mixtures and chips are fried in fresh batches with top-grade refined cooking oils and hand-selected spices. We believe that great taste comes only when you respect traditional recipes and practice strict cleanliness.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cream-border text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-cream-surface border border-cream-border">
              <span className="font-display font-bold text-2xl text-crimson-900 block">
                30+ Years
              </span>
              <span className="text-spice-muted font-medium">Business Experience</span>
            </div>

            <div className="p-4 rounded-xl bg-cream-surface border border-cream-border">
              <span className="font-display font-bold text-2xl text-crimson-900 block">
                100% Purity
              </span>
              <span className="text-spice-muted font-medium">Refined Edible Oils</span>
            </div>
          </div>

          {initialBusinessSettings.instagram_url && (
            <div className="pt-2">
              <a
                href={initialBusinessSettings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition-opacity"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Follow @sri_balaji_special_mixtures on Instagram</span>
              </a>
            </div>
          )}
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden border-2 border-gold-300 shadow-elevated bg-cream-surface group">
            <img
              src="/images/brand/founders-adari-family.png"
              alt="Sri Balaji Founders: Adari Krishna Rao & Adari Dilleshwar Rao"
              className="w-full h-auto object-cover object-center group-hover:scale-102 transition-transform duration-500"
            />
            <div className="p-4 bg-white/95 border-t border-cream-border text-center">
              <p className="font-display font-bold text-sm text-crimson-900">
                Adari Krishna Rao &amp; Adari Dilleshwar Rao
              </p>
              <p className="text-xs text-spice-muted">
                Authentic Taste, Personally Guaranteed • Gandhi School Road, Paralakhemundi
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Real Visual Heritage & Brand Posters */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
            Authentic Brand Journey
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-spice-dark">
            From Our Kitchen to Every Wholesale Shelf
          </h2>
          <p className="text-xs sm:text-sm text-spice-muted">
            Original photographs capturing 30 years of trust, local Paralakhemundi heritage, and handcrafted snacks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl overflow-hidden border border-cream-border shadow-soft bg-white group">
            <div className="aspect-[4/3] overflow-hidden bg-cream-surface">
              <img
                src="/images/brand/paralakhemundi-pride.png"
                alt="Sri Balaji Paralakhemundi Heritage"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h4 className="font-display font-bold text-sm text-spice-dark">Proudly Made in Paralakhemundi</h4>
              <p className="text-xs text-spice-muted mt-1">Our historic roots on Gandhi School Road, Gajapati district, Odisha.</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-cream-border shadow-soft bg-white group">
            <div className="aspect-[4/3] overflow-hidden bg-cream-surface">
              <img
                src="/images/brand/seven-flavors-lineup.png"
                alt="Sri Balaji 7 Flavors Lineup"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h4 className="font-display font-bold text-sm text-spice-dark">Seven Signature Flavors</h4>
              <p className="text-xs text-spice-muted mt-1">Onion Mixture, Chuda Mixture, Mong Dal, Boondi, Murrukulu &amp; more.</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-cream-border shadow-soft bg-white group sm:col-span-2 lg:col-span-1">
            <div className="aspect-[4/3] overflow-hidden bg-cream-surface">
              <img
                src="/images/brand/wholesale-counter.png"
                alt="Sri Balaji Wholesale Counter"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h4 className="font-display font-bold text-sm text-spice-dark">Authentic Wholesale Storefront</h4>
              <p className="text-xs text-spice-muted mt-1">Supplying fresh transparent bulk packets to local shops &amp; retailers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Preparation & Hygiene Standards */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-cream-border shadow-soft space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
            Quality Assurance
          </span>
          <h2 className="font-display font-extrabold text-3xl text-spice-dark">
            Our Quality, Hygiene &amp; Packaging Standards
          </h2>
          <p className="text-xs sm:text-sm text-spice-muted">
            Delivering consistency across every package dispatched from our Paralakhemundi unit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-5 rounded-2xl bg-cream-warm border border-cream-border space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5 text-gold-700" />
            </div>
            <h3 className="font-display font-bold text-base text-spice-dark">
              Cooking Process
            </h3>
            <p className="text-xs text-spice-muted leading-relaxed">
              {initialBusinessSettings.food_prep_method}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cream-warm border border-cream-border space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-crimson-100 text-crimson-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-crimson-700" />
            </div>
            <h3 className="font-display font-bold text-base text-spice-dark">
              Hygiene &amp; Cleanliness
            </h3>
            <p className="text-xs text-spice-muted leading-relaxed">
              {initialBusinessSettings.hygiene_standards}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cream-warm border border-cream-border space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-display font-bold text-base text-spice-dark">
              Moisture-Barrier Pack
            </h3>
            <p className="text-xs text-spice-muted leading-relaxed">
              {initialBusinessSettings.packaging_method}
            </p>
          </div>

        </div>
      </section>

      {/* Address & Direct Connection */}
      <div className="p-8 rounded-3xl bg-cream-surface border-2 border-cream-border shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest block">
            Visit Our Manufacturing &amp; Wholesale Store
          </span>
          <h3 className="font-display font-bold text-2xl text-spice-dark">
            {initialBusinessSettings.address}, {initialBusinessSettings.city}
          </h3>
          <p className="text-xs text-spice-muted">
            Gajapati, Odisha, India - {initialBusinessSettings.pin_code} • Phone: +91 94371 35342 / +91 77353 33542
          </p>
        </div>

        <a
          href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to inquire about wholesale snacks.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md shrink-0 transition-transform hover:scale-105"
        >
          <WhatsAppIcon className="w-5 h-5 text-white" variant="white" />
          <span>Chat on WhatsApp (9861789602)</span>
        </a>
      </div>

    </div>
  );
};
