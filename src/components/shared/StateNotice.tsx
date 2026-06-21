import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type StateNoticeProps = {
  title: string;
  description: string;
  tone?: "empty" | "success" | "error" | "loading";
  className?: string;
};

const icons = {
  empty: Info,
  success: CheckCircle2,
  error: AlertCircle,
  loading: Info
};

export function StateNotice({ title, description, tone = "empty", className }: StateNoticeProps) {
  const Icon = icons[tone];

  return (
    <div
      className={cn(
        "border border-dashed border-border bg-card/70 p-6 text-center dark:border-luxury-dark-border dark:bg-luxury-dark-card/70",
        tone === "success" && "border-luxury-olive/35 bg-luxury-olive/5 dark:border-luxury-gold/35 dark:bg-luxury-gold/10",
        tone === "error" && "border-luxury-burgundy/45 bg-luxury-burgundy/5",
        className
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      <div className="mx-auto grid size-10 place-items-center rounded-full border border-current/20 text-luxury-burgundy dark:text-luxury-gold">
        <Icon className="size-4" />
      </div>
      <h2 className="type-card-title mt-4">{title}</h2>
      <p className="type-body-sm mx-auto mt-3 max-w-md text-muted-foreground">{description}</p>
    </div>
  );
}
