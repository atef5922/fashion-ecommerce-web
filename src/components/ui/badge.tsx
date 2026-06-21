import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-luxury-ink/20 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-luxury-ink dark:border-luxury-gold/40 dark:bg-luxury-gold/12 dark:text-luxury-gold",
        className
      )}
      {...props}
    />
  );
}
