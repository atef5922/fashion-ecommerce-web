import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted dark:bg-luxury-dark-card",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/45 before:to-transparent dark:before:via-white/10",
        className
      )}
      aria-hidden="true"
    />
  );
}
