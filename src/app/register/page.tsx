import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Join the private list"
      description="Create a client profile for wishlists, order history, and early capsule access."
      footerText="Already have an account?"
      footerHref="/login"
      footerAction="Sign in"
    >
      <RegisterForm />
    </AuthShell>
  );
}
