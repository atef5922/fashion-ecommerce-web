"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let context: { revert: () => void } | undefined;

    import("gsap").then(({ default: gsap }) => {
      context = gsap.context(() => {
        gsap.fromTo(logoRef.current, { opacity: 0, scale: 0.92, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power3.out" });
        gsap.fromTo(textRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.25, ease: "power3.out" });
        gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.45, delay: 0.35, ease: "power2.inOut" });
      });
    });

    const timeout = window.setTimeout(() => setIsLoading(false), 1850);

    return () => {
      window.clearTimeout(timeout);
      context?.revert();
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-luxury-ivory text-luxury-ink dark:bg-luxury-dark dark:text-luxury-dark-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015, filter: "blur(10px)" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(200,169,126,0.22),transparent_34rem)]" />
          <motion.div
            className="absolute left-1/2 top-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-luxury-gold/20 blur-3xl"
            animate={{ scale: [0.95, 1.08, 1], opacity: [0.2, 0.34, 0.22] }}
            transition={{ duration: 1.7, repeat: Infinity, repeatType: "mirror" }}
          />
          <div className="relative w-[min(86vw,520px)] text-center">
            <div ref={logoRef}>
              <p className="fine-label mb-3 text-luxury-burgundy dark:text-luxury-gold">Mugnee Atelier</p>
              <h1 className="font-display text-6xl font-semibold leading-none sm:text-7xl">Mugnee</h1>
            </div>
            <p ref={textRef} className="mt-6 text-sm font-medium tracking-[0.22em] text-muted-foreground dark:text-luxury-dark-secondary">
              Crafting Your Style Experience
            </p>
            <div className="mx-auto mt-9 h-px w-64 overflow-hidden bg-luxury-ink/15 dark:bg-white/15">
              <div ref={progressRef} className="h-full origin-left bg-luxury-burgundy dark:bg-luxury-gold" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
