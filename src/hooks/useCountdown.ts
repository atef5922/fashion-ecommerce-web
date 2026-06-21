"use client";

import { useEffect, useMemo, useState } from "react";

export function useCountdown(targetDate: Date) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return useMemo(() => {
    if (now === null) {
      return { days: null, hours: null, minutes: null, seconds: null, diff: null };
    }

    const diff = Math.max(0, targetDate.getTime() - now);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const minutes = Math.floor((diff / 60000) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, diff };
  }, [now, targetDate]);
}
