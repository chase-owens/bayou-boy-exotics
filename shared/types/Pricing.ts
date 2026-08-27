import type { CategoryId } from "./Category";

export interface PriceOption {
  id: string;
  label: string; // "3.5g", "1 cart", "2 for $60"
  price: number;
  units: number;
  unit?: "g" | "each" | "pack" | "cart";
}

export type PricingSetOption = Omit<PriceOption, "unit">;

export type PricingSet = {
  label: string;
  unit: NonNullable<PriceOption["unit"]>;
  options: PricingSetOption[];
};

type PricingCategoryConfig = {
  defaultSetId: string;
  sets: string[];
};

export type PricingConfig = {
  sets: Record<string, PricingSet>;
  categories: Record<CategoryId, PricingCategoryConfig>;
};
