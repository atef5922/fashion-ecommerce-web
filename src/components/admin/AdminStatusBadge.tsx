import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AdminStatusBadge({ status }: { status: string }) {
  const tone =
    status === "Active" || status === "Delivered" || status === "Approved" || status === "Published" || status === "Visible"
      ? "border-luxury-olive/30 bg-luxury-olive/10 text-luxury-olive dark:border-luxury-gold/40 dark:bg-luxury-gold/10 dark:text-luxury-gold"
      : status === "Pending" || status === "Processing" || status === "Draft" || status === "Scheduled"
        ? "border-luxury-clay/35 bg-luxury-clay/10 text-luxury-clay dark:border-luxury-gold/35 dark:bg-luxury-gold/10 dark:text-luxury-gold"
        : "border-luxury-burgundy/35 bg-luxury-burgundy/10 text-luxury-burgundy";

  return <Badge className={cn(tone)}>{status}</Badge>;
}
