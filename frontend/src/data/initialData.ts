import { Category, Product, BusinessSettings, Bundle } from '../types';

export const initialBusinessSettings: BusinessSettings = {
  business_name: "Sri Balaji",
  owner_name: "Adari Krishna Rao & Adari Dilleshwar Rao",
  category: "Wholesale Snacks / Food Products",
  address: "Gandhi School Road, Near Post Office",
  city: "Paralakhemundi",
  state: "Odisha",
  pin_code: "761200",
  contact_number: "+91 94371 35342 / +91 77353 33542",
  whatsapp_number: "919861789602",
  email_address: "", // NA - hidden
  google_maps_url: "https://www.google.com/maps/search/?api=1&query=Gandhi+School+Road+Near+Post+Office+Paralakhemundi+Gajapati+Odisha+761200",
  business_hours: "Direct Wholesale Inquiries & Orders Open Daily",
  years_in_business: "30",
  business_description: "Sri Balaji offers a variety of fresh, tasty, and crispy snacks, including mixtures, chips, and more. We focus on good quality, hygiene, great taste, and customer satisfaction.",
  tagline: "Taste the Tradition.",
  fssai_number: "", // Intentionally empty until verified by business owner
  food_prep_method: "Traditional deep frying in high-grade refined cooking oils with stringent temperature control to preserve unmatched crunch and taste.",
  packaging_method: "Multi-layer moisture-barrier food-grade sealed pouches and wholesale cartons for fresh delivery.",
  quality_control: "Carefully sourced raw gram, groundnuts, spices, and fresh potatoes tested for crispness, purity, and hygiene.",
  hygiene_standards: "Sanitized preparation facility, hygiene-certified handling, and food-grade packaging materials.",
  delivery_availability: "Wholesale consignments to retail kirana stores, supermarkets, caterers, and regional transport hubs.",
  wholesale_locations: "Paralakhemundi, Gajapati, Odisha and neighbouring trade distributor networks.",
  payment_methods: "UPI, Bank Transfer (NEFT/RTGS), Cash on Delivery/Dispatch.",
  instagram_url: "https://www.instagram.com/sri_balaji_special_mixtures?utm_source=ig_web_button_share_sheet&cplk=ZDNlZDc0MzIxNw==",
  facebook_url: "",
  youtube_url: ""
};

export const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "Special Mixtures",
    slug: "mixtures",
    description: "Sri Balaji signature crispy mixtures made with fried besan sev, spicy boondi, roasted groundnuts, and aromatic curry leaves.",
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    display_order: 1,
    is_active: true
  },
  {
    id: "cat-2",
    name: "Chips & Wafers",
    slug: "chips",
    description: "Golden-crisp farm-fresh potato chips and raw banana wafers seasoned with rock salt and traditional spices.",
    image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
    display_order: 2,
    is_active: true
  },
  {
    id: "cat-3",
    name: "Traditional Snacks",
    slug: "traditional-snacks",
    description: "Classic South Indian and Odisha savouries including Ribbon Pakoda, Kara Boondi, Murukku, and Thattai.",
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    display_order: 3,
    is_active: true
  },
  {
    id: "cat-4",
    name: "Spicy Crunchies",
    slug: "spicy-snacks",
    description: "Fiery Kara Boondi, Pepper Sev, and masala crunchies for spice lovers.",
    image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
    display_order: 4,
    is_active: true
  },
  {
    id: "cat-5",
    name: "Special Savouries",
    slug: "special-snacks",
    description: "Festive celebration savouries, Cashew Pepper Mixture, and premium dry-fruit treats.",
    image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80",
    display_order: 5,
    is_active: true
  }
];

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    category_id: "cat-1",
    name: "Sri Balaji Special Royal Mixture",
    slug: "sri-balaji-special-royal-mixture",
    description: "Our signature 30-year heritage blend of crispy besan sev, spicy kara boondi, roasted groundnuts, premium split cashews, and aromatic fried curry leaves.",
    food_classification: "VEGETARIAN",
    spice_level: "MEDIUM",
    taste_profiles: ["Crunchy", "Spicy", "Traditional"],
    ingredients: "Gram flour (Besan), Rice flour, Refined edible vegetable oil, Groundnuts, Cashew nuts, Roasted gram, Curry leaves, Red chilli powder, Rock salt, Asafoetida (Hing).",
    allergen_info: "Contains Peanuts and Tree Nuts (Cashews).",
    packaging_info: "Airtight moisture-barrier food-grade pouch preserving crunch for 90 days.",
    minimum_order_qty: 2,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-1-1", product_id: "prod-1", weight_label: "250g", weight_in_grams: 250, retail_price: 90, wholesale_price: 70, stock_quantity: 450, is_in_stock: true, sku: "SBSM-250G" },
      { id: "v-1-2", product_id: "prod-1", weight_label: "500g", weight_in_grams: 500, retail_price: 175, wholesale_price: 135, stock_quantity: 320, is_in_stock: true, sku: "SBSM-500G" },
      { id: "v-1-3", product_id: "prod-1", weight_label: "1kg", weight_in_grams: 1000, retail_price: 340, wholesale_price: 265, stock_quantity: 210, is_in_stock: true, sku: "SBSM-1KG" },
      { id: "v-1-4", product_id: "prod-1", weight_label: "5kg Bulk Carton", weight_in_grams: 5000, retail_price: 1650, wholesale_price: 1280, stock_quantity: 85, is_in_stock: true, sku: "SBSM-5KG" }
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
    description: "Farm-fresh potatoes thinly sliced and fried to an ultra-crisp golden crunch, lightly seasoned with hand-pounded rock salt.",
    food_classification: "VEGETARIAN",
    spice_level: "MILD",
    taste_profiles: ["Crunchy", "Salty"],
    ingredients: "Fresh selected potatoes, Refined edible vegetable oil, Rock salt.",
    allergen_info: "Gluten-free. 100% vegetarian.",
    packaging_info: "Airtight sealed moisture-lock pillow pouch.",
    minimum_order_qty: 5,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-2-1", product_id: "prod-2", weight_label: "100g", weight_in_grams: 100, retail_price: 40, wholesale_price: 30, stock_quantity: 600, is_in_stock: true, sku: "SBPC-100G" },
      { id: "v-2-2", product_id: "prod-2", weight_label: "250g", weight_in_grams: 250, retail_price: 100, wholesale_price: 75, stock_quantity: 400, is_in_stock: true, sku: "SBPC-250G" },
      { id: "v-2-3", product_id: "prod-2", weight_label: "500g", weight_in_grams: 500, retail_price: 195, wholesale_price: 145, stock_quantity: 250, is_in_stock: true, sku: "SBPC-500G" },
      { id: "v-2-4", product_id: "prod-2", weight_label: "3kg Wholesale Sack", weight_in_grams: 3000, retail_price: 1100, wholesale_price: 820, stock_quantity: 40, is_in_stock: true, sku: "SBPC-3KG" }
    ],
    images: [
      { id: "img-2-1", product_id: "prod-2", image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-3",
    category_id: "cat-3",
    name: "Crispy Ribbon Pakoda",
    slug: "crispy-ribbon-pakoda",
    description: "Traditional ribbon-shaped golden crunchy strips infused with roasted cumin seeds, crushed garlic, and pure spices.",
    food_classification: "VEGETARIAN",
    spice_level: "MEDIUM",
    taste_profiles: ["Crunchy", "Traditional", "Mild"],
    ingredients: "Rice flour, Gram flour, Edible vegetable oil, Cumin, Red chilli powder, Salt, Asafoetida.",
    allergen_info: "Gluten-free, vegetarian.",
    packaging_info: "Sealed food-grade pouch.",
    minimum_order_qty: 3,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-3-1", product_id: "prod-3", weight_label: "250g", weight_in_grams: 250, retail_price: 85, wholesale_price: 65, stock_quantity: 350, is_in_stock: true, sku: "SBRP-250G" },
      { id: "v-3-2", product_id: "prod-3", weight_label: "500g", weight_in_grams: 500, retail_price: 165, wholesale_price: 125, stock_quantity: 280, is_in_stock: true, sku: "SBRP-500G" },
      { id: "v-3-3", product_id: "prod-3", weight_label: "1kg", weight_in_grams: 1000, retail_price: 320, wholesale_price: 245, stock_quantity: 140, is_in_stock: true, sku: "SBRP-1KG" }
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
    description: "Tiny crispy droplets of spiced chickpea flour blended with deep-fried garlic, crunchy roasted peanuts, and curry leaves.",
    food_classification: "VEGETARIAN",
    spice_level: "SPICY",
    taste_profiles: ["Spicy", "Crunchy", "Salty"],
    ingredients: "Bengal gram flour, Peanuts, Garlic, Edible vegetable oil, Curry leaves, Red chilli, Salt, Hing.",
    allergen_info: "Contains Peanuts.",
    packaging_info: "Moisture-barrier nitrogen-flushed pouch.",
    minimum_order_qty: 3,
    is_available: true,
    is_featured: false,
    variants: [
      { id: "v-4-1", product_id: "prod-4", weight_label: "250g", weight_in_grams: 250, retail_price: 80, wholesale_price: 60, stock_quantity: 400, is_in_stock: true, sku: "SBKB-250G" },
      { id: "v-4-2", product_id: "prod-4", weight_label: "500g", weight_in_grams: 500, retail_price: 155, wholesale_price: 118, stock_quantity: 300, is_in_stock: true, sku: "SBKB-500G" },
      { id: "v-4-3", product_id: "prod-4", weight_label: "1kg", weight_in_grams: 1000, retail_price: 300, wholesale_price: 230, stock_quantity: 180, is_in_stock: true, sku: "SBKB-1KG" }
    ],
    images: [
      { id: "img-4-1", product_id: "prod-4", image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-5",
    category_id: "cat-2",
    name: "Crispy Raw Banana Chips",
    slug: "crispy-raw-banana-chips",
    description: "Fresh banana wafers fried to perfection, seasoned with mild sea salt and turmeric.",
    food_classification: "VEGETARIAN",
    spice_level: "MILD",
    taste_profiles: ["Crunchy", "Salty", "Traditional"],
    ingredients: "Raw bananas, Refined edible vegetable oil, Turmeric, Sea salt.",
    allergen_info: "Gluten-free, 100% plant based.",
    packaging_info: "Airtight foil-sealed pouch.",
    minimum_order_qty: 4,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-5-1", product_id: "prod-5", weight_label: "250g", weight_in_grams: 250, retail_price: 110, wholesale_price: 85, stock_quantity: 300, is_in_stock: true, sku: "SBBC-250G" },
      { id: "v-5-2", product_id: "prod-5", weight_label: "500g", weight_in_grams: 500, retail_price: 215, wholesale_price: 165, stock_quantity: 210, is_in_stock: true, sku: "SBBC-500G" },
      { id: "v-5-3", product_id: "prod-5", weight_label: "1kg", weight_in_grams: 1000, retail_price: 420, wholesale_price: 320, stock_quantity: 120, is_in_stock: true, sku: "SBBC-1KG" }
    ],
    images: [
      { id: "img-5-1", product_id: "prod-5", image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-6",
    category_id: "cat-5",
    name: "Special Cashew Pepper Mixture",
    slug: "special-cashew-pepper-mixture",
    description: "Rich festive savoury loaded with whole roasted cashews, crushed black pepper, roasted corn flakes, and crunchy sev.",
    food_classification: "VEGETARIAN",
    spice_level: "MEDIUM",
    taste_profiles: ["Crunchy", "Spicy", "Traditional"],
    ingredients: "Whole cashews, Corn flakes, Chickpea flour, Black pepper, Edible vegetable oil, Salt, Curry leaves.",
    allergen_info: "Contains Tree Nuts (Cashews).",
    packaging_info: "Zipper pouch with moisture barrier.",
    minimum_order_qty: 2,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-6-1", product_id: "prod-6", weight_label: "250g", weight_in_grams: 250, retail_price: 180, wholesale_price: 140, stock_quantity: 200, is_in_stock: true, sku: "SBCM-250G" },
      { id: "v-6-2", product_id: "prod-6", weight_label: "500g", weight_in_grams: 500, retail_price: 350, wholesale_price: 275, stock_quantity: 150, is_in_stock: true, sku: "SBCM-500G" },
      { id: "v-6-3", product_id: "prod-6", weight_label: "1kg", weight_in_grams: 1000, retail_price: 680, wholesale_price: 540, stock_quantity: 80, is_in_stock: true, sku: "SBCM-1KG" }
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
    description: "Fast-moving wholesale starter assortment for grocery & kirana stores: 5kg Sri Balaji Special Mixture + 3kg Salted Potato Chips + 3kg Ribbon Pakoda.",
    bundle_price: 4150,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    is_active: true
  },
  {
    id: "bundle-2",
    name: "Evening Family Tea-Time Box",
    slug: "evening-family-tea-time-box",
    description: "The complete household snacking pack: 500g Sri Balaji Special Mixture, 500g Ribbon Pakoda, 500g Banana Chips, and 250g Kara Boondi.",
    bundle_price: 640,
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    is_active: true
  },
  {
    id: "bundle-3",
    name: "Spicy Crunch Celebration Pack",
    slug: "spicy-crunch-celebration-pack",
    description: "Spicy Garlic Boondi, Cashew Pepper Mixture, and Sri Balaji Special Mixture in 500g pouches.",
    bundle_price: 760,
    image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    is_active: true
  }
];
