import { useEffect, useState } from "react";
import {
  addDays,
  format,
  isAfter,
  isToday,
  parseISO,
  set,
  startOfDay,
} from "date-fns";

import type { Reservation } from "../../../shared/types/Reservation";

import {
  cancelReservation,
  confirmReservation,
  fetchReservations,
} from "../api/reservations";

import PageHeader from "../components/layout/PageHeader";
import AddressAutocomplete from "../components/ui/AddressAutomplete";

type ConfirmationDraft = {
  location: string;
  message: string;
};

type ReservationView = "upcoming" | "past";

type ReservationGroup = {
  meetAt: Date;
  reservations: Reservation[];
};

const getMeetAt = (reservation: Reservation) => {
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
const groupReservationsByMeetTime = (
  reservations: Reservation[],
  view: ReservationView,
): ReservationGroup[] => {
  const now = new Date();
  const groups = new Map<string, ReservationGroup>();

  reservations.forEach((reservation) => {
    const meetAt = getMeetAt(reservation);
    const isUpcoming = isAfter(meetAt, now);

    if (view === "upcoming" && !isUpcoming) {
      return;
    }

    if (view === "past" && isUpcoming) {
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

  return Array.from(groups.values()).sort((a, b) =>
    view === "upcoming"
      ? a.meetAt.getTime() - b.meetAt.getTime()
      : b.meetAt.getTime() - a.meetAt.getTime(),
  );
};

export default function Reservations() {
  type ReservationView = "upcoming" | "past";

  const [reservationView, setReservationView] =
    useState<ReservationView>("upcoming");
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>(
    [],
  );

  const [confirmedReservations, setConfirmedReservations] = useState<
    Reservation[]
  >([]);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [confirmationDrafts, setConfirmationDrafts] = useState<
    Record<string, ConfirmationDraft>
  >({});

  useEffect(() => {
    void Promise.all([
      fetchReservations("submitted"),
      fetchReservations("confirmed"),
    ]).then(([pending, confirmed]) => {
      setPendingReservations(pending);
      setConfirmedReservations(confirmed);
    });
  }, []);

  const confirmedGroups = groupReservationsByMeetTime(
    confirmedReservations,
    reservationView,
  );

  const updateConfirmationDraft = (
    reservationId: string,
    values: Partial<ConfirmationDraft>,
  ) => {
    setConfirmationDrafts((current) => {
      const existing = current[reservationId] ?? {
        location: "",
        message: "",
      };

      return {
        ...current,
        [reservationId]: {
          ...existing,
          ...values,
        },
      };
    });
  };

  const handleConfirm = async (reservationId: string) => {
    const draft = confirmationDrafts[reservationId];

    if (!draft?.location.trim()) return;

    setUpdatingId(reservationId);

    try {
      await confirmReservation(
        reservationId,
        draft.location.trim(),
        draft.message.trim(),
      );

      setPendingReservations((current) =>
        current.filter(
          (reservation) => reservation.reservationId !== reservationId,
        ),
      );

      const confirmed = await fetchReservations("confirmed");
      setConfirmedReservations(confirmed);

      setConfirmationDrafts((current) => {
        const next = { ...current };
        delete next[reservationId];
        return next;
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (reservationId: string) => {
    setUpdatingId(reservationId);

    try {
      await cancelReservation(reservationId);

      setPendingReservations((current) =>
        current.filter(
          (reservation) => reservation.reservationId !== reservationId,
        ),
      );

      setConfirmationDrafts((current) => {
        const next = { ...current };
        delete next[reservationId];
        return next;
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title="Reservations"
        description="Manage pending requests and upcoming confirmed reservations."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Pending Requests
              </h2>

              <p className="mt-1 text-sm text-muted-dark">
                Awaiting confirmation
              </p>
            </div>

            <span className="rounded-vintage border border-border bg-white px-3 py-1 text-sm font-semibold text-muted-dark">
              {pendingReservations.length}
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {pendingReservations.length === 0 && (
              <div className="admin-card p-5">
                <p className="text-sm text-white/60">
                  No pending reservation requests.
                </p>
              </div>
            )}

            {pendingReservations.map((reservation) => {
              const draft = confirmationDrafts[reservation.reservationId] ?? {
                location: "",
                message: "",
              };

              const isUpdating = updatingId === reservation.reservationId;

              return (
                <div
                  key={reservation.reservationId}
                  className="admin-card w-full p-5"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="font-semibold text-black">
                        {reservation.customerName}
                      </p>

                      <p className="mt-1 text-sm text-white/70">
                        {reservation.customerPhone}
                      </p>

                      <p className="mt-3 text-sm font-semibold text-white">
                        {reservation.meet.dayLabel} · {reservation.meet.label}
                      </p>

                      <p className="mt-1 text-xl font-bold text-accent">
                        ${reservation.total}
                      </p>
                    </div>

                    <span className="rounded-md border border-white/15 px-3 py-1 text-xs font-semibold text-highlight">
                      Unconfirmed
                    </span>
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-4">
                    {reservation.items.map((item) => (
                      <p key={item.id} className="text-sm text-white/80">
                        {item.listingName} — {item.priceLabel}
                      </p>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-5">
                    <div className="flex flex-col gap-4">
                      <div>
                        <label
                          htmlFor={`reservation-address-${reservation.reservationId}`}
                          className="admin-label text-white"
                        >
                          Address
                        </label>

                        <AddressAutocomplete
                          value={draft.location}
                          onChange={(location) =>
                            updateConfirmationDraft(reservation.reservationId, {
                              location,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`reservation-message-${reservation.reservationId}`}
                          className="admin-label text-white"
                        >
                          Message
                        </label>

                        <input
                          id={`reservation-message-${reservation.reservationId}`}
                          value={draft.message}
                          onChange={(event) =>
                            updateConfirmationDraft(reservation.reservationId, {
                              message: event.target.value,
                            })
                          }
                          className="admin-input mt-2"
                          placeholder="Optional message"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={!draft.location.trim() || isUpdating}
                        onClick={() =>
                          void handleConfirm(reservation.reservationId)
                        }
                        className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUpdating ? "Updating..." : "Confirm Reservation"}
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          void handleCancel(reservation.reservationId)
                        }
                        className="rounded-vintage border border-error/50 px-4 py-3 text-sm font-semibold text-error disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1 ">
              <h2 className="text-xl font-bold text-foreground">
                Confirmed Reservations
              </h2>

              <div className="mb-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setReservationView("upcoming")}
                  className={[
                    "rounded-vintage px-4 py-2 text-sm font-semibold transition",
                    reservationView === "upcoming"
                      ? "bg-secondary text-accent"
                      : "border border-border bg-white text-muted-dark hover:border-accent",
                  ].join(" ")}
                >
                  Upcoming
                </button>

                <button
                  type="button"
                  onClick={() => setReservationView("past")}
                  className={[
                    "rounded-vintage px-4 py-2 text-sm font-semibold transition",
                    reservationView === "past"
                      ? "bg-secondary text-accent"
                      : "border border-border bg-white text-muted-dark hover:border-accent",
                  ].join(" ")}
                >
                  Past
                </button>
              </div>
            </div>

            <span className="rounded-vintage border border-border bg-white px-3 py-1 text-sm font-semibold text-muted-dark">
              {confirmedGroups.reduce(
                (total, group) => total + group.reservations.length,
                0,
              )}
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {confirmedGroups.length === 0 && (
              <div className="admin-card p-5">
                <p className="text-sm text-white/60">
                  {reservationView === "upcoming"
                    ? "No upcoming confirmed reservations."
                    : "No past confirmed reservations."}
                </p>
              </div>
            )}

            {confirmedGroups.map((group) => {
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
        </section>
      </div>
    </>
  );
}
