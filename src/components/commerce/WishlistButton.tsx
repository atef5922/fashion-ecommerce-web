"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/product";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

export function WishlistButton({ product, className }: { product: Product; className?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<"saved" | "removed" | "">("");
  const toggle = useWishlistStore((state) => state.toggle);
  const isSaved = useWishlistStore((state) => state.has(product.id));

  return (
    <motion.button
      aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      disabled={status === "loading"}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.9 }}
      onClick={(event) => {
        event.preventDefault();
        try {
          const nextFeedback = isSaved ? "removed" : "saved";
          setStatus("loading");
          window.setTimeout(() => {
            toggle(product);
            setFeedback(nextFeedback);
            setStatus("success");
            window.setTimeout(() => {
              setStatus("idle");
              setFeedback("");
            }, 1200);
          }, 180);
        } catch {
          setStatus("error");
          setFeedback("");
          window.setTimeout(() => setStatus("idle"), 1400);
        }
      }}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-full bg-white/90 shadow-[0_10px_30px_rgba(23,23,23,0.08)] backdrop-blur transition hover:bg-white disabled:pointer-events-none dark:border dark:border-luxury-dark-border dark:bg-luxury-dark-surface/95 dark:text-luxury-dark-secondary dark:hover:border-luxury-gold dark:hover:bg-luxury-dark-card dark:hover:text-luxury-gold",
        status === "success" && "ring-2 ring-luxury-burgundy/25 dark:ring-luxury-gold/35",
        status === "error" && "ring-2 ring-luxury-burgundy",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === "loading" ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
            transition={{ duration: 0.18 }}
          >
            <Loader2 className="size-4 animate-spin" />
          </motion.span>
        ) : (
          <motion.span
            key={isSaved ? "saved-heart" : "empty-heart"}
            initial={{ opacity: 0, scale: 0.45 }}
            animate={{
              opacity: 1,
              scale: status === "success" ? [1, 1.35, 1] : 1,
              rotate: status === "success" ? [0, -8, 6, 0] : 0
            }}
            exit={{ opacity: 0, scale: 0.45 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <Heart
              className={cn(
                "size-4 transition-colors duration-300",
                isSaved ? "fill-luxury-burgundy text-luxury-burgundy dark:fill-luxury-gold dark:text-luxury-gold" : "fill-transparent"
              )}
            />
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === "success" && (
          <>
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full border border-luxury-burgundy/45 dark:border-luxury-gold/50"
              initial={{ opacity: 0.8, scale: 0.8 }}
              animate={{ opacity: 0, scale: 1.85 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.62, ease: "easeOut" }}
            />
            <motion.span
              className="pointer-events-none absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-luxury-burgundy text-white shadow-sm dark:bg-luxury-gold dark:text-luxury-dark"
              initial={{ opacity: 0, scale: 0.4, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -4 }}
              transition={{ duration: 0.22 }}
            >
              <Check className="size-3" />
            </motion.span>
            {feedback && (
              <motion.span
                className="pointer-events-none absolute right-0 top-12 whitespace-nowrap border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-card-foreground shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card"
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                {feedback === "saved" ? "Saved" : "Removed"}
              </motion.span>
            )}
          </>
        )}
      </AnimatePresence>
      <span className="sr-only" role={status === "error" ? "alert" : "status"}>
        {status === "error" ? "Wishlist update failed" : feedback ? `Wishlist ${feedback}` : ""}
      </span>
    </motion.button>
  );
}
