import type { Product } from "./product";

export type CartItem = {
  userId: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

export type UserCart = {
  userId: string;
  items: CartItem[];
};
