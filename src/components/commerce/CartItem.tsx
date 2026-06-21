"use client";

import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import type { CartItem as CartItemType } from "@/types/cart";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { Skeleton } from "@/components/ui/skeleton";
import { QuantityStepper } from "./QuantityStepper";

export function CartItem({ item }: { item: CartItemType }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const remove = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <div className={`grid grid-cols-[84px_1fr_auto] gap-4 border-b border-border pb-5 transition duration-300 ${isRemoving ? "scale-[0.98] opacity-45" : "opacity-100"}`}>
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image src={item.product.images[0]} alt={item.product.name} fill sizes="84px" className="object-cover" />
      </div>
      <div>
        <h3 className="text-sm font-medium">{item.product.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{item.color} / {item.size}</p>
        <p className="mt-2 text-sm">{formatPrice(item.product.price)}</p>
        <QuantityStepper value={item.quantity} onChange={(value) => updateQuantity(item.product.id, value, item.size, item.color)} />
      </div>
      <button
        aria-label="Remove item"
        disabled={isRemoving}
        onClick={() => {
          setIsRemoving(true);
          window.setTimeout(() => remove(item.product.id, item.size, item.color), 220);
        }}
        className="size-8 p-2 transition hover:bg-black/5 disabled:pointer-events-none"
      >
        {isRemoving ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
      </button>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="grid grid-cols-[84px_1fr_auto] gap-4 border-b border-border pb-5">
      <Skeleton className="aspect-[3/4]" />
      <div>
        <Skeleton className="h-4 w-44" />
        <Skeleton className="mt-3 h-3 w-24" />
        <Skeleton className="mt-4 h-4 w-20" />
        <Skeleton className="mt-4 h-9 w-28" />
      </div>
      <Skeleton className="size-8" />
    </div>
  );
}
