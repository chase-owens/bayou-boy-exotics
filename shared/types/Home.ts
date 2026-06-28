export interface HomeContent {
  hero: Hero;
  announcement?: Announcement;
}

export interface Hero {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryAction?: Action;
  secondaryAction?: Action;
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
