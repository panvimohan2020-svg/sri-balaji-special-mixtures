import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { initialProducts } from '../../data/initialData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      if (dialogRef.current && dialogRef.current.open) {
        dialogRef.current.close();
      }
    }
  }, [isOpen]);

  const filteredProducts = query.trim()
    ? initialProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.taste_profiles?.some((t: string) => t.toLowerCase().includes(query.toLowerCase())) ||
          (p.category?.name && p.category.name.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="search-modal-title"
      className="rounded-3xl p-0 w-full max-w-2xl bg-white shadow-2xl backdrop:bg-black/60 m-auto"
    >
      <div className="p-6">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 pb-4 border-b border-ivory-border">
          <Search className="w-5 h-5 text-chilli-600 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mixtures, pakodi, murrukulu, chivda..."
            className="flex-1 text-base font-medium text-plum-900 placeholder:text-stone-400 outline-none bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-cocoa transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Quick Tag Recommendations */}
        <div className="pt-4 pb-2">
          <span className="text-[11px] font-bold text-cocoa-muted uppercase tracking-wider block mb-2">
            Popular Searches:
          </span>
          <div className="flex flex-wrap gap-2">
            {['Onion Mixture', 'Chuda Mixture', 'Gujarat Mix', 'Murrukulu', 'Peanuts Pakodi', 'Kaju Biscuits'].map(
              (term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handlePopularSearch(term)}
                  className="px-3 py-1 rounded-full bg-peach-50 hover:bg-peach-100 text-chilli-700 text-xs font-semibold border border-peach-200 transition-colors"
                >
                  {term}
                </button>
              )
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="mt-4 max-h-80 overflow-y-auto divide-y divide-ivory-border">
          {query.trim() && filteredProducts.length === 0 ? (
            <div className="py-8 text-center text-sm text-cocoa-muted">
              No snacks found matching &ldquo;{query}&rdquo;. Try another traditional snack name.
            </div>
          ) : (
            filteredProducts.map((p) => {
              const baseVariant = p.variants[0];
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p.slug)}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-ivory-warm cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0]?.image_url || '/images/products/onion-mixture.png'}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-ivory-border shrink-0"
                    />
                    <div>
                      <h4 className="font-display font-bold text-sm text-plum-900 group-hover:text-chilli transition-colors">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-cocoa-muted">
                          {p.category?.name || 'Savouries'}
                        </span>
                        {p.taste_profiles?.[0] && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-turmeric-100 text-turmeric-800 font-bold">
                            {p.taste_profiles[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-bold text-plum-900">
                        ₹{baseVariant.retail_price}
                      </span>
                      <span className="text-[10px] text-cocoa-muted block">
                        /{baseVariant.weight_label}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-chilli group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </dialog>
  );
};
