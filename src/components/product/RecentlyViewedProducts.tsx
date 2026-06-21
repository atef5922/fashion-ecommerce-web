"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/commerce/ProductCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProductGridSkeleton } from "@/components/shop/ProductGrid";
import { useRecentlyViewedHydration, useRecentlyViewedStore } from "@/store/recentlyViewedStore";

export function RecentlyViewedProducts({ currentProductId }: { currentProductId: string }) {
  const hasHydrated = useRecentlyViewedHydration();
  const items = useRecentlyViewedStore((state) => state.items);
  const visibleItems = items.filter((product) => product.id !== currentProductId).slice(0, 8);

  if (hasHydrated && visibleItems.length === 0) return null;

  return (
    <section className="section-padding bg-luxury-ivory dark:bg-background">
      <div className="container">
        <SectionHeader
          eyebrow="Your edit"
          title="Recently viewed"
          description="Return to pieces you have been considering, kept quietly on this device."
        />
        {!hasHydrated ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            <AnimatePresence initial={false}>
              {visibleItems.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
