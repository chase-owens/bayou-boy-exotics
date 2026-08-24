import { Outlet } from "react-router-dom";

import { DraftProvider } from "../context/draft/provider";

export default function DraftRoute() {
  return (
    <DraftProvider>
      <Outlet />
    </DraftProvider>
  );
}
