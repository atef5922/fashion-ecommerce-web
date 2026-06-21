import { Suspense } from "react";
import { ProfilePanel } from "@/components/auth/ProfilePanel";

export default function ProfilePage() {
  return (
    <main className="luxury-container py-12 md:py-20">
      <Suspense fallback={<div className="h-64 animate-pulse bg-muted" />}>
        <ProfilePanel />
      </Suspense>
    </main>
  );
}
