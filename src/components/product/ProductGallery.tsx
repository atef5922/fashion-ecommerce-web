"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ProductGallery({ product, selectedColor }: { product: Product; selectedColor: string }) {
  const images = useMemo(() => {
    const variantImages = product.colorVariants[selectedColor]?.images ?? product.images.concat(product.hoverImage);
    return Array.from(new Set(variantImages));
  }, [product, selectedColor]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const activeImage = images[activeIndex];

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedColor]);

  function goToImage(index: number) {
    setActiveIndex((index + images.length) % images.length);
  }

  function handleTouchEnd(touchEnd: number) {
    if (touchStart === null) return;

    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 42) {
      goToImage(activeIndex + (distance > 0 ? 1 : -1));
    }

    setTouchStart(null);
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[88px_1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Show ${product.name} image ${index + 1}`}
              aria-current={activeIndex === index}
              onClick={() => goToImage(index)}
              className={cn(
                "relative aspect-[3/4] w-20 shrink-0 overflow-hidden border bg-muted transition duration-300 lg:w-full",
                activeIndex === index
                  ? "border-luxury-ink shadow-[0_18px_44px_rgba(23,23,23,0.16)] dark:border-luxury-gold"
                  : "border-transparent opacity-65 hover:border-border hover:opacity-100 dark:hover:border-luxury-dark-border"
              )}
            >
              <Image
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                fill
                sizes="88px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <div className="order-1 lg:order-2">
          <div
            data-product-gallery-active
            className="group relative aspect-[3/4] overflow-hidden bg-muted dark:bg-luxury-dark-card"
            onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
            onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedColor}-${activeImage}`}
                initial={{ opacity: 0, scale: 1.035, x: 18 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985, x: -18 }}
                transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={activeImage}
                  alt={`${product.name} view ${activeIndex + 1}`}
                  fill
                  priority={activeIndex === 0}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition duration-[1200ms] ease-out md:group-hover:scale-110"
                />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),transparent_42%,rgba(0,0,0,0.16))] opacity-0 transition duration-500 group-hover:opacity-100" />

            <div className="absolute inset-x-4 top-4 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="fine-label bg-white/85 px-3 py-2 text-luxury-ink shadow-sm backdrop-blur dark:bg-luxury-dark/80 dark:text-luxury-gold">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </span>
                <span className="fine-label bg-luxury-ink/80 px-3 py-2 text-white shadow-sm backdrop-blur dark:bg-luxury-gold/90 dark:text-luxury-dark">
                  {selectedColor}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Open fullscreen image viewer"
                className="border-white bg-white/90 text-luxury-ink shadow-sm backdrop-blur hover:border-white hover:bg-luxury-ink hover:text-white dark:border-luxury-dark-border dark:bg-luxury-dark/85 dark:text-luxury-dark-text dark:hover:border-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-luxury-dark"
                onClick={() => setFullscreenOpen(true)}
              >
                <Expand className="size-4" />
              </Button>
            </div>

            {images.length > 1 && (
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between md:opacity-0 md:transition md:duration-300 md:group-hover:opacity-100">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Previous image"
                  className="border-white bg-white/90 text-luxury-ink shadow-sm backdrop-blur hover:border-white hover:bg-luxury-ink hover:text-white"
                  onClick={() => goToImage(activeIndex - 1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Next image"
                  className="border-white bg-white/90 text-luxury-ink shadow-sm backdrop-blur hover:border-white hover:bg-luxury-ink hover:text-white"
                  onClick={() => goToImage(activeIndex + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-center gap-1.5 lg:hidden" aria-hidden="true">
            {images.map((image, index) => (
              <span
                key={image}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  activeIndex === index ? "w-7 bg-luxury-ink dark:bg-luxury-gold" : "w-1.5 bg-luxury-ink/25 dark:bg-white/25"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="h-[min(92vh,980px)] w-[min(94vw,1280px)] overflow-hidden bg-luxury-ink p-0 text-white dark:bg-luxury-dark">
          <DialogTitle className="sr-only">{product.name} image viewer</DialogTitle>
          <DialogDescription className="sr-only">
            Fullscreen product gallery. Use the previous and next buttons to browse images.
          </DialogDescription>
          <div className="grid h-full lg:grid-cols-[1fr_120px]">
            <div className="relative min-h-[70vh] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`fullscreen-${selectedColor}-${activeImage}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeImage}
                    alt={`${product.name} fullscreen view ${activeIndex + 1}`}
                    fill
                    sizes="94vw"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-5 left-5 fine-label text-white/65">
                {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </div>
              {images.length > 1 && (
                <div className="absolute inset-x-5 top-1/2 flex -translate-y-1/2 justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Previous fullscreen image"
                    className="border-white/35 bg-black/30 text-white backdrop-blur hover:border-white hover:bg-white hover:text-luxury-ink"
                    onClick={() => goToImage(activeIndex - 1)}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Next fullscreen image"
                    className="border-white/35 bg-black/30 text-white backdrop-blur hover:border-white hover:bg-white hover:text-luxury-ink"
                    onClick={() => goToImage(activeIndex + 1)}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="hidden border-l border-white/10 bg-white/5 p-4 lg:block">
              <p className="fine-label mb-4 text-white/55">Gallery</p>
              <div className="grid gap-3">
                {images.map((image, index) => (
                  <button
                    key={`fullscreen-thumb-${image}`}
                    type="button"
                    aria-label={`Show fullscreen image ${index + 1}`}
                    onClick={() => goToImage(index)}
                    className={cn(
                      "relative aspect-[3/4] overflow-hidden border transition",
                      activeIndex === index ? "border-luxury-gold opacity-100" : "border-white/10 opacity-55 hover:opacity-100"
                    )}
                  >
                    <Image src={image} alt={`${product.name} fullscreen thumbnail ${index + 1}`} fill sizes="120px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
