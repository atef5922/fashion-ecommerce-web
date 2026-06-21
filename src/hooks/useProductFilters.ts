"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { defaultFilters, filterProducts, type ProductFilters } from "@/lib/filters";
import type { Product } from "@/types/product";

const categories = ["All", "Women", "Men", "Kids", "Accessories"];
const colors = ["All", "Black", "Ivory", "Champagne", "Olive", "Stone", "Tan"];
const sizes = ["All", "XS", "S", "M", "L", "XL", "30", "32", "34"];
const sorts = ["featured", "new", "price-asc", "price-desc"];
const edits = ["", "discount", "new", "popular"];

function readFilterParam(value: string | null, allowedValues: string[], fallback: string) {
  return value && allowedValues.includes(value) ? value : fallback;
}

function getPriceBounds(products: Product[]) {
  const prices = products.map((product) => product.price);
  return {
    min: Math.min(...prices, 0),
    max: Math.max(...prices, 0)
  };
}

function readPriceParam(value: string | null, maxAvailablePrice: number) {
  if (!value) return defaultFilters.maxPrice;
  const price = Number(value);
  if (!Number.isFinite(price)) return defaultFilters.maxPrice;
  return Math.min(maxAvailablePrice, Math.max(0, price));
}

function writeFilterParam(params: URLSearchParams, key: string, value: string | number | null, defaultValue: string | number | null) {
  if (value === defaultValue || value === null) {
    params.delete(key);
    return;
  }

  params.set(key, String(value));
}

export function useProductFilters(products: Product[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const priceBounds = useMemo(() => getPriceBounds(products), [products]);

  const filters = useMemo<ProductFilters>(() => {
    return {
      query: searchParams.get("q") ?? defaultFilters.query,
      edit: readFilterParam(searchParams.get("edit"), edits, defaultFilters.edit),
      category: readFilterParam(searchParams.get("category"), categories, defaultFilters.category),
      color: readFilterParam(searchParams.get("color"), colors, defaultFilters.color),
      size: readFilterParam(searchParams.get("size"), sizes, defaultFilters.size),
      maxPrice: readPriceParam(searchParams.get("price"), priceBounds.max),
      sort: readFilterParam(searchParams.get("sort"), sorts, defaultFilters.sort)
    };
  }, [priceBounds.max, searchParams]);

  const filteredProducts = useMemo(() => filterProducts(products, filters), [products, filters]);
  const setFilters = useCallback((nextFilters: ProductFilters) => {
    const params = new URLSearchParams(searchParams.toString());

    writeFilterParam(params, "q", nextFilters.query.trim(), defaultFilters.query);
    writeFilterParam(params, "edit", nextFilters.edit, defaultFilters.edit);
    writeFilterParam(params, "category", nextFilters.category, defaultFilters.category);
    writeFilterParam(params, "color", nextFilters.color, defaultFilters.color);
    writeFilterParam(params, "size", nextFilters.size, defaultFilters.size);
    writeFilterParam(params, "price", nextFilters.maxPrice, defaultFilters.maxPrice);
    writeFilterParam(params, "sort", nextFilters.sort, defaultFilters.sort);

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("edit");
    params.delete("category");
    params.delete("color");
    params.delete("size");
    params.delete("price");
    params.delete("sort");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  return {
    filters,
    filteredProducts,
    priceBounds,
    setFilters,
    resetFilters
  };
}
