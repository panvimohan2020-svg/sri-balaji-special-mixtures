import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Maximize2, X } from 'lucide-react';

export const CommercialSpotlight: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure audio and video attributes are optimized for cross-browser iOS/Android/Desktop
    video.playsInline = true;
    video.preload = 'auto';
    video.volume = 1.0;

    let hasUnlockedAudio = false;

    const unlockAudio = () => {
      if (video) {
        video.muted = false;
        video.volume = 1.0;
        video.play().catch(() => {});
        hasUnlockedAudio = true;
      }
    };

    const activationEvents = ['click', 'pointerup', 'touchend', 'keydown'];
    activationEvents.forEach((evt) => {
      window.addEventListener(evt, unlockAudio, { passive: true });
    });

    // Attempt to start audio playback seamlessly
    const attemptUnmutedPlayback = () => {
      video.muted = false;
      video.volume = 1.0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasUnlockedAudio = true;
          })
          .catch(() => {
            // If browser blocks unmuted playback before interaction, play muted
            video.muted = true;
            video.play().catch(() => {});
          });
      }
    };

    // IntersectionObserver to auto-play video whenever user scrolls down into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            attemptUnmutedPlayback();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      activationEvents.forEach((evt) => {
        window.removeEventListener(evt, unlockAudio);
      });
    };
  }, []);

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.paused) {
      video.muted = false;
      video.volume = 1.0;
      video.play().catch(() => {});
    } else {
      if (video.muted) {
        video.muted = false;
        video.volume = 1.0;
      } else {
        video.pause();
      }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-br from-plum-950 via-emerald-950 to-plum-900 text-white rounded-3xl border border-gold/30 shadow-2xl mx-4 sm:mx-6 lg:mx-8"
    >
      {/* Background Decorative Gold Ambient Ornaments with Animations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-turmeric/15 rounded-full blur-3xl pointer-events-none animate-sun-glow" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-emerald-mist" />

      {/* Floating Sparkles in Commercial Showcase */}
      <div className="absolute top-10 left-12 text-turmeric-400 opacity-60 animate-star-twinkle text-lg pointer-events-none">✦</div>
      <div className="absolute bottom-12 right-20 text-amber-300 opacity-70 animate-star-twinkle [animation-delay:2.5s] text-base pointer-events-none">✦</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-turmeric/20 border border-turmeric/40 text-turmeric-200 text-xs sm:text-sm font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-turmeric-400" />
            <span>Taste the Tradition • Special Mixtures</span>
          </div>
          
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Taste the Tradition. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-turmeric-300 via-amber-200 to-turmeric-400">
              Small Bite, Big Happiness!
            </span>
          </h2>

          <p className="text-sm sm:text-base text-ivory/80 leading-relaxed max-w-2xl mx-auto">
            Experience the irresistible crunch that has brought smiles across Odisha for over 30 years. Handcrafted with authentic spices in Paralakhemundi.
          </p>
        </div>

        {/* Commercial Showcase Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Official Mascot & Story Card */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Mascot Visual Card */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500/20 to-emerald-900/40 p-4 sm:p-6 border border-turmeric/30 backdrop-blur-sm shadow-xl">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                
                {/* Leo Character & Bowl Visual */}
                <div className="relative shrink-0 w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-turmeric/50 shadow-lg bg-amber-400 group">
                  <img
                    src="/images/brand/sri-balaji-official-mascot.jpg"
                    alt="Sri Balaji Brand Character Leo – Small Bite Big Happiness"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-emerald-700/90 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Official Mascot
                  </div>
                </div>

                {/* Narrative Details */}
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-700/80 text-white text-[10px] font-bold tracking-wider uppercase">
                      Pure Veg
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/30 text-amber-200 text-[10px] font-bold tracking-wider uppercase border border-amber-400/30">
                      30+ Years Legacy
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                    Meet Leo &amp; The Special Mixture
                  </h3>

                  <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed">
                    Every bite is crafted with fresh split cashews, roasted peanuts, golden sev, aromatic curry leaves, and our secret 1995 spice blend.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start text-xs font-semibold text-turmeric-200">
                    <span className="inline-flex items-center gap-1">✦ Fresh Daily Batches</span>
                    <span className="inline-flex items-center gap-1">✦ Zero Adulteration</span>
                    <span className="inline-flex items-center gap-1">✦ Paralakhemundi, Odisha</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Feature Callouts */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-turmeric/40 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-turmeric-400" />
                  <strong className="text-xs sm:text-sm font-bold text-white">30+ Years Tradition</strong>
                </div>
                <p className="text-[11px] sm:text-xs text-ivory/70 leading-relaxed">
                  Founded in 1995 by Adari Krishna Rao &amp; Adari Dilleshwar Rao on Gandhi School Road.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-turmeric/40 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-turmeric-400" />
                  <strong className="text-xs sm:text-sm font-bold text-white">Retail &amp; Wholesale</strong>
                </div>
                <p className="text-[11px] sm:text-xs text-ivory/70 leading-relaxed">
                  Supplying households and Kirana stores across Odisha with unbeatable crunch.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-turmeric to-amber-500 hover:from-turmeric-400 hover:to-amber-400 text-plum-950 font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                <span>Taste the Crunch Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm tracking-wide transition-all"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Watch Fullscreen</span>
              </button>
            </div>

          </div>

          {/* Right Column: 16:9 Clean Cinematic Video Player */}
          <div className="lg:col-span-6 flex justify-center w-full">
            
            {/* Cinematic Theater Screen Frame */}
            <div className="relative w-full max-w-lg lg:max-w-xl aspect-video rounded-3xl p-2.5 sm:p-3 bg-gradient-to-b from-amber-400/40 via-plum-800 to-plum-950 shadow-2xl border-2 border-turmeric/50 group">
              
              {/* Clean Video Player Box (No overlay text, no Sound On button) */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black shadow-inner">
                <video
                  ref={videoRef}
                  src="/videos/sri-balaji-commercial.mp4"
                  playsInline
                  loop
                  preload="auto"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={handleVideoClick}
                />
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* FULLSCREEN / ENLARGED COMMERCIAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-turmeric/50">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video in Modal with native controls */}
            <video
              ref={modalVideoRef}
              src="/videos/sri-balaji-commercial.mp4"
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

    </section>
  );
};
