"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OrderSummary() {
  const [clearState, setClearState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <aside className="border border-border bg-card p-6 dark:border-luxury-dark-border dark:bg-luxury-dark-card">
      <h2 className="type-card-title">Order Summary</h2>
      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Calculated at checkout</span></div>
        <div className="border-t border-border pt-3 font-semibold flex justify-between"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
      </div>
      <Input className="mt-6" placeholder="Promo code" aria-label="Promo code" />
      <Link href="/checkout" className="mt-3 block">
        <Button className="w-full" variant="dark" aria-label="Go to checkout">
          Checkout
        </Button>
      </Link>
      <Button
        className="mt-3 w-full"
        variant="outline"
        isLoading={clearState === "loading"}
        loadingText="Clearing"
        aria-label="Clear all cart items"
        onClick={() => {
          try {
            setClearState("loading");
            window.setTimeout(() => {
              clearCart();
              setClearState("success");
              window.setTimeout(() => setClearState("idle"), 1600);
            }, 260);
          } catch {
            setClearState("error");
            window.setTimeout(() => setClearState("idle"), 1800);
          }
        }}
      >
        Clear cart
      </Button>
      {clearState === "success" && (
        <p className="mt-3 flex items-center gap-2 text-xs text-luxury-olive dark:text-luxury-gold" role="status">
          <CheckCircle2 className="size-3.5" /> Cart cleared.
        </p>
      )}
      {clearState === "error" && (
        <p className="mt-3 flex items-center gap-2 text-xs text-luxury-burgundy" role="alert">
          <AlertCircle className="size-3.5" /> Could not clear the cart. Try again.
        </p>
      )}
      <p className="mt-3 text-xs leading-5 text-muted-foreground">Taxes and delivery are calculated after address details are confirmed.</p>
    </aside>
  );
}
