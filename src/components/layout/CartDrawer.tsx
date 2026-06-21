"use client";

import Link from "next/link";
import { useRef } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartItem, CartItemSkeleton } from "@/components/commerce/CartItem";
import { formatPrice } from "@/lib/utils";
import { useCartHydration, useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";

export function CartDrawer() {
  const isOpen = useUiStore((state) => state.isCartOpen);
  const close = useUiStore((state) => state.closeCart);
  const hasHydratedCart = useCartHydration();
  const items = useCartStore((state) => state.items);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        onOpenAutoFocus={() => {
          returnFocusRef.current = document.activeElement as HTMLElement | null;
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
      >
        <SheetTitle className="type-subsection-title mb-3">Your Cart</SheetTitle>
        <SheetDescription className="type-body-sm mb-6 text-muted-foreground">
          Review selected items, quantities, colors, and sizes before checkout.
        </SheetDescription>
        <div className="space-y-5">
          {!hasHydratedCart ? (
            <>
              <CartItemSkeleton />
              <CartItemSkeleton />
            </>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your cart is ready for something beautiful.</p>
          ) : (
            items.map((item) => <CartItem key={`${item.product.id}-${item.size}-${item.color}`} item={item} />)
          )}
        </div>
        <div className="mt-8 border-t border-border pt-5">
          <div className="mb-5 flex items-center justify-between text-sm font-semibold uppercase tracking-[0.16em]">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link href="/cart" onClick={close}>
            <Button className="w-full" variant="dark">View cart</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
