import { fetchAuthSession } from "aws-amplify/auth";

import type {
  Reservation,
  ReservationStatus,
} from "../../../shared/types/Reservation";

const API_URL = import.meta.env.VITE_API_URL;

type ListReservationsResponse = {
  reservations: Reservation[];
};

export const fetchReservations = async (
  status: ReservationStatus = "submitted",
): Promise<Reservation[]> => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error("Unable to load admin session.");
  }

  const response = await fetch(
    `${API_URL}admin/reservations?status=${status}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.message ?? "Failed to load reservations");
  }

  const data = (await response.json()) as ListReservationsResponse;

  return data.reservations;
};

export const cancelReservation = async (
  reservationId: string,
): Promise<Reservation> => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error("Unable to load admin session.");
  }

  const response = await fetch(
    `${API_URL}admin/reservations/${reservationId}/cancel`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.message ?? "Failed to cancel reservation");
  }

  const data = await response.json();

  return data.reservation;
};

export const confirmReservation = async (
  reservationId: string,
  meetupAddress: string,
  confirmationMessage: string,
): Promise<Reservation> => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error("Unable to load admin session.");
  }

  const response = await fetch(
    `${API_URL}admin/reservations/${reservationId}/confirm`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        meetupAddress,
        confirmationMessage,
      }),
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.message ?? "Failed to confirm reservation");
  }

  const data = await response.json();

  return data.reservation;
};
