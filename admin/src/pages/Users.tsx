import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

import PageHeader from "../components/layout/PageHeader";
import AccessCard from "../components/ui/AccessCard";
// import TeamBayouCard from "../components/ui/TeamBayouCard";

export type AccessRequest = {
  userId: string;
  email: string;
  name: string;
  phone: string;
  requestedAt: string;
  status: "pending" | "approved" | "denied";
  approvedAt?: string;
  deniedAt?: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export default function Users() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
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
        throw new Error("Unable to load users.");
      }

      const data = (await response.json()) as AccessRequest[];

      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
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
          throw new Error("Unable to load users.");
        }

        const data = (await response.json()) as AccessRequest[];

        if (!cancelled) {
          setRequests(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load users.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  const pending = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests],
  );

  const approved = useMemo(
    () => requests.filter((request) => request.status === "approved"),
    [requests],
  );

  const denied = useMemo(
    () => requests.filter((request) => request.status === "denied"),
    [requests],
  );

  return (
    <>
      <PageHeader
        eyebrow="Users"
        title="Manage Bayou Access"
        description="Approve, deny, and manage access to Bayou Boy Exotics."
      />

      {error && <p className="admin-error-text mb-5">{error}</p>}

      <div className="grid gap-5 lg:grid-cols-3">
        <AccessCard
          title="Pending Requests"
          users={pending}
          variant="pending"
          defaultExpanded
          isLoading={isLoading}
          onChange={loadUsers}
        />

        <AccessCard
          title="Bayou Boys"
          users={approved}
          variant="approved"
          isLoading={isLoading}
          onChange={loadUsers}
        />

        <AccessCard
          title="Rejects"
          users={denied}
          variant="denied"
          isLoading={isLoading}
          onChange={loadUsers}
        />
      </div>

      {/* <TeamBayouCard /> */}
    </>
  );
}
