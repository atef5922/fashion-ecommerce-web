import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, formatCurrency } from "@/lib/currency";

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminPageHeader title="Settings" description="Store, shipping, and theme settings prepared for future backend persistence." action={<Button variant="dark">Save Settings</Button>} />
      <div className="grid gap-6 xl:grid-cols-3">
        <SettingsPanel title="Store Settings">
          <Input defaultValue="Mugnee Atelier" aria-label="Store name" />
          <Input defaultValue="studio@mugnee.com" type="email" aria-label="Store email" />
          <Input defaultValue="BDT" aria-label="Store currency" />
        </SettingsPanel>
        <SettingsPanel title="Shipping Settings">
          <Input defaultValue={`Free shipping over ${formatCurrency(FREE_SHIPPING_THRESHOLD)}`} aria-label="Shipping offer" />
          <Input defaultValue="3-5 business days" aria-label="Standard delivery time" />
          <Input defaultValue={formatCurrency(STANDARD_SHIPPING_FEE)} aria-label="Standard shipping price" />
        </SettingsPanel>
        <SettingsPanel title="Theme Settings">
          <Input defaultValue="Luxury Ivory" aria-label="Theme preset" />
          <Input defaultValue="Playfair Display" aria-label="Display font" />
          <Input defaultValue="Inter" aria-label="Body font" />
        </SettingsPanel>
      </div>
    </div>
  );
}

function SettingsPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
      <h2 className="type-card-title">{title}</h2>
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}
