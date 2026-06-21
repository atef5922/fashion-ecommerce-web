"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, LogOut, Package, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, hasHydrated, logout } = useAuth();

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (!hasHydrated) {
    return (
      <Button variant="ghost" size="icon" aria-label="Account" className="hidden dark:text-luxury-dark-secondary dark:hover:text-luxury-gold sm:inline-flex">
        <User className="size-4" />
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link href="/login" className="hidden size-10 items-center justify-center rounded-full hover:bg-black/5 dark:text-luxury-dark-secondary dark:hover:bg-white/10 dark:hover:text-luxury-gold sm:inline-flex" aria-label="Sign in">
        <User className="size-4" />
      </Link>
    );
  }

  return (
    <div className="relative hidden sm:block" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="dark:text-luxury-dark-secondary dark:hover:text-luxury-gold"
        onClick={() => setIsOpen((current) => !current)}
      >
        <User className="size-4" />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-12 z-50 w-64 border border-border bg-card p-2 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card"
            role="menu"
          >
            <div className="border-b border-border px-3 py-3 dark:border-luxury-dark-border">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <ProfileMenuLink href="/profile" icon={User} label="My Profile" onClick={() => setIsOpen(false)} />
            <ProfileMenuLink href="/profile?view=orders" icon={Package} label="Orders" onClick={() => setIsOpen(false)} />
            <ProfileMenuLink href="/wishlist" icon={Heart} label="Wishlist" onClick={() => setIsOpen(false)} />
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm text-luxury-burgundy transition hover:bg-muted dark:text-luxury-gold"
              onClick={async () => {
                await logout();
                setIsOpen(false);
              }}
            >
              <LogOut className="size-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileMenuLink({
  href,
  icon: Icon,
  label,
  onClick
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-3 px-3 py-3 text-sm transition hover:bg-muted dark:hover:bg-white/10"
      onClick={onClick}
    >
      <Icon className="size-4" /> {label}
    </Link>
  );
}
