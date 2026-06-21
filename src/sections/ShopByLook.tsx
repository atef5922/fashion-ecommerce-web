"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { looks } from "@/data/looks";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

const QuickViewModal = dynamic(() => import("@/components/commerce/QuickViewModal").then((mod) => mod.QuickViewModal), {
  ssr: false
});

export function ShopByLook() {
  const look = looks[0];
  const lookProducts = look.hotspots
    .map((hotspot) => ({
      hotspot,
      product: products.find((item) => item.slug === hotspot.productSlug)
    }))
    .filter((item): item is { hotspot: typeof look.hotspots[number]; product: Product } => Boolean(item.product));
  const [activeSlug, setActiveSlug] = useState<string | null>(lookProducts[0]?.product.slug ?? null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <section className="section-padding">
      <div className="container">
        <SectionHeader eyebrow="Editorial styling" title="Shop the look" description="Interactive outfit markers bring the campaign wardrobe into reach." />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="relative min-h-[620px] overflow-hidden bg-muted">
            <Image src={look.image} alt={look.title} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.32))]" />
            {lookProducts.map(({ hotspot, product }, index) => {
              const isActive = activeSlug === product.slug;

              return (
                <motion.div
                  key={`${hotspot.x}-${hotspot.y}`}
                  className="absolute"
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.35, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setActiveSlug(product.slug)}
                  onFocus={() => setActiveSlug(product.slug)}
                >
                  <motion.button
                    type="button"
                    aria-label={`Quick view ${product.name}`}
                    onClick={() => setQuickViewProduct(product)}
                    className="relative flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/75 bg-white text-luxury-ink shadow-[0_18px_50px_rgba(0,0,0,0.28)] outline-none backdrop-blur focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-ink"
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.94 }}
                    animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                    transition={{ duration: 0.6, repeat: isActive ? Infinity : 0, repeatDelay: 0.9 }}
                  >
                    <motion.span
                      className="absolute inset-0 rounded-full border border-white/70"
                      animate={{ scale: [1, 1.75], opacity: [0.55, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: index * 0.25 }}
                    />
                    <Plus className="relative size-5" />
                  </motion.button>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.22 }}
                        className="pointer-events-none absolute left-1/2 top-8 z-10 w-64 -translate-x-1/2 border border-white/20 bg-white/95 p-3 text-luxury-ink shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur md:pointer-events-auto"
                      >
                        <div className="grid grid-cols-[72px_1fr] gap-3">
                          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                            <Image src={product.images[0]} alt={product.name} fill sizes="72px" className="object-cover" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-luxury-burgundy">{product.category}</p>
                            <p className="type-card-title mt-1 text-xl">{product.name}</p>
                            <p className="mt-2 text-sm">{formatPrice(product.price)}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          <Eye className="size-3" /> Click marker for quick view
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          <div className="bg-card p-6 dark:border dark:border-luxury-dark-border dark:bg-luxury-dark-card md:p-10">
            <p className="type-eyebrow text-luxury-burgundy">{look.title}</p>
            <h3 className="type-section-title mt-4">Layered for an evening that lingers.</h3>
            <div className="mt-8 space-y-5">
              {lookProducts.map(({ product }) => (
                  <motion.div
                    key={product.id}
                    layout
                    onMouseEnter={() => setActiveSlug(product.slug)}
                    className={`flex items-center justify-between gap-4 border-b border-border pb-4 transition ${activeSlug === product.slug ? "border-luxury-burgundy" : ""}`}
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category} / {formatPrice(product.price)}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setQuickViewProduct(product)}>
                      <ShoppingBag className="size-3.5" /> View
                    </Button>
                  </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          open={Boolean(quickViewProduct)}
          onOpenChange={(open) => {
            if (!open) setQuickViewProduct(null);
          }}
        />
      )}
    </section>
  );
}
