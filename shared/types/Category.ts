export type CategoryId =
  "flower" | "carts" | "wax" | "pre-rolls" | "mushrooms" | "edibles";

export interface Category {
  active: boolean;
  defaultPricingSetId: string;
  description?: string;
  id: CategoryId;
  label: string;
  pricingSetIds: string[];
}
