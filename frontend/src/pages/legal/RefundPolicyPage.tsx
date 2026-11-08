import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '../../components/common/WhatsAppIcon';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 text-cocoa">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-gold-deep hover:text-gold transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </Link>

      <div className="space-y-3 border-b border-ivory-border pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-imperial border border-gold/40 text-xs font-bold">
          <RotateCcw className="w-3.5 h-3.5 text-gold-deep" />
          <span>Cancellation, Transit Safety &amp; Refund Framework</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-imperial tracking-tight">
          Cancellation &amp; Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-muted">
          Effective Date: November 2026 • Sri Balaji Special Mixtures, Paralakhemundi
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            1. Perishable Food Nature
          </h2>
          <p>
            Because Sri Balaji products are freshly fried food items prepared without harsh chemical preservatives, <strong>we cannot accept general returns once a sealed package has been opened</strong>, in strict accordance with food safety regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            2. Order Cancellations
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-cocoa-muted">
            <li><strong>Before Packing/Dispatch:</strong> Customers may cancel their order free of charge at any time before the order status transitions to <code>PREPARING</code> or <code>DISPATCHED</code>.</li>
            <li><strong>After Dispatch:</strong> Once a consignment has been dispatched via road transport or delivery runner, cancellations cannot be processed.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            3. Transit Damage or Defective Packaging
          </h2>
          <p>
            We take utmost care in packing our savouries in heavy-duty airtight pouches and corrugated master cartons. In the rare event of transit damage:
          </p>
          <div className="p-4 rounded-2xl bg-cream border border-gold/30 space-y-2">
            <strong className="text-imperial block">How to Report Damaged Consignments:</strong>
            <p className="text-xs text-cocoa-muted">
              Notify our WhatsApp Desk (+91 98617 89602) within <strong>24 hours</strong> of receiving delivery. Please include:
            </p>
            <ul className="list-disc pl-5 text-xs text-cocoa-muted space-y-1">
              <li>Your Order Reference Number (e.g. SB-2611-XXXX).</li>
              <li>Clear photographs or a video showing the damaged outer box and affected pouches.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            4. Resolution &amp; Refund Processing
          </h2>
          <p>
            Upon verification by our management desk, customers will be offered:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-cocoa-muted">
            <li><strong>Immediate Replacement:</strong> Fresh replacement batch dispatched immediately at our expense, OR</li>
            <li><strong>Full/Partial Refund:</strong> Refund initiated to the original payment method (Bank Account / UPI) within <strong>3 to 5 business days</strong>.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
