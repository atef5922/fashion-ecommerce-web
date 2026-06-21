import type { UserCart } from "@/types/cart";

async function requestCart<T>(init?: RequestInit) {
  const response = await fetch("/api/cart", {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Cart request failed." }));
    throw new Error(error.message ?? "Cart request failed.");
  }

  return response.json() as Promise<T>;
}

export const cartService = {
  getCart() {
    return requestCart<UserCart>({ method: "GET" });
  },

  saveCart(cart: UserCart) {
    return requestCart<{ success: boolean }>({
      method: "POST",
      body: JSON.stringify({ items: cart.items })
    });
  }
};
