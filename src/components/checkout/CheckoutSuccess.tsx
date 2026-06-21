"use client";

import Link from "next/link";
import { CheckCircle2, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckoutHydration, useCheckoutStore } from "@/store/checkoutStore";
import { formatPrice } from "@/lib/utils";

export function CheckoutSuccess() {
  const hasHydrated = useCheckoutHydration();
  const order = useCheckoutStore((state) => state.lastOrder);
  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);

  if (!hasHydrated) {
    return null;
  }

  return (
    <main className="luxury-container grid min-h-[70vh] place-items-center py-16">
      <section className="w-full max-w-2xl border border-border bg-card p-8 text-center shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card md:p-12">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-luxury-olive/10 text-luxury-olive dark:bg-luxury-gold/10 dark:text-luxury-gold">
          <CheckCircle2 className="size-8" />
        </div>
        <p className="type-eyebrow mt-6 text-luxury-burgundy dark:text-luxury-gold">Order Confirmed</p>
        <h1 className="type-section-title mt-3">Thank you for your order.</h1>
        {order ? (
          <div className="mt-8 grid gap-3 border border-border p-5 text-left dark:border-luxury-dark-border">
            <p className="flex items-center gap-2 text-sm font-semibold"><PackageCheck className="size-4" /> Order {order.orderId}</p>
            <p className="text-sm text-muted-foreground">Total: {formatPrice(order.totals.total)}</p>
            <p className="text-sm text-muted-foreground">Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">Your order confirmation will appear here after checkout.</p>
        )}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/shop"><Button variant="dark" onClick={resetCheckout}>Continue shopping</Button></Link>
          <Link href="/profile?view=orders"><Button variant="outline">View orders</Button></Link>
        </div>
      </section>
    </main>
  );
}
