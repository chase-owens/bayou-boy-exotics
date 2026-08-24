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

export type AccessCardType = "pending" | "bayou-boys" | "rejects";

export type AccessAction = "approved" | "denied";

export type Banner = {
  status: "success" | "error" | "warning" | "info";
  message: string;
};

type Banners = Partial<Record<AccessCardType, Banner>>;

const API_URL = import.meta.env.VITE_API_URL;

const fetchUsers = async (): Promise<AccessRequest[]> => {
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

  return response.json() as Promise<AccessRequest[]>;
};

export default function Users() {
  const [banners, setBanners] = useState<Banners>({});
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setRequests(await fetchUsers());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUserAction = useCallback(
    async (source: AccessCardType, action: AccessAction, name: string) => {
      await loadUsers();

      const message =
        action === "approved"
          ? `${name} approved successfully`
          : `${name} denied successfully`;

      setBanners({
        [source]: {
          status: "success",
          message,
        },
      });

      window.setTimeout(() => {
        setBanners({});
      }, 6000);
    },
    [loadUsers],
  );

  useEffect(() => {
    let cancelled = false;

    void fetchUsers()
      .then((data) => {
        if (!cancelled) {
          setRequests(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load users.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

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
          banner={banners.pending}
          onChange={(action, name) => handleUserAction("pending", action, name)}
        />

        <AccessCard
          title="Bayou Boys"
          users={approved}
          variant="approved"
          isLoading={isLoading}
          banner={banners["bayou-boys"]}
          onChange={(action, name) =>
            handleUserAction("bayou-boys", action, name)
          }
        />

        <AccessCard
          title="Rejects"
          users={denied}
          variant="denied"
          isLoading={isLoading}
          banner={banners.rejects}
          onChange={(action, name) => handleUserAction("rejects", action, name)}
        />
      </div>

      {/* <TeamBayouCard /> */}
    </>
  );
}
