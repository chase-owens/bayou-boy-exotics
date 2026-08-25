import { fetchAuthSession } from "aws-amplify/auth";

const API_URL = import.meta.env.VITE_API_URL;

export type PreparedUpload = {
  key: string;
  name: string;
  url: string;
  uploadUrl: string;
};

type UploadImagesResponse = {
  uploads: PreparedUpload[];
};

export const uploadImages = async (
  files: File[],
  prefix = "",
): Promise<PreparedUpload[]> => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error("Unable to load admin session.");
  }

  const response = await fetch(`${API_URL}admin/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prefix,
      images: files.map((file) => ({
        name: file.name,
        contentType: file.type,
      })),
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(body?.message ?? "Unable to prepare image uploads.");
  }

  const { uploads } = (await response.json()) as UploadImagesResponse;

  await Promise.all(
    uploads.map(async (upload, index) => {
      const file = files[index];

      const uploadResponse = await fetch(upload.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Unable to upload ${file.name}.`);
      }
    }),
  );

  return uploads;
};
