import type { ProductColor } from "./product";

export interface BagItem {
  productId: string;
  slug: string;
  name: string;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
  price: number; // em centavos
  image: string;
}

export interface BagState {
  items: BagItem[];
  isOpen: boolean;
}

export type BagAction =
  | { type: "ADD_ITEM"; payload: BagItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; selectedSize: string; selectedColor: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; selectedSize: string; selectedColor: string; quantity: number } }
  | { type: "CLEAR_BAG" }
  | { type: "OPEN_BAG" }
  | { type: "CLOSE_BAG" }
  | { type: "LOAD_FROM_STORAGE"; payload: BagItem[] };
