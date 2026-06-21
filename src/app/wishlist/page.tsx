"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/commerce/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductGridSkeleton } from "@/components/shop/ProductGrid";
import { useWishlistHydration, useWishlistStore } from "@/store/wishlistStore";

export default function WishlistPage() {
  const hasHydratedWishlist = useWishlistHydration();
  const items = useWishlistStore((state) => state.items);

  return (
    <div className="container py-16">
      <h1 className="type-page-title">Wishlist</h1>
      <div className="mt-10">
        {!hasHydratedWishlist ? (
          <ProductGridSkeleton />
        ) : items.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {items.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -18, filter: "blur(6px)" }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState title="No saved pieces" description="Save your favorite silhouettes and return to them any time." />
        )}
      </div>
    </div>
  );
}
