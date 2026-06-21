"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin/admin.service";
import type { AdminOrderStatus } from "@/types/admin/admin.types";
import { formatPrice } from "@/lib/utils";

const statuses: Array<"All" | AdminOrderStatus> = ["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<"All" | AdminOrderStatus>("All");
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof adminService.getOrders>>>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void adminService.getOrders()
      .then((data) => {
        if (active) setOrders(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleOrders = status === "All" ? orders : orders.filter((order) => order.status === status);

  async function updateStatus(orderId: string, nextStatus: AdminOrderStatus) {
    setUpdatingOrderId(orderId);

    try {
      const updated = await adminService.updateOrderStatus(orderId, nextStatus);
      setOrders((current) => current.map((order) => order.id === updated.id ? updated : order));
    } finally {
      setUpdatingOrderId(null);
    }
  }

  return (
    <div>
      <AdminPageHeader title="Orders" description="Track pending, confirmed, processing, shipped, delivered, and cancelled orders." />
      <section className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
        <div className="mb-5 flex flex-wrap gap-2">
          {statuses.map((item) => (
            <Button key={item} variant={status === item ? "dark" : "outline"} size="sm" onClick={() => setStatus(item)}>{item}</Button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr><th className="py-3">Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th className="text-right">Update</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-6 text-muted-foreground" colSpan={7}>Loading orders...</td></tr>
              ) : visibleOrders.length === 0 ? (
                <tr><td className="py-6 text-muted-foreground" colSpan={7}>No orders found.</td></tr>
              ) : visibleOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="py-4 font-semibold">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.items}</td>
                  <td>{formatPrice(order.total)}</td>
                  <td><AdminStatusBadge status={order.status} /></td>
                  <td className="text-right">
                    <select
                      value={order.status}
                      onChange={(event) => void updateStatus(order.id, event.target.value as AdminOrderStatus)}
                      disabled={updatingOrderId === order.id}
                      aria-label={`Update status for ${order.id}`}
                      className="h-10 border border-border bg-card px-3 text-sm"
                    >
                      {statuses.filter((item): item is AdminOrderStatus => item !== "All").map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
