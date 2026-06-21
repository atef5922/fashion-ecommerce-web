"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { navigation } from "@/data/navigation";
import { useCartHydration, useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useWishlistHydration, useWishlistStore } from "@/store/wishlistStore";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants";
import { ProfileDropdown } from "@/components/auth/ProfileDropdown";
import { cn } from "@/lib/utils";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const hasHydratedCart = useCartHydration();
  const cartCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const hasHydratedWishlist = useWishlistHydration();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const openCart = useUiStore((state) => state.openCart);
  const openSearch = useUiStore((state) => state.openSearch);
  const cartPulseId = useUiStore((state) => state.cartPulseId);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setActiveMegaMenu(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-500 dark:shadow-[0_18px_70px_rgba(0,0,0,0.55)]",
        isScrolled
          ? "border-black/10 bg-luxury-ivory/95 shadow-[0_18px_60px_rgba(23,23,23,0.08)] backdrop-blur-xl dark:border-luxury-dark-border dark:bg-luxury-dark"
          : "border-black/5 bg-luxury-ivory/80 backdrop-blur-md dark:border-luxury-dark-border dark:bg-luxury-dark"
      )}
    >
      <div className="hidden h-px bg-gradient-to-r from-transparent via-luxury-gold/70 to-transparent dark:block" />
      <nav className={cn("luxury-container flex items-center justify-between transition-all duration-500", isScrolled ? "h-16" : "h-16 md:h-20")}>
        <div className="flex min-w-10 items-center gap-3 lg:hidden">
          <MobileMenu />
        </div>
        <Link href="/" className="group flex flex-col leading-none text-luxury-ink dark:text-luxury-dark-text lg:min-w-44 xl:min-w-52">
          <span className="font-display text-[1.85rem] font-semibold tracking-[0.05em] sm:text-[2.35rem] md:text-[2.8rem]">
            {siteConfig.name}
          </span>
          <span className="mt-1 hidden text-[0.52rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground dark:text-luxury-gold md:block">
            {siteConfig.tagline}
          </span>
        </Link>
        <div className="relative hidden items-center gap-4 overflow-visible xl:gap-5 2xl:gap-7 lg:flex">
          {navigation.map((item) =>
            item.children ? (
              <MegaMenu
                key={item.label}
                item={item}
                isOpen={activeMegaMenu === item.label}
                onOpen={() => setActiveMegaMenu(item.label)}
                onClose={() => setActiveMegaMenu((current) => (current === item.label ? null : current))}
                onNavigate={() => setActiveMegaMenu(null)}
              />
            ) : (
              <Link key={item.label} href={item.href} className="fine-label relative py-3 text-luxury-ink/75 transition hover:text-luxury-ink after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-luxury-ink after:transition hover:after:scale-x-100 dark:text-luxury-dark-text dark:hover:text-luxury-gold dark:after:bg-luxury-gold">
                {item.label}
              </Link>
            )
          )}
        </div>
        <div className="flex min-w-10 items-center justify-end gap-0.5 sm:gap-1 lg:min-w-40">
          <Button variant="ghost" size="icon" aria-label="Search" onClick={openSearch} className="dark:text-luxury-dark-secondary dark:hover:text-luxury-gold">
            <Search className="size-4" />
          </Button>
          <ProfileDropdown />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Link href="/wishlist" className="relative inline-flex size-10 items-center justify-center rounded-full active:scale-95 hover:bg-black/5 dark:text-luxury-dark-secondary dark:hover:bg-white/10 dark:hover:text-luxury-gold">
            <Heart className="size-4" />
            {hasHydratedWishlist && wishlistCount > 0 && <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-luxury-burgundy text-[10px] text-white">{wishlistCount}</span>}
          </Link>
          <motion.div
            key={cartPulseId}
            animate={cartPulseId ? { scale: [1, 1.18, 0.96, 1] } : { scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button
              data-cart-target
              variant="ghost"
              size="icon"
              aria-label="Cart"
              className="relative dark:text-luxury-dark-secondary dark:hover:text-luxury-gold"
              onClick={openCart}
            >
              <ShoppingBag className="size-4" />
              <AnimatePresence mode="popLayout">
                {hasHydratedCart && cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-luxury-burgundy text-[10px] text-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}
