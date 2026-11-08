import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  PhoneCall, 
  MessageCircle, 
  Building2, 
  Compass, 
  Clock, 
  IndianRupee, 
  Layers, 
  ShieldCheck, 
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';
import { apiService, PincodeCheckResult, CoverageHierarchyResponse, CoverageStateItem, CoverageDistrictItem } from '../../services/api';

interface RegionalDeliveryCoverageProps {
  embedded?: boolean;
  initialPin?: string;
}

export const RegionalDeliveryCoverage: React.FC<RegionalDeliveryCoverageProps> = ({ 
  embedded = false,
  initialPin = '' 
}) => {
  const [searchInput, setSearchInput] = useState(initialPin);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<PincodeCheckResult | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Hierarchy Navigation
  const [hierarchy, setHierarchy] = useState<CoverageHierarchyResponse | null>(null);
  const [selectedState, setSelectedState] = useState<string>('Odisha');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Gajapati');
  const [loadingHierarchy, setLoadingHierarchy] = useState(false);

  // Load hierarchy tree once on mount
  useEffect(() => {
    let isMounted = true;
    setLoadingHierarchy(true);
    apiService.getCoverageHierarchy()
      .then((data) => {
        if (isMounted) {
          setHierarchy(data);
          if (data.states && data.states.length > 0) {
            setSelectedState(data.states[0].state_name);
            if (data.states[0].districts && data.states[0].districts.length > 0) {
              setSelectedDistrict(data.states[0].districts[0].district_name);
            }
          }
        }
      })
      .catch((err) => console.error('Failed to load coverage hierarchy', err))
      .finally(() => {
        if (isMounted) setLoadingHierarchy(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Handle instant or form search
  const executeSearch = async (query: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    if (isSearching) return; // Prevent duplicate requests

    setIsSearching(true);
    setHasSearched(true);
    setSelectedResult(null); // Clear previous result
    setSearchResults([]);

    try {
      // Check if it's a 6-digit PIN code
      if (/^\d{6}$/.test(cleanQuery)) {
        const pinRes = await apiService.checkPincodeServiceability(cleanQuery);
        setSelectedResult(pinRes);
        setSearchResults([pinRes]);
      } else {
        // Multi-attribute search by village, town, district, or state
        const searchRes = await apiService.searchLogisticsLocations(cleanQuery);
        if (searchRes.results && searchRes.results.length > 0) {
          setSearchResults(searchRes.results);
          setSelectedResult(searchRes.results[0]);
        } else {
          // Fallback if not found in database
          setSelectedResult({
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
            message: `Delivery is currently unavailable on automated scheduled routes for "${cleanQuery}". Direct custom road transit and bulk wholesale cartons can be arranged manually via our WhatsApp desk at +91 98617 89602.`,
            whatsapp_url: `https://wa.me/919861789602?text=${encodeURIComponent(`🚚 *DELIVERY ENQUIRY – SRI BALAJI*\nLocation: ${cleanQuery}\nPlease advise transport availability and wholesale freight quote.`)}`
          });
        }
      }
    } catch {
      setSelectedResult({
        pincode: cleanQuery,
        is_serviceable: false,
        serviceability_status: 'PENDING_VERIFICATION',
        status_label: 'Route Verification Required',
        min_delivery_days: 2,
        max_delivery_days: 4,
        standard_shipping_rate: 0,
        cod_available: false,
        daily_transit_available: false,
        message: 'Could not connect to live routing network. Please call wholesale desk at +91 98617 89602.'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchInput);
  };

  const handleSelectLocation = (loc: any) => {
    setSearchInput(loc.pincode);
    setSelectedResult({
      pincode: loc.pincode,
      is_serviceable: loc.serviceability_status === 'REGULAR',
      serviceability_status: loc.serviceability_status,
      status_label: loc.status_label,
      city: loc.city,
      district: loc.district || selectedDistrict,
      state: loc.state || selectedState,
      localities: loc.localities || [],
      transport_modes: loc.transport_modes || [],
      transit_duration_label: loc.transit_duration_label,
      min_delivery_days: loc.min_delivery_days || 1,
      max_delivery_days: loc.max_delivery_days || 3,
      standard_shipping_rate: loc.standard_shipping_rate || 0,
      delivery_charges_text: loc.delivery_charges_text,
      cod_available: loc.cod_available !== undefined ? loc.cod_available : true,
      daily_transit_available: loc.daily_transit_available !== undefined ? loc.daily_transit_available : true,
      delivery_conditions: loc.delivery_conditions,
      message: loc.serviceability_status === 'CUSTOM_TRANSIT' 
        ? "Custom Transit Arrangement Required. Please contact our Wholesale Desk at +91 98617 89602."
        : loc.serviceability_status === 'REGULAR'
        ? `Regular Delivery Available: Supported scheduled road transport via factory dispatch routes.`
        : "Coverage verification required.",
      whatsapp_url: loc.whatsapp_url || `https://wa.me/919861789602?text=${encodeURIComponent(`🚚 *DELIVERY ENQUIRY – SRI BALAJI*\nPIN: ${loc.pincode} (${loc.city}, ${selectedDistrict})\nPlease advise transport schedule.`)}`
    });
    setHasSearched(true);
  };

  // Current active district locations in browser
  const currentStateObj = hierarchy?.states.find((s) => s.state_name === selectedState);
  const currentDistrictObj = currentStateObj?.districts.find((d) => d.district_name === selectedDistrict);

  // Status Badge Helper
  const renderStatusBadge = (status?: string) => {
    const s = (status || 'REGULAR').toUpperCase();
    switch (s) {
      case 'REGULAR':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Regular Delivery Available</span>
          </span>
        );
      case 'CUSTOM_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Custom Transit Available</span>
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Serviceability Pending</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
            <XCircle className="w-3.5 h-3.5 text-gray-500" />
            <span>Currently Unavailable</span>
          </span>
        );
    }
  };

  return (
    <div className={`space-y-8 ${embedded ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'}`}>
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial-royal border border-gold/30 shadow-royal p-6 sm:p-10 text-white">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Truck className="w-4 h-4 text-gold" />
            <span>Paralakhemundi Central Dispatch • 30 Years Logistics Network</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-warm-ivory tracking-tight">
            Regional Road Transport Coverage
          </h2>
          <p className="text-sm text-warm-ivory/80 leading-relaxed max-w-2xl">
            Check verified delivery serviceability across <strong>all 30 Odisha districts</strong>, the <strong>Paralakhemundi corridor</strong>, and <strong>neighbouring Andhra Pradesh border mandals</strong> (Srikakulam, Pathapatnam, Palasa, Tekkali).
          </p>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-warm-ivory">
              📍 85+ Direct Route Hubs
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-warm-ivory">
              🚌 State Roadlines &amp; Bus Cargo
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-warm-ivory">
              🚐 Daily Regional Tempos
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-warm-ivory">
              📦 Full Carton Wholesale Dispatch
            </span>
          </div>
        </div>

        {/* Decorative corner embellishment */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
          <Compass className="w-72 h-72 text-gold" />
        </div>
      </div>

      {/* SEARCH BAR & PIN INPUT */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#D6A52D]/40 shadow-soft p-5 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#28143F] flex items-center gap-2">
            <Search className="w-5 h-5 text-[#D6A52D]" />
            <span>Check Delivery Availability</span>
          </h3>
          <p className="text-sm text-[#3B2D27] font-semibold leading-relaxed">
            Enter your PIN code, village, town, or district to check whether your location is covered by our delivery network.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#D6A52D]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter PIN code, village, town, or district..."
              className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl border-2 border-[#D6A52D]/60 bg-white focus:border-[#28143F] focus:ring-2 focus:ring-[#D6A52D]/30 outline-none text-sm sm:text-base font-bold text-[#28143F] placeholder:text-[#7C6A5A] transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchInput.trim()}
            className="px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#28143F] via-[#351B54] to-[#1E0D30] text-[#F4C45E] font-sans font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-royal disabled:opacity-50 cursor-pointer"
          >
            {isSearching ? <span className="animate-spin text-base">⏳</span> : <Search className="w-4 h-4 text-[#F4C45E]" />}
            <span>Check Route</span>
          </button>
        </form>

        {/* Popular Quick Chips */}
        <div className="pt-2 border-t border-[#D6A52D]/20 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-xs font-black text-[#28143F] uppercase tracking-wider">Popular Locations:</span>
          {[
            { label: 'Paralakhemundi', q: '761200' },
            { label: 'Pathapatnam', q: '532201' },
            { label: 'Palasa / Kasibugga', q: '532221' },
            { label: 'Gunupur Main', q: '765017' },
            { label: 'Gunupur Rural', q: '765022' },
            { label: 'Berhampur', q: '760001' },
            { label: 'Srikakulam Town', q: '532001' },
            { label: 'Bhubaneswar', q: '751001' },
          ].map((chip) => (
            <button
              key={chip.q}
              type="button"
              onClick={() => {
                setSearchInput(chip.q);
                executeSearch(chip.q);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-[#D6A52D]/40 hover:border-[#28143F] text-[#28143F] hover:text-[#28143F] font-bold text-xs transition-colors cursor-pointer shadow-2xs"
            >
              <span>{chip.label}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#28143F]/10 text-[#28143F] font-black">
                {chip.q}
              </span>
            </button>
          ))}
        </div>

        {/* MULTIPLE SEARCH RESULTS LIST (When search term matches multiple locations) */}
        {searchResults.length > 1 && (
          <div className="pt-2 border-t border-ivory-border space-y-2">
            <span className="text-xs font-bold text-cocoa-muted">
              Found {searchResults.length} matching locations. Click to view transport details:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {searchResults.map((r, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedResult(r)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    selectedResult?.pincode === r.pincode
                      ? 'bg-gold-light/40 border-gold shadow-xs'
                      : 'bg-cream/30 border-ivory-border hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-imperial">
                    <span>{r.city}</span>
                    <span className="font-mono text-gold-deep">{r.pincode}</span>
                  </div>
                  <div className="text-[11px] text-cocoa-muted truncate mt-0.5">
                    {r.district}, {r.state}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DETAILED RESULT CARD */}
        {hasSearched && selectedResult && (
          <div className="pt-4 border-t border-ivory-border animate-fadeIn space-y-5">
            <div className={`p-6 rounded-3xl border transition-all ${
              selectedResult.serviceability_status === 'REGULAR'
                ? 'bg-emerald-50/60 border-emerald-200'
                : selectedResult.serviceability_status === 'CUSTOM_TRANSIT'
                ? 'bg-amber-50/80 border-amber-300'
                : selectedResult.serviceability_status === 'PENDING_VERIFICATION'
                ? 'bg-blue-50/70 border-blue-200'
                : 'bg-gray-50/80 border-gray-300'
            }`}>
              
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-xl text-imperial">
                      PIN {selectedResult.pincode}
                    </span>
                    {renderStatusBadge(selectedResult.serviceability_status)}
                  </div>
                  <h4 className="font-serif font-black text-lg text-imperial">
                    {selectedResult.city || 'Regional Area'}, {selectedResult.district || 'Odisha'} ({selectedResult.state || 'Odisha'})
                  </h4>
                  {selectedResult.zone_name && (
                    <span className="text-xs text-cocoa-muted font-medium flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-gold-deep" />
                      <span>Route: {selectedResult.zone_name}</span>
                    </span>
                  )}
                </div>

                {/* WhatsApp Enquiry Button */}
                <a
                  href={selectedResult.whatsapp_url || `https://wa.me/919861789602`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald hover:bg-emerald-deep text-white font-bold text-xs uppercase tracking-wider shadow-soft transition-transform hover:scale-102 cursor-pointer self-start sm:self-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire Route via WhatsApp</span>
                </a>
              </div>

              {/* Status Message Highlight */}
              <div className="py-3">
                <p className="text-xs sm:text-sm font-semibold text-cocoa leading-relaxed">
                  {selectedResult.message}
                </p>
              </div>

              {/* Grid of Key Logistics Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                <div className="bg-white/90 p-3.5 rounded-2xl border border-black/5 shadow-xs space-y-1">
                  <span className="text-cocoa-muted text-[10px] uppercase font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-deep" />
                    <span>Est. Transit</span>
                  </span>
                  <strong className="text-imperial text-xs font-black block">
                    {selectedResult.transit_duration_label || `${selectedResult.min_delivery_days} - ${selectedResult.max_delivery_days} Days`}
                  </strong>
                </div>

                <div className="bg-white/90 p-3.5 rounded-2xl border border-black/5 shadow-xs space-y-1">
                  <span className="text-cocoa-muted text-[10px] uppercase font-bold flex items-center gap-1">
                    <IndianRupee className="w-3 h-3 text-emerald" />
                    <span>Freight Charges</span>
                  </span>
                  <strong className="text-emerald-deep text-xs font-black block">
                    {selectedResult.delivery_charges_text || `₹${selectedResult.standard_shipping_rate} / carton`}
                  </strong>
                </div>

                <div className="bg-white/90 p-3.5 rounded-2xl border border-black/5 shadow-xs space-y-1">
                  <span className="text-cocoa-muted text-[10px] uppercase font-bold flex items-center gap-1">
                    <Truck className="w-3 h-3 text-blue-600" />
                    <span>Daily Transit</span>
                  </span>
                  <strong className="text-imperial text-xs font-black block">
                    {selectedResult.daily_transit_available ? 'Daily Scheduled Route' : 'Custom Transit Quote'}
                  </strong>
                </div>

                <div className="bg-white/90 p-3.5 rounded-2xl border border-black/5 shadow-xs space-y-1">
                  <span className="text-cocoa-muted text-[10px] uppercase font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-purple-600" />
                    <span>Payment Mode</span>
                  </span>
                  <strong className="text-imperial text-xs font-black block">
                    {selectedResult.cod_available ? 'COD & Prepaid Available' : 'Prepaid / Wholesale Account'}
                  </strong>
                </div>
              </div>

              {/* Supported Transport Methods for this Location */}
              {selectedResult.transport_modes && selectedResult.transport_modes.length > 0 && (
                <div className="pt-4 space-y-1.5">
                  <span className="text-[11px] font-bold text-cocoa uppercase tracking-wider block">
                    Supported Transport Modes:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {selectedResult.transport_modes.map((mode, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-black/10 text-imperial font-medium text-[11px] shadow-2xs"
                      >
                        <Truck className="w-3 h-3 text-gold-deep" />
                        <span>{mode}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Associated Villages and Localities */}
              {selectedResult.localities && selectedResult.localities.length > 0 && (
                <div className="pt-3 space-y-1.5">
                  <span className="text-[11px] font-bold text-cocoa uppercase tracking-wider block">
                    Covered Villages, Mandals &amp; Landmarks ({selectedResult.localities.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {selectedResult.localities.map((loc, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg bg-white/70 border border-black/5 text-cocoa text-[11px]"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Conditions */}
              {selectedResult.delivery_conditions && (
                <div className="pt-3 text-[11px] text-cocoa-muted border-t border-black/5">
                  <strong>Delivery Conditions:</strong> {selectedResult.delivery_conditions}
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* INTERACTIVE DISTRICT & LOCALITY DIRECTORY */}
      <div className="bg-white rounded-3xl border border-ivory-border shadow-soft p-5 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-border pb-4">
          <div>
            <h3 className="font-serif font-black text-xl text-imperial flex items-center gap-2">
              <Compass className="w-5 h-5 text-gold-deep" />
              <span>Browse Regional Districts &amp; Localities</span>
            </h3>
            <p className="text-xs text-cocoa-muted">
              Select a state and district to explore mapped delivery routes and nearby villages.
            </p>
          </div>

          {/* State Switcher Tabs */}
          <div className="inline-flex rounded-2xl bg-cream p-1 border border-ivory-border self-start sm:self-center">
            {hierarchy?.states.map((s) => (
              <button
                key={s.state_name}
                type="button"
                onClick={() => {
                  setSelectedState(s.state_name);
                  if (s.districts && s.districts.length > 0) {
                    setSelectedDistrict(s.districts[0].district_name);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedState === s.state_name
                    ? 'bg-imperial text-gold shadow-royal'
                    : 'text-cocoa hover:text-imperial'
                }`}
              >
                {s.state_name} ({s.districts_count} Districts)
              </button>
            ))}
          </div>
        </div>

        {/* District Selector Tabs */}
        {currentStateObj && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {currentStateObj.districts.map((d) => (
                <button
                  key={d.district_name}
                  type="button"
                  onClick={() => setSelectedDistrict(d.district_name)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                    selectedDistrict === d.district_name
                      ? 'bg-gold-light border-gold text-imperial font-black shadow-xs'
                      : 'bg-cream/40 border-ivory-border text-cocoa hover:border-gold/40'
                  }`}
                >
                  <span>{d.district_name}</span>
                  <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/80 text-imperial font-mono">
                    {d.locations_count}
                  </span>
                </button>
              ))}
            </div>

            {/* Current District Locations Directory */}
            {currentDistrictObj && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-cocoa-muted">
                  <span>
                    Showing {currentDistrictObj.locations.length} mapped hubs in <strong>{currentDistrictObj.district_name}</strong>, {selectedState}:
                  </span>
                  <span className="text-[11px] text-gold-deep font-semibold">
                    Click any location card to check full route details
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentDistrictObj.locations.map((loc) => {
                    const isSelected = selectedResult?.pincode === loc.pincode;
                    return (
                      <div
                        key={loc.pincode}
                        onClick={() => handleSelectLocation(loc)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 group hover:shadow-soft ${
                          isSelected
                            ? 'bg-gold-light/40 border-gold shadow-royal'
                            : 'bg-cream/20 border-ivory-border hover:border-gold/50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-imperial font-serif font-black text-sm group-hover:text-gold-deep transition-colors">
                            {loc.city}
                          </span>
                          <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white border border-ivory-border text-imperial font-bold">
                            {loc.pincode}
                          </span>
                        </div>

                        {/* Status Label */}
                        <div className="pt-0.5">
                          {renderStatusBadge(loc.serviceability_status)}
                        </div>

                        {/* Localities snippet */}
                        {loc.localities && loc.localities.length > 0 && (
                          <div className="text-[11px] text-cocoa-muted line-clamp-2">
                            <strong>Villages:</strong> {loc.localities.join(', ')}
                          </div>
                        )}

                        {/* Footer specs */}
                        <div className="flex items-center justify-between pt-2 border-t border-ivory-border/60 text-[11px] text-cocoa font-medium">
                          <span>⏱️ {loc.transit_duration_label || '1-2 Days'}</span>
                          <span className="text-emerald-deep font-bold">
                            {loc.delivery_charges_text || `₹${loc.standard_shipping_rate || 40}/carton`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wholesale & Custom Transit Helpline Callout */}
      <div className="rounded-3xl bg-cream/70 border border-gold/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-light text-imperial font-bold text-xs">
            <Building2 className="w-3.5 h-3.5 text-gold-deep" />
            <span>Sri Balaji Wholesale Transport Desk</span>
          </div>
          <h4 className="font-display font-extrabold text-lg text-imperial">
            Need Bulk Transit to an Unlisted Village or Mandal?
          </h4>
          <p className="text-xs text-cocoa-muted max-w-xl">
            We partner with regional tempos, bus lines, and transport agencies to deliver full-carton snack orders across Eastern India. Call or WhatsApp our dispatch coordinator directly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:+919861789602"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-ivory-border hover:border-gold text-imperial font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
          >
            <PhoneCall className="w-4 h-4 text-gold-deep" />
            <span>+91 98617 89602</span>
          </a>
          <a
            href={`https://wa.me/919861789602?text=${encodeURIComponent("Namaste Sri Balaji Team, I would like to request custom transport arrangements for wholesale snack delivery.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald hover:bg-emerald-deep text-white font-bold text-xs uppercase tracking-wider transition-all shadow-soft"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Transit Desk</span>
          </a>
        </div>
      </div>

    </div>
  );
};

