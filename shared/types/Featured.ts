import type { CartItemTemplate } from "./Cart";

export interface FeaturedContent {
  features: SuperSteal[];
}

export type SuperSteal =
  | {
      enabled: true;
      eyebrow: string;
      headline: string;
      summary: string;
      image: string;
      cartItem: CartItemTemplate;
    }
  | {
      enabled: true;
      eyebrow: string;
      headline: string;
      summary: string;
      image: string;
      listingId: string;
    };
