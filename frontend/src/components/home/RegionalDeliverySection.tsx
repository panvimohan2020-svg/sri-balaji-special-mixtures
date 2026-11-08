import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  Truck,
  Bus,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  MessageCircle,
  Clock,
  ArrowRight,
  Package,
  ShieldCheck,
  ChevronRight,
  Loader2,
  RotateCcw,
  IndianRupee
} from 'lucide-react';
import { apiService, PincodeCheckResult } from '../../services/api';

// Verified popular delivery location chips matching PostgreSQL database
const POPULAR_LOCATIONS = [
  { label: 'Paralakhemundi', pin: '761200', tag: 'Central Hub' },
  { label: 'Pathapatnam', pin: '532201', tag: 'AP Corridor' },
  { label: 'Palasa / Kasibugga', pin: '532221', tag: 'AP Junction' },
  { label: 'Gunupur Main', pin: '765017', tag: 'Rayagada Hub' },
  { label: 'Gunupur Rural', pin: '765022', tag: 'Special Transit' },
  { label: 'Berhampur', pin: '760001', tag: 'Major City' },
  { label: 'Srikakulam Town', pin: '532001', tag: 'AP District' },
  { label: 'Bhubaneswar', pin: '751001', tag: 'State Capital' },
];

// Search example suggestions
const SEARCH_EXAMPLES = [
  '761200',
  '765022',
  '532201',
  '532001',
  'Ranipeta',
  'Kasinagar',
  'Palasa',
  'Tekkali',
  'Gunupur',
  'Berhampur',
  'Srikakulam',
];

export const RegionalDeliverySection: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<PincodeCheckResult | null>(null);
  const [multiResults, setMultiResults] = useState<PincodeCheckResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const executeSearch = async (query: string, chipPin?: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    if (isSearching) return; // Prevent duplicate requests while searching

    setIsSearching(true);
    setHasSearched(true);
    setSearchResult(null); // Clear previous result immediately
    setMultiResults([]);

    try {
      // 1. If 6-digit Indian PIN code
      if (/^\d{6}$/.test(cleanQuery)) {
        const pinRes = await apiService.checkPincodeServiceability(cleanQuery);
        setSearchResult(pinRes);
        setMultiResults([pinRes]);
      } else {
        // 2. Multi-attribute query (village, town, city, district, state)
        const searchRes = await apiService.searchLogisticsLocations(cleanQuery);
        if (searchRes.results && searchRes.results.length > 0) {
          setMultiResults(searchRes.results);
          setSearchResult(searchRes.results[0]);
        } else {
          // Fallback if not found in indexed route network
          const fallbackResult: PincodeCheckResult = {
            pincode: cleanQuery,
            is_serviceable: false,
            serviceability_status: 'UNAVAILABLE',
            status_label: 'Currently Unavailable',
            city: cleanQuery,
            district: 'Outside Scheduled Routes',
            state: 'Regional Route',
            min_delivery_days: 2,
            max_delivery_days: 4,
            standard_shipping_rate: 0,
            delivery_charges_text: 'Custom Freight Quote',
            cod_available: false,
            daily_transit_available: false,
            message: `Delivery is currently unavailable on automated scheduled routes for "${cleanQuery}". However, private roadline cargo, state bus parcels, or bulk wholesale carton transit can be arranged directly via our dispatch desk.`,
            whatsapp_url: `https://wa.me/919861789602?text=${encodeURIComponent(
              `🚚 *REGIONAL TRANSIT ENQUIRY – SRI BALAJI*\nLocation: ${cleanQuery}\nPlease advise transport availability, nearest cargo hub, and carton dispatch quote.`
            )}`,
          };
          setSearchResult(fallbackResult);
          setMultiResults([]);
        }
      }
    } catch {
      // Network or API failure fallback
      setSearchResult({
        pincode: cleanQuery,
        is_serviceable: false,
        serviceability_status: 'PENDING_VERIFICATION',
        status_label: 'Route Verification Required',
        city: cleanQuery,
        district: 'Regional Dispatch Area',
        state: 'Odisha / AP',
        min_delivery_days: 1,
        max_delivery_days: 3,
        standard_shipping_rate: 0,
        cod_available: false,
        daily_transit_available: false,
        message: 'Could not connect to live route dispatcher. Please confirm route directly with Sri Balaji Dispatch at +91 98617 89602.',
        whatsapp_url: `https://wa.me/919861789602?text=${encodeURIComponent(
          `🚚 *DELIVERY CHECK – SRI BALAJI*\nLocation: ${cleanQuery}\nPlease confirm delivery route and transport timing.`
        )}`,
      });
      setMultiResults([]);
    } finally {
      // Always reset loading button back to normal state
      setIsSearching(false);
      if (chipPin) {
        setActiveChip(chipPin);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveChip(null);
    executeSearch(searchInput);
  };

  const handleChipClick = (pin: string, label: string) => {
    setSearchInput(pin);
    setActiveChip(pin);
    executeSearch(pin, pin);
  };

  const handleExampleClick = (example: string) => {
    setSearchInput(example);
    setActiveChip(null);
    executeSearch(example);
  };

  const handleSelectMultiResult = (res: PincodeCheckResult) => {
    setSearchResult(res);
  };

  const handleResetSearch = () => {
    setSearchInput('');
    setSearchResult(null);
    setMultiResults([]);
    setHasSearched(false);
    setActiveChip(null);
  };

  const renderStatusBadge = (status?: string) => {
    const s = (status || 'REGULAR').toUpperCase();
    switch (s) {
      case 'REGULAR':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border-2 border-emerald-400 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Regular Delivery Available</span>
          </span>
        );
      case 'CUSTOM_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border-2 border-amber-400 shadow-xs">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Custom Transit Available</span>
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-950 border-2 border-blue-400 shadow-xs">
            <HelpCircle className="w-4 h-4 text-blue-700" />
            <span>Verification Pending</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-950 border-2 border-rose-300 shadow-xs">
            <XCircle className="w-4 h-4 text-rose-700" />
            <span>Currently Unavailable</span>
          </span>
        );
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#F5EFE3] border-b-2 border-[#D6A52D]/30 relative overflow-hidden">
      {/* Background Decorative Patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D6A52D]/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#28143F]/5 rounded-full blur-3xl pointer-events-none -ml-40 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#28143F]/10 border border-[#D6A52D]/50 text-[#28143F] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Truck className="w-3.5 h-3.5 text-[#D6A52D]" />
            <span>PARALAKHEMUNDI CENTRAL DISPATCH • REGIONAL DISTRIBUTION</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#28143F] tracking-tight leading-tight mb-4">
            From Our Kitchen to Your Doorstep
          </h2>

          {/* Description */}
          <p className="font-serif text-base sm:text-lg text-[#3B2D27] font-medium max-w-2xl mx-auto leading-relaxed">
            Check delivery serviceability across Odisha, the Paralakhemundi corridor, and selected neighbouring Andhra Pradesh border locations.
          </p>

          <div className="royal-divider max-w-xs mx-auto mt-5">
            <span className="royal-divider-diamond text-[#D6A52D]">✦</span>
          </div>
        </div>

        {/* 4 Delivery Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-12">
          <div className="bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border-2 border-[#D6A52D]/40 shadow-soft hover:shadow-md transition-shadow flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F4C45E]/20 flex items-center justify-center shrink-0 border border-[#D6A52D] text-[#28143F]">
              <MapPin className="w-5 h-5 text-[#28143F]" />
            </div>
            <div>
              <div className="font-display font-extrabold text-[#28143F] text-sm sm:text-base">
                85+ Direct Route Hubs
              </div>
              <p className="text-[#3B2D27] font-medium text-xs mt-1 leading-snug">
                Covering Gajapati, Rayagada, Ganjam, and Srikakulam border towns
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border-2 border-[#D6A52D]/40 shadow-soft hover:shadow-md transition-shadow flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F4C45E]/20 flex items-center justify-center shrink-0 border border-[#D6A52D] text-[#28143F]">
              <Bus className="w-5 h-5 text-[#28143F]" />
            </div>
            <div>
              <div className="font-display font-extrabold text-[#28143F] text-sm sm:text-base">
                State Roadlines &amp; Bus Cargo
              </div>
              <p className="text-[#3B2D27] font-medium text-xs mt-1 leading-snug">
                Same-day &amp; overnight bus parcel dispatch to all bus stations
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border-2 border-[#D6A52D]/40 shadow-soft hover:shadow-md transition-shadow flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F4C45E]/20 flex items-center justify-center shrink-0 border border-[#D6A52D] text-[#28143F]">
              <Truck className="w-5 h-5 text-[#28143F]" />
            </div>
            <div>
              <div className="font-display font-extrabold text-[#28143F] text-sm sm:text-base">
                Daily Regional Tempos
              </div>
              <p className="text-[#3B2D27] font-medium text-xs mt-1 leading-snug">
                Dedicated factory dispatch vans running scheduled daily supply trips
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border-2 border-[#D6A52D]/40 shadow-soft hover:shadow-md transition-shadow flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F4C45E]/20 flex items-center justify-center shrink-0 border border-[#D6A52D] text-[#28143F]">
              <Package className="w-5 h-5 text-[#28143F]" />
            </div>
            <div>
              <div className="font-display font-extrabold text-[#28143F] text-sm sm:text-base">
                Full Carton Wholesale Dispatch
              </div>
              <p className="text-[#3B2D27] font-medium text-xs mt-1 leading-snug">
                Cost-effective ₹30–₹45 flat carton freight for retail kiranas &amp; shops
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Delivery Search Box Card */}
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#D6A52D]/40 shadow-royal p-6 sm:p-10 max-w-4xl mx-auto">
          
          {/* Section 3 & 4: Improved Heading & Description Typography */}
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[40px] text-[#28143F] tracking-tight leading-tight">
              Check Delivery Availability
            </h3>
            <p className="text-[#3B2D27] font-semibold text-sm sm:text-base mt-2.5 leading-relaxed">
              Enter your PIN code, village, town, or district to check whether your location is covered by our delivery network.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto mb-5">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-[#D6A52D]" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter PIN code, village, town, or district (e.g. 532001, 761200)..."
                  aria-label="Enter PIN code or location name"
                  className="w-full pl-12 pr-11 py-3.5 sm:py-4 rounded-2xl bg-white border-2 border-[#D6A52D]/60 text-[#28143F] text-sm sm:text-base font-bold placeholder:text-[#7C6A5A] placeholder:font-medium focus:outline-none focus:border-[#28143F] focus:ring-3 focus:ring-[#D6A52D]/30 transition-all shadow-inner"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleResetSearch}
                    aria-label="Clear search input"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7C6A5A] hover:text-[#28143F] transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSearching || !searchInput.trim()}
                className="px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#28143F] via-[#351B54] to-[#1E0D30] text-[#F4C45E] font-sans font-black text-xs sm:text-sm tracking-wider uppercase shadow-gold hover:shadow-royal active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#F4C45E]" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span>Check Route</span>
                    <ArrowRight className="w-4 h-4 text-[#F4C45E]" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Search Examples with darker, high-contrast labels */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs">
              <span className="font-black text-[#28143F] uppercase tracking-wider text-[11px]">
                Examples:
              </span>
              {SEARCH_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => handleExampleClick(ex)}
                  className="px-2.5 py-0.5 rounded-lg bg-[#FAF5EC] border border-[#D6A52D]/60 text-[#28143F] font-bold hover:bg-[#F4C45E]/20 hover:border-[#D6A52D] hover:text-[#28143F] transition-all cursor-pointer text-xs"
                >
                  {ex}
                </button>
              ))}
            </div>
          </form>

          {/* Popular Delivery Locations Chips */}
          <div className="pt-5 border-t-2 border-[#D6A52D]/20">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#D6A52D]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#28143F]">
                Popular Delivery Locations
              </span>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {POPULAR_LOCATIONS.map((loc) => {
                const isSelected = activeChip === loc.pin;
                return (
                  <button
                    key={loc.pin}
                    type="button"
                    onClick={() => handleChipClick(loc.pin, loc.label)}
                    className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#28143F] text-[#F4C45E] border-[#28143F] shadow-royal ring-2 ring-[#D6A52D]/50 scale-102'
                        : 'bg-white hover:bg-[#FAF5EC] text-[#28143F] border-[#D6A52D]/50 hover:border-[#D6A52D] shadow-xs'
                    }`}
                  >
                    <span className="font-extrabold">{loc.label}</span>
                    <span className={`text-[11px] font-mono font-black px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-[#F4C45E] text-[#28143F]' : 'bg-[#28143F]/10 text-[#28143F]'
                    }`}>
                      {loc.pin}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-Time Live Results Card */}
          {hasSearched && searchResult && (
            <div className="mt-8 pt-6 border-t-2 border-[#D6A52D]/30 animate-fadeIn">
              
              {/* If multiple results matched from a general text search */}
              {multiResults.length > 1 && (
                <div className="mb-4">
                  <div className="text-xs text-[#3B2D27] font-extrabold mb-2">
                    Found {multiResults.length} matching locations for your search:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {multiResults.map((r) => (
                      <button
                        key={r.pincode + (r.city || '')}
                        type="button"
                        onClick={() => handleSelectMultiResult(r)}
                        className={`text-xs px-3 py-1.5 rounded-lg border-2 transition-all cursor-pointer ${
                          searchResult.pincode === r.pincode
                            ? 'bg-[#28143F] text-[#F4C45E] border-[#28143F] font-black'
                            : 'bg-white hover:bg-[#FAF5EC] text-[#28143F] border-[#D6A52D]/40 font-bold'
                        }`}
                      >
                        {r.city} ({r.pincode}) — {r.district}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Result Detail Card */}
              <div className="rounded-2xl border-2 border-[#D6A52D]/50 bg-radial-royal text-white p-5 sm:p-7 shadow-royal relative overflow-hidden">
                <div className="relative z-10 space-y-5">
                  
                  {/* Status Banner & Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/15">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-[#F4C45E] font-black">
                        {searchResult.state || 'Odisha'} • {searchResult.district || 'Regional Network'}
                      </div>
                      <h4 className="text-xl sm:text-2xl font-display font-extrabold text-white mt-0.5">
                        {searchResult.city || searchResult.pincode}
                        {searchResult.pincode && searchResult.pincode !== '------' && (
                          <span className="ml-2 font-mono text-base font-bold text-[#F4C45E]">
                            ({searchResult.pincode})
                          </span>
                        )}
                      </h4>
                    </div>
                    <div>
                      {renderStatusBadge(searchResult.serviceability_status)}
                    </div>
                  </div>

                  {/* Route explanation message */}
                  {searchResult.message && (
                    <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed bg-black/25 rounded-xl p-3.5 border border-white/10">
                      {searchResult.message}
                    </p>
                  )}

                  {/* 4-Column Logistics Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    {/* Delivery Time */}
                    <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
                      <div className="flex items-center gap-1.5 text-[#F4C45E] text-xs font-bold mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Transit Duration</span>
                      </div>
                      <div className="text-sm font-extrabold text-white">
                        {searchResult.transit_duration_label ||
                          `${searchResult.min_delivery_days || 1}–${searchResult.max_delivery_days || 2} Days`}
                      </div>
                      <div className="text-[11px] text-white/70 mt-0.5">
                        From Paralakhemundi kitchen
                      </div>
                    </div>

                    {/* Transport Modes */}
                    <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
                      <div className="flex items-center gap-1.5 text-[#F4C45E] text-xs font-bold mb-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Available Transport</span>
                      </div>
                      <div className="text-xs font-bold text-white space-y-0.5">
                        {(searchResult.transport_modes && searchResult.transport_modes.length > 0)
                          ? searchResult.transport_modes.slice(0, 2).join(' • ')
                          : 'State Roadlines & Bus Cargo'}
                      </div>
                      <div className="text-[11px] text-white/70 mt-0.5">
                        Daily regional dispatch
                      </div>
                    </div>

                    {/* Wholesale Carton Freight */}
                    <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
                      <div className="flex items-center gap-1.5 text-[#F4C45E] text-xs font-bold mb-1">
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>Wholesale Rate</span>
                      </div>
                      <div className="text-sm font-extrabold text-emerald-300">
                        {searchResult.delivery_charges_text ||
                          (searchResult.standard_shipping_rate
                            ? `₹${searchResult.standard_shipping_rate} / carton`
                            : 'Custom Freight Quote')}
                      </div>
                      <div className="text-[11px] text-white/70 mt-0.5">
                        Direct Factory Freight
                      </div>
                    </div>

                    {/* Payment Mode */}
                    <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
                      <div className="flex items-center gap-1.5 text-[#F4C45E] text-xs font-bold mb-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Payment Terms</span>
                      </div>
                      <div className="text-xs font-bold text-white">
                        {searchResult.cod_available ? 'COD & Prepaid' : 'Direct Dispatch Invoice'}
                      </div>
                      <div className="text-[11px] text-white/70 mt-0.5">
                        Verified B2B terms
                      </div>
                    </div>
                  </div>

                  {/* Localities / Coverage Villages */}
                  {searchResult.localities && searchResult.localities.length > 0 && (
                    <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-xs">
                      <span className="text-[#F4C45E] font-bold">Covered Localities / Villages: </span>
                      <span className="text-white/90 font-medium">
                        {searchResult.localities.slice(0, 8).join(', ')}
                        {searchResult.localities.length > 8 && ` +${searchResult.localities.length - 8} more`}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons: WhatsApp & Full Coverage Link */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    {searchResult.whatsapp_url ? (
                      <a
                        href={searchResult.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-emerald" />
                        <span>Enquire Route via WhatsApp</span>
                      </a>
                    ) : (
                      <a
                        href={`https://wa.me/919861789602?text=${encodeURIComponent(
                          `🚚 *DELIVERY INQUIRY – SRI BALAJI*\nPIN: ${searchResult.pincode} (${searchResult.city})\nPlease confirm road transport schedule.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-emerald" />
                        <span>Chat with Wholesale Dispatch Desk</span>
                      </a>
                    )}

                    <Link
                      to="/delivery-coverage"
                      className="inline-flex items-center gap-1.5 text-xs text-[#F4C45E] hover:text-[#FFE7A3] font-bold transition-colors"
                    >
                      <span>Explore Complete 30-District Coverage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Banner with Link to Wholesale Portal */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-[#D6A52D]/40 shadow-xs text-xs">
            <span className="flex items-center gap-1.5 text-[#28143F] font-extrabold">
              <ShieldCheck className="w-4 h-4 text-emerald" />
              <span>Are you a Kirana Store, Supermarket, or Tea Stall Owner?</span>
            </span>
            <Link
              to="/wholesale"
              className="inline-flex items-center gap-1 text-[#D6A52D] hover:text-[#28143F] font-black uppercase tracking-wider transition-colors"
            >
              <span>Apply for Direct Factory Wholesale Pricing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
