import type { Product } from "./product";

export type WishlistProduct = Product & {
  userId: string;
};

export type UserWishlist = {
  userId: string;
  products: WishlistProduct[];
};
