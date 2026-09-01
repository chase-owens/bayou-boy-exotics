import { format, isToday } from "date-fns";
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
      {visibleGroups.map((group) => {
        const groupTotal = group.reservations.reduce(
          (total, reservation) => total + reservation.total,
          0,
        );
        return (
          <div
            key={group.meetAt.toISOString()}
            className="admin-card w-full p-5"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-highlight">
                  {isToday(group.meetAt)
                    ? "Today"
                    : format(group.meetAt, "EEEE, MMMM d")}
                </p>

                <h3 className="mt-1 text-2xl font-bold text-black">
                  {format(group.meetAt, "h:mm a")}
                </h3>
              </div>

              <div className="flex gap-3">
                <span className="rounded-md border border-white/15 px-3 py-1 text-xs font-semibold text-accent">
                  {group.reservations.length}{" "}
                  {group.reservations.length === 1
                    ? "reservation"
                    : "reservations"}
                </span>
                <span className="rounded-md border border-white/15 px-3 py-1 text-xs font-semibold text-black">
                  ${groupTotal}
                </span>
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {group.reservations.map((reservation) => (
                <div
                  key={reservation.reservationId}
                  className="py-5 first:pt-5 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="font-semibold text-black">
                        {reservation.customerName}
                      </p>

                      <p className="mt-1 text-sm text-accent">
                        {reservation.customerPhone}
                      </p>
                    </div>

                    <p className="text-xl font-bold text-white">
                      ${reservation.total}
                    </p>
                  </div>

                  <div className="mt-4">
                    {reservation.items.map((item) => (
                      <p key={item.id} className="text-sm text-white/80">
                        {item.listingName} — {item.priceLabel}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
