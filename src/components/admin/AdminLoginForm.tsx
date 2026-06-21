"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { siteConfig } from "@/lib/constants";
import { adminService } from "@/services/admin/admin.service";
import { useAuthStore } from "@/store/authStore";

const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid admin email address."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin/dashboard";
  const { loading, error, isAuthenticated, user, clearError } = useAuth();
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.replace(nextPath);
    }
  }, [isAuthenticated, nextPath, router, user?.role]);

  async function onSubmit(values: AdminLoginFormValues) {
    clearError();
    setLoading(true);

    try {
      await adminService.login(values);
      router.replace(nextPath);
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "Admin login failed.";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <main className="luxury-container grid min-h-screen place-items-center py-10 md:py-16">
      <section className="grid w-full max-w-5xl overflow-hidden border border-border bg-card shadow-soft dark:border-luxury-dark-border dark:bg-luxury-dark-card lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative hidden bg-luxury-ink p-10 text-white dark:bg-luxury-dark-surface lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(200,169,126,0.22),transparent_24rem),radial-gradient(circle_at_82%_82%,rgba(93,31,46,0.32),transparent_24rem)]" />
          <div className="relative">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.32em] text-luxury-gold">{siteConfig.name}</p>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,4vw,4.5rem)] font-semibold leading-[0.92]">
              Admin access for the {siteConfig.tagline.toLowerCase()}.
            </h1>
          </div>
          <div className="relative space-y-5 text-white/72">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 size-4 text-luxury-gold" />
              <p className="type-body-sm max-w-sm">Restricted workspace for BORNO operations, catalog updates, orders, and brand management.</p>
            </div>
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-1 size-4 text-luxury-gold" />
              <p className="type-body-sm max-w-sm">Use the dedicated admin credentials only. Customer sign-in does not unlock this workspace.</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-10 lg:p-12">
          <p className="type-eyebrow text-luxury-burgundy dark:text-luxury-gold">Admin login</p>
          <h2 className="type-page-title mt-4">Sign in</h2>
          <p className="type-body-sm mt-4 max-w-xl text-muted-foreground">
            Enter your admin email and password to access the BORNO dashboard.
          </p>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                type="email"
                placeholder="Admin email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && <p className="mt-2 text-xs text-luxury-burgundy" role="alert">{errors.email.message}</p>}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              {errors.password && <p className="mt-2 text-xs text-luxury-burgundy" role="alert">{errors.password.message}</p>}
            </div>

            {error && (
              <p className="flex items-center gap-2 border border-luxury-burgundy/30 bg-luxury-burgundy/5 p-3 text-sm text-luxury-burgundy" role="alert">
                <AlertCircle className="size-4" /> {error}
              </p>
            )}

            <Button type="submit" variant="dark" className="w-full" isLoading={loading} loadingText="Signing in">
              Login to dashboard
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
