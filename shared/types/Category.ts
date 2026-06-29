export type CategoryId =
  | "flower"
  | "carts"
  | "wax"
  | "pre-rolls"
  | "mushrooms"
  | "edibles";

export interface Category {
  id: CategoryId;
  label: string;
  description?: string;
  sortOrder: number;
  active: boolean;
}
