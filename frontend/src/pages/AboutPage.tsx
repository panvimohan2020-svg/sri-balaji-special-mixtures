import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Award, 
  Clock, 
  Heart, 
  Flame, 
  CheckCircle2 
} from 'lucide-react';
import { initialBusinessSettings } from '../data/initialData';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      
      {/* Brand Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crimson-100 text-crimson-900 border border-crimson-300 text-xs font-bold">
          <Heart className="w-4 h-4 text-crimson-700" />
          <span>The Heritage of Authentic Crunch</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-crimson-900 tracking-tight">
          Crafting Pure &amp; Crispy Savouries for Sri Balaji
        </h1>
        <p className="text-sm sm:text-base text-spice-muted leading-relaxed">
          {initialBusinessSettings.business_description}
        </p>
      </div>

      {/* Story & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
            Our Business Journey
          </span>
          <h2 className="font-display font-extrabold text-3xl text-spice-dark">
            Rooted in Tradition, Perfected for Modern Scale
          </h2>
          <p className="text-sm text-spice-muted leading-relaxed">
            Sri Balaji was established with an uncompromising mission: to make wholesale snacks that taste like they were freshly fried in a traditional home kitchen, without cutting corners on oil quality or ingredient purity.
          </p>
          <p className="text-sm text-spice-muted leading-relaxed">
            Over {initialBusinessSettings.years_in_business} years of dedicated service in the wholesale savouries sector, we have built relationships with kirana stores, regional distributors, and families across South India.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cream-border text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-cream-surface border border-cream-border">
              <span className="font-display font-bold text-2xl text-crimson-900 block">
                {initialBusinessSettings.years_in_business}
              </span>
              <span className="text-spice-muted font-medium">Years of Experience</span>
            </div>

            <div className="p-4 rounded-xl bg-cream-surface border border-cream-border">
              <span className="font-display font-bold text-2xl text-crimson-900 block">
                100%
              </span>
              <span className="text-spice-muted font-medium">Refined Edible Oils</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden border-2 border-gold-300 shadow-elevated bg-cream-surface">
            <img
              src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
              alt="Sri Balaji Snack Preparation"
              className="w-full h-96 object-cover object-center"
            />
          </div>
        </div>

      </div>

      {/* Food Preparation & Hygiene Standards */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-cream-border shadow-soft space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
            Quality Control
          </span>
          <h2 className="font-display font-extrabold text-3xl text-spice-dark">
            Our Food Safety &amp; Hygiene Standards
          </h2>
          <p className="text-xs sm:text-sm text-spice-muted">
            We follow strict operational protocols to ensure every batch meets verifiable hygiene benchmarks.
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
              Hygiene &amp; Safety
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
              Moisture-Barrier Packaging
            </h3>
            <p className="text-xs text-spice-muted leading-relaxed">
              {initialBusinessSettings.packaging_method}
            </p>
          </div>

        </div>
      </section>

      {/* Brand Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-6 rounded-2xl bg-cream-surface border border-cream-border space-y-2">
          <h3 className="font-display font-bold text-lg text-crimson-900">Zero Compromise on Freshness</h3>
          <p className="text-xs text-spice-muted">No prolonged warehousing. Products leave the plant immediately upon cooling and seal packing.</p>
        </div>
        <div className="p-6 rounded-2xl bg-cream-surface border border-cream-border space-y-2">
          <h3 className="font-display font-bold text-lg text-crimson-900">Transparent Sourcing</h3>
          <p className="text-xs text-spice-muted">Selected farm potatoes, authentic raw bananas, and grade-A Bengal gram with zero adulterants.</p>
        </div>
        <div className="p-6 rounded-2xl bg-cream-surface border border-cream-border space-y-2">
          <h3 className="font-display font-bold text-lg text-crimson-900">Truth in Information</h3>
          <p className="text-xs text-spice-muted">We display verified certifications and ingredients only. No inflated claims or unverified awards.</p>
        </div>
      </div>

    </div>
  );
};

