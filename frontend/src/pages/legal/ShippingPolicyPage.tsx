import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowLeft, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 text-cocoa">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-gold-deep hover:text-gold transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </Link>

      <div className="space-y-3 border-b border-ivory-border pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald/10 text-emerald-deep border border-emerald/30 text-xs font-bold">
          <Truck className="w-3.5 h-3.5" />
          <span>Regional Road Transport &amp; Delivery Corridors</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-imperial tracking-tight">
          Delivery &amp; Shipping Policy
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-muted">
          Effective Date: November 2026 • Sri Balaji Special Mixtures, Paralakhemundi
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            1. Serviceable Delivery Zones
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-cream/70 border border-ivory-border space-y-1">
              <strong className="text-imperial font-bold block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-deep" />
                Local Paralakhemundi Zone (PIN 761200)
              </strong>
              <p className="text-cocoa-muted">Same-day counter pickup at Gandhi School Road or local doorstep courier delivery within 24 hours.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-cream/70 border border-ivory-border space-y-1">
              <strong className="text-imperial font-bold block flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald" />
                Regional Corridors (South Odisha &amp; Andhra)
              </strong>
              <p className="text-cocoa-muted">Gajapati, Rayagada, Ganjam (Berhampur), and neighbouring Srikakulam trade belts dispatched via daily road transport.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            2. Estimated Transit Timelines
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-cocoa-muted">
            <li><strong>Paralakhemundi Local:</strong> Within 12 to 24 hours of confirmation.</li>
            <li><strong>Berhampur &amp; Ganjam:</strong> 1 to 2 business days.</li>
            <li><strong>Rayagada &amp; Koraput:</strong> 2 to 3 business days.</li>
            <li><strong>Wholesale Commercial Cartons:</strong> Dispatched via scheduled regional transport operators (Gajapati Transport, Southern Carriers) with same-day LR generation.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            3. Delivery Charges
          </h2>
          <p>
            Standard retail orders in Paralakhemundi enjoy free delivery on qualifying order sizes. Regional wholesale road transport freight charges are calculated transparently based on carton weight (₹8/kg standard regional road transport rate).
          </p>
        </section>
      </div>
    </div>
  );
};
