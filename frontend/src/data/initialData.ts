import { Category, Product, BusinessSettings, Bundle } from '../types';

export const initialBusinessSettings: BusinessSettings = {
  business_name: "Sri Balaji",
  owner_name: "[Provided upon request]",
  category: "Wholesale Snacks & Traditional Indian Savouries",
  address: "Wholesale Food Market, Main Road",
  city: "Hyderabad / Regional Hub",
  state: "Telangana / South India",
  pin_code: "500001",
  contact_number: "+91 98765 43210",
  whatsapp_number: "919876543210",
  email_address: "orders@sribalajisnacks.com",
  google_maps_url: "https://maps.google.com",
  business_hours: "Monday – Saturday: 9:00 AM – 8:00 PM (Sunday: Closed)",
  years_in_business: "15+",
  business_description: "Sri Balaji is a premier wholesale snack manufacturer dedicated to producing crispy, authentic, and hygienic Indian savouries, special mixtures, and potato & banana chips crafted with fresh edible oil and traditional recipes.",
  tagline: "Unmatched Crispness, Authentic Flavours, Wholesale Value",
  fssai_number: "", // Intentionally empty until verified by business owner
  food_prep_method: "Traditional deep frying in refined quality groundnut/sunflower oils with automated temperature regulation to preserve crunch and prevent oil saturation.",
  packaging_method: "Multi-layer nitrogen-flushed food-grade moisture-barrier pouches and bulk corrugated cartons for transit durability.",
  quality_control: "Batch-wise moisture testing, oil quality checks, and strict raw material screening for high grade grams, cashews, and spices.",
  hygiene_standards: "Sanitized preparation areas, hairnets, hand-washing protocols, and stainless steel processing equipment.",
  delivery_availability: "Daily wholesale supply to retail kirana stores, supermarkets, event caterers, and inter-city transport logistics.",
  wholesale_locations: "Telangana, Andhra Pradesh, and South Indian regional distributor hubs.",
  payment_methods: "UPI, Bank NEFT/RTGS, Cheque (approved trade credit), Cash on Dispatch.",
  instagram_url: "",
  facebook_url: "",
  youtube_url: ""
};

export const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "Mixtures",
    slug: "mixtures",
    description: "Signature crunchy savouries made with fried sev, boondi, roasted peanuts, cashew nuts, and curry leaves.",
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    display_order: 1,
    is_active: true
  },
  {
    id: "cat-2",
    name: "Chips & Wafers",
    slug: "chips",
    description: "Thinly sliced, golden-crisp potato and raw banana chips seasoned with mild rock salt and cracked pepper.",
    image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
    display_order: 2,
    is_active: true
  },
  {
    id: "cat-3",
    name: "Traditional Snacks",
    slug: "traditional-snacks",
    description: "Time-honoured South Indian delicacies including Murukku, Thattai, Ribbon Pakoda, and Seedai.",
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    display_order: 3,
    is_active: true
  },
  {
    id: "cat-4",
    name: "Spicy Snacks",
    slug: "spicy-snacks",
    description: "Fiery Kara Boondi, Pepper Sev, Masala Peanuts, and spicy crunchy treats for high-intensity taste lovers.",
    image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
    display_order: 4,
    is_active: true
  },
  {
    id: "cat-5",
    name: "Special Snacks",
    slug: "special-snacks",
    description: "Rich dry-fruit mixtures, Cashew Pakoda, and festival celebration delights crafted for special occasions.",
    image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80",
    display_order: 5,
    is_active: true
  }
];

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    category_id: "cat-1",
    name: "Special Madras Royal Mixture",
    slug: "special-madras-royal-mixture",
    description: "Our signature blend of crispy besan sev, spicy kara boondi, roasted groundnuts, premium split cashews, roasted gram, and aromatic fried curry leaves with a secret touch of hing and Kashmiri chilli.",
    food_classification: "VEGETARIAN",
    spice_level: "MEDIUM",
    taste_profiles: ["Crunchy", "Spicy", "Traditional"],
    ingredients: "Gram flour (Besan), Rice flour, Refined vegetable oil, Groundnuts, Cashew nuts, Roasted gram, Curry leaves, Chilli powder, Salt, Asafoetida.",
    allergen_info: "Contains Tree Nuts (Cashews) and Peanuts.",
    packaging_info: "Airtight nitrogen-flushed pouch. Retains crunch for 90 days.",
    minimum_order_qty: 2,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-1-1", product_id: "prod-1", weight_label: "250g", weight_in_grams: 250, retail_price: 95, wholesale_price: 75, stock_quantity: 450, is_in_stock: true, sku: "SBM-250G" },
      { id: "v-1-2", product_id: "prod-1", weight_label: "500g", weight_in_grams: 500, retail_price: 185, wholesale_price: 145, stock_quantity: 320, is_in_stock: true, sku: "SBM-500G" },
      { id: "v-1-3", product_id: "prod-1", weight_label: "1kg", weight_in_grams: 1000, retail_price: 360, wholesale_price: 280, stock_quantity: 210, is_in_stock: true, sku: "SBM-1KG" },
      { id: "v-1-4", product_id: "prod-1", weight_label: "5kg Bulk Carton", weight_in_grams: 5000, retail_price: 1750, wholesale_price: 1350, stock_quantity: 85, is_in_stock: true, sku: "SBM-5KG" }
    ],
    images: [
      { id: "img-1-1", product_id: "prod-1", image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-2",
    category_id: "cat-2",
    name: "Classic Salted Golden Potato Chips",
    slug: "classic-salted-golden-potato-chips",
    description: "Farm-fresh high-solids potatoes thinly sliced and kettle fried to an ultra-crisp golden crunch, lightly seasoned with hand-pounded rock salt.",
    food_classification: "VEGETARIAN",
    spice_level: "MILD",
    taste_profiles: ["Crunchy", "Salty"],
    ingredients: "Farm-fresh potatoes, Edible vegetable oil, Rock salt.",
    allergen_info: "Gluten-free. Processed in a facility that also handles nuts.",
    packaging_info: "Foil-sealed pillow pouch protecting delicate wafers from transit breakage.",
    minimum_order_qty: 5,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-2-1", product_id: "prod-2", weight_label: "100g", weight_in_grams: 100, retail_price: 45, wholesale_price: 32, stock_quantity: 600, is_in_stock: true, sku: "SBPC-100G" },
      { id: "v-2-2", product_id: "prod-2", weight_label: "250g", weight_in_grams: 250, retail_price: 110, wholesale_price: 80, stock_quantity: 400, is_in_stock: true, sku: "SBPC-250G" },
      { id: "v-2-3", product_id: "prod-2", weight_label: "500g", weight_in_grams: 500, retail_price: 210, wholesale_price: 155, stock_quantity: 250, is_in_stock: true, sku: "SBPC-500G" },
      { id: "v-2-4", product_id: "prod-2", weight_label: "3kg Wholesale Sack", weight_in_grams: 3000, retail_price: 1200, wholesale_price: 880, stock_quantity: 40, is_in_stock: true, sku: "SBPC-3KG" }
    ],
    images: [
      { id: "img-2-1", product_id: "prod-2", image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-3",
    category_id: "cat-3",
    name: "Crispy Ribbon Pakoda (Ola Pakoda)",
    slug: "crispy-ribbon-pakoda",
    description: "Traditional ribbon-shaped golden crunchy strips infused with roasted cumin seeds, crushed garlic extract, and pure butter for that melt-in-mouth crispiness.",
    food_classification: "VEGETARIAN",
    spice_level: "MEDIUM",
    taste_profiles: ["Crunchy", "Traditional", "Mild"],
    ingredients: "Rice flour, Gram flour, Butter, Edible vegetable oil, Cumin, Red chilli powder, Salt, Asafoetida.",
    allergen_info: "Contains dairy (Butter).",
    packaging_info: "Airtight sealed food-grade pouch.",
    minimum_order_qty: 3,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-3-1", product_id: "prod-3", weight_label: "250g", weight_in_grams: 250, retail_price: 90, wholesale_price: 70, stock_quantity: 350, is_in_stock: true, sku: "SBRP-250G" },
      { id: "v-3-2", product_id: "prod-3", weight_label: "500g", weight_in_grams: 500, retail_price: 175, wholesale_price: 135, stock_quantity: 280, is_in_stock: true, sku: "SBRP-500G" },
      { id: "v-3-3", product_id: "prod-3", weight_label: "1kg", weight_in_grams: 1000, retail_price: 340, wholesale_price: 260, stock_quantity: 140, is_in_stock: true, sku: "SBRP-1KG" }
    ],
    images: [
      { id: "img-3-1", product_id: "prod-3", image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-4",
    category_id: "cat-4",
    name: "Spicy Garlic Kara Boondi",
    slug: "spicy-garlic-kara-boondi",
    description: "Tiny crispy droplets of spiced chickpea flour blended with deep-fried garlic cloves, roasted crunchy peanuts, and fresh garden curry leaves tossed in fiery red chilli spice.",
    food_classification: "VEGETARIAN",
    spice_level: "SPICY",
    taste_profiles: ["Spicy", "Crunchy", "Salty"],
    ingredients: "Bengal gram flour, Peanuts, Garlic cloves, Refined oil, Curry leaves, Kashmiri chilli, Salt, Hing.",
    allergen_info: "Contains Peanuts.",
    packaging_info: "Heavy barrier moisture-lock pouch.",
    minimum_order_qty: 3,
    is_available: true,
    is_featured: false,
    variants: [
      { id: "v-4-1", product_id: "prod-4", weight_label: "250g", weight_in_grams: 250, retail_price: 85, wholesale_price: 65, stock_quantity: 400, is_in_stock: true, sku: "SBKB-250G" },
      { id: "v-4-2", product_id: "prod-4", weight_label: "500g", weight_in_grams: 500, retail_price: 165, wholesale_price: 125, stock_quantity: 300, is_in_stock: true, sku: "SBKB-500G" },
      { id: "v-4-3", product_id: "prod-4", weight_label: "1kg", weight_in_grams: 1000, retail_price: 320, wholesale_price: 245, stock_quantity: 180, is_in_stock: true, sku: "SBKB-1KG" }
    ],
    images: [
      { id: "img-4-1", product_id: "prod-4", image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-5",
    category_id: "cat-2",
    name: "Authentic Kerala Raw Banana Chips",
    slug: "authentic-kerala-raw-banana-chips",
    description: "Crisp yellow wafers made from prime Nendran bananas fried in cold-pressed coconut oil, sprinkled with sea salt and a subtle hint of turmeric.",
    food_classification: "VEGETARIAN",
    spice_level: "MILD",
    taste_profiles: ["Crunchy", "Salty", "Traditional"],
    ingredients: "Raw Nendran bananas, Pure coconut oil, Turmeric, Sea salt.",
    allergen_info: "Gluten-free, 100% plant based.",
    packaging_info: "Opaque foil pouch protecting from light oxidation.",
    minimum_order_qty: 4,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-5-1", product_id: "prod-5", weight_label: "250g", weight_in_grams: 250, retail_price: 120, wholesale_price: 90, stock_quantity: 300, is_in_stock: true, sku: "SBBC-250G" },
      { id: "v-5-2", product_id: "prod-5", weight_label: "500g", weight_in_grams: 500, retail_price: 235, wholesale_price: 175, stock_quantity: 210, is_in_stock: true, sku: "SBBC-500G" },
      { id: "v-5-3", product_id: "prod-5", weight_label: "1kg", weight_in_grams: 1000, retail_price: 460, wholesale_price: 340, stock_quantity: 120, is_in_stock: true, sku: "SBBC-1KG" }
    ],
    images: [
      { id: "img-5-1", product_id: "prod-5", image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-6",
    category_id: "cat-5",
    name: "Royal Cashew Pepper Mixture",
    slug: "royal-cashew-pepper-mixture",
    description: "A luxury festive snack loaded with 40% whole roasted cashews, crushed black Malabar peppercorns, roasted corn flakes, and thin aromatic sev.",
    food_classification: "VEGETARIAN",
    spice_level: "MEDIUM",
    taste_profiles: ["Crunchy", "Spicy", "Traditional"],
    ingredients: "Whole cashews, Corn flakes, Chickpea flour, Black pepper, Edible vegetable oil, Salt, Curry leaves.",
    allergen_info: "Contains Tree Nuts (Cashews).",
    packaging_info: "Premium stand-up zipper pouch with clear window.",
    minimum_order_qty: 2,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-6-1", product_id: "prod-6", weight_label: "250g", weight_in_grams: 250, retail_price: 190, wholesale_price: 150, stock_quantity: 200, is_in_stock: true, sku: "SBCM-250G" },
      { id: "v-6-2", product_id: "prod-6", weight_label: "500g", weight_in_grams: 500, retail_price: 370, wholesale_price: 295, stock_quantity: 150, is_in_stock: true, sku: "SBCM-500G" },
      { id: "v-6-3", product_id: "prod-6", weight_label: "1kg", weight_in_grams: 1000, retail_price: 720, wholesale_price: 575, stock_quantity: 80, is_in_stock: true, sku: "SBCM-1KG" }
    ],
    images: [
      { id: "img-6-1", product_id: "prod-6", image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80", is_primary: true, display_order: 1 }
    ]
  }
];

export const initialBundles: Bundle[] = [
  {
    id: "bundle-1",
    name: "Wholesale Kirana Starter Combo",
    slug: "wholesale-kirana-starter-combo",
    description: "Curated fast-moving wholesale bundle designed for grocery stores and retail shelves: 5kg Madras Mixture + 3kg Salted Potato Chips + 3kg Ribbon Pakoda.",
    bundle_price: 4350,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    is_active: true
  },
  {
    id: "bundle-2",
    name: "Evening Family Tea-Time Box",
    slug: "evening-family-tea-time-box",
    description: "The complete household snacking pack: 500g Madras Mixture, 500g Ribbon Pakoda, 500g Banana Chips, and 250g Spicy Kara Boondi.",
    bundle_price: 680,
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    is_active: true
  },
  {
    id: "bundle-3",
    name: "Spicy Crunch Lovers Feast",
    slug: "spicy-crunch-lovers-feast",
    description: "For spice enthusiasts: 500g Spicy Garlic Boondi, 500g Pepper Cashew Mixture, and 500g Madras Mixture.",
    bundle_price: 799,
    image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    is_active: true
  }
];

