"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin/admin.service";
import { useAuthHydration, useAuthStore } from "@/store/authStore";
import type { AdminPermission, AdminUser } from "@/types/admin/admin.types";

type AdminAuthState = {
  loading: boolean;
  authorized: boolean;
  user: AdminUser | null;
  permissions: AdminPermission[];
};

export function useAdminAuth() {
  const hasHydrated = useAuthHydration();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    authorized: false,
    user: null,
    permissions: []
  });

  useEffect(() => {
    let active = true;

    async function resolveAdminAccess() {
      if (!hasHydrated) {
        return;
      }

      if (isAuthenticated && user?.role === "admin") {
        const adminUser = user as AdminUser;
        const permissions = await adminService.getPermissions(adminUser.id);

        if (active) {
          setState({ loading: false, authorized: true, user: adminUser, permissions });
        }
        return;
      }

      if (active) {
        setState({ loading: false, authorized: false, user: null, permissions: [] });
      }
    }

    void resolveAdminAccess();

    return () => {
      active = false;
    };
  }, [hasHydrated, isAuthenticated, user]);

  return state;
}
