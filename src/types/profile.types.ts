import type { CheckoutAddress } from "@/types/checkout.types";

export type SavedAddress = CheckoutAddress & {
  id: string;
  label: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
};

export type ProfileDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
};

export type OrderHistoryItem = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  couponCode: string | null;
  paymentMethod: string;
  createdAt: string;
  estimatedDelivery: string | null;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    color?: string | null;
    size?: string | null;
  }>;
};

export type ProductReview = {
  id: string;
  customer: string;
  rating: number;
  body: string;
  createdAt: string;
  status: "Pending" | "Approved" | "Hidden";
};

export type ReviewEligibility = {
  canReview: boolean;
  reason?: string;
  hasReviewed?: boolean;
};
