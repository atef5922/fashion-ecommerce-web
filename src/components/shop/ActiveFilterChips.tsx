"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { defaultFilters, type ProductFilters } from "@/lib/filters";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";

type FilterChip = {
  key: keyof ProductFilters;
  label: string;
  value: string;
};

const sortLabels: Record<string, string> = {
  featured: "Featured",
  new: "Newest",
  "price-asc": "Price low to high",
  "price-desc": "Price high to low"
};

const editLabels: Record<string, string> = {
  discount: "Discount products",
  new: "New products",
  popular: "Popular products"
};

function getActiveChips(filters: ProductFilters): FilterChip[] {
  const chips: FilterChip[] = [];

  if (filters.query !== defaultFilters.query) {
    chips.push({ key: "query", label: "Search", value: filters.query });
  }

  if (filters.edit !== defaultFilters.edit) {
    chips.push({ key: "edit", label: "Edit", value: editLabels[filters.edit] ?? filters.edit });
  }

  if (filters.category !== defaultFilters.category) {
    chips.push({ key: "category", label: "Category", value: filters.category });
  }

  if (filters.color !== defaultFilters.color) {
    chips.push({ key: "color", label: "Color", value: filters.color });
  }

  if (filters.size !== defaultFilters.size) {
    chips.push({ key: "size", label: "Size", value: filters.size });
  }

  if (filters.maxPrice !== defaultFilters.maxPrice && filters.maxPrice !== null) {
    chips.push({ key: "maxPrice", label: "Price", value: `Up to ${formatCurrency(filters.maxPrice)}` });
  }

  if (filters.sort !== defaultFilters.sort) {
    chips.push({ key: "sort", label: "Sort", value: sortLabels[filters.sort] ?? filters.sort });
  }

  return chips;
}

export function ActiveFilterChips({
  filters,
  setFilters,
  resetFilters
}: {
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  resetFilters: () => void;
}) {
  const chips = getActiveChips(filters);

  return (
    <AnimatePresence initial={false}>
      {chips.length > 0 && (
        <motion.div
          key="active-filters"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 border-b border-border pb-5 dark:border-luxury-dark-border"
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Active filters</p>
            <Button variant="ghost" size="sm" onClick={resetFilters}>Clear all</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence initial={false}>
              {chips.map((chip) => (
                <motion.button
                  key={chip.key}
                  type="button"
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setFilters({ ...filters, [chip.key]: defaultFilters[chip.key] })}
                  className="inline-flex min-h-10 items-center gap-2 border border-luxury-ink bg-luxury-ink px-3 py-2 text-xs text-white transition hover:bg-luxury-burgundy dark:border-luxury-gold dark:bg-luxury-gold dark:text-luxury-dark dark:hover:bg-[#d8bd91]"
                >
                  <span className="text-white/60 dark:text-luxury-dark/60">{chip.label}</span>
                  <span>{chip.value}</span>
                  <X className="size-3.5" />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
