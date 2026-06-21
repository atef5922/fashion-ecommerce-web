"use client";

import { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminService } from "@/services/admin/admin.service";
import type { AdminCoupon, AdminCouponStatus, AdminCouponType } from "@/types/admin/admin.types";

const emptyForm = {
  code: "",
  type: "Percentage" as AdminCouponType,
  value: "10",
  usageLimit: "",
  expiresAt: "",
  status: "Active" as AdminCouponStatus
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    void adminService.getCoupons()
      .then((data) => {
        if (active) setCoupons(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
  }

  async function saveCoupon() {
    const value = Number(form.value);
    const usageLimit = form.usageLimit ? Number(form.usageLimit) : null;

    if (!form.code.trim() || Number.isNaN(value) || value <= 0) {
      setError("Enter a valid coupon code and value.");
      return;
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value,
      usageLimit: usageLimit && !Number.isNaN(usageLimit) ? usageLimit : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      status: form.status
    } as Omit<AdminCoupon, "id" | "usage">;

    try {
      if (editing) {
        const updated = await adminService.updateCoupon({ ...payload, id: editing.id, usage: editing.usage });
        setCoupons((items) => items.map((item) => item.id === updated.id ? updated : item));
      } else {
        const created = await adminService.createCoupon(payload);
        setCoupons((items) => [created, ...items]);
      }

      resetForm();
    } catch (couponError) {
      setError(couponError instanceof Error ? couponError.message : "Coupon could not be saved.");
    }
  }

  return (
    <div>
      <AdminPageHeader title="Coupons" description="Create, update, and delete promotional coupon rules." action={<Button variant="dark" onClick={resetForm}><Plus className="size-4" /> New Coupon</Button>} />
      <div className="grid gap-6">
        <section className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="type-eyebrow text-luxury-burgundy dark:text-luxury-gold">{editing ? "Editing coupon" : "Create coupon"}</p>
              <h2 className="type-card-title mt-2">{editing ? form.code || "Update promotion" : "Build a promotion rule"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Configure the code, value, usage limit, expiry date, and activation state from one clean control panel.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="border border-border px-3 py-2 dark:border-luxury-dark-border">{coupons.length} coupons</span>
              <span className="border border-border px-3 py-2 dark:border-luxury-dark-border">{coupons.filter((coupon) => coupon.status === "Active").length} active</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[minmax(220px,1.2fr)_170px_150px_170px_190px_170px_auto]">
            <FieldShell label="Coupon code">
              <Input value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))} placeholder="BORNO10" aria-label="Coupon code" className="min-w-0" />
            </FieldShell>
            <FieldShell label="Discount type">
              <select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as AdminCouponType }))} className="h-11 w-full min-w-0 border border-border bg-card px-3 text-sm" aria-label="Coupon type">
                <option>Percentage</option>
                <option>Fixed</option>
              </select>
            </FieldShell>
            <FieldShell label="Value">
              <Input value={form.value} onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))} placeholder="10" aria-label="Coupon value" type="number" min="0" className="min-w-0" />
            </FieldShell>
            <FieldShell label="Usage limit">
              <Input value={form.usageLimit} onChange={(event) => setForm((current) => ({ ...current, usageLimit: event.target.value }))} placeholder="100" aria-label="Coupon usage limit" type="number" min="0" className="min-w-0" />
            </FieldShell>
            <FieldShell label="Expiry date">
              <Input value={form.expiresAt} onChange={(event) => setForm((current) => ({ ...current, expiresAt: event.target.value }))} aria-label="Coupon expiry date" type="date" className="min-w-0" />
            </FieldShell>
            <FieldShell label="Status">
              <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as AdminCouponStatus }))} className="h-11 w-full min-w-0 border border-border bg-card px-3 text-sm" aria-label="Coupon status">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </FieldShell>
            <div className="flex items-end md:col-span-2 xl:col-span-3 2xl:col-span-1">
              <Button variant="dark" className="w-full 2xl:w-auto" onClick={() => void saveCoupon()}>{editing ? "Save coupon" : "Create coupon"}</Button>
            </div>
          </div>

          {error ? <p className="mt-4 border border-luxury-burgundy/30 bg-luxury-burgundy/5 p-3 text-sm text-luxury-burgundy">{error}</p> : null}
        </section>

        <section className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="type-card-title">Coupon library</h2>
            <span className="fine-label text-luxury-burgundy dark:text-luxury-gold">Live database records</span>
          </div>

          <div className="mt-5 grid gap-4">
            {loading ? <p className="text-sm text-muted-foreground">Loading coupons...</p> : coupons.map((coupon) => (
              <div key={coupon.id} className="grid gap-4 border border-border p-4 transition hover:bg-muted/30 dark:border-luxury-dark-border dark:hover:bg-white/5 md:grid-cols-[1fr_auto] md:items-center">
                <div className="grid gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-3xl leading-none">{coupon.code}</h3>
                    <AdminStatusBadge status={coupon.status} />
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                    <p>{coupon.type === "Percentage" ? `${coupon.value}% off` : `BDT ${coupon.value} off`}</p>
                    <p>{coupon.usage} uses{coupon.usageLimit ? ` of ${coupon.usageLimit}` : ""}</p>
                    <p>{coupon.expiresAt ? `Expires ${new Date(coupon.expiresAt).toLocaleDateString()}` : "No expiry date"}</p>
                  </div>
                </div>
                <div className="flex justify-start gap-1 md:justify-end">
                  <Button size="icon" variant="ghost" aria-label={`Edit ${coupon.code}`} onClick={() => {
                    setEditing(coupon);
                    setForm({
                      code: coupon.code,
                      type: coupon.type,
                      value: String(coupon.value),
                      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
                      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
                      status: coupon.status === "Expired" ? "Inactive" : coupon.status
                    });
                  }}><Edit3 className="size-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label={`Delete ${coupon.code}`} onClick={async () => {
                    await adminService.deleteCoupon(coupon.id);
                    setCoupons((items) => items.filter((item) => item.id !== coupon.id));
                  }}><Trash2 className="size-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function FieldShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="fine-label text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
