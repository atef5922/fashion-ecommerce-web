import type { CartItem } from "./cart";

export type CheckoutAddress = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CheckoutBilling = CheckoutAddress & {
  sameAsShipping: boolean;
};

export type CheckoutDraft = {
  shipping: CheckoutAddress | null;
  billing: CheckoutBilling | null;
  notes?: string;
};

export type CheckoutTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
};

export type AppliedCoupon = {
  code: string;
  type: "Percentage" | "Fixed";
  value: number;
  discountAmount: number;
};

export type CreateOrderRequest = {
  userId: string;
  items: CartItem[];
  shipping: CheckoutAddress;
  billing: CheckoutBilling;
  totals: CheckoutTotals;
  couponCode?: string;
};

export type OrderResponse = {
  orderId: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  estimatedDelivery: string;
  totals: CheckoutTotals;
};
