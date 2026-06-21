import type { Product } from "@/types/product";

export type ProductFilters = {
  query: string;
  edit: string;
  category: string;
  color: string;
  size: string;
  maxPrice: number | null;
  sort: string;
};

export const defaultFilters: ProductFilters = {
  query: "",
  edit: "",
  category: "All",
  color: "All",
  size: "All",
  maxPrice: null,
  sort: "featured"
};

export function filterProducts(products: Product[], filters: ProductFilters) {
  const filtered = products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(filters.query.toLowerCase());
    const matchesCategory = filters.category === "All" || product.category === filters.category;
    const matchesColor = filters.color === "All" || product.colors.includes(filters.color);
    const matchesSize = filters.size === "All" || product.sizes.includes(filters.size);
    const matchesPrice = filters.maxPrice === null || product.price <= filters.maxPrice;
    const matchesEdit =
      filters.edit === "" ||
      (filters.edit === "discount" && product.isSale) ||
      (filters.edit === "new" && product.isNew) ||
      (filters.edit === "popular" && (product.isFeatured || product.reviewCount >= 60));

    return matchesQuery && matchesEdit && matchesCategory && matchesColor && matchesSize && matchesPrice;
  });

  return filtered.sort((a, b) => {
    if (filters.edit === "popular") return b.reviewCount - a.reviewCount;
    if (filters.sort === "price-asc") return a.price - b.price;
    if (filters.sort === "price-desc") return b.price - a.price;
    if (filters.sort === "new") return Number(b.isNew) - Number(a.isNew);
    return Number(b.isFeatured) - Number(a.isFeatured);
  });
}
