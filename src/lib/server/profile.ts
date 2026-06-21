import { prisma } from "@/lib/prisma";
import type { User } from "@/types/auth.types";

export async function ensureUserProfile(user: User) {
  return prisma.userProfile.upsert({
    where: { supabaseUserId: user.id },
    update: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role === "admin" ? "ADMIN" : "CUSTOMER"
    },
    create: {
      supabaseUserId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role === "admin" ? "ADMIN" : "CUSTOMER"
    }
  });
}
