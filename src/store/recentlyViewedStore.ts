"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/types/product";

const MAX_RECENTLY_VIEWED = 8;

type RecentlyViewedState = {
  items: Product[];
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  trackProduct: (product: Product) => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      trackProduct: (product) =>
        set((state) => ({
          items: [
            product,
            ...state.items.filter((item) => item.id !== product.id)
          ].slice(0, MAX_RECENTLY_VIEWED)
        }))
    }),
    {
      name: "mugnee-recently-viewed",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

export function useRecentlyViewedHydration() {
  const hasHydrated = useRecentlyViewedStore((state) => state.hasHydrated);

  useEffect(() => {
    if (useRecentlyViewedStore.persist.hasHydrated()) {
      useRecentlyViewedStore.getState().setHasHydrated(true);
      return;
    }

    void useRecentlyViewedStore.persist.rehydrate();
  }, []);

  return hasHydrated;
}
