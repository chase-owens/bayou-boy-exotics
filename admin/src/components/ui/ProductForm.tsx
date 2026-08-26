import { Plus, Trash2 } from "lucide-react";

import type {
  Listing,
  ListingOption,
  ProductType,
} from "../../../../shared/types/Listing";
import type { CategoryId } from "../../../../shared/types/Category";
import type {
  PriceOption,
  PricingConfig,
  PricingSet,
} from "../../../../shared/types/Pricing";

const createPricingFromSet = (set: PricingSet): PriceOption[] =>
  set.options.map((option) => ({
    id: crypto.randomUUID(),
    label: option.label,
    price: 0,
    units: option.quantity,
    unit: set.unit,
  }));

const categories: { id: CategoryId; label: string }[] = [
  { id: "flower", label: "Flower" },
  { id: "carts", label: "Carts" },
  { id: "wax", label: "Wax" },
  { id: "pre-rolls", label: "Pre-Rolls" },
  { id: "mushrooms", label: "Mushrooms" },
  { id: "edibles", label: "Edibles" },
];

const productTypes: { value: ProductType; label: string }[] = [
  { value: "indica", label: "Indica" },
  { value: "sativa", label: "Sativa" },
  { value: "hybrid", label: "Hybrid" },
  {
    value: "indica-dominant-hybrid",
    label: "Indica-Dominant Hybrid",
  },
  {
    value: "sativa-dominant-hybrid",
    label: "Sativa-Dominant Hybrid",
  },
];

const pricingUnits: {
  value: NonNullable<PriceOption["unit"]>;
  label: string;
}[] = [
  { value: "g", label: "Grams" },
  { value: "each", label: "Each" },
  { value: "pack", label: "Pack" },
  { value: "cart", label: "Cart" },
];

type Props = {
  draft: Listing;
  pricing?: PricingConfig;
  onChange: (draft: Listing) => void;
  isCategoryLocked?: boolean;
};

const createPriceOption = (categoryId: CategoryId): PriceOption => ({
  id: crypto.randomUUID(),
  label: "",
  price: 0,
  units: 1,
  unit:
    categoryId === "carts"
      ? "cart"
      : categoryId === "flower" ||
          categoryId === "wax" ||
          categoryId === "mushrooms"
        ? "g"
        : "each",
});

const createListingOption = (): ListingOption => ({
  id: crypto.randomUUID(),
  label: "",
  active: true,
});

export default function ProductForm({
  draft,
  isCategoryLocked = false,
  onChange,
  pricing,
}: Props) {
  const updateDraft = <K extends keyof Listing>(key: K, value: Listing[K]) => {
    onChange({
      ...draft,
      [key]: value,
    });
  };

  const handleCategoryChange = (categoryId: CategoryId) => {
    onChange({
      ...draft,
      categoryId,
      type: categoryId === "flower" ? draft.type : undefined,
      options: categoryId === "carts" ? (draft.options ?? []) : undefined,
    });
  };

  const addPrice = () => {
    onChange({
      ...draft,
      pricing: [...draft.pricing, createPriceOption(draft.categoryId)],
    });
  };

  const updatePrice = (priceId: string, updates: Partial<PriceOption>) => {
    onChange({
      ...draft,
      pricing: draft.pricing.map((price) =>
        price.id === priceId ? { ...price, ...updates } : price,
      ),
    });
  };

  const deletePrice = (priceId: string) => {
    onChange({
      ...draft,
      pricing: draft.pricing.filter((price) => price.id !== priceId),
    });
  };

  const handlePricingSetChange = (setId: string) => {
    if (!pricing) return;

    const set = pricing.sets[setId];

    if (!set) return;

    updateDraft("pricing", createPricingFromSet(set));
  };

  const addOption = () => {
    onChange({
      ...draft,
      options: [...(draft.options ?? []), createListingOption()],
    });
  };

  const updateOption = (optionId: string, updates: Partial<ListingOption>) => {
    onChange({
      ...draft,
      options: (draft.options ?? []).map((option) =>
        option.id === optionId ? { ...option, ...updates } : option,
      ),
    });
  };

  const deleteOption = (optionId: string) => {
    onChange({
      ...draft,
      options: (draft.options ?? []).filter((option) => option.id !== optionId),
    });
  };

  return (
    <div className="mt-6 space-y-6 border-t border-white/10 pt-6">
      <p className="admin-eyebrow">Product Details</p>

      <div>
        <label htmlFor="product-category" className="admin-label text-white">
          Category
        </label>

        <select
          id="product-category"
          value={draft.categoryId}
          disabled={isCategoryLocked}
          onChange={(event) =>
            handleCategoryChange(event.target.value as CategoryId)
          }
          className="admin-select mt-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="product-name" className="admin-label text-white">
            Name
          </label>

          <input
            id="product-name"
            value={draft.name}
            onChange={(event) => updateDraft("name", event.target.value)}
            placeholder="Product name"
            className="admin-input mt-2"
          />
        </div>

        <div>
          <label htmlFor="product-brand" className="admin-label text-white">
            Brand
          </label>

          <input
            id="product-brand"
            value={draft.brand ?? ""}
            onChange={(event) => updateDraft("brand", event.target.value)}
            placeholder="Brand"
            className="admin-input mt-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="product-description" className="admin-label text-white">
          Description
        </label>

        <textarea
          id="product-description"
          value={draft.description ?? ""}
          onChange={(event) => updateDraft("description", event.target.value)}
          placeholder="Product description..."
          className="admin-input mt-2 min-h-24 resize-y"
        />
      </div>

      {draft.categoryId === "flower" && (
        <div>
          <label htmlFor="product-type" className="admin-label text-white">
            Type
          </label>

          <select
            id="product-type"
            value={draft.type ?? ""}
            onChange={(event) =>
              updateDraft(
                "type",
                (event.target.value || undefined) as ProductType | undefined,
              )
            }
            className="admin-select mt-2"
          >
            <option value="">Select type</option>

            {productTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <p className="admin-label text-white">Images</p>

        <p className="mt-2 text-sm text-white/60">Image picker coming next.</p>
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="admin-label text-white">Pricing</p>

            <p className="mt-1 text-xs text-white/60">
              Add each available size or quantity.
            </p>
          </div>

          <button
            type="button"
            onClick={addPrice}
            className="flex items-center gap-2 text-sm font-semibold text-accent"
          >
            <Plus className="size-4" />
            Add Price
          </button>
        </div>

        <div>
          <label htmlFor="pricing-pattern" className="admin-label text-white">
            Pricing Pattern
          </label>

          <select
            id="pricing-pattern"
            defaultValue=""
            onChange={(event) => handlePricingSetChange(event.target.value)}
            className="admin-select mt-2"
          >
            <option value="">Select pricing pattern</option>

            {draft.pricing.map((setId) => (
              <option key={setId.id} value={setId.id}>
                {draft.name}
              </option>
            ))}
          </select>
        </div>
        {draft.pricing.length > 0 && (
          <div className="mt-4 space-y-3">
            {draft.pricing.map((price) => (
              <div
                key={price.id}
                className="grid gap-3 border-t border-white/10 pt-3 sm:grid-cols-[1.2fr_0.8fr_0.8fr_1fr_auto]"
              >
                <div>
                  <label className="admin-label text-white">Label</label>

                  <input
                    value={price.label}
                    onChange={(event) =>
                      updatePrice(price.id, {
                        label: event.target.value,
                      })
                    }
                    placeholder={
                      draft.categoryId === "carts" ? "2 for" : "3.5g"
                    }
                    className="admin-input mt-2"
                  />
                </div>

                <div>
                  <label className="admin-label text-white">Price</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price.price}
                    onChange={(event) =>
                      updatePrice(price.id, {
                        price: Number(event.target.value),
                      })
                    }
                    className="admin-input mt-2"
                  />
                </div>

                <div>
                  <label className="admin-label text-white">Units</label>

                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={price.units}
                    onChange={(event) =>
                      updatePrice(price.id, {
                        units: Number(event.target.value),
                      })
                    }
                    className="admin-input mt-2"
                  />
                </div>

                <div>
                  <label className="admin-label text-white">Unit</label>

                  <select
                    value={price.unit ?? ""}
                    onChange={(event) =>
                      updatePrice(price.id, {
                        unit: (event.target.value ||
                          undefined) as PriceOption["unit"],
                      })
                    }
                    className="admin-select mt-2"
                  >
                    <option value="">Select unit</option>

                    {pricingUnits.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => deletePrice(price.id)}
                  aria-label="Delete price"
                  className="mt-7 flex size-10 items-center justify-center text-highlight"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {draft.categoryId === "carts" && (
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="admin-label text-white">Flavors</p>

              <p className="mt-1 text-xs text-white/60">
                Add each available cart flavor.
              </p>
            </div>

            <button
              type="button"
              onClick={addOption}
              className="flex items-center gap-2 text-sm font-semibold text-accent"
            >
              <Plus className="size-4" />
              Add Flavor
            </button>
          </div>

          {(draft.options ?? []).length > 0 && (
            <div className="mt-4 divide-y divide-white/10">
              {(draft.options ?? []).map((option) => (
                <div
                  key={option.id}
                  className="flex items-end gap-3 py-3 first:pt-0"
                >
                  <div className="min-w-0 flex-1">
                    <label className="admin-label text-white">Flavor</label>

                    <input
                      value={option.label}
                      onChange={(event) =>
                        updateOption(option.id, {
                          label: event.target.value,
                        })
                      }
                      placeholder="Blueberry Jam"
                      className="admin-input mt-2"
                    />
                  </div>

                  <label className="mb-2 flex shrink-0 cursor-pointer items-center gap-2 text-sm font-semibold text-white">
                    <input
                      type="checkbox"
                      checked={option.active}
                      onChange={(event) =>
                        updateOption(option.id, {
                          active: event.target.checked,
                        })
                      }
                      className="size-4 accent-accent"
                    />
                    Active
                  </label>

                  <button
                    type="button"
                    onClick={() => deleteOption(option.id)}
                    aria-label={`Delete ${option.label || "flavor"}`}
                    className="mb-1 flex size-10 items-center justify-center text-highlight"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-6 border-y border-white/10 py-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-white">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(event) => updateDraft("active", event.target.checked)}
            className="size-4 accent-accent"
          />
          Active
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-white">
          <input
            type="checkbox"
            checked={draft.featured}
            onChange={(event) => updateDraft("featured", event.target.checked)}
            className="size-4 accent-accent"
          />
          Featured
        </label>
      </div>
    </div>
  );
}
