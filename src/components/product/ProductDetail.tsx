"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";

export function ProductDetail({ product }: { product: Product }) {
  const initialColor = useMemo(() => {
    return product.colors.find((color) => product.colorVariants[color]?.inStock) ?? product.colors[0];
  }, [product]);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  return (
    <section className="container grid gap-10 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:py-16">
      <ProductGallery product={product} selectedColor={selectedColor} />
      <ProductInfo product={product} color={selectedColor} onColorChange={setSelectedColor} />
    </section>
  );
}
