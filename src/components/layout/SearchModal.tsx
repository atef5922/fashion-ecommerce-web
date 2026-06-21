"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StateNotice } from "@/components/shared/StateNotice";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

function highlightMatch(text: string, query: string) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  const matchIndex = text.toLowerCase().indexOf(trimmedQuery.toLowerCase());
  if (matchIndex === -1) return text;

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + trimmedQuery.length);
  const after = text.slice(matchIndex + trimmedQuery.length);

  return (
    <>
      {before}
      <mark className="bg-luxury-gold/30 px-0.5 text-inherit dark:bg-luxury-gold/25">{match}</mark>
      {after}
    </>
  );
}

export function SearchModal() {
  const isOpen = useUiStore((state) => state.isSearchOpen);
  const close = useUiStore((state) => state.closeSearch);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const products = useStorefrontProducts();
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const searchError = trimmedQuery.length > 80 ? "Try a shorter search phrase." : "";

  const results = useMemo(() => {
    if (!hasQuery || searchError) return [];

    const normalizedQuery = trimmedQuery.toLowerCase();
    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.category,
        product.description
      ].join(" ").toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [hasQuery, products, searchError, trimmedQuery]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
    if (!query.trim() || searchError) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = window.setTimeout(() => setIsSearching(false), 180);
    return () => window.clearTimeout(timeout);
  }, [query, searchError]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      close();
      return;
    }

    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const product = results[activeIndex];
      window.location.href = product.collection === "Admin Collection"
        ? `/shop?query=${encodeURIComponent(product.name)}`
        : `/product/${product.slug}`;
      close();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent
        onOpenAutoFocus={(event) => {
          returnFocusRef.current = document.activeElement as HTMLElement | null;
          event.preventDefault();
          inputRef.current?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
      >
        <DialogTitle className="type-subsection-title mb-3">Search the atelier</DialogTitle>
        <DialogDescription className="type-body-sm mb-6 text-muted-foreground">
          Search by product title, category, or description. Use arrow keys to move through results and Enter to open one.
        </DialogDescription>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search dresses, tailoring, linen..."
            autoFocus
            className="pl-11"
            aria-activedescendant={results[activeIndex] ? `search-result-${results[activeIndex].id}` : undefined}
            aria-controls="search-results"
            aria-expanded={hasQuery}
            role="combobox"
          />
        </div>
        <div id="search-results" className="mt-6 min-h-52" role="listbox">
          <AnimatePresence mode="wait">
            {!hasQuery ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="min-h-52"
              >
                <StateNotice
                  title="Begin with a piece, mood, or department."
                  description="Try a product title, category, or fabric detail from the collection."
                  className="min-h-52"
                />
              </motion.div>
            ) : searchError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <StateNotice title="Search needs a trim." description={searchError} tone="error" className="min-h-52" />
              </motion.div>
            ) : isSearching ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="grid gap-2"
                role="status"
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="border border-border p-4 dark:border-luxury-dark-border">
                    <Skeleton className="h-5 w-3/5" />
                    <Skeleton className="mt-3 h-3 w-24" />
                    <Skeleton className="mt-4 h-3 w-full" />
                  </div>
                ))}
              </motion.div>
            ) : results.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <StateNotice
                  title="No results found."
                  description={`Nothing matched "${trimmedQuery}". Try a broader term like women, linen, satin, or tailoring.`}
                  tone="error"
                  className="min-h-52"
                />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="grid gap-2"
              >
                {results.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.035 }}
                  >
                    <Link
                      id={`search-result-${product.id}`}
                      href={product.collection === "Admin Collection" ? `/shop?query=${encodeURIComponent(product.name)}` : `/product/${product.slug}`}
                      onClick={close}
                      role="option"
                      aria-selected={activeIndex === index}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "block border border-transparent p-4 transition duration-200",
                        activeIndex === index
                          ? "border-luxury-ink bg-luxury-ink text-white dark:border-luxury-gold dark:bg-luxury-gold dark:text-luxury-dark"
                          : "border-b-border hover:border-border hover:bg-muted/60 dark:hover:border-luxury-dark-border dark:hover:bg-luxury-dark-surface"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium leading-snug">{highlightMatch(product.name, trimmedQuery)}</p>
                          <p className={cn("mt-1 text-xs uppercase tracking-[0.18em]", activeIndex === index ? "text-white/70 dark:text-luxury-dark/70" : "text-muted-foreground")}>
                            {highlightMatch(product.category, trimmedQuery)}
                          </p>
                        </div>
                        <span className={cn("text-xs", activeIndex === index ? "text-white/70 dark:text-luxury-dark/70" : "text-muted-foreground")}>
                          View
                        </span>
                      </div>
                      <p className={cn("mt-3 line-clamp-2 text-sm leading-6", activeIndex === index ? "text-white/75 dark:text-luxury-dark/75" : "text-muted-foreground")}>
                        {highlightMatch(product.description, trimmedQuery)}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
