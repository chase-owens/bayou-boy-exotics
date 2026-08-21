import type { MenuContent } from "../../../shared/types/Menu";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getMenu = async (): Promise<MenuContent> => {
  const response = await fetch(`${API_BASE_URL}/admin/menu`);

  if (!response.ok) {
    throw new Error("Failed to load menu content");
  }

  return response.json() as Promise<MenuContent>;
};
