import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowRight, 
  Maximize2, 
  X, 
  RotateCcw,
  Film
} from 'lucide-react';

export const CommercialSpotlight: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hasEnded, setHasEnded] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      setHasEnded(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setHasEnded(false);
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-br from-plum-950 via-emerald-950 to-plum-900 text-white rounded-3xl border border-gold/30 shadow-2xl mx-4 sm:mx-6 lg:mx-8">
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
            <Film className="w-4 h-4 text-turmeric-400" />
            <span>Sri Balaji 3D CGI Commercial • 15 Seconds of Joy</span>
          </div>
          
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Taste the Tradition. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-turmeric-300 via-amber-200 to-turmeric-400">
              Small Bite, Big Happiness!
            </span>
          </h2>

          <p className="text-sm sm:text-base text-ivory/80 leading-relaxed max-w-2xl mx-auto">
            Experience the irresistible crunch that has brought smiles across Odisha for over 30 years. Watch our animated spot featuring Leo and our authentic Special Mixtures.
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
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm tracking-wide transition-all"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Watch Fullscreen</span>
              </button>
            </div>

          </div>

          {/* Right Column: 9:16 Cinematic Video Player Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            
            {/* Mobile / Smartphone Device Mockup Container */}
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] rounded-[36px] p-3 bg-gradient-to-b from-amber-400/40 via-plum-800 to-plum-950 shadow-2xl border-4 border-turmeric/40">
              
              {/* Screen Notch / Speaker Bar */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-4 bg-plum-950/80 rounded-full z-20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              </div>

              {/* Video Player Box */}
              <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-black shadow-inner">
                <video
                  ref={videoRef}
                  src="/videos/sri-balaji-commercial.mp4"
                  playsInline
                  autoPlay
                  loop={false}
                  muted={isMuted}
                  onEnded={handleVideoEnded}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={togglePlay}
                />

                {/* Floating Top Controls */}
                <div className="absolute top-8 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto">
                  <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-turmeric-300">
                    Sri Balaji 15s Spot
                  </div>

                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all transform active:scale-95"
                  >
                    {isMuted ? (
                      <div className="flex items-center gap-1 text-[10px] font-bold px-1 text-turmeric-300">
                        <VolumeX className="w-3.5 h-3.5 text-white" />
                        <span>Tap Sound</span>
                      </div>
                    ) : (
                      <Volume2 className="w-4 h-4 text-turmeric-400" />
                    )}
                  </button>
                </div>

                {/* Center Play / Pause / Replay Overlay */}
                {(!isPlaying || hasEnded) && (
                  <div 
                    onClick={hasEnded ? handleReplay : togglePlay}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer z-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-turmeric text-plum-950 flex items-center justify-center shadow-xl transform hover:scale-110 active:scale-95 transition-all">
                      {hasEnded ? (
                        <RotateCcw className="w-7 h-7" />
                      ) : (
                        <Play className="w-7 h-7 fill-plum-950 translate-x-0.5" />
                      )}
                    </div>
                    <span className="mt-3 text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">
                      {hasEnded ? 'Watch Again' : 'Play Video'}
                    </span>
                  </div>
                )}

                {/* Bottom Floating Bar */}
                <div className="absolute bottom-3 left-3 right-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 rounded-2xl flex items-center justify-between z-10 pointer-events-auto">
                  <div>
                    <span className="text-[10px] font-extrabold text-turmeric uppercase tracking-wider block">
                      Taste The Tradition
                    </span>
                    <strong className="text-xs font-bold text-white block">
                      Special Mixtures 30+ Yrs
                    </strong>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* FULLSCREEN / ENLARGED COMMERCIAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-turmeric/40">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video in Modal */}
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

