import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  loadingText?: string;
};

export function Button({
  className,
  variant = "default",
  size = "md",
  isLoading = false,
  loadingText,
  children,
  disabled,
  type,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={cn(
        "button-sheen pressable inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-semibold uppercase tracking-[0.18em] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "dark" && "bg-luxury-ink text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-luxury-burgundy dark:bg-luxury-gold dark:text-luxury-dark dark:hover:bg-[#d8bd91]",
        variant === "outline" && "border border-current bg-transparent hover:bg-luxury-ink hover:text-white dark:border-luxury-dark-border dark:text-luxury-dark-text dark:hover:border-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-luxury-dark",
        variant === "ghost" && "hover:bg-black/5 dark:text-luxury-dark-secondary dark:hover:bg-white/10 dark:hover:text-luxury-dark-text",
        size === "sm" && "h-9 px-4 text-xs",
        size === "md" && "h-11 px-6",
        size === "lg" && "h-12 px-8",
        size === "icon" && "size-10 p-0",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}
