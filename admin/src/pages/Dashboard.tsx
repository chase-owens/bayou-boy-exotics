import { useEffect, useMemo, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { getHours } from "date-fns";
import { Gift, Package, Users } from "lucide-react";

import PageHeader from "../components/layout/PageHeader";
import AdminCard from "../components/ui/AdminCard";
import StatCard from "../components/ui/StatCard";
import { useDraft } from "../context/draft/useDraft";

type AccessRequest = {
  userId: string;
  status: "pending" | "approved" | "denied";
};

const API_URL = import.meta.env.VITE_API_URL;

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
  const { menu, home, isLoading: isContentLoading } = useDraft();

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

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={
          isAfternoon ? "Good afternoon, Bayou Boy" : "Good morning, Bayou Boy"
        }
        description="Here's what's happening with Bayou Boy Exotics."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <StatCard
          label="Pending Requests"
          value={pendingRequestCount}
          icon={Users}
          actionLabel="View all"
          to="/users"
          isLoading={isPendingLoading}
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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <p className="admin-eyebrow">Recent Activity</p>
          <h2 className="mt-2 text-2xl">Latest Updates</h2>
        </AdminCard>

        <AdminCard>
          <p className="admin-eyebrow">Today's Menu</p>
          <h2 className="mt-2 text-2xl">Ready to Publish?</h2>
        </AdminCard>
      </div>
    </>
  );
}
