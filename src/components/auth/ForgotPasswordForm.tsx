"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address.")
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const { forgotPassword, loading, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setMessage("");
    try {
      const response = await forgotPassword(values);
      setMessage(response.message);
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
      {message && (
        <p className="flex items-center gap-2 border border-luxury-olive/25 bg-luxury-olive/5 p-3 text-sm text-luxury-olive dark:border-luxury-gold/30 dark:bg-luxury-gold/10 dark:text-luxury-gold" role="status">
          <CheckCircle2 className="size-4" /> {message}
        </p>
      )}
      {error && (
        <p className="flex items-center gap-2 border border-luxury-burgundy/30 bg-luxury-burgundy/5 p-3 text-sm text-luxury-burgundy" role="alert">
          <AlertCircle className="size-4" /> {error}
        </p>
      )}
      <Button type="submit" variant="dark" className="w-full" isLoading={loading} loadingText="Sending">
        Send reset link
      </Button>
    </form>
  );
}
