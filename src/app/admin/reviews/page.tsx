"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin/admin.service";
import type { AdminReview } from "@/types/admin/admin.types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void adminService
      .getReviews()
      .then((data) => {
        if (!active) return;
        setReviews(data);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Reviews could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function updateStatus(reviewId: string, status: AdminReview["status"]) {
    const updated = await adminService.updateReviewStatus(reviewId, status);
    setReviews((items) => items.map((item) => (item.id === reviewId ? updated : item)));
  }

  async function deleteReview(reviewId: string) {
    await adminService.deleteReview(reviewId);
    setReviews((items) => items.filter((item) => item.id !== reviewId));
  }

  return (
    <div>
      <AdminPageHeader title="Reviews" description="Moderate verified purchase reviews before they appear on product pages." />
      {error ? <p className="mb-4 text-sm text-luxury-burgundy">{error}</p> : null}
      <section className="grid gap-4">
        {loading ? (
          <article className="border border-dashed border-border bg-card p-6 text-sm text-muted-foreground shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
            Loading reviews...
          </article>
        ) : reviews.length ? (
          reviews.map((review) => (
            <article key={review.id} className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="type-card-title">{review.product}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{review.customer} / {review.rating} stars</p>
                </div>
                <AdminStatusBadge status={review.status} />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{review.body}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm" variant="dark" onClick={() => void updateStatus(review.id, "Approved")}>Approve</Button>
                <Button size="sm" variant="outline" onClick={() => void updateStatus(review.id, "Hidden")}>Hide</Button>
                <Button size="sm" variant="outline" onClick={() => void updateStatus(review.id, "Pending")}>Mark pending</Button>
                <Button size="sm" variant="outline" onClick={() => void deleteReview(review.id)}>Delete</Button>
              </div>
            </article>
          ))
        ) : (
          <article className="border border-dashed border-border bg-card p-6 text-sm text-muted-foreground shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
            No customer reviews yet.
          </article>
        )}
      </section>
    </div>
  );
}
