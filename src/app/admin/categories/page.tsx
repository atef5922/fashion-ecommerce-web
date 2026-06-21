"use client";

import { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminService } from "@/services/admin/admin.service";
import type { AdminCategory } from "@/types/admin/admin.types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<AdminCategory["status"]>("Visible");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    void adminService.getCategories()
      .then((data) => {
        if (active) setCategories(data);
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
    setName("");
    setStatus("Visible");
    setError("");
  }

  async function saveCategory() {
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      if (editing) {
        const updated = await adminService.updateCategory({
          ...editing,
          name: name.trim(),
          status
        });
        setCategories(updated);
      } else {
        const created = await adminService.createCategory({
          name: name.trim(),
          status
        });
        setCategories(created);
      }

      resetForm();
    } catch (categoryError) {
      setError(categoryError instanceof Error ? categoryError.message : "Category could not be saved.");
    }
  }

  return (
    <div>
      <AdminPageHeader title="Categories" description="Manage storefront taxonomy and category visibility." action={<Button variant="dark" onClick={resetForm}><Plus className="size-4" /> Add Category</Button>} />
      <section className="grid gap-4 border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" aria-label="Category name" />
          <select value={status} onChange={(event) => setStatus(event.target.value as AdminCategory["status"])} className="h-11 border border-border bg-card px-3 text-sm" aria-label="Category visibility">
            <option>Visible</option>
            <option>Hidden</option>
          </select>
          <Button variant="outline" onClick={() => void saveCategory()}>{editing ? "Save" : "Create"}</Button>
        </div>
        {error ? <p className="text-sm text-luxury-burgundy">{error}</p> : null}
        {loading ? <p className="text-sm text-muted-foreground">Loading categories...</p> : categories.map((category) => (
          <div key={category.id} className="grid gap-3 border border-border p-4 dark:border-luxury-dark-border md:grid-cols-[1fr_auto_auto] md:items-center">
            <div>
              <h2 className="type-card-title">{category.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{category.products} products / {category.slug}</p>
            </div>
            <AdminStatusBadge status={category.status} />
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" aria-label={`Edit ${category.name}`} onClick={() => {
                setEditing(category);
                setName(category.name);
                setStatus(category.status);
              }}><Edit3 className="size-4" /></Button>
              <Button variant="ghost" size="icon" aria-label={`Delete ${category.name}`} onClick={async () => {
                try {
                  const updated = await adminService.deleteCategory(category.id);
                  setCategories(updated);
                } catch (categoryError) {
                  setError(categoryError instanceof Error ? categoryError.message : "Category could not be deleted.");
                }
              }}><Trash2 className="size-4" /></Button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
