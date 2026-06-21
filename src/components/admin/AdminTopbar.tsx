"use client";

import Link from "next/link";
import { LogOut, ShieldCheck, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { useAuth } from "@/hooks/useAuth";

export function AdminTopbar() {
  const router = useRouter();
  const { user } = useAdminAuth();
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/92 px-4 py-3 backdrop-blur-xl dark:border-luxury-dark-border dark:bg-luxury-dark/92 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="fine-label text-muted-foreground">Admin workspace</p>
          <h1 className="text-lg font-semibold">Operations</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="hidden min-h-10 items-center gap-2 border border-border px-3 text-sm font-medium transition hover:bg-muted dark:border-luxury-dark-border sm:inline-flex">
            <Store className="size-4" /> Storefront
          </Link>
          <div className="hidden items-center gap-2 border border-border px-3 py-2 text-sm dark:border-luxury-dark-border md:flex">
            <ShieldCheck className="size-4 text-luxury-burgundy dark:text-luxury-gold" />
            <span>{user?.name}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Logout admin"
            onClick={async () => {
              await logout();
              router.push("/admin/login");
            }}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
