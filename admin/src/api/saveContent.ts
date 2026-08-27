import { fetchAuthSession } from "aws-amplify/auth";

import type { DraftFileKey } from "../context/draft/context";

const API_URL = import.meta.env.VITE_API_URL;

export const saveContent = async (
  file: DraftFileKey,
  content: unknown,
): Promise<void> => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error("Admin authentication is required");
  }

  const response = await fetch(`${API_URL}admin/content/${file}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(content),
  });

  if (!response.ok) {
    throw new Error(`Failed to save ${file}`);
  }
};
