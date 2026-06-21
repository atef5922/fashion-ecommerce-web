"use client";

import { useEffect, useMemo, useState } from "react";
import { products as staticProducts } from "@/data/products";
import { productsService } from "@/services/products.service";
import type { Product } from "@/types/product";

export function useStorefrontProducts() {
  const [products, setProducts] = useState<Product[]>(staticProducts);

  useEffect(() => {
    let active = true;

    void productsService
      .getProducts()
      .then((databaseProducts) => {
        if (!active) return;
        const merged = [...databaseProducts, ...staticProducts.filter((product) => !databaseProducts.some((dbProduct) => dbProduct.id === product.id))];
        setProducts(merged);
      })
      .catch(() => {
        if (active) {
          setProducts(staticProducts);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return useMemo(() => products, [products]);
}
