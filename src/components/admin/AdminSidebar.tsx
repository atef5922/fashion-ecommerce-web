"use client";

import Link from "next/link";
import { Boxes, FolderTree, LayoutDashboard, MessageSquareText, Newspaper, Settings, ShoppingBag, Tags, UsersRound } from "lucide-react";
import type { AdminNavItem } from "@/types/admin/admin.types";

const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, permission: "dashboard:read" },
  { label: "Products", href: "/admin/products", icon: Boxes, permission: "products:manage" },
  { label: "Categories", href: "/admin/categories", icon: FolderTree, permission: "products:manage" },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag, permission: "orders:manage" },
  { label: "Customers", href: "/admin/customers", icon: UsersRound, permission: "customers:read" },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquareText, permission: "content:manage" },
  { label: "Coupons", href: "/admin/coupons", icon: Tags, permission: "marketing:manage" },
  { label: "Blogs", href: "/admin/blogs", icon: Newspaper, permission: "content:manage" },
  { label: "Settings", href: "/admin/settings", icon: Settings, permission: "settings:manage" }
];

export function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen border-r border-border bg-card/95 px-4 py-5 shadow-sm dark:border-luxury-dark-border dark:bg-luxury-dark-card lg:block">
      <Link href="/admin/dashboard" className="block px-3 py-2">
        <span className="font-display text-3xl font-semibold">Mugnee</span>
        <span className="fine-label mt-1 block text-muted-foreground">Admin Studio</span>
      </Link>
      <nav className="mt-8 grid gap-1" aria-label="Admin navigation">
        {adminNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center gap-3 px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-luxury-ink dark:hover:bg-white/10 dark:hover:text-luxury-gold"
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
