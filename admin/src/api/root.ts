import type { RootContent } from "../../../shared/types/Root";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getRoot = async (): Promise<RootContent> => {
  const response = await fetch(`${API_BASE_URL}/admin/root`);

  if (!response.ok) {
    throw new Error("Failed to load root content");
  }

  return response.json() as Promise<RootContent>;
};
