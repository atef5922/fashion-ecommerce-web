"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { cartService } from "@/services/cart.service";
import { useAuthHydration, useAuthStore } from "@/store/authStore";

const GUEST_USER_ID = "guest";

function resolveUserId(userId?: string | null) {
  return userId ?? GUEST_USER_ID;
}

function getCartStorageName(userId?: string | null) {
  return `fashion-cart-${resolveUserId(userId)}`;
}

function mergeCartItems(items: CartItem[]) {
  return items.reduce<CartItem[]>((merged, item) => {
    const existing = merged.find(
      (mergedItem) =>
        mergedItem.userId === item.userId &&
        mergedItem.product.id === item.product.id &&
        mergedItem.size === item.size &&
        mergedItem.color === item.color
    );

    if (existing) {
      existing.quantity += item.quantity;
      return merged;
    }

    merged.push(item);
    return merged;
  }, []);
}

type CartState = {
  userId: string;
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  setUserId: (userId?: string | null) => Promise<void>;
  addItem: (product: Product, options?: { size?: string; color?: string; quantity?: number }) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      userId: GUEST_USER_ID,
      items: [],
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setUserId: async (nextUserId) => {
        const userId = resolveUserId(nextUserId);
        const currentState = get();
        const guestItemsToMigrate =
          currentState.userId === GUEST_USER_ID && userId !== GUEST_USER_ID
            ? currentState.items.filter((item) => item.userId === GUEST_USER_ID)
            : [];

        if (currentState.userId === userId && useCartStore.persist.hasHydrated()) {
          set({ hasHydrated: true });
          return;
        }

        set({ userId, items: [], hasHydrated: false });
        useCartStore.persist.setOptions({ name: getCartStorageName(userId) });
        await useCartStore.persist.rehydrate();
        const state = useCartStore.getState();
        let hydratedItems = state.userId === userId ? state.items.filter((item) => item.userId === userId) : [];
        if (userId !== GUEST_USER_ID) {
          try {
            const remoteCart = await cartService.getCart();
            hydratedItems = remoteCart.items;
          } catch {
            hydratedItems = state.userId === userId ? state.items.filter((item) => item.userId === userId) : [];
          }
        }
        const migratedItems = guestItemsToMigrate.map((item) => ({ ...item, userId }));
        const mergedItems = mergeCartItems([...hydratedItems, ...migratedItems]);

        set({
          userId,
          items: mergedItems,
          hasHydrated: true
        });

        if (userId !== GUEST_USER_ID && guestItemsToMigrate.length) {
          void cartService.saveCart({ userId, items: mergedItems });
        }
      },
      addItem: (product, options) =>
        set((state) => {
          const userId = state.userId;
          const size = options?.size ?? product.sizes[0];
          const color = options?.color ?? product.colors[0];
          const quantity = options?.quantity ?? 1;
          const existing = state.items.find(
            (item) => item.userId === userId && item.product.id === product.id && item.size === size && item.color === color
          );

          if (existing) {
            const items = state.items.map((item) =>
              item.userId === userId && item.product.id === product.id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            if (userId !== GUEST_USER_ID) {
              void cartService.saveCart({ userId, items });
            }
            return {
              items
            };
          }

          const items = [...state.items, { userId, product, quantity, size, color }];
          if (userId !== GUEST_USER_ID) {
            void cartService.saveCart({ userId, items });
          }

          return { items };
        }),
      removeItem: (productId, size, color) =>
        set((state) => {
          const items = state.items.filter(
            (item) =>
              !(
                item.userId === state.userId &&
                item.product.id === productId &&
                (!size || item.size === size) &&
                (!color || item.color === color)
              )
          );
          if (state.userId !== GUEST_USER_ID) {
            void cartService.saveCart({ userId: state.userId, items });
          }
          return { items };
        }),
      updateQuantity: (productId, quantity, size, color) =>
        set((state) => {
          const items = state.items.map((item) =>
            item.userId === state.userId &&
            item.product.id === productId &&
            (!size || item.size === size) &&
            (!color || item.color === color)
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          );
          if (state.userId !== GUEST_USER_ID) {
            void cartService.saveCart({ userId: state.userId, items });
          }
          return { items };
        }),
      clearCart: () =>
        set((state) => {
          if (state.userId !== GUEST_USER_ID) {
            void cartService.saveCart({ userId: state.userId, items: [] });
          }
          return { items: [] };
        })
    }),
    {
      name: getCartStorageName(GUEST_USER_ID),
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

export function useCartHydration() {
  const authHydrated = useAuthHydration();
  const authUserId = useAuthStore((state) => state.user?.id ?? null);
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!authHydrated) {
      return;
    }

    void useCartStore.getState().setUserId(authUserId);
  }, [authHydrated, authUserId]);

  return authHydrated && hasHydrated;
}
