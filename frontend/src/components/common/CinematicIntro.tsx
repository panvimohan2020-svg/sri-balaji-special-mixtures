import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

export const CinematicIntro: React.FC = () => {
  // Check sessionStorage on initial evaluation; also allow ?intro=true in URL to test anytime
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('intro') === 'true' || window.location.hash === '#intro') {
        sessionStorage.removeItem('sriBalajiIntroPlayed');
        return true;
      }
      return sessionStorage.getItem('sriBalajiIntroPlayed') !== 'true';
    } catch {
      return false;
    }
  });

  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  // Dismiss and reveal homepage smoothly
  const dismissIntro = useCallback(() => {
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

    // Smooth 600ms fade transition out
    setTimeout(() => {
      setIsVisible(false);
    }, 600);
  }, [isFadingOut]);

  // Support replaying intro via event or navbar
  useEffect(() => {
    const handleReplay = () => {
      try {
        sessionStorage.removeItem('sriBalajiIntroPlayed');
      } catch {}
      setIsFadingOut(false);
      setIsVisible(true);
    };

    window.addEventListener('sri-balaji-replay-intro', handleReplay);
    return () => window.removeEventListener('sri-balaji-replay-intro', handleReplay);
  }, []);

  const triggerUnmute = useCallback(() => {
    const video = mainVideoRef.current;
    if (video) {
      video.muted = false;
      video.volume = 1.0;
      video.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const video = mainVideoRef.current;
    if (!video) return;

    // Prevent document scrolling during cinematic intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 14-second safety timeout (video is ~10s)
    const safetyTimeout = setTimeout(() => {
      dismissIntro();
    }, 14000);

    video.playsInline = true;
    video.preload = 'auto';
    video.volume = 1.0;
    video.muted = false;

    // Attempt direct simultaneous unmuted playback
    const startPlayback = async () => {
      try {
        video.muted = false;
        video.volume = 1.0;
        await video.play();
      } catch {
        // Fallback if browser environment restricts unmuted autoplay prior to user interaction
        video.muted = true;
        await video.play().catch(() => {});

        // Unmute immediately on any screen interaction
        const events = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'scroll', 'click'];
        const onInteraction = () => {
          if (video) {
            video.muted = false;
            video.volume = 1.0;
            video.play().catch(() => {});
          }
          events.forEach((evt) => window.removeEventListener(evt, onInteraction));
        };

        events.forEach((evt) => {
          window.addEventListener(evt, onInteraction, { passive: true, once: true });
        });
      }
    };

    startPlayback();

    return () => {
      clearTimeout(safetyTimeout);
      document.body.style.overflow = originalOverflow;
    };
  }, [isVisible, dismissIntro]);

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sri Balaji Brand Introduction"
      onClick={triggerUnmute}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#070204] select-none transition-opacity duration-600 ease-out overflow-hidden cursor-pointer ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Luxury ambient glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-red-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* TOP-RIGHT: Clean Skip Intro Button (No Sound Buttons) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismissIntro();
          }}
          aria-label="Skip Intro and proceed to website"
          className="group flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-amber-400/30 hover:border-amber-400 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all transform hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px]"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* FULL-SCREEN RESPONSIVE VIDEO PLAYER (EDGES NEVER CUT) */}
      <div className="relative z-20 w-full h-full flex items-center justify-center overflow-hidden p-0 m-0">
        <video
          ref={mainVideoRef}
          src="/videos/sri-balaji-intro.mp4"
          poster="/videos/sri-balaji-intro-poster.jpg"
          playsInline
          autoPlay
          preload="auto"
          onEnded={() => dismissIntro()}
          onError={() => dismissIntro()}
          className="w-full h-full max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};
