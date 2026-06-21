"use client";

export function QuantityStepper({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="mt-3 inline-flex h-9 items-center border border-border" aria-label="Item quantity">
      <button
        type="button"
        className="size-9 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        -
      </button>
      <span className="w-8 text-center text-sm" aria-live="polite">{value}</span>
      <button
        type="button"
        className="size-9 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
