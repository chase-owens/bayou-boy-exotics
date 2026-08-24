import { useContext } from "react";

import { DraftContext } from "./context";

export const useDraft = () => {
  const context = useContext(DraftContext);

  if (!context) {
    throw new Error("useDraft must be used within DraftProvider");
  }

  return context;
};
