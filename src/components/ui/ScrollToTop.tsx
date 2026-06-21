"use client";

import { MouseEvent, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMove = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: (event.clientX - rect.left - rect.width / 2) * 0.18,
      y: (event.clientY - rect.top - rect.height / 2) * 0.18
    });
  };

  const handleClick = () => {
    setRipple(true);
    window.setTimeout(() => setRipple(false), 520);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          className="fixed bottom-5 right-5 z-50 grid size-12 place-items-center overflow-hidden rounded-full border border-luxury-gold/70 bg-white/55 text-luxury-ink shadow-[0_18px_50px_rgba(23,23,23,0.18)] backdrop-blur-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-luxury-dark-card/72 dark:text-luxury-gold dark:shadow-[0_18px_60px_rgba(0,0,0,0.52)] md:bottom-8 md:right-8 md:size-14"
          initial={{ opacity: 0, x: 0, y: 18, scale: 0.9 }}
          animate={{ opacity: 1, x: offset.x, y: offset.y, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.9 }}
          whileHover={{ scale: 1.08, rotate: -6, boxShadow: "0 0 34px rgba(200,169,126,0.38)" }}
          whileTap={{ scale: 0.94, rotate: 8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={handleMove}
          onMouseLeave={() => setOffset({ x: 0, y: 0 })}
          onClick={handleClick}
        >
          <span className="absolute inset-0 rounded-full bg-luxury-gold/0 transition group-hover:bg-luxury-gold/10" />
          {ripple && <motion.span className="absolute size-4 rounded-full bg-luxury-gold/35" initial={{ scale: 0, opacity: 0.8 }} animate={{ scale: 9, opacity: 0 }} transition={{ duration: 0.52, ease: "easeOut" }} />}
          <motion.span animate={ripple ? { y: [-1, -7, 0] } : { y: 0 }} transition={{ duration: 0.46 }}>
            <ArrowUp className="size-5" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
