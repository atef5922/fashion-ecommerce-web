import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full border border-border bg-card px-4 text-sm text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-luxury-ink focus:ring-2 focus:ring-ring/30 dark:border-luxury-dark-border dark:bg-luxury-dark-card dark:text-luxury-dark-text dark:placeholder:text-luxury-dark-muted dark:focus:border-luxury-gold dark:focus:ring-luxury-gold/25",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
