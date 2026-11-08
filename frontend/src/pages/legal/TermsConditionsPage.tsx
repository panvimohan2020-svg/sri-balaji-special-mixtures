import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, ArrowLeft, Award } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 text-cocoa">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-gold-deep hover:text-gold transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </Link>

      <div className="space-y-3 border-b border-ivory-border pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-imperial border border-gold/40 text-xs font-bold">
          <FileText className="w-3.5 h-3.5 text-gold-deep" />
          <span>Commercial &amp; Operating Standards</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-imperial tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-muted">
          Effective Date: November 2026 • Sri Balaji Special Mixtures, Paralakhemundi
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            1. Overview &amp; Acceptance
          </h2>
          <p>
            By accessing or ordering through the Sri Balaji platform (website, WhatsApp enquiry desk, or counter orders), you agree to be bound by these Terms and Conditions. These terms apply equally to household retail customers and registered B2B wholesale dealers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            2. Product Quality &amp; Food Standards
          </h2>
          <p>
            All Sri Balaji mixtures, murrukulu, and savouries are prepared in our certified Paralakhemundi kitchen facility using traditional recipes handed down by founder Sri Adari Krishna Rao since 1995.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-cocoa-muted">
            <li><strong>100% Pure Vegetarian:</strong> We maintain strictly vegetarian preparation standards.</li>
            <li><strong>Fresh Batch Guarantee:</strong> Products are packaged with moisture-barrier food-grade foil pouches to retain crispness for up to 90 days.</li>
            <li><strong>Weight Tolerance:</strong> Package weights conform to legal metrology standards.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            3. Pricing &amp; Minimum Order Quantities (MOQ)
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-cocoa-muted">
            <li><strong>Retail Pricing:</strong> Single and family packets (250g, 500g, 1kg) are sold at standard Maximum Retail Price (MRP).</li>
            <li><strong>Wholesale Commercial Rates:</strong> B2B dealer rates require compliance with product-specific Minimum Order Quantities (MOQ) or bulk cartons (3kg, 5kg).</li>
            <li><strong>Quotations:</strong> Official B2B quotations (SB-QT-XXXX) generated through our dealer portal remain valid for 14 calendar days from the date of issue.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            4. Payment Terms &amp; Settlement
          </h2>
          <p>
            Online payments are verified instantly via Razorpay (UPI, Credit/Debit cards, Net Banking). Direct counter payments or RTGS/NEFT wholesale settlements must reflect in the Sri Balaji commercial bank account prior to factory consignment dispatch.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            5. Jurisdiction
          </h2>
          <p>
            Any disputes arising out of orders or commercial contracts shall be subject to the exclusive jurisdiction of the competent courts in Paralakhemundi, Gajapati District, Odisha.
          </p>
        </section>
      </div>
    </div>
  );
};
