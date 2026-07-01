import type { CartItemTemplate } from "./Cart";

export interface HomeContent {
  hero: Hero;
  announcements?: Announcement[];
  raffle?: Raffle;
  features: SuperSteal[];
}

export interface Hero {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryAction?: Action;
  secondaryAction?: Action;
}

export interface Raffle {
  title: string;
  reward: string;
  drawingAt: string;
  requirements: string[];
  enabled: boolean;
}

export interface Announcement {
  title: string;
  summary: string;
  body: string;
  priority: "info" | "important" | "urgent";
  updatedAt: string;
}

export interface Action {
  label: string;
  href: string;
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
