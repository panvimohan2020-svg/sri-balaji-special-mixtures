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
  quality_control: "Carefully sourced raw gram, groundnuts, spices, and fresh ingredients tested for crispness, purity, and hygiene.",
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
    image_url: "/images/products/onion-mixture.png",
    display_order: 1,
    is_active: true
  },
  {
    id: "cat-2",
    name: "Chips & Wafers",
    slug: "chips",
    description: "Golden-crisp savoury corn chips, potato wafers, and crunchy snack bites seasoned with traditional spices.",
    image_url: "/images/brand/seven-flavors-lineup.png",
    display_order: 2,
    is_active: true
  },
  {
    id: "cat-3",
    name: "Traditional Snacks",
    slug: "traditional-snacks",
    description: "Classic South Indian and Odisha savouries including Kar Kar Murrukulu, Crispy Rings Chegodilu, and Ribbon Pakoda.",
    image_url: "/images/products/kar-kar-murrukulu.png",
    display_order: 3,
    is_active: true
  },
  {
    id: "cat-4",
    name: "Spicy Crunchies",
    slug: "spicy-snacks",
    description: "Crispy Peanuts Pakodi, spicy mixture blends, and fiery crunchies for spice lovers.",
    image_url: "/images/products/crispy-peanuts-pakodi.png",
    display_order: 4,
    is_active: true
  },
  {
    id: "cat-5",
    name: "Special Savouries",
    slug: "special-snacks",
    description: "Festive celebration savouries, Gujarat Mix Chivda, Kaju Biscuits Mixture, and multi-flavour combo packs.",
    image_url: "/images/products/gujarat-mix-chivda.png",
    display_order: 5,
    is_active: true
  }
];

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    category_id: "cat-1",
    name: "Onion Mixture",
    slug: "onion-mixture",
    description: "Sri Balaji's authentic signature Onion Mixture prepared with crispy golden besan sev, roasted peanuts, crunchy fried onions, and fragrant curry leaves.",
    food_classification: "VEGETARIAN",
    spice_level: "MEDIUM",
    taste_profiles: ["Crunchy", "Savory", "Traditional"],
    ingredients: "Gram flour (Besan), Crispy fried onions, Refined edible vegetable oil, Roasted groundnuts, Curry leaves, Red chilli powder, Rock salt, Asafoetida (Hing).",
    allergen_info: "Contains Groundnuts (Peanuts). 100% Pure Vegetarian.",
    packaging_info: "Airtight moisture-barrier food-grade sealed pouch preserving crunch for 90 days.",
    minimum_order_qty: 2,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-1-1", product_id: "prod-1", weight_label: "250g", weight_in_grams: 250, retail_price: 60, wholesale_price: 48, stock_quantity: 450, is_in_stock: true, sku: "SBOM-250G" },
      { id: "v-1-2", product_id: "prod-1", weight_label: "500g", weight_in_grams: 500, retail_price: 120, wholesale_price: 95, stock_quantity: 320, is_in_stock: true, sku: "SBOM-500G" },
      { id: "v-1-3", product_id: "prod-1", weight_label: "1kg", weight_in_grams: 1000, retail_price: 240, wholesale_price: 185, stock_quantity: 210, is_in_stock: true, sku: "SBOM-1KG" },
      { id: "v-1-4", product_id: "prod-1", weight_label: "5kg Bulk Carton", weight_in_grams: 5000, retail_price: 1150, wholesale_price: 900, stock_quantity: 85, is_in_stock: true, sku: "SBOM-5KG" }
    ],
    images: [
      { id: "img-1-1", product_id: "prod-1", image_url: "/images/products/onion-mixture.png", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-2",
    category_id: "cat-1",
    name: "Chuda Mixture (Poha Mixture)",
    slug: "chuda-mixture",
    description: "Crispy roasted and lightly fried flattened rice (chuda/poha) tossed with roasted groundnuts, crispy sev, curry leaves, and traditional mild aromatic spices.",
    food_classification: "VEGETARIAN",
    spice_level: "MILD",
    taste_profiles: ["Crunchy", "Light", "Traditional"],
    ingredients: "Flattened rice (Chuda/Poha), Groundnuts, Bengal gram flour, Edible vegetable oil, Curry leaves, Turmeric, Rock salt, Mild spice blend.",
    allergen_info: "Contains Groundnuts (Peanuts). 100% Pure Vegetarian.",
    packaging_info: "Airtight sealed moisture-barrier green pouch.",
    minimum_order_qty: 2,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-2-1", product_id: "prod-2", weight_label: "250g", weight_in_grams: 250, retail_price: 60, wholesale_price: 48, stock_quantity: 400, is_in_stock: true, sku: "SBCM-250G" },
      { id: "v-2-2", product_id: "prod-2", weight_label: "500g", weight_in_grams: 500, retail_price: 120, wholesale_price: 95, stock_quantity: 300, is_in_stock: true, sku: "SBCM-500G" },
      { id: "v-2-3", product_id: "prod-2", weight_label: "1kg", weight_in_grams: 1000, retail_price: 240, wholesale_price: 185, stock_quantity: 180, is_in_stock: true, sku: "SBCM-1KG" },
      { id: "v-2-4", product_id: "prod-2", weight_label: "5kg Bulk Carton", weight_in_grams: 5000, retail_price: 1150, wholesale_price: 900, stock_quantity: 50, is_in_stock: true, sku: "SBCM-5KG" }
    ],
    images: [
      { id: "img-2-1", product_id: "prod-2", image_url: "/images/products/chuda-mixture.png", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-3",
    category_id: "cat-4",
    name: "Crispy Peanuts Pakodi",
    slug: "crispy-peanuts-pakodi",
    description: "Plump high-grade groundnuts double-coated in spicy seasoned chickpea flour batter and fried to a deep golden, crunchy perfection.",
    food_classification: "VEGETARIAN",
    spice_level: "SPICY",
    taste_profiles: ["Crunchy", "Spicy", "Nutty"],
    ingredients: "Selected Groundnuts, Bengal gram flour (Besan), Rice flour, Edible vegetable oil, Red chilli powder, Garlic hint, Salt, Hing.",
    allergen_info: "Contains Groundnuts (Peanuts). 100% Pure Vegetarian.",
    packaging_info: "Airtight moisture-barrier food-grade sealed red pouch.",
    minimum_order_qty: 2,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-3-1", product_id: "prod-3", weight_label: "250g", weight_in_grams: 250, retail_price: 60, wholesale_price: 50, stock_quantity: 350, is_in_stock: true, sku: "SBPP-250G" },
      { id: "v-3-2", product_id: "prod-3", weight_label: "500g", weight_in_grams: 500, retail_price: 130, wholesale_price: 105, stock_quantity: 280, is_in_stock: true, sku: "SBPP-500G" },
      { id: "v-3-3", product_id: "prod-3", weight_label: "1kg", weight_in_grams: 1000, retail_price: 260, wholesale_price: 205, stock_quantity: 140, is_in_stock: true, sku: "SBPP-1KG" },
      { id: "v-3-4", product_id: "prod-3", weight_label: "5kg Bulk Carton", weight_in_grams: 5000, retail_price: 1250, wholesale_price: 1000, stock_quantity: 60, is_in_stock: true, sku: "SBPP-5KG" }
    ],
    images: [
      { id: "img-3-1", product_id: "prod-3", image_url: "/images/products/crispy-peanuts-pakodi.png", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-4",
    category_id: "cat-3",
    name: "Crispy Rings (Chegodilu)",
    slug: "crispy-rings",
    description: "Classic traditional savory ring snacks (Chegodilu) made from rice flour dough seasoned with sesame seeds, cumin, and mild spices with an irresistible snap.",
    food_classification: "VEGETARIAN",
    spice_level: "MEDIUM",
    taste_profiles: ["Crispy", "Savory", "Traditional"],
    ingredients: "Rice flour, Moong dal, Edible vegetable oil, White sesame seeds, Cumin seeds, Rock salt, Mild red chilli.",
    allergen_info: "Contains Sesame. 100% Pure Vegetarian.",
    packaging_info: "Airtight moisture-barrier teal sealed pouch.",
    minimum_order_qty: 2,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-4-1", product_id: "prod-4", weight_label: "250g", weight_in_grams: 250, retail_price: 60, wholesale_price: 48, stock_quantity: 400, is_in_stock: true, sku: "SBCR-250G" },
      { id: "v-4-2", product_id: "prod-4", weight_label: "500g", weight_in_grams: 500, retail_price: 120, wholesale_price: 95, stock_quantity: 300, is_in_stock: true, sku: "SBCR-500G" },
      { id: "v-4-3", product_id: "prod-4", weight_label: "1kg", weight_in_grams: 1000, retail_price: 240, wholesale_price: 185, stock_quantity: 180, is_in_stock: true, sku: "SBCR-1KG" },
      { id: "v-4-4", product_id: "prod-4", weight_label: "5kg Bulk Carton", weight_in_grams: 5000, retail_price: 1150, wholesale_price: 900, stock_quantity: 50, is_in_stock: true, sku: "SBCR-5KG" }
    ],
    images: [
      { id: "img-4-1", product_id: "prod-4", image_url: "/images/products/crispy-rings.png", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-5",
    category_id: "cat-5",
    name: "Kaju Biscuits Mixture",
    slug: "kaju-biscuits-mixture",
    description: "Special savory cashew-shaped crispy diamond biscuits blended with spicy fine sev, roasted peanuts, and traditional seasonings.",
    food_classification: "VEGETARIAN",
    spice_level: "MILD",
    taste_profiles: ["Crunchy", "Savory", "Special"],
    ingredients: "Wheat flour, Gram flour, Groundnuts, Edible vegetable oil, Cumin, Carom seeds (Ajwain), Rock salt, Spices.",
    allergen_info: "Contains Wheat (Gluten) and Groundnuts. 100% Pure Vegetarian.",
    packaging_info: "Airtight moisture-barrier sealed pouch.",
    minimum_order_qty: 2,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-5-1", product_id: "prod-5", weight_label: "250g", weight_in_grams: 250, retail_price: 60, wholesale_price: 48, stock_quantity: 300, is_in_stock: true, sku: "SBKB-250G" },
      { id: "v-5-2", product_id: "prod-5", weight_label: "500g", weight_in_grams: 500, retail_price: 120, wholesale_price: 95, stock_quantity: 210, is_in_stock: true, sku: "SBKB-500G" },
      { id: "v-5-3", product_id: "prod-5", weight_label: "1kg", weight_in_grams: 1000, retail_price: 240, wholesale_price: 185, stock_quantity: 120, is_in_stock: true, sku: "SBKB-1KG" }
    ],
    images: [
      { id: "img-5-1", product_id: "prod-5", image_url: "/images/products/kaju-biscuits-mixture.png", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-6",
    category_id: "cat-3",
    name: "Kar Kar Murrukulu",
    slug: "kar-kar-murrukulu",
    description: "Sri Balaji's signature tea-time snack. Thin, ultra-crispy golden murruku spirals enriched with white sesame seeds, cumin, and traditional seasoning.",
    food_classification: "VEGETARIAN",
    spice_level: "MEDIUM",
    taste_profiles: ["Crispy", "Crunchy", "Traditional"],
    ingredients: "Rice flour, Bengal gram flour, Edible vegetable oil, White sesame seeds, Cumin seeds, Salt, Pure spices.",
    allergen_info: "Contains Sesame. 100% Pure Vegetarian.",
    packaging_info: "Sealed food-grade moisture-barrier pouch.",
    minimum_order_qty: 2,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-6-1", product_id: "prod-6", weight_label: "250g", weight_in_grams: 250, retail_price: 60, wholesale_price: 48, stock_quantity: 350, is_in_stock: true, sku: "SBKM-250G" },
      { id: "v-6-2", product_id: "prod-6", weight_label: "500g", weight_in_grams: 500, retail_price: 120, wholesale_price: 95, stock_quantity: 250, is_in_stock: true, sku: "SBKM-500G" },
      { id: "v-6-3", product_id: "prod-6", weight_label: "1kg", weight_in_grams: 1000, retail_price: 240, wholesale_price: 185, stock_quantity: 130, is_in_stock: true, sku: "SBKM-1KG" }
    ],
    images: [
      { id: "img-6-1", product_id: "prod-6", image_url: "/images/products/kar-kar-murrukulu.png", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-7",
    category_id: "cat-1",
    name: "Gujarat Mix Chivda",
    slug: "gujarat-mix-chivda",
    description: "A delightful sweet, salty, and mildly spicy Gujarati style specialty chivda loaded with crunchy cashews, roasted peanuts, curry leaves, and raisins.",
    food_classification: "VEGETARIAN",
    spice_level: "MILD",
    taste_profiles: ["Sweet & Spicy", "Crunchy", "Special"],
    ingredients: "Thin flattened rice (Poha), Cashew nuts, Golden raisins, Groundnuts, Edible vegetable oil, Curry leaves, Powdered sugar, Rock salt, Spices.",
    allergen_info: "Contains Tree Nuts (Cashews) and Groundnuts. 100% Pure Vegetarian.",
    packaging_info: "Special bright yellow moisture-barrier sealed pouch.",
    minimum_order_qty: 2,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-7-1", product_id: "prod-7", weight_label: "250g", weight_in_grams: 250, retail_price: 60, wholesale_price: 48, stock_quantity: 300, is_in_stock: true, sku: "SBGC-250G" },
      { id: "v-7-2", product_id: "prod-7", weight_label: "500g", weight_in_grams: 500, retail_price: 120, wholesale_price: 95, stock_quantity: 200, is_in_stock: true, sku: "SBGC-500G" },
      { id: "v-7-3", product_id: "prod-7", weight_label: "1kg", weight_in_grams: 1000, retail_price: 240, wholesale_price: 185, stock_quantity: 110, is_in_stock: true, sku: "SBGC-1KG" }
    ],
    images: [
      { id: "img-7-1", product_id: "prod-7", image_url: "/images/products/gujarat-mix-chivda.png", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-8",
    category_id: "cat-5",
    name: "Seven Flavors Signature Collection",
    slug: "seven-flavors-collection",
    description: "The complete tasting set of Sri Balaji's 7 signature freshly prepared airtight pouches: Onion Mixture, Chuda Mixture, Mong Dal Mixture, Spicy Mixture, Bundi Mixture, Corn Chips Mixture, and Crispy Murrukulu.",
    food_classification: "VEGETARIAN",
    spice_level: "MEDIUM",
    taste_profiles: ["Crunchy", "Spicy", "Special"],
    ingredients: "Assorted gram flour savouries, roasted pulses, peanuts, cashew nuts, flattened rice, corn flakes, and authentic spices.",
    allergen_info: "Contains Groundnuts (Peanuts) and Tree Nuts. 100% Pure Vegetarian.",
    packaging_info: "7 individually sealed airtight 250g pouches packed in a master carton.",
    minimum_order_qty: 1,
    is_available: true,
    is_featured: true,
    variants: [
      { id: "v-8-1", product_id: "prod-8", weight_label: "7 x 250g Combo Pack", weight_in_grams: 1750, retail_price: 399, wholesale_price: 315, stock_quantity: 100, is_in_stock: true, sku: "SBSF-7X250G" },
      { id: "v-8-2", product_id: "prod-8", weight_label: "7 x 500g Family Pack", weight_in_grams: 3500, retail_price: 799, wholesale_price: 630, stock_quantity: 60, is_in_stock: true, sku: "SBSF-7X500G" }
    ],
    images: [
      { id: "img-8-1", product_id: "prod-8", image_url: "/images/brand/seven-flavors-lineup.png", is_primary: true, display_order: 1 }
    ]
  },
  {
    id: "prod-9",
    category_id: "cat-3",
    name: "Wholesale Commercial Bulk Pack",
    slug: "wholesale-commercial-bulk-pack",
    description: "Authentic wholesale bulk assortment in heavy-duty clear transparent packs as prepared for kirana stores, grocery merchants, tea vendors, and distributors across Paralakhemundi.",
    food_classification: "VEGETARIAN",
    spice_level: "MEDIUM",
    taste_profiles: ["Traditional", "Crunchy", "Wholesale"],
    ingredients: "Assorted fresh batches of Ribbon Pakoda, Mixture, Boondi, Sev, and Peanuts.",
    allergen_info: "Contains Groundnuts. 100% Pure Vegetarian.",
    packaging_info: "Heavy-duty food-grade clear wholesale poly-bags.",
    minimum_order_qty: 1,
    is_available: true,
    is_featured: false,
    variants: [
      { id: "v-9-1", product_id: "prod-9", weight_label: "3kg Wholesale Bag", weight_in_grams: 3000, retail_price: 720, wholesale_price: 540, stock_quantity: 80, is_in_stock: true, sku: "SBWB-3KG" },
      { id: "v-9-2", product_id: "prod-9", weight_label: "5kg Commercial Carton", weight_in_grams: 5000, retail_price: 1150, wholesale_price: 880, stock_quantity: 50, is_in_stock: true, sku: "SBWB-5KG" },
      { id: "v-9-3", product_id: "prod-9", weight_label: "10kg Distributor Sack", weight_in_grams: 10000, retail_price: 2200, wholesale_price: 1700, stock_quantity: 30, is_in_stock: true, sku: "SBWB-10KG" }
    ],
    images: [
      { id: "img-9-1", product_id: "prod-9", image_url: "/images/brand/wholesale-counter.png", is_primary: true, display_order: 1 }
    ]
  }
];

export const initialBundles: Bundle[] = [
  {
    id: "bundle-1",
    name: "Seven Flavors Unlimited Crunch Set",
    slug: "seven-flavors-unlimited-crunch-set",
    description: "Our signature collection featuring all 7 authentic sealed pouches: Onion Mixture, Chuda Mixture, Mong Dal, Spicy Mixture, Bundi, Corn Chips, and Crispy Murrukulu.",
    bundle_price: 399,
    image_url: "/images/brand/seven-flavors-lineup.png",
    is_active: true
  },
  {
    id: "bundle-2",
    name: "Evening Family Tea-Time Box",
    slug: "evening-family-tea-time-box",
    description: "The complete household snacking pack: 500g Onion Mixture, 500g Kar Kar Murrukulu, and 500g Crispy Rings Chegodilu.",
    bundle_price: 350,
    image_url: "/images/products/kar-kar-murrukulu.png",
    is_active: true
  },
  {
    id: "bundle-3",
    name: "Wholesale Kirana Starter Consignment",
    slug: "wholesale-kirana-starter-consignment",
    description: "Fast-moving bulk starter assortment for grocery & kirana stores: 5kg Onion Mixture + 5kg Crispy Rings + 5kg Peanuts Pakodi in commercial packaging.",
    bundle_price: 2750,
    image_url: "/images/brand/wholesale-counter.png",
    is_active: true
  }
];
