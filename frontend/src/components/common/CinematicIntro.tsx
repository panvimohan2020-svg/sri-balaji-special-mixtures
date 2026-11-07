import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    if (!isVisible) return;

    const video = mainVideoRef.current;
    if (!video) return;

    // Prevent document scrolling during cinematic intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 14-second safety timeout — guarantees visitor is never trapped
    const safetyTimeout = setTimeout(() => {
      dismissIntro();
    }, 14000);

    // Optimize video audio parameters
    video.playsInline = true;
    video.preload = 'auto';
    video.volume = 1.0;
    video.muted = false;

    // Active unmuting function bound to real user activations
    const unlockAudio = () => {
      if (video) {
        video.muted = false;
        video.volume = 1.0;
        const p = video.play();
        if (p !== undefined) {
          p.then(() => {
            setIsMuted(false);
          }).catch(() => {});
        } else {
          setIsMuted(false);
        }
      }
    };

    // Valid W3C activation events that browsers permit to unlock audio
    const activationEvents = ['click', 'pointerup', 'touchend', 'keydown'];
    const handleUserActivation = () => {
      unlockAudio();
    };

    activationEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivation, { passive: true });
    });

    // Attempt direct unmuted playback first
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
          setAutoplayBlocked(false);
        })
        .catch(() => {
          // Autoplay with sound restricted by browser policy before user activation
          // Fallback: Start muted so video is never frozen, then activate sound on first gesture
          video.muted = true;
          setIsMuted(true);

          video
            .play()
            .then(() => {
              setAutoplayBlocked(false);
            })
            .catch(() => {
              // Complete autoplay blocked (e.g., iOS low-power mode)
              setAutoplayBlocked(true);
            });
        });
    }

    return () => {
      clearTimeout(safetyTimeout);
      activationEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivation);
      });
      document.body.style.overflow = originalOverflow;
    };
  }, [isVisible, dismissIntro]);

  const handleVideoEnded = () => {
    dismissIntro();
  };

  const handleVideoError = () => {
    dismissIntro();
  };

  // Click anywhere on screen to toggle sound / unlock audio
  const handleScreenClick = () => {
    if (!mainVideoRef.current) return;
    const video = mainVideoRef.current;
    if (video.muted) {
      video.muted = false;
      video.volume = 1.0;
      video.play().catch(() => {});
      setIsMuted(false);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!mainVideoRef.current) return;
    const video = mainVideoRef.current;
    if (video.muted) {
      video.muted = false;
      video.volume = 1.0;
      video.play().catch(() => {});
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleManualPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!mainVideoRef.current) return;
    const video = mainVideoRef.current;
    video.muted = false;
    video.volume = 1.0;
    video
      .play()
      .then(() => {
        setIsMuted(false);
        setAutoplayBlocked(false);
      })
      .catch(() => {
        video.muted = false;
        video.play().catch(() => {});
        setIsMuted(false);
        setAutoplayBlocked(false);
      });
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sri Balaji Brand Introduction"
      onClick={handleScreenClick}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#070204] select-none transition-opacity duration-600 ease-out cursor-pointer ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle luxury ambient glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-red-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* TOP CONTROLS */}
      {/* Sound Indicator / Toggle Pill (Top Left) */}
      <div className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-md border text-xs sm:text-sm font-bold tracking-wide shadow-2xl transition-all transform active:scale-95 min-h-[44px] min-w-[44px] ${
            isMuted
              ? 'bg-amber-500/90 hover:bg-amber-400 text-plum-950 border-amber-300 animate-pulse'
              : 'bg-black/70 hover:bg-black/90 text-white border-amber-400/40 hover:border-amber-400'
          }`}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-plum-950" />
              <span className="font-extrabold">Tap for Sound 🔊</span>
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
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismissIntro();
          }}
          aria-label="Skip Intro and proceed to website"
          className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/70 hover:bg-black/95 backdrop-blur-md border border-amber-400/40 hover:border-amber-400 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all transform hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px]"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* FOREGROUND MAIN VIDEO (100% FULL SCREEN, ZERO CUT EDGES) */}
      <div className="relative z-20 w-full h-full flex items-center justify-center overflow-hidden">
        <video
          ref={mainVideoRef}
          src="/videos/sri-balaji-intro.mp4"
          poster="/videos/sri-balaji-intro-poster.jpg"
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          onError={handleVideoError}
          className="w-full h-full object-contain"
        />

        {/* Autoplay Blocked Manual Play Button */}
        {autoplayBlocked && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-xs">
            <button
              type="button"
              onClick={handleManualPlay}
              className="flex flex-col items-center gap-3 p-6 sm:p-8 rounded-3xl bg-black/90 border-2 border-amber-400 text-white shadow-2xl hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-plum-950 flex items-center justify-center shadow-glow">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
              </div>
              <div className="text-center">
                <span className="font-display font-extrabold text-base sm:text-lg text-white block">
                  Play Sri Balaji Commercial
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
