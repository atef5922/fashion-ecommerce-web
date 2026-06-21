import type { AuthResponse, User } from "@/types/auth.types";
import type { LucideIcon } from "lucide-react";

export type AdminRole = "admin";

export type AdminUser = User & {
  role: AdminRole;
};

export type AdminSession = AuthResponse & {
  user: AdminUser;
};

export type AdminPermission =
  | "dashboard:read"
  | "products:manage"
  | "orders:manage"
  | "customers:read"
  | "content:manage"
  | "marketing:manage"
  | "settings:manage";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: AdminPermission;
};

export type AdminAccessState = {
  loading: boolean;
  authorized: boolean;
  user: AdminUser | null;
};

export type AdminProductStatus = "Active" | "Draft" | "Archived";
export type AdminOrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type AdminCustomerStatus = "Active" | "VIP" | "Blocked";
export type AdminReviewStatus = "Pending" | "Approved" | "Hidden";
export type AdminCouponStatus = "Active" | "Inactive" | "Expired";
export type AdminBlogStatus = "Published" | "Draft" | "Scheduled";
export type AdminCouponType = "Percentage" | "Fixed";

export type AdminProduct = {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  status: AdminProductStatus;
  vendor: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  products: number;
  status: "Visible" | "Hidden";
};

export type AdminOrder = {
  id: string;
  customer: string;
  total: number;
  status: AdminOrderStatus;
  date: string;
  items: number;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  status: AdminCustomerStatus;
};

export type AdminReview = {
  id: string;
  product: string;
  customer: string;
  rating: number;
  body: string;
  status: AdminReviewStatus;
};

export type AdminCoupon = {
  id: string;
  code: string;
  type: AdminCouponType;
  value: number;
  expiresAt: string | null;
  usageLimit: number | null;
  usage: number;
  status: AdminCouponStatus;
};

export type AdminBlog = {
  id: string;
  title: string;
  author: string;
  status: AdminBlogStatus;
  date: string;
};
