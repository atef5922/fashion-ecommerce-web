import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Password help"
      title="Reset your password"
      description="Enter your email and we will prepare reset instructions for your account."
      footerText="Remember your password?"
      footerHref="/login"
      footerAction="Sign in"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
