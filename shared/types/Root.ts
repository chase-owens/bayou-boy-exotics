export interface RootContent {
  branding: Branding;
  navigation: NavigationItem[];
  socials: SocialLink[];
  business: Business;
}

export interface Business {
  hours: Hours;
  shipping: Shipping;
  meeting: MeetingPolicy;
}

export interface Shipping {
  minimumOrder?: number;
  enabled: boolean;
}

export interface MeetingPolicy {
  cashOnly: boolean;
  arriveEarlyMinutes?: number;
  appointmentOnly: boolean;
  notes?: string[];
}

export interface Branding {
  name: string;
  tagline: string;
  logo?: string;
}

export interface Hours {
  dailyBreaks: TimeRange[];
  schedule: BusinessDayHours[];
  meetSchedule: MeetSchedule;
}

export interface MeetSchedule {
  defaultTimes: string[];
}

export interface BusinessDayHours {
  day: DayOfWeek;
  opensAt?: string;
  closesAt?: string;
  closed?: boolean;
  note?: string;
}

export interface TimeRange {
  startsAt: string;
  endsAt: string;
  label?: string;
}

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface NavigationItem {
  description?: string;
  label: string;
  href: string;
  icon?: string;
}

export interface SocialLink {
  label: string;
  platform: "instagram" | "facebook" | "x" | "website";
  handle: string;
  url: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  city?: string;
}
