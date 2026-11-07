import React from 'react';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { initialBundles, initialBusinessSettings } from '../data/initialData';

export const BundlesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-turmeric-100 text-cocoa-dark text-xs font-bold border border-turmeric-300">
          <Sparkles className="w-3.5 h-3.5 text-turmeric-700" />
          <span>Curated Snack Combinations</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-plum-900 tracking-tight">
          Smart Snack Bundles &amp; Collections
        </h1>
        <p className="text-sm text-cocoa-muted leading-relaxed">
          Conveniently curated assortments featuring our top-moving mixtures, chips, and savouries. Ideal for retail store trial packs and family celebrations.
        </p>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {initialBundles.map((bundle) => (
          <div
            key={bundle.id}
            className="rounded-3xl bg-white border border-ivory-border overflow-hidden shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
          >
            <div className="aspect-[16/10] bg-gradient-to-b from-ivory-warm to-white relative overflow-hidden p-3 flex items-center justify-center">
              <img
                src={bundle.image_url}
                alt={bundle.name}
                className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-plum-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Assorted Box
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow justify-between gap-6">
              <div>
                <h3 className="font-display font-bold text-xl text-plum-900">
                  {bundle.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-cocoa-muted leading-relaxed">
                  {bundle.description}
                </p>
              </div>

              <div className="pt-4 border-t border-ivory-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cocoa-muted uppercase font-bold block">
                    Fixed Combo Price
                  </span>
                  <span className="font-display font-extrabold text-2xl text-plum-900">
                    ₹{bundle.bundle_price}
                  </span>
                </div>

                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp_number}?text=${encodeURIComponent(`Namaste Sri Balaji! I would like to order the snack bundle: ${bundle.name} (Price: ₹${bundle.bundle_price}). Please share dispatch details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pista-600 hover:bg-pista-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" variant="white" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
