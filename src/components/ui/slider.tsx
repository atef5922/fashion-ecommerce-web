"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import type * as React from "react";
import { cn } from "@/lib/utils";

export function Slider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root className={cn("relative flex h-5 w-full touch-none items-center", className)} {...props}>
      <SliderPrimitive.Track className="relative h-px grow overflow-hidden bg-border">
        <SliderPrimitive.Range className="absolute h-full bg-luxury-ink dark:bg-luxury-gold" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-4 border border-luxury-ink bg-card outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring dark:border-luxury-gold dark:bg-luxury-dark-card" />
    </SliderPrimitive.Root>
  );
}
