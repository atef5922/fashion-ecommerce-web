"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Package, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { checkoutService } from "@/services/checkout.service";
import { profileService } from "@/services/profile.service";
import type { OrderHistoryItem, ProfileDetails, SavedAddress } from "@/types/profile.types";
import { formatPrice } from "@/lib/utils";

const emptyAddress = {
  label: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Bangladesh",
  isDefaultShipping: false,
  isDefaultBilling: false
};

export function ProfilePanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const { user, isAuthenticated, hasHydrated, logout } = useAuth();
  const updateUser = useAuthStore((state) => state.updateUser);
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressMessage, setAddressMessage] = useState("");
  const [addressError, setAddressError] = useState("");
  const [addressSaving, setAddressSaving] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    let active = true;
    void profileService
      .getProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setProfileForm({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone ?? ""
        });
      })
      .catch(() => {
        if (!active) return;
        setProfileError("Profile could not be loaded right now.");
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || view !== "orders") {
      return;
    }

    let active = true;
    setOrdersLoading(true);

    void checkoutService
      .getOrders()
      .then((data) => {
        if (active) setOrders(data);
      })
      .catch(() => {
        if (active) setOrders([]);
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, view]);

  useEffect(() => {
    if (!isAuthenticated || view !== "addresses") {
      return;
    }

    let active = true;
    setAddressesLoading(true);
    void profileService
      .getAddresses()
      .then((data) => {
        if (active) setAddresses(data);
      })
      .catch(() => {
        if (active) setAddressError("Saved addresses could not be loaded.");
      })
      .finally(() => {
        if (active) setAddressesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, view]);

  const profileJoined = useMemo(() => profile ? `${profile.firstName} ${profile.lastName}`.trim() : user?.name, [profile, user?.name]);
  const activeView = view === "orders" || view === "addresses" ? view : "profile";

  if (!hasHydrated) {
    return <div className="h-64 animate-pulse bg-muted" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl border border-border bg-card p-8 text-center shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
        <p className="type-eyebrow text-luxury-burgundy dark:text-luxury-gold">Account required</p>
        <h1 className="type-section-title mt-4">Sign in to view your profile.</h1>
        <Link href="/login">
          <Button variant="dark" className="mt-6">Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.35fr_1fr]">
      <aside className="border border-border bg-card p-6 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
        <div className="grid size-16 place-items-center rounded-full bg-luxury-ink text-white dark:bg-luxury-gold dark:text-luxury-dark">
          <UserRound className="size-7" />
        </div>
        <h1 className="type-subsection-title mt-5">{profileJoined}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{profile?.email ?? user?.email}</p>
        <div className="mt-6 grid gap-2">
          <Link href="/profile" className={`border px-4 py-3 text-sm font-medium transition ${activeView === "profile" ? "border-luxury-ink bg-luxury-ink text-white dark:border-luxury-gold dark:bg-luxury-gold dark:text-luxury-dark" : "border-border hover:bg-muted"}`}>My Profile</Link>
          <Link href="/profile?view=addresses" className={`border px-4 py-3 text-sm font-medium transition ${activeView === "addresses" ? "border-luxury-ink bg-luxury-ink text-white dark:border-luxury-gold dark:bg-luxury-gold dark:text-luxury-dark" : "border-border hover:bg-muted"}`}>Saved Addresses</Link>
          <Link href="/profile?view=orders" className={`border px-4 py-3 text-sm font-medium transition ${activeView === "orders" ? "border-luxury-ink bg-luxury-ink text-white dark:border-luxury-gold dark:bg-luxury-gold dark:text-luxury-dark" : "border-border hover:bg-muted"}`}>Orders</Link>
          <Link href="/wishlist" className="border border-border px-4 py-3 text-sm font-medium transition hover:bg-muted">Wishlist</Link>
        </div>
        <Button
          variant="outline"
          className="mt-6 w-full"
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </aside>
      <div className="border border-border bg-card p-6 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card md:p-8">
        {activeView === "orders" ? (
          <div>
            <div className="flex items-center gap-3">
              <Package className="size-5 text-luxury-burgundy dark:text-luxury-gold" />
              <h2 className="type-subsection-title">Orders</h2>
            </div>
            <div className="mt-8 grid gap-4">
              {ordersLoading ? (
                <div className="border border-dashed border-border p-8 text-center">
                  <p className="text-sm font-medium">Loading orders...</p>
                </div>
              ) : orders.length ? (
                orders.map((order) => (
                  <div key={order.id} className="border border-border p-4 dark:border-luxury-dark-border">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{order.orderNumber}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()} / {order.paymentMethod.replaceAll("_", " ")}</p>
                      </div>
                      <span className="fine-label text-luxury-burgundy dark:text-luxury-gold">{order.status}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                      <span>Total: {formatPrice(order.total)}</span>
                      {order.estimatedDelivery ? <span>Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</span> : null}
                    </div>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setExpandedOrderId((current) => current === order.id ? null : order.id)}>
                      {expandedOrderId === order.id ? "Hide details" : "View details"}
                    </Button>
                    {expandedOrderId === order.id ? (
                      <div className="mt-4 grid gap-4 border-t border-border pt-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          <OrderAddressCard title="Shipping" address={order.shippingAddress} />
                          <OrderAddressCard title="Billing" address={order.billingAddress} />
                        </div>
                        <div className="grid gap-2 text-sm text-muted-foreground">
                          {order.items.map((item) => (
                            <div key={`${order.id}-${item.productId}-${item.color}-${item.size}`} className="flex flex-wrap items-center justify-between gap-3 border border-border p-3 dark:border-luxury-dark-border">
                              <div>
                                <p className="font-medium text-card-foreground">{item.productName}</p>
                                <p className="mt-1 text-xs">{item.color ?? "Default"} / {item.size ?? "Default"} / Qty {item.quantity}</p>
                              </div>
                              <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="grid gap-2 text-sm">
                          <SummaryLine label="Subtotal" value={order.subtotal} />
                          {order.discount > 0 ? <SummaryLine label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`} value={-order.discount} /> : null}
                          <SummaryLine label="Shipping" value={order.shipping} />
                          <SummaryLine label="Tax" value={order.tax} />
                          <SummaryLine label="Total" value={order.total} strong />
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="border border-dashed border-border p-8 text-center">
                  <p className="text-sm font-medium">No orders yet.</p>
                  <p className="mt-2 text-sm text-muted-foreground">Your future purchases will appear here after checkout.</p>
                </div>
              )}
            </div>
          </div>
        ) : activeView === "addresses" ? (
          <div>
            <div className="flex items-center gap-3">
              <MapPin className="size-5 text-luxury-burgundy dark:text-luxury-gold" />
              <h2 className="type-subsection-title">Saved addresses</h2>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 border border-border p-4 dark:border-luxury-dark-border">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input value={addressForm.label} onChange={(event) => setAddressForm((current) => ({ ...current, label: event.target.value }))} placeholder="Address label" />
                  <Input value={addressForm.phone} onChange={(event) => setAddressForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input value={addressForm.firstName} onChange={(event) => setAddressForm((current) => ({ ...current, firstName: event.target.value }))} placeholder="First name" />
                  <Input value={addressForm.lastName} onChange={(event) => setAddressForm((current) => ({ ...current, lastName: event.target.value }))} placeholder="Last name" />
                </div>
                <Input value={addressForm.email} onChange={(event) => setAddressForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" />
                <Input value={addressForm.address1} onChange={(event) => setAddressForm((current) => ({ ...current, address1: event.target.value }))} placeholder="Address line 1" />
                <Input value={addressForm.address2} onChange={(event) => setAddressForm((current) => ({ ...current, address2: event.target.value }))} placeholder="Address line 2" />
                <div className="grid gap-4 md:grid-cols-3">
                  <Input value={addressForm.city} onChange={(event) => setAddressForm((current) => ({ ...current, city: event.target.value }))} placeholder="City" />
                  <Input value={addressForm.state} onChange={(event) => setAddressForm((current) => ({ ...current, state: event.target.value }))} placeholder="State" />
                  <Input value={addressForm.postalCode} onChange={(event) => setAddressForm((current) => ({ ...current, postalCode: event.target.value }))} placeholder="Postal code" />
                </div>
                <Input value={addressForm.country} onChange={(event) => setAddressForm((current) => ({ ...current, country: event.target.value }))} placeholder="Country" />
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={addressForm.isDefaultShipping} onChange={(event) => setAddressForm((current) => ({ ...current, isDefaultShipping: event.target.checked }))} /> Default shipping</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={addressForm.isDefaultBilling} onChange={(event) => setAddressForm((current) => ({ ...current, isDefaultBilling: event.target.checked }))} /> Default billing</label>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="dark"
                    isLoading={addressSaving}
                    loadingText={editingAddressId ? "Saving" : "Adding"}
                    onClick={async () => {
                      setAddressSaving(true);
                      setAddressMessage("");
                      setAddressError("");
                      try {
                        const payload = { ...addressForm };
                        const updated = editingAddressId
                          ? await profileService.updateAddress({ id: editingAddressId, ...payload })
                          : await profileService.createAddress(payload);
                        setAddresses(updated);
                        setEditingAddressId(null);
                        setAddressForm(emptyAddress);
                        setAddressMessage(editingAddressId ? "Address updated successfully." : "Address added successfully.");
                      } catch (error) {
                        setAddressError(error instanceof Error ? error.message : "Address could not be saved.");
                      } finally {
                        setAddressSaving(false);
                      }
                    }}
                  >
                    {editingAddressId ? "Save address" : "Add address"}
                  </Button>
                  {editingAddressId ? <Button variant="outline" onClick={() => { setEditingAddressId(null); setAddressForm(emptyAddress); }}>Cancel</Button> : null}
                </div>
                {addressMessage ? <p className="text-sm text-luxury-olive dark:text-luxury-gold">{addressMessage}</p> : null}
                {addressError ? <p className="text-sm text-luxury-burgundy">{addressError}</p> : null}
              </div>

              {addressesLoading ? <p className="text-sm text-muted-foreground">Loading addresses...</p> : addresses.length ? addresses.map((address) => (
                <div key={address.id} className="border border-border p-4 dark:border-luxury-dark-border">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{address.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{address.firstName} {address.lastName} / {address.phone}</p>
                    </div>
                    <div className="flex gap-2 text-xs">
                      {address.isDefaultShipping ? <span className="border border-border px-2 py-1 dark:border-luxury-dark-border">Default shipping</span> : null}
                      {address.isDefaultBilling ? <span className="border border-border px-2 py-1 dark:border-luxury-dark-border">Default billing</span> : null}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{address.address1}{address.address2 ? `, ${address.address2}` : ""}</p>
                  <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.postalCode}</p>
                  <p className="text-sm text-muted-foreground">{address.country}</p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      setAddressMessage("");
                      setAddressError("");
                      setEditingAddressId(address.id);
                      setAddressForm({
                        label: address.label,
                        firstName: address.firstName,
                        lastName: address.lastName,
                        email: address.email,
                        phone: address.phone,
                        address1: address.address1,
                        address2: address.address2 ?? "",
                        city: address.city,
                        state: address.state,
                        postalCode: address.postalCode,
                        country: address.country,
                        isDefaultShipping: address.isDefaultShipping,
                        isDefaultBilling: address.isDefaultBilling
                      });
                    }}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={async () => {
                      setAddressMessage("");
                      setAddressError("");
                      try {
                        setAddresses(await profileService.deleteAddress(address.id));
                        if (editingAddressId === address.id) {
                          setEditingAddressId(null);
                          setAddressForm(emptyAddress);
                        }
                        setAddressMessage("Address removed.");
                      } catch (error) {
                        setAddressError(error instanceof Error ? error.message : "Address could not be deleted.");
                      }
                    }}>Delete</Button>
                  </div>
                </div>
              )) : <div className="border border-dashed border-border p-8 text-center"><p className="text-sm font-medium">No saved addresses yet.</p><p className="mt-2 text-sm text-muted-foreground">Add your shipping and billing destinations here for faster checkout.</p></div>}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="type-subsection-title">Profile details</h2>
            {profileError ? <p className="mt-4 text-sm text-luxury-burgundy">{profileError}</p> : null}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Input value={profileForm.firstName} onChange={(event) => setProfileForm((current) => ({ ...current, firstName: event.target.value }))} placeholder="First name" />
              <Input value={profileForm.lastName} onChange={(event) => setProfileForm((current) => ({ ...current, lastName: event.target.value }))} placeholder="Last name" />
              <Input value={profile?.email ?? ""} disabled placeholder="Email" />
              <Input value={profileForm.phone} onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="dark" isLoading={profileSaving} loadingText="Saving" onClick={async () => {
                setProfileSaving(true);
                setProfileMessage("");
                setProfileError("");
                try {
                  const updated = await profileService.updateProfile(profileForm);
                  setProfile(updated);
                  updateUser({
                    firstName: updated.firstName,
                    lastName: updated.lastName,
                    phone: updated.phone
                  });
                  setProfileMessage("Profile updated successfully.");
                } catch (error) {
                  setProfileError(error instanceof Error ? error.message : "Profile could not be updated.");
                } finally {
                  setProfileSaving(false);
                }
              }}>Save profile</Button>
              {profile?.createdAt ? <p className="self-center text-sm text-muted-foreground">Client since {new Date(profile.createdAt).toLocaleDateString()}</p> : null}
            </div>
            {profileMessage ? <p className="mt-4 text-sm text-luxury-olive dark:text-luxury-gold">{profileMessage}</p> : null}
            {profileError ? <p className="mt-4 text-sm text-luxury-burgundy">{profileError}</p> : null}
          </div>
        )}
      </div>
    </section>
  );
}

function SummaryLine({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return <div className={`flex justify-between ${strong ? "border-t border-border pt-3 font-semibold" : "text-muted-foreground"}`}><span>{label}</span><span>{formatPrice(value)}</span></div>;
}

function OrderAddressCard({ title, address }: { title: string; address: OrderHistoryItem["shippingAddress"] }) {
  return (
    <div className="border border-border p-4 dark:border-luxury-dark-border">
      <h3 className="fine-label text-luxury-burgundy dark:text-luxury-gold">{title}</h3>
      <p className="mt-3 text-sm font-medium">{address.firstName} {address.lastName}</p>
      <p className="mt-1 text-sm text-muted-foreground">{address.address1}{address.address2 ? `, ${address.address2}` : ""}</p>
      <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.postalCode}</p>
      <p className="text-sm text-muted-foreground">{address.country}</p>
      <p className="mt-1 text-sm text-muted-foreground">{address.phone}</p>
    </div>
  );
}
