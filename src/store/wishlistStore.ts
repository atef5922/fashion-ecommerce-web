"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/types/product";
import type { WishlistProduct } from "@/types/wishlist";
import { wishlistService } from "@/services/wishlist.service";
import { useAuthHydration, useAuthStore } from "@/store/authStore";

const GUEST_USER_ID = "guest";

function resolveUserId(userId?: string | null) {
  return userId ?? GUEST_USER_ID;
}

function getWishlistStorageName(userId?: string | null) {
  return `fashion-wishlist-${resolveUserId(userId)}`;
}

type WishlistState = {
  userId: string;
  items: WishlistProduct[];
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  setUserId: (userId?: string | null) => Promise<void>;
  toggle: (product: Product) => void;
  removeItem: (productId: string) => void;
  has: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      userId: GUEST_USER_ID,
      items: [],
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setUserId: async (nextUserId) => {
        const userId = resolveUserId(nextUserId);

        if (get().userId === userId && useWishlistStore.persist.hasHydrated()) {
          set({ hasHydrated: true });
          return;
        }

        set({ userId, items: [], hasHydrated: false });
        useWishlistStore.persist.setOptions({ name: getWishlistStorageName(userId) });
        await useWishlistStore.persist.rehydrate();
        const state = useWishlistStore.getState();
        let items = state.userId === userId ? state.items.filter((item) => item.userId === userId) : [];
        if (userId !== GUEST_USER_ID) {
          try {
            const remoteWishlist = await wishlistService.getWishlist();
            items = remoteWishlist.products;
          } catch {
            items = state.userId === userId ? state.items.filter((item) => item.userId === userId) : [];
          }
        }
        set({
          userId,
          items,
          hasHydrated: true
        });
      },
      toggle: (product) =>
        set((state) => {
          const exists = state.items.some((item) => item.userId === state.userId && item.id === product.id);
          const items = exists
            ? state.items.filter((item) => !(item.userId === state.userId && item.id === product.id))
            : [
                ...state.items.filter((item) => !(item.userId === state.userId && item.id === product.id)),
                { ...product, userId: state.userId }
              ];

          if (state.userId !== GUEST_USER_ID) {
            void wishlistService.saveWishlist({ userId: state.userId, products: items });
          }

          return {
            items
          };
        }),
      removeItem: (productId) =>
        set((state) => {
          const items = state.items.filter((item) => !(item.userId === state.userId && item.id === productId));
          if (state.userId !== GUEST_USER_ID) {
            void wishlistService.saveWishlist({ userId: state.userId, products: items });
          }
          return { items };
        }),
      has: (productId) => {
        const state = get();
        return state.items.some((item) => item.userId === state.userId && item.id === productId);
      }
    }),
    {
      name: getWishlistStorageName(GUEST_USER_ID),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
        items: state.items.filter((item) => item.userId === state.userId)
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

export function useWishlistHydration() {
  const authHydrated = useAuthHydration();
  const authUserId = useAuthStore((state) => state.user?.id ?? null);
  const hasHydrated = useWishlistStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!authHydrated) {
      return;
    }

    void useWishlistStore.getState().setUserId(authUserId);
  }, [authHydrated, authUserId]);

  return authHydrated && hasHydrated;
}
