"use client";

import { CartItem, CartItemSkeleton } from "@/components/commerce/CartItem";
import { OrderSummary } from "@/components/commerce/OrderSummary";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartHydration, useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const hasHydratedCart = useCartHydration();
  const items = useCartStore((state) => state.items);

  return (
    <div className="container py-16">
      <h1 className="type-page-title">Cart</h1>
      {!hasHydratedCart ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]" role="status">
          <div className="space-y-6">
            <CartItemSkeleton />
            <CartItemSkeleton />
          </div>
          <aside className="border border-border bg-card p-6 dark:border-luxury-dark-border dark:bg-luxury-dark-card">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="mt-6 h-4 w-full" />
            <Skeleton className="mt-4 h-4 w-4/5" />
            <Skeleton className="mt-5 h-11 w-full" />
          </aside>
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="Your cart is empty" description="The newest signatures are ready when you are." />
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {items.map((item) => <CartItem key={`${item.product.id}-${item.size}-${item.color}`} item={item} />)}
          </div>
          <OrderSummary />
        </div>
      )}
    </div>
  );
}
