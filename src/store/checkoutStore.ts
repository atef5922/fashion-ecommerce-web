"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CheckoutAddress, CheckoutBilling, OrderResponse } from "@/types/checkout.types";

type CheckoutStep = "shipping" | "billing" | "review" | "success";

type CheckoutState = {
  step: CheckoutStep;
  shipping: CheckoutAddress | null;
  billing: CheckoutBilling | null;
  lastOrder: OrderResponse | null;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  setStep: (step: CheckoutStep) => void;
  setShipping: (shipping: CheckoutAddress) => void;
  setBilling: (billing: CheckoutBilling) => void;
  setLastOrder: (order: OrderResponse) => void;
  resetCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      step: "shipping",
      shipping: null,
      billing: null,
      lastOrder: null,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setStep: (step) => set({ step }),
      setShipping: (shipping) => set({ shipping, step: "billing" }),
      setBilling: (billing) => set({ billing, step: "review" }),
      setLastOrder: (lastOrder) => set({ lastOrder, step: "success" }),
      resetCheckout: () => set({ step: "shipping", shipping: null, billing: null })
    }),
    {
      name: "fashion-checkout",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        step: state.step,
        shipping: state.shipping,
        billing: state.billing,
        lastOrder: state.lastOrder
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

export function useCheckoutHydration() {
  const hasHydrated = useCheckoutStore((state) => state.hasHydrated);

  useEffect(() => {
    if (useCheckoutStore.persist.hasHydrated()) {
      useCheckoutStore.getState().setHasHydrated(true);
      return;
    }

    void useCheckoutStore.persist.rehydrate();
  }, []);

  return hasHydrated;
}
