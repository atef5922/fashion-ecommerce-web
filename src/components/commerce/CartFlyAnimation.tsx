"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useUiStore } from "@/store/uiStore";

const FALLBACK_TARGET = { x: 32, y: 32, width: 40, height: 40 };

export function CartFlyAnimation() {
  const animation = useUiStore((state) => state.cartFlyAnimation);
  const clearCartFlyAnimation = useUiStore((state) => state.clearCartFlyAnimation);
  const triggerCartPulse = useUiStore((state) => state.triggerCartPulse);

  const target = (() => {
    if (typeof document === "undefined") return FALLBACK_TARGET;

    const targetElement = document.querySelector("[data-cart-target]");
    const rect = targetElement?.getBoundingClientRect();
    if (!rect) return FALLBACK_TARGET;

    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    };
  })();

  useEffect(() => {
    if (!animation) return;

    const pulseTimeout = window.setTimeout(triggerCartPulse, 620);
    const clearTimeout = window.setTimeout(clearCartFlyAnimation, 900);

    return () => {
      window.clearTimeout(pulseTimeout);
      window.clearTimeout(clearTimeout);
    };
  }, [animation, clearCartFlyAnimation, triggerCartPulse]);

  return (
    <AnimatePresence>
      {animation && (
        <>
          <motion.div
            key={`fly-${animation.id}`}
            className="pointer-events-none fixed z-[120] overflow-hidden border border-white/70 bg-muted shadow-[0_24px_70px_rgba(23,23,23,0.24)]"
            initial={{
              left: animation.from.x,
              top: animation.from.y,
              width: Math.min(animation.from.width, 160),
              height: Math.min(animation.from.height, 210),
              opacity: 1,
              scale: 1,
              rotate: 0
            }}
            animate={{
              left: target.x + target.width / 2 - 18,
              top: target.y + target.height / 2 - 18,
              width: 36,
              height: 36,
              opacity: 0.15,
              scale: 0.78,
              rotate: 8
            }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={animation.image} alt="" fill sizes="160px" className="object-cover" />
          </motion.div>
          <motion.div
            key={`success-${animation.id}`}
            className="pointer-events-none fixed z-[121] grid size-9 place-items-center rounded-full bg-luxury-ink text-white shadow-[0_18px_44px_rgba(23,23,23,0.22)] dark:bg-luxury-gold dark:text-luxury-dark"
            initial={{
              left: target.x + target.width / 2 - 18,
              top: target.y + target.height / 2 - 18,
              opacity: 0,
              scale: 0.5
            }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.08, 1, 0.7] }}
            transition={{ duration: 0.9, times: [0, 0.35, 0.7, 1], ease: [0.22, 1, 0.36, 1] }}
          >
            <Check className="size-4" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
