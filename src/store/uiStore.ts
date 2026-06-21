"use client";

import { create } from "zustand";

export type CartFlyAnimation = {
  id: number;
  image: string;
  from: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

type UiState = {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  cartFlyAnimation: CartFlyAnimation | null;
  cartPulseId: number;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  triggerCartFlyAnimation: (image: string, from: DOMRect) => void;
  triggerCartPulse: () => void;
  clearCartFlyAnimation: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  cartFlyAnimation: null,
  cartPulseId: 0,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  triggerCartFlyAnimation: (image, from) =>
    set({
      cartFlyAnimation: {
        id: Date.now(),
        image,
        from: {
          x: from.left,
          y: from.top,
          width: from.width,
          height: from.height
        }
      }
    }),
  triggerCartPulse: () => set((state) => ({ cartPulseId: state.cartPulseId + 1 })),
  clearCartFlyAnimation: () => set({ cartFlyAnimation: null })
}));
