import { useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

import type { AccessAction, AccessRequest } from "../../pages/Users";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateAction = "approve" | "deny";

type Props = {
  user: AccessRequest;
  onChange: (action: AccessAction, name: string) => Promise<void>;
};

export default function AccessUserRow({ user, onChange }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (action: UpdateAction) => {
    const accessAction: AccessAction =
      action === "approve" ? "approved" : "denied";

    await onChange(accessAction, user.name);
  };

  const updateStatus = async (action: UpdateAction) => {
    setIsUpdating(true);

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const response = await fetch(
        `${API_URL}admin/access-requests/${user.userId}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Unable to ${action} access.`);
      }

      await handleChange(action);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-5 py-4">
      <div className="min-w-0">
        <p className="font-semibold text-white">{user.name}</p>
        <p className="truncate text-sm text-white/65">{user.email}</p>
      </div>

      <div className="flex shrink-0 gap-2">
        {user.status === "pending" && (
          <>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => updateStatus("approve")}
              className="rounded-vintage border border-accent px-4 py-2 text-sm font-semibold text-accent"
            >
              {isUpdating ? "Updating..." : "Approve"}
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() => updateStatus("deny")}
              className="rounded-vintage border border-highlight px-4 py-2 text-sm font-semibold text-highlight"
            >
              {isUpdating ? "Updating..." : "Deny "}
            </button>
          </>
        )}

        {user.status === "approved" && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => updateStatus("deny")}
            className="rounded-vintage border border-highlight px-4 py-2 text-sm font-semibold text-highlight"
          >
            {isUpdating ? "Updating..." : "Deny Access"}
          </button>
        )}

        {user.status === "denied" && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => updateStatus("approve")}
            className="rounded-vintage border border-accent px-4 py-2 text-sm font-semibold text-accent"
          >
            {isUpdating ? "Updating..." : "Approve Access"}
          </button>
        )}
      </div>
    </div>
  );
}
