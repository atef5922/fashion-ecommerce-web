import type { ProductReview } from "@/types/profile.types";

async function reviewRequest<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Review request failed." }));
    throw new Error(error.message ?? "Review request failed.");
  }

  return response.json() as Promise<T>;
}

export const reviewsService = {
  getProductReviews(productId: string) {
    return reviewRequest<{
      averageRating: number;
      reviewCount: number;
      reviews: ProductReview[];
    }>(`/api/products/${encodeURIComponent(productId)}/reviews`);
  },

  submitReview(productId: string, payload: { rating: number; body: string }) {
    return reviewRequest<{ id: string; status: string; message: string }>(`/api/products/${encodeURIComponent(productId)}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
};
