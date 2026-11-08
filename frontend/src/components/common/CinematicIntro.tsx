import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, Volume2, VolumeX, Play } from 'lucide-react';

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
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

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
    if (bgVideoRef.current) {
      bgVideoRef.current.pause();
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
      setIsAutoplayBlocked(false);
      setIsVisible(true);
    };

    window.addEventListener('sri-balaji-replay-intro', handleReplay);
    return () => window.removeEventListener('sri-balaji-replay-intro', handleReplay);
  }, []);

  // Toggle sound or unmute
  const toggleSound = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = mainVideoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      video.volume = 1.0;
      setIsMuted(false);
      // If unmuted in the first 2 seconds, rewind to 0:00 so voiceover is heard from the start
      if (video.currentTime > 0 && video.currentTime < 2.5) {
        video.currentTime = 0;
        if (bgVideoRef.current) bgVideoRef.current.currentTime = 0;
      }
      video.play().catch(() => {});
      if (bgVideoRef.current) bgVideoRef.current.play().catch(() => {});
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, []);

  // Primary playback handler: attempts unmuted playback first; falls back gracefully if restricted
  const startPlayback = useCallback(async () => {
    const video = mainVideoRef.current;
    const bgVideo = bgVideoRef.current;
    if (!video) return;

    video.playsInline = true;
    video.volume = 1.0;

    // Step 1: Attempt direct simultaneous unmuted playback
    try {
      video.muted = false;
      video.currentTime = 0;
      await video.play();
      setIsMuted(false);
      setIsPlaying(true);
      setIsAutoplayBlocked(false);
      if (bgVideo) {
        bgVideo.currentTime = 0;
        bgVideo.play().catch(() => {});
      }
    } catch (unmutedErr) {
      console.info('Unmuted autoplay prevented by browser policy; attempting muted playback with audio control pill:', unmutedErr);
      
      // Step 2: Attempt muted playback so the visitor immediately sees the advertisement
      try {
        video.muted = true;
        await video.play();
        setIsMuted(true);
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
        if (bgVideo) {
          bgVideo.play().catch(() => {});
        }

        // Setup single-touch unmuting listener on any interaction
        const events = ['pointerdown', 'touchstart', 'mousedown', 'keydown'];
        const onInteraction = () => {
          if (video && video.muted) {
            video.muted = false;
            video.volume = 1.0;
            setIsMuted(false);
            if (video.currentTime > 0 && video.currentTime < 2.5) {
              video.currentTime = 0;
              if (bgVideo) bgVideo.currentTime = 0;
            }
            video.play().catch(() => {});
          }
          events.forEach((evt) => window.removeEventListener(evt, onInteraction));
        };

        events.forEach((evt) => {
          window.addEventListener(evt, onInteraction, { passive: true, once: true });
        });

      } catch (mutedErr) {
        // Step 3: Autoplay fully blocked (low power mode / strict policy) -> show interactive luxury Play button
        console.warn('Autoplay restricted completely by browser:', mutedErr);
        setIsAutoplayBlocked(true);
        setIsPlaying(false);
      }
    }
  }, []);

  // Manual trigger when user clicks "Play Intro" button
  const handleManualPlay = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = mainVideoRef.current;
    const bgVideo = bgVideoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1.0;
    video.currentTime = 0;

    try {
      await video.play();
      setIsMuted(false);
      setIsPlaying(true);
      setIsAutoplayBlocked(false);
      if (bgVideo) {
        bgVideo.currentTime = 0;
        bgVideo.play().catch(() => {});
      }
    } catch (err) {
      console.error('Playback failed on user gesture:', err);
      // Fallback: dismiss to homepage if even user gesture fails
      dismissIntro();
    }
  }, [dismissIntro]);

  useEffect(() => {
    if (!isVisible) return;

    // Prevent document scrolling during cinematic intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 14-second fail-safe timeout (video is ~10s)
    const safetyTimeout = setTimeout(() => {
      dismissIntro();
    }, 14000);

    startPlayback();

    return () => {
      clearTimeout(safetyTimeout);
      document.body.style.overflow = originalOverflow;
    };
  }, [isVisible, dismissIntro, startPlayback]);

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sri Balaji Brand Introduction"
      onClick={() => {
        // Clicking anywhere un-mutes and plays with sound
        const video = mainVideoRef.current;
        if (video && video.muted) {
          toggleSound();
        }
      }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#120820] select-none transition-opacity duration-700 ease-out overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* SECTION 3: SOFTLY BLURRED AMBIENT VIDEO BACKGROUND FOR EDGE-TO-EDGE LUXURY PRESENTATION */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none opacity-30 select-none">
        <video
          ref={bgVideoRef}
          src="/videos/sri-balaji-intro.mp4"
          aria-hidden="true"
          tabIndex={-1}
          muted
          playsInline
          className="w-full h-full object-cover filter blur-3xl scale-110 brightness-90"
        />
      </div>

      {/* Royal subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gold/15 rounded-full blur-3xl pointer-events-none z-15" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-imperial-soft/20 rounded-full blur-3xl pointer-events-none z-15" />

      {/* SECTION 4: PREMIUM "SKIP INTRO →" BUTTON */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismissIntro();
          }}
          aria-label="Skip Intro and proceed to website"
          className="group flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-imperial-dark/80 hover:bg-imperial-dark backdrop-blur-md border border-gold/40 hover:border-gold text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-royal transition-all transform hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px]"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* SECTION 5: SUBTLE SOUND-ON / SOUND-OFF PILL CONTROL */}
      {!isAutoplayBlocked && (
        <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 pointer-events-auto">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Enable Sound' : 'Mute Sound'}
            className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full backdrop-blur-md text-xs sm:text-sm font-bold tracking-wide transition-all shadow-royal min-h-[44px] min-w-[44px] ${
              isMuted
                ? 'bg-imperial-dark/85 text-gold-light border border-gold/60 animate-pulse hover:border-gold'
                : 'bg-black/60 text-white/90 border border-white/20 hover:border-gold/40'
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-gold shrink-0" />
                <span className="text-white font-semibold">Sound Off • <strong className="text-gold font-bold">Tap to Listen</strong></span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-soft shrink-0" />
                <span className="text-white/90 font-medium">Sound On</span>
                {/* Subtle sound wave indicator */}
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-1.5 bg-gold rounded-full animate-pulse" />
                  <span className="w-0.5 h-3 bg-gold rounded-full animate-pulse [animation-delay:0.2s]" />
                  <span className="w-0.5 h-2 bg-gold rounded-full animate-pulse [animation-delay:0.4s]" />
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* SECTION 5: ATTRACTIVE "PLAY INTRO" BUTTON IF AUTOPLAY IS STRICTLY BLOCKED */}
      {isAutoplayBlocked && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="text-center max-w-md space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <button
              type="button"
              onClick={handleManualPlay}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gold hover:bg-gold-rich text-imperial font-black text-sm uppercase tracking-wider shadow-gold hover:shadow-royal transform hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-imperial" />
              <span>Play Intro Experience</span>
            </button>
            <p className="text-xs text-ivory/80 tracking-wide">
              Tap to start the cinematic brand advertisement with original audio.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 2 & 3: MAIN FULL-SCREEN RESPONSIVE VIDEO PLAYER (16:9 CENTERED, NEVER CROPPED) */}
      <div className="relative z-20 w-full h-full flex items-center justify-center overflow-hidden p-0 m-0">
        <video
          ref={mainVideoRef}
          src="/videos/sri-balaji-intro.mp4"
          poster="/videos/sri-balaji-intro-poster.jpg"
          playsInline
          preload="metadata"
          onEnded={() => dismissIntro()}
          onError={() => {
            console.error('Video error encountered; gracefully falling back to homepage.');
            dismissIntro();
          }}
          className="w-full h-full max-w-full max-h-full object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
};
