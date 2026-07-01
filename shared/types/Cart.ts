type CartSelection = {
  optionId: string;
  label: string;
  units: number;
};

export interface CartItemTemplate {
  image: string;
  listingId: string;
  listingName: string;
  priceOptionId: string;
  priceLabel: string;
  price: number;
  selections: CartSelection[];
  units: number;
}

export type CartItem = {
  quantity?: number;
  total?: number;
  id: string;
} & CartItemTemplate;
