"use client";

import { useEffect } from "react";
import { mapSupabaseUser } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";

export function AuthSessionSync() {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    let mounted = true;

    try {
      const supabase = getSupabaseBrowserClient();

      void supabase.auth.getSession().then(({ data }) => {
        if (!mounted) return;
        const session = data.session;
        if (session?.user && session.access_token) {
          setSession({ user: mapSupabaseUser(session.user), token: session.access_token });
        }
      });

      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user && session.access_token) {
          setSession({ user: mapSupabaseUser(session.user), token: session.access_token });
          return;
        }

        clearSession();
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } catch {
      return () => {
        mounted = false;
      };
    }
  }, [clearSession, setSession]);

  return null;
}
