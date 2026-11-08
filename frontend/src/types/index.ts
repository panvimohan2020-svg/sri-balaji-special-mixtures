export type FoodClassification = 'VEGETARIAN' | 'NON_VEGETARIAN';
export type SpiceLevel = 'MILD' | 'MEDIUM' | 'SPICY' | 'EXTRA_SPICY';
export type OrderType = 'WHOLESALE' | 'RETAIL';
export type OrderStatus = 'ENQUIRY' | 'WHATSAPP_INITIATED' | 'CONTACTED' | 'CONFIRMED' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  weight_label: string; // e.g. "100g", "250g", "500g", "1kg", "5kg Bulk"
  weight_in_grams: number;
  retail_price: number;
  wholesale_price: number;
  stock_quantity: number;
  is_in_stock: boolean;
  sku?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  category?: Category;
  name: string;
  slug: string;
  description: string;
  food_classification: FoodClassification;
  spice_level: SpiceLevel;
  taste_profiles: string[]; // e.g. ["Crunchy", "Spicy", "Traditional"]
  ingredients?: string;
  allergen_info?: string;
  packaging_info?: string;
  minimum_order_qty: number;
  is_available: boolean;
  is_featured: boolean;
  product_label?: string; // e.g. "New Launch"
  collection?: string; // e.g. "Diwali Special 2026"
  tagline?: string; // e.g. "Taste the Tradition."
  variants: ProductVariant[];
  images: ProductImage[];
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string; // combination of productId_variantId
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  categoryName: string;
  weightLabel: string;
  weightInGrams: number;
  unitPrice: number;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
  minimumOrderQty: number;
  imageUrl?: string;
  foodClassification: FoodClassification;
}

export interface BundleItem {
  id: string;
  bundle_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  product?: Product;
}

export interface Bundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  bundle_price: number;
  is_active: boolean;
  items?: BundleItem[];
}

export interface WholesaleEnquiryForm {
  contact_name: string;
  business_name?: string;
  phone_number: string;
  email?: string;
  city?: string;
  state?: string;
  expected_monthly_volume?: string;
  message?: string;
}

export interface BusinessSettings {
  business_name: string;
  owner_name: string;
  category: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  contact_number: string;
  whatsapp_number: string;
  email_address: string;
  google_maps_url: string;
  business_hours: string;
  years_in_business: string;
  business_description: string;
  tagline: string;
  fssai_number: string;
  food_prep_method: string;
  packaging_method: string;
  quality_control: string;
  hygiene_standards: string;
  delivery_availability: string;
  wholesale_locations: string;
  payment_methods: string;
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
}

