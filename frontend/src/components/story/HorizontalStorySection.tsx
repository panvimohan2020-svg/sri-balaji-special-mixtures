import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, ChevronRight, Compass } from 'lucide-react';
import {
  OrnateDiamondSVG,
  MixtureBowlSVG,
  MurrukuluSpiralSVG,
  PeanutsSVG,
  ChilliSVG,
  Heritage30YearsSVG,
  GoldBorderFlourish,
  CornerFlourishSVG,
} from './StoryOrnaments';

export const HorizontalStorySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);

    if (motionQuery.matches) {
      // In reduced motion, do not pin or animate with ScrollTrigger
      return;
    }

    // Explicit registration as required by prompt
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Use GSAP context for proper React lifecycle and cleanup
    const ctx = gsap.context(() => {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setScrollProgress(Math.round(self.progress * 100));
        },
      });

      // Recalculate once fonts are fully loaded
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }
    }, sectionRef);

    // Refresh on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert(); // Completely kill all triggers and remove pin memory
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story-section"
      aria-label="Sri Balaji 30 Years Storytelling Experience"
      className="relative w-full h-screen overflow-hidden bg-gradient-to-r from-jewel-plum via-jewel-sapphire to-jewel-plum text-jewel-goldLight select-none z-20 flex items-center"
      style={{
        backgroundColor: '#2A1132',
      }}
    >
      {/* Background Decorative Ambient Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.18),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-jewel-ruby/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-jewel-emerald/30 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Gold Ornamental Border Flourish */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <GoldBorderFlourish />
      </div>

      {/* Fixed HUD Header: Section Badge & Live Journey Counter */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jewel-plum/80 backdrop-blur-md border border-jewel-gold/40 shadow-glow">
          <Sparkles className="w-3.5 h-3.5 text-jewel-goldLight animate-spin [animation-duration:8s]" />
          <span className="font-cinzel font-bold text-xs tracking-[0.25em] text-jewel-goldLight uppercase">
            Our Story • Sri Balaji
          </span>
        </div>

        {/* Right Scroll Progress Indicator */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full bg-jewel-sapphire/80 backdrop-blur-md border border-jewel-gold/30 text-xs">
          <span className="font-marcellus text-[11px] uppercase tracking-wider text-jewel-goldLight/70">
            Journey
          </span>
          <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-jewel-goldLight via-jewel-gold to-jewel-goldDark transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <span className="font-cinzel font-bold text-jewel-gold text-xs min-w-[32px]">
            {scrollProgress}%
          </span>
        </div>
      </div>

      {/* Fixed HUD Bottom: Scroll To Explore Guidance */}
      <div className="absolute bottom-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 text-xs text-jewel-goldLight/70 font-marcellus tracking-widest uppercase">
          <span className="inline-block w-2 h-2 rounded-full bg-jewel-gold animate-ping" />
          <span>Scroll Vertically to Experience Journey</span>
          <ChevronRight className="w-4 h-4 text-jewel-gold animate-bounce" />
        </div>

        <span className="hidden md:inline-block text-[11px] font-marcellus tracking-wider text-jewel-goldLight/50">
          Handcrafted in Paralakhemundi, Odisha Since 1995
        </span>
      </div>

      {/* Bottom Gold Ornamental Border Flourish */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
        <GoldBorderFlourish flip={true} />
      </div>

      {/* Bottom Subtle Gold Progress Line across full viewport */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-30">
        <div
          className="h-full bg-gradient-to-r from-jewel-goldLight via-jewel-gold to-jewel-goldDark transition-all duration-100 shadow-glow"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 
        CONTINUOUS HORIZONTAL STORY TRACK
        Flex container moving horizontally as user scrolls vertically.
      */}
      <div
        ref={trackRef}
        id="story-track"
        className={`flex items-center whitespace-nowrap px-[5vw] gap-12 sm:gap-16 lg:gap-20 will-change-transform ${
          isReducedMotion ? 'overflow-x-auto max-w-full' : 'w-max'
        }`}
      >
        {/* ========================================================
            FRAGMENT 1: THE OPENING & 30 YEARS HERITAGE BOX
        ======================================================== */}
        <div className="flex items-center gap-8 shrink-0">
          <span className="font-marcellus text-2xl sm:text-3xl lg:text-4xl text-jewel-goldLight/80 tracking-wide">
            For over
          </span>

          {/* Luxury Ornate 30 Years Heritage Box */}
          <div className="relative px-8 py-5 sm:px-10 sm:py-6 rounded-2xl bg-gradient-to-br from-jewel-plum via-jewel-ruby/50 to-jewel-sapphire border-2 border-jewel-gold shadow-glow flex items-center gap-5">
            <CornerFlourishSVG position="tl" className="top-1.5 left-1.5" />
            <CornerFlourishSVG position="tr" className="top-1.5 right-1.5" />
            <CornerFlourishSVG position="bl" className="bottom-1.5 left-1.5" />
            <CornerFlourishSVG position="br" className="bottom-1.5 right-1.5" />

            <Heritage30YearsSVG className="w-16 h-16 sm:w-20 sm:h-20 animate-float" />

            <div className="flex flex-col">
              <span className="font-cinzel font-black text-4xl sm:text-6xl lg:text-7xl gold-gradient-text tracking-wider leading-none">
                30 YEARS
              </span>
              <span className="font-marcellus text-xs sm:text-sm text-jewel-gold tracking-[0.3em] uppercase mt-1">
                Of Uncompromised Legacy
              </span>
            </div>
          </div>

          <OrnateDiamondSVG className="w-10 h-10 sm:w-14 sm:h-14 animate-float" />
        </div>

        {/* ========================================================
            FRAGMENT 2: SRI BALAJI & AUTHENTIC TASTE
        ======================================================== */}
        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
          <div className="flex flex-col">
            <span className="font-cinzel font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-wide drop-shadow-md">
              SRI BALAJI
            </span>
            <span className="font-marcellus text-xs sm:text-sm text-jewel-goldLight/70 tracking-[0.25em] uppercase">
              Special Mixtures • Gandhi School Road
            </span>
          </div>

          <span className="font-marcellus text-2xl sm:text-3xl lg:text-4xl text-jewel-goldLight/80">
            has been bringing the
          </span>

          <span className="font-cinzel font-black text-3xl sm:text-5xl lg:text-6xl text-jewel-gold tracking-wider">
            AUTHENTIC
          </span>
        </div>

        {/* ========================================================
            FRAGMENT 3: TASTE OF TRADITION & PARALAKHEMUNDI
        ======================================================== */}
        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
          <span className="font-cinzel font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
            Taste of
          </span>

          {/* Script Font Highlight: Tradition in Great Vibes */}
          <span className="font-script text-6xl sm:text-8xl lg:text-9xl gold-gradient-text px-4 select-none drop-shadow-lg">
            Tradition
          </span>

          {/* Inline Traditional Mixture Bowl Illustration */}
          <div className="relative animate-float-delayed">
            <MixtureBowlSVG className="w-20 h-20 sm:w-28 sm:h-28" />
            <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-jewel-ruby border border-jewel-gold/50 text-[10px] font-cinzel text-jewel-goldLight font-bold uppercase tracking-wider">
              Secret Spice
            </span>
          </div>

          <span className="font-marcellus text-2xl sm:text-3xl lg:text-4xl text-jewel-goldLight/80">
            from
          </span>

          {/* Location Jewel Pill */}
          <div className="px-5 py-2.5 rounded-full bg-jewel-emerald/70 border border-jewel-gold/50 backdrop-blur-md shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-jewel-gold animate-ping" />
            <span className="font-cinzel font-bold text-lg sm:text-xl text-white tracking-wider">
              Paralakhemundi
            </span>
          </div>

          <span className="font-marcellus text-2xl sm:text-3xl lg:text-4xl text-jewel-goldLight/80">
            to your homes —
          </span>
        </div>

        {/* ========================================================
            FRAGMENT 4: SIGNATURE ONION & CHUDA MIXTURES
        ======================================================== */}
        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
          <span className="font-marcellus text-xl sm:text-2xl lg:text-3xl text-jewel-goldLight/70 italic">
            from our signature
          </span>

          {/* Onion Mixture Jewel Highlight */}
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-jewel-gold/60 backdrop-blur-sm flex items-center gap-4 hover:border-jewel-gold transition-colors">
            <div className="w-12 h-12 rounded-xl bg-jewel-plum p-1 border border-jewel-gold/40 flex items-center justify-center overflow-hidden">
              <img
                src="/images/products/onion-mixture.png"
                alt="Onion Mixture thumbnail"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
                Onion Mixture
              </span>
              <span className="font-marcellus text-[10px] text-jewel-gold uppercase tracking-widest">
                Roasted Crispy Onion &amp; Peanuts
              </span>
            </div>
          </div>

          <span className="font-marcellus text-2xl sm:text-3xl text-jewel-goldLight/80">
            and
          </span>

          {/* Chuda Mixture Jewel Highlight */}
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-jewel-gold/60 backdrop-blur-sm flex items-center gap-4 hover:border-jewel-gold transition-colors">
            <div className="w-12 h-12 rounded-xl bg-jewel-plum p-1 border border-jewel-gold/40 flex items-center justify-center overflow-hidden">
              <img
                src="/images/products/chuda-mixture.png"
                alt="Chuda Mixture thumbnail"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
                Chuda Mixture
              </span>
              <span className="font-marcellus text-[10px] text-jewel-gold uppercase tracking-widest">
                Light Beaten Rice &amp; Curry Leaves
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            FRAGMENT 5: MURRUKULU, RINGS & PEANUTS PAKODI
        ======================================================== */}
        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
          <span className="font-marcellus text-2xl sm:text-3xl lg:text-4xl text-jewel-goldLight/80">
            to crispy
          </span>

          {/* Murrukulu Highlight with Spiral SVG */}
          <div className="flex items-center gap-3">
            <MurrukuluSpiralSVG className="w-14 h-14 sm:w-16 sm:h-16 animate-float" />
            <span className="font-cinzel font-black text-3xl sm:text-5xl text-jewel-goldLight tracking-wider">
              Murrukulu,
            </span>
          </div>

          {/* Savoury Rings */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-jewel-gold flex items-center justify-center text-jewel-gold text-xs font-cinzel font-bold">
              ◎
            </div>
            <span className="font-cinzel font-bold text-2xl sm:text-4xl text-white tracking-wide">
              savoury Rings
            </span>
          </div>

          <span className="font-marcellus text-2xl sm:text-3xl text-jewel-goldLight/80">
            and delicious
          </span>

          {/* Peanuts Pakodi with Peanuts & Chilli SVG */}
          <div className="px-6 py-3 rounded-2xl bg-jewel-ruby/40 border border-jewel-gold/60 flex items-center gap-3">
            <PeanutsSVG className="w-12 h-12 animate-float-slow" />
            <ChilliSVG className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="font-cinzel font-black text-2xl sm:text-4xl gold-gradient-text tracking-wide">
                Peanuts Pakodi
              </span>
              <span className="font-marcellus text-[10px] text-jewel-goldLight/70 uppercase tracking-widest">
                Fiery Besan Batter Crunch
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            FRAGMENT 6: THE TRIPLE CELEBRATION (CLIMAX)
        ======================================================== */}
        <div className="flex items-center gap-8 sm:gap-10 shrink-0">
          <span className="font-marcellus text-2xl sm:text-4xl text-jewel-goldLight/80 italic">
            — every bite celebrates
          </span>

          {/* 1. FRESHNESS */}
          <div className="px-6 py-3 rounded-2xl bg-jewel-emerald/40 border border-jewel-emerald text-white flex items-center gap-3 shadow-glow">
            <span className="text-xl">🍃</span>
            <span className="font-cinzel font-black text-3xl sm:text-5xl text-white tracking-wider">
              FRESHNESS,
            </span>
          </div>

          {/* 2. CRUNCHINESS */}
          <div className="px-6 py-3 rounded-2xl bg-jewel-ruby/50 border border-jewel-gold text-white flex items-center gap-3 shadow-glow">
            <span className="text-xl">✨</span>
            <span className="font-cinzel font-black text-3xl sm:text-5xl gold-gradient-text tracking-wider">
              CRUNCHINESS
            </span>
          </div>

          <span className="font-marcellus text-2xl sm:text-3xl text-jewel-goldLight/80">
            and
          </span>

          {/* 3. TOGETHERNESS in Great Vibes Script */}
          <div className="relative px-6 py-2">
            <span className="font-script text-7xl sm:text-9xl lg:text-[11rem] gold-gradient-text drop-shadow-[0_10px_35px_rgba(212,175,55,0.4)] leading-none">
              Togetherness.
            </span>
          </div>
        </div>

        {/* ========================================================
            FRAGMENT 7: DESTINATION & CALL TO ACTION
        ======================================================== */}
        <div className="flex items-center gap-8 shrink-0 pr-[10vw]">
          <OrnateDiamondSVG className="w-14 h-14 sm:w-16 sm:h-16" />

          <div className="flex flex-col text-left space-y-1">
            <span className="font-cinzel font-bold text-xs uppercase tracking-[0.3em] text-jewel-gold">
              Adari Family Tradition
            </span>
            <span className="font-marcellus text-sm text-jewel-goldLight/80">
              30 Years of Pure Odia Craftsmanship
            </span>
          </div>

          {/* Direct CTA pill leading into snack catalogue */}
          <Link
            to="/catalog"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-jewel-gold via-jewel-goldLight to-jewel-gold text-jewel-plum font-cinzel font-black text-sm uppercase tracking-widest shadow-glow hover:scale-105 active:scale-95 transition-all"
          >
            <span>Explore The Savouries</span>
            <ArrowRight className="w-4 h-4 text-jewel-plum group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};
