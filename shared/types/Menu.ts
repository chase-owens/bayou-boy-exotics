import type { Category } from "./Category";
import type { Listing } from "./Listing";
import type { Promotion } from "./Promotion";

export interface MenuContent {
  currentMenu: CurrentMenu;
  categories: Category[];
  listings: Listing[];
  promotions: Promotion[];
  lastUpdated: string;
}

export interface CurrentMenu {
  id: string;
  title: string;
  active: boolean;
  listingIds: string[];
  promotionIds?: string[];
}
