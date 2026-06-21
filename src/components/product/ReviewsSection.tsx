"use client";

import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { reviewsService } from "@/services/reviews.service";
import type { Product } from "@/types/product";
import type { ProductReview } from "@/types/profile.types";

type ReviewResponse = {
  averageRating: number;
  reviewCount: number;
  reviews: ProductReview[];
};

export function ReviewsSection({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth();
  const [reviewData, setReviewData] = useState<ReviewResponse>({
    averageRating: 0,
    reviewCount: 0,
    reviews: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    void reviewsService
      .getProductReviews(product.id)
      .then((data) => {
        if (!active) return;
        setReviewData(data);
      })
      .catch(() => {
        if (!active) return;
        setError("Reviews could not be loaded right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [product.id]);

  const customerReview = useMemo(
    () => reviewData.reviews.find((review) => review.status !== "Approved"),
    [reviewData.reviews]
  );
  const approvedReviews = useMemo(
    () => reviewData.reviews.filter((review) => review.status === "Approved"),
    [reviewData.reviews]
  );

  return (
    <section className="section-padding">
      <div className="container grid gap-8 xl:grid-cols-[0.38fr_1fr]">
        <div className="border border-border bg-card p-6 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
          <p className="type-eyebrow text-luxury-burgundy dark:text-luxury-gold">Verified reviews</p>
          <h2 className="type-section-title mt-4">Notes from BORNO clients</h2>
          <div className="mt-6 flex items-end gap-4">
            <span className="font-display text-6xl leading-none">{reviewData.averageRating ? reviewData.averageRating.toFixed(1) : product.rating.toFixed(1)}</span>
            <div className="pb-1">
              <div className="flex gap-1 text-luxury-gold">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className={`size-4 ${index < Math.round(reviewData.averageRating || product.rating) ? "fill-current" : ""}`} />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {reviewData.reviewCount} approved review{reviewData.reviewCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <h3 className="type-card-title">Share your review</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Verified purchase reviews help other BORNO clients buy with confidence.
            </p>
            <div className="mt-4 flex gap-2">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`rounded-full border p-2 transition ${value <= rating ? "border-luxury-gold bg-luxury-gold/10 text-luxury-gold" : "border-border text-muted-foreground hover:border-luxury-ink hover:text-luxury-ink"}`}
                    aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
                  >
                    <Star className={`size-4 ${value <= rating ? "fill-current" : ""}`} />
                  </button>
                );
              })}
            </div>
            <Textarea
              className="mt-4 min-h-32"
              placeholder="Tell other clients about the fit, finish, and feel."
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
            {!isAuthenticated ? <p className="mt-3 text-sm text-muted-foreground">Sign in with the account used to purchase this product to leave a review.</p> : null}
            {customerReview ? <p className="mt-3 text-sm text-muted-foreground">Your latest review is currently {customerReview.status.toLowerCase()}.</p> : null}
            {message ? <p className="mt-3 text-sm text-luxury-olive dark:text-luxury-gold">{message}</p> : null}
            {error ? <p className="mt-3 text-sm text-luxury-burgundy">{error}</p> : null}
            <Button
              variant="dark"
              className="mt-4 w-full sm:w-auto"
              isLoading={submitting}
              loadingText="Submitting"
              onClick={async () => {
                setSubmitting(true);
                setMessage("");
                setError("");
                try {
                  const response = await reviewsService.submitReview(product.id, { rating, body });
                  setMessage(response.message);
                  setBody("");
                  const refreshed = await reviewsService.getProductReviews(product.id);
                  setReviewData(refreshed);
                } catch (submitError) {
                  setError(submitError instanceof Error ? submitError.message : "Review could not be submitted.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              Submit review
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="border border-dashed border-border p-6 text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
              Loading reviews...
            </div>
          ) : approvedReviews.length ? (
            approvedReviews.map((review) => (
              <blockquote key={review.id} className="border border-border bg-card p-6 dark:border-luxury-dark-border dark:bg-luxury-dark-card">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{review.customer}</p>
                  <div className="flex gap-1 text-luxury-gold">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} className={`size-3.5 ${index < review.rating ? "fill-current" : ""}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{review.body}</p>
                <footer className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()} / verified buyer
                </footer>
              </blockquote>
            ))
          ) : (
            <div className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
              No approved reviews yet. The first verified client note will appear here soon.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
