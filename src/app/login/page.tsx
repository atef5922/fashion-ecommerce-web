import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Client login"
      title="Welcome back"
      description="Access your profile, saved pieces, orders, and private client privileges."
      footerText="New to Mugnee?"
      footerHref="/register"
      footerAction="Create an account"
    >
      <LoginForm />
    </AuthShell>
  );
}
