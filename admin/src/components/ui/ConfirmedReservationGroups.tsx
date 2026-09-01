import { format } from "date-fns";
import { CalendarClock } from "lucide-react";

import type { Reservation } from "../../../../shared/types/Reservation";

import { groupReservationsByMeetTime } from "../../lib/reservations";
import DataCard from "../ui/DataCard";

type Props = {
  reservations: Reservation[];
  limit?: number;
};

export default function ConfirmedReservationGroups({
  reservations,
  limit,
}: Props) {
  const groups = groupReservationsByMeetTime(reservations);
  const visibleGroups = limit ? groups.slice(0, limit) : groups;

  if (visibleGroups.length === 0) {
    return (
      <DataCard eyebrow="Upcoming Reservations" icon={CalendarClock}>
        <p className="text-sm text-white/60">
          No upcoming confirmed reservations.
        </p>
      </DataCard>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {visibleGroups.map((group) => (
        <DataCard
          key={group.meetAt.toISOString()}
          eyebrow={format(group.meetAt, "EEEE, MMMM d")}
          icon={CalendarClock}
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <h3 className="text-2xl font-bold text-white">
              {format(group.meetAt, "h:mm a")}
            </h3>

            <span className="rounded-md border border-white/15 px-3 py-1 text-xs font-semibold text-white/70">
              {group.reservations.length}{" "}
              {group.reservations.length === 1 ? "reservation" : "reservations"}
            </span>
          </div>

          <div className="divide-y divide-white/10">
            {group.reservations.map((reservation) => (
              <div
                key={reservation.reservationId}
                className="py-4 first:pt-4 last:pb-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">
                      {reservation.customerName}
                    </p>

                    <p className="mt-1 text-sm text-white/60">
                      {reservation.customerPhone}
                    </p>
                  </div>

                  <p className="font-bold text-white">${reservation.total}</p>
                </div>

                <div className="mt-3">
                  {reservation.items.map((item) => (
                    <p key={item.id} className="text-sm text-white/75">
                      {item.listingName} — {item.priceLabel}
                    </p>
                  ))}
                </div>

                {reservation.meetupAddress && (
                  <p className="mt-3 text-sm text-white/60">
                    {reservation.meetupAddress}
                  </p>
                )}
              </div>
            ))}
          </div>
        </DataCard>
      ))}
    </div>
  );
}
