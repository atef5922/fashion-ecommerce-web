"use client";

import Link from "next/link";
import { Heart, LogOut, Menu, ChevronDown, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { navigation } from "@/data/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants";
import { useCartHydration, useCartStore } from "@/store/cartStore";
import { useWishlistHydration, useWishlistStore } from "@/store/wishlistStore";
import { useUiStore } from "@/store/uiStore";
import { ThemeToggle } from "./ThemeToggle";

export function MobileMenu() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const hasHydratedCart = useCartHydration();
  const cartCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const hasHydratedWishlist = useWishlistHydration();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const openCart = useUiStore((state) => state.openCart);
  const { user, isAuthenticated, hasHydrated: hasHydratedAuth, logout } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[min(92vw,390px)] flex-col p-0">
        <div className="border-b border-border px-5 pb-5 pt-7">
          <SheetTitle className="font-display text-[2.2rem] font-semibold leading-none tracking-[0.05em]">
            {siteConfig.name}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Mobile navigation menu with wishlist, cart, theme, and collection links.
          </SheetDescription>
          <p className="mt-2 text-[0.55rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {siteConfig.tagline}
          </p>
        </div>
        <div className="grid grid-cols-2 border-b border-border">
          <SheetClose asChild>
            <Link href="/wishlist" className="flex min-h-16 items-center justify-center gap-2 border-r border-border text-sm font-medium active:bg-muted">
              <Heart className="size-4" /> Wishlist {hasHydratedWishlist && wishlistCount > 0 ? `(${wishlistCount})` : ""}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <button type="button" onClick={openCart} className="flex min-h-16 items-center justify-center gap-2 text-sm font-medium active:bg-muted">
              <ShoppingBag className="size-4" /> Cart {hasHydratedCart && cartCount > 0 ? `(${cartCount})` : ""}
            </button>
          </SheetClose>
        </div>
        <div className="border-b border-border px-5 py-4">
          {hasHydratedAuth && isAuthenticated ? (
            <div className="grid gap-3">
              <div>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <SheetClose asChild>
                  <Link href="/profile" className="flex min-h-11 items-center justify-center gap-2 border border-border text-sm font-medium active:bg-muted">
                    <User className="size-4" /> Profile
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    type="button"
                    className="flex min-h-11 items-center justify-center gap-2 border border-border text-sm font-medium text-luxury-burgundy active:bg-muted dark:text-luxury-gold"
                    onClick={() => {
                      void logout();
                    }}
                  >
                    <LogOut className="size-4" /> Logout
                  </button>
                </SheetClose>
              </div>
            </div>
          ) : (
            <SheetClose asChild>
              <Link href="/login" className="flex min-h-11 items-center justify-center gap-2 border border-border text-sm font-medium active:bg-muted">
                <User className="size-4" /> Sign in
              </Link>
            </SheetClose>
          )}
        </div>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="fine-label text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <div className="flex-1 overflow-auto px-5 py-5">
          {navigation.map((item) => (
            <div key={item.label} className="border-b border-border">
              {item.children?.length ? (
                <>
                  <div className="flex items-center gap-2">
                    <SheetClose asChild>
                      <Link href={item.href} className="flex min-h-14 flex-1 items-center py-4 text-base font-semibold uppercase tracking-[0.16em] active:text-luxury-burgundy">
                        {item.label}
                      </Link>
                    </SheetClose>
                    <button
                      type="button"
                      aria-expanded={openItem === item.label}
                      aria-label={`Toggle ${item.label} menu`}
                      className="grid size-10 place-items-center text-muted-foreground transition active:text-luxury-burgundy"
                      onClick={() => setOpenItem((current) => (current === item.label ? null : item.label))}
                    >
                      <ChevronDown className={`size-4 transition ${openItem === item.label ? "rotate-180 text-luxury-burgundy" : ""}`} />
                    </button>
                  </div>
                  <div className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ${openItem === item.label ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="min-h-0 pb-3">
                      {item.children.map((child) => (
                        <SheetClose asChild key={child.label}>
                          <Link href={child.href} className="ml-4 block min-h-11 py-3 pr-4 text-sm text-muted-foreground active:text-luxury-ink dark:active:text-luxury-gold">
                            {child.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <SheetClose asChild>
                  <Link href={item.href} className="block min-h-14 py-4 text-base font-semibold uppercase tracking-[0.16em] active:text-luxury-burgundy">
                    {item.label}
                  </Link>
                </SheetClose>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-border p-5">
          <SheetClose asChild>
            <Link href="/shop">
              <Button type="button" variant="dark" className="w-full">Shop new arrivals</Button>
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
