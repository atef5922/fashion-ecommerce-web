import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full border border-luxury-burgundy/25 bg-luxury-burgundy/5 text-luxury-burgundy dark:border-luxury-gold/30 dark:bg-luxury-gold/10 dark:text-luxury-gold">
        <Sparkles className="size-5" />
      </div>
      <h1 className="type-section-title mt-5">{title}</h1>
      <p className="type-body-sm mt-4 text-muted-foreground">{description}</p>
      <Link href="/shop" className="mt-8 inline-block">
        <Button variant="dark">Shop now</Button>
      </Link>
    </div>
  );
}
