"use client";

import { useCountdown } from "@/hooks/useCountdown";

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const time = useCountdown(targetDate);
  const entries = [
    ["Days", time.days],
    ["Hours", time.hours],
    ["Minutes", time.minutes],
    ["Seconds", time.seconds]
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {entries.map(([label, value]) => (
        <div key={label} className="border border-white/25 bg-white/10 p-4 text-center backdrop-blur">
          <div className="font-display text-4xl font-semibold">{value === null ? "--" : String(value).padStart(2, "0")}</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/70">{label}</div>
        </div>
      ))}
    </div>
  );
}
