import { fetchAuthSession } from "aws-amplify/auth";

const API_URL = import.meta.env.VITE_API_URL;

export type ImageFolder = {
  name: string;
  prefix: string;
};

export type ImageAsset = {
  key: string;
  name: string;
  url: string;
  lastModified: string | null;
  size: number;
};

export type ImageLibraryResponse = {
  prefix: string;
  folders: ImageFolder[];
  images: ImageAsset[];
};

export const fetchImages = async (): Promise<ImageLibraryResponse> => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error("Unable to load admin session.");
  }

  const response = await fetch(`${API_URL}admin/images`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load images.");
  }

  return response.json() as Promise<ImageLibraryResponse>;
};
