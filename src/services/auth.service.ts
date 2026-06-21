import { mapSessionToAuthResponse } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthResponse, ForgotPasswordRequest, LoginRequest, RegisterRequest, RegisterResponse } from "@/types/auth.types";

function mapAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("email rate limit exceeded")) {
    return "Too many email requests were sent recently. Please wait a few minutes before trying again.";
  }

  return message;
}

export const authService = {
  async login(data: LoginRequest) {
    const supabase = getSupabaseBrowserClient();
    const { data: response, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });

    if (error) {
      throw new Error(mapAuthErrorMessage(error.message));
    }

    if (!response.session) {
      throw new Error("Login failed. No active session was created.");
    }

    return mapSessionToAuthResponse(response.session);
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const supabase = getSupabaseBrowserClient();
    const { data: response, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          name: `${data.firstName} ${data.lastName}`.trim(),
          marketing_opt_in: Boolean(data.acceptsMarketing),
          preferred_category: "Women"
        }
      }
    });

    if (error) {
      throw new Error(mapAuthErrorMessage(error.message));
    }

    if (!response.session) {
      return {
        requiresEmailVerification: true,
        message: "Registration succeeded. Please verify your email to continue.",
        email: data.email
      };
    }

    return {
      ...mapSessionToAuthResponse(response.session),
      requiresEmailVerification: false
    };
  },

  async logout() {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(mapAuthErrorMessage(error.message));
    }

    return { success: true };
  },

  async forgotPassword(data: ForgotPasswordRequest) {
    const supabase = getSupabaseBrowserClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: origin ? `${origin}/login` : undefined
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Password reset instructions have been sent if the email exists."
    };
  },

  async refreshUser(token: string): Promise<AuthResponse> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new Error(mapAuthErrorMessage(error?.message ?? "Unable to refresh the authenticated user."));
    }

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      throw new Error("No active session found.");
    }

    return mapSessionToAuthResponse(sessionData.session);
  }
};
