import type { HomeContent } from "../../../shared/types/Home";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getHome = async (): Promise<HomeContent> => {
  const response = await fetch(`${API_BASE_URL}/admin/home`);

  if (!response.ok) {
    throw new Error("Failed to load homepage content");
  }

  return response.json() as Promise<HomeContent>;
};
