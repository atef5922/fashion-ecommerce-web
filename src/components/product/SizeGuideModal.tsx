"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function SizeGuideModal() {
  return (
    <Dialog>
      <DialogTrigger className="text-xs underline underline-offset-4">Size guide</DialogTrigger>
      <DialogContent>
        <DialogTitle className="type-subsection-title">Size guide</DialogTitle>
        <DialogDescription className="mt-3 text-sm leading-6 text-muted-foreground">
          Compare standard garment measurements before selecting your size.
        </DialogDescription>
        <div className="mt-6 overflow-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {["XS", "S", "M", "L", "XL"].map((size, index) => (
                <tr key={size} className="border-b border-border">
                  <td className="py-3 font-medium">{size}</td>
                  <td className="py-3 text-muted-foreground">Chest {32 + index * 2}-{34 + index * 2} in</td>
                  <td className="py-3 text-muted-foreground">Waist {24 + index * 2}-{26 + index * 2} in</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
