import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top of page"
      className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-30 w-10 h-10 rounded-full bg-imperial/90 backdrop-blur-md text-gold hover:text-white hover:bg-imperial-secondary border border-gold/40 flex items-center justify-center shadow-royal hover:shadow-gold transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gold"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};

