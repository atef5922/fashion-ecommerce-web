"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Bell } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { WishlistButton } from "@/components/commerce/WishlistButton";
import { SizeGuideModal } from "./SizeGuideModal";

const LOW_STOCK_THRESHOLD = 5;

export function ProductInfo({
  product,
  color,
  onColorChange
}: {
  product: Product;
  color: string;
  onColorChange: (color: string) => void;
}) {
  const [size, setSize] = useState(product.sizes[0]);
  const [addState, setAddState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [notifyState, setNotifyState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyColor, setNotifyColor] = useState("");
  const [message, setMessage] = useState("");
  const selectedVariant = product.colorVariants[color];
  const stockCount = selectedVariant?.stockCount ?? 0;
  const isSoldOut = stockCount <= 0 || selectedVariant?.inStock === false;
  const isLowStock = !isSoldOut && stockCount <= LOW_STOCK_THRESHOLD;
  const inventoryLabel = isSoldOut ? "Sold out" : isLowStock ? "Low stock" : "In stock";
  const hasErrorMessage = addState === "error" || notifyState === "error";
  const soldOutColors = product.colors.filter((item) => {
    const variant = product.colorVariants[item];
    return !variant || variant.stockCount <= 0 || variant.inStock === false;
  });
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUiStore((state) => state.openCart);
  const triggerCartFlyAnimation = useUiStore((state) => state.triggerCartFlyAnimation);

  return (
    <aside className="sticky top-28">
      <div className="flex gap-2">
        {product.isNew && <Badge>New arrival</Badge>}
        {product.isSale && <Badge className="border-luxury-burgundy text-luxury-burgundy">Sale</Badge>}
      </div>
      <p className="type-eyebrow mt-6 text-muted-foreground">{product.brand}</p>
      <h1 className="type-section-title mt-3">{product.name}</h1>
      <div className="mt-5 flex items-center gap-3">
        <span className="text-xl">{formatPrice(product.price)}</span>
        {product.compareAtPrice && <span className="text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>}
      </div>
      <p className="type-body-sm mt-6 text-muted-foreground">{product.description}</p>
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">Color: {color}</p>
          {selectedVariant && (
            <span className={`text-xs ${isSoldOut ? "text-luxury-burgundy" : isLowStock ? "text-luxury-clay dark:text-luxury-gold" : "text-luxury-olive dark:text-luxury-gold"}`}>
              {inventoryLabel} / {stockCount} available
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((item) => {
            const variant = product.colorVariants[item];
            const isActive = color === item;
            const itemStockCount = variant?.stockCount ?? 0;
            const isDisabled = !variant || variant.inStock === false || itemStockCount <= 0;
            const isItemLowStock = !isDisabled && itemStockCount <= LOW_STOCK_THRESHOLD;

            return (
              <button
                key={item}
                type="button"
                disabled={isDisabled}
                onClick={() => onColorChange(item)}
                aria-pressed={isActive}
                aria-label={`${item}, ${isDisabled ? "sold out" : isItemLowStock ? `low stock, ${itemStockCount} available` : `in stock, ${itemStockCount} available`}`}
                className={`relative border px-4 py-2 text-xs transition ${
                  isActive
                    ? "border-luxury-ink bg-luxury-ink text-white ring-2 ring-luxury-ink/15 dark:border-luxury-gold dark:bg-luxury-gold dark:text-luxury-dark dark:ring-luxury-gold/25"
                    : "border-border hover:border-luxury-ink dark:border-luxury-dark-border dark:text-luxury-dark-secondary dark:hover:border-luxury-gold"
                } ${isDisabled ? "cursor-not-allowed opacity-40 after:absolute after:left-2 after:right-2 after:top-1/2 after:h-px after:-rotate-6 after:bg-current" : ""}`}
              >
                {item}
                {!isDisabled && isItemLowStock && <span className="ml-1 text-[10px] opacity-75">({itemStockCount})</span>}
              </button>
            );
          })}
        </div>
        <div
          className={`mt-4 border p-4 text-sm ${
            isSoldOut
              ? "border-luxury-burgundy/40 bg-luxury-burgundy/5 text-luxury-burgundy"
              : isLowStock
                ? "border-luxury-clay/35 bg-luxury-clay/5 text-luxury-ink dark:border-luxury-gold/35 dark:bg-luxury-gold/10 dark:text-luxury-dark-text"
                : "border-luxury-olive/30 bg-luxury-olive/5 text-luxury-ink dark:border-luxury-gold/30 dark:bg-luxury-gold/10 dark:text-luxury-dark-text"
          }`}
          role={isSoldOut || isLowStock ? "alert" : "status"}
        >
          <div className="flex items-start gap-2">
            {isSoldOut ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
            <div>
              <p className="font-medium">{inventoryLabel}</p>
              <p className="mt-1 text-xs leading-5 opacity-80">
                {isSoldOut
                  ? `${color} is sold out. Join the list below and we will notify you when it returns.`
                  : isLowStock
                    ? `Only ${stockCount} left in ${color}.`
                    : `${stockCount} available in ${color}.`}
              </p>
            </div>
          </div>
        </div>
        {soldOutColors.length > 0 && (
          <div className="mt-4 border border-border bg-card p-4 dark:border-luxury-dark-border dark:bg-luxury-dark-card">
            <div className="flex items-start gap-2">
              <Bell className="mt-0.5 size-4 shrink-0 text-luxury-burgundy dark:text-luxury-gold" />
              <div className="flex-1">
                <p className="text-sm font-medium">Back in stock alerts</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Sold out colors: {soldOutColors.join(", ")}.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <Input
                    type="email"
                    value={notifyEmail}
                    onChange={(event) => setNotifyEmail(event.target.value)}
                    placeholder="Email for restock notice"
                    aria-label="Email for restock notice"
                  />
                  <select
                    value={notifyColor}
                    onChange={(event) => setNotifyColor(event.target.value)}
                    aria-label="Choose sold out color for restock notice"
                    className="h-11 border border-border bg-card px-3 text-xs text-card-foreground outline-none dark:border-luxury-dark-border dark:bg-luxury-dark-card"
                  >
                    <option value="">Choose color</option>
                    {soldOutColors.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <Button
                  className="mt-3 w-full"
                  variant="outline"
                  size="sm"
                  isLoading={notifyState === "loading"}
                  loadingText="Saving"
                  onClick={() => {
                    if (!notifyEmail.includes("@") || !notifyColor) {
                      setNotifyState("error");
                      setMessage("Enter an email and choose a sold out color for the restock alert.");
                      return;
                    }

                    setNotifyState("loading");
                    window.setTimeout(() => {
                      setNotifyState("success");
                      setMessage(`We will notify ${notifyEmail} when ${notifyColor} is back in stock.`);
                    }, 350);
                  }}
                >
                  Notify me
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">Size: {size}</p>
          <SizeGuideModal />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {product.sizes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSize(item)}
              aria-pressed={size === item}
              className={`border py-3 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${size === item ? "border-luxury-ink bg-luxury-ink text-white dark:border-luxury-gold dark:bg-luxury-gold dark:text-luxury-dark" : "border-border bg-card dark:border-luxury-dark-border dark:text-luxury-dark-secondary"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 flex gap-3">
        <Button
          className="flex-1"
          variant="dark"
          disabled={isSoldOut}
          isLoading={addState === "loading"}
          loadingText="Adding"
          onClick={() => {
            try {
              if (!size || !color || isSoldOut) {
                setAddState("error");
                setMessage(isSoldOut ? `${color} is currently sold out.` : "Choose a size and color before adding this piece.");
                return;
              }

              setAddState("loading");
              setMessage("");
              const sourceElement = document.querySelector("[data-product-gallery-active]");
              const sourceRect = sourceElement?.getBoundingClientRect();
              if (sourceRect) {
                triggerCartFlyAnimation(selectedVariant?.images[0] ?? product.images[0], sourceRect);
              }
              window.setTimeout(() => {
                addItem(product, { size, color });
                setAddState("success");
                setMessage(`${product.name} was added in ${color}, ${size}.`);
                window.setTimeout(openCart, 420);
                window.setTimeout(() => {
                  setAddState("idle");
                  setMessage("");
                }, 1800);
              }, 300);
            } catch {
              setAddState("error");
              setMessage("Something interrupted the cart update. Please try again.");
            }
          }}
        >
          {isSoldOut ? "Sold out" : "Add to cart"}
        </Button>
        <WishlistButton product={product} className="border border-border" />
      </div>
      {message && (
        <div
          className={`mt-4 flex items-start gap-2 border p-3 text-sm ${
            hasErrorMessage
              ? "border-luxury-burgundy/40 bg-luxury-burgundy/5 text-luxury-burgundy"
              : "border-luxury-olive/35 bg-luxury-olive/5 text-luxury-ink dark:border-luxury-gold/35 dark:bg-luxury-gold/10 dark:text-luxury-dark-text"
          }`}
          role={hasErrorMessage ? "alert" : "status"}
        >
          {hasErrorMessage ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
          <span>{message}</span>
        </div>
      )}
      <ul className="mt-8 space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
        {product.details.map((detail) => <li key={detail}>- {detail}</li>)}
      </ul>
    </aside>
  );
}
