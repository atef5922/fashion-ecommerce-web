"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { getRelatedProductGroups } from "@/lib/products";
import { ProductCard } from "@/components/commerce/ProductCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "sameCategory", label: "Same category" },
  { key: "similarStyle", label: "Similar style" },
  { key: "recommended", label: "Recommended" }
] as const;

export function RelatedProducts({ slug }: { slug: string }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("sameCategory");
  const carouselRef = useRef<HTMLDivElement>(null);
  const groups = useMemo(() => getRelatedProductGroups(slug), [slug]);
  const related = groups[activeTab];

  function scrollCarousel(direction: "left" | "right") {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction === "left" ? -carousel.clientWidth * 0.85 : carousel.clientWidth * 0.85,
      behavior: "smooth"
    });
  }

  return (
    <section className="section-padding bg-white dark:bg-luxury-dark-surface">
      <div className="container">
        <SectionHeader
          eyebrow="Complete the edit"
          title="Related products"
          description="Browse pieces connected by department, styling language, and editorial recommendations."
        />

        <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 dark:border-luxury-dark-border md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "min-h-10 border px-4 text-xs font-semibold uppercase tracking-[0.16em] transition",
                  activeTab === tab.key
                    ? "border-luxury-ink bg-luxury-ink text-white dark:border-luxury-gold dark:bg-luxury-gold dark:text-luxury-dark"
                    : "border-border bg-card text-muted-foreground hover:border-luxury-ink hover:text-luxury-ink dark:border-luxury-dark-border dark:bg-luxury-dark-card dark:hover:border-luxury-gold dark:hover:text-luxury-gold"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" aria-label="Previous related products" onClick={() => scrollCarousel("left")}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Next related products" onClick={() => scrollCarousel("right")}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              ref={carouselRef}
              className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {related.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="w-[72vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[22vw]"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden="true">
          {related.slice(0, Math.min(related.length, 6)).map((product, index) => (
            <span key={product.id} className={cn("h-1.5 rounded-full bg-luxury-ink/25 dark:bg-white/25", index === 0 ? "w-7" : "w-1.5")} />
          ))}
        </div>
      </div>
    </section>
  );
}
