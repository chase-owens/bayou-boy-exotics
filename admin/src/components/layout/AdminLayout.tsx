import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="admin-shell grid min-h-screen grid-cols-[280px_1fr]">
      <Sidebar />

      <main
        className="
          relative
           min-w-0
          bg-[url('/images/bb-sketch.png')]
          bg-contain
          bg-fixed
          bg-bottom-right
          bg-no-repeat
          p-8
        "
      >
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
