import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerUser } from "@/lib/server/auth";
import { ensureUserProfile } from "@/lib/server/profile";

export async function GET() {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;

  const profile = await ensureUserProfile(user);

  return NextResponse.json({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone ?? "",
    createdAt: profile.createdAt.toISOString()
  });
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;

  const body = (await request.json()) as {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };

  const profile = await ensureUserProfile(user);

  const updated = await prisma.userProfile.update({
    where: { id: profile.id },
    data: {
      firstName: body.firstName?.trim() || profile.firstName,
      lastName: body.lastName?.trim() || profile.lastName,
      phone: body.phone?.trim() || null
    }
  });

  return NextResponse.json({
    firstName: updated.firstName,
    lastName: updated.lastName,
    email: updated.email,
    phone: updated.phone ?? "",
    createdAt: updated.createdAt.toISOString()
  });
}
