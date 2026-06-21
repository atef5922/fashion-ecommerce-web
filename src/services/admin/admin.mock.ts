import type {
  AdminBlog,
  AdminCategory,
  AdminCoupon,
  AdminCustomer,
  AdminOrder,
  AdminProduct,
  AdminReview
} from "@/types/admin/admin.types";
import { formatCurrency } from "@/lib/currency";

export const adminStats = [
  { label: "Revenue", value: formatCurrency(1284300), change: "+18.4%" },
  { label: "Orders", value: "1,248", change: "+11.2%" },
  { label: "Customers", value: "8,920", change: "+7.8%" },
  { label: "Products", value: "486", change: "+24" }
];

export const adminRevenueSeries = [
  { label: "Jan", revenue: 42, orders: 34 },
  { label: "Feb", revenue: 58, orders: 46 },
  { label: "Mar", revenue: 51, orders: 42 },
  { label: "Apr", revenue: 76, orders: 61 },
  { label: "May", revenue: 88, orders: 69 },
  { label: "Jun", revenue: 94, orders: 73 }
];

export const adminProducts: AdminProduct[] = [
  { id: "prd_001", title: "Silk Evening Blazer", category: "Women", price: 6500, stock: 18, status: "Active", vendor: "Mugnee Atelier" },
  { id: "prd_002", title: "Tailored Wool Coat", category: "Men", price: 7200, stock: 7, status: "Active", vendor: "Mugnee Atelier" },
  { id: "prd_003", title: "Champagne Satin Dress", category: "Women", price: 4990, stock: 4, status: "Draft", vendor: "Studio Capsule" },
  { id: "prd_004", title: "Leather Mini Bag", category: "Accessories", price: 3290, stock: 32, status: "Active", vendor: "Mugnee Atelier" },
  { id: "prd_005", title: "Kids Cashmere Cardigan", category: "Kids", price: 2290, stock: 0, status: "Archived", vendor: "Little Atelier" },
  { id: "prd_006", title: "Pleated Wide Leg Trouser", category: "Women", price: 3990, stock: 22, status: "Active", vendor: "Studio Capsule" }
];

export const adminCategories: AdminCategory[] = [
  { id: "cat_001", name: "Women", slug: "women", products: 184, status: "Visible" },
  { id: "cat_002", name: "Men", slug: "men", products: 128, status: "Visible" },
  { id: "cat_003", name: "Accessories", slug: "accessories", products: 96, status: "Visible" },
  { id: "cat_004", name: "Kids", slug: "kids", products: 78, status: "Hidden" }
];

export const adminOrders: AdminOrder[] = [
  { id: "#MG1028", customer: "Amara Quinn", total: 12490, status: "Pending", date: "2026-06-04", items: 3 },
  { id: "#MG1027", customer: "Noah Ellis", total: 7200, status: "Processing", date: "2026-06-04", items: 1 },
  { id: "#MG1026", customer: "Sophia Chen", total: 18500, status: "Shipped", date: "2026-06-03", items: 4 },
  { id: "#MG1025", customer: "Mina Rahman", total: 4990, status: "Delivered", date: "2026-06-02", items: 1 },
  { id: "#MG1024", customer: "James Lee", total: 3290, status: "Cancelled", date: "2026-06-01", items: 1 }
];

export const adminCustomers: AdminCustomer[] = [
  { id: "cus_001", name: "Amara Quinn", email: "amara@example.com", orders: 8, spent: 48200, status: "VIP" },
  { id: "cus_002", name: "Noah Ellis", email: "noah@example.com", orders: 3, spent: 17680, status: "Active" },
  { id: "cus_003", name: "Sophia Chen", email: "sophia@example.com", orders: 11, spent: 72900, status: "VIP" },
  { id: "cus_004", name: "James Lee", email: "james@example.com", orders: 1, spent: 3290, status: "Blocked" }
];

export const adminReviews: AdminReview[] = [
  { id: "rev_001", product: "Silk Evening Blazer", customer: "Amara Quinn", rating: 5, body: "Beautiful cut and packaging.", status: "Pending" },
  { id: "rev_002", product: "Leather Mini Bag", customer: "Sophia Chen", rating: 4, body: "Premium finish, compact size.", status: "Approved" },
  { id: "rev_003", product: "Tailored Wool Coat", customer: "Noah Ellis", rating: 2, body: "Sleeves ran long for me.", status: "Pending" }
];

export const adminCoupons: AdminCoupon[] = [
  { id: "cpn_001", code: "PRIVATE20", type: "Percentage", value: 20, usage: 42, usageLimit: 100, expiresAt: null, status: "Active" },
  { id: "cpn_002", code: "ATELIER500", type: "Fixed", value: 500, usage: 18, usageLimit: 50, expiresAt: "2026-06-30T00:00:00.000Z", status: "Inactive" },
  { id: "cpn_003", code: "SPRING15", type: "Percentage", value: 15, usage: 96, usageLimit: 100, expiresAt: "2026-05-01T00:00:00.000Z", status: "Expired" }
];

export const adminBlogs: AdminBlog[] = [
  { id: "blog_001", title: "The Modern Evening Wardrobe", author: "Editorial", status: "Published", date: "2026-06-01" },
  { id: "blog_002", title: "Packing for a Private Weekend", author: "Styling Team", status: "Draft", date: "2026-06-08" },
  { id: "blog_003", title: "A Note on Summer Tailoring", author: "Atelier", status: "Scheduled", date: "2026-06-12" }
];
