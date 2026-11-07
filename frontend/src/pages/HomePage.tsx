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
  ChevronDown,
  Layers,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  Flame,
  Star
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { BrandLogo } from '../components/common/BrandLogo';
import { initialCategories, initialProducts, initialBundles, initialBusinessSettings } from '../data/initialData';
import { TasteDiscovery } from '../components/home/TasteDiscovery';
import { ProductCard } from '../components/common/ProductCard';
import { ReviewsSection } from '../components/common/ReviewsSection';

export const HomePage: React.FC = () => {
  const featuredProducts = initialProducts.filter(p => p.is_featured);
  const heroProduct = initialProducts[0] || featuredProducts[0]; // Onion Mixture

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
      
      {/* 1. ASYMMETRIC EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory-light via-ivory-warm to-white pt-6 pb-16 sm:pt-12 sm:pb-24 border-b border-ivory-border">
        {/* Subtle decorative radial glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-turmeric/15 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-peach/25 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left / Primary Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Heritage Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-turmeric-100 border border-turmeric-300 text-cocoa-dark text-xs sm:text-sm font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-turmeric-600 fill-turmeric-500" />
                <span>30+ Years of Tradition • Paralakhemundi, Odisha</span>
              </div>

              {/* Master Headline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-plum-900 tracking-tight leading-[1.12]">
                Made with Tradition. <br />
                <span className="text-chilli">Loved for the Crunch.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-cocoa-muted max-w-2xl leading-relaxed">
                Discover fresh, crispy, and authentic Indian savouries prepared with the taste of tradition. Handcrafted daily on Gandhi School Road by Adari Krishna Rao &amp; Adari Dilleshwar Rao.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-chilli hover:bg-chilli-600 text-white font-bold text-sm sm:text-base shadow-chilli active:scale-95 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore Our Snacks</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to enquire about wholesale pricing and dealership.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-white hover:bg-pista-50 text-plum-900 border-2 border-pista-300 font-bold text-sm sm:text-base shadow-soft transition-all"
                >
                  <WhatsAppIcon className="w-5 h-5" variant="green" />
                  <span>Wholesale Enquiry</span>
                </a>
              </div>

              {/* Small Trust Indicators */}
              <div className="pt-6 border-t border-ivory-border grid grid-cols-3 gap-4 text-xs font-semibold text-cocoa">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-veg bg-white flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-veg" />
                  </div>
                  <span>100% Pure Veg</span>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-turmeric-600 shrink-0" />
                  <span>Handcrafted Daily</span>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-chilli shrink-0" />
                  <span>30+ Years Legacy</span>
                </div>
              </div>

            </div>

            {/* Right / Visual Layered Content */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Hero Photograph with Framing */}
                <div className="relative rounded-3xl overflow-hidden shadow-plum border-4 border-white bg-gradient-to-br from-ivory-warm to-peach-50 aspect-square flex items-center justify-center p-3 group">
                  <img
                    src="/images/brand/master-banner.png"
                    alt="Sri Balaji Special Mixtures – Authentic Traditional Presentation"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-950/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Badge 1: 100% Authentic Crunch */}
                <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-elevated border border-ivory-border flex items-center gap-3 animate-bounce [animation-duration:3s]">
                  <div className="w-10 h-10 rounded-xl bg-turmeric-100 flex items-center justify-center text-turmeric-700">
                    <Sparkles className="w-5 h-5 fill-turmeric-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-chilli uppercase tracking-wider block">Special Recipe</span>
                    <strong className="text-xs font-extrabold text-plum-900 block">100% Authentic Crunch</strong>
                  </div>
                </div>

                {/* Floating Badge 2: Secret 1995 Spice Blend */}
                <div className="absolute -bottom-5 -right-4 sm:-bottom-6 sm:-right-6 bg-plum-900/95 backdrop-blur-md p-3.5 rounded-2xl shadow-plum border border-plum-700 flex items-center gap-3 text-white">
                  <div className="w-10 h-10 rounded-xl bg-turmeric flex items-center justify-center text-plum-950 font-black text-sm">
                    30+
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-turmeric uppercase tracking-wider block">Since 1995</span>
                    <strong className="text-xs font-extrabold text-ivory block">Secret Spice Heritage</strong>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 2. CREATIVE CATEGORY TILES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-chilli uppercase tracking-wider block mb-1">
              Curated Snack Categories
            </span>
            <h2 className="text-3xl font-display font-extrabold text-plum-900 tracking-tight">
              Explore Our Authentic Range
            </h2>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-chilli hover:text-chilli-700 transition-colors group"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              name: 'Special Mixtures',
              desc: 'Onion, Chuda & Gujarat Mix',
              slug: 'special-mixtures',
              image: '/images/products/onion-mixture.png',
              accent: 'bg-peach-50 border-peach-200 text-chilli',
            },
            {
              name: 'Traditional Murrukulu',
              desc: 'Kar Kar & Crispy Rings',
              slug: 'traditional-murrukulu',
              image: '/images/products/kar-kar-murrukulu.png',
              accent: 'bg-turmeric-50 border-turmeric-200 text-turmeric-800',
            },
            {
              name: 'Spicy Crunchies',
              desc: 'Crispy Peanuts Pakodi',
              slug: 'crunchy-pakodi',
              image: '/images/products/crispy-peanuts-pakodi.png',
              accent: 'bg-pista-50 border-pista-200 text-pista-800',
            },
            {
              name: 'Gujarat Chivda',
              desc: 'Sweet & Salty Namkeen',
              slug: 'chivda-special',
              image: '/images/products/gujarat-mix-chivda.png',
              accent: 'bg-ivory-warm border-ivory-border text-plum-900',
            },
            {
              name: 'Special Treats',
              desc: 'Kaju Biscuits Mixture',
              slug: 'kaju-delights',
              image: '/images/products/kaju-biscuits-mixture.png',
              accent: 'bg-peach-100 border-peach-300 text-chilli-800',
            },
          ].map((cat) => (
            <Link
              key={cat.slug}
              to={`/catalog?category=${cat.slug}`}
              className={`p-4 rounded-3xl border ${cat.accent} flex flex-col justify-between hover:shadow-elevated transition-all duration-300 group hover:-translate-y-1`}
            >
              <div className="aspect-square rounded-2xl bg-white p-2 mb-3 overflow-hidden flex items-center justify-center border border-ivory-border">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-plum-900 group-hover:text-chilli transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-cocoa-muted block mt-0.5 line-clamp-1">
                  {cat.desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* 3. SIGNATURE FEATURED HIGHLIGHT (STYLE A: FEATURED PRODUCT CARD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-bold text-chilli uppercase tracking-wider block mb-1">
            Bestseller Spotlight
          </span>
          <h2 className="text-3xl font-display font-extrabold text-plum-900 tracking-tight">
            Our #1 Signature Blend
          </h2>
        </div>

        {heroProduct && (
          <ProductCard product={heroProduct} cardStyle="featured" />
        )}
      </section>


      {/* 4. TASTE DISCOVERY SECTION */}
      <TasteDiscovery products={initialProducts} />


      {/* 5. POPULAR SAVOURIES (STANDARD PRODUCT CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-chilli uppercase tracking-wider block mb-1">
              Fresh Daily Batches
            </span>
            <h2 className="text-3xl font-display font-extrabold text-plum-900 tracking-tight">
              Customer Favourites
            </h2>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-chilli hover:text-chilli-700 transition-colors group"
          >
            <span>See All 9 Snack Varieties</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialProducts.slice(1, 5).map((p) => (
            <ProductCard key={p.id} product={p} cardStyle="standard" />
          ))}
        </div>
      </section>


      {/* 6. WHOLESALE B2B ADVANTAGE & COMPARISON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-plum-950 via-plum-900 to-cocoa-dark text-white p-8 sm:p-12 overflow-hidden shadow-plum relative border border-plum-800">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-turmeric/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-turmeric text-plum-950 text-xs font-black uppercase tracking-wider">
                <Store className="w-3.5 h-3.5 fill-plum-950" />
                Kirana &amp; B2B Distribution Hub
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                Stock Your Store with High-Margin Snacks
              </h2>
              <p className="text-sm text-ivory/80 leading-relaxed max-w-xl">
                Partner with Sri Balaji for direct factory-gate wholesale rates. We serve tea stalls, supermarkets, sweet shops, and Kirana stores across Odisha with guaranteed crunch and high customer repeat purchases.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <strong className="text-turmeric block text-lg font-display">Up to 25%</strong>
                  <span className="text-ivory/70">Margin Savings</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <strong className="text-turmeric block text-lg font-display">Low MOQ</strong>
                  <span className="text-ivory/70">From 2 Pkgs/Carton</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <strong className="text-turmeric block text-lg font-display">90 Days</strong>
                  <span className="text-ivory/70">Shelf Freshness</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  to="/wholesale"
                  className="px-6 py-3 rounded-2xl bg-turmeric text-plum-950 font-extrabold text-xs uppercase tracking-wider hover:bg-turmeric-400 active:scale-95 transition-all shadow-glow"
                >
                  Enter Wholesale Portal
                </Link>

                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20I%20run%20a%20retail%20store%20and%20need%20your%20wholesale%20price%20list`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4" variant="currentColor" />
                  <span>Request WhatsApp Price Sheet</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-white/10 shadow-elevated">
                <img
                  src="/images/brand/wholesale-counter.png"
                  alt="Sri Balaji Wholesale Counter"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 7. AUTHENTIC 30-YEAR BRAND STORY & TIMELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold text-chilli uppercase tracking-wider">
            Our Proud Roots Since 1995
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-plum-900 tracking-tight">
            30 Years of Tradition. A Taste That Continues.
          </h2>
          <p className="text-sm text-cocoa-muted">
            Founded on Gandhi School Road, Paralakhemundi, Odisha by Adari Krishna Rao and carried forward by Adari Dilleshwar Rao.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Authentic Founders Photo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-soft border-4 border-white bg-ivory-warm">
              <img
                src="/images/brand/founders-adari-family.png"
                alt="Adari Family – Founders of Sri Balaji"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="p-4 bg-plum-900 text-white text-center">
                <strong className="block text-sm font-bold text-turmeric">Adari Krishna Rao &amp; Adari Dilleshwar Rao</strong>
                <span className="text-xs text-ivory/80">Proprietors &amp; Master Savoury Craftsmen</span>
              </div>
            </div>
          </div>

          {/* 3-Era Heritage Milestones */}
          <div className="lg:col-span-7 space-y-4">
            {[
              {
                year: '1995',
                title: 'The Humble Kitchen in Paralakhemundi',
                desc: 'Adari Krishna Rao began crafting authentic mixtures using cold-pressed groundnut oil, freshly roasted curry leaves, and traditional brass sieves near Gandhi School Road post office.'
              },
              {
                year: '2008',
                title: 'B2B Wholesale Trust Across Gajapati',
                desc: 'Local tea vendors and retail grocery shops adopted Sri Balaji as their primary mixture brand due to unmatched crunch retention and consistent taste quality.'
              },
              {
                year: 'Present Day',
                title: 'Modern Packaging & Digital Reach',
                desc: 'Adari Dilleshwar Rao modernised production with food-grade moisture barrier packaging, expanding distribution across Odisha while strictly preserving the authentic 30-year family recipe.'
              }
            ].map((era) => (
              <div
                key={era.year}
                className="p-5 rounded-2xl bg-white border border-ivory-border shadow-xs hover:border-turmeric-400 transition-all flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-peach-50 border border-peach-200 flex items-center justify-center shrink-0">
                  <span className="font-display font-extrabold text-chilli text-sm">{era.year}</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-plum-900">{era.title}</h4>
                  <p className="text-xs text-cocoa-muted mt-1 leading-relaxed">{era.desc}</p>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-chilli hover:text-chilli-700 transition-colors"
              >
                <span>Read Full 30-Year Heritage &amp; Recipe Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* 8. NEW: COMMUNITY CUSTOMER REVIEWS & RATINGS */}
      <ReviewsSection
        productId="general"
        productName="Sri Balaji Savouries & Mixtures"
        title="Community Reviews & Tasting Feedback"
        subtitle="Read genuine thoughts from families and retail Kirana store owners who crunch Sri Balaji daily."
      />


      {/* 9. INSTAGRAM & COUNTER GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-chilli uppercase tracking-wider block mb-1">
              Social Community
            </span>
            <h2 className="text-3xl font-display font-extrabold text-plum-900 tracking-tight">
              Follow Us on Instagram
            </h2>
            <p className="text-xs text-cocoa-muted mt-0.5">
              Tag @sri_balaji_special_mixtures in your snack moments
            </p>
          </div>

          <a
            href={initialBusinessSettings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-800 via-pink-700 to-amber-600 text-white text-xs font-bold hover:opacity-95 transition-all shadow-soft w-fit"
          >
            <InstagramIcon className="w-4 h-4" useGradient={false} />
            <span>@sri_balaji_special_mixtures</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { img: '/images/brand/paralakhemundi-pride.png', caption: 'Storefront at Gandhi School Road' },
            { img: '/images/products/onion-mixture.png', caption: 'Fresh Golden Onion Mixture' },
            { img: '/images/brand/seven-flavors-lineup.png', caption: 'Seven Signature Flavors' },
            { img: '/images/products/kar-kar-murrukulu.png', caption: 'Crunchy Kar Kar Murrukulu' },
          ].map((item, idx) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-square border border-ivory-border bg-white shadow-soft">
              <img
                src={item.img}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-white text-xs font-semibold">{item.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* 10. INTERACTIVE FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-chilli uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-3xl font-display font-extrabold text-plum-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-cocoa-muted">
            Everything you need to know about retail ordering, wholesale margins, and dispatch.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-ivory-border bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-plum-900 flex items-center justify-between gap-4 hover:bg-ivory-warm transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-chilli shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-cocoa-muted leading-relaxed border-t border-ivory-border/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
