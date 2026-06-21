"use client";

import { authService } from "@/services/auth.service";
import { useAuthHydration, useAuthStore } from "@/store/authStore";
import type { ForgotPasswordRequest, LoginRequest, RegisterRequest } from "@/types/auth.types";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const hasHydrated = useAuthHydration();

  async function login(data: LoginRequest) {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(data);
      setSession({ user: response.user, token: response.token });
      return response;
    } catch (authError) {
      const message = getErrorMessage(authError);
      setError(message);
      setLoading(false);
      throw authError;
    }
  }

  async function register(data: RegisterRequest) {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);
      if (!response.requiresEmailVerification) {
        setSession({ user: response.user, token: response.token });
        return response;
      }

      setLoading(false);
      return response;
    } catch (authError) {
      const message = getErrorMessage(authError);
      setError(message);
      setLoading(false);
      throw authError;
    }
  }

  async function logout() {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
    } finally {
      clearSession();
    }
  }

  async function forgotPassword(data: ForgotPasswordRequest) {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.forgotPassword(data);
      setLoading(false);
      return response;
    } catch (authError) {
      const message = getErrorMessage(authError);
      setError(message);
      setLoading(false);
      throw authError;
    }
  }

  async function refreshUser() {
    if (!token) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.refreshUser(token);
      setSession({ user: response.user, token: response.token });
      return response.user;
    } catch (authError) {
      const message = getErrorMessage(authError);
      setError(message);
      clearSession();
      throw authError;
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    hasHydrated,
    login,
    register,
    logout,
    forgotPassword,
    refreshUser,
    clearError: () => setError(null)
  };
}
