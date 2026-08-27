import { useState } from "react";
import { Package } from "lucide-react";

import type { Listing } from "../../../shared/types/Listing";

import PageHeader from "../components/layout/PageHeader";
import DataCard from "../components/ui/DataCard";
import ProductForm from "../components/ui/ProductForm";
import ProductWheel from "../components/ui/ProductWheel";
import { useDraft } from "../context/draft/useDraft";
import type { Category } from "../../../shared/types/Category";
import type { PricingConfig } from "../../../shared/types/Pricing";
import { createPricingFromSet } from "../utils/pricing";
import StatusBanner from "../components/ui/StatusBanner";
import type { Banner } from "./Users";

const createProductDraft = (
  categories: Category[],
  pricing?: PricingConfig,
): Listing => {
  const category = categories.find((category) => category.id === "flower");

  const defaultPricingSet = category?.defaultPricingSetId
    ? pricing?.sets[category.defaultPricingSetId]
    : undefined;

  return {
    id: crypto.randomUUID(),
    categoryId: "flower",
    name: "Top Flight",
    images: [],
    pricing: defaultPricingSet ? createPricingFromSet(defaultPricingSet) : [],
    active: true,
    featured: false,
  };
};

export default function Products() {
  const { addListing, deleteListing, editListing, menu, pricing } = useDraft();
  const [banner, showBanner] = useState<Banner>();

  const [productDraft, setProductDraft] = useState<Listing | null>(null);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);

  const isEditing = editingListingId !== null;
  const isCreating = productDraft !== null && !isEditing;
  const listings = menu?.listings ?? [];
  const categories = menu?.categories ?? [];

  const getCategoryLabel = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.label ??
    "Uncategorized";

  const handleAdd = () => {
    setEditingListingId(null);
    setProductDraft(createProductDraft(categories, pricing));
  };

  const handleEdit = (listing: Listing) => {
    setEditingListingId(listing.id);
    setProductDraft(structuredClone(listing));
  };

  const handleCancel = () => {
    setProductDraft(null);
    setEditingListingId(null);
  };

  const handleSave = () => {
    if (!productDraft) return;

    const nextListing: Listing = {
      ...productDraft,
      name: productDraft.name.trim(),
      brand: productDraft.brand?.trim() || undefined,
      description: productDraft.description?.trim() || undefined,
    };

    if (editingListingId) {
      editListing(nextListing);
    } else {
      addListing(nextListing);
    }

    showBanner({
      message: "Product changes saved. Publish changes to make them live.",
      status: "success",
    });

    handleCancel();
  };

  const canSave =
    !!productDraft?.name.trim() && productDraft.pricing.length > 0;

  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Manage Products"
        description="Add, edit, and manage Bayou Boy products."
      />
      {banner && (
        <StatusBanner status={banner.status}>{banner.message}</StatusBanner>
      )}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:flex-wrap">
        <DataCard
          eyebrow="Products"
          icon={Package}
          className="w-full sm:min-w-105 sm:max-w-140"
        >
          {!isCreating && (
            <ProductWheel
              listings={listings}
              getCategoryLabel={getCategoryLabel}
              onEdit={handleEdit}
              onDelete={(listing) => deleteListing(listing.id)}
              hideControls={productDraft !== null}
            />
          )}

          {productDraft && menu?.categories && (
            <ProductForm
              draft={productDraft}
              pricing={pricing}
              categories={menu.categories}
              onChange={setProductDraft}
              isCategoryLocked={isEditing}
            />
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {productDraft ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave}
                  className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editingListingId ? "Save Product" : "Add Product"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-vintage border border-white/20 px-4 py-2 text-sm font-semibold text-white"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="rounded-vintage border border-accent px-4 py-2 text-sm font-semibold text-accent"
              >
                Add Product
              </button>
            )}
          </div>
        </DataCard>
      </div>
    </>
  );
}
