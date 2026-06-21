import type { UserWishlist } from "@/types/wishlist";

async function requestWishlist<T>(init?: RequestInit) {
  const response = await fetch("/api/wishlist", {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Wishlist request failed." }));
    throw new Error(error.message ?? "Wishlist request failed.");
  }

  return response.json() as Promise<T>;
}

export const wishlistService = {
  getWishlist() {
    return requestWishlist<UserWishlist>({ method: "GET" });
  },

  saveWishlist(wishlist: UserWishlist) {
    return requestWishlist<{ success: boolean }>({
      method: "POST",
      body: JSON.stringify({ products: wishlist.products })
    });
  }
};
