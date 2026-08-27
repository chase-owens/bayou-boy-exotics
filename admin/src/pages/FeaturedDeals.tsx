import { useEffect, useMemo, useState } from "react";
import {
  Disc,
  ImagePlus,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import type { HomeContent } from "../../../shared/types/Home";
import type { Listing } from "../../../shared/types/Listing";

import { fetchImages, type ImageLibraryResponse } from "../api";
import PageHeader from "../components/layout/PageHeader";
import DataCard from "../components/ui/DataCard";
import { useDraft } from "../context/draft/useDraft";

type Feature = HomeContent["features"][number];

type FeatureDraft = {
  enabled: boolean;
  eyebrow: string;
  headline: string;
  summary: string;
  image: string;
  listingId: string;
  priceOptionId: string;
};

const toStandaloneFeature = (feature: Feature) => {
  const next = { ...feature } as Feature & {
    cartItem?: unknown;
    listingId?: string;
    price?: number;
  };

  delete next.cartItem;
  delete next.listingId;
  delete next.price;

  return next as Feature;
};

const createFeatureDraft = (): FeatureDraft => ({
  enabled: true,
  eyebrow: "Super Steal",
  headline: "",
  summary: "",
  image: "",
  listingId: "",
  priceOptionId: "",
});

const getListingPriceOptions = (listing?: Listing) => listing?.pricing ?? [];

export default function FeaturedDeals() {
  const { home, menu, updateHomeDraft } = useDraft();

  const [featureDraft, setFeatureDraft] = useState<FeatureDraft | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [imageLibrary, setImageLibrary] = useState<ImageLibraryResponse | null>(
    null,
  );

  const [showImagePicker, setShowImagePicker] = useState(false);

  const features = home?.features ?? [];
  const listings = useMemo(() => menu?.listings ?? [], [menu?.listings]);

  const selectedListing = useMemo(
    () => listings.find((listing) => listing.id === featureDraft?.listingId),
    [listings, featureDraft?.listingId],
  );

  const priceOptions = getListingPriceOptions(selectedListing);

  const selectedPriceOption = priceOptions.find(
    (price) => price.id === featureDraft?.priceOptionId,
  );

  const isLoadingImages = showImagePicker && !imageLibrary;
  const isEditing = editingIndex !== null;

  useEffect(() => {
    if (!showImagePicker || imageLibrary) return;

    void fetchImages().then(setImageLibrary);
  }, [showImagePicker, imageLibrary]);

  const updateFeatureDraft = <K extends keyof FeatureDraft>(
    key: K,
    value: FeatureDraft[K],
  ) => {
    setFeatureDraft((current) =>
      current
        ? {
            ...current,
            [key]: value,
          }
        : current,
    );
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setFeatureDraft(createFeatureDraft());
  };

  const handleEdit = (feature: Feature, index: number) => {
    const cartItem =
      "cartItem" in feature && feature.cartItem ? feature.cartItem : undefined;

    const legacyListingId =
      "listingId" in feature && typeof feature.listingId === "string"
        ? feature.listingId
        : "";

    setEditingIndex(index);

    setFeatureDraft({
      enabled: feature.enabled,
      eyebrow: feature.eyebrow ?? "",
      headline: feature.headline ?? "",
      summary: feature.summary ?? "",
      image: feature.image ?? "",
      listingId: cartItem?.listingId ?? legacyListingId,
      priceOptionId: cartItem?.priceOptionId ?? "",
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFeatureDraft(null);
    setShowImagePicker(false);
  };

  const handleListingChange = (listingId: string) => {
    setFeatureDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        listingId,
        priceOptionId: "",
      };
    });
  };

  const selectImage = (key: string) => {
    const imagePath = key.startsWith("/") ? key : `/${key}`;

    updateFeatureDraft("image", imagePath);
    setShowImagePicker(false);
  };

  const removeImage = () => {
    updateFeatureDraft("image", "");
  };

  const handleSave = () => {
    if (!featureDraft) return;

    const existingFeature =
      editingIndex !== null ? features[editingIndex] : undefined;

    const baseFeature = {
      ...(existingFeature ?? {}),
      enabled: featureDraft.enabled,
      eyebrow: featureDraft.eyebrow.trim(),
      headline: featureDraft.headline.trim(),
      summary: featureDraft.summary.trim(),
      image: featureDraft.image,
    };

    let feature: Feature;

    if (!featureDraft.listingId) {
      feature = toStandaloneFeature(baseFeature as Feature);
    } else if (selectedListing && selectedPriceOption) {
      // Current product selected — rebuild cart data from the product.
      feature = {
        ...baseFeature,
        cartItem: {
          image: featureDraft.image,
          listingId: selectedListing.id,
          listingName: selectedListing.name,
          priceOptionId: selectedPriceOption.id,
          priceLabel: selectedPriceOption.label,
          price: selectedPriceOption.price,
          units: selectedPriceOption.units,
          selections: [],
        },
      } as Feature;
    } else if (existingFeature) {
      // Editing legacy/unresolved data — preserve its existing relationship.
      feature = baseFeature as Feature;
    } else {
      return;
    }

    updateHomeDraft((current) => ({
      ...current,
      features:
        editingIndex !== null
          ? current.features.map((existing, index) =>
              index === editingIndex ? feature : existing,
            )
          : [...current.features, feature],
    }));

    handleCancel();
  };

  const handleDelete = (index: number) => {
    updateHomeDraft((current) => ({
      ...current,
      features: current.features.filter(
        (_, featureIndex) => featureIndex !== index,
      ),
    }));
  };

  const canSave = !!featureDraft?.headline.trim() && !!featureDraft?.image;

  return (
    <>
      <PageHeader
        eyebrow="Featured Deals"
        title="Featured Deals"
        description="Manage featured deals shown on the home page."
      />

      <div className="mb-8">
        <DataCard
          eyebrow="Featured Deals"
          className="w-full sm:max-w-3xl"
          icon={Disc}
        >
          {!featureDraft && (
            <>
              <div className="space-y-3">
                {features.map((feature, index) => {
                  const isLinkedProduct =
                    ("cartItem" in feature && !!feature.cartItem) ||
                    ("listingId" in feature && !!feature.listingId);

                  return (
                    <div
                      key={`${feature.headline}-${index}`}
                      className="flex items-center gap-4 border-b border-white/10 pb-3 last:border-0"
                    >
                      {feature.image && (
                        <img
                          src={feature.image}
                          alt=""
                          className="size-16 shrink-0 rounded-md object-cover"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                          {feature.eyebrow}
                        </p>

                        <p className="mt-1 truncate font-semibold text-white">
                          {feature.headline}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/60">
                          <span>
                            {feature.enabled ? "Enabled" : "Disabled"}
                          </span>

                          <span>•</span>

                          <span>
                            {isLinkedProduct ? "Linked Product" : "Standalone"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEdit(feature, index)}
                        className="flex size-9 items-center justify-center text-accent"
                        aria-label={`Edit ${feature.headline}`}
                      >
                        <Pencil className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="flex size-9 items-center justify-center text-highlight"
                        aria-label={`Delete ${feature.headline}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="mt-5 flex items-center gap-2 rounded-vintage border border-accent px-4 py-2 text-sm font-semibold text-accent"
              >
                <Plus className="size-4" />
                Add Featured Deal
              </button>
            </>
          )}

          {featureDraft && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="admin-label text-white">Eyebrow</label>

                  <input
                    value={featureDraft.eyebrow}
                    onChange={(event) =>
                      updateFeatureDraft("eyebrow", event.target.value)
                    }
                    className="admin-input mt-2"
                    placeholder="Super Steal"
                  />
                </div>

                <div>
                  <label className="admin-label text-white">Headline</label>

                  <input
                    value={featureDraft.headline}
                    onChange={(event) =>
                      updateFeatureDraft("headline", event.target.value)
                    }
                    className="admin-input mt-2"
                    placeholder="28 single grams mushrooms"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label text-white">Summary</label>

                <textarea
                  value={featureDraft.summary}
                  onChange={(event) =>
                    updateFeatureDraft("summary", event.target.value)
                  }
                  className="admin-input mt-2 min-h-20 resize-y"
                  placeholder="Optional description..."
                />
              </div>

              <div>
                <label className="admin-label text-white">Linked Product</label>

                <p className="mt-1 text-xs text-white/60">
                  Optional. Leave this standalone or link it to a current
                  product.
                </p>

                <select
                  value={featureDraft.listingId}
                  onChange={(event) => handleListingChange(event.target.value)}
                  className="admin-select mt-2"
                >
                  <option value="">Standalone feature</option>

                  {listings.map((listing) => (
                    <option key={listing.id} value={listing.id}>
                      {listing.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedListing && (
                <div>
                  <label className="admin-label text-white">Price Option</label>

                  <p className="mt-1 text-xs text-white/60">
                    Select the price customers should add from this deal.
                  </p>

                  <select
                    value={featureDraft.priceOptionId}
                    onChange={(event) =>
                      updateFeatureDraft("priceOptionId", event.target.value)
                    }
                    className="admin-select mt-2"
                  >
                    <option value="">Select price</option>

                    {priceOptions.map((price) => (
                      <option key={price.id} value={price.id}>
                        {price.label} — ${price.price}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="admin-label text-white">Image</p>
                    <p className="mt-1 text-xs text-white/60">
                      Select an image from the library.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowImagePicker((current) => !current)}
                    className="flex items-center gap-2 text-sm font-semibold text-accent"
                  >
                    <ImagePlus className="size-4" />
                    {featureDraft.image ? "Change Image" : "Add Image"}
                  </button>
                </div>

                {featureDraft.image && (
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={featureDraft.image}
                      alt=""
                      className="size-24 rounded-md object-cover"
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
                      <div className="grid max-h-96 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
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

              <label className="flex cursor-pointer items-center gap-2 border-y border-white/10 py-4 text-sm font-semibold text-white">
                <input
                  type="checkbox"
                  checked={featureDraft.enabled}
                  onChange={(event) =>
                    updateFeatureDraft("enabled", event.target.checked)
                  }
                  className="size-4 accent-accent"
                />
                Enabled
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave}
                  className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isEditing ? "Save Deal" : "Add Deal"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-vintage border border-white/20 px-4 py-2 text-sm font-semibold text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </DataCard>
      </div>
    </>
  );
}
