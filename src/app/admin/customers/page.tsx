"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Input } from "@/components/ui/input";
import { adminService } from "@/services/admin/admin.service";
import { formatPrice } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<Awaited<ReturnType<typeof adminService.getCustomers>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void adminService.getCustomers()
      .then((data) => {
        if (active) setCustomers(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredCustomers = useMemo(() => customers.filter((customer) =>
    `${customer.name} ${customer.email} ${customer.status}`.toLowerCase().includes(query.toLowerCase())
  ), [customers, query]);

  return (
    <div>
      <AdminPageHeader title="Customers" description="Customer list, search, status, order count, and lifetime value." />
      <section className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers" aria-label="Search customers" className="mb-5 max-w-md" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr><th className="py-3">Customer</th><th>Email</th><th>Orders</th><th>Spent</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-6 text-muted-foreground" colSpan={5}>Loading customers...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td className="py-6 text-muted-foreground" colSpan={5}>No customers found.</td></tr>
              ) : filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-0">
                  <td className="py-4 font-medium">{customer.name}</td><td>{customer.email}</td><td>{customer.orders}</td><td>{formatPrice(customer.spent)}</td><td><AdminStatusBadge status={customer.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
