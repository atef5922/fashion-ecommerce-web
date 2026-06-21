"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@/types/auth.types";

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSession: (payload: { user: User; token: string }) => void;
  updateUser: (updates: Partial<User>) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSession: ({ user, token }) =>
        set({
          user,
          token,
          isAuthenticated: true,
          loading: false,
          error: null
        }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates, name: `${updates.firstName ?? state.user.firstName} ${updates.lastName ?? state.user.lastName}`.trim() } : null
        })),
      clearSession: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null
        })
    }),
    {
      name: "mugnee-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

export function useAuthHydration() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      useAuthStore.getState().setHasHydrated(true);
      return;
    }

    void useAuthStore.persist.rehydrate();
  }, []);

  return hasHydrated;
}
