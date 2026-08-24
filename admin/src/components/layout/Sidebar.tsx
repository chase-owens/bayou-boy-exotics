import { NavLink, useLocation } from "react-router-dom";
import { adminNavItems } from "../../config/adminNav";
import { useAuth } from "../../auth/useAuth";
import { UserRound, LogOut } from "lucide-react";
import { useDraft } from "../../context/draft/useDraft";

const fileLabels = {
  availability: "Availability",
  menu: "Menu",
  home: "Homepage",
  root: "Site",
} as const;

export default function Sidebar() {
  const { pathname } = useLocation();
  const auth = useAuth();

  const { hasChanges, dirtyFiles, publishChanges } = useDraft();

  const visibleNavItems = adminNavItems.filter(
    (item) => !item.isAdminOnly || auth.user?.role === "admin",
  );

  return (
    <aside className="admin-sidebar flex min-h-screen flex-col p-6">
      <div>
        <p className="admin-eyebrow">Bayou Boy</p>
        <h1 className="text-3xl leading-none text-gray-700">Exotics</h1>
        <span className="mt-4 inline-flex rounded-md border border-accent px-3 py-1 text-xs font-bold uppercase text-accent">
          Admin
        </span>
      </div>

      <nav className="mt-10 space-y-2">
        {visibleNavItems.map(({ Icon, to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className="admin-nav-item "
          >
            <Icon
              className={`size-5 ${pathname === to ? "text-highlight" : ""}`}
            />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-border pt-5">
        <div className="space-y-4">
          {hasChanges && (
            <div>
              <button
                type="button"
                onClick={() => void publishChanges()}
                className="admin-button-primary flex w-full items-center justify-center"
              >
                Publish Changes
              </button>

              <p className="mt-2 text-center text-xs text-muted">
                {dirtyFiles.map((file) => fileLabels[file]).join(", ")}
              </p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-surface text-white">
              <UserRound className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {auth.user?.email}
              </p>

              <p className="text-xs uppercase tracking-[0.18em] text-muted">
                Team Bayou
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => auth.signOut()}
            className="flex w-full items-center justify-center gap-2 rounded-vintage border border-border px-4 py-2.5 text-sm font-semibold text-muted-dark transition hover:border-highlight hover:text-highlight"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
