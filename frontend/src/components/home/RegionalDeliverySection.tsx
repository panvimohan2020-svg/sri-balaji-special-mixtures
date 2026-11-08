import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCcw,
  IndianRupee,
  PhoneCall,
  Sparkles,
  Building2,
  Filter,
} from 'lucide-react';
import {
  apiService,
  PincodeCheckResult,
  OdishaDistrictOverview,
} from '../../services/api';
import {
  REGIONAL_LOCATION_GROUPS,
  ODISHA_30_DISTRICTS_DATA,
} from '../../data/regionalCoverageData';

// Quick Search Examples for instant testing
const SEARCH_EXAMPLES = [
  '761200',
  '761208',
  '532201',
  '532001',
  'Ranipeta',
  'Kasinagar',
  'Palasa',
  'Tekkali',
  'Gajapati',
  'Gunupur',
  'Berhampur',
  'Angul',
];

export const RegionalDeliverySection: React.FC = () => {
  // Search State
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<PincodeCheckResult | null>(null);
  const [multiResults, setMultiResults] = useState<PincodeCheckResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  // Autocomplete Suggestions State
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<any[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Popular Nearby Locations Grouping State
  const [activeLocationGroup, setActiveLocationGroup] = useState<
    'nearby_odisha' | 'andhra_pradesh' | 'regional_towns' | 'all'
  >('nearby_odisha');

  // Odisha 30 Districts Overview State
  const [odishaDistricts, setOdishaDistricts] = useState<OdishaDistrictOverview[]>(
    ODISHA_30_DISTRICTS_DATA
  );
  const [isOdishaExpanded, setIsOdishaExpanded] = useState(false);
  const [districtSearchQuery, setDistrictSearchQuery] = useState('');
  const [districtStatusFilter, setDistrictStatusFilter] = useState<'ALL' | 'REGULAR' | 'SPECIAL'>('ALL');

  // Fetch live Odisha districts overview on mount
  useEffect(() => {
    let isMounted = true;
    apiService
      .getOdishaDistrictsOverview()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setOdishaDistricts(data);
        }
      })
      .catch((err) => {
        console.warn('Using static fallback for 30 Odisha districts overview:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Debounced Autocomplete Search
  useEffect(() => {
    const clean = searchInput.trim();
    if (clean.length < 2) {
      setAutocompleteSuggestions([]);
      setShowAutocomplete(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsFetchingSuggestions(true);
      try {
        const suggestions = await apiService.getAutocompleteLocations(clean);
        setAutocompleteSuggestions(suggestions);
        setShowAutocomplete(suggestions.length > 0);
      } catch (e) {
        setAutocompleteSuggestions([]);
      } finally {
        setIsFetchingSuggestions(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Click outside to dismiss autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Main Search Execution
  const executeSearch = async (query: string, chipPin?: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    if (isSearching) return;

    setShowAutocomplete(false);
    setIsSearching(true);
    setHasSearched(true);
    setSearchResult(null);
    setMultiResults([]);

    try {
      // 1. If 6-digit Indian PIN code
      if (/^\d{6}$/.test(cleanQuery)) {
        const pinRes = await apiService.checkPincodeServiceability(cleanQuery);
        setSearchResult(pinRes);
        setMultiResults([pinRes]);
      } else {
        // 2. Multi-attribute query (village, mandal, town, city, district)
        const searchRes = await apiService.searchLogisticsLocations(cleanQuery);
        if (searchRes.results && searchRes.results.length > 0) {
          setMultiResults(searchRes.results);
          setSearchResult(searchRes.results[0]);
        } else {
          // Fallback if not found in database
          const fallbackResult: PincodeCheckResult = {
            pincode: cleanQuery,
            is_serviceable: false,
            serviceability_status: 'UNAVAILABLE',
            status_label: 'Currently Unavailable',
            city: cleanQuery,
            district: 'Outside Scheduled Routes',
            state: 'Regional Corridor',
            min_delivery_days: 2,
            max_delivery_days: 4,
            standard_shipping_rate: 0,
            delivery_charges_text: 'Custom Freight Quote',
            cod_available: false,
            daily_transit_available: false,
            message: `Delivery is currently unavailable on automated daily routes for "${cleanQuery}". However, private roadline cargo, state bus parcels, or bulk wholesale carton transit can be arranged directly via our Paralakhemundi dispatch desk.`,
            whatsapp_url: `https://wa.me/919861789602?text=${encodeURIComponent(
              `🚚 *REGIONAL TRANSIT ENQUIRY – SRI BALAJI*\nLocation: ${cleanQuery}\nPlease advise transport availability, nearest cargo hub, and carton dispatch quote.`
            )}`,
          };
          setSearchResult(fallbackResult);
          setMultiResults([]);
        }
      }

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch {
      setSearchResult({
        pincode: cleanQuery,
        is_serviceable: false,
        serviceability_status: 'PENDING_VERIFICATION',
        status_label: 'Route Verification Required',
        city: cleanQuery,
        district: 'Regional Dispatch Area',
        state: 'Odisha / Andhra Pradesh',
        min_delivery_days: 1,
        max_delivery_days: 3,
        standard_shipping_rate: 0,
        cod_available: false,
        daily_transit_available: false,
        message:
          'Could not connect to live route dispatcher. Please confirm route directly with Sri Balaji Dispatch Desk at +91 98617 89602.',
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

  const handleSelectSuggestion = (suggestion: any) => {
    const value = suggestion.pincode || suggestion.city;
    setSearchInput(value);
    setActiveChip(suggestion.pincode);
    executeSearch(value, suggestion.pincode);
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

  const handleDistrictClick = (district: OdishaDistrictOverview) => {
    const query = district.primary_pincode || district.district_name;
    setSearchInput(query);
    setActiveChip(district.primary_pincode);
    executeSearch(query, district.primary_pincode);
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
    setShowAutocomplete(false);
  };

  // Status Badge Helper
  const renderStatusBadge = (status?: string) => {
    const s = (status || 'REGULAR').toUpperCase();
    switch (s) {
      case 'REGULAR':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Regular Delivery Available</span>
          </span>
        );
      case 'CUSTOM_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border-2 border-amber-400 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Custom Transit Available</span>
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border-2 border-blue-400 shadow-sm">
            <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Route Verification Required</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border-2 border-rose-400 shadow-sm">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Currently Unavailable</span>
          </span>
        );
    }
  };

  // Filter 30 districts for the interactive district section
  const filteredDistricts = odishaDistricts.filter((d) => {
    const matchesSearch =
      districtSearchQuery.trim() === '' ||
      d.district_name.toLowerCase().includes(districtSearchQuery.toLowerCase()) ||
      d.hub_city.toLowerCase().includes(districtSearchQuery.toLowerCase()) ||
      d.primary_pincode.includes(districtSearchQuery.trim());

    if (!matchesSearch) return false;

    if (districtStatusFilter === 'REGULAR') {
      return d.serviceability_status === 'REGULAR';
    }
    if (districtStatusFilter === 'SPECIAL') {
      return d.serviceability_status !== 'REGULAR';
    }
    return true;
  });

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#F5EFE3] border-b-2 border-[#D6A52D]/30 relative overflow-hidden">
      {/* Background Decorative Patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D6A52D]/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#28143F]/5 rounded-full blur-3xl pointer-events-none -ml-40 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#28143F]/10 border border-[#D6A52D]/50 text-[#28143F] text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
            <Truck className="w-3.5 h-3.5 text-[#D6A52D]" />
            <span>PARALAKHEMUNDI CENTRAL DISPATCH • 30 ODISHA DISTRICTS &amp; AP CORRIDOR</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#28143F] tracking-tight leading-tight mb-4">
            From Our Kitchen to Your Doorstep
          </h2>

          {/* Description */}
          <p className="font-serif text-base sm:text-lg text-[#3B2D27] font-semibold max-w-2xl mx-auto leading-relaxed">
            Check delivery serviceability across all 30 Odisha districts, the central Paralakhemundi corridor, and neighbouring Andhra Pradesh border towns.
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
                90+ Direct Route Hubs
              </div>
              <p className="text-[#3B2D27] font-semibold text-xs mt-1 leading-snug">
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
              <p className="text-[#3B2D27] font-semibold text-xs mt-1 leading-snug">
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
              <p className="text-[#3B2D27] font-semibold text-xs mt-1 leading-snug">
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
              <p className="text-[#3B2D27] font-semibold text-xs mt-1 leading-snug">
                Cost-effective ₹30–₹50 flat carton freight for retail kiranas &amp; shops
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN INTERACTIVE DELIVERY SEARCH BOX CARD                 */}
        {/* ======================================================== */}
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#D6A52D]/50 shadow-royal p-6 sm:p-10 max-w-4xl mx-auto mb-14">
          
          {/* Card Header */}
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#28143F] tracking-tight leading-tight">
              Check Delivery Availability
            </h3>
            <p className="text-[#3B2D27] font-bold text-sm sm:text-base mt-2 leading-relaxed">
              Enter your PIN code, village, town, district, or mandal to check whether your location is covered by our delivery network.
            </p>
          </div>

          {/* Search Input with Autocomplete Dropdown */}
          <div ref={searchContainerRef} className="relative max-w-2xl mx-auto mb-5">
            <form onSubmit={handleFormSubmit}>
              <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-[#D6A52D]" />
                  </div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onFocus={() => {
                      if (autocompleteSuggestions.length > 0) setShowAutocomplete(true);
                    }}
                    placeholder="Enter PIN code, village, town, district, or mandal (e.g. 761200, Serango, Pathapatnam)..."
                    aria-label="Enter PIN code, village, town, or district"
                    className="w-full pl-12 pr-11 py-3.5 sm:py-4 rounded-2xl bg-white border-2 border-[#D6A52D]/60 text-[#28143F] text-sm sm:text-base font-bold placeholder:text-[#7C6A5A] placeholder:font-medium focus:outline-none focus:border-[#28143F] focus:ring-3 focus:ring-[#D6A52D]/30 transition-all shadow-inner"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      aria-label="Clear search input"
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7C6A5A] hover:text-[#28143F] transition-colors cursor-pointer"
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
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {showAutocomplete && autocompleteSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-[#D6A52D]/60 shadow-2xl z-50 overflow-hidden divide-y divide-[#D6A52D]/20 animate-fadeIn">
                <div className="px-4 py-2 bg-[#FAF5EC] text-[11px] font-black uppercase tracking-wider text-[#28143F] flex items-center justify-between">
                  <span>Suggested Locations ({autocompleteSuggestions.length})</span>
                  {isFetchingSuggestions && <Loader2 className="w-3 h-3 animate-spin text-[#D6A52D]" />}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {autocompleteSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full text-left px-4 py-3 hover:bg-[#F4C45E]/15 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-extrabold text-[#28143F] group-hover:text-[#D6A52D] transition-colors truncate">
                          {item.display_label}
                        </div>
                        <div className="text-xs text-[#7C6A5A] font-medium flex items-center gap-2 mt-0.5">
                          <span>{item.district}, {item.state}</span>
                          <span className="font-mono font-bold text-[#28143F] bg-[#FAF5EC] px-1.5 py-0.5 rounded text-[11px]">
                            PIN {item.pincode}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {item.serviceability_status === 'REGULAR' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Serviceable</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Custom Route</span>
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Search Examples */}
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
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: PARALAKHEMUNDI & NEARBY REGIONAL LOCATIONS     */}
          {/* ======================================================== */}
          <div className="pt-6 border-t-2 border-[#D6A52D]/25">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D6A52D]" />
                <h4 className="text-base sm:text-lg font-display font-extrabold text-[#28143F]">
                  Paralakhemundi &amp; Nearby Regional Locations
                </h4>
              </div>

              {/* Group Selector Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF5EC] p-1 rounded-xl border border-[#D6A52D]/40 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveLocationGroup('nearby_odisha')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeLocationGroup === 'nearby_odisha'
                      ? 'bg-[#28143F] text-[#F4C45E] shadow-xs'
                      : 'text-[#3B2D27] hover:text-[#28143F]'
                  }`}
                >
                  Nearby Odisha (11)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLocationGroup('andhra_pradesh')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeLocationGroup === 'andhra_pradesh'
                      ? 'bg-[#28143F] text-[#F4C45E] shadow-xs'
                      : 'text-[#3B2D27] hover:text-[#28143F]'
                  }`}
                >
                  Andhra Pradesh (9)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLocationGroup('regional_towns')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeLocationGroup === 'regional_towns'
                      ? 'bg-[#28143F] text-[#F4C45E] shadow-xs'
                      : 'text-[#3B2D27] hover:text-[#28143F]'
                  }`}
                >
                  Regional Hubs (8)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLocationGroup('all')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeLocationGroup === 'all'
                      ? 'bg-[#28143F] text-[#F4C45E] shadow-xs'
                      : 'text-[#3B2D27] hover:text-[#28143F]'
                  }`}
                >
                  View All (28)
                </button>
              </div>
            </div>

            {/* Location Chips Display */}
            <div className="space-y-4">
              {REGIONAL_LOCATION_GROUPS.filter(
                (g) => activeLocationGroup === 'all' || g.groupKey === activeLocationGroup
              ).map((group) => (
                <div key={group.groupKey} className="bg-[#FAF5EC]/60 rounded-2xl p-4 border border-[#D6A52D]/30">
                  <div className="flex items-center justify-between mb-2.5 text-xs">
                    <span className="font-extrabold text-[#28143F] uppercase tracking-wider">
                      {group.groupName}
                    </span>
                    <span className="text-[#7C6A5A] font-medium hidden md:inline">
                      {group.description}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.locations.map((loc) => {
                      const isSelected = activeChip === loc.pin && searchInput.includes(loc.pin);
                      return (
                        <button
                          key={loc.label + loc.pin}
                          type="button"
                          onClick={() => handleChipClick(loc.pin, loc.label)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 cursor-pointer ${
                            isSelected
                              ? 'bg-[#28143F] text-[#F4C45E] border-[#28143F] shadow-royal ring-2 ring-[#D6A52D]/50 scale-102'
                              : 'bg-white hover:bg-[#FAF5EC] text-[#28143F] border-[#D6A52D]/50 hover:border-[#D6A52D] shadow-xs'
                          }`}
                        >
                          <span className="font-extrabold">{loc.label}</span>
                          <span
                            className={`text-[11px] font-mono font-black px-1.5 py-0.2 rounded-md ${
                              isSelected
                                ? 'bg-[#F4C45E] text-[#28143F]'
                                : 'bg-[#28143F]/10 text-[#28143F]'
                            }`}
                          >
                            {loc.pin}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 4: REDESIGNED PREMIUM DELIVERY SEARCH RESULT     */}
          {/* ======================================================== */}
          <div ref={resultsRef}>
            {hasSearched && searchResult && (
              <div className="mt-8 pt-6 border-t-2 border-[#D6A52D]/40 animate-fadeIn">
                
                {/* Multi-result options (if search term matched several towns) */}
                {multiResults.length > 1 && (
                  <div className="mb-4">
                    <div className="text-xs text-[#3B2D27] font-black uppercase tracking-wider mb-2">
                      Matching Routes Found ({multiResults.length}):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {multiResults.map((r, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectMultiResult(r)}
                          className={`text-xs px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer ${
                            searchResult.pincode === r.pincode && searchResult.city === r.city
                              ? 'bg-[#28143F] text-[#F4C45E] border-[#28143F] font-black shadow-xs'
                              : 'bg-white hover:bg-[#FAF5EC] text-[#28143F] border-[#D6A52D]/50 font-bold'
                          }`}
                        >
                          {r.city} ({r.pincode}) – {r.district}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary Premium Result Card */}
                <div className="rounded-3xl border-2 border-[#D6A52D]/60 bg-gradient-to-br from-[#190D2B] via-[#28143F] to-[#12081F] text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  
                  {/* Subtle Background Glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#D6A52D]/15 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 space-y-6">
                    
                    {/* Top Row: Location Title & Serviceability Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/15">
                      <div>
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#F4C45E] font-black">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>
                            {searchResult.district || 'Regional Hub'}, {searchResult.state || 'Odisha'}
                          </span>
                          {searchResult.zone_name && (
                            <span className="text-white/60">• {searchResult.zone_name}</span>
                          )}
                        </div>
                        <h4 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1 flex items-baseline gap-3">
                          <span>{searchResult.city || searchResult.pincode}</span>
                          {searchResult.pincode && searchResult.pincode !== '------' && (
                            <span className="font-mono text-xl sm:text-2xl font-black text-[#F4C45E]">
                              ({searchResult.pincode})
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="shrink-0">
                        {renderStatusBadge(searchResult.serviceability_status)}
                      </div>
                    </div>

                    {/* Explanatory Message */}
                    {searchResult.message && (
                      <div className="bg-black/35 rounded-2xl p-4 border border-white/10 text-xs sm:text-sm text-white/95 font-medium leading-relaxed">
                        {searchResult.message}
                      </div>
                    )}

                    {/* 4 Premium Logistics Metrics Information Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
                      
                      {/* 1. Transit Duration */}
                      <div className="bg-white/10 rounded-2xl p-4 border border-white/15 backdrop-blur-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-[#F4C45E] text-xs font-black uppercase tracking-wider mb-1.5">
                            <Clock className="w-4 h-4 text-[#F4C45E]" />
                            <span>Transit Duration</span>
                          </div>
                          <div className="text-base sm:text-lg font-black text-white leading-tight">
                            {searchResult.transit_duration_label ||
                              `${searchResult.min_delivery_days || 1}–${searchResult.max_delivery_days || 2} Days`}
                          </div>
                        </div>
                        <div className="text-[11px] text-white/70 mt-2 font-medium">
                          From Paralakhemundi kitchen
                        </div>
                      </div>

                      {/* 2. Transport Modes */}
                      <div className="bg-white/10 rounded-2xl p-4 border border-white/15 backdrop-blur-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-[#F4C45E] text-xs font-black uppercase tracking-wider mb-1.5">
                            <Truck className="w-4 h-4 text-[#F4C45E]" />
                            <span>Transport Mode</span>
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                            {searchResult.transport_modes && searchResult.transport_modes.length > 0
                              ? searchResult.transport_modes.slice(0, 2).join(' • ')
                              : 'State Roadlines & Bus Cargo'}
                          </div>
                        </div>
                        <div className="text-[11px] text-white/70 mt-2 font-medium">
                          Daily scheduled carrier
                        </div>
                      </div>

                      {/* 3. Wholesale Carton Freight Rate */}
                      <div className="bg-white/10 rounded-2xl p-4 border border-white/15 backdrop-blur-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-[#F4C45E] text-xs font-black uppercase tracking-wider mb-1.5">
                            <IndianRupee className="w-4 h-4 text-[#F4C45E]" />
                            <span>Wholesale Freight</span>
                          </div>
                          <div className="text-base sm:text-lg font-black text-emerald-300 leading-tight">
                            {searchResult.delivery_charges_text ||
                              (searchResult.standard_shipping_rate
                                ? `₹${searchResult.standard_shipping_rate} / carton`
                                : 'Custom Freight Quote')}
                          </div>
                        </div>
                        <div className="text-[11px] text-white/70 mt-2 font-medium">
                          Direct factory rate
                        </div>
                      </div>

                      {/* 4. Payment Terms */}
                      <div className="bg-white/10 rounded-2xl p-4 border border-white/15 backdrop-blur-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-[#F4C45E] text-xs font-black uppercase tracking-wider mb-1.5">
                            <ShieldCheck className="w-4 h-4 text-[#F4C45E]" />
                            <span>Payment Terms</span>
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                            {searchResult.cod_available ? 'COD & Prepaid' : 'Invoice on Dispatch'}
                          </div>
                        </div>
                        <div className="text-[11px] text-white/70 mt-2 font-medium">
                          Verified B2B terms
                        </div>
                      </div>

                    </div>

                    {/* Covered Villages & Localities Details */}
                    {searchResult.localities && searchResult.localities.length > 0 && (
                      <div className="bg-white/10 rounded-2xl p-4 border border-white/15 text-xs">
                        <span className="text-[#F4C45E] font-black uppercase tracking-wider mr-2">
                          Covered Villages &amp; Localities:
                        </span>
                        <span className="text-white/90 font-medium leading-relaxed">
                          {searchResult.localities.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons: WhatsApp Enquiry + Call Desk */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                        <a
                          href={
                            searchResult.whatsapp_url ||
                            `https://wa.me/919861789602?text=${encodeURIComponent(
                              `🚚 *DELIVERY INQUIRY – SRI BALAJI*\nPIN: ${searchResult.pincode} (${searchResult.city})\nPlease confirm road transport schedule and carton rates.`
                            )}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 fill-white text-emerald" />
                          <span>Enquire Route via WhatsApp</span>
                        </a>

                        <a
                          href="tel:+919861789602"
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-[#F4C45E]" />
                          <span>Call Dispatch Desk</span>
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsOdishaExpanded(true)}
                        className="inline-flex items-center gap-1.5 text-xs text-[#F4C45E] hover:text-white font-extrabold transition-colors cursor-pointer"
                      >
                        <span>Explore All 30 Odisha Districts Below</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ======================================================== */}
        {/* SECTION 1: EXPLORE DELIVERY COVERAGE ACROSS ODISHA       */}
        {/* ======================================================== */}
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#D6A52D]/50 shadow-royal p-6 sm:p-10 max-w-6xl mx-auto mb-14">
          
          {/* Header & Toggle Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#D6A52D]/25">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#28143F]/10 border border-[#D6A52D]/40 text-[#28143F] text-xs font-black uppercase tracking-wider mb-2">
                <Building2 className="w-3.5 h-3.5 text-[#D6A52D]" />
                <span>STATEWIDE ROAD TRANSPORT NETWORK</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#28143F] tracking-tight">
                Explore Delivery Coverage Across Odisha
              </h3>
              <p className="text-[#3B2D27] font-semibold text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Sri Balaji covers all 30 districts of Odisha through dedicated factory tempos, state roadlines, and bus cargo. Select any district below to check actual route availability and transit duration.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOdishaExpanded(!isOdishaExpanded)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#28143F] text-[#F4C45E] font-black text-xs uppercase tracking-wider shadow-gold hover:shadow-royal transition-all cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <span>{isOdishaExpanded ? 'Collapse All Districts' : 'Expand All 30 Districts'}</span>
              {isOdishaExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Expandable Body */}
          {isOdishaExpanded && (
            <div className="pt-6 space-y-6 animate-fadeIn">
              
              {/* Filter and Search Bar for Districts */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAF5EC] p-3 rounded-2xl border border-[#D6A52D]/40">
                
                {/* Search within 30 districts */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-[#D6A52D]" />
                  </div>
                  <input
                    type="text"
                    value={districtSearchQuery}
                    onChange={(e) => setDistrictSearchQuery(e.target.value)}
                    placeholder="Search district name or town (e.g. Puri, Ganjam, Angul, Sambalpur)..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#D6A52D]/50 text-xs sm:text-sm font-bold text-[#28143F] placeholder:text-[#7C6A5A] focus:outline-none focus:border-[#28143F]"
                  />
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => setDistrictStatusFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      districtStatusFilter === 'ALL'
                        ? 'bg-[#28143F] text-[#F4C45E] font-black'
                        : 'bg-white text-[#3B2D27] hover:bg-[#FAF5EC]'
                    }`}
                  >
                    All 30 Districts
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistrictStatusFilter('REGULAR')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      districtStatusFilter === 'REGULAR'
                        ? 'bg-emerald-700 text-white font-black'
                        : 'bg-white text-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    Regular Delivery (28)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistrictStatusFilter('SPECIAL')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      districtStatusFilter === 'SPECIAL'
                        ? 'bg-amber-700 text-white font-black'
                        : 'bg-white text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    Special Transit / Verification (2)
                  </button>
                </div>

              </div>

              {/* 30 Districts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredDistricts.map((dist) => {
                  const isRegular = dist.serviceability_status === 'REGULAR';
                  const isCustom = dist.serviceability_status === 'CUSTOM_TRANSIT';
                  return (
                    <div
                      key={dist.district_name}
                      className="bg-white rounded-2xl p-4 border-2 border-[#D6A52D]/40 hover:border-[#28143F] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* District Name and Status Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h5 className="font-display font-extrabold text-base sm:text-lg text-[#28143F] group-hover:text-[#D6A52D] transition-colors">
                            {dist.district_name}
                          </h5>
                          {isRegular ? (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                              Regular Route
                            </span>
                          ) : isCustom ? (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                              Custom Transit
                            </span>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-300 shrink-0">
                              Verification
                            </span>
                          )}
                        </div>

                        {/* Hub City & Primary PIN */}
                        <div className="text-xs text-[#3B2D27] font-semibold flex items-center gap-1.5 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-[#D6A52D] shrink-0" />
                          <span>Hub: <strong>{dist.hub_city}</strong></span>
                          {dist.primary_pincode && (
                            <span className="font-mono text-[#28143F] bg-[#FAF5EC] px-1.5 py-0.2 rounded font-bold">
                              {dist.primary_pincode}
                            </span>
                          )}
                        </div>

                        {/* Transport Mode & Duration */}
                        <div className="space-y-1 text-[11px] text-[#7C6A5A] font-medium border-t border-[#D6A52D]/20 pt-2 mb-3">
                          <div className="flex items-center gap-1.5 text-[#3B2D27]">
                            <Clock className="w-3 h-3 text-[#D6A52D]" />
                            <span>Transit: <strong>{dist.transit_duration_label}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#3B2D27]">
                            <Truck className="w-3 h-3 text-[#D6A52D]" />
                            <span>Freight: <strong>{dist.delivery_charges_text}</strong></span>
                          </div>
                          {dist.highlight && (
                            <div className="text-[10px] text-[#28143F] font-bold mt-1 bg-[#FAF5EC] p-1.5 rounded-lg">
                              ✦ {dist.highlight}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Click to check availability button */}
                      <button
                        type="button"
                        onClick={() => handleDistrictClick(dist)}
                        className="w-full mt-2 py-2 px-3 rounded-xl bg-[#28143F]/10 hover:bg-[#28143F] text-[#28143F] hover:text-[#F4C45E] font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Check {dist.district_name} Route</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* Collapsed Preview Teaser (when collapsed) */}
          {!isOdishaExpanded && (
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#3B2D27] font-semibold flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-[#28143F]">Key Covered Districts:</span>
                <span className="bg-[#FAF5EC] px-2.5 py-1 rounded-lg border border-[#D6A52D]/40 font-bold">Gajapati</span>
                <span className="bg-[#FAF5EC] px-2.5 py-1 rounded-lg border border-[#D6A52D]/40 font-bold">Ganjam</span>
                <span className="bg-[#FAF5EC] px-2.5 py-1 rounded-lg border border-[#D6A52D]/40 font-bold">Rayagada</span>
                <span className="bg-[#FAF5EC] px-2.5 py-1 rounded-lg border border-[#D6A52D]/40 font-bold">Khordha</span>
                <span className="bg-[#FAF5EC] px-2.5 py-1 rounded-lg border border-[#D6A52D]/40 font-bold">Cuttack</span>
                <span className="bg-[#FAF5EC] px-2.5 py-1 rounded-lg border border-[#D6A52D]/40 font-bold">Puri</span>
                <span className="bg-[#FAF5EC] px-2.5 py-1 rounded-lg border border-[#D6A52D]/40 font-bold">Angul</span>
                <span className="text-[#7C6A5A]">+ 23 more</span>
              </div>

              <button
                type="button"
                onClick={() => setIsOdishaExpanded(true)}
                className="text-xs font-black text-[#D6A52D] hover:text-[#28143F] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View All 30 Districts Breakdown</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* Bottom Wholesale Registration Banner */}
        <div className="mt-8 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-[#D6A52D]/40 shadow-xs text-xs">
            <span className="flex items-center gap-1.5 text-[#28143F] font-extrabold">
              <ShieldCheck className="w-4 h-4 text-emerald" />
              <span>Are you a Kirana Store, Supermarket, or Tea Stall Owner in Odisha or Andhra Pradesh?</span>
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
