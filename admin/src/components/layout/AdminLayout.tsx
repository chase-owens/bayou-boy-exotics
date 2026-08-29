import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AdminLayout() {
  return (
    <div className="admin-shell flex min-h-screen flex-col md:grid md:grid-cols-[280px_1fr]">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main
        className="
      relative
      min-w-0
      flex-1
      bg-[url('/images/bb-sketch.png')]
      bg-contain
      bg-bottom
      bg-no-repeat
      p-4
      pb-24
      sm:p-6
      sm:pb-24
      md:p-8
      md:pb-8
    "
      >
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>

      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
