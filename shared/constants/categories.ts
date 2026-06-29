// shared/constants/categories.ts
export const CATEGORY_IDS = {
  FLOWER: "flower",
  CARTS: "carts",
  WAX: "wax",
  PRE_ROLLS: "pre-rolls",
  MUSHROOMS: "mushrooms",
  EDIBLES: "edibles",
} as const;

export type CategoryId = (typeof CATEGORY_IDS)[keyof typeof CATEGORY_IDS];
