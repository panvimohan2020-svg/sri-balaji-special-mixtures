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
  RotateCcw
} from 'lucide-react';
import { apiService, PincodeCheckResult } from '../../services/api';

// Popular delivery location chips required by specifications
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
  'Ranipeta',
  'Kasinagar',
  'Palasa',
  'Tekkali',
  'Gunupur',
  'Berhampur',
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

    setIsSearching(true);
    setHasSearched(true);
    setMultiResults([]);

    try {
      // 1. If 6-digit PIN code
      if (/^\d{6}$/.test(cleanQuery)) {
        const pinRes = await apiService.checkPincodeServiceability(cleanQuery);
        setSearchResult(pinRes);
        setMultiResults([pinRes]);
      } else {
        // 2. Multi-attribute location name query (town, village, district, state)
        const searchRes = await apiService.searchLogisticsLocations(cleanQuery);
        if (searchRes.results && searchRes.results.length > 0) {
          setMultiResults(searchRes.results);
          setSearchResult(searchRes.results[0]);
        } else {
          // Fallback if not found in indexed route database
          const fallbackResult: PincodeCheckResult = {
            pincode: cleanQuery,
            is_serviceable: false,
            serviceability_status: 'UNAVAILABLE',
            status_label: 'Custom Road Transit Option Available',
            city: cleanQuery,
            district: 'Regional Route',
            state: 'Odisha / Andhra Pradesh',
            min_delivery_days: 2,
            max_delivery_days: 4,
            standard_shipping_rate: 0,
            delivery_charges_text: 'Custom Freight Quote',
            cod_available: false,
            daily_transit_available: false,
            message: `No standard automated route was found for "${cleanQuery}". However, daily roadline cargo and wholesale cartons can be dispatched directly to your nearest bus stop or town depot. Contact our dispatch desk on WhatsApp.`,
            whatsapp_url: `https://wa.me/919861789602?text=${encodeURIComponent(
              `🚚 *REGIONAL TRANSIT ENQUIRY – SRI BALAJI*\nLocation: ${cleanQuery}\nPlease advise transport availability, nearest cargo hub, and carton dispatch quote.`
            )}`,
          };
          setSearchResult(fallbackResult);
          setMultiResults([]);
        }
      }
    } catch {
      // Network or API offline fallback
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Regular Delivery Available</span>
          </span>
        );
      case 'CUSTOM_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Custom Transit Available</span>
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 shadow-xs">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Verification Pending</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 shadow-xs">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>Custom Dispatch Only</span>
          </span>
        );
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#F5EFE3] border-b-2 border-gold/30 relative overflow-hidden">
      {/* Background Decorative Patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-imperial/5 rounded-full blur-3xl pointer-events-none -ml-40 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-imperial/5 border border-gold/40 text-imperial text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Truck className="w-3.5 h-3.5 text-gold-deep" />
            <span>PARALAKHEMUNDI CENTRAL DISPATCH • REGIONAL DISTRIBUTION</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-imperial tracking-tight leading-tight mb-4">
            From Our Kitchen to Your Doorstep
          </h2>

          {/* Description */}
          <p className="font-serif text-base sm:text-lg text-cocoa-muted max-w-2xl mx-auto leading-relaxed">
            Check delivery serviceability across Odisha, the Paralakhemundi corridor, and selected neighbouring Andhra Pradesh border locations.
          </p>

          <div className="royal-divider max-w-xs mx-auto mt-5">
            <span className="royal-divider-diamond">✦</span>
          </div>
        </div>

        {/* 4 Delivery Highlights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-gold/30 shadow-xs hover:shadow-md transition-shadow flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0 border border-gold/30 text-imperial">
              <MapPin className="w-5 h-5 text-gold-deep" />
            </div>
            <div>
              <div className="font-display font-bold text-imperial text-sm sm:text-base">
                85+ Direct Route Hubs
              </div>
              <p className="text-cocoa-muted text-xs mt-0.5 leading-snug">
                Covering Gajapati, Rayagada, Ganjam, and Srikakulam border towns
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-gold/30 shadow-xs hover:shadow-md transition-shadow flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0 border border-gold/30 text-imperial">
              <Bus className="w-5 h-5 text-gold-deep" />
            </div>
            <div>
              <div className="font-display font-bold text-imperial text-sm sm:text-base">
                State Roadlines &amp; Bus Cargo
              </div>
              <p className="text-cocoa-muted text-xs mt-0.5 leading-snug">
                Same-day &amp; overnight bus parcel dispatch to all bus stations
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-gold/30 shadow-xs hover:shadow-md transition-shadow flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0 border border-gold/30 text-imperial">
              <Truck className="w-5 h-5 text-gold-deep" />
            </div>
            <div>
              <div className="font-display font-bold text-imperial text-sm sm:text-base">
                Daily Regional Tempos
              </div>
              <p className="text-cocoa-muted text-xs mt-0.5 leading-snug">
                Dedicated factory dispatch vans running scheduled daily supply trips
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-gold/30 shadow-xs hover:shadow-md transition-shadow flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0 border border-gold/30 text-imperial">
              <Package className="w-5 h-5 text-gold-deep" />
            </div>
            <div>
              <div className="font-display font-bold text-imperial text-sm sm:text-base">
                Full Carton Wholesale Dispatch
              </div>
              <p className="text-cocoa-muted text-xs mt-0.5 leading-snug">
                Cost-effective ₹30–₹45 flat carton freight for retail kiranas &amp; shops
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Delivery Search Box Card */}
        <div className="bg-white rounded-3xl border-2 border-gold/35 shadow-royal p-6 sm:p-10 max-w-4xl mx-auto">
          {/* Card Header */}
          <div className="text-center max-w-xl mx-auto mb-6">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-imperial">
              Check Delivery Availability
            </h3>
            <p className="text-cocoa-muted text-xs sm:text-sm mt-1.5">
              Enter your PIN code, village, town, or district to check whether your location is covered by our delivery network.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto mb-5">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gold-deep" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter 6-digit PIN code or location name"
                  aria-label="Enter PIN code or location name"
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#FFFDF9] border-2 border-gold/40 text-imperial text-sm sm:text-base font-medium placeholder:text-cocoa-muted/60 focus:outline-hidden focus:border-imperial focus:ring-2 focus:ring-gold/30 transition-all shadow-inner"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleResetSearch}
                    aria-label="Clear search input"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-cocoa-muted hover:text-imperial transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSearching || !searchInput.trim()}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-imperial via-imperial to-imperial-dark text-gold font-bold text-sm tracking-wide shadow-gold hover:shadow-royal hover:from-imperial-dark hover:to-imperial disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span>Check Route</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Search Examples */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs text-cocoa-muted">
              <span className="font-bold text-imperial/70">Examples:</span>
              {SEARCH_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => handleExampleClick(ex)}
                  className="px-2 py-0.5 rounded-md bg-ivory border border-gold/25 hover:border-gold hover:text-imperial hover:bg-gold/10 transition-colors cursor-pointer"
                >
                  {ex}
                </button>
              ))}
            </div>
          </form>

          {/* Popular Delivery Locations Chips */}
          <div className="pt-4 border-t border-gold/20">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-3.5 h-3.5 text-gold-deep" />
              <span className="text-xs font-bold uppercase tracking-wider text-imperial">
                Popular Delivery Locations
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {POPULAR_LOCATIONS.map((loc) => {
                const isSelected = activeChip === loc.pin;
                return (
                  <button
                    key={loc.pin}
                    type="button"
                    onClick={() => handleChipClick(loc.pin, loc.label)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-imperial text-gold border-imperial shadow-md ring-2 ring-gold/40 scale-102'
                        : 'bg-cream/60 hover:bg-cream text-imperial border-gold/30 hover:border-gold shadow-xs'
                    }`}
                  >
                    <span>{loc.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-gold/20 text-gold-light' : 'bg-gold/15 text-gold-deep'
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
            <div className="mt-8 pt-6 border-t-2 border-gold/30 animate-fadeIn">
              {/* If multiple results matched from a general text search */}
              {multiResults.length > 1 && (
                <div className="mb-4">
                  <div className="text-xs text-cocoa-muted font-bold mb-2">
                    Found {multiResults.length} matching locations for your search:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {multiResults.map((r) => (
                      <button
                        key={r.pincode + (r.city || '')}
                        type="button"
                        onClick={() => handleSelectMultiResult(r)}
                        className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                          searchResult.pincode === r.pincode
                            ? 'bg-imperial text-gold border-imperial font-bold'
                            : 'bg-white hover:bg-cream text-imperial border-gold/30'
                        }`}
                      >
                        {r.city} ({r.pincode}) — {r.district}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Result Detail Card */}
              <div className="rounded-2xl border border-gold/40 bg-radial-royal text-white p-5 sm:p-7 shadow-royal relative overflow-hidden">
                <div className="relative z-10 space-y-5">
                  {/* Status Banner & Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gold font-bold">
                        {searchResult.state || 'Odisha'} • {searchResult.district || 'Regional Network'}
                      </div>
                      <h4 className="text-xl sm:text-2xl font-display font-extrabold text-warm-ivory mt-0.5">
                        {searchResult.city || searchResult.pincode}
                        {searchResult.pincode && searchResult.pincode !== '------' && (
                          <span className="ml-2 font-mono text-base font-normal text-gold">
                            ({searchResult.pincode})
                          </span>
                        )}
                      </h4>
                    </div>
                    <div>
                      {renderStatusBadge(searchResult.serviceability_status)}
                    </div>
                  </div>

                  {/* Localities / Coverage Villages */}
                  {searchResult.localities && searchResult.localities.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-xs">
                      <span className="text-gold font-bold">Covered Localities / Villages: </span>
                      <span className="text-warm-ivory/85">
                        {searchResult.localities.slice(0, 8).join(', ')}
                        {searchResult.localities.length > 8 && ` +${searchResult.localities.length - 8} more`}
                      </span>
                    </div>
                  )}

                  {/* 3-Column Logistics Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Delivery Time */}
                    <div className="bg-white/5 rounded-xl p-3.5 border border-white/10">
                      <div className="flex items-center gap-1.5 text-gold text-xs font-bold mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Transit Duration</span>
                      </div>
                      <div className="text-sm font-bold text-white">
                        {searchResult.transit_duration_label ||
                          `${searchResult.min_delivery_days || 1}–${searchResult.max_delivery_days || 2} Days`}
                      </div>
                      <div className="text-[11px] text-warm-ivory/60 mt-0.5">
                        From Paralakhemundi kitchen
                      </div>
                    </div>

                    {/* Transport Modes */}
                    <div className="bg-white/5 rounded-xl p-3.5 border border-white/10">
                      <div className="flex items-center gap-1.5 text-gold text-xs font-bold mb-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Available Transport</span>
                      </div>
                      <div className="text-xs font-medium text-white space-y-0.5">
                        {(searchResult.transport_modes && searchResult.transport_modes.length > 0)
                          ? searchResult.transport_modes.slice(0, 2).join(' • ')
                          : 'State Roadlines & Bus Cargo'}
                      </div>
                      <div className="text-[11px] text-warm-ivory/60 mt-0.5">
                        Daily regional dispatch
                      </div>
                    </div>

                    {/* Wholesale Carton Freight */}
                    <div className="bg-white/5 rounded-xl p-3.5 border border-white/10">
                      <div className="flex items-center gap-1.5 text-gold text-xs font-bold mb-1">
                        <Package className="w-3.5 h-3.5" />
                        <span>Wholesale Carton Rate</span>
                      </div>
                      <div className="text-sm font-bold text-white">
                        {searchResult.delivery_charges_text ||
                          (searchResult.standard_shipping_rate
                            ? `₹${searchResult.standard_shipping_rate} / carton`
                            : 'Custom Freight Quote')}
                      </div>
                      <div className="text-[11px] text-warm-ivory/60 mt-0.5">
                        {searchResult.cod_available ? 'COD Available' : 'Direct Dispatch Invoice'}
                      </div>
                    </div>
                  </div>

                  {/* Route Message & Explanation */}
                  {searchResult.message && (
                    <p className="text-xs text-warm-ivory/80 leading-relaxed bg-black/20 rounded-xl p-3 border border-white/5">
                      {searchResult.message}
                    </p>
                  )}

                  {/* Action Buttons: WhatsApp & Full Coverage Link */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    {searchResult.whatsapp_url ? (
                      <a
                        href={searchResult.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-emerald" />
                        <span>Instant WhatsApp Transit Enquiry</span>
                      </a>
                    ) : (
                      <a
                        href={`https://wa.me/919861789602?text=${encodeURIComponent(
                          `🚚 *DELIVERY INQUIRY – SRI BALAJI*\nPIN: ${searchResult.pincode} (${searchResult.city})\nPlease confirm road transport schedule.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-emerald" />
                        <span>Chat with Wholesale Dispatch Desk</span>
                      </a>
                    )}

                    <Link
                      to="/delivery-coverage"
                      className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-light font-bold transition-colors"
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
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-gold/30 shadow-xs text-xs">
            <span className="flex items-center gap-1.5 text-imperial font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald" />
              <span>Are you a Kirana Store, Supermarket, or Tea Stall Owner?</span>
            </span>
            <Link
              to="/wholesale"
              className="inline-flex items-center gap-1 text-gold-deep hover:text-gold font-extrabold uppercase tracking-wider transition-colors"
            >
              <span>Apply for Direct Factory Wholesale Pricing</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
