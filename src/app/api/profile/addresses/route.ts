import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerUser } from "@/lib/server/auth";
import { ensureUserProfile } from "@/lib/server/profile";

type AddressPayload = {
  id?: string;
  label: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
};

async function listAddresses(userId: string) {
  const addresses = await prisma.savedAddress.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  return addresses.map((address) => ({
    id: address.id,
    label: address.label,
    firstName: address.firstName,
    lastName: address.lastName,
    email: address.email,
    phone: address.phone,
    address1: address.address1,
    address2: address.address2 ?? "",
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    isDefaultShipping: address.isDefaultShipping,
    isDefaultBilling: address.isDefaultBilling
  }));
}

async function normalizeDefaults(userId: string, payload: AddressPayload, keepId?: string) {
  const updates = [];
  if (payload.isDefaultShipping) {
    updates.push(
      prisma.savedAddress.updateMany({
        where: { userId, ...(keepId ? { NOT: { id: keepId } } : {}) },
        data: { isDefaultShipping: false }
      })
    );
  }
  if (payload.isDefaultBilling) {
    updates.push(
      prisma.savedAddress.updateMany({
        where: { userId, ...(keepId ? { NOT: { id: keepId } } : {}) },
        data: { isDefaultBilling: false }
      })
    );
  }
  if (updates.length) await prisma.$transaction(updates);
}

export async function GET() {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;

  const profile = await ensureUserProfile(user);
  return NextResponse.json(await listAddresses(profile.id));
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;
  const profile = await ensureUserProfile(user);
  const body = (await request.json()) as AddressPayload;

  await normalizeDefaults(profile.id, body);

  await prisma.savedAddress.create({
    data: {
      userId: profile.id,
      label: body.label.trim(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      address1: body.address1.trim(),
      address2: body.address2?.trim() || null,
      city: body.city.trim(),
      state: body.state.trim(),
      postalCode: body.postalCode.trim(),
      country: body.country.trim(),
      isDefaultShipping: Boolean(body.isDefaultShipping),
      isDefaultBilling: Boolean(body.isDefaultBilling)
    }
  });

  return NextResponse.json(await listAddresses(profile.id));
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;
  const profile = await ensureUserProfile(user);
  const body = (await request.json()) as AddressPayload;

  if (!body.id) {
    return NextResponse.json({ message: "Address id is required." }, { status: 400 });
  }

  await normalizeDefaults(profile.id, body, body.id);

  const existing = await prisma.savedAddress.findFirst({
    where: { id: body.id, userId: profile.id }
  });

  if (!existing) {
    return NextResponse.json({ message: "Address not found." }, { status: 404 });
  }

  await prisma.savedAddress.update({
    where: { id: body.id },
    data: {
      label: body.label.trim(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      address1: body.address1.trim(),
      address2: body.address2?.trim() || null,
      city: body.city.trim(),
      state: body.state.trim(),
      postalCode: body.postalCode.trim(),
      country: body.country.trim(),
      isDefaultShipping: Boolean(body.isDefaultShipping),
      isDefaultBilling: Boolean(body.isDefaultBilling)
    }
  });

  return NextResponse.json(await listAddresses(profile.id));
}

export async function DELETE(request: NextRequest) {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;
  const profile = await ensureUserProfile(user);
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Address id is required." }, { status: 400 });
  }

  const deleted = await prisma.savedAddress.deleteMany({
    where: { id, userId: profile.id }
  });

  if (!deleted.count) {
    return NextResponse.json({ message: "Address not found." }, { status: 404 });
  }

  return NextResponse.json(await listAddresses(profile.id));
}
