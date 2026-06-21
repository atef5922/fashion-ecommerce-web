"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { loading, authorized } = useAdminAuth();

  useEffect(() => {
    if (!loading && !authorized) {
      const query = searchParams.toString();
      const nextPath = query ? `${pathname}?${query}` : pathname;
      router.replace(`/admin/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [authorized, loading, pathname, router, searchParams]);

  if (loading) {
    return (
      <div className="grid min-h-screen grid-cols-[280px_1fr] bg-muted/30">
        <aside className="border-r border-border bg-card p-5">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="mt-8 h-11 w-full" />
          <Skeleton className="mt-3 h-11 w-full" />
          <Skeleton className="mt-3 h-11 w-full" />
        </aside>
        <main className="p-6">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="mt-6 h-72 w-full" />
        </main>
      </div>
    );
  }

  if (!authorized) {
    return (
      <main className="grid min-h-screen place-items-center bg-muted/30 p-6">
        <section className="max-w-md border border-border bg-card p-8 text-center shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-luxury-burgundy/10 text-luxury-burgundy dark:bg-luxury-gold/10 dark:text-luxury-gold">
            <ShieldAlert className="size-6" />
          </div>
          <h1 className="type-subsection-title mt-5">Admin access required</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This workspace is restricted to users with the admin role.
          </p>
          <Link href="/admin/login">
            <Button variant="dark" className="mt-6">Sign in</Button>
          </Link>
        </section>
      </main>
    );
  }

  return children;
}
