import type { CartItem } from "./Cart";

type ReservationStatus = "submitted" | "confirmed" | "completed" | "cancelled";

type ReservationMeet = {
  dayLabel: string;
  time: string;
  label: string;
};

type Reservation = {
  reservationId: string;
  userId: string;

  customerName: string;
  customerPhone: string;
  customerEmail: string;

  items: CartItem[];
  total: number;
  meet: ReservationMeet;

  status: ReservationStatus;
  submittedAt: string;

  confirmedAt?: string;
  confirmedBy?: string;

  meetupAddress?: string;
  confirmationMessage?: string;
};

export type { Reservation, ReservationMeet, ReservationStatus };
