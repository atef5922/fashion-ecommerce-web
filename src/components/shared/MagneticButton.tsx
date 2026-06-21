"use client";

import { Button } from "@/components/ui/button";

export function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <div className="transition duration-300 hover:scale-[1.04] active:scale-[0.98]">
      <Button variant="dark" onClick={onClick}>{children}</Button>
    </div>
  );
}
