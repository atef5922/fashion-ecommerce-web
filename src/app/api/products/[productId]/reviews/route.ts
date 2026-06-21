import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser, requireServerUser } from "@/lib/server/auth";
import { ensureUserProfile } from "@/lib/server/profile";

function formatStatus(status: "PENDING" | "APPROVED" | "HIDDEN") {
  return status.charAt(0) + status.slice(1).toLowerCase() as "Pending" | "Approved" | "Hidden";
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const currentUser = await getServerUser();

  const reviews = await prisma.review.findMany({
    where: {
      productId,
      ...(currentUser ? {} : { status: "APPROVED" }),
      ...(currentUser ? { OR: [{ status: "APPROVED" }, { user: { supabaseUserId: currentUser.id } }] } : {})
    },
    include: {
      user: true
    },
    orderBy: { createdAt: "desc" }
  });

  const approvedReviews = reviews.filter((review) => review.status === "APPROVED");
  const averageRating = approvedReviews.length
    ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length
    : 0;

  return NextResponse.json({
    averageRating,
    reviewCount: approvedReviews.length,
    reviews: reviews.map((review) => ({
      id: review.id,
      customer: `${review.user.firstName} ${review.user.lastName}`.trim() || review.user.email,
      rating: review.rating,
      body: review.body,
      createdAt: review.createdAt.toISOString(),
      status: formatStatus(review.status)
    }))
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const { user, error } = await requireServerUser();
  if (error || !user) return error;

  const { productId } = await params;
  const profile = await ensureUserProfile(user);
  const body = (await request.json()) as { rating?: number; body?: string };

  const rating = Number(body.rating);
  const reviewBody = body.body?.trim() ?? "";

  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || reviewBody.length < 8) {
    return NextResponse.json({ message: "Please provide a 1 to 5 star rating and a meaningful review." }, { status: 400 });
  }

  const purchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId: profile.id,
        status: {
          not: "CANCELLED"
        }
      }
    }
  });

  if (!purchased) {
    return NextResponse.json({ message: "Only customers who purchased this product can leave a review." }, { status: 403 });
  }

  const review = await prisma.review.upsert({
    where: {
      userId_productId: {
        userId: profile.id,
        productId
      }
    },
    update: {
      rating,
      body: reviewBody,
      status: "PENDING"
    },
    create: {
      userId: profile.id,
      productId,
      rating,
      body: reviewBody,
      status: "PENDING"
    }
  });

  return NextResponse.json({
    id: review.id,
    status: formatStatus(review.status),
    message: "Your review has been submitted for approval."
  });
}
