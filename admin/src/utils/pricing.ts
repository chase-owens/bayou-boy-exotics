import type { PricingSet, PriceOption } from "../../../shared/types/Pricing";

export const createPricingFromSet = (set: PricingSet): PriceOption[] =>
  set.options.map((option) => ({
    ...option,
    id: crypto.randomUUID(),
    unit: set.unit,
  }));
