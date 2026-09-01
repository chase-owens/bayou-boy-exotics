import { useEffect, useMemo, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import {
  addDays,
  getHours,
  isAfter,
  parseISO,
  set,
  startOfDay,
} from "date-fns";
import { CalendarClock, Gift, Package, Users } from "lucide-react";

import PageHeader from "../components/layout/PageHeader";
import AdminCard from "../components/ui/AdminCard";
import StatCard from "../components/ui/StatCard";
import { useDraft } from "../context/draft/useDraft";
import { fetchReservations } from "../api/reservations";
import type { Reservation } from "../../../shared/types/Reservation";
import ConfirmedReservationGroups from "../components/ui/ConfirmedReservationGroups";

const fileLabels = {
  availability: "Availability",
  home: "Homepage",
  menu: "Menu",
  pricing: "Pricing",
  root: "Site",
} as const;

type AccessRequest = {
  userId: string;
  status: "pending" | "approved" | "denied";
};

const API_URL = import.meta.env.VITE_API_URL;

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

const fetchPendingRequestCount = async (): Promise<number> => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error("Unable to load admin session.");
  }

  const response = await fetch(`${API_URL}admin/access-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load pending requests.");
  }

  const requests = (await response.json()) as AccessRequest[];

  return requests.filter((request) => request.status === "pending").length;
};

export default function Dashboard() {
  const {
    menu,
    home,
    isLoading: isContentLoading,
    hasChanges,
    dirtyFiles,
    isPublishing,
    publishChanges,
    publishedFiles,
    publishSucceeded,
  } = useDraft();

  const [unconfirmedReservationCount, setUnconfirmedReservationCount] =
    useState(0);

  const [confirmedReservations, setConfirmedReservations] = useState<
    Reservation[]
  >([]);

  const [isReservationsLoading, setIsReservationsLoading] = useState(true);

  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [isPendingLoading, setIsPendingLoading] = useState(true);

  const hour = getHours(new Date());
  const isAfternoon = hour >= 12 && hour < 18;

  const productsLive = useMemo(
    () => menu?.listings.filter((listing) => listing.active).length ?? 0,
    [menu?.listings],
  );

  const featuredDeals = useMemo(
    () => home?.features.filter((feature) => feature.enabled).length ?? 0,
    [home?.features],
  );

  useEffect(() => {
    let cancelled = false;

    void fetchPendingRequestCount()
      .then((count) => {
        if (!cancelled) {
          setPendingRequestCount(count);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsPendingLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    void Promise.all([
      fetchReservations("submitted"),
      fetchReservations("confirmed"),
    ])
      .then(([unconfirmed, confirmed]) => {
        if (cancelled) return;

        const now = new Date();

        const upcomingUnconfirmed = unconfirmed.filter((reservation) =>
          isAfter(getMeetAt(reservation), now),
        );

        setUnconfirmedReservationCount(upcomingUnconfirmed.length);
        setConfirmedReservations(confirmed);
      })
      .finally(() => {
        if (!cancelled) {
          setIsReservationsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={
          isAfternoon ? "Good afternoon, Bayou Boy" : "Good morning, Bayou Boy"
        }
        description="Here's what's happening with Bayou Boy Exotics."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pending Requests"
          value={pendingRequestCount}
          icon={Users}
          actionLabel="View all"
          to="/users"
          isLoading={isPendingLoading}
        />

        <StatCard
          label="Unconfirmed Reservations"
          value={unconfirmedReservationCount}
          icon={CalendarClock}
          actionLabel="View"
          to="/reservations"
          isLoading={isReservationsLoading}
        />

        <StatCard
          label="Products Live"
          value={productsLive}
          icon={Package}
          actionLabel="Manage"
          to="/products"
          isLoading={isContentLoading}
        />

        <StatCard
          label="Featured Deals"
          value={featuredDeals}
          icon={Gift}
          actionLabel="Manage"
          to="/featured-deals"
          isLoading={isContentLoading}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div>
          <div className="mb-4">
            <p className="admin-eyebrow">Schedule</p>
            <h2 className="mt-2 text-2xl">Upcoming Reservations</h2>
          </div>

          <ConfirmedReservationGroups
            reservations={confirmedReservations}
            limit={3}
          />
        </div>

        <AdminCard>
          <div className="flex h-full items-center justify-between gap-6">
            <div>
              <p className="admin-eyebrow">Content Status</p>

              <h2 className="mt-2 text-2xl">
                {isPublishing
                  ? "Publishing Changes..."
                  : publishSucceeded
                    ? "Everything Is Up to Date"
                    : hasChanges
                      ? "Changes Ready to Publish"
                      : "Everything Is Up to Date"}
              </h2>

              {hasChanges && !publishSucceeded && (
                <p className="mt-2 text-sm text-white">
                  {dirtyFiles.map((file) => fileLabels[file]).join(", ")}
                </p>
              )}

              {publishSucceeded && publishedFiles.length > 0 && (
                <p className="mt-2 text-sm text-success">
                  {publishedFiles.map((file) => fileLabels[file]).join(", ")}{" "}
                  published
                </p>
              )}

              {!hasChanges && !publishSucceeded && (
                <p className="mt-2 text-sm text-white">
                  Your published content matches your current changes.
                </p>
              )}
            </div>

            {hasChanges && !publishSucceeded && (
              <button
                type="button"
                onClick={() => void publishChanges()}
                disabled={isPublishing}
                className="admin-button-primary shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPublishing ? "Publishing..." : "Publish Changes"}
              </button>
            )}
          </div>
        </AdminCard>
      </div>
    </>
  );
}
