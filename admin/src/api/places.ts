import { fetchAuthSession } from "aws-amplify/auth";

const API_URL = import.meta.env.VITE_API_URL;

export type AddressSuggestion = {
  placeId: string;
  label: string;
  placeType?: string;
};

export const autocompleteAddresses = async (
  query: string,
): Promise<AddressSuggestion[]> => {
  if (query.trim().length < 3) {
    return [];
  }

  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error("Unable to load admin session.");
  }

  const response = await fetch(
    `${API_URL}admin/places/autocomplete?q=${encodeURIComponent(query.trim())}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Unable to search addresses.");
  }

  const data = await response.json();

  return data.suggestions ?? [];
};
