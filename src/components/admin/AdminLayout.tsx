"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminRouteGuard } from "./AdminRouteGuard";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-muted/30 text-foreground dark:bg-luxury-dark">{children}</div>;
  }

  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-muted/30 text-foreground dark:bg-luxury-dark">
        <div className="grid lg:grid-cols-[280px_1fr]">
          <AdminSidebar />
          <div className="min-w-0">
            <AdminTopbar />
            <main className="p-4 lg:p-6">{children}</main>
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
}
