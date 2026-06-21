"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { WishlistButton } from "./WishlistButton";

const LOW_STOCK_THRESHOLD = 5;

export function QuickViewModal({
  product,
  open,
  onOpenChange
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [addState, setAddState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const selectedVariant = product.colorVariants[color];
  const stockCount = selectedVariant?.stockCount ?? 0;
  const isSoldOut = stockCount <= 0 || selectedVariant?.inStock === false;
  const isLowStock = !isSoldOut && stockCount <= LOW_STOCK_THRESHOLD;
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUiStore((state) => state.openCart);
  const triggerCartFlyAnimation = useUiStore((state) => state.triggerCartFlyAnimation);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[min(94vw,1040px)] p-0"
        onOpenAutoFocus={() => {
          returnFocusRef.current = document.activeElement as HTMLElement | null;
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
      >
        <div className="grid md:grid-cols-[0.95fr_1.05fr]">
          <div ref={previewRef} className="grid grid-cols-2 gap-px bg-border">
            {product.images.map((image, index) => (
              <div key={image} className="relative aspect-[3/4] bg-muted">
                <Image
                  src={image}
                  alt={`${product.name} preview ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 260px, 47vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="p-6 md:p-9">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="fine-label text-muted-foreground">{product.brand}</p>
                <DialogTitle className="type-section-title mt-3">{product.name}</DialogTitle>
              </div>
              <WishlistButton product={product} className="shrink-0 border border-border" />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-lg font-medium">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3 fill-luxury-clay text-luxury-clay" />
                {product.rating} / {product.reviewCount} reviews
              </span>
            </div>

            <DialogDescription className="type-body-sm mt-5 text-muted-foreground">{product.description}</DialogDescription>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="fine-label text-luxury-ink dark:text-luxury-dark-secondary">Color / {color}</p>
                <span className={`text-xs ${isSoldOut ? "text-luxury-burgundy" : isLowStock ? "text-luxury-clay dark:text-luxury-gold" : "text-luxury-olive dark:text-luxury-gold"}`}>
                  {isSoldOut ? "Sold out" : isLowStock ? `Low stock / ${stockCount}` : `In stock / ${stockCount}`}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((item) => {
                  const variant = product.colorVariants[item];
                  const itemStockCount = variant?.stockCount ?? 0;
                  const disabled = !variant || variant.inStock === false || itemStockCount <= 0;
                  const itemLowStock = !disabled && itemStockCount <= LOW_STOCK_THRESHOLD;

                  return (
                    <button
                      key={item}
                      disabled={disabled}
                      onClick={() => setColor(item)}
                      className={`relative min-h-10 border px-4 text-xs transition active:scale-95 ${
                        color === item ? "border-luxury-ink bg-luxury-ink text-white dark:border-luxury-gold dark:bg-luxury-gold dark:text-luxury-dark" : "border-border bg-card dark:border-luxury-dark-border"
                      } ${disabled ? "cursor-not-allowed opacity-40 after:absolute after:left-2 after:right-2 after:top-1/2 after:h-px after:-rotate-6 after:bg-current" : ""}`}
                    >
                      {item}
                      {!disabled && itemLowStock && <span className="ml-1 text-[10px] opacity-75">({itemStockCount})</span>}
                    </button>
                  );
                })}
              </div>
              <p className={`mt-3 text-xs ${isSoldOut ? "text-luxury-burgundy" : isLowStock ? "text-luxury-clay dark:text-luxury-gold" : "text-muted-foreground"}`}>
                {isSoldOut ? `${color} is sold out. Open full details to join the back-in-stock list.` : isLowStock ? `Only ${stockCount} left in ${color}.` : `${stockCount} available in ${color}.`}
              </p>
            </div>

            <div className="mt-6">
              <p className="mb-3 fine-label text-luxury-ink dark:text-luxury-dark-secondary">Size / {size}</p>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSize(item)}
                    className={`min-h-11 border text-xs transition active:scale-95 ${
                      size === item ? "border-luxury-ink bg-luxury-ink text-white dark:border-luxury-gold dark:bg-luxury-gold dark:text-luxury-dark" : "border-border bg-card dark:border-luxury-dark-border"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
              <Button
                variant="dark"
                className="h-12"
                disabled={isSoldOut}
                isLoading={addState === "loading"}
                loadingText="Adding"
                onClick={() => {
                  try {
                    if (isSoldOut) {
                      setAddState("error");
                      setMessage(`${color} is currently sold out.`);
                      return;
                    }

                    setAddState("loading");
                    setMessage("");
                    const rect = previewRef.current?.getBoundingClientRect();
                    if (rect) {
                      triggerCartFlyAnimation(selectedVariant?.images[0] ?? product.images[0], rect);
                    }
                    window.setTimeout(() => {
                      addItem(product, { size, color });
                      setAddState("success");
                      setMessage(`${product.name} was added in ${color}, ${size}.`);
                      window.setTimeout(() => {
                        onOpenChange(false);
                        openCart();
                      }, 450);
                    }, 300);
                  } catch {
                    setAddState("error");
                    setMessage("Something interrupted the cart update. Please try again.");
                  }
                }}
              >
                <ShoppingBag className="size-4" /> {isSoldOut ? "Sold out" : "Add to cart"}
              </Button>
              <Link href={`/product/${product.slug}`} onClick={() => onOpenChange(false)}>
                <Button variant="outline" className="h-12 w-full">
                  Full details <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>

            {message && (
              <div
                className={`mt-4 flex items-start gap-2 border p-3 text-sm ${
                  addState === "error"
                    ? "border-luxury-burgundy/40 bg-luxury-burgundy/5 text-luxury-burgundy"
                    : "border-luxury-olive/35 bg-luxury-olive/5 text-luxury-ink dark:border-luxury-gold/35 dark:bg-luxury-gold/10 dark:text-luxury-dark-text"
                }`}
                role={addState === "error" ? "alert" : "status"}
              >
                {addState === "error" ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
                <span>{message}</span>
              </div>
            )}

            <ul className="mt-7 grid gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
              {product.details.slice(0, 3).map((detail) => (
                <li key={detail}>- {detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
