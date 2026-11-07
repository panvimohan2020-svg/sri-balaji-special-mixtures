import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, VolumeX } from 'lucide-react';

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
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

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
      setHasInteracted(true);
    };

    window.addEventListener('sri-balaji-replay-intro', handleReplay);
    return () => window.removeEventListener('sri-balaji-replay-intro', handleReplay);
  }, []);

  const unmuteSound = useCallback(() => {
    const video = mainVideoRef.current;
    if (video) {
      video.muted = false;
      video.volume = 1.0;
      setIsMuted(false);
      setHasInteracted(true);
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

    // Check if user already activated this window/tab
    const userAlreadyActive = (navigator as any).userActivation?.hasBeenActive;
    if (userAlreadyActive || hasInteracted) {
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = false;
    }

    // Play safely without uncaught rejection
    const startPlayback = async () => {
      try {
        await video.play();
        if (video) {
          setIsMuted(video.muted);
        }
      } catch {
        // Autoplay policy prevented unmuted audio: start muted with zero lag/freeze
        if (video) {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        }
      }
    };

    startPlayback();

    // Universal interaction listener to immediately unmute
    const handleActivation = () => {
      unmuteSound();
    };

    const events = ['pointerdown', 'touchstart', 'click', 'keydown'];
    events.forEach((evt) => {
      window.addEventListener(evt, handleActivation, { passive: true });
    });

    return () => {
      clearTimeout(safetyTimeout);
      events.forEach((evt) => {
        window.removeEventListener(evt, handleActivation);
      });
      document.body.style.overflow = originalOverflow;
    };
  }, [isVisible, dismissIntro, unmuteSound, hasInteracted]);

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sri Balaji Brand Introduction"
      onClick={unmuteSound}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#070204] select-none transition-opacity duration-600 ease-out overflow-hidden cursor-pointer ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Luxury ambient glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-red-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* TOP-LEFT: Discreet pill shown ONLY if browser muted the audio — clicking unmutes */}
      {isMuted && (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 pointer-events-auto animate-pulse">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              unmuteSound();
            }}
            aria-label="Unmute intro audio"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/95 hover:bg-amber-400 text-plum-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all transform active:scale-95"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Tap for Sound 🔊</span>
          </button>
        </div>
      )}

      {/* TOP-RIGHT: Clean Skip Intro Button */}
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
          preload="auto"
          onEnded={() => dismissIntro()}
          onError={() => dismissIntro()}
          className="w-full h-full max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};
