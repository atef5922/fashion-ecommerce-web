"use client";

import { useEffect, useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fashionImages } from "@/data/images";
import { adminProducts } from "@/services/admin/admin.mock";
import type { AdminProduct } from "@/types/admin/admin.types";
import type { Product, ProductCategory } from "@/types/product";

type AdminProductState = {
  products: AdminProduct[];
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  addProduct: (product: Omit<AdminProduct, "id" | "vendor"> & { vendor?: string }) => AdminProduct;
  updateProduct: (product: AdminProduct) => void;
  deleteProduct: (productId: string) => void;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function getImagesForCategory(category: ProductCategory) {
  if (category === "Men") return fashionImages.products.linenShirt;
  if (category === "Kids") return [fashionImages.categories.kids, fashionImages.products.cardigan[0]];
  if (category === "Accessories") return fashionImages.products.shoulderBag;
  return fashionImages.products.satinDress;
}

export function adminProductToStorefrontProduct(product: AdminProduct): Product {
  const images = [...getImagesForCategory(product.category as ProductCategory)];
  const color = product.category === "Accessories" ? "Black" : "Champagne";

  return {
    id: product.id,
    slug: slugify(product.title) || product.id,
    name: product.title,
    brand: product.vendor,
    category: product.category as ProductCategory,
    collection: "Admin Collection",
    price: product.price,
    colors: [color],
    colorVariants: {
      [color]: {
        images,
        inStock: product.stock > 0,
        stockCount: product.stock
      }
    },
    sizes: product.category === "Accessories" ? ["One Size"] : ["XS", "S", "M", "L", "XL"],
    images,
    hoverImage: images[1] ?? images[0],
    description: `${product.title} from ${product.vendor}, curated by the Mugnee admin catalog.`,
    details: ["Admin-managed product", `${product.stock} units in stock`, `${product.status} status`],
    rating: 4.8,
    reviewCount: 0,
    isNew: true,
    isFeatured: product.status === "Active",
    isSale: false
  };
}

export const useAdminProductStore = create<AdminProductState>()(
  persist(
    (set) => ({
      products: adminProducts,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      addProduct: (product) => {
        const created: AdminProduct = {
          ...product,
          id: `prd_${Date.now()}`,
          vendor: product.vendor ?? "Mugnee Atelier"
        };
        set((state) => ({ products: [created, ...state.products] }));
        return created;
      },
      updateProduct: (product) =>
        set((state) => ({
          products: state.products.map((item) => (item.id === product.id ? product : item))
        })),
      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((item) => item.id !== productId)
        }))
    }),
    {
      name: "fashion-admin-products",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ products: state.products }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

export function useAdminProductHydration() {
  const hasHydrated = useAdminProductStore((state) => state.hasHydrated);

  useEffect(() => {
    if (useAdminProductStore.persist.hasHydrated()) {
      useAdminProductStore.getState().setHasHydrated(true);
      return;
    }

    void useAdminProductStore.persist.rehydrate();
  }, []);

  return hasHydrated;
}

export function useAdminStorefrontProducts() {
  useAdminProductHydration();
  const products = useAdminProductStore((state) => state.products);

  return useMemo(
    () => products
      .filter((product) => product.status === "Active")
      .map(adminProductToStorefrontProduct),
    [products]
  );
}
