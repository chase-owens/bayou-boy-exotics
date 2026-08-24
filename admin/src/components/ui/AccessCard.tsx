import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

import AccessUserRow from "./AccessUserRow";
import type { AccessRequest } from "../../pages/Users";

type Props = {
  title: string;
  users: AccessRequest[];
  variant: "pending" | "approved" | "denied";
  defaultExpanded?: boolean;
  isLoading: boolean;
  onChange: () => Promise<void>;
};

export default function AccessCard({
  title,
  users,
  variant,
  defaultExpanded = false,
  isLoading,
  onChange,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }, [search, users]);

  return (
    <section className="admin-card overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <div>
          <p className="admin-eyebrow">{title}</p>

          <div className="mt-2 flex items-end gap-3">
            <span className="text-4xl font-bold text-foreground">
              {users.length}
            </span>

            <span className="pb-1 text-sm text-white">
              {variant === "pending"
                ? "requesting access"
                : variant === "approved"
                  ? "approved access"
                  : "denied access"}
            </span>
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp className="size-5 text-accent" />
        ) : (
          <ChevronDown className="size-5 text-accent" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-white/10 px-6 pb-6">
          {variant !== "pending" && (
            <div className="relative my-5">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="admin-input pl-10"
                placeholder={`Search ${title.toLowerCase()}...`}
              />
            </div>
          )}

          {isLoading ? (
            <p className="py-5 text-sm text-white/70">Loading...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="py-5 text-sm text-white/70">No users found.</p>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <AccessUserRow
                  key={user.userId}
                  user={user}
                  onChange={onChange}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
