"use client";

import { SlidersHorizontal } from "lucide-react";
import type { ProductFilters } from "@/lib/filters";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterSidebar } from "./FilterSidebar";

export function FilterDrawer({
  filters,
  setFilters,
  resetFilters,
  priceBounds,
  count
}: {
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  resetFilters: () => void;
  priceBounds: { min: number; max: number };
  count: number;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-11 w-full justify-between px-4 lg:hidden">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="size-4" />
            Filters
          </span>
          <span className="text-muted-foreground">{count}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(92vw,420px)] p-5">
        <div className="mb-7 pr-8">
          <p className="fine-label text-luxury-burgundy">Refine collection</p>
          <SheetTitle className="mt-2 font-display text-4xl">Filters</SheetTitle>
          <SheetDescription className="mt-3 text-sm leading-6 text-muted-foreground">
            Narrow the collection by category, price, color, and size.
          </SheetDescription>
        </div>
        <FilterSidebar filters={filters} setFilters={setFilters} resetFilters={resetFilters} priceBounds={priceBounds} />
      </SheetContent>
    </Sheet>
  );
}
