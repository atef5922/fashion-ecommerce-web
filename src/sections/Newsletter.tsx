import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/shared/Reveal";
import { fashionImages } from "@/data/images";

export function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-luxury-stone">
      <div className="absolute inset-0 opacity-30">
        <Image
          src={fashionImages.campaigns.newsletter}
          alt="Newsletter editorial texture"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-luxury-stone/80 dark:bg-background/88" />
      <div className="luxury-container relative grid min-h-[420px] items-center gap-8 py-14 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:py-16">
        <Reveal>
          <p className="type-eyebrow text-luxury-burgundy">Private client list</p>
          <h2 className="type-section-title mt-4 max-w-3xl">
            Receive the season before it arrives.
          </h2>
          <p className="type-body-sm mt-5 max-w-xl text-luxury-ink/70 dark:text-muted-foreground">
            Early access to capsule drops, styling notes, and private sale appointments from the Mugnee atelier.
          </p>
        </Reveal>
        <Reveal className="border border-luxury-ink/10 bg-white/70 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-card/78 md:p-8">
          <p className="fine-label mb-5 text-muted-foreground">Join the edit</p>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input type="email" placeholder="Email address" aria-label="Email address" className="bg-white/80 dark:bg-background/70" />
            <Button type="button" variant="dark" className="h-11">
              Subscribe <ArrowRight className="size-4" />
            </Button>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            No noise. Only collection previews, seasonal styling, and reserved client offers.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
