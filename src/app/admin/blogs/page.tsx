"use client";

import { useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminBlogs } from "@/services/admin/admin.mock";
import type { AdminBlog } from "@/types/admin/admin.types";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState(adminBlogs);
  const [editing, setEditing] = useState<AdminBlog | null>(null);
  const [title, setTitle] = useState("");

  function saveBlog() {
    if (!title.trim()) return;

    if (editing) {
      setBlogs((items) => items.map((item) => item.id === editing.id ? { ...item, title } : item));
    } else {
      setBlogs((items) => [{ id: `blog_${Date.now()}`, title, author: "Editorial", status: "Draft", date: "2026-06-20" }, ...items]);
    }

    setTitle("");
    setEditing(null);
  }

  return (
    <div>
      <AdminPageHeader title="Blogs" description="Create, update, delete, and schedule editorial content." action={<Button variant="dark" onClick={() => { setEditing(null); setTitle(""); }}><Plus className="size-4" /> New Blog</Button>} />
      <section className="grid gap-4 border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Blog title" aria-label="Blog title" />
          <Button variant="outline" onClick={saveBlog}>{editing ? "Save Blog" : "Create Blog"}</Button>
        </div>
        {blogs.map((blog) => (
          <div key={blog.id} className="grid gap-3 border border-border p-4 dark:border-luxury-dark-border md:grid-cols-[1fr_auto_auto] md:items-center">
            <div><h2 className="type-card-title">{blog.title}</h2><p className="mt-1 text-sm text-muted-foreground">{blog.author} / {blog.date}</p></div>
            <AdminStatusBadge status={blog.status} />
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" aria-label={`Edit ${blog.title}`} onClick={() => { setEditing(blog); setTitle(blog.title); }}><Edit3 className="size-4" /></Button>
              <Button size="icon" variant="ghost" aria-label={`Delete ${blog.title}`} onClick={() => setBlogs((items) => items.filter((item) => item.id !== blog.id))}><Trash2 className="size-4" /></Button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
