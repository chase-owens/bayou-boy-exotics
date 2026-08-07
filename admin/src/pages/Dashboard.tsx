import { getHours } from "date-fns";
import PageHeader from "../components/layout/PageHeader";
import AdminCard from "../components/ui/AdminCard";
import StatCard from "../components/ui/StatCard";
import { Gift, Package, Users } from "lucide-react";

export default function Dashboard() {
  const date = new Date();
  const hour = getHours(date);

  const isAfternoon = hour >= 12 && hour < 18;

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={
          isAfternoon ? "Good afternoon, Bayou Boy" : "Good morning, Bayou Boy"
        }
        description="Here’s what’s happening with Bayou Boy Exotics."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <StatCard
          label="Pending Requests"
          value={4}
          icon={Users}
          actionLabel="View all"
        />
        <StatCard
          label="Products Live"
          value={26}
          icon={Package}
          actionLabel="Manage"
        />
        <StatCard
          label="Featured Deals"
          value={2}
          icon={Gift}
          actionLabel="Manage"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <p className="admin-eyebrow">Recent Activity</p>
          <h2 className="mt-2 text-2xl">Latest Updates</h2>
        </AdminCard>

        <AdminCard>
          <p className="admin-eyebrow">Today’s Menu</p>
          <h2 className="mt-2 text-2xl">Ready to Publish?</h2>
        </AdminCard>
      </div>
    </>
  );
}
