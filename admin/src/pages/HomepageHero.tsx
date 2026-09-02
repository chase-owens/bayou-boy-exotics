import { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  ImagePlus,
  LoaderCircle,
  Trash2,
} from "lucide-react";

import PageHeader from "../components/layout/PageHeader";
import DataCard from "../components/ui/DataCard";
import { useDraft } from "../context/draft/useDraft";
import { fetchImages, type ImageLibraryResponse } from "../api";

import type { Action, Hero } from "../../../shared/types/Home";

export default function HomepageHero() {
  const { home, updateHomeDraft } = useDraft();

  const [imageLibrary, setImageLibrary] = useState<ImageLibraryResponse | null>(
    null,
  );
  const [showImagePicker, setShowImagePicker] = useState(false);

  const isLoadingImages = showImagePicker && !imageLibrary;

  useEffect(() => {
    if (!showImagePicker || imageLibrary) return;

    void fetchImages().then(setImageLibrary);
  }, [showImagePicker, imageLibrary]);

  if (!home) {
    return null;
  }

  const hero = home.hero;

  const updateHero = (updates: Partial<Hero>) => {
    updateHomeDraft((current) => ({
      ...current,
      hero: {
        ...current.hero,
        ...updates,
      },
    }));
  };

  const updatePrimaryAction = (updates: Partial<Action>) => {
    updateHomeDraft((current) => ({
      ...current,
      hero: {
        ...current.hero,
        primaryAction: {
          label: current.hero.primaryAction?.label ?? "",
          href: current.hero.primaryAction?.href ?? "",
          ...updates,
        },
      },
    }));
  };

  const selectImage = (key: string) => {
    const imagePath = key.startsWith("/") ? key : `/${key}`;

    updateHero({
      image: imagePath,
    });

    setShowImagePicker(false);
  };

  const removeImage = () => {
    updateHero({
      image: "",
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Homepage"
        title="Homepage Hero"
        description="Manage the image, messaging, and primary action displayed at the top of the homepage."
      />

      <div className="flex flex-col gap-5 xl:flex-row">
        <DataCard
          eyebrow="Hero Content"
          icon={ImageIcon}
          className="w-full xl:max-w-xl"
        >
          <div className="space-y-5">
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="admin-label">Image</p>
                  <p className="mt-1 text-xs text-white/60">
                    Select an image from the image library.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowImagePicker((current) => !current)}
                  className="flex items-center gap-2 text-sm font-semibold text-accent"
                >
                  <ImagePlus className="size-4" />
                  {hero.image ? "Change Image" : "Add Image"}
                </button>
              </div>

              {hero.image && (
                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={hero.image}
                    alt=""
                    className="h-24 w-36 rounded-md object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center gap-2 text-sm font-semibold text-highlight"
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </button>
                </div>
              )}

              {showImagePicker && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  {isLoadingImages ? (
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <LoaderCircle className="size-4 animate-spin" />
                      Loading images...
                    </div>
                  ) : (
                    <div className="grid max-h-96 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
                      {(imageLibrary?.images ?? []).map((image) => (
                        <button
                          key={image.key}
                          type="button"
                          onClick={() => selectImage(image.key)}
                          className="overflow-hidden rounded-md border border-white/10 transition hover:border-accent"
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="aspect-square w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="admin-label">Eyebrow</label>

              <input
                type="text"
                value={hero.eyebrow ?? ""}
                onChange={(event) =>
                  updateHero({
                    eyebrow: event.target.value || undefined,
                  })
                }
                placeholder="Bayou Boy"
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-label">Title</label>

              <input
                type="text"
                value={hero.title}
                onChange={(event) =>
                  updateHero({
                    title: event.target.value,
                  })
                }
                placeholder="Premium Flower"
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-label">Subtitle</label>

              <textarea
                value={hero.subtitle ?? ""}
                onChange={(event) =>
                  updateHero({
                    subtitle: event.target.value || undefined,
                  })
                }
                placeholder="Fresh drops every week."
                rows={3}
                className="admin-input resize-none"
              />
            </div>

            <div className="border-t border-white/15 pt-5">
              <p className="admin-label mb-4">Primary Action</p>

              <div className="space-y-4">
                <div>
                  <label className="admin-label">Button Label</label>

                  <input
                    type="text"
                    value={hero.primaryAction?.label ?? ""}
                    onChange={(event) =>
                      updatePrimaryAction({
                        label: event.target.value,
                      })
                    }
                    placeholder="Browse Menu"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="admin-label">Button Link</label>

                  <input
                    type="text"
                    value={hero.primaryAction?.href ?? ""}
                    onChange={(event) =>
                      updatePrimaryAction({
                        href: event.target.value,
                      })
                    }
                    placeholder="/menu"
                    className="admin-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </DataCard>

        <DataCard eyebrow="Preview" icon={ImageIcon} className="w-full flex-1">
          <div className="overflow-hidden rounded-xl border border-white/15 bg-black">
            {hero.image ? (
              <div className="relative min-h-80">
                <img
                  src={hero.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-r from-black via-black/65 to-transparent" />

                <div className="relative z-10 flex min-h-80 max-w-md flex-col justify-center p-8">
                  {hero.eyebrow && (
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">
                      {hero.eyebrow}
                    </p>
                  )}

                  <h2 className="font-display text-4xl font-bold text-white">
                    {hero.title}
                  </h2>

                  {hero.subtitle && (
                    <p className="mt-4 text-base text-white/80">
                      {hero.subtitle}
                    </p>
                  )}

                  {hero.primaryAction?.label && (
                    <div className="mt-6">
                      <span className="inline-flex rounded-lg border border-yellow-400 px-5 py-3 text-sm font-semibold text-yellow-400">
                        {hero.primaryAction.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex min-h-80 items-center justify-center text-sm text-white/50">
                Add a hero image to see the preview.
              </div>
            )}
          </div>
        </DataCard>
      </div>
    </>
  );
}
