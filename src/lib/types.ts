export type StoreStatus = "draft" | "active" | "suspended";
export type ProductStatus = "active" | "draft" | "archived";
export type PlanId = "basic" | "pro";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  slug: string | null;
  description: string | null;
  logo_url: string | null;
  brand_color: string;
  template_id: string;
  setup_method: "manual" | "import";
  import_source_url: string | null;
  subdomain: string | null;
  custom_domain: string | null;
  status: StoreStatus;
  onboarding_step: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  image_url: string | null;
  sku: string | null;
  stock: number;
  status: ProductStatus;
  sort_order: number;
  ai_imported: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  store_id: string;
  owner_id: string;
  plan: PlanId;
  price: number;
  currency: string;
  billing_interval: "month" | "year";
  status: "active" | "trialing" | "past_due" | "canceled";
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

/** Shape returned by the (mocked) AI extraction step. */
export interface ExtractedStore {
  name: string;
  description: string;
  logo_url: string;
  brand_color: string;
  source_platform: string;
  products: ExtractedProduct[];
}

export interface ExtractedProduct {
  name: string;
  description: string;
  price: number;
  compare_at_price?: number;
  image_url: string;
  stock: number;
}
