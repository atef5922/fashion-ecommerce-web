"use client";

import type { ProductFilters } from "@/lib/filters";
import { Input } from "@/components/ui/input";
import { ActiveFilterChips } from "./ActiveFilterChips";

export function ShopToolbar({
  filters,
  setFilters,
  resetFilters,
  count
}: {
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  resetFilters: () => void;
  count: number;
}) {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">{count} pieces</p>
        <div className="grid gap-3 sm:grid-cols-[minmax(220px,320px)_auto]">
          <Input value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder="Search products" aria-label="Search products" />
          <select
            value={filters.sort}
            onChange={(event) => setFilters({ ...filters, sort: event.target.value })}
            aria-label="Sort products"
            className="h-11 min-w-44 border border-border bg-card px-4 text-sm text-card-foreground outline-none"
          >
            <option value="featured">Featured</option>
            <option value="new">Newest</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>
        </div>
      </div>
      <ActiveFilterChips filters={filters} setFilters={setFilters} resetFilters={resetFilters} />
    </>
  );
}
