import type { AppliedCoupon, CreateOrderRequest, OrderResponse } from "@/types/checkout.types";
import type { OrderHistoryItem } from "@/types/profile.types";

async function requestOrders<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Order request failed." }));
    throw new Error(error.message ?? "Order request failed.");
  }

  return response.json() as Promise<T>;
}

export const checkoutService = {
  createOrder(data: CreateOrderRequest) {
    return requestOrders<OrderResponse>("/api/orders", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  validateCoupon(code: string, subtotal: number) {
    return requestOrders<AppliedCoupon>("/api/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, subtotal })
    });
  },

  getOrders() {
    return requestOrders<OrderHistoryItem[]>("/api/profile/orders", {
      method: "GET"
    });
  }
};
