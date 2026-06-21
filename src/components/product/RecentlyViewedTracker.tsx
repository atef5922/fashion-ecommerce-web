"use client";

import { useEffect } from "react";
import type { Product } from "@/types/product";
import { useRecentlyViewedHydration, useRecentlyViewedStore } from "@/store/recentlyViewedStore";

export function RecentlyViewedTracker({ product }: { product: Product }) {
  const hasHydrated = useRecentlyViewedHydration();
  const trackProduct = useRecentlyViewedStore((state) => state.trackProduct);

  useEffect(() => {
    if (hasHydrated) {
      trackProduct(product);
    }
  }, [hasHydrated, product, trackProduct]);

  return null;
}
