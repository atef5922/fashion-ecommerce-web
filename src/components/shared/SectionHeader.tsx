export function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
      {eyebrow && <p className="type-eyebrow mb-3 text-luxury-burgundy">{eyebrow}</p>}
      <h2 className="type-section-title">{title}</h2>
      {description && <p className="type-body-sm mx-auto mt-4 max-w-xl text-muted-foreground">{description}</p>}
    </div>
  );
}
