"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
      router.push("/profile");
    } catch {
      // The auth hook already stores a user-facing error message for the form.
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Input type="email" placeholder="Email address" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register("email")} />
        {errors.email && <p className="mt-2 text-xs text-luxury-burgundy" role="alert">{errors.email.message}</p>}
      </div>
      <div>
        <Input type="password" placeholder="Password" autoComplete="current-password" aria-invalid={Boolean(errors.password)} {...register("password")} />
        {errors.password && <p className="mt-2 text-xs text-luxury-burgundy" role="alert">{errors.password.message}</p>}
      </div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input type="checkbox" className="size-4 accent-luxury-ink" />
          Remember me
        </label>
        <Link href="/forgot-password" className="font-medium text-luxury-burgundy hover:underline dark:text-luxury-gold">
          Forgot password?
        </Link>
      </div>
      {error && (
        <p className="flex items-center gap-2 border border-luxury-burgundy/30 bg-luxury-burgundy/5 p-3 text-sm text-luxury-burgundy" role="alert">
          <AlertCircle className="size-4" /> {error}
        </p>
      )}
      <Button type="submit" variant="dark" className="w-full" isLoading={loading} loadingText="Signing in">
        Sign in
      </Button>
    </form>
  );
}
