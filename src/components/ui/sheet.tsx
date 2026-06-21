"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetTitle = DialogPrimitive.Title;
export const SheetDescription = DialogPrimitive.Description;

export function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { side?: "left" | "right" }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm dark:bg-black/72" />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-0 z-50 h-full w-[min(92vw,420px)] overflow-auto border-border bg-card p-6 text-card-foreground shadow-soft outline-none dark:border-luxury-dark-border dark:bg-luxury-dark-card dark:text-luxury-dark-text",
          side === "right" ? "right-0" : "left-0",
          className
        )}
        {...props}
      >
        <DialogPrimitive.Close
          aria-label="Close panel"
          className="absolute right-4 top-4 rounded-full p-2 outline-none transition hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card dark:hover:bg-white/10 dark:focus-visible:ring-luxury-gold dark:focus-visible:ring-offset-luxury-dark-card"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
