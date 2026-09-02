import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";

import PageHeader from "../components/layout/PageHeader";
import { fetchImages, uploadImages, type ImageLibraryResponse } from "../api";
import { deleteImage } from "../api/deleteImage";

const UUID_PREFIX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-/i;

const getImageName = (key: string) => {
  const fileName = key.split("/").pop() ?? key;

  return fileName.replace(UUID_PREFIX, "");
};

export default function ImageLibrary() {
  const [library, setLibrary] = useState<ImageLibraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetchImages()
      .then((data) => {
        if (!cancelled) {
          setLibrary(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load image library.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleFilesSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    setIsUploading(true);
    setError("");

    try {
      await uploadImages(files, "");

      const data = await fetchImages();
      setLibrary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload images.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleDeleteImage = async (key: string) => {
    const confirmed = window.confirm(
      "Delete this image? This cannot be undone.",
    );

    if (!confirmed) return;

    setDeletingKey(key);
    setError("");

    try {
      await deleteImage(key);

      setLibrary((current) => {
        if (!current) return current;

        return {
          ...current,
          images: current.images.filter((image) => image.key !== key),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete image.");
    } finally {
      setDeletingKey(null);
    }
  };

  return (
    <>
      <div className="mb-8 flex items-start justify-between gap-4">
        <PageHeader
          eyebrow="Images"
          title="Image Library"
          description="Browse and manage images used across Bayou Boy Exotics."
        />

        <button
          type="button"
          className="admin-button-primary flex shrink-0 items-center gap-2"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus className="size-4" />
              Add Images
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      {error && <p className="admin-error-text mb-5">{error}</p>}

      {isLoading ? (
        <div className="flex items-center gap-3 text-muted">
          <LoaderCircle className="size-5 animate-spin" />
          <span className="text-sm">Loading images...</span>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(library?.images ?? []).map((image) => (
            <article key={image.key} className="admin-card overflow-hidden">
              <div className="aspect-square bg-black/20">
                <img
                  src={image.url}
                  alt={image.name}
                  className="size-full object-cover"
                />
              </div>

              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {getImageName(image.name)}
                  </p>

                  {image.lastModified && (
                    <p className="mt-1 text-xs text-white/60">
                      {format(new Date(image.lastModified), "MMM d, yyyy")}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  title="Delete image"
                  disabled={deletingKey === image.key}
                  onClick={() => void handleDeleteImage(image.key)}
                  className="shrink-0 rounded-md p-2 text-white/50 transition hover:bg-error/15 hover:text-error disabled:opacity-50"
                >
                  {deletingKey === image.key ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4 text-error" />
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
