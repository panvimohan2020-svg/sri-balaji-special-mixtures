import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  ShoppingBag, 
  Check, 
  AlertCircle, 
  Plus, 
  Minus, 
  Trash2,
  RefreshCw,
  Volume2
} from 'lucide-react';
import { apiService } from '../../services/api';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useLanguageStore } from '../../store/useLanguageStore';

interface VoiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InterpretedItem {
  product: Product;
  variant: any;
  quantity: number;
}

export const VoiceOrderModal: React.FC<VoiceOrderModalProps> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognizedItems, setRecognizedItems] = useState<InterpretedItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [statusMessage, setStatusMessage] = useState('Tap the microphone and say e.g. "Add two 500g Onion Mixture packets"');
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const { language } = useLanguageStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    // Load products catalog for matching
    apiService.getProducts().then((data) => setAllProducts(data));

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setStatusMessage('Voice speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    // Set recognition language
    if (language === 'hi') recognition.lang = 'hi-IN';
    else if (language === 'te') recognition.lang = 'te-IN';
    else if (language === 'or') recognition.lang = 'or-IN';
    else recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setStatusMessage('Listening... Speak clearly now');
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      setStatusMessage(`Voice error: ${event.error}. Please tap mic and try again.`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  // Parse speech transcript into matching products
  useEffect(() => {
    if (!transcript.trim() || allProducts.length === 0) return;

    const lower = transcript.toLowerCase();
    const matches: InterpretedItem[] = [];

    // Detect quantity
    let detectedQty = 1;
    const numWords: Record<string, number> = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'ek': 1, 'do': 2, 'teen': 3, 'char': 4, 'paanch': 5,
      'okati': 1, 'rendu': 2, 'moodu': 3,
      'gote': 1, 'dui': 2, 'tini': 3
    };
    for (const [w, val] of Object.entries(numWords)) {
      if (lower.includes(w)) {
        detectedQty = val;
        break;
      }
    }
    const digitMatch = lower.match(/\b([1-9]|10)\b/);
    if (digitMatch) {
      detectedQty = parseInt(digitMatch[1], 10);
    }

    // Match products
    for (const prod of allProducts) {
      const prodName = prod.name.toLowerCase();
      // Match keywords
      const keywords = prodName.split(' ').filter((w: string) => w.length > 3);
      const isMatch = keywords.some((kw: string) => lower.includes(kw)) || lower.includes(prodName);

      if (isMatch) {
        // Find best variant by weight mention (e.g. 500g, 1kg, 250g)
        let selectedVariant = prod.variants[0];
        for (const v of prod.variants) {
          if (lower.includes(v.weight_label.toLowerCase()) || lower.includes(`${v.weight_in_grams}`)) {
            selectedVariant = v;
            break;
          }
        }

        matches.push({
          product: prod,
          variant: selectedVariant,
          quantity: detectedQty
        });
      }
    }

    if (matches.length > 0) {
      setRecognizedItems(matches);
      setStatusMessage(`Interpreted ${matches.length} snack item(s). Review below before adding to your bag.`);
    }
  }, [transcript, allProducts]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    setRecognizedItems((prev) =>
      prev
        .map((item, idx) => {
          if (idx === index) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as InterpretedItem[]
    );
  };

  const handleConfirmAndAdd = () => {
    for (const item of recognizedItems) {
      addItem(item.product, item.variant, item.quantity);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gold/40 shadow-royal overflow-hidden space-y-0">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-imperial via-imperial-secondary to-[#190D2B] text-white flex items-center justify-between border-b border-gold/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-gold">Bolke Mangwao (Voice Order)</h3>
              <p className="text-xs text-ivory/70">Speak your snack cravings in English, Hindi, Telugu, or Odia</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-ivory flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mic Visualizer & Status */}
        <div className="p-6 text-center space-y-4 bg-ivory/40 border-b border-ivory-border">
          <div className="relative inline-block">
            <button
              type="button"
              onClick={toggleListening}
              disabled={!speechSupported}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-xl cursor-pointer ${
                isListening
                  ? 'bg-red-600 animate-pulse ring-8 ring-red-500/30'
                  : 'bg-gradient-to-br from-gold to-gold-rich text-imperial hover:scale-105'
              }`}
              aria-label="Toggle voice listening"
            >
              {isListening ? <Mic className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-imperial">{statusMessage}</p>
            {transcript && (
              <div className="p-3 rounded-2xl bg-white border border-ivory-border text-cocoa font-mono text-xs max-w-md mx-auto">
                "{transcript}"
              </div>
            )}
          </div>
        </div>

        {/* Interpreted Items Review Box */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-imperial flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gold-deep" />
              <span>Interpreted Items ({recognizedItems.length})</span>
            </h4>
            <span className="text-[10px] text-cocoa-muted font-semibold uppercase tracking-wider">
              Verification Required
            </span>
          </div>

          {recognizedItems.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-ivory-border text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-gold-deep mx-auto" />
              <p className="text-xs text-cocoa-muted">
                No items detected yet. Tap the mic and say: <br />
                <span className="font-bold text-imperial">"Add 2 packets of Onion Mixture 500g"</span>
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {recognizedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-cream/40 border border-ivory-border flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <strong className="text-imperial font-bold block truncate">{item.product.name}</strong>
                    <div className="text-[11px] text-cocoa-muted">
                      Variant: <span className="text-imperial font-semibold">{item.variant.weight_label}</span> • ₹{item.variant.retail_price} each
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(idx, -1)}
                      className="w-7 h-7 rounded-lg bg-white border border-ivory-border flex items-center justify-center text-cocoa hover:bg-cream"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-imperial px-1">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(idx, 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-ivory-border flex items-center justify-center text-cocoa hover:bg-cream"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateQuantity(idx, -item.quantity)}
                      className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 ml-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-ivory-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-ivory-border text-cocoa text-xs font-semibold hover:bg-cream transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={recognizedItems.length === 0}
              onClick={handleConfirmAndAdd}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-rich hover:from-gold-light hover:to-gold text-imperial font-black text-xs uppercase tracking-wider transition-all disabled:opacity-40 flex items-center gap-2 shadow-gold cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm &amp; Add to Bag</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
