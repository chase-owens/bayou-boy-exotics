import type { CategoryId } from "./Category";

export interface Promotion {
  id: string;
  title: string;
  description?: string;

  startsAt?: string;
  endsAt?: string;

  items: PromotionItem[];

  active: boolean;
  sortOrder: number;
}

export interface PromotionItem {
  id: string;
  label: string;
  price: number;
  listingId?: string;
  categoryId?: CategoryId;
}
