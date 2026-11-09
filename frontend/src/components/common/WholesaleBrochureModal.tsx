import React from 'react';
import { X, Printer, Download, Store, ShieldCheck, Truck, Phone } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { initialProducts, initialBusinessSettings } from '../../data/initialData';

interface WholesaleBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WholesaleBrochureModal: React.FC<WholesaleBrochureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-fadeIn">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-gold/40 shadow-royal overflow-hidden my-8 print:border-none print:shadow-none print:my-0">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-gradient-to-r from-imperial via-imperial-secondary to-[#190D2B] text-white flex items-center justify-between border-b border-gold/30 print:hidden">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-gold" />
            <span className="font-display font-extrabold text-sm text-gold">
              Sri Balaji B2B Wholesale Catalogue &amp; Commercial Spec Sheet
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold hover:bg-gold-rich text-imperial font-bold text-xs uppercase tracking-wider transition-all shadow-gold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-ivory flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-8 sm:p-12 space-y-8 text-imperial bg-white print:p-6" id="printable-brochure">
          
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b-2 border-gold/40 pb-6">
            <div className="space-y-1">
              <BrandLogo variant="crest" size="lg" showSubtitle={true} theme="light" />
              <p className="text-xs text-cocoa-muted max-w-md pt-2">
                Manufacturer of Premium Mixtures, Murrukulu &amp; Chips since 1995.
                Gandhi School Road, Near Post Office, Paralakhemundi, Gajapati, Odisha – 761200.
              </p>
            </div>

            <div className="sm:text-right space-y-1 text-xs">
              <div className="font-bold text-imperial text-sm">WHOLESALE SPECIFICATION SHEET</div>
              <div className="text-cocoa-muted">Ref: <strong>SB-B2B-CATALOGUE-2026</strong></div>
              <div className="text-cocoa-muted">Effective: <strong>Nov 2026 – Valid for 6 Months</strong></div>
              <div className="font-mono text-gold-deep font-bold pt-1">
                Desk: +91 98617 89602 / +91 94371 35342
              </div>
            </div>
          </div>

          {/* 3 Value Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-cream/40 border border-ivory-border space-y-1">
              <strong className="text-imperial font-bold block">Factory-Direct Pricing</strong>
              <p className="text-cocoa-muted text-[11px]">Direct manufacturer rates for Kiranas, supermarkets and regional snack stockists.</p>
            </div>
            <div className="p-4 rounded-2xl bg-cream/40 border border-ivory-border space-y-1">
              <strong className="text-imperial font-bold block">Corrugated Bulk Cartons</strong>
              <p className="text-cocoa-muted text-[11px]">Heavyweight transit corrugated cartons (3kg, 5kg, 10kg) suited for counter display or loose sale.</p>
            </div>
            <div className="p-4 rounded-2xl bg-cream/40 border border-ivory-border space-y-1">
              <strong className="text-imperial font-bold block">Road Cargo Network</strong>
              <p className="text-cocoa-muted text-[11px]">Dispatched via Jagannath Bus Cargo, Berhampur Roadlines &amp; regional freight tempos across Odisha.</p>
            </div>
          </div>

          {/* Authentic Wholesale Product Table */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-base text-imperial border-b border-ivory-border pb-2">
              Factory Wholesale Price List
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-imperial text-gold font-bold text-[11px] uppercase">
                    <th className="p-3">Variety / Snack Name</th>
                    <th className="p-3">Standard Weight</th>
                    <th className="p-3">Retail MRP</th>
                    <th className="p-3">Wholesale Rate</th>
                    <th className="p-3">MOQ (Packets)</th>
                    <th className="p-3">Bulk Carton Option</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-border">
                  {initialProducts.map((p) => {
                    const base = p.variants[0];
                    const bulk = p.variants[p.variants.length - 1];
                    return (
                      <tr key={p.id} className="hover:bg-cream/20">
                        <td className="p-3 font-bold text-imperial">{p.name}</td>
                        <td className="p-3 text-cocoa">{base.weight_label}</td>
                        <td className="p-3 text-stone-400 line-through">₹{base.retail_price}</td>
                        <td className="p-3 font-mono font-bold text-imperial">₹{base.wholesale_price || base.retail_price}</td>
                        <td className="p-3 font-semibold text-cocoa">{p.minimum_order_qty} pcs</td>
                        <td className="p-3 text-cocoa-muted text-[11px]">{bulk.weight_label} (₹{bulk.wholesale_price || bulk.retail_price})</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commercial Terms & Dispatch Terms */}
          <div className="p-6 rounded-2xl bg-ivory border border-ivory-border text-xs space-y-2">
            <strong className="text-imperial font-bold block text-sm">Commercial Terms &amp; Ordering Guidelines:</strong>
            <ul className="list-disc list-inside space-y-1 text-cocoa text-[11px] leading-relaxed">
              <li><strong>Packaging:</strong> Nitrogen flushed &amp; airtight food grade pouches ensuring 45-60 days freshness retention.</li>
              <li><strong>Minimum Dispatch:</strong> Minimum commercial order is ₹2,000 for roadline transit or 1 full carton.</li>
              <li><strong>Payment Terms:</strong> 100% advance or approved UPI / Bank NEFT dispatch receipt. Credit accounts available for approved distributors after 3 qualifying cycles.</li>
              <li><strong>Transit Claims:</strong> Any carton damage during lorry transit must be noted on Lorry Receipt (LR) copy upon receipt.</li>
            </ul>
          </div>

          {/* Authorization Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gold/30 text-xs text-cocoa-muted">
            <div>
              <strong>Authorized Signatory:</strong> Sri Adari Krishna Rao &amp; Adari Dilleshwar Rao
            </div>
            <div className="font-mono text-imperial font-semibold">
              Official B2B Desk: <a href="https://sribalajispecialmixtures.in/dealer" className="underline text-gold-deep">sribalajispecialmixtures.in/dealer</a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
