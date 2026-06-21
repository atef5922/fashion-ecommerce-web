"use client";

import type { ProductFilters } from "@/lib/filters";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";

const categories = ["All", "Women", "Men", "Kids", "Accessories"];
const colors = ["All", "Black", "Ivory", "Champagne", "Olive", "Stone", "Tan"];
const sizes = ["All", "XS", "S", "M", "L", "XL", "30", "32", "34"];

export function FilterSidebar({
  filters,
  setFilters,
  resetFilters,
  priceBounds
}: {
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  resetFilters: () => void;
  priceBounds: { min: number; max: number };
}) {
  const displayedMaxPrice = filters.maxPrice ?? priceBounds.max;

  return (
    <aside className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em]">Filters</h2>
        <button type="button" onClick={resetFilters} className="text-xs text-muted-foreground underline">Reset</button>
      </div>
      <FilterGroup title="Category" items={categories} value={filters.category} onChange={(category) => setFilters({ ...filters, category })} />
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]">Price up to {formatCurrency(displayedMaxPrice)}</h3>
        <Slider
          aria-label="Maximum price"
          value={[displayedMaxPrice]}
          min={priceBounds.min}
          max={priceBounds.max}
          step={10}
          onValueChange={([maxPrice]) => setFilters({ ...filters, maxPrice })}
        />
      </div>
      <FilterGroup title="Color" items={colors} value={filters.color} onChange={(color) => setFilters({ ...filters, color })} />
      <FilterGroup title="Size" items={sizes} value={filters.size} onChange={(size) => setFilters({ ...filters, size })} />
      <Button className="h-12 w-full" variant="outline" onClick={resetFilters}>Clear all</Button>
    </aside>
  );
}

function FilterGroup({ title, items, value, onChange }: { title: string; items: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-pressed={value === item}
            className={`min-h-10 border px-3 py-2 text-xs transition active:scale-95 ${value === item ? "border-luxury-ink bg-luxury-ink text-white dark:border-luxury-gold dark:bg-luxury-gold dark:text-luxury-dark" : "border-border bg-card hover:border-luxury-ink dark:border-luxury-dark-border dark:bg-luxury-dark-card dark:text-luxury-dark-secondary dark:hover:border-luxury-gold dark:hover:text-luxury-dark-text"}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
