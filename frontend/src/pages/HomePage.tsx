import React, { useState, useEffect } from 'react';
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
import { RegionalDeliverySection } from '../components/home/RegionalDeliverySection';
import { ProductCard } from '../components/common/ProductCard';
import { ReviewsSection } from '../components/common/ReviewsSection';
import { InstagramShowcase } from '../components/common/InstagramShowcase';
import { apiService, MarketingCampaignItem } from '../services/api';
import { useTranslation } from '../store/useLanguageStore';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const featuredProducts = initialProducts.filter(p => p.is_featured);
  const heroProduct = initialProducts[0] || featuredProducts[0]; // Onion Mixture
  const kasthaGatiya = initialProducts.find(p => p.slug === 'kastha-gatiya');

  const [campaigns, setCampaigns] = useState<MarketingCampaignItem[]>([]);

  useEffect(() => {
    apiService.getActiveCampaigns().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCampaigns(data);
      }
    });
  }, []);

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
    <div className="space-y-0">
      
      {/* 1. ASYMMETRIC EDITORIAL HERO SECTION (DEEP IMPERIAL PURPLE + SAFFRON GOLD) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-imperial-dark via-imperial to-imperial-secondary text-white pt-10 pb-20 sm:pt-16 sm:pb-28 border-b-2 border-gold/30 shadow-royal">
        {/* Animated Background Solar Glow & Floating particles */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-gold/15 via-gold-rich/8 to-transparent rounded-full blur-3xl -z-10 pointer-events-none animate-sun-glow" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-gradient-to-tr from-emerald/15 via-gold/8 to-transparent rounded-full blur-3xl -z-10 pointer-events-none animate-emerald-mist" />

        {/* Decorative Floating Sparkle Stars */}
        <div className="absolute top-14 right-1/3 text-gold opacity-75 animate-star-twinkle text-lg pointer-events-none select-none">✦</div>
        <div className="absolute top-36 left-1/4 text-gold-light opacity-65 animate-star-twinkle [animation-delay:2s] text-base pointer-events-none select-none">✦</div>
        <div className="absolute bottom-20 left-1/3 text-gold-rich opacity-65 animate-star-twinkle [animation-delay:3.5s] text-sm pointer-events-none select-none">✦</div>
        <div className="absolute top-28 right-16 w-3 h-3 rounded-full bg-gradient-to-br from-gold-light to-gold shadow-sm opacity-60 animate-spice-slow pointer-events-none" />
        <div className="absolute bottom-32 right-1/4 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-gold to-gold-rich shadow-sm opacity-70 animate-spice-medium pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left / Primary Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Heritage Badge with Script Accent */}
              <div>
                <span className="font-script text-gold text-2xl sm:text-3xl block mb-2">Taste the Tradition</span>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-imperial-soft/70 border border-gold/40 text-gold-light text-xs sm:text-sm font-sans font-bold shadow-sm">
                  <Sparkles className="w-4 h-4 text-gold fill-gold" />
                  <span>{t('hero.badge', '30+ Years of Tradition • Paralakhemundi, Odisha')}</span>
                </div>
              </div>

              {/* Master Headline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
                {t('hero.title', 'Made with Tradition.')} <br />
                <span className="text-gold-gradient">{t('hero.titleAccent', 'Loved for the Crunch.')}</span>
              </h1>

              {/* Supporting Copy in Cormorant Garamond */}
              <p className="font-serif text-lg sm:text-xl text-ivory/85 max-w-2xl leading-relaxed italic">
                {t('hero.desc', 'Discover fresh, crispy, and authentic Indian savouries prepared with the taste of tradition. Handcrafted daily on Gandhi School Road by Adari Krishna Rao & Adari Dilleshwar Rao.')}
              </p>

              {/* Action Buttons: Primary Saffron Gold with Deep Purple text; Secondary Deep Purple with Gold borders */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="btn-royal-gold inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-xs sm:text-sm font-sans font-black uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
                >
                  <span>{t('hero.exploreBtn', 'Explore Our Snacks')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent('Namaste Sri Balaji! I would like to enquire about wholesale pricing and dealership.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-royal-purple inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl text-xs sm:text-sm font-sans font-bold active:scale-95 transition-all"
                >
                  <WhatsAppIcon className="w-5 h-5" variant="green" />
                  <span>{t('hero.wholesaleBtn', 'Wholesale Enquiry')}</span>
                </a>
              </div>

              {/* Small Trust Indicators */}
              <div className="pt-6 border-t border-gold/20 grid grid-cols-3 gap-4 text-xs font-semibold text-ivory/90">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-emerald bg-white flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald" />
                  </div>
                  <span>{t('hero.pureVeg', '100% Pure Veg')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                  <span>{t('hero.handcrafted', 'Handcrafted Daily')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold shrink-0" />
                  <span>{t('hero.legacy', '30+ Years Legacy')}</span>
                </div>
              </div>

            </div>

            {/* Right / Visual Layered Content */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Hero Photograph with Royal Framing */}
                <div className="relative rounded-3xl overflow-hidden shadow-royal border-4 border-gold/50 bg-gradient-to-br from-imperial via-imperial-secondary to-imperial-dark aspect-square flex items-center justify-center p-3 group">
                  <img
                    src="/images/brand/master-banner.png"
                    alt="Sri Balaji Special Mixtures – Authentic Traditional Presentation"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 filter drop-shadow-xl"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-imperial-dark/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Badge 1: 100% Authentic Crunch */}
                <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-6 bg-imperial-dark/95 backdrop-blur-md p-3 rounded-2xl shadow-royal border border-gold/40 flex items-center gap-3 animate-bounce [animation-duration:3s]">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center text-gold">
                    <Sparkles className="w-5 h-5 fill-gold" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-wider block">Special Recipe</span>
                    <strong className="text-xs font-extrabold text-white block">100% Authentic Crunch</strong>
                  </div>
                </div>

                {/* Floating Badge 2: Secret 1995 Spice Blend */}
                <div className="absolute -bottom-5 -right-4 sm:-bottom-6 sm:-right-6 bg-imperial-dark/95 backdrop-blur-md p-3.5 rounded-2xl shadow-royal border border-gold/40 flex items-center gap-3 text-white">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-rich flex items-center justify-center text-imperial font-black text-sm shadow-gold">
                    30+
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-wider block">Since 1995</span>
                    <strong className="text-xs font-extrabold text-ivory block">Secret Spice Heritage</strong>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Festival / Seasonal Marketing Promotion Banner */}
      {campaigns.length > 0 && (
        <section className="py-8 bg-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-imperial via-imperial-secondary to-[#190D2B] p-6 sm:p-8 border-2 border-gold/40 shadow-royal">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-sans font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{campaigns[0].badge_text}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                    {campaigns[0].title}
                  </h3>
                  <p className="font-serif text-sm sm:text-base text-ivory/85 italic leading-relaxed">
                    {campaigns[0].subtitle}
                  </p>
                </div>
                <div className="shrink-0">
                  <Link
                    to={campaigns[0].cta_link}
                    className="btn-royal-gold inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-sans font-black uppercase tracking-wider active:scale-95 text-center"
                  >
                    <span>{campaigns[0].cta_text}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* 2. SIGNATURE FEATURED HIGHLIGHT (WARM IVORY / CREAM SPOTLIGHT) */}
      <section className="py-16 sm:py-20 bg-cream/30 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <span className="font-script text-gold-deep text-2xl sm:text-3xl block mb-1">
              Bestseller Spotlight
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-imperial tracking-tight">
              Our #1 Signature Blend
            </h2>
            <div className="royal-divider max-w-xs mx-auto">
              <span className="royal-divider-diamond">✦</span>
            </div>
          </div>

          {heroProduct && (
            <ProductCard product={heroProduct} cardStyle="featured" />
          )}
        </div>
      </section>

      {/* 4. TASTE DISCOVERY SECTION (DEEP IMPERIAL PURPLE SECTION) */}
      <TasteDiscovery products={initialProducts} />

      {/* 5. REGIONAL ROAD TRANSPORT COVERAGE & LOGISTICS DISPATCH NETWORK */}
      <RegionalDeliverySection />

      {/* 6. POPULAR SAVOURIES (WARM IVORY SECTION) */}
      <section className="py-16 sm:py-24 bg-ivory border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-script text-gold-deep text-2xl sm:text-3xl block mb-1">
                Fresh Daily Batches
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-imperial tracking-tight">
                Customer Favourites
              </h2>
            </div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-gold-deep hover:text-gold transition-colors group"
            >
              <span>See All 10 Snack Varieties</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[kasthaGatiya, initialProducts[1], initialProducts[2], initialProducts[3]].filter(Boolean).map((p) => (
              <ProductCard key={p!.id} product={p!} cardStyle="standard" />
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHOLESALE B2B ADVANTAGE & KIRANA HUB (DEEP IMPERIAL PURPLE SECTION) */}
      <section className="py-20 bg-gradient-to-br from-imperial-dark via-imperial to-imperial-secondary text-white border-b-2 border-gold/30 shadow-royal relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="font-script text-gold text-2xl sm:text-3xl block">Kirana &amp; B2B Distribution Hub</span>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold text-imperial text-xs font-sans font-black uppercase tracking-wider shadow-gold">
                <Store className="w-3.5 h-3.5 fill-imperial" />
                Factory-Direct Wholesale
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
                Stock Your Store with High-Margin Snacks
              </h2>
              <p className="font-serif text-base sm:text-lg text-ivory/85 italic leading-relaxed max-w-xl">
                Partner with Sri Balaji for direct factory-gate wholesale rates. We serve tea stalls, supermarkets, sweet shops, and Kirana stores across Odisha with guaranteed crunch and high customer repeat purchases.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-4 rounded-2xl bg-white/5 border border-gold/30">
                  <strong className="text-gold block text-xl font-display font-bold">Up to 25%</strong>
                  <span className="text-ivory/70 font-sans">Margin Savings</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-gold/30">
                  <strong className="text-gold block text-xl font-display font-bold">Low MOQ</strong>
                  <span className="text-ivory/70 font-sans">From 2 Pkgs/Carton</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-gold/30">
                  <strong className="text-gold block text-xl font-display font-bold">90 Days</strong>
                  <span className="text-ivory/70 font-sans">Shelf Freshness</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  to="/wholesale"
                  className="btn-royal-gold px-6 py-3.5 rounded-2xl text-xs font-sans font-black uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
                >
                  Enter Wholesale Portal
                </Link>

                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=Hello%20Sri%20Balaji,%20I%20run%20a%20retail%20store%20and%20need%20your%20wholesale%20price%20list`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-royal-purple px-6 py-3.5 rounded-2xl text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4" variant="currentColor" />
                  <span>Request WhatsApp Price Sheet</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden border-4 border-gold/40 shadow-royal">
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

      {/* 7. AUTHENTIC 30-YEAR BRAND STORY & TIMELINE (DEEP EMERALD GREEN SECTION!) */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-[#05261C] via-[#0B4433] to-[#02140F] text-white border-b-2 border-gold/40 shadow-royal relative overflow-hidden">
        {/* Subtle decorative gold sparkles */}
        <div className="absolute top-10 left-10 text-gold/30 text-lg pointer-events-none">✦</div>
        <div className="absolute bottom-10 right-10 text-gold/30 text-lg pointer-events-none">✦</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
            <span className="font-script text-gold text-3xl sm:text-4xl block">
              Our Proud Roots Since 1995
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
              30 Years of Tradition. A Taste That Continues.
            </h2>
            <div className="royal-divider max-w-xs mx-auto">
              <span className="royal-divider-diamond">✦</span>
            </div>
            <p className="font-serif text-base sm:text-lg text-ivory/85 italic leading-relaxed">
              Founded on Gandhi School Road, Paralakhemundi, Odisha by Adari Krishna Rao and carried forward with passion by Adari Dilleshwar Rao.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Authentic Founders Photo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-royal border-4 border-gold/50 bg-ivory">
                <img
                  src="/images/brand/founders-adari-family.png"
                  alt="Adari Family – Founders of Sri Balaji"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="p-4 bg-gradient-to-r from-imperial via-imperial-dark to-imperial text-white text-center border-t-2 border-gold/40">
                  <strong className="block text-sm font-sans font-bold text-gold">Adari Krishna Rao &amp; Adari Dilleshwar Rao</strong>
                  <span className="text-xs font-serif text-ivory/80 italic">Proprietors &amp; Master Savoury Craftsmen</span>
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
                  className="p-5 rounded-2xl bg-emerald-900/60 border border-gold/30 shadow-xs hover:border-gold transition-all flex items-start gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center shrink-0">
                    <span className="font-display font-extrabold text-gold text-sm">{era.year}</span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-gold-light">{era.title}</h4>
                    <p className="font-serif text-xs sm:text-sm text-ivory/85 mt-1 leading-relaxed italic">{era.desc}</p>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-sans font-bold text-gold hover:text-gold-light transition-colors"
                >
                  <span>Read Full 30-Year Heritage &amp; Recipe Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMMUNITY CUSTOMER REVIEWS & RATINGS (WARM IVORY SECTION) */}
      <section className="bg-ivory border-b border-gold/20">
        <ReviewsSection
          productId="general"
          productName="Sri Balaji Savouries & Mixtures"
          title="Community Reviews & Tasting Feedback"
          subtitle="Read genuine thoughts from families and retail Kirana store owners who crunch Sri Balaji daily."
        />
      </section>

      {/* 9. INSTAGRAM & COMMUNITY SHOWCASE (DARK PURPLE SECTION) */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-imperial to-imperial-dark border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InstagramShowcase />
        </div>
      </section>

      {/* 10. INTERACTIVE FAQ ACCORDION (WARM IVORY SECTION) */}
      <section className="py-16 sm:py-24 bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="font-script text-gold-deep text-2xl sm:text-3xl block mb-1">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-imperial tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="royal-divider max-w-xs mx-auto">
              <span className="royal-divider-diamond">✦</span>
            </div>
            <p className="font-serif text-sm sm:text-base text-cocoa-muted italic">
              Everything you need to know about retail ordering, wholesale margins, and dispatch.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gold/30 bg-white overflow-hidden transition-all shadow-xs hover:border-gold"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-sans font-bold text-sm sm:text-base text-imperial flex items-center justify-between gap-4 hover:bg-cream/40 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gold-deep shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 font-serif text-xs sm:text-sm text-cocoa-muted leading-relaxed border-t border-gold/15 pt-3 italic">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
