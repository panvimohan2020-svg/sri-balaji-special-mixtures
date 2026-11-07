import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Store, 
  MapPin, 
  Phone,
  ChevronRight,
  Heart,
  HelpCircle,
  ChevronDown,
  Layers,
  Award,
  Users,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { initialCategories, initialProducts, initialBundles, initialBusinessSettings } from '../data/initialData';
import { TasteDiscovery } from '../components/home/TasteDiscovery';
import { ProductCard } from '../components/common/ProductCard';

export const HomePage: React.FC = () => {
  const featuredProducts = initialProducts.filter(p => p.is_featured);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I place a wholesale order for my retail Kirana store?",
      a: "Simply switch to 'Wholesale Mode' using the toggle in the top menu or on the Wholesale page. Browse products, add your required volume (meeting the Minimum Order Quantity per item), and click 'Request Wholesale Quote'. This automatically formats an itemized inquiry and sends it directly to our wholesale desk on WhatsApp (+91 98617 89602)."
    },
    {
      q: "What is the Minimum Order Quantity (MOQ) for wholesale prices?",
      a: "Our standard retail packets (250g and 500g) carry a low MOQ of just 2 to 5 packages per variety to enable easy sampling. Bulk sacks (3kg, 5kg, and 10kg cartons) have an MOQ of 1 unit. We also offer pre-configured starter combo bundles for retail shops."
    },
    {
      q: "Where do you deliver or dispatch wholesale consignments?",
      a: "We are headquartered on Gandhi School Road in Paralakhemundi, Gajapati, Odisha. We fulfill direct counter orders locally and dispatch wholesale consignments via established regional road transport networks across Gajapati, Rayagada, Ganjam, and neighbouring trade corridors."
    },
    {
      q: "What packaging is used and how long do the snacks stay crisp?",
      a: "Our retail items are sealed in multi-layer food-grade moisture-barrier pouches that keep mixtures and savouries fresh and crispy for up to 90 days. For bulk commercial sales, we provide heavy-gauge sealed poly-bags packed in corrugated master transit cartons to prevent breakage."
    },
    {
      q: "Can household customers buy single packets for personal consumption?",
      a: "Yes! Sri Balaji caters to both households and businesses. Keep the website in 'Retail Mode' to browse standard packet prices (₹60 for 250g, ₹120 for 500g) and place orders directly with us."
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-warm via-cream to-white pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-cream-border">
        {/* Decorative subtle background radial lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-100/60 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crimson-100/90 border border-crimson-300 text-crimson-900 text-xs sm:text-sm font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-crimson-700" />
                <span>30 Years of Tradition • Paralakhemundi, Odisha</span>
              </div>

              {/* Catchy Headline featuring official Tagline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-spice-dark tracking-tight leading-[1.12]">
                Taste the Tradition. <br />
                <span className="text-crimson-800">Fresh &amp; Crispy Savouries.</span> <br />
                Wholesale Value.
              </h1>

              {/* Short Brand Introduction */}
              <p className="text-base sm:text-lg text-spice-muted max-w-2xl leading-relaxed">
                {initialBusinessSettings.business_description} Serving grocery stores, kirana shops, and families across Odisha for 30 proud years.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm font-bold text-sm sm:text-base shadow-elevated hover:shadow-glow transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore Snacks Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to place a wholesale snack order.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm sm:text-base shadow-soft hover:shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white" variant="white" />
                  <span>WhatsApp Quote (9861789602)</span>
                </a>
              </div>

              {/* Trust Pillars */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-cream-border text-xs sm:text-sm text-spice">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gold-100 flex items-center justify-center text-gold-700 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-spice-dark">30 Years Trust</span>
                    <span className="text-[11px] text-spice-muted">Authentic Recipe</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-crimson-100 flex items-center justify-center text-crimson-700 shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-spice-dark">Kirana Margins</span>
                    <span className="text-[11px] text-spice-muted">Direct Factory Rates</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-spice-dark">Daily Frying</span>
                    <span className="text-[11px] text-spice-muted">Fresh Batch Supply</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Decorative border frame */}
                <div className="absolute -inset-2 bg-gradient-to-r from-gold-400 to-crimson-700 rounded-3xl blur-md opacity-30 transform -rotate-1" />

                <div className="relative rounded-3xl overflow-hidden shadow-elevated border-2 border-gold-300 bg-white">
                  <img
                    src="/images/brand/master-banner.png"
                    alt="Authentic Sri Balaji Special Mixtures Collection with Founders Guarantee"
                    className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-cream-border shadow-elevated flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-crimson-800">
                        Signature 30-Year Tradition
                      </span>
                      <h4 className="font-display font-bold text-spice-dark text-sm sm:text-base">
                        Sri Balaji Special Mixtures
                      </h4>
                      <p className="text-xs text-spice-muted">
                        Onion Mixture, Kar Kar Murrukulu &amp; Peanuts Pakodi
                      </p>
                    </div>

                    <Link 
                      to="/product/onion-mixture"
                      className="p-2.5 rounded-xl bg-crimson-800 text-cream-warm hover:bg-crimson-900 transition-colors shadow-sm"
                      title="View Details"
                      aria-label="View Onion Mixture details"
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

      {/* 2. PRODUCT CATEGORIES SHOWCASE */}
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
            className="inline-flex items-center gap-1.5 text-crimson-800 hover:text-crimson-900 font-bold text-sm group"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {initialCategories.map((category) => (
            <Link
              key={category.id}
              to={`/catalog?category=${category.slug}`}
              className="group relative rounded-3xl overflow-hidden bg-white border border-cream-border shadow-soft hover:shadow-elevated hover:border-gold-300 transition-all flex flex-col"
            >
              <div className="aspect-square bg-cream-surface overflow-hidden">
                <img
                  src={category.image_url}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-3.5 sm:p-4 text-center bg-white flex flex-col justify-between flex-grow">
                <h3 className="font-display font-bold text-sm sm:text-base text-spice-dark group-hover:text-crimson-800 transition-colors">
                  {category.name}
                </h3>
                <span className="mt-1 text-[11px] text-brand-700 font-bold group-hover:underline">
                  Browse Snacks →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. POPULAR BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
              Customer Favorites
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-spice-dark mt-1">
              Popular &amp; High-Demand Savouries
            </h2>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-crimson-800 hover:text-crimson-900 font-bold text-sm group"
          >
            <span>Complete Price List</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE TASTE DISCOVERY (PROFILER) */}
      <TasteDiscovery products={initialProducts} />

      {/* 5. RETAIL VS WHOLESALE CLARIFICATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
            Flexible Purchasing Modes
          </span>
          <h2 className="font-display font-extrabold text-3xl text-spice-dark">
            Tailored for Households &amp; Wholesale Kiranas
          </h2>
          <p className="text-sm text-spice-muted">
            Switch effortlessly between Retail and Wholesale pricing with one click.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Retail Household Box */}
          <div className="p-8 rounded-3xl bg-white border-2 border-cream-border shadow-soft space-y-5 hover:border-gold-300 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-crimson-100 text-crimson-800 flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-spice-dark">
                Household &amp; Family Retail
              </h3>
              <p className="text-xs sm:text-sm text-spice-muted leading-relaxed">
                Enjoy authentic traditional snack varieties delivered fresh for family tea times, evening snacks, and festive celebrations.
              </p>
              
              <ul className="space-y-2.5 text-xs sm:text-sm text-spice">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Standard 250g (₹60) &amp; 500g (₹120) sealed pouches</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No minimum order constraints; order as little as 1 pack</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Assorted gift combos and smart snack boxes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct delivery / local counter pickup in Paralakhemundi</span>
                </li>
              </ul>
            </div>

            <Link
              to="/catalog"
              className="w-full py-3.5 px-4 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm text-center font-bold text-xs sm:text-sm transition-colors shadow-soft"
            >
              Shop Retail Snacks
            </Link>
          </div>

          {/* Wholesale B2B Box */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-cream-surface to-white border-2 border-gold-400 shadow-soft space-y-5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-3 -right-3 bg-gold-500 text-spice-dark font-extrabold text-[10px] px-8 py-2 rounded-full uppercase tracking-wider rotate-12 shadow-xs">
              Kirana Margin
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-crimson-900">
                B2B Wholesale &amp; Kirana Stores
              </h3>
              <p className="text-xs sm:text-sm text-spice-muted leading-relaxed">
                Direct factory supply for grocery stores, supermarkets, tea stalls, and caterers seeking reliable repeat customer margins.
              </p>
              
              <ul className="space-y-2.5 text-xs sm:text-sm text-spice">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Direct wholesale discounts (up to 20%–25% retailer margin)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Low MOQ thresholds (2 to 5 packs per snack)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Commercial bulk sacks (3kg, 5kg, and 10kg cartons)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Automated WhatsApp quotation routing straight to founders</span>
                </li>
              </ul>
            </div>

            <Link
              to="/wholesale"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-center font-bold text-xs sm:text-sm transition-colors shadow-soft"
            >
              Explore Wholesale Rate Card
            </Link>
          </div>
        </div>
      </section>

      {/* 6. BRAND HERITAGE TIMELINE (1995 to 2026+) */}
      <section className="bg-gradient-to-b from-cream-warm via-white to-cream-warm py-16 border-y border-cream-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
              30 Years of Uncompromised Taste
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-crimson-900">
              The Sri Balaji Heritage Journey
            </h2>
            <p className="text-sm text-spice-muted">
              From a single frying kettle in Paralakhemundi to a trusted regional wholesale network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* 1995 Card */}
            <div className="p-6 rounded-3xl bg-white border border-cream-border shadow-soft space-y-3 relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-100 text-crimson-900 text-xs font-extrabold">
                <Calendar className="w-3.5 h-3.5 text-crimson-700" />
                <span>1995 – The Beginning</span>
              </div>
              <h3 className="font-display font-bold text-xl text-spice-dark">
                Authentic Recipe Mastery
              </h3>
              <p className="text-xs sm:text-sm text-spice-muted leading-relaxed">
                Founded by <strong>Adari Krishna Rao</strong> on Gandhi School Road, Paralakhemundi. Focused on pure gram flour, roasted peanuts, and traditional spices with strict cleanliness.
              </p>
            </div>

            {/* 2010s Card */}
            <div className="p-6 rounded-3xl bg-white border border-cream-border shadow-soft space-y-3 relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-extrabold">
                <Calendar className="w-3.5 h-3.5 text-gold-800" />
                <span>2010s – Wholesale Expansion</span>
              </div>
              <h3 className="font-display font-bold text-xl text-spice-dark">
                Regional Trade Networks
              </h3>
              <p className="text-xs sm:text-sm text-spice-muted leading-relaxed">
                Son <strong>Adari Dilleshwar Rao</strong> joined operations, partnering with Kirana merchants and tea stalls across Gajapati district to deliver consistent, fresh wholesale batches daily.
              </p>
            </div>

            {/* Present Card */}
            <div className="p-6 rounded-3xl bg-white border border-cream-border shadow-soft space-y-3 relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
                <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                <span>Present – Modern Pouching</span>
              </div>
              <h3 className="font-display font-bold text-xl text-spice-dark">
                Moisture-Barrier &amp; PWA Platform
              </h3>
              <p className="text-xs sm:text-sm text-spice-muted leading-relaxed">
                Upgraded to multi-layer moisture-barrier pouches, QR code traceability, and an installable digital ordering platform connected directly to WhatsApp.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 7. SMART SNACK BUNDLES */}
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
              className="bg-white rounded-3xl border border-cream-border overflow-hidden shadow-soft hover:shadow-elevated hover:border-gold-300 transition-all flex flex-col justify-between"
            >
              <div className="aspect-[16/10] bg-cream-surface overflow-hidden relative">
                <img
                  src={bundle.image_url}
                  alt={bundle.name}
                  loading="lazy"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-crimson-800 text-cream-warm text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                  Combo Box
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm text-xs font-bold transition-all shadow-xs"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-white" variant="white" />
                    <span>Inquire Combo</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. AUTHENTIC INSTAGRAM & BRAND GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
              Official Instagram &amp; Visual Diary
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-spice-dark mt-1">
              Snapshots of Our Authentic Kitchen &amp; Store
            </h2>
          </div>

          {initialBusinessSettings.instagram_url && (
            <a
              href={initialBusinessSettings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-800 via-pink-700 to-amber-600 text-white font-bold text-xs shadow-sm hover:opacity-95 transition-opacity"
            >
              <InstagramIcon className="w-4 h-4" useGradient={false} />
              <span>Follow @sri_balaji_special_mixtures</span>
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl overflow-hidden bg-cream-surface border border-cream-border aspect-square group shadow-soft">
            <img
              src="/images/brand/founders-adari-family.png"
              alt="Adari Krishna Rao & Dilleshwar Rao"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="rounded-2xl overflow-hidden bg-cream-surface border border-cream-border aspect-square group shadow-soft">
            <img
              src="/images/brand/wholesale-counter.png"
              alt="Sri Balaji Wholesale Counter with Transparent Bulk Packets"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="rounded-2xl overflow-hidden bg-cream-surface border border-cream-border aspect-square group shadow-soft">
            <img
              src="/images/brand/paralakhemundi-pride.png"
              alt="Proudly Made in Paralakhemundi, Odisha"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="rounded-2xl overflow-hidden bg-cream-surface border border-cream-border aspect-square group shadow-soft">
            <img
              src="/images/brand/seven-flavors-lineup.png"
              alt="Seven Flavors Signature Lineup"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
            Got Questions?
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-spice-dark">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-spice-muted">
            Everything you need to know about placing orders, wholesale dispatches, and snack shelf life.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-cream-border shadow-soft overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-sm sm:text-base text-spice-dark">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-crimson-800 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-spice-muted leading-relaxed border-t border-cream-surface pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FACTORY LOCATION & DIRECT CONNECT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-3xl bg-gradient-to-r from-crimson-900 to-crimson-800 text-cream-warm p-8 sm:p-12 shadow-elevated border-2 border-gold-400/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold border border-gold-400/30">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>Paralakhemundi, Gajapati, Odisha</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                Visit Our Manufacturing Store or Place a Bulk Order
              </h2>
              <p className="text-sm sm:text-base text-cream-surface/90 max-w-2xl leading-relaxed">
                Located at {initialBusinessSettings.address}, {initialBusinessSettings.city}, Gajapati, Odisha - {initialBusinessSettings.pin_code}. Managed directly by Adari Krishna Rao &amp; Adari Dilleshwar Rao.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
                <a
                  href="tel:9437135342"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-crimson-900 font-bold hover:bg-gold-100 transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4 text-crimson-800" />
                  <span>Call: 9437135342</span>
                </a>

                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to place an order for snacks.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold transition-colors shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" variant="white" />
                  <span>WhatsApp: 9861789602</span>
                </a>

                {initialBusinessSettings.instagram_url && (
                  <a
                    href={initialBusinessSettings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4" useGradient={false} />
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-xs space-y-3">
              <h4 className="font-display font-bold text-gold-300 text-base">
                Business &amp; Supply Details
              </h4>
              <p className="text-cream-surface/80">
                <strong>Owners:</strong> Adari Krishna Rao &amp; Adari Dilleshwar Rao
              </p>
              <p className="text-cream-surface/80">
                <strong>Experience:</strong> 30 Years (Since 1995)
              </p>
              <p className="text-cream-surface/80">
                <strong>Address:</strong> {initialBusinessSettings.address}, {initialBusinessSettings.city}, Odisha - {initialBusinessSettings.pin_code}
              </p>
              <p className="text-cream-surface/80">
                <strong>Payment Methods:</strong> {initialBusinessSettings.payment_methods}
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
