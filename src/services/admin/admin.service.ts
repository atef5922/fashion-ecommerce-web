import { isAdminEmail } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import type { LoginRequest } from "@/types/auth.types";
import type { AdminCategory, AdminCoupon, AdminCustomer, AdminOrder, AdminPermission, AdminProduct, AdminReview, AdminReviewStatus } from "@/types/admin/admin.types";

async function adminRequest<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Admin request failed." }));
    throw new Error(error.message ?? "Admin request failed.");
  }

  return response.json() as Promise<T>;
}

export const adminService = {
  async login(data: LoginRequest) {
    const response = await authService.login(data);

    if (!isAdminEmail(response.user.email)) {
      await authService.logout().catch(() => undefined);
      throw new Error("This account does not have admin access.");
    }

    return response;
  },

  logout() {
    return authService.logout();
  },

  getPermissions(userId: string) {
    void userId;
    return Promise.resolve<AdminPermission[]>([
      "dashboard:read",
      "products:manage",
      "orders:manage",
      "customers:read",
      "settings:manage"
    ]);
  },

  getProducts() {
    return adminRequest<AdminProduct[]>("/api/admin/products");
  },

  createProduct(product: Omit<AdminProduct, "id">) {
    return adminRequest<AdminProduct>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(product)
    });
  },

  updateProduct(product: AdminProduct) {
    return adminRequest<AdminProduct>("/api/admin/products", {
      method: "PATCH",
      body: JSON.stringify(product)
    });
  },

  deleteProduct(productId: string) {
    return adminRequest<{ success: boolean }>(`/api/admin/products?id=${encodeURIComponent(productId)}`, {
      method: "DELETE"
    });
  },

  getOrders() {
    return adminRequest<AdminOrder[]>("/api/admin/orders");
  },

  updateOrderStatus(orderId: string, status: AdminOrder["status"]) {
    return adminRequest<AdminOrder>("/api/admin/orders", {
      method: "PATCH",
      body: JSON.stringify({ orderId, status })
    });
  },

  getCustomers() {
    return adminRequest<AdminCustomer[]>("/api/admin/customers");
  },

  getCoupons() {
    return adminRequest<AdminCoupon[]>("/api/admin/coupons");
  },

  createCoupon(coupon: Omit<AdminCoupon, "id" | "usage">) {
    return adminRequest<AdminCoupon>("/api/admin/coupons", {
      method: "POST",
      body: JSON.stringify(coupon)
    });
  },

  updateCoupon(coupon: AdminCoupon) {
    return adminRequest<AdminCoupon>("/api/admin/coupons", {
      method: "PATCH",
      body: JSON.stringify(coupon)
    });
  },

  deleteCoupon(couponId: string) {
    return adminRequest<{ success: boolean }>(`/api/admin/coupons?id=${encodeURIComponent(couponId)}`, {
      method: "DELETE"
    });
  },

  getCategories() {
    return adminRequest<AdminCategory[]>("/api/admin/categories");
  },

  createCategory(category: Pick<AdminCategory, "name" | "status">) {
    return adminRequest<AdminCategory[]>("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify(category)
    });
  },

  updateCategory(category: AdminCategory) {
    return adminRequest<AdminCategory[]>("/api/admin/categories", {
      method: "PATCH",
      body: JSON.stringify(category)
    });
  },

  deleteCategory(categoryId: string) {
    return adminRequest<AdminCategory[]>(`/api/admin/categories?id=${encodeURIComponent(categoryId)}`, {
      method: "DELETE"
    });
  },

  getReviews() {
    return adminRequest<AdminReview[]>("/api/admin/reviews");
  },

  updateReviewStatus(id: string, status: AdminReviewStatus) {
    return adminRequest<AdminReview>("/api/admin/reviews", {
      method: "PATCH",
      body: JSON.stringify({ id, status })
    });
  },

  deleteReview(id: string) {
    return adminRequest<{ success: boolean }>(`/api/admin/reviews?id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  }
};
