import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 text-cocoa">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-gold-deep hover:text-gold transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </Link>

      <div className="space-y-3 border-b border-ivory-border pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald/10 text-emerald-deep border border-emerald/30 text-xs font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>Customer Data Protection &amp; Confidentiality</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-imperial tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-muted">
          Effective Date: November 2026 • Sri Balaji Special Mixtures, Paralakhemundi, Odisha
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            1. Our Commitment to Your Privacy
          </h2>
          <p>
            At <strong>Sri Balaji Special Mixtures</strong> ("we", "our", or "us"), we respect the privacy of every household customer, wholesale dealer, and website visitor. This policy explains how we collect, store, and protect your information when using our website and digital services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-cocoa-muted">
            <li><strong>Personal Contact Information:</strong> Name, mobile phone number, email address (optional), and physical delivery address for processing orders.</li>
            <li><strong>B2B Wholesale Data:</strong> Business name, shop address, GSTIN (where applicable), and regional distribution details.</li>
            <li><strong>Order History:</strong> Product items ordered, weight variants, amounts paid, and delivery status milestones.</li>
            <li><strong>Payment Information:</strong> We do NOT store debit/credit card numbers or UPI PINs. All online payments are handled securely through our verified PCI-DSS compliant payment gateway (Razorpay).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            3. How We Use Your Information
          </h2>
          <p>Your information is used strictly for operational fulfillment:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-cocoa-muted">
            <li>To confirm, prepare, pack, and dispatch your snack orders.</li>
            <li>To deliver order status updates, WhatsApp dispatch notes, and lorry receipt (LR) copies.</li>
            <li>To manage your Balaji Crunch Reward points and referral benefits.</li>
            <li>To verify serviceability and calculate accurate regional road transport rates.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            4. Absolute Non-Disclosure Guarantee
          </h2>
          <p>
            We <strong>never sell, lease, rent, or trade</strong> customer phone numbers or business information to third-party marketing companies, data brokers, or advertisers. Your data is used exclusively for transactions with Sri Balaji.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-imperial flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            5. Contact Us Regarding Your Data
          </h2>
          <div className="p-4 rounded-2xl bg-ivory border border-ivory-border text-xs space-y-1">
            <p className="font-bold text-imperial">Sri Balaji Special Mixtures – Privacy &amp; Data Desk</p>
            <p>Gandhi School Road, Near Post Office, Paralakhemundi, Gajapati, Odisha – 761200</p>
            <p>Phone: +91 94371 35342 / +91 77353 33542 • WhatsApp: +91 98617 89602</p>
          </div>
        </section>
      </div>
    </div>
  );
};
