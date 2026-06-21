import type { UserRole } from "@/types/auth.types";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import type { AuthResponse, User } from "@/types/auth.types";

function getAdminEmails() {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS ?? "admin@borno.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export function mapSupabaseUser(user: SupabaseUser): User {
  const firstName =
    typeof user.user_metadata?.first_name === "string" && user.user_metadata.first_name.trim()
      ? user.user_metadata.first_name.trim()
      : "Borno";
  const lastName =
    typeof user.user_metadata?.last_name === "string" && user.user_metadata.last_name.trim()
      ? user.user_metadata.last_name.trim()
      : "Client";
  const fullName =
    typeof user.user_metadata?.name === "string" && user.user_metadata.name.trim()
      ? user.user_metadata.name.trim()
      : `${firstName} ${lastName}`.trim();
  const role: UserRole = isAdminEmail(user.email) ? "admin" : "customer";

  return {
    id: user.id,
    email: user.email ?? "",
    firstName,
    lastName,
    name: fullName,
    role,
    preferences: {
      currency: "BDT",
      language: "en",
      marketingOptIn: Boolean(user.user_metadata?.marketing_opt_in),
      preferredCategory:
        typeof user.user_metadata?.preferred_category === "string" ? user.user_metadata.preferred_category : "Women"
    },
    createdAt: user.created_at ?? new Date().toISOString()
  };
}

export function mapSessionToAuthResponse(session: Session): AuthResponse {
  return {
    user: mapSupabaseUser(session.user),
    token: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : new Date().toISOString()
  };
}
