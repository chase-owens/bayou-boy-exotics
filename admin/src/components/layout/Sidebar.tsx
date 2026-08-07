import { NavLink, useLocation } from "react-router-dom";
import { adminNavItems } from "../../config/adminNav";

export default function Sidebar() {
  const { pathname } = useLocation();
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
        {adminNavItems.map(({ Icon, to, label }) => (
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
    </aside>
  );
}
