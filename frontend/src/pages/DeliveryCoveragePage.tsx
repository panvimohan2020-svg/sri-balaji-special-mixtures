import React from 'react';
import { RegionalDeliveryCoverage } from '../components/logistics/RegionalDeliveryCoverage';
import { Store, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DeliveryCoveragePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Breadcrumb Header */}
      <div className="bg-cream/50 border-b border-ivory-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-cocoa-muted">
            <Link to="/" className="hover:text-imperial transition-colors">Home</Link>
            <span>/</span>
            <Link to="/wholesale" className="hover:text-imperial transition-colors">Wholesale &amp; B2B</Link>
            <span>/</span>
            <span className="font-bold text-imperial">Regional Delivery Coverage</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-cocoa-muted font-medium text-[11px]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gold-deep" />
              <span>Odisha &amp; Andhra Pradesh Network</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
              <span>Verified Road Transport</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Delivery Coverage Component */}
      <RegionalDeliveryCoverage />
    </div>
  );
};

export default DeliveryCoveragePage;

