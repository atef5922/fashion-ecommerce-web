"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Check, Eye, ShoppingBag, Sparkles, Star } from "lucide-react";
import type { Product } from "@/types/product";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "./WishlistButton";

const QuickViewModal = dynamic(() => import("./QuickViewModal").then((mod) => mod.QuickViewModal), {
  ssr: false
});

const swatches: Record<string, string> = {
  Black: "#171717",
  Burgundy: "#5d1f2e",
  Champagne: "#d8c4a3",
  Cloud: "#e8e4dd",
  Charcoal: "#3a3a38",
  Olive: "#4e5a45",
  Ivory: "#f6f0e7",
  Sage: "#9aa487",
  Ink: "#1b2230",
  Stone: "#b8aa97",
  Navy: "#1f2d46",
  Oat: "#d7c7ad",
  Heather: "#a7a1a0",
  Espresso: "#3b2a22",
  Tan: "#b7865f"
};

export function ProductCard({ product }: { product: Product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [addState, setAddState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const firstAvailableColor = product.colors.find((color) => product.colorVariants[color]?.stockCount > 0) ?? product.colors[0];
  const [previewColor, setPreviewColor] = useState(firstAvailableColor);
  const imageRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUiStore((state) => state.openCart);
  const triggerCartFlyAnimation = useUiStore((state) => state.triggerCartFlyAnimation);
  const previewVariant = product.colorVariants[previewColor];
  const previewImages = previewVariant?.images?.length ? previewVariant.images : product.images;
  const previewImage = previewImages[0] ?? product.images[0];
  const hoverImage = previewImages[1] ?? product.hoverImage;
  const isAdminManaged = product.collection === "Admin Collection";
  const productHref = isAdminManaged ? `/shop?query=${encodeURIComponent(product.name)}` : `/product/${product.slug}`;
  const totalStock = product.colors.reduce((sum, color) => sum + (product.colorVariants[color]?.stockCount ?? 0), 0);
  const isSoldOut = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const discount = hasDiscount && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <>
      <article className="group relative transition duration-500 ease-out hover:-translate-y-2 active:scale-[0.995]">
        <div className="pointer-events-none absolute -inset-2 opacity-0 blur-2xl transition duration-700 group-hover:opacity-100">
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_35%,rgba(200,169,126,0.24),transparent_58%)]" />
        </div>
        <div className="relative overflow-hidden border border-transparent bg-[#ede7de] shadow-[0_1px_0_rgba(23,23,23,0.08)] transition duration-500 group-hover:border-luxury-ink/10 group-hover:shadow-[0_34px_90px_rgba(23,23,23,0.16)] dark:border-luxury-dark-border dark:bg-luxury-dark-card dark:shadow-[0_1px_0_rgba(255,255,255,0.08)] dark:group-hover:border-luxury-gold/35 dark:group-hover:shadow-[0_34px_90px_rgba(0,0,0,0.52)]">
          <Link href={productHref} aria-label={`View ${product.name}`} className="block">
            <div ref={imageRef} className="relative aspect-[3/4] overflow-hidden">
              <Image
                key={`${product.id}-${previewColor}-primary`}
                src={previewImage}
                alt={product.name}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition duration-[950ms] ease-out group-hover:scale-105 group-hover:opacity-0"
              />
              <Image
                key={`${product.id}-${previewColor}-hover`}
                src={hoverImage}
                alt={`${product.name} ${previewColor} alternate view`}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover opacity-0 transition duration-[950ms] ease-out group-hover:scale-110 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),transparent_35%,rgba(0,0,0,0.52))] opacity-100 transition duration-500 md:opacity-0 md:group-hover:opacity-100" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>
          </Link>

          <div className="absolute left-3 top-3 flex max-w-[78%] flex-wrap gap-2">
            {product.isNew && (
              <Badge className="border-white/70 bg-white/90 text-luxury-ink shadow-sm backdrop-blur dark:border-luxury-gold/45 dark:bg-luxury-gold/15 dark:text-luxury-gold">New season</Badge>
            )}
            {product.isSale && (
              <Badge className="border-luxury-burgundy bg-luxury-burgundy text-white shadow-sm backdrop-blur">
                {discount ? `Save ${discount}%` : "Private sale"}
              </Badge>
            )}
            {isSoldOut && <Badge className="border-luxury-ink bg-luxury-ink text-white shadow-sm">Sold out</Badge>}
            {isLowStock && <Badge className="border-luxury-clay bg-white/90 text-luxury-clay shadow-sm backdrop-blur dark:bg-luxury-dark-card">Low stock</Badge>}
          </div>

          <WishlistButton product={product} className="absolute right-3 top-3" />

          <div className="absolute inset-x-2 bottom-2 grid grid-cols-[1fr_auto] gap-2 opacity-100 transition duration-300 md:inset-x-3 md:bottom-3 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <Button
              variant="dark"
              className="h-10 px-3 text-[10px] shadow-[0_14px_34px_rgba(23,23,23,0.24)] sm:h-11 sm:text-[11px]"
              disabled={isSoldOut}
              isLoading={addState === "loading"}
              loadingText="Adding"
              onClick={() => {
                try {
                  if (isSoldOut) return;
                  setAddState("loading");
                  const rect = imageRef.current?.getBoundingClientRect();
                  if (rect) {
                    triggerCartFlyAnimation(previewImage, rect);
                  }
                  window.setTimeout(() => {
                    addItem(product, { color: previewColor, size: product.sizes[0] });
                    setAddState("success");
                    window.setTimeout(openCart, 420);
                    window.setTimeout(() => setAddState("idle"), 1400);
                  }, 260);
                } catch {
                  setAddState("error");
                  window.setTimeout(() => setAddState("idle"), 1800);
                }
              }}
            >
              {addState === "success" ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
              <span className="hidden sm:inline">{isSoldOut ? "Sold out" : addState === "success" ? "Added" : addState === "error" ? "Try again" : "Add to cart"}</span>
              <span className="sm:hidden">{isSoldOut ? "Sold" : addState === "success" ? "Done" : addState === "error" ? "Retry" : "Add"}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label={`Quick view ${product.name}`}
              className="size-10 border-white bg-white text-luxury-ink shadow-sm hover:border-white hover:bg-luxury-ivory dark:border-luxury-dark-border dark:bg-luxury-dark-surface dark:text-luxury-dark-text dark:hover:border-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-luxury-dark sm:size-11"
              onClick={() => setQuickViewOpen(true)}
            >
              <Eye className="size-4" />
            </Button>
          </div>
        </div>

        <div className="relative border-x border-b border-transparent bg-background/40 px-1 pb-1 pt-4 transition duration-500 group-hover:border-luxury-ink/10 group-hover:bg-card/80 dark:group-hover:border-luxury-dark-border dark:group-hover:bg-luxury-dark-card/70">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="fine-label text-[0.56rem] text-muted-foreground">{product.brand}</p>
            {product.isFeatured && (
              <span className="hidden items-center gap-1 text-[11px] font-medium text-luxury-burgundy sm:inline-flex">
                <Sparkles className="size-3" /> Atelier pick
              </span>
            )}
          </div>
          <Link href={productHref} className="block">
            <h3 className="type-card-title transition group-hover:text-luxury-burgundy dark:text-luxury-dark-text dark:group-hover:text-luxury-gold">
              {product.name}
            </h3>
          </Link>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className={cn("font-medium", product.isSale && "text-luxury-burgundy")}>{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
              <Star className="size-3 fill-luxury-clay text-luxury-clay" /> {product.rating}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {product.colors.slice(0, 5).map((color) => {
                const variant = product.colorVariants[color];
                const isUnavailable = !variant || variant.stockCount <= 0 || !variant.inStock;
                const isActive = previewColor === color;

                return (
                  <button
                    type="button"
                    aria-label={`${color}${isUnavailable ? " sold out" : ""}`}
                    disabled={isUnavailable}
                    onMouseEnter={() => !isUnavailable && setPreviewColor(color)}
                    onFocus={() => !isUnavailable && setPreviewColor(color)}
                    onClick={() => !isUnavailable && setPreviewColor(color)}
                    key={color}
                    className={cn(
                      "relative grid size-5 place-items-center rounded-full border bg-white transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive ? "border-luxury-ink shadow-[0_0_0_3px_rgba(23,23,23,0.08)] dark:border-luxury-gold" : "border-luxury-ink/15 hover:border-luxury-ink/50",
                      isUnavailable && "cursor-not-allowed opacity-40 after:absolute after:left-0.5 after:right-0.5 after:top-1/2 after:h-px after:-rotate-45 after:bg-luxury-ink"
                    )}
                    title={color}
                  >
                    <span
                      className="size-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: swatches[color] ?? "#d8cec1" }}
                    />
                  </button>
                );
              })}
            </div>
            <span className="whitespace-nowrap text-xs text-muted-foreground">{product.colors.length} colors</span>
          </div>
          <div className="mt-3 h-px origin-left scale-x-0 bg-luxury-ink/20 transition duration-500 group-hover:scale-x-100 dark:bg-luxury-gold/30" />
        </div>
      </article>

      {quickViewOpen && <QuickViewModal product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />}
    </>
  );
}
