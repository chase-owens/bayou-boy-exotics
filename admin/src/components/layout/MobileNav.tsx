import { NavLink } from "react-router-dom";
import { adminNavItems } from "../../config/adminNav";
import { useAuth } from "../../auth/useAuth";

export default function MobileNav() {
  const auth = useAuth();

  const visibleNavItems = adminNavItems.filter(
    (item) => !item.isAdminOnly || auth.user?.role === "admin",
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 px-2 py-2 backdrop-blur md:hidden">
      <div className="flex items-center justify-around gap-1">
        {visibleNavItems.slice(0, 5).map(({ Icon, to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              [
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold",
                isActive ? "text-highlight" : "text-muted-dark",
              ].join(" ")
            }
          >
            <Icon className="size-5" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
