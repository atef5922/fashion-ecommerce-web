"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .regex(/[A-Z]/, "Add one uppercase letter.")
    .regex(/[0-9]/, "Add one number."),
  acceptsMarketing: z.boolean().optional()
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ];
  return checks.filter(Boolean).length;
}

export function RegisterForm() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  const { register: createAccount, loading, error } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      acceptsMarketing: true
    }
  });
  const password = watch("password");
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthLabel = ["Very weak", "Weak", "Good", "Strong", "Excellent"][strength] ?? "Very weak";

  async function onSubmit(values: RegisterFormValues) {
    setSuccessMessage("");
    try {
      const response = await createAccount(values);

      if (response.requiresEmailVerification) {
        setSuccessMessage(response.message);
        return;
      }

      router.push("/profile");
    } catch {
      // The auth hook already stores a user-facing error message for the form.
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input placeholder="First name" autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} {...register("firstName")} />
          {errors.firstName && <p className="mt-2 text-xs text-luxury-burgundy" role="alert">{errors.firstName.message}</p>}
        </div>
        <div>
          <Input placeholder="Last name" autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} {...register("lastName")} />
          {errors.lastName && <p className="mt-2 text-xs text-luxury-burgundy" role="alert">{errors.lastName.message}</p>}
        </div>
      </div>
      <div>
        <Input type="email" placeholder="Email address" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register("email")} />
        {errors.email && <p className="mt-2 text-xs text-luxury-burgundy" role="alert">{errors.email.message}</p>}
      </div>
      <div>
        <Input type="password" placeholder="Create password" autoComplete="new-password" aria-invalid={Boolean(errors.password)} {...register("password")} />
        <div className="mt-3 grid gap-2">
          <div className="grid grid-cols-4 gap-2" aria-hidden="true">
            {[1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={cn(
                  "h-1.5 bg-muted transition",
                  strength >= step && "bg-luxury-burgundy dark:bg-luxury-gold"
                )}
              />
            ))}
          </div>
          <p className="flex items-center gap-2 text-xs text-muted-foreground" role="status">
            <CheckCircle2 className="size-3.5 text-luxury-olive dark:text-luxury-gold" /> Password strength: {strengthLabel}
          </p>
        </div>
        {errors.password && <p className="mt-2 text-xs text-luxury-burgundy" role="alert">{errors.password.message}</p>}
      </div>
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" className="mt-1 size-4 accent-luxury-ink" {...register("acceptsMarketing")} />
        Receive private sale access, styling notes, and capsule previews.
      </label>
      {successMessage && (
        <p className="flex items-center gap-2 border border-luxury-olive/25 bg-luxury-olive/5 p-3 text-sm text-luxury-olive dark:border-luxury-gold/30 dark:bg-luxury-gold/10 dark:text-luxury-gold" role="status">
          <CheckCircle2 className="size-4" /> {successMessage}
        </p>
      )}
      {error && (
        <p className="flex items-center gap-2 border border-luxury-burgundy/30 bg-luxury-burgundy/5 p-3 text-sm text-luxury-burgundy" role="alert">
          <AlertCircle className="size-4" /> {error}
        </p>
      )}
      <Button type="submit" variant="dark" className="w-full" isLoading={loading} loadingText="Creating account">
        Create account
      </Button>
    </form>
  );
}
