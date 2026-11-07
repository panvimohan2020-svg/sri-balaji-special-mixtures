import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Volume2, VolumeX, Play } from 'lucide-react';

export const CinematicIntro: React.FC = () => {
  // Check sessionStorage on initial evaluation
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      return sessionStorage.getItem('sriBalajiIntroPlayed') !== 'true';
    } catch {
      return false;
    }
  });

  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);

  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  // Dismiss and reveal homepage smoothly
  const dismissIntro = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);

    try {
      sessionStorage.setItem('sriBalajiIntroPlayed', 'true');
    } catch (e) {
      console.warn('Storage write skipped:', e);
    }

    if (mainVideoRef.current) {
      mainVideoRef.current.pause();
    }
    if (bgVideoRef.current) {
      bgVideoRef.current.pause();
    }

    // Smooth 600ms fade transition out
    setTimeout(() => {
      setIsVisible(false);
    }, 600);
  };

  useEffect(() => {
    if (!isVisible) return;

    const video = mainVideoRef.current;
    if (!video) return;

    // Prevent document scrolling during cinematic intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 12-second safety timeout (video is ~10s) — guarantees visitor is never trapped
    const safetyTimeout = setTimeout(() => {
      dismissIntro();
    }, 12000);

    // Initial autoplay setup with sound on
    video.playsInline = true;
    video.preload = 'auto';
    video.volume = 1.0;
    video.muted = false;

    let isCleanedUp = false;
    const cleanupFns: (() => void)[] = [];

    const autoUnlockSound = () => {
      if (video && video.muted) {
        video.muted = false;
        video.volume = 1.0;
        if (!isCleanedUp) setIsMuted(false);
      }
      cleanupFns.forEach((fn) => fn());
      cleanupFns.length = 0;
    };

    // Listen on any mouse movement, touch, pointer, scroll, or key to auto-unmute immediately
    const interactionEvents = [
      'mousemove',
      'pointermove',
      'pointerdown',
      'mousedown',
      'touchstart',
      'wheel',
      'scroll',
      'keydown',
      'click',
    ];

    interactionEvents.forEach((evt) => {
      const handler = () => autoUnlockSound();
      window.addEventListener(evt, handler, { passive: true, once: true });
      cleanupFns.push(() => window.removeEventListener(evt, handler));
    });

    // Attempt unmuted autoplay directly
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (!isCleanedUp) {
            setIsMuted(false);
            setAutoplayBlocked(false);
            if (bgVideoRef.current) {
              bgVideoRef.current.play().catch(() => {});
            }
          }
        })
        .catch(() => {
          // Autoplay with sound prevented by browser policy prior to gesture
          // Fallback: Start muted immediately so video plays without black screen
          video.muted = true;
          if (!isCleanedUp) setIsMuted(true);

          video
            .play()
            .then(() => {
              if (!isCleanedUp) {
                setAutoplayBlocked(false);
                if (bgVideoRef.current) {
                  bgVideoRef.current.play().catch(() => {});
                }
              }
            })
            .catch(() => {
              // Both unmuted and muted autoplay blocked (strict mobile power-saving)
              if (!isCleanedUp) setAutoplayBlocked(true);
            });
        });
    }

    return () => {
      isCleanedUp = true;
      clearTimeout(safetyTimeout);
      cleanupFns.forEach((fn) => fn());
      document.body.style.overflow = originalOverflow;
    };
  }, [isVisible]);

  const handleVideoEnded = () => {
    dismissIntro();
  };

  const handleVideoError = () => {
    // Fail-safe: Immediately reveal homepage if video file fails to load
    dismissIntro();
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!mainVideoRef.current) return;
    const nextMuted = !isMuted;
    mainVideoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleManualPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!mainVideoRef.current) return;
    mainVideoRef.current.muted = false;
    mainVideoRef.current.volume = 1.0;
    mainVideoRef.current
      .play()
      .then(() => {
        setIsMuted(false);
        setAutoplayBlocked(false);
        if (bgVideoRef.current) {
          bgVideoRef.current.play().catch(() => {});
        }
      })
      .catch(() => {
        mainVideoRef.current?.play().catch(() => {});
        setAutoplayBlocked(false);
      });
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sri Balaji Brand Introduction"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0C0307] select-none transition-opacity duration-600 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. SOFTLY BLURRED AMBIENT VIDEO BACKDROP (SEAMLESSLY FILLS AMBIENT PERIPHERY) */}
      <video
        ref={bgVideoRef}
        src="/videos/sri-balaji-intro.mp4"
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-30 scale-110 pointer-events-none"
      />

      {/* Subtle Cinematic Vignette Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/70 pointer-events-none z-10" />

      {/* 2. TOP BAR CONTROLS */}
      {/* Sound On / Off Pill (Top Left) */}
      <div className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30">
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? 'Turn Sound On' : 'Mute Audio'}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 hover:border-amber-400 text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg transition-all transform active:scale-95 min-h-[44px] min-w-[44px]"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-amber-300" />
              <span className="text-amber-200">Tap for Sound</span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-bounce [animation-duration:0.6s]" />
                <span className="w-0.5 h-2 bg-amber-300 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                <span className="w-0.5 h-3.5 bg-amber-200 rounded-full animate-bounce [animation-duration:0.5s] [animation-delay:0.4s]" />
              </div>
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span className="text-white">Sound On</span>
            </>
          )}
        </button>
      </div>

      {/* Premium "Skip Intro →" Button (Top Right) */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30">
        <button
          type="button"
          onClick={dismissIntro}
          aria-label="Skip Intro and proceed to website"
          className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-amber-400/40 hover:border-amber-400 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all transform hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px]"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3. FOREGROUND MAIN VIDEO (FULL SCREEN, EDGES UNCUT) */}
      <div className="relative z-20 w-full h-full flex items-center justify-center overflow-hidden">
        <video
          ref={mainVideoRef}
          src="/videos/sri-balaji-intro.mp4"
          poster="/videos/sri-balaji-intro-poster.jpg"
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          onError={handleVideoError}
          onClick={toggleSound}
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Autoplay Blocked Manual Play Button */}
        {autoplayBlocked && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-xs">
            <button
              type="button"
              onClick={handleManualPlay}
              className="flex flex-col items-center gap-3 p-6 sm:p-8 rounded-3xl bg-black/80 border-2 border-amber-400 text-white shadow-2xl hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-plum-950 flex items-center justify-center shadow-glow">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
              </div>
              <div className="text-center">
                <span className="font-display font-extrabold text-base sm:text-lg text-white block">
                  Play Sri Balaji Intro
                </span>
                <span className="text-xs text-amber-300 font-semibold block mt-0.5">
                  Click to Start with Sound
                </span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
