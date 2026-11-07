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
  Sparkles,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { BrandLogo } from '../components/common/BrandLogo';
import { initialBusinessSettings } from '../data/initialData';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      
      {/* Brand Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-turmeric-100 text-cocoa-dark border border-turmeric-300 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-turmeric-600 fill-turmeric-500" />
          <span>30+ Years of Odia Culinary Heritage • Since 1995</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-plum-900 tracking-tight">
          30 Years of Tradition. <br />
          <span className="text-chilli">A Taste That Continues.</span>
        </h1>
        <p className="text-base sm:text-lg text-cocoa-muted leading-relaxed">
          &ldquo;{initialBusinessSettings.business_description}&rdquo;
        </p>
      </div>

      {/* Leadership Spotlight: Father & Son with Authentic Photography */}
      <div className="bg-gradient-to-br from-ivory-warm via-white to-peach-50 p-8 sm:p-12 rounded-3xl border border-ivory-border shadow-soft">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border-4 border-white shadow-plum bg-white">
              <img
                src="/images/brand/founders-adari-family.png"
                alt="Adari Family – Sri Balaji Founders"
                className="w-full h-auto object-cover"
              />
              <div className="p-4 bg-plum-900 text-white text-center">
                <strong className="block text-sm font-bold text-turmeric">Adari Krishna Rao &amp; Adari Dilleshwar Rao</strong>
                <span className="text-xs text-ivory/80">Proprietors, Sri Balaji Special Mixtures</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-peach-100 text-chilli-800 text-xs font-bold border border-peach-200">
              <Users className="w-4 h-4 text-chilli" />
              <span>Two Generations of Savoury Craftsmanship</span>
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-plum-900">
              Founded &amp; Personally Directed by the Adari Family
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-ivory-border shadow-xs space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-chilli block">
                  Founder &amp; Master Blender
                </span>
                <h3 className="font-display font-bold text-lg text-plum-900">
                  Adari Krishna Rao
                </h3>
                <p className="text-xs text-cocoa-muted leading-relaxed">
                  Father • Formulated the original 1995 secret spice blend. Oversees traditional oil temperature control, brass sieve frying, and batter texture.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-ivory-border shadow-xs space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-chilli block">
                  Managing Partner &amp; Operations
                </span>
                <h3 className="font-display font-bold text-lg text-plum-900">
                  Adari Dilleshwar Rao
                </h3>
                <p className="text-xs text-cocoa-muted leading-relaxed">
                  Son • Oversees regional B2B wholesale distribution, hygienic multi-barrier pouch packaging, and prompt Kirana store deliveries across Odisha.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-cocoa-muted leading-relaxed">
              Every single batch of Onion Mixture, Chuda Mixture, and Kar Kar Murrukulu is sampled daily by the Adari family before sealing and dispatching to customers.
            </p>
          </div>

        </div>
      </div>

      {/* Story & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-chilli">
            Rooted in Paralakhemundi, Odisha
          </span>
          <h2 className="font-display font-extrabold text-3xl text-plum-900">
            Three Decades of Uncompromised Crunch &amp; Purity
          </h2>
          <p className="text-sm text-cocoa-muted leading-relaxed">
            Since its inception 30 years ago on Gandhi School Road in Paralakhemundi, <strong>Sri Balaji</strong> has earned a cherished reputation among retailers, tea stalls, grocery merchants, and families for its unmatched freshness and traditional taste.
          </p>
          <p className="text-sm text-cocoa-muted leading-relaxed">
            Our mixtures and savouries are fried in fresh batches with top-grade refined cooking oils and hand-selected spices. We believe that great taste comes only when you respect traditional recipes and practice strict cleanliness.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ivory-border text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-ivory-warm border border-ivory-border">
              <span className="font-display font-black text-3xl text-plum-900 block">
                30+ Years
              </span>
              <span className="text-cocoa-muted font-medium">Business Experience</span>
            </div>

            <div className="p-4 rounded-2xl bg-ivory-warm border border-ivory-border">
              <span className="font-display font-black text-3xl text-chilli block">
                100%
              </span>
              <span className="text-cocoa-muted font-medium">Pure Vegetarian</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden shadow-plum border-4 border-white bg-white aspect-[4/3] flex items-center justify-center">
            <img
              src="/images/brand/paralakhemundi-pride.png"
              alt="Sri Balaji Storefront and Landmark in Paralakhemundi"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-xs font-bold">Gandhi School Road landmark storefront, Paralakhemundi</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4 Pillars of Sri Balaji Standard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            icon: ShieldCheck,
            title: 'Hygiene & Cleanliness',
            desc: 'Clean stainless steel facilities, food-grade storage, and strict cleanliness standards.',
            color: 'text-pista-700 bg-pista-50 border-pista-200'
          },
          {
            icon: Flame,
            title: 'Fresh Daily Frying',
            desc: 'Daily small-batch frying guarantees ultimate crispiness and maximum shelf-life.',
            color: 'text-chilli bg-peach-50 border-peach-200'
          },
          {
            icon: Layers,
            title: 'Heritage Spice Blends',
            desc: 'Traditional secret masala formulas unchanged for over 30 years.',
            color: 'text-turmeric-800 bg-turmeric-50 border-turmeric-200'
          },
          {
            icon: Heart,
            title: 'Customer Satisfaction',
            desc: 'Direct family accountability for every packet, with fast wholesale dispatch.',
            color: 'text-plum-900 bg-plum-50 border-plum-200'
          }
        ].map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-ivory-border shadow-xs hover:shadow-soft transition-all space-y-3"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${pillar.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-plum-900">
                {pillar.title}
              </h3>
              <p className="text-xs text-cocoa-muted leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Official Business Certificate Summary */}
      <div className="p-8 sm:p-10 rounded-3xl bg-plum-900 text-ivory border border-plum-800 shadow-plum">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-turmeric shrink-0" />
            <div>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                Official Business Credentials
              </h3>
              <p className="text-xs text-ivory/70">
                Registered enterprise operating under Odisha state commercial guidelines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-turmeric block font-bold mb-1">Business Name</span>
              <strong className="text-white text-sm">{initialBusinessSettings.business_name}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-turmeric block font-bold mb-1">Founders / Owners</span>
              <strong className="text-white text-sm">Adari Krishna Rao &amp; Son</strong>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-turmeric block font-bold mb-1">Headquarters &amp; Works</span>
              <strong className="text-white text-sm">{initialBusinessSettings.city}, {initialBusinessSettings.state}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-turmeric block font-bold mb-1">Postal Address</span>
              <span className="text-ivory/80">{initialBusinessSettings.address} – {initialBusinessSettings.pin_code}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-turmeric block font-bold mb-1">Direct Calling Desks</span>
              <span className="text-white font-mono font-bold">9437135342 / 7735333542</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-turmeric block font-bold mb-1">WhatsApp Wholesale</span>
              <span className="text-pista font-mono font-bold">9861789602</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
