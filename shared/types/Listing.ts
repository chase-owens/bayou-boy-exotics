import type { CategoryId } from "./Category";
import type { PriceOption } from "./Pricing";

export interface ListingOption {
  id: string;
  label: string;
  active: boolean;
  soldOut?: boolean;
}

export interface Listing {
  id: string;
  categoryId: CategoryId;

  name: string;
  brand?: string;
  vendor?: string;
  tags?: string[];
  type?: ProductType;

  description?: string;
  notes?: string[];

  images: string[];

  pricing: PriceOption[];
  options?: ListingOption[];

  inventory?: Inventory;

  active: boolean;
  featured: boolean;
  sortOrder: number;
}

export type ProductType =
  | "indica"
  | "sativa"
  | "hybrid"
  | "indica-dominant-hybrid"
  | "sativa-dominant-hybrid";

export interface Inventory {
  tracked: boolean;
  quantityAvailable?: number;
  lowStockThreshold?: number;
  soldOut?: boolean;
}
