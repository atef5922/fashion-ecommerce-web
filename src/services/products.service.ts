import type { Product } from "@/types/product";

export const productsService = {
  async getProducts() {
    const response = await fetch("/api/products", { method: "GET" });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to load products." }));
      throw new Error(error.message ?? "Failed to load products.");
    }

    return response.json() as Promise<Product[]>;
  }
};
