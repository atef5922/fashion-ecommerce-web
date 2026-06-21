"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CreditCard, MapPin, PackageCheck, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { checkoutService } from "@/services/checkout.service";
import { profileService } from "@/services/profile.service";
import { useCartHydration, useCartStore } from "@/store/cartStore";
import { useCheckoutHydration, useCheckoutStore } from "@/store/checkoutStore";
import { useAuthStore } from "@/store/authStore";
import type { AppliedCoupon, CheckoutAddress, CheckoutBilling, CheckoutTotals } from "@/types/checkout.types";
import type { SavedAddress } from "@/types/profile.types";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/currency";

const addressSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(7, "Phone number is required."),
  address1: z.string().min(4, "Address is required."),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  postalCode: z.string().min(3, "Postal code is required."),
  country: z.string().min(2, "Country is required.")
});

const billingSchema = addressSchema.extend({
  sameAsShipping: z.boolean()
});

type AddressFormValues = z.infer<typeof addressSchema>;
type BillingFormValues = z.infer<typeof billingSchema>;
type CheckoutStep = "shipping" | "billing" | "review" | "success";

const steps = [
  { id: "shipping", label: "Shipping Information", icon: MapPin },
  { id: "billing", label: "Billing Information", icon: CreditCard },
  { id: "review", label: "Order Review", icon: PackageCheck },
  { id: "success", label: "Success", icon: CheckCircle2 }
];

function calculateTotals(items: ReturnType<typeof useCartStore.getState>["items"]): CheckoutTotals {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const tax = Math.round(subtotal * 0.0825 * 100) / 100;
  return {
    subtotal,
    discount: 0,
    shipping,
    tax,
    total: subtotal + shipping + tax
  };
}

export function CheckoutFlow() {
  const cartHydrated = useCartHydration();
  const checkoutHydrated = useCheckoutHydration();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const userId = useAuthStore((state) => state.user?.id ?? "guest");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const step = useCheckoutStore((state) => state.step);
  const setStep = useCheckoutStore((state) => state.setStep);
  const shipping = useCheckoutStore((state) => state.shipping);
  const billing = useCheckoutStore((state) => state.billing);
  const setShipping = useCheckoutStore((state) => state.setShipping);
  const setBilling = useCheckoutStore((state) => state.setBilling);
  const setLastOrder = useCheckoutStore((state) => state.setLastOrder);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState("");
  const totals = useMemo(() => {
    const baseTotals = calculateTotals(items);

    if (!appliedCoupon) {
      return baseTotals;
    }

    const discountedSubtotal = Math.max(0, baseTotals.subtotal - appliedCoupon.discountAmount);
    const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
    const tax = Math.round(discountedSubtotal * 0.0825 * 100) / 100;

    return {
      subtotal: baseTotals.subtotal,
      discount: appliedCoupon.discountAmount,
      shipping,
      tax,
      total: discountedSubtotal + shipping + tax
    };
  }, [appliedCoupon, items]);

  useEffect(() => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  }, [items]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSavedAddresses([]);
      setAddressesError("");
      setAddressesLoading(false);
      return;
    }

    let active = true;
    setAddressesLoading(true);
    setAddressesError("");

    void profileService.getAddresses()
      .then((data) => {
        if (!active) return;
        setSavedAddresses(data);
      })
      .catch(() => {
        if (!active) return;
        setAddressesError("Saved addresses could not be loaded.");
      })
      .finally(() => {
        if (active) setAddressesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);
  const safeStep = useMemo<CheckoutStep>(() => {
    if (step === "review" && (!shipping || !billing)) {
      return shipping ? "billing" : "shipping";
    }

    if (step === "billing" && !shipping) {
      return "shipping";
    }

    if (step === "success") {
      return "shipping";
    }

    return step;
  }, [billing, shipping, step]);

  useEffect(() => {
    if (checkoutHydrated && step !== safeStep) {
      setStep(safeStep);
    }
  }, [checkoutHydrated, safeStep, setStep, step]);

  if (!cartHydrated || !checkoutHydrated) {
    return <CheckoutSkeleton />;
  }

  if (!items.length) {
    return (
      <main className="luxury-container py-16">
        <div className="mx-auto max-w-xl border border-border bg-card p-8 text-center shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
          <p className="type-eyebrow text-luxury-burgundy dark:text-luxury-gold">Checkout</p>
          <h1 className="type-section-title mt-4">Your cart is empty.</h1>
          <p className="mt-3 text-sm text-muted-foreground">Add a few pieces before starting secure checkout.</p>
          <Link href="/shop"><Button variant="dark" className="mt-6">Continue shopping</Button></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="luxury-container py-10 md:py-16">
      <div className="mb-8">
        <p className="type-eyebrow text-luxury-burgundy dark:text-luxury-gold">Secure Checkout</p>
        <h1 className="type-page-title mt-3">Checkout</h1>
      </div>
      <CheckoutStepper activeStep={safeStep} shipping={shipping} billing={billing} onStepChange={setStep} />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card md:p-8">
          {safeStep === "shipping" && (
            <ShippingForm
              defaultValues={shipping}
              addresses={savedAddresses}
              addressesLoading={addressesLoading}
              addressesError={addressesError}
              onSubmit={setShipping}
            />
          )}
          {safeStep === "billing" && shipping && (
            <BillingForm
              shipping={shipping}
              defaultValues={billing}
              addresses={savedAddresses}
              addressesLoading={addressesLoading}
              addressesError={addressesError}
              onSubmit={setBilling}
              onBack={() => setStep("shipping")}
            />
          )}
          {safeStep === "review" && shipping && billing && (
            <ReviewStep
              shipping={shipping}
              billing={billing}
              totals={totals}
              userId={userId}
              isAuthenticated={isAuthenticated}
              couponCode={appliedCoupon?.code}
              onBack={() => setStep("billing")}
              onSuccess={(order) => {
                setLastOrder(order);
                clearCart();
                setAppliedCoupon(null);
                setCouponCode("");
              }}
            />
          )}
        </section>
        <CheckoutSummary
          totals={totals}
          couponCode={couponCode}
          appliedCoupon={appliedCoupon}
          couponError={couponError}
          couponLoading={couponLoading}
          onCouponCodeChange={setCouponCode}
          onApplyCoupon={async () => {
            const trimmed = couponCode.trim().toUpperCase();
            if (!trimmed) {
              setCouponError("Enter a coupon code.");
              return;
            }

            setCouponLoading(true);
            setCouponError("");

            try {
              const coupon = await checkoutService.validateCoupon(trimmed, calculateTotals(items).subtotal);
              setAppliedCoupon(coupon);
              setCouponCode(coupon.code);
            } catch (error) {
              setAppliedCoupon(null);
              setCouponError(error instanceof Error ? error.message : "Coupon could not be applied.");
            } finally {
              setCouponLoading(false);
            }
          }}
          onRemoveCoupon={() => {
            setAppliedCoupon(null);
            setCouponCode("");
            setCouponError("");
          }}
        />
      </div>
    </main>
  );
}

function CheckoutStepper({
  activeStep,
  shipping,
  billing,
  onStepChange
}: {
  activeStep: CheckoutStep;
  shipping: CheckoutAddress | null;
  billing: CheckoutBilling | null;
  onStepChange: (step: CheckoutStep) => void;
}) {
  return (
    <ol className="grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = activeStep === step.id;
        const isDisabled =
          step.id === "success" ||
          (step.id === "billing" && !shipping) ||
          (step.id === "review" && (!shipping || !billing));

        return (
          <li key={step.id}>
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => onStepChange(step.id as CheckoutStep)}
              className={`flex min-h-16 w-full items-center gap-3 border px-4 text-left transition ${isActive ? "border-luxury-ink bg-luxury-ink text-white dark:border-luxury-gold dark:bg-luxury-gold dark:text-luxury-dark" : "border-border bg-card text-muted-foreground dark:border-luxury-dark-border dark:bg-luxury-dark-card"}`}
            >
              <span className="grid size-8 place-items-center border border-current"><Icon className="size-4" /></span>
              <span><span className="block text-xs">Step {index + 1}</span><span className="text-sm font-semibold">{step.label}</span></span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ShippingForm({
  defaultValues,
  addresses,
  addressesLoading,
  addressesError,
  onSubmit
}: {
  defaultValues: CheckoutAddress | null;
  addresses: SavedAddress[];
  addressesLoading: boolean;
  addressesError: string;
  onSubmit: (values: CheckoutAddress) => void;
}) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues ?? {
      firstName: "", lastName: "", email: "", phone: "", address1: "", address2: "", city: "", state: "", postalCode: "", country: "United States"
    }
  });
  const [selectedAddressId, setSelectedAddressId] = useState("");

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
      return;
    }

    const preferredAddress = addresses.find((address) => address.isDefaultShipping) ?? addresses[0];
    if (preferredAddress) {
      setSelectedAddressId(preferredAddress.id);
      form.reset(toCheckoutAddress(preferredAddress));
    }
  }, [addresses, defaultValues, form]);

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <FormHeader title="Shipping Information" description="Where should we send your order?" />
      <SavedAddressPicker
        title="Saved shipping address"
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        loading={addressesLoading}
        error={addressesError}
        onChange={(addressId) => {
          setSelectedAddressId(addressId);
          const selected = addresses.find((address) => address.id === addressId);
          if (selected) {
            form.reset(toCheckoutAddress(selected));
          }
        }}
      />
      <AddressFields register={(name) => form.register(name)} errors={form.formState.errors} />
      <Button type="submit" variant="dark" className="w-full md:w-fit">Continue to billing</Button>
    </form>
  );
}

function BillingForm({
  shipping,
  defaultValues,
  addresses,
  addressesLoading,
  addressesError,
  onSubmit,
  onBack
}: {
  shipping: CheckoutAddress;
  defaultValues: CheckoutBilling | null;
  addresses: SavedAddress[];
  addressesLoading: boolean;
  addressesError: string;
  onSubmit: (values: CheckoutBilling) => void;
  onBack: () => void;
}) {
  const form = useForm<BillingFormValues>({
    resolver: zodResolver(billingSchema),
    defaultValues: defaultValues ?? { ...shipping, sameAsShipping: true }
  });
  const sameAsShipping = form.watch("sameAsShipping");
  const [selectedAddressId, setSelectedAddressId] = useState("");

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
      return;
    }

    const preferredAddress = addresses.find((address) => address.isDefaultBilling) ?? addresses.find((address) => address.isDefaultShipping);
    if (preferredAddress && !sameAsShipping) {
      setSelectedAddressId(preferredAddress.id);
      form.reset({ ...toCheckoutAddress(preferredAddress), sameAsShipping: false });
    }
  }, [addresses, defaultValues, form, sameAsShipping]);

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <FormHeader title="Billing Information" description="Use the shipping address or add a separate billing address." />
      <label className="flex items-center gap-3 text-sm text-muted-foreground">
        <input type="checkbox" className="size-4 accent-luxury-ink" {...form.register("sameAsShipping")} />
        Billing address is same as shipping
      </label>
      {!sameAsShipping && (
        <>
          <SavedAddressPicker
            title="Saved billing address"
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            loading={addressesLoading}
            error={addressesError}
            onChange={(addressId) => {
              setSelectedAddressId(addressId);
              const selected = addresses.find((address) => address.id === addressId);
              if (selected) {
                form.reset({ ...toCheckoutAddress(selected), sameAsShipping: false });
              }
            }}
          />
          <AddressFields register={(name) => form.register(name)} errors={form.formState.errors} />
        </>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit" variant="dark">Review order</Button>
      </div>
    </form>
  );
}

function ReviewStep({ shipping, billing, totals, userId, isAuthenticated, couponCode, onBack, onSuccess }: { shipping: CheckoutAddress; billing: CheckoutBilling; totals: CheckoutTotals; userId: string; isAuthenticated: boolean; couponCode?: string; onBack: () => void; onSuccess: (order: Awaited<ReturnType<typeof checkoutService.createOrder>>) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const items = useCartStore((state) => state.items);

  async function submitOrder() {
    if (!isAuthenticated) {
      setError("Please sign in before placing your order.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const order = await checkoutService.createOrder({ userId, items, shipping, billing, totals, couponCode });
      onSuccess(order);
      router.push("/checkout/success");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Order could not be placed. Please review your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <FormHeader title="Order Review" description="Confirm your order details before placing the order." />
      <div className="grid gap-4 md:grid-cols-2">
        <AddressCard title="Shipping" address={shipping} />
        <AddressCard title="Billing" address={billing} />
      </div>
      <Textarea className="mt-5" placeholder="Order notes optional" aria-label="Order notes" />
      {error && <p className="mt-4 border border-luxury-burgundy/30 bg-luxury-burgundy/5 p-3 text-sm text-luxury-burgundy" role="alert">{error}</p>}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="button" variant="dark" isLoading={loading} loadingText="Placing order" onClick={submitOrder}>
          Place order
        </Button>
      </div>
    </div>
  );
}

function AddressFields({ register, errors }: { register: ReturnType<typeof useForm<AddressFormValues>>["register"]; errors: ReturnType<typeof useForm<AddressFormValues>>["formState"]["errors"] }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="firstName" placeholder="First name" register={register} error={errors.firstName?.message} />
        <Field name="lastName" placeholder="Last name" register={register} error={errors.lastName?.message} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="email" type="email" placeholder="Email" register={register} error={errors.email?.message} />
        <Field name="phone" placeholder="Phone" register={register} error={errors.phone?.message} />
      </div>
      <Field name="address1" placeholder="Address" register={register} error={errors.address1?.message} />
      <Field name="address2" placeholder="Apartment, suite, optional" register={register} error={errors.address2?.message} />
      <div className="grid gap-4 md:grid-cols-3">
        <Field name="city" placeholder="City" register={register} error={errors.city?.message} />
        <Field name="state" placeholder="State" register={register} error={errors.state?.message} />
        <Field name="postalCode" placeholder="Postal code" register={register} error={errors.postalCode?.message} />
      </div>
      <Field name="country" placeholder="Country" register={register} error={errors.country?.message} />
    </div>
  );
}

function Field({ name, placeholder, type = "text", register, error }: { name: keyof AddressFormValues; placeholder: string; type?: string; register: ReturnType<typeof useForm<AddressFormValues>>["register"]; error?: string }) {
  return (
    <div>
      <Input type={type} placeholder={placeholder} aria-label={placeholder} aria-invalid={Boolean(error)} {...register(name)} />
      {error && <p className="mt-2 text-xs text-luxury-burgundy" role="alert">{error}</p>}
    </div>
  );
}

function CheckoutSummary({
  totals,
  couponCode,
  appliedCoupon,
  couponError,
  couponLoading,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon
}: {
  totals: CheckoutTotals;
  couponCode: string;
  appliedCoupon: AppliedCoupon | null;
  couponError: string;
  couponLoading: boolean;
  onCouponCodeChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}) {
  const items = useCartStore((state) => state.items);

  return (
    <aside className="h-fit border border-border bg-card p-5 shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card">
      <h2 className="type-card-title">Order Summary</h2>
      <div className="mt-5 grid gap-4">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between gap-4 text-sm">
            <div><p className="font-medium">{item.product.name}</p><p className="mt-1 text-xs text-muted-foreground">{item.color} / {item.size} / Qty {item.quantity}</p></div>
            <span>{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t border-border pt-5">
        <p className="fine-label text-luxury-burgundy dark:text-luxury-gold">Coupon</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input
            value={couponCode}
            onChange={(event) => onCouponCodeChange(event.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            aria-label="Coupon code"
          />
          <Button type="button" variant="outline" onClick={onApplyCoupon} isLoading={couponLoading} loadingText="Applying">
            Apply
          </Button>
        </div>
        {appliedCoupon ? (
          <div className="mt-3 flex items-center justify-between gap-3 border border-luxury-olive/25 bg-luxury-olive/5 p-3 text-sm text-luxury-olive dark:border-luxury-gold/30 dark:bg-luxury-gold/10 dark:text-luxury-gold">
            <span>{appliedCoupon.code} applied</span>
            <button type="button" className="font-medium underline" onClick={onRemoveCoupon}>Remove</button>
          </div>
        ) : null}
        {couponError ? <p className="mt-3 text-sm text-luxury-burgundy">{couponError}</p> : null}
      </div>
      <div className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
        <SummaryRow label="Subtotal" value={totals.subtotal} />
        {totals.discount > 0 ? <SummaryRow label="Discount" value={-totals.discount} /> : null}
        <SummaryRow label="Shipping" value={totals.shipping} />
        <SummaryRow label="Estimated tax" value={totals.tax} />
        <SummaryRow label="Total" value={totals.total} strong />
      </div>
      <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" /> Secure checkout with server-side pricing and coupon validation.</p>
    </aside>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return <div className={`flex justify-between ${strong ? "border-t border-border pt-3 font-semibold" : "text-muted-foreground"}`}><span>{label}</span><span>{formatPrice(value)}</span></div>;
}

function SavedAddressPicker({
  title,
  addresses,
  selectedAddressId,
  loading,
  error,
  onChange
}: {
  title: string;
  addresses: SavedAddress[];
  selectedAddressId: string;
  loading: boolean;
  error: string;
  onChange: (addressId: string) => void;
}) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading saved addresses...</p>;
  }

  if (error) {
    return <p className="text-sm text-luxury-burgundy">{error}</p>;
  }

  if (!addresses.length) {
    return <p className="text-sm text-muted-foreground">No saved addresses found. Enter your details manually below.</p>;
  }

  return (
    <label className="grid gap-2 text-sm">
      <span className="fine-label text-luxury-burgundy dark:text-luxury-gold">{title}</span>
      <select
        value={selectedAddressId}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 border border-border bg-background px-4 text-sm outline-none transition focus:border-luxury-ink dark:border-luxury-dark-border dark:bg-luxury-dark-card"
      >
        <option value="">Choose a saved address</option>
        {addresses.map((address) => (
          <option key={address.id} value={address.id}>
            {address.label} / {address.address1}, {address.city}
          </option>
        ))}
      </select>
    </label>
  );
}

function AddressCard({ title, address }: { title: string; address: CheckoutAddress }) {
  return (
    <div className="border border-border p-4 dark:border-luxury-dark-border">
      <h3 className="fine-label text-luxury-burgundy dark:text-luxury-gold">{title}</h3>
      <p className="mt-3 text-sm font-medium">{address.firstName} {address.lastName}</p>
      <p className="mt-1 text-sm text-muted-foreground">{address.address1}{address.address2 ? `, ${address.address2}` : ""}</p>
      <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.postalCode}</p>
      <p className="text-sm text-muted-foreground">{address.country}</p>
    </div>
  );
}

function FormHeader({ title, description }: { title: string; description: string }) {
  return <div><h2 className="type-subsection-title">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{description}</p></div>;
}

function CheckoutSkeleton() {
  return (
    <main className="luxury-container py-16">
      <Skeleton className="h-16 w-80" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <Skeleton className="h-[520px] w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    </main>
  );
}

function toCheckoutAddress(address: SavedAddress): CheckoutAddress {
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    email: address.email,
    phone: address.phone,
    address1: address.address1,
    address2: address.address2 ?? "",
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country
  };
}
