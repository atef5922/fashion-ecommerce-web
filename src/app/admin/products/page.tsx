"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminService } from "@/services/admin/admin.service";
import type { AdminProduct } from "@/types/admin/admin.types";
import { formatPrice } from "@/lib/utils";

const pageSize = 4;
const categories = ["Women", "Men", "Kids", "Accessories"] as const;
const statuses = ["Active", "Draft", "Archived"] as const;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "Women",
    price: "2990",
    stock: "10",
    status: "Active"
  });

  useEffect(() => {
    let active = true;

    void adminService.getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = product.title.toLowerCase().includes(query.toLowerCase()) || product.vendor.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, products, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  function resetForm() {
    setEditing(null);
    setForm({ title: "", category: "Women", price: "2990", stock: "10", status: "Active" });
  }

  async function saveProduct() {
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.title.trim() || Number.isNaN(price) || Number.isNaN(stock)) return;

    const payload = {
      title: form.title.trim(),
      category: form.category,
      price: Math.max(0, price),
      stock: Math.max(0, Math.floor(stock)),
      status: form.status,
      vendor: editing?.vendor ?? "BORNO"
    } as Omit<AdminProduct, "id">;

    if (editing) {
      const updated = await adminService.updateProduct({ ...payload, id: editing.id });
      setProducts((current) => current.map((product) => (product.id === updated.id ? updated : product)));
    } else {
      const created = await adminService.createProduct(payload);
      setProducts((current) => [created, ...current]);
      setPage(1);
    }

    resetForm();
  }

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Search, filter, paginate, add, edit, and delete product records."
        action={<Button variant="dark" onClick={resetForm}><Plus className="size-4" /> Add Product</Button>}
      />
      <section className="grid gap-4 border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search products" aria-label="Search products" />
          <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} aria-label="Filter products by category" className="h-11 border border-border bg-card px-3 text-sm">
            {["All", "Women", "Men", "Kids", "Accessories"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="grid gap-3 border border-border p-4 dark:border-luxury-dark-border xl:grid-cols-[1.2fr_180px_140px_140px_170px_auto]">
          <Input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder={editing ? "Edit product title" : "Product title"}
            aria-label="Product title"
          />
          <select
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            aria-label="Product category"
            className="h-11 border border-border bg-card px-3 text-sm"
          >
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <Input
            value={form.price}
            onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
            type="number"
            min="0"
            placeholder="Price"
            aria-label="Product price"
          />
          <Input
            value={form.stock}
            onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
            type="number"
            min="0"
            placeholder="Stock"
            aria-label="Product stock"
          />
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            aria-label="Product status"
            className="h-11 border border-border bg-card px-3 text-sm"
          >
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <Button variant="outline" onClick={saveProduct}>{editing ? "Save Product" : "Add Product"}</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr><th className="py-3">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th className="text-right">Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-6 text-muted-foreground" colSpan={6}>Loading products...</td></tr>
              ) : visible.length === 0 ? (
                <tr><td className="py-6 text-muted-foreground" colSpan={6}>No products found.</td></tr>
              ) : visible.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="py-4 font-medium">{product.title}<p className="text-xs text-muted-foreground">{product.vendor}</p></td>
                  <td>{product.category}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span className={product.stock === 0 ? "text-luxury-burgundy" : product.stock <= 5 ? "text-luxury-clay dark:text-luxury-gold" : ""}>
                      {product.stock}
                    </span>
                    {product.stock === 0 ? <p className="text-xs text-luxury-burgundy">Out of stock</p> : null}
                    {product.stock > 0 && product.stock <= 5 ? <p className="text-xs text-luxury-clay dark:text-luxury-gold">Low stock</p> : null}
                  </td>
                  <td><AdminStatusBadge status={product.status} /></td>
                  <td className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Edit ${product.title}`}
                      onClick={() => {
                        setEditing(product);
                        setForm({
                          title: product.title,
                          category: product.category,
                          price: String(product.price),
                          stock: String(product.stock),
                          status: product.status
                        });
                      }}
                    >
                      <Edit3 className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${product.title}`}
                      onClick={async () => {
                        await adminService.deleteProduct(product.id);
                        setProducts((current) => current.filter((item) => item.id !== product.id));
                      }}
                    ><Trash2 className="size-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Page {page} of {pageCount}</span>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button>
            <Button variant="outline" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>Next</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
