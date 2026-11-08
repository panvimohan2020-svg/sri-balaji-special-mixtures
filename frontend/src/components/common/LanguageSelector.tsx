import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTranslation, LANGUAGE_OPTIONS, SupportedLanguage } from '../../store/useLanguageStore';

interface LanguageSelectorProps {
  compact?: boolean;
  variant?: 'light' | 'royal';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false, variant = 'royal' }) => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const isRoyal = variant === 'royal';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 ${
          isRoyal
            ? 'bg-imperial-dark/90 text-ivory border border-gold/40 hover:border-gold hover:bg-imperial'
            : 'text-imperial bg-white border border-ivory-border hover:border-gold/60 hover:bg-cream/50'
        }`}
        aria-label="Select language"
        title={`Current language: ${currentOption.nativeLabel} (${currentOption.label})`}
      >
        <span className="text-xs leading-none">{currentOption.flag}</span>
        <span className={`text-[11px] sm:text-xs font-semibold ${isRoyal ? 'text-ivory' : 'text-imperial'}`}>
          {compact ? currentOption.code.toUpperCase() : currentOption.nativeLabel}
        </span>
        <ChevronDown className={`w-3 h-3 text-gold transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-imperial-dark text-ivory border border-gold/40 shadow-royal py-1.5 z-50 animate-fadeIn">
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-gold/80 tracking-wider border-b border-imperial-border/80">
            Select Language / ଭାଷା
          </div>
          {LANGUAGE_OPTIONS.map((opt) => {
            const isSelected = opt.code === language;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleSelect(opt.code)}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-gold/20 text-gold font-bold'
                    : 'text-ivory/80 hover:bg-imperial hover:text-gold'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{opt.flag}</span>
                  <div>
                    <div className="font-semibold text-xs text-ivory">{opt.nativeLabel}</div>
                    <div className="text-[10px] text-gold-light/60">{opt.label}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-gold" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
