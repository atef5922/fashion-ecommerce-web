import { NextResponse } from "next/server";
import { isAdminEmail, mapSupabaseUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getServerUser() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user ? mapSupabaseUser(user) : null;
}

export async function requireServerUser() {
  const user = await getServerUser();

  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ message: "Authentication required." }, { status: 401 })
    };
  }

  return { user, error: null };
}

export async function requireServerAdmin() {
  const user = await getServerUser();

  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ message: "Authentication required." }, { status: 401 })
    };
  }

  if (!isAdminEmail(user.email)) {
    return {
      user: null,
      error: NextResponse.json({ message: "Admin access required." }, { status: 403 })
    };
  }

  return { user, error: null };
}
