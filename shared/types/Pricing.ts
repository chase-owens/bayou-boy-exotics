export interface PriceOption {
  id: string;
  label: string; // "3.5g", "1 cart", "2 for $60"
  price: number;
  units: number;
  unit?: "g" | "each" | "pack" | "cart";
}
