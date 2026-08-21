import type { AvailabilityContent } from "../../../shared/types/Availability";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAvailability = async (): Promise<AvailabilityContent> => {
  const response = await fetch(`${API_BASE_URL}/admin/availability`);

  if (!response.ok) {
    throw new Error("Failed to load availability content");
  }

  return response.json() as Promise<AvailabilityContent>;
};
