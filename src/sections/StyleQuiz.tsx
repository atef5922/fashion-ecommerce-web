"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useQuizStore } from "@/store/quizStore";
import { Button } from "@/components/ui/button";

const moods = [
  { label: "Tailored", copy: "Structured layers, sharp trousers, polished work-to-dinner pieces.", route: "/shop?query=tailoring" },
  { label: "Romantic", copy: "Satin, soft drape, evening textures, and a little ceremony.", route: "/shop?query=satin" },
  { label: "Minimal", copy: "Clean neutrals, quiet lines, and low-effort wardrobe repeaters.", route: "/shop?sort=featured" },
  { label: "Weekend", copy: "Linen, relaxed proportions, and off-duty pieces that still look intentional.", route: "/shop?query=linen" }
];

export function StyleQuiz() {
  const mood = useQuizStore((state) => state.mood);
  const setMood = useQuizStore((state) => state.setMood);
  const activeMood = moods.find((item) => item.label === mood) ?? moods[0];

  return (
    <section className="section-padding bg-luxury-ivory dark:bg-background">
      <div className="luxury-container">
        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <p className="type-eyebrow text-luxury-burgundy dark:text-luxury-gold">Adaptive merchandising</p>
            <h2 className="type-section-title mt-4">A faster path to the right edit.</h2>
            <p className="type-body-sm mt-5 max-w-md text-muted-foreground">
              Guided shopping is now a luxury signal: fewer choices, better language, and a recommendation that feels like a stylist made the first pass.
            </p>
          </div>
          <div className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card md:p-8">
            <div className="grid gap-3 sm:grid-cols-4">
              {moods.map((item) => (
                <Button key={item.label} variant={mood === item.label ? "dark" : "outline"} onClick={() => setMood(item.label)}>
                  {item.label}
                </Button>
              ))}
            </div>
            <div className="mt-8 grid gap-6 border-t border-border pt-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="type-eyebrow text-muted-foreground">Recommended edit</p>
                <h3 className="type-subsection-title mt-3">{activeMood.label} Essentials</h3>
                <p className="type-body-sm mt-3 max-w-md text-muted-foreground">{activeMood.copy}</p>
                <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
                  {["Starts with best sellers", "Prioritizes in-stock colors", "Keeps the palette cohesive"].map((item) => (
                    <li key={item} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-luxury-olive dark:text-luxury-gold" /> {item}</li>
                  ))}
                </ul>
              </div>
              <Link href={activeMood.route}>
                <Button variant="dark" className="w-full md:w-auto">Shop this edit <ArrowRight className="size-4" /></Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
