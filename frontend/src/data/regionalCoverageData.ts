// 87 Verified Regional Road Transport Serviceable Hubs (Odisha & Andhra Pradesh)
// Synchronized with PostgreSQL database table: serviceable_pincodes
import type { PincodeCheckResult, CoverageHierarchyResponse } from '../services/api';

export interface StaticCoverageRecord {
  pincode: string;
  city: string;
  district: string;
  state: string;
  zone_name: string;
  serviceability_status: 'REGULAR' | 'CUSTOM_TRANSIT' | 'PENDING_VERIFICATION' | 'UNAVAILABLE';
  localities: string[];
  transport_modes: string[];
  transit_duration_label: string;
  min_delivery_days: number;
  max_delivery_days: number;
  standard_shipping_rate: number;
  delivery_charges_text: string;
  delivery_conditions?: string;
  cod_available: boolean;
  daily_transit_available: boolean;
  notes?: string;
}

export const REGIONAL_COVERAGE_RECORDS: StaticCoverageRecord[] = [
  {
    "pincode": "759122",
    "city": "Angul",
    "district": "Angul",
    "state": "Odisha",
    "zone_name": "Central Odisha Industrial Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Angul Town",
      "Amalapada",
      "Mishrapada",
      "Collectorate Area",
      "Bazar Road",
      "Banarpal",
      "Nalco Nagar"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Scheduled bus parcel and state roadlines dispatch from South Odisha hub.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "District headquarters for Angul."
  },
  {
    "pincode": "761208",
    "city": "Serango",
    "district": "Gajapati",
    "state": "Odisha",
    "zone_name": "Gajapati Regional Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Serango Bazar",
      "Gumma Road",
      "Christian Sahi",
      "Ajayagada",
      "Hill Market",
      "Serango Mandal"
    ],
    "transport_modes": [
      "Regional Carrier Tempo",
      "Bus Cargo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Daily factory delivery van/tempo link from Paralakhemundi (15 km).",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Serango hill area route."
  },
  {
    "pincode": "761210",
    "city": "Gurandi",
    "district": "Gajapati",
    "state": "Odisha",
    "zone_name": "Gajapati Regional Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Gurandi Bazar",
      "Gosani Block",
      "High School Road",
      "Krushnapur",
      "Uppalada Road",
      "Gurandi Mandal"
    ],
    "transport_modes": [
      "Regional Carrier Tempo",
      "Bus Cargo"
    ],
    "transit_duration_label": "Same Day - 1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 1,
    "standard_shipping_rate": 35.0,
    "delivery_charges_text": "₹35 flat / carton",
    "delivery_conditions": "Direct local factory van delivery twice daily from Paralakhemundi.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Gurandi Gosani block route."
  },
  {
    "pincode": "532204",
    "city": "Nandigam",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "AP Border Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Nandigam Junction",
      "Main Road",
      "Palasa-Tekkali Highway",
      "Kaviti Road",
      "Nandigam Mandal"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Daily bus cargo and transport vans via NH-16 corridor.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Nandigam AP border corridor."
  },
  {
    "pincode": "532312",
    "city": "Ichchapuram",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "AP Border Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Ichchapuram Town",
      "RTC Bus Stand",
      "Border Checkpost",
      "Main Bazar",
      "Bellupada",
      "Ichchapuram Mandal"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Daily roadline transit connecting Berhampur and Srikakulam border.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Ichchapuram Andhra-Odisha gateway."
  },
  {
    "pincode": "761020",
    "city": "Chhatrapur",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "Ganjam Coastal Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Chhatrapur Collectorate Area",
      "Main Bazar",
      "Court Road",
      "Station Road",
      "Potagarh",
      "Chhatrapur Block"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Direct daily road transit via Berhampur NH-16 corridor.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Ganjam district headquarters."
  },

  {
    "pincode": "761200",
    "city": "Paralakhemundi",
    "district": "Gajapati",
    "state": "Odisha",
    "zone_name": "South Odisha Factory Direct Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Ranipeta",
      "Betaguda",
      "Forest Gate",
      "Main Palace Road",
      "Upalada",
      "B.N. Palace",
      "Collectorate Area",
      "Old Bus Stand",
      "Jagannath Temple Street",
      "Gandhi Nagar"
    ],
    "transport_modes": [
      "Regional Carrier Tempo",
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "Same Day - 1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 1,
    "standard_shipping_rate": 30.0,
    "delivery_charges_text": "₹30 flat / carton (Factory Direct Dispatch)",
    "delivery_conditions": "Factory direct van delivery available daily. Instant local order pickup at Paralakhemundi facility.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Main manufacturing unit & central distribution warehouse."
  },
  {
    "pincode": "761201",
    "city": "Kasinagar",
    "district": "Gajapati",
    "state": "Odisha",
    "zone_name": "Gajapati Regional Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Kidasingi",
      "Kharada",
      "Sialilata",
      "Hadobhangi",
      "Kasinagar Main Bazar",
      "Bansadhara River Belt"
    ],
    "transport_modes": [
      "Regional Carrier Tempo",
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Scheduled tempo route twice daily from Paralakhemundi.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Bansadhara corridor route."
  },
  {
    "pincode": "761206",
    "city": "Mohana",
    "district": "Gajapati",
    "state": "Odisha",
    "zone_name": "Gajapati Regional Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Chandragiri Tibetan Settlement",
      "Kamalapur",
      "Luhagudi",
      "Adava",
      "Mohana Chowk",
      "Karchabadi"
    ],
    "transport_modes": [
      "Bus Cargo",
      "Regional Carrier Tempo",
      "State Roadlines"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Daily bus cargo link via Berhampur-Mohana SH.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Tibetan settlement and hill market coverage."
  },
  {
    "pincode": "761211",
    "city": "Rayagada Block (Gajapati)",
    "district": "Gajapati",
    "state": "Odisha",
    "zone_name": "Gajapati Regional Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Jiranga",
      "Narayanpur",
      "Garabandha",
      "Jeerango Monastery Road",
      "Baghamari"
    ],
    "transport_modes": [
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Regular roadline service from Paralakhemundi.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Southern Gajapati block coverage."
  },
  {
    "pincode": "761205",
    "city": "R. Udayagiri",
    "district": "Gajapati",
    "state": "Odisha",
    "zone_name": "Gajapati Regional Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Chelligada",
      "Tabarasingi",
      "Ramagiri",
      "Udayagiri Market",
      "Parida"
    ],
    "transport_modes": [
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Scheduled bus parcel counter delivery at R. Udayagiri bus stand.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Agency area coverage."
  },
  {
    "pincode": "761207",
    "city": "Gumma",
    "district": "Gajapati",
    "state": "Odisha",
    "zone_name": "Gajapati Regional Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Tarangada",
      "Namanagada",
      "Gaiba",
      "Gumma Block Headquarter",
      "Ajayagada"
    ],
    "transport_modes": [
      "Regional Carrier Tempo",
      "Bus Cargo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Local distributor van dispatch.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Gumma block central coverage."
  },
  {
    "pincode": "761208",
    "city": "Nuagada",
    "district": "Gajapati",
    "state": "Odisha",
    "zone_name": "Gajapati Regional Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Titising",
      "Sambalpur Nuagada",
      "Anuguda",
      "Badapada",
      "Betarsingi"
    ],
    "transport_modes": [
      "Regional Carrier Tempo",
      "Bus Cargo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Direct transport drops at Nuagada hub.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Nuagada agency sector."
  },
  {
    "pincode": "760001",
    "city": "Berhampur (Main)",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "South Odisha Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Old Bus Stand",
      "Giri Road",
      "Gandhi Nagar",
      "Urban Bank Road",
      "Ramlingam Tank",
      "Military Line"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "1 Day (Next Morning)",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Multiple daily direct bus cargos & OSRTC parcels from Paralakhemundi.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Major commercial hub for wholesale redistribution."
  },
  {
    "pincode": "760002",
    "city": "Berhampur (Bada Bazar)",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "South Odisha Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Bada Bazar Wholesale Mandi",
      "Silk City Market",
      "Annapurna Market",
      "Desibehera Street",
      "Kaluapatra"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Direct door delivery to wholesale merchant godowns.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Primary wholesale market sector."
  },
  {
    "pincode": "760004",
    "city": "Berhampur (Industrial)",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "South Odisha Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Ankoli",
      "Industrial Estate",
      "Autonagar",
      "Lanjipalli Bypass",
      "Haldiapadar"
    ],
    "transport_modes": [
      "State Roadlines",
      "Regional Carrier Tempo",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Heavy truckload / full carton bulk drops supported.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Industrial warehouse area."
  },
  {
    "pincode": "760007",
    "city": "Berhampur (Medical)",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "South Odisha Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "MKCG Medical College",
      "Courtpeta",
      "Engineering School Road",
      "Medical Campus"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Daily delivery.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Medical & institutional sector."
  },
  {
    "pincode": "761020",
    "city": "Chatrapur",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "Coastal Ganjam Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Ganjam Collectorate",
      "Agasti Nuagaon",
      "Port Road",
      "Chatrapur Court",
      "Station Road"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Direct bus parcel drops at Chatrapur bus stand.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Ganjam district headquarters."
  },
  {
    "pincode": "761102",
    "city": "Hinjilicut",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "Ganjam Central Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Hinjili Main Market",
      "Saru",
      "Pitala",
      "Nuagada Hinjili",
      "Regidi"
    ],
    "transport_modes": [
      "Bus Cargo",
      "State Roadlines",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Daily scheduled stops on the Berhampur-Aska corridor.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Key agricultural & grocery trade center."
  },
  {
    "pincode": "761110",
    "city": "Aska",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "Ganjam Central Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Sugar Mill Road",
      "Paklapalli",
      "Bhetanai",
      "Aska College Road",
      "Kavisuryanagar Link"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Direct transport drops at Aska main market.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Historic sugar city & FMCG distribution center."
  },
  {
    "pincode": "761126",
    "city": "Bhanjanagar",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "North Ganjam Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Kullada",
      "Belaguntha Road",
      "Lalsingi",
      "Bhanjanagar Reservoir Road",
      "Bada Bazar"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "OSRTC cargo & private carrier parcel service.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Sub-divisional trade junction."
  },
  {
    "pincode": "761012",
    "city": "Digapahandi",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "South Ganjam Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Kalyanpur",
      "Nimakhandi",
      "Padmanabhapur",
      "Digapahandi Bus Stand",
      "Sidheswar"
    ],
    "transport_modes": [
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 1,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "On direct Paralakhemundi-Berhampur SH route.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Direct transit route between Paralakhemundi and Berhampur."
  },
  {
    "pincode": "761010",
    "city": "Chikiti",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "South Ganjam Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Chikiti Pentho",
      "K Nuagaon",
      "Girisola Border",
      "Kotilingi"
    ],
    "transport_modes": [
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Daily road service along AP-Odisha border highway.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Border junction."
  },
  {
    "pincode": "761002",
    "city": "Gopalpur",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "Coastal Ganjam Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Gopalpur-on-Sea",
      "Haripur",
      "Mansurkota",
      "Port Area",
      "Beach Road"
    ],
    "transport_modes": [
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Local transport service from Berhampur hub.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Port & tourism sector."
  },
  {
    "pincode": "761119",
    "city": "Bellaguntha",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "North Ganjam Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Brass Fish Craft Hub",
      "Nuagaon Bellaguntha",
      "Jagannathprasad Road",
      "Bada Danda"
    ],
    "transport_modes": [
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Regular bus parcel delivery.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Artisan and market center."
  },
  {
    "pincode": "761115",
    "city": "Polasara",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "East Ganjam Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Buguda Road",
      "Pandiripada",
      "Mathura Polasara",
      "College Chhaka"
    ],
    "transport_modes": [
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Bus cargo counter delivery.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Polasara block coverage."
  },
  {
    "pincode": "761018",
    "city": "Purushottampur",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "Central Ganjam Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Tara Tarini Temple Road",
      "Pratapur",
      "Bhatakumarada",
      "Rushikulya River Bank"
    ],
    "transport_modes": [
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Direct transport drops at Purushottampur chowk.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Tara Tarini pilgrimage and trading zone."
  },
  {
    "pincode": "761032",
    "city": "Kodala",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "East Ganjam Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Beguniapada",
      "Mardameka",
      "Khallikote Road",
      "Kodala Bazar"
    ],
    "transport_modes": [
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Scheduled bus transport cargo drops.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Kodala & Beguniapada trading route."
  },
  {
    "pincode": "761028",
    "city": "Rambha",
    "district": "Ganjam",
    "state": "Odisha",
    "zone_name": "Coastal Ganjam Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Chilika Lake Shore",
      "Sabulia",
      "Humma Salt Area",
      "NH-16 Junction"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Direct delivery on NH-16 coastal artery.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Chilika south zone."
  },
  {
    "pincode": "765001",
    "city": "Rayagada (Town)",
    "district": "Rayagada",
    "state": "Odisha",
    "zone_name": "Rayagada Valley Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "New Bus Stand",
      "Daily Market",
      "Ashok Nagar",
      "Sai Priya Nagar",
      "Kapilash Road",
      "Station Road"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Daily scheduled transport routes connecting directly to Paralakhemundi & Gunupur.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Rayagada district center."
  },
  {
    "pincode": "765002",
    "city": "Rayagada (J.K. Pur)",
    "district": "Rayagada",
    "state": "Odisha",
    "zone_name": "Rayagada Valley Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "JK Paper Mills Township",
      "Jaykaypur Market",
      "Chandili",
      "Paper Mill Colony"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Commercial van dispatch to JK Pur township.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Paper mill industrial belt."
  },
  {
    "pincode": "765017",
    "city": "Gunupur",
    "district": "Rayagada",
    "state": "Odisha",
    "zone_name": "Bansadhara Basin Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Old Bus Stand",
      "Main Market",
      "GIET University Campus",
      "College Road",
      "Bansadhara River Bridge",
      "Jagannath Mandir Street"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 1,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "High frequency daily dispatch via Paralakhemundi-Gunupur highway.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "GIET university & sub-divisional commercial center."
  },
  {
    "pincode": "765022",
    "city": "Gunupur Rural",
    "district": "Rayagada",
    "state": "Odisha",
    "zone_name": "Bansadhara Rural Belt",
    "serviceability_status": "CUSTOM_TRANSIT",
    "localities": [
      "Marathiguda",
      "Chalkamba",
      "Sirijoly",
      "Baghasala",
      "Jagannathpur Rural",
      "Goudathota"
    ],
    "transport_modes": [
      "Bus Cargo",
      "Private Transport Agencies",
      "Indian Post"
    ],
    "transit_duration_label": "2-4 Days (Custom Transit)",
    "min_delivery_days": 2,
    "max_delivery_days": 4,
    "standard_shipping_rate": 0.0,
    "delivery_charges_text": "Custom Freight Quote (Special Transit)",
    "delivery_conditions": "Custom Transit Arrangement Required. Please contact our Wholesale Desk at +91 98617 89602.",
    "cod_available": false,
    "daily_transit_available": false,
    "notes": "Custom transit configuration preserved per Sri Balaji transport policy."
  },
  {
    "pincode": "765019",
    "city": "Bissam Cuttack",
    "district": "Rayagada",
    "state": "Odisha",
    "zone_name": "North Rayagada Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Durgi",
      "Chatikona",
      "Christian Hospital Road",
      "Bissam Cuttack Market",
      "Niyamgiri Gate"
    ],
    "transport_modes": [
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "OSRTC & private bus parcel drops at Bissam Cuttack bus stop.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Niyamgiri foothill trading market."
  },
  {
    "pincode": "765020",
    "city": "Muniguda",
    "district": "Rayagada",
    "state": "Odisha",
    "zone_name": "North Rayagada Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Ambadola",
      "Vedanta Road",
      "Dangasurada",
      "Muniguda Railway Station Area",
      "Daily Market"
    ],
    "transport_modes": [
      "Bus Cargo",
      "State Roadlines",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Scheduled transport drops at Muniguda junction.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Industrial railway junction."
  },
  {
    "pincode": "765026",
    "city": "Gudari",
    "district": "Rayagada",
    "state": "Odisha",
    "zone_name": "Bansadhara Basin Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Bansadhara River Bank",
      "Karlaghati",
      "Siriguda",
      "Gudari Market",
      "Bada Sahi"
    ],
    "transport_modes": [
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Transport delivery via Gunupur connecting carrier.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Bansadhara upper basin."
  },
  {
    "pincode": "765025",
    "city": "Padmapur",
    "district": "Rayagada",
    "state": "Odisha",
    "zone_name": "Rayagada Valley Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Bikrampur",
      "Jagannathpur",
      "Hatada",
      "Padmapur Weekly Haat"
    ],
    "transport_modes": [
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Delivery aligned with weekly haat and bus parcel drop.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Agricultural mandi."
  },
  {
    "pincode": "765018",
    "city": "Chandrapur",
    "district": "Rayagada",
    "state": "Odisha",
    "zone_name": "Rayagada Interior Sector",
    "serviceability_status": "CUSTOM_TRANSIT",
    "localities": [
      "Dangapadar",
      "Hanumantapur",
      "Bijapur",
      "Chandrapur Block"
    ],
    "transport_modes": [
      "Indian Post",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "3-5 Days (Custom Transit)",
    "min_delivery_days": 3,
    "max_delivery_days": 5,
    "standard_shipping_rate": 0.0,
    "delivery_charges_text": "Custom Freight Quote",
    "delivery_conditions": "Custom Transit Arrangement Required. Please contact our Wholesale Desk at +91 98617 89602.",
    "cod_available": false,
    "daily_transit_available": false,
    "notes": "Interior hilly block."
  },
  {
    "pincode": "765015",
    "city": "Kashipur",
    "district": "Rayagada",
    "state": "Odisha",
    "zone_name": "Rayagada Alumina Belt",
    "serviceability_status": "CUSTOM_TRANSIT",
    "localities": [
      "Tikiri",
      "Utkal Alumina Township",
      "Sunger",
      "Kashipur Block"
    ],
    "transport_modes": [
      "Private Transport Agencies",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-4 Days (Custom Transit)",
    "min_delivery_days": 2,
    "max_delivery_days": 4,
    "standard_shipping_rate": 0.0,
    "delivery_charges_text": "Custom Freight Quote",
    "delivery_conditions": "Custom Transit Arrangement Required. Please contact our Wholesale Desk at +91 98617 89602.",
    "cod_available": false,
    "daily_transit_available": false,
    "notes": "Alumina refinery sector."
  },
  {
    "pincode": "762001",
    "city": "Phulbani",
    "district": "Kandhamal",
    "state": "Odisha",
    "zone_name": "Central Highlands Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Phulbani Town",
      "Madikunda",
      "Peonpada",
      "Masterpada",
      "College Road",
      "Bus Stand Market"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "OSRTC parcel service and daily Berhampur-Phulbani express cargo.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "District headquarters."
  },
  {
    "pincode": "762103",
    "city": "Baliguda",
    "district": "Kandhamal",
    "state": "Odisha",
    "zone_name": "Central Highlands Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Barakhama",
      "Nuasahi",
      "Sub-divisional Hospital Road",
      "Baliguda Market"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Express bus cargo parcel delivery.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Sub-divisional wholesale hub."
  },
  {
    "pincode": "762100",
    "city": "G. Udayagiri",
    "district": "Kandhamal",
    "state": "Odisha",
    "zone_name": "Central Highlands Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Kalinga Valley",
      "Raikia Road Hub",
      "Udayagiri Town",
      "College Road"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Daily parcel drop on the Kalinga Ghat highway.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Ghat pass trading center."
  },
  {
    "pincode": "762104",
    "city": "Daringbadi",
    "district": "Kandhamal",
    "state": "Odisha",
    "zone_name": "Central Highlands Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Kashmir of Odisha",
      "Coffee Garden Road",
      "Kirikuti",
      "Green Valley",
      "Hill View Park",
      "Daringbadi Bus Stand"
    ],
    "transport_modes": [
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Daily tourist and retail market cargo supply from South Odisha routes.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Renowned hill station & high snack demand retail area."
  },
  {
    "pincode": "762101",
    "city": "Raikia",
    "district": "Kandhamal",
    "state": "Odisha",
    "zone_name": "Central Highlands Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Mandasaru Valley",
      "Karada",
      "Petapanga",
      "Raikia Daily Market"
    ],
    "transport_modes": [
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Bus cargo counter pickup.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Highlands trading center."
  },
  {
    "pincode": "762010",
    "city": "Tikabali",
    "district": "Kandhamal",
    "state": "Odisha",
    "zone_name": "Central Highlands Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Agency Market",
      "Paburia",
      "Linepada",
      "Tikabali Roundabout"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Bus parcel drop.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Kandhamal spice & turmeric trading hub."
  },
  {
    "pincode": "764020",
    "city": "Koraput",
    "district": "Koraput",
    "state": "Odisha",
    "zone_name": "Koraput Plateau Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Collectorate Road",
      "Pujariput",
      "Coffee Board Colony",
      "Landiguda",
      "Koraput Bus Stand",
      "Central University Link"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Direct night express bus parcel and tempo link.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "District administrative center."
  },
  {
    "pincode": "764001",
    "city": "Jeypore",
    "district": "Koraput",
    "state": "Odisha",
    "zone_name": "Koraput Plateau Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Main Road Jeypore",
      "MG Road",
      "Parabeda",
      "Gandhi Chowk",
      "Rice Mill Area",
      "Bank Street"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Major commercial hub with door delivery for wholesale dealers.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "South-west Odisha wholesale headquarters."
  },
  {
    "pincode": "763002",
    "city": "Sunabeda",
    "district": "Koraput",
    "state": "Odisha",
    "zone_name": "Koraput Plateau Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "HAL Aero Engine Township",
      "HAL Sector 1-3",
      "Sunabeda Market",
      "Semiliguda Highway"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Regular transport delivery to township markets.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "HAL industrial city."
  },
  {
    "pincode": "764055",
    "city": "Kotpad",
    "district": "Koraput",
    "state": "Odisha",
    "zone_name": "Koraput Plateau Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Kotpad Handloom Weavers Colony",
      "Girla",
      "Dhamanahandi",
      "Daily Market Kotpad"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Bus parcel delivery.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Handloom heritage center."
  },
  {
    "pincode": "763003",
    "city": "Semiliguda",
    "district": "Koraput",
    "state": "Odisha",
    "zone_name": "Koraput Plateau Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Kunduli Weekly Haat",
      "Deomali Foothills",
      "Pattangi Road",
      "Semiliguda Chowk"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Daily transit.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Kunduli haat vegetable & trade junction."
  },
  {
    "pincode": "763008",
    "city": "Damanjodi",
    "district": "Koraput",
    "state": "Odisha",
    "zone_name": "Koraput Plateau Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "NALCO Bauxite Township",
      "Mathalput",
      "Kakiriguma",
      "Sector 1-4",
      "Shopping Complex"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Direct transport to NALCO township market.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "NALCO bauxite refinery city."
  },
  {
    "pincode": "764056",
    "city": "Borigumma",
    "district": "Koraput",
    "state": "Odisha",
    "zone_name": "Koraput Plateau Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Raniguda",
      "Sasahandi",
      "Kamta",
      "Borigumma Junction Market"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Transport delivery via Jeypore junction.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Tri-junction of Koraput, Nabarangpur & Malkangiri."
  },
  {
    "pincode": "751001",
    "city": "Bhubaneswar",
    "district": "Khordha",
    "state": "Odisha",
    "zone_name": "Odisha Capital Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Master Canteen",
      "Station Square",
      "Saheed Nagar",
      "Ashok Nagar",
      "Janpath",
      "Unit 1-9 Market"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Overnight bus cargo and express tempo from Paralakhemundi/Berhampur.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "State capital & highest wholesale volume metro."
  },
  {
    "pincode": "753001",
    "city": "Cuttack",
    "district": "Cuttack",
    "state": "Odisha",
    "zone_name": "Odisha Capital Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Chowdhury Bazar",
      "Malgodown Wholesale Mandi",
      "Buxi Bazar",
      "Ranihat",
      "College Square",
      "Badambadi"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Direct drop at Malgodown wholesale transshipment hub.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Silver city & central wholesale distribution capital."
  },
  {
    "pincode": "752001",
    "city": "Puri",
    "district": "Puri",
    "state": "Odisha",
    "zone_name": "Coastal Heritage Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Grand Road (Bada Danda)",
      "Swargadwar",
      "VIP Road",
      "Jagannath Temple Perimeter",
      "Sea Beach"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Daily delivery for retail souvenir & sweet vendors.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Pilgrimage center & high consumer turnover."
  },
  {
    "pincode": "768001",
    "city": "Sambalpur",
    "district": "Sambalpur",
    "state": "Odisha",
    "zone_name": "Western Odisha Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Golbazar Wholesale Market",
      "VSS Marg",
      "Budharaja",
      "Dhanupali",
      "Khetrajpur Railway Station Area"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Direct roadlines freight connection to Western Odisha.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Western Odisha commercial headquarters."
  },
  {
    "pincode": "756001",
    "city": "Balasore",
    "district": "Balasore",
    "state": "Odisha",
    "zone_name": "North Coastal Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Motiganj",
      "Station Road",
      "FM Goltei",
      "Sahadevkhunta",
      "Cinema Bazar"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Express roadlines to North Odisha.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "North Odisha commercial gateway."
  },
  {
    "pincode": "768028",
    "city": "Bargarh",
    "district": "Bargarh",
    "state": "Odisha",
    "zone_name": "Western Odisha Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Dhanu Yatra Ground Area",
      "Main Road Bargarh",
      "Canal Avenue",
      "Weekly Mandi"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Regular freight service.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Rice bowl of Odisha."
  },
  {
    "pincode": "756100",
    "city": "Bhadrak",
    "district": "Bhadrak",
    "state": "Odisha",
    "zone_name": "North Coastal Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Bonth Chhaka",
      "Charampa",
      "Puruna Bazar",
      "Kuansh",
      "College Road"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "NH-16 direct transit drops.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Coastal trading city."
  },
  {
    "pincode": "767001",
    "city": "Bolangir",
    "district": "Balangir",
    "state": "Odisha",
    "zone_name": "Western Odisha Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Daily Market",
      "Rugudipada",
      "Palace Line",
      "Tikrapara",
      "Station Road"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "State transport routes connecting South and Western Odisha.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "District headquarters."
  },
  {
    "pincode": "762014",
    "city": "Boudh",
    "district": "Boudh",
    "state": "Odisha",
    "zone_name": "Mahanadi Basin Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Boudh Town",
      "Jagannath Temple Road",
      "Butupali",
      "Mahanadi Ghat"
    ],
    "transport_modes": [
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Bus cargo counter delivery.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Mahanadi valley trade."
  },
  {
    "pincode": "768108",
    "city": "Deogarh",
    "district": "Deogarh",
    "state": "Odisha",
    "zone_name": "Interior Highlands Sector",
    "serviceability_status": "PENDING_VERIFICATION",
    "localities": [
      "Pradhanpat Falls Road",
      "Purunagarh",
      "Deogarh Town"
    ],
    "transport_modes": [
      "Indian Post",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "3-4 Days",
    "min_delivery_days": 3,
    "max_delivery_days": 4,
    "standard_shipping_rate": 60.0,
    "delivery_charges_text": "Freight upon verification",
    "delivery_conditions": "Serviceability Pending: Route coverage needs business verification.",
    "cod_available": false,
    "daily_transit_available": false,
    "notes": "Route coverage under verification."
  },
  {
    "pincode": "759001",
    "city": "Dhenkanal",
    "district": "Dhenkanal",
    "state": "Odisha",
    "zone_name": "Central Industrial Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Ganesh Bazar",
      "Baji Chowk",
      "Mahabir Bazar",
      "Station Road Dhenkanal"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Regular bus parcel delivery.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Central district hub."
  },
  {
    "pincode": "754103",
    "city": "Jagatsinghpur",
    "district": "Jagatsinghpur",
    "state": "Odisha",
    "zone_name": "Coastal Delta Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Thana Chhaka",
      "Court Road",
      "Paradeep Link",
      "Balikuda Road"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Scheduled cargo delivery.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Coastal delta area."
  },
  {
    "pincode": "755001",
    "city": "Jajpur",
    "district": "Jajpur",
    "state": "Odisha",
    "zone_name": "Central Industrial Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Jajpur Town",
      "Biraja Temple Area",
      "Kuakhia",
      "Kalinganagar Link"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Regular transport delivery.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Steel corridor & historic town."
  },
  {
    "pincode": "768201",
    "city": "Jharsuguda",
    "district": "Jharsuguda",
    "state": "Odisha",
    "zone_name": "Western Industrial Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Mangal Bazar",
      "Beheramal",
      "Industrial Belt",
      "Airport Road",
      "Railway Colony"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Direct roadlines and transport agency delivery.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Industrial hub & airport city."
  },
  {
    "pincode": "766001",
    "city": "Bhawanipatna",
    "district": "Kalahandi",
    "state": "Odisha",
    "zone_name": "South-West Highlands Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Ghantiguda",
      "Station Road",
      "Paramandapur",
      "Manikeswari Temple Road"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Regular bus parcel delivery connecting from Rayagada.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Kalahandi district headquarters."
  },
  {
    "pincode": "754211",
    "city": "Kendrapara",
    "district": "Kendrapara",
    "state": "Odisha",
    "zone_name": "Coastal Delta Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Tinikonia Chhaka",
      "Kakalpur",
      "Balia",
      "Baladevjew Temple Area"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Cargo transport from Cuttack hub.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Coastal district market."
  },
  {
    "pincode": "758001",
    "city": "Keonjhar",
    "district": "Kendujhar",
    "state": "Odisha",
    "zone_name": "North Mining Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Mining Area Keonjhar",
      "Mining Road",
      "Mandua",
      "Sanaghagara Road"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Scheduled parcel service.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Mineral rich northern district."
  },
  {
    "pincode": "764045",
    "city": "Malkangiri",
    "district": "Malkangiri",
    "state": "Odisha",
    "zone_name": "Southern Border Agency Sector",
    "serviceability_status": "CUSTOM_TRANSIT",
    "localities": [
      "DNK Colony",
      "MV 79 Link",
      "Collectorate Road",
      "Balimela Road"
    ],
    "transport_modes": [
      "Indian Post",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "3-5 Days (Custom Transit)",
    "min_delivery_days": 3,
    "max_delivery_days": 5,
    "standard_shipping_rate": 0.0,
    "delivery_charges_text": "Custom Freight Quote",
    "delivery_conditions": "Custom Transit Arrangement Required. Please contact our Wholesale Desk at +91 98617 89602.",
    "cod_available": false,
    "daily_transit_available": false,
    "notes": "Border agency district."
  },
  {
    "pincode": "757001",
    "city": "Baripada",
    "district": "Mayurbhanj",
    "state": "Odisha",
    "zone_name": "Similipal Foothills Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Baghra Road",
      "Station Bazar",
      "Lalbazar",
      "Palace Compound Baripada"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Express cargo to North Odisha.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Mayurbhanj headquarters & heritage city."
  },
  {
    "pincode": "764059",
    "city": "Nabarangpur",
    "district": "Nabarangpur",
    "state": "Odisha",
    "zone_name": "South-West Plateau Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Majhiguda",
      "Forest Colony",
      "Main Market Nabarangpur",
      "Umerkote Link"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Bus cargo connected through Jeypore.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Plateau trade center."
  },
  {
    "pincode": "752069",
    "city": "Nayagarh",
    "district": "Nayagarh",
    "state": "Odisha",
    "zone_name": "Central Western Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Khandapada Road",
      "College Chhaka",
      "Odagaon Link",
      "Nayagarh Town"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 50.0,
    "delivery_charges_text": "₹50 flat / carton",
    "delivery_conditions": "Daily bus cargo connecting through Aska/Bhubaneswar.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Nayagarh district hub."
  },
  {
    "pincode": "766105",
    "city": "Nuapada",
    "district": "Nuapada",
    "state": "Odisha",
    "zone_name": "Western Border Sector",
    "serviceability_status": "REGULAR",
    "localities": [
      "Khariar Road Mandi",
      "Jonk",
      "Beltukri",
      "Nuapada Market"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Transport parcel service to Western border mandi.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Khariar road grain & consumer trading market."
  },
  {
    "pincode": "767017",
    "city": "Sonepur",
    "district": "Subarnapur",
    "state": "Odisha",
    "zone_name": "Mahanadi Weaving Sector",
    "serviceability_status": "REGULAR",
    "localities": [
      "Manamunda Road",
      "Weavers Lane",
      "Block Chhaka",
      "Sonepur Palace"
    ],
    "transport_modes": [
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Bus parcel delivery.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Subarnapur district headquarters."
  },
  {
    "pincode": "769001",
    "city": "Rourkela",
    "district": "Sundargarh",
    "state": "Odisha",
    "zone_name": "Northern Steel City Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Udit Nagar",
      "Daily Market Rourkela",
      "Steel City",
      "Bisra Road",
      "Sector 1-21",
      "Panposh"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "2-3 Days",
    "min_delivery_days": 2,
    "max_delivery_days": 3,
    "standard_shipping_rate": 55.0,
    "delivery_charges_text": "₹55 flat / carton",
    "delivery_conditions": "Direct express roadlines and private agency delivery to steel city.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Commercial steel hub of Odisha."
  },
  {
    "pincode": "532201",
    "city": "Pathapatnam",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "AP Border Immediate Transit Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Pathapatnam Main Bazar",
      "Meliaputti Road",
      "Temburu",
      "Paralakhemundi AP Border Gate",
      "Purushottapuram",
      "Pedda Seedi",
      "Seedi Chowk"
    ],
    "transport_modes": [
      "Regional Carrier Tempo",
      "Bus Cargo",
      "State Roadlines"
    ],
    "transit_duration_label": "Same Day - 1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 1,
    "standard_shipping_rate": 35.0,
    "delivery_charges_text": "₹35 flat / carton (Factory Van Dispatch)",
    "delivery_conditions": "Direct local delivery van trips 3 times daily across Paralakhemundi-Pathapatnam bridge.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Border twin town to Paralakhemundi. Primary Andhra entry point."
  },
  {
    "pincode": "532221",
    "city": "Palasa",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "North Coastal AP Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Kasibugga Cashew Mandi",
      "Palasa Railway Station",
      "Palasa Main Market",
      "Brahmanatarla",
      "Haridaspuram"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 1,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Daily direct transit via NH-16 corridor & dedicated tempo dispatches.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Cashew trading capital & high snack consumption hub."
  },
  {
    "pincode": "532222",
    "city": "Kasibugga",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "North Coastal AP Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Twin Town Center",
      "Somanathaswami Temple Road",
      "Highway Junction",
      "RTC Bus Complex",
      "Anjaneya Swamy Temple Line"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 1,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Same-day/next-morning distribution.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Palasa-Kasibugga twin municipality."
  },
  {
    "pincode": "532185",
    "city": "Amadalavalasa",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "Srikakulam Central Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Srikakulam Road Railway Junction",
      "Thogaram",
      "Sugar Factory Area",
      "Dusi",
      "Amadalavalasa Main Road"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Daily bus cargo drops at Srikakulam Road railway transit point.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Major railhead serving Srikakulam."
  },
  {
    "pincode": "532421",
    "city": "Narasannapeta",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "Srikakulam Coastal Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Komarthi",
      "Madapam",
      "Urlam",
      "Old Bus Stand Narasannapeta",
      "College Road",
      "Polaki Road"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Direct transport drops on NH-16 highway junction.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "NH-16 trade junction."
  },
  {
    "pincode": "532001",
    "city": "Srikakulam Town",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "Srikakulam Central Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Seven Road Junction",
      "Day & Night Junction",
      "Palakonda Road",
      "GT Road",
      "RTC Complex",
      "Nagavali River Bund"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo",
      "Private Transport Agencies"
    ],
    "transit_duration_label": "1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 1,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Multiple daily direct transport services from Paralakhemundi & Sompeta routes.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "District headquarters of Srikakulam."
  },
  {
    "pincode": "532005",
    "city": "Srikakulam (Gujarathipeta / Industrial)",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "Srikakulam Central Corridor",
    "serviceability_status": "REGULAR",
    "localities": [
      "Industrial Estate Srikakulam",
      "Gujarathipeta",
      "Arasavalli Sun Temple Road",
      "Kalingapatnam Road"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Direct drop for retail and wholesale distributors.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Arasavalli temple area & industrial center."
  },
  {
    "pincode": "532202",
    "city": "Tekkali",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "North Coastal AP Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Tekkali Town",
      "Raghunadhapuram",
      "Tilaru",
      "Kotabommali Road",
      "Main Bazar Tekkali"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Daily scheduled transport drops at Tekkali RTC junction.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Sub-divisional market center."
  },
  {
    "pincode": "532284",
    "city": "Sompeta",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "North Coastal AP Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Sompeta Town",
      "Baruva Beach Road",
      "Kanchili",
      "Jalantra",
      "Sompeta Market"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Direct bus parcel delivery via Sompeta-Baruva link.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Coastal AP trading market."
  },
  {
    "pincode": "532242",
    "city": "Mandasa",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "North Coastal AP Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Mandasa Fort Road",
      "Haripuram",
      "Benkili",
      "Budithi Bell Metal Craft Village",
      "Mandasa Bazar"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Regular road transport parcel drop.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Mahendragiri foothills & historic fort village."
  },
  {
    "pincode": "532312",
    "city": "Itchapuram",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "AP-Odisha Border Gateway",
    "serviceability_status": "REGULAR",
    "localities": [
      "Border Checkpost",
      "Bellupada",
      "Kavisiti",
      "Suryanarayanapuram",
      "Itchapuram Municipality"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Daily highway deliveries on NH-16 border gate.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "State border gateway connecting Berhampur and Srikakulam."
  },
  {
    "pincode": "532459",
    "city": "Hiramandalam",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "Vamsadhara Basin AP Sector",
    "serviceability_status": "REGULAR",
    "localities": [
      "Gotta Barrage",
      "Tungathampara",
      "Subalaya",
      "Hiramandalam Main Market"
    ],
    "transport_modes": [
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Tempo delivery connecting via Pathapatnam route.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Gotta barrage agricultural region."
  },
  {
    "pincode": "532455",
    "city": "Kothuru",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "Vamsadhara Basin AP Sector",
    "serviceability_status": "REGULAR",
    "localities": [
      "Kothuru Mandal Headquarter",
      "Nivagam",
      "Battili Border",
      "Mahhendragiri Foothills"
    ],
    "transport_modes": [
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Direct roadlink through Kasinagar / Gunupur road.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Battili border connecting Odisha."
  },
  {
    "pincode": "532211",
    "city": "Jalumuru",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "Srikakulam Interior Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Jalumuru Mandal",
      "Challavanipeta",
      "Singupuram",
      "Jalumuru Chowk"
    ],
    "transport_modes": [
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Regular rural road transit.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Central Srikakulam mandal."
  },
  {
    "pincode": "532426",
    "city": "Saravakota",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "Srikakulam Interior Route",
    "serviceability_status": "REGULAR",
    "localities": [
      "Saravakota Mandal",
      "Aludu",
      "Gujjuru",
      "Budithi Road"
    ],
    "transport_modes": [
      "Bus Cargo",
      "Regional Carrier Tempo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "Local tempo delivery from Pathapatnam / Narasannapeta.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Interior agricultural mandal."
  },
  {
    "pincode": "532215",
    "city": "Meliaputti",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "AP Border Immediate Transit Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Chapara",
      "Marripadu",
      "Dinabandhupuram",
      "Meliaputti Main Market"
    ],
    "transport_modes": [
      "Regional Carrier Tempo",
      "Bus Cargo"
    ],
    "transit_duration_label": "1 Day",
    "min_delivery_days": 1,
    "max_delivery_days": 1,
    "standard_shipping_rate": 40.0,
    "delivery_charges_text": "₹40 flat / carton",
    "delivery_conditions": "Daily delivery van link from Paralakhemundi.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Neighbouring mandal to Paralakhemundi."
  },
  {
    "pincode": "532195",
    "city": "Kotabommali",
    "district": "Srikakulam",
    "state": "Andhra Pradesh",
    "zone_name": "North Coastal AP Hub",
    "serviceability_status": "REGULAR",
    "localities": [
      "Kotabommali Junction",
      "Kakarapalli",
      "Nimmada",
      "RTC Bus Stop"
    ],
    "transport_modes": [
      "State Roadlines",
      "Bus Cargo"
    ],
    "transit_duration_label": "1-2 Days",
    "min_delivery_days": 1,
    "max_delivery_days": 2,
    "standard_shipping_rate": 45.0,
    "delivery_charges_text": "₹45 flat / carton",
    "delivery_conditions": "NH-16 direct transit drops.",
    "cod_available": true,
    "daily_transit_available": true,
    "notes": "Major junction on NH-16."
  }
];

const STATUS_LABELS: Record<string, string> = {
  REGULAR: 'Regular Delivery Available',
  CUSTOM_TRANSIT: 'Custom Transit Available',
  PENDING_VERIFICATION: 'Route Verification Required',
  UNAVAILABLE: 'Currently Unavailable',
};

function formatWhatsappUrl(pincode: string, city: string, district: string, state: string, status: string): string {
  const statusLabel = STATUS_LABELS[status] || status;
  const msg = [
    '🚚 *REGIONAL ROAD TRANSPORT & TRANSIT ENQUIRY – SRI BALAJI*',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `📍 *PIN Code:* ${pincode}`,
    `🏙️ *Village / Town:* ${city}`,
    `🗺️ *District / State:* ${district}, ${state}`,
    `🏷️ *Coverage Status:* ${statusLabel}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Namaste Sri Balaji Team, I would like to check transit arrangements, freight charges, and bulk dispatch schedules for my location.'
  ].join('\n');
  return `https://wa.me/919861789602?text=${encodeURIComponent(msg)}`;
}

export function recordToResult(r: StaticCoverageRecord): PincodeCheckResult {
  const isRegular = r.serviceability_status === 'REGULAR';
  let message = '';
  if (r.serviceability_status === 'REGULAR') {
    message = `Regular Delivery Available: Supported scheduled road transport via ${r.zone_name} (${r.transit_duration_label}). Direct factory dispatch vans and regional bus lines run daily.`;
  } else if (r.serviceability_status === 'CUSTOM_TRANSIT') {
    message = `Custom Transit Arrangement Required: ${r.delivery_conditions || 'Special bus parcel or point-to-point tempo required.'} Contact our Wholesale Desk at +91 98617 89602.`;
  } else if (r.serviceability_status === 'PENDING_VERIFICATION') {
    message = 'Serviceability Pending: Route coverage needs business verification. Contact wholesale desk at +91 98617 89602 for custom transit quotes.';
  } else {
    message = 'Currently Unavailable: Location is outside our confirmed scheduled transport routes. Custom road transport can be arranged via wholesale desk.';
  }

  return {
    pincode: r.pincode,
    is_serviceable: isRegular,
    serviceability_status: r.serviceability_status,
    status_label: STATUS_LABELS[r.serviceability_status] || 'Verified Route',
    city: r.city,
    district: r.district,
    state: r.state,
    zone_name: r.zone_name,
    localities: r.localities,
    transport_modes: r.transport_modes,
    transit_duration_label: r.transit_duration_label,
    min_delivery_days: r.min_delivery_days,
    max_delivery_days: r.max_delivery_days,
    standard_shipping_rate: r.standard_shipping_rate,
    delivery_charges_text: r.delivery_charges_text,
    cod_available: r.cod_available,
    daily_transit_available: r.daily_transit_available,
    delivery_conditions: r.delivery_conditions,
    message,
    whatsapp_url: formatWhatsappUrl(r.pincode, r.city, r.district, r.state, r.serviceability_status),
    is_postal_valid: true,
  };
}

export function getFallbackPincodeServiceability(pin: string): PincodeCheckResult | null {
  const clean = pin.trim();
  const match = REGIONAL_COVERAGE_RECORDS.find((r) => r.pincode === clean);
  if (match) {
    return recordToResult(match);
  }
  return null;
}

export function searchFallbackLocations(query: string): { query: string; count: number; results: PincodeCheckResult[] } {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return { query, count: 0, results: [] };

  const matches: PincodeCheckResult[] = [];
  for (const r of REGIONAL_COVERAGE_RECORDS) {
    const inPin = r.pincode.toLowerCase().includes(q);
    const inCity = r.city.toLowerCase().includes(q);
    const inDistrict = r.district.toLowerCase().includes(q);
    const inState = r.state.toLowerCase().includes(q);
    const inZone = r.zone_name.toLowerCase().includes(q);
    const inLocalities = r.localities.some((loc) => loc.toLowerCase().includes(q));

    if (inPin || inCity || inDistrict || inState || inZone || inLocalities) {
      matches.push(recordToResult(r));
    }
  }

  return {
    query,
    count: matches.length,
    results: matches,
  };
}

export function getFallbackHierarchy(): CoverageHierarchyResponse {
  const stateMap = new Map<string, Map<string, any[]>>();

  for (const r of REGIONAL_COVERAGE_RECORDS) {
    if (!stateMap.has(r.state)) {
      stateMap.set(r.state, new Map());
    }
    const distMap = stateMap.get(r.state)!;
    if (!distMap.has(r.district)) {
      distMap.set(r.district, []);
    }
    distMap.get(r.district)!.push({
      pincode: r.pincode,
      city: r.city,
      district: r.district,
      state: r.state,
      zone_name: r.zone_name,
      serviceability_status: r.serviceability_status,
      status_label: STATUS_LABELS[r.serviceability_status] || 'Regular',
      localities: r.localities,
      transport_modes: r.transport_modes,
      transit_duration_label: r.transit_duration_label,
      standard_shipping_rate: r.standard_shipping_rate,
      delivery_charges_text: r.delivery_charges_text,
      cod_available: r.cod_available,
      daily_transit_available: r.daily_transit_available,
    });
  }

  const states = Array.from(stateMap.entries()).map(([stateName, distMap]) => {
    const districts = Array.from(distMap.entries()).map(([distName, locs]) => ({
      district_name: distName,
      locations_count: locs.length,
      locations: locs,
    }));
    return {
      state_name: stateName,
      districts_count: districts.length,
      districts,
    };
  });

  return {
    total_records: REGIONAL_COVERAGE_RECORDS.length,
    supported_transport_methods: ['Regional Carrier Tempo', 'State Roadlines', 'Bus Cargo', 'Private Transport Agencies'],
    states,
  };
}


export interface OdishaDistrictOverview {
  district_name: string;
  hub_city: string;
  primary_pincode: string;
  serviceability_status: 'REGULAR' | 'CUSTOM_TRANSIT' | 'PENDING_VERIFICATION' | 'UNAVAILABLE';
  status_label: string;
  is_serviceable: boolean;
  transit_duration_label: string;
  transport_modes: string[];
  delivery_charges_text: string;
  location_count: number;
  highlight?: string;
}

export const ODISHA_30_DISTRICTS_DATA: OdishaDistrictOverview[] = [
  {
    district_name: 'Gajapati',
    hub_city: 'Paralakhemundi Central Hub',
    primary_pincode: '761200',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: 'Same Day – 1 Day',
    transport_modes: ['Regional Carrier Tempo', 'Bus Cargo', 'State Roadlines'],
    delivery_charges_text: '₹30 flat / carton (Factory Direct)',
    location_count: 9,
    highlight: 'Central Manufacturing Unit & Daily Direct Van Route'
  },
  {
    district_name: 'Ganjam',
    hub_city: 'Berhampur & Chhatrapur',
    primary_pincode: '760001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '1–2 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo', 'Regional Carrier Tempo'],
    delivery_charges_text: '₹35–₹40 flat / carton',
    location_count: 17,
    highlight: 'Daily Commercial Corridor Hub'
  },
  {
    district_name: 'Rayagada',
    hub_city: 'Rayagada & Gunupur',
    primary_pincode: '765001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '1–2 Days',
    transport_modes: ['Bus Cargo', 'State Roadlines', 'Regional Tempo'],
    delivery_charges_text: '₹40–₹45 flat / carton',
    location_count: 10,
    highlight: 'Direct South Odisha Line (Gunupur Hub)'
  },
  {
    district_name: 'Khordha',
    hub_city: 'Bhubaneswar Capital Hub',
    primary_pincode: '751001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '1–2 Days',
    transport_modes: ['Overnight Bus Parcel', 'State Roadlines'],
    delivery_charges_text: '₹40 flat / carton',
    location_count: 2,
    highlight: 'State Capital Daily Express Parcel'
  },
  {
    district_name: 'Cuttack',
    hub_city: 'Cuttack Commercial Hub',
    primary_pincode: '753001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '1–2 Days',
    transport_modes: ['Overnight Bus Parcel', 'State Roadlines'],
    delivery_charges_text: '₹40 flat / carton',
    location_count: 2,
    highlight: 'Malgodown Wholesale Distributor Corridor'
  },
  {
    district_name: 'Puri',
    hub_city: 'Puri Pilgrim City',
    primary_pincode: '752001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2 Days',
    transport_modes: ['Bus Cargo', 'State Roadlines'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 1,
    highlight: 'Grand Road & Coastal Wholesale Network'
  },
  {
    district_name: 'Angul',
    hub_city: 'Angul Industrial City',
    primary_pincode: '759122',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2–3 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹50 flat / carton',
    location_count: 1,
    highlight: 'Central Odisha Industrial Corridor'
  },
  {
    district_name: 'Balangir',
    hub_city: 'Balangir Town',
    primary_pincode: '767001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2–3 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 1,
    highlight: 'Western Odisha Wholesale Link'
  },
  {
    district_name: 'Balasore',
    hub_city: 'Balasore Town',
    primary_pincode: '756001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2–3 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹50 flat / carton',
    location_count: 1,
    highlight: 'North Odisha Coastal Hub'
  },
  {
    district_name: 'Bargarh',
    hub_city: 'Bargarh Town',
    primary_pincode: '768028',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2–3 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 1,
    highlight: 'Western Rice & Wholesale Belt'
  },
  {
    district_name: 'Bhadrak',
    hub_city: 'Bhadrak Town',
    primary_pincode: '756100',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2–3 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹50 flat / carton',
    location_count: 1,
    highlight: 'NH-16 Coastal Corridor'
  },
  {
    district_name: 'Boudh',
    hub_city: 'Boudh Town',
    primary_pincode: '762014',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2–3 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹50 flat / carton',
    location_count: 1,
    highlight: 'Mahanadi Valley Transport Route'
  },
  {
    district_name: 'Deogarh',
    hub_city: 'Deogarh Town',
    primary_pincode: '768108',
    serviceability_status: 'PENDING_VERIFICATION',
    status_label: 'Route Verification Required',
    is_serviceable: false,
    transit_duration_label: '3–4 Days (Upon Booking)',
    transport_modes: ['State Roadlines', 'Private Cargo'],
    delivery_charges_text: 'Custom Freight Quote',
    location_count: 1,
    highlight: 'Route Coverage Requires Prior Dispatch Confirmation'
  },
  {
    district_name: 'Dhenkanal',
    hub_city: 'Dhenkanal Town',
    primary_pincode: '759001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 1,
    highlight: 'Central Corridor Delivery'
  },
  {
    district_name: 'Jagatsinghpur',
    hub_city: 'Jagatsinghpur Town',
    primary_pincode: '754103',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 1,
    highlight: 'Coastal Trading Link'
  },
  {
    district_name: 'Jajpur',
    hub_city: 'Jajpur Town',
    primary_pincode: '755001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 1,
    highlight: 'Biraja Kshetra & Kalinganagar Link'
  },
  {
    district_name: 'Jharsuguda',
    hub_city: 'Jharsuguda Industrial Hub',
    primary_pincode: '768201',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2–3 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹50 flat / carton',
    location_count: 1,
    highlight: 'Western Odisha Transport Interchange'
  },
  {
    district_name: 'Kalahandi',
    hub_city: 'Bhawanipatna',
    primary_pincode: '766001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 1,
    highlight: 'South-West Odisha Wholesale Route'
  },
  {
    district_name: 'Kandhamal',
    hub_city: 'Phulbani & Baliguda',
    primary_pincode: '762001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 6,
    highlight: 'Highland Market Dispatch via Bhanjanagar'
  },
  {
    district_name: 'Kendrapara',
    hub_city: 'Kendrapara Town',
    primary_pincode: '754211',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 1,
    highlight: 'Coastal Distribution Network'
  },
  {
    district_name: 'Kendujhar',
    hub_city: 'Kendujhar (Keonjhar)',
    primary_pincode: '758001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2–3 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹50 flat / carton',
    location_count: 1,
    highlight: 'Mineral Belt & Hill Town Markets'
  },
  {
    district_name: 'Koraput',
    hub_city: 'Jeypore & Koraput',
    primary_pincode: '764020',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '1–2 Days',
    transport_modes: ['Regional Carrier Tempo', 'State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 7,
    highlight: 'Daily Direct Link via Rayagada NH'
  },
  {
    district_name: 'Malkangiri',
    hub_city: 'Malkangiri Town',
    primary_pincode: '764045',
    serviceability_status: 'CUSTOM_TRANSIT',
    status_label: 'Custom Transit Available',
    is_serviceable: false,
    transit_duration_label: '2–3 Days',
    transport_modes: ['Bus Cargo', 'Private Transport Agencies'],
    delivery_charges_text: 'Custom Freight Quote',
    location_count: 1,
    highlight: 'Arranged via Jeypore Transport Link (Contact Desk)'
  },
  {
    district_name: 'Mayurbhanj',
    hub_city: 'Baripada Town',
    primary_pincode: '757001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2–3 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹50 flat / carton',
    location_count: 1,
    highlight: 'North-East Odisha Dispatch'
  },
  {
    district_name: 'Nabarangpur',
    hub_city: 'Nabarangpur Town',
    primary_pincode: '764059',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 1,
    highlight: 'South-West Agriculture Belt'
  },
  {
    district_name: 'Nayagarh',
    hub_city: 'Nayagarh Town',
    primary_pincode: '752069',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 1,
    highlight: 'Central Corridor Highway Route'
  },
  {
    district_name: 'Nuapada',
    hub_city: 'Nuapada Town',
    primary_pincode: '766105',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2–3 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹50 flat / carton',
    location_count: 1,
    highlight: 'Western Border Dispatch'
  },
  {
    district_name: 'Sambalpur',
    hub_city: 'Sambalpur Commercial Hub',
    primary_pincode: '768001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 1,
    highlight: 'Western Odisha Commercial Headquarters'
  },
  {
    district_name: 'Subarnapur',
    hub_city: 'Sonepur Town',
    primary_pincode: '767017',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2–3 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹45 flat / carton',
    location_count: 1,
    highlight: 'Subarnapur Textile & Sweet Town Link'
  },
  {
    district_name: 'Sundargarh',
    hub_city: 'Rourkela Steel City',
    primary_pincode: '769001',
    serviceability_status: 'REGULAR',
    status_label: 'Regular Delivery Available',
    is_serviceable: true,
    transit_duration_label: '2–3 Days',
    transport_modes: ['State Roadlines', 'Bus Cargo'],
    delivery_charges_text: '₹50 flat / carton',
    location_count: 1,
    highlight: 'Steel City Rourkela Daily Parcel Link'
  }
];

export interface PopularLocationGroup {
  groupName: string;
  groupKey: 'nearby_odisha' | 'andhra_pradesh' | 'regional_towns';
  description: string;
  locations: {
    label: string;
    pin: string;
    tag: string;
    status: 'REGULAR' | 'CUSTOM_TRANSIT' | 'PENDING_VERIFICATION';
  }[];
}

export const REGIONAL_LOCATION_GROUPS: PopularLocationGroup[] = [
  {
    groupName: 'Nearby Odisha (Gajapati Corridor)',
    groupKey: 'nearby_odisha',
    description: 'Central factory van & daily tempo routes dispatched from Paralakhemundi',
    locations: [
      { label: 'Paralakhemundi', pin: '761200', tag: 'Central Factory Hub', status: 'REGULAR' },
      { label: 'Kasinagar', pin: '761201', tag: 'Bansadhara Belt', status: 'REGULAR' },
      { label: 'Ranipeta', pin: '761200', tag: 'Local Van Route', status: 'REGULAR' },
      { label: 'Gumma', pin: '761207', tag: 'Hill Market', status: 'REGULAR' },
      { label: 'Mohana', pin: '761206', tag: 'Tibetan Valley', status: 'REGULAR' },
      { label: 'R. Udayagiri', pin: '761205', tag: 'Block Hub', status: 'REGULAR' },
      { label: 'Adava', pin: '761206', tag: 'Daily Van Line', status: 'REGULAR' },
      { label: 'Serango', pin: '761208', tag: 'Direct Tempo', status: 'REGULAR' },
      { label: 'Chandragiri', pin: '761206', tag: 'Highland Junction', status: 'REGULAR' },
      { label: 'Gurandi', pin: '761210', tag: 'Gosani Corridor', status: 'REGULAR' },
      { label: 'Garabandha', pin: '761211', tag: 'Border Village', status: 'REGULAR' },
    ]
  },
  {
    groupName: 'Andhra Pradesh Border Towns',
    groupKey: 'andhra_pradesh',
    description: 'Daily inter-state bus cargo, commercial roadlines, and factory dispatch tempos',
    locations: [
      { label: 'Pathapatnam', pin: '532201', tag: 'Twin Town (2 km)', status: 'REGULAR' },
      { label: 'Palasa', pin: '532221', tag: 'Cashew Hub Junction', status: 'REGULAR' },
      { label: 'Kasibugga', pin: '532222', tag: 'NH-16 Commercial', status: 'REGULAR' },
      { label: 'Tekkali', pin: '532202', tag: 'Mandal Hub', status: 'REGULAR' },
      { label: 'Srikakulam', pin: '532001', tag: 'District City', status: 'REGULAR' },
      { label: 'Amadalavalasa', pin: '532185', tag: 'Railway Junction', status: 'REGULAR' },
      { label: 'Nandigam', pin: '532204', tag: 'NH-16 Corridor', status: 'REGULAR' },
      { label: 'Sompeta', pin: '532284', tag: 'Coastal Market', status: 'REGULAR' },
      { label: 'Ichchapuram', pin: '532312', tag: 'Border Gateway', status: 'REGULAR' },
    ]
  },
  {
    groupName: 'Other Regional Towns (Odisha Hubs)',
    groupKey: 'regional_towns',
    description: 'State roadlines, overnight bus parcel, and full carton freight wholesale delivery',
    locations: [
      { label: 'Gunupur', pin: '765017', tag: 'Bansadhara Line', status: 'REGULAR' },
      { label: 'Berhampur', pin: '760001', tag: 'Silk City Hub', status: 'REGULAR' },
      { label: 'Digapahandi', pin: '761012', tag: 'Ganjam Interior', status: 'REGULAR' },
      { label: 'Chhatrapur', pin: '761020', tag: 'Ganjam HQ', status: 'REGULAR' },
      { label: 'Gopalpur', pin: '761002', tag: 'Coastal Port Town', status: 'REGULAR' },
      { label: 'Rayagada', pin: '765001', tag: 'Industrial Hub', status: 'REGULAR' },
      { label: 'Bhubaneswar', pin: '751001', tag: 'State Capital Hub', status: 'REGULAR' },
      { label: 'Cuttack', pin: '753001', tag: 'Commercial Market', status: 'REGULAR' },
    ]
  }
];

export function getFallbackAutocomplete(query: string): any[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: any[] = [];
  const seenPins = new Set<string>();

  for (const r of REGIONAL_COVERAGE_RECORDS) {
    const inPin = r.pincode.toLowerCase().includes(q);
    const inCity = r.city.toLowerCase().includes(q);
    const inDistrict = r.district.toLowerCase().includes(q);
    const matchedLoc = r.localities.find((loc) => loc.toLowerCase().includes(q));

    if (inPin || inCity || inDistrict || matchedLoc) {
      if (seenPins.has(r.pincode)) continue;
      seenPins.add(r.pincode);

      let display = `${r.city}, ${r.district}, ${r.state} – ${r.pincode}`;
      if (matchedLoc && matchedLoc.toLowerCase() !== r.city.toLowerCase()) {
        display = `${matchedLoc} (${r.city}), ${r.district} – ${r.pincode}`;
      }

      results.push({
        pincode: r.pincode,
        city: r.city,
        district: r.district,
        state: r.state,
        matched_locality: matchedLoc,
        display_label: display,
        serviceability_status: r.serviceability_status,
        status_label: STATUS_LABELS[r.serviceability_status] || 'Regular Delivery Available',
        is_serviceable: r.serviceability_status === 'REGULAR',
      });
      if (results.length >= 8) break;
    }
  }
  return results;
}
