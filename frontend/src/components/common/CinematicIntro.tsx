import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, Volume2, VolumeX, Play, Sparkles } from 'lucide-react';

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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [needsUserStart, setNeedsUserStart] = useState<boolean>(false);

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
      setIsPlaying(false);
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
      setNeedsUserStart(false);
    };

    window.addEventListener('sri-balaji-replay-intro', handleReplay);
    return () => window.removeEventListener('sri-balaji-replay-intro', handleReplay);
  }, []);

  // Synchronous simultaneous playback starter
  const startSimultaneousPlayback = useCallback(() => {
    const video = mainVideoRef.current;
    if (!video) return;

    // Reset to frame 0 and configure sound
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1.0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Success: Video AND voice are playing simultaneously from 0.00s!
          setIsPlaying(true);
          setIsMuted(false);
          setNeedsUserStart(false);
        })
        .catch(() => {
          // Browser policy strictly blocked unmuted autoplay prior to user gesture.
          // Pause at frame 0 and display prominent Start button so video and voice
          // are NEVER desynchronized by running ahead silently!
          video.pause();
          video.currentTime = 0;
          setIsPlaying(false);
          setIsMuted(false);
          setNeedsUserStart(true);
        });
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const video = mainVideoRef.current;
    if (!video) return;

    // Prevent document scrolling during cinematic intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 15-second safety timeout (video is ~10s)
    const safetyTimeout = setTimeout(() => {
      dismissIntro();
    }, 15000);

    video.playsInline = true;
    video.preload = 'auto';

    // Attempt direct unmuted simultaneous playback
    startSimultaneousPlayback();

    return () => {
      clearTimeout(safetyTimeout);
      document.body.style.overflow = originalOverflow;
    };
  }, [isVisible, dismissIntro, startSimultaneousPlayback]);

  // Trigger simultaneous video & voice on user click / touch / key
  const handleUserTriggerStart = (e?: React.MouseEvent | KeyboardEvent) => {
    if (e && 'stopPropagation' in e) {
      e.stopPropagation();
    }
    const video = mainVideoRef.current;
    if (!video) return;

    // Force video to start from 0:00 with sound enabled
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1.0;

    video
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsMuted(false);
        setNeedsUserStart(false);
      })
      .catch(() => {
        video.muted = false;
        video.play().catch(() => {});
        setIsPlaying(true);
        setIsMuted(false);
        setNeedsUserStart(false);
      });
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = mainVideoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      video.volume = 1.0;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sri Balaji Brand Introduction"
      onClick={() => {
        if (needsUserStart) {
          handleUserTriggerStart();
        }
      }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#070204] select-none transition-opacity duration-600 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${needsUserStart ? 'cursor-pointer' : ''}`}
    >
      {/* Luxury ambient glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-red-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* TOP CONTROLS */}
      {/* Sound Indicator / Toggle Button (Top Left) */}
      <div className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-md border text-xs sm:text-sm font-bold tracking-wide shadow-2xl transition-all transform active:scale-95 min-h-[44px] min-w-[44px] ${
            isMuted
              ? 'bg-amber-500/90 hover:bg-amber-400 text-plum-950 border-amber-300'
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
              <span className="text-white">Sound Playing 🔊</span>
            </>
          )}
        </button>
      </div>

      {/* Skip Intro Button (Top Right) */}
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

      {/* MAIN VIDEO PLAYER (FULL SCREEN, EDGES UNCUT) */}
      <div className="relative z-20 w-full h-full flex items-center justify-center overflow-hidden">
        <video
          ref={mainVideoRef}
          src="/videos/sri-balaji-intro.mp4"
          poster="/videos/sri-balaji-intro-poster.jpg"
          playsInline
          preload="auto"
          onEnded={() => dismissIntro()}
          onError={() => dismissIntro()}
          className="w-full h-full object-contain"
        />

        {/* PROMINENT START GATE: Ensures Video and Voice Start Simultaneously from 0.00s */}
        {needsUserStart && (
          <div
            onClick={(e) => handleUserTriggerStart(e)}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-xs cursor-pointer p-4 transition-all"
          >
            <div className="flex flex-col items-center gap-5 p-8 sm:p-10 rounded-3xl bg-black/85 border-2 border-amber-400/80 text-white shadow-2xl max-w-md text-center transform hover:scale-105 active:scale-95 transition-all">
              
              {/* Animated Glowing Play Orb */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-plum-950 flex items-center justify-center shadow-glow animate-pulse">
                <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-current translate-x-1" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sri Balaji Special Mixtures</span>
                </div>

                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  Taste the Tradition
                </h2>

                <p className="text-sm sm:text-base text-amber-200 font-extrabold flex items-center justify-center gap-2 pt-1">
                  <Volume2 className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>Click Anywhere to Play with Voice 🔊</span>
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
