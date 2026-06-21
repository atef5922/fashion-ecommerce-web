import type { ProfileDetails, SavedAddress } from "@/types/profile.types";

async function profileRequest<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Profile request failed." }));
    throw new Error(error.message ?? "Profile request failed.");
  }

  return response.json() as Promise<T>;
}

export const profileService = {
  getProfile() {
    return profileRequest<ProfileDetails>("/api/profile");
  },

  updateProfile(payload: Pick<ProfileDetails, "firstName" | "lastName" | "phone">) {
    return profileRequest<ProfileDetails>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  },

  getAddresses() {
    return profileRequest<SavedAddress[]>("/api/profile/addresses");
  },

  createAddress(payload: Omit<SavedAddress, "id">) {
    return profileRequest<SavedAddress[]>("/api/profile/addresses", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  updateAddress(payload: SavedAddress) {
    return profileRequest<SavedAddress[]>("/api/profile/addresses", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  },

  deleteAddress(id: string) {
    return profileRequest<SavedAddress[]>(`/api/profile/addresses?id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  }
};
