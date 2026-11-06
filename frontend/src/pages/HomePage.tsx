import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Flame, 
  CheckCircle, 
  Layers, 
  MapPin, 
  Phone,
  Store,
  ChevronRight
} from 'lucide-react';
import { initialCategories, initialProducts, initialBundles, initialBusinessSettings } from '../data/initialData';
import { TasteDiscovery } from '../components/home/TasteDiscovery';
import { ProductCard } from '../components/common/ProductCard';

export const HomePage: React.FC = () => {
  const featuredProducts = initialProducts.filter(p => p.is_featured);

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-warm via-cream to-white pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-cream-border">
        {/* Decorative subtle background radial lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-100/60 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crimson-100/80 border border-crimson-300 text-crimson-900 text-xs sm:text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-crimson-700" />
                <span>Premier Wholesale Snacks Manufacturer</span>
              </div>

              {/* Catchy Headline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-spice-dark tracking-tight leading-[1.15]">
                Freshly Fried. <br />
                <span className="text-crimson-800">Unmatched Crispness.</span> <br />
                Wholesale Value.
              </h1>

              {/* Short Brand Introduction */}
              <p className="text-base sm:text-lg text-spice-muted max-w-2xl leading-relaxed">
                Welcome to <strong>Sri Balaji</strong>. We prepare authentic South Indian mixtures, golden potato &amp; banana wafers, and traditional savouries in fresh batches using pure edible oils and time-tested recipes.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm font-bold text-sm sm:text-base shadow-elevated hover:shadow-glow transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to place a wholesale snack order.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-soft hover:shadow-md transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* Trust Pillars */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-cream-border text-xs sm:text-sm text-spice">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gold-100 flex items-center justify-center text-gold-700">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-spice-dark">100% Quality Oil</span>
                    <span className="text-[11px] text-spice-muted">No re-used oils</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-crimson-100 flex items-center justify-center text-crimson-700">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-spice-dark">Wholesale Tiers</span>
                    <span className="text-[11px] text-spice-muted">Kirana &amp; B2B rates</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-spice-dark">Fresh Batch</span>
                    <span className="text-[11px] text-spice-muted">Daily dispatches</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Decorative border frame */}
                <div className="absolute -inset-2 bg-gradient-to-r from-gold-400 to-crimson-700 rounded-3xl blur-md opacity-30 transform -rotate-1" />

                <div className="relative rounded-2xl overflow-hidden shadow-elevated border-2 border-gold-300 bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
                    alt="Authentic Sri Balaji Mixture"
                    className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-cream-border shadow-elevated flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-crimson-800">
                        Signature Preparation
                      </span>
                      <h4 className="font-display font-bold text-spice-dark text-sm sm:text-base">
                        Special Madras Royal Mixture
                      </h4>
                      <p className="text-xs text-spice-muted">
                        Cashews, Peanuts, Crispy Sev &amp; Curry Leaves
                      </p>
                    </div>

                    <Link 
                      to="/product/special-madras-royal-mixture"
                      className="p-2.5 rounded-xl bg-crimson-800 text-cream-warm hover:bg-crimson-900 transition-colors shadow-sm"
                      title="View Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
              Handcrafted Varieties
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-spice-dark mt-1">
              Explore Our Snack Categories
            </h2>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-crimson-800 hover:text-crimson-900 font-bold text-sm"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {initialCategories.map((category) => (
            <Link
              key={category.id}
              to={`/catalog?category=${category.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-cream-border shadow-soft hover:shadow-elevated transition-all flex flex-col"
            >
              <div className="aspect-square bg-cream-surface overflow-hidden">
                <img
                  src={category.image_url}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-3 sm:p-4 text-center bg-white flex flex-col justify-between flex-grow">
                <h3 className="font-display font-bold text-sm sm:text-base text-spice-dark group-hover:text-crimson-800 transition-colors">
                  {category.name}
                </h3>
                <span className="mt-1 text-[11px] text-brand-700 font-semibold group-hover:underline">
                  Browse Snacks →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
              Customer Favorites
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-spice-dark mt-1">
              Popular &amp; High-Demand Snacks
            </h2>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-crimson-800 hover:text-crimson-900 font-bold text-sm"
          >
            <span>Full Price List</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* INTERACTIVE SNACK DISCOVERY */}
      <TasteDiscovery products={initialProducts} />

      {/* SMART SNACK BUNDLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
            Convenient Combinations
          </span>
          <h2 className="font-display font-extrabold text-3xl text-spice-dark">
            Smart Snack Bundles &amp; Combos
          </h2>
          <p className="text-sm text-spice-muted">
            Specially configured packs for retail store starter stock, festive gifting, and evening family tea-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialBundles.map((bundle) => (
            <div 
              key={bundle.id}
              className="bg-white rounded-2xl border border-cream-border overflow-hidden shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div className="aspect-[16/10] bg-cream-surface overflow-hidden relative">
                <img
                  src={bundle.image_url}
                  alt={bundle.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-crimson-800 text-cream-warm text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                  Combo Pack
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-spice-dark">
                    {bundle.name}
                  </h3>
                  <p className="mt-1 text-xs text-spice-muted leading-relaxed">
                    {bundle.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-cream-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-spice-muted uppercase font-bold block">
                      Bundle Price
                    </span>
                    <span className="font-display font-extrabold text-xl text-crimson-900">
                      ₹{bundle.bundle_price}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent(`Namaste Sri Balaji! I would like to order the bundle: ${bundle.name} (Price: ₹${bundle.bundle_price})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm text-xs font-bold transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-gold-300" />
                    <span>Inquire Combo</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE SRI BALAJI */}
      <section className="bg-cream-surface py-16 border-y border-cream-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
              The Sri Balaji Standard
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-crimson-900">
              Why Retailers &amp; Families Choose Us
            </h2>
            <p className="text-sm text-spice-muted">
              We combine traditional South Indian recipe authenticity with standardized wholesale quality control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
                ✨
              </div>
              <h3 className="font-display font-bold text-lg text-spice-dark">
                Always Fresh &amp; Crispy
              </h3>
              <p className="text-xs text-spice-muted leading-relaxed">
                We manufacture in rolling daily cycles so our snacks reach retail counters and consumers at peak crispness without stale inventory lag.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                🛡️
              </div>
              <h3 className="font-display font-bold text-lg text-spice-dark">
                Pure Edible Oils
              </h3>
              <p className="text-xs text-spice-muted leading-relaxed">
                Strict adherence to fresh groundnut and sunflower cooking mediums with temperature monitors. Zero adulteration and zero burnt oil reuse.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-crimson-800 flex items-center justify-center font-bold text-xl">
                🏪
              </div>
              <h3 className="font-display font-bold text-lg text-spice-dark">
                Wholesale Margin Value
              </h3>
              <p className="text-xs text-spice-muted leading-relaxed">
                Direct factory wholesale rates providing healthy profit margins for Kirana shops, supermarkets, canteen caterers, and distribution agents.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-cream-border shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xl">
                📦
              </div>
              <h3 className="font-display font-bold text-lg text-spice-dark">
                Durable Food-Grade Pack
              </h3>
              <p className="text-xs text-spice-muted leading-relaxed">
                High-barrier nitrogen-flushed pouches and heavy corrugated outer cartons ensuring minimal breakage during road and rail logistics.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FACTORY LOCATION & DIRECT CONNECT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-3xl bg-gradient-to-r from-crimson-900 to-crimson-800 text-cream-warm p-8 sm:p-12 shadow-elevated border-2 border-gold-400/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold border border-gold-400/30">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>Factory &amp; Wholesale Office</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                Visit Us or Order Your Bulk Consignment
              </h2>
              <p className="text-sm sm:text-base text-cream-surface/90 max-w-2xl leading-relaxed">
                Located at {initialBusinessSettings.address}, {initialBusinessSettings.city}. Open Monday to Saturday. Connect directly with our dispatch desk for custom weight requirements, bulk supply tenders, and samples.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
                <a
                  href={`tel:${initialBusinessSettings.contact_number.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-crimson-900 font-bold hover:bg-gold-100 transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4 text-crimson-800" />
                  <span>Call {initialBusinessSettings.contact_number}</span>
                </a>

                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to visit the manufacturing unit or request a wholesale sample.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-xs space-y-3">
              <h4 className="font-display font-bold text-gold-300 text-base">
                Operating Hours &amp; Logistics
              </h4>
              <p className="text-cream-surface/80">
                <strong>Timings:</strong> {initialBusinessSettings.business_hours}
              </p>
              <p className="text-cream-surface/80">
                <strong>Dispatch Locations:</strong> {initialBusinessSettings.wholesale_locations}
              </p>
              <p className="text-cream-surface/80">
                <strong>Payment Methods:</strong> {initialBusinessSettings.payment_methods}
              </p>
              <div className="pt-2 border-t border-white/10 text-gold-200">
                ⭐ Genuine verified wholesale manufacturer.
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

