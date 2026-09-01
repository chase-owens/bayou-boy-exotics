import { addDays, isAfter, parseISO, set, startOfDay } from "date-fns";

import type { Reservation } from "../../../shared/types/Reservation";

export type ReservationGroup = {
  meetAt: Date;
  reservations: Reservation[];
};

export const getMeetAt = (reservation: Reservation) => {
  const submittedAt = parseISO(reservation.submittedAt);
  const submittedDay = startOfDay(submittedAt);

  let meetDay = submittedDay;

  if (reservation.meet.dayLabel.toLowerCase() === "tomorrow") {
    meetDay = addDays(submittedDay, 1);
  }

  const [hours, minutes] = reservation.meet.time.split(":").map(Number);

  return set(meetDay, {
    hours,
    minutes,
    seconds: 0,
    milliseconds: 0,
  });
};

export const groupReservationsByMeetTime = (
  reservations: Reservation[],
): ReservationGroup[] => {
  const now = new Date();
  const groups = new Map<string, ReservationGroup>();

  reservations.forEach((reservation) => {
    const meetAt = getMeetAt(reservation);

    if (!isAfter(meetAt, now)) {
      return;
    }

    const key = meetAt.toISOString();
    const existing = groups.get(key);

    if (existing) {
      existing.reservations.push(reservation);
      return;
    }

    groups.set(key, {
      meetAt,
      reservations: [reservation],
    });
  });

  return Array.from(groups.values()).sort(
    (a, b) => a.meetAt.getTime() - b.meetAt.getTime(),
  );
};
