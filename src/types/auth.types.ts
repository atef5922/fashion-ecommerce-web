export type UserRole = "admin" | "customer";

export type UserPreferences = {
  currency: string;
  language: string;
  marketingOptIn: boolean;
  preferredCategory?: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  createdAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptsMarketing?: boolean;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type AuthResponse = {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: string;
};

export type RegisterResponse =
  | (AuthResponse & {
      requiresEmailVerification: false;
      message?: string;
    })
  | {
      requiresEmailVerification: true;
      message: string;
      email: string;
    };

export type AuthErrorResponse = {
  message: string;
  code?: string;
};
