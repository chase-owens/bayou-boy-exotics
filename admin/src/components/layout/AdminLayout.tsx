import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="admin-shell grid min-h-screen grid-cols-[280px_1fr]">
      <Sidebar />

      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
