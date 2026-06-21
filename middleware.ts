import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAdminEmail } from "@/lib/auth";

function buildNextPath(request: NextRequest) {
  const query = request.nextUrl.search;
  return `${request.nextUrl.pathname}${query}`;
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request
  });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAdminLogin = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute) {
    if (!user) {
      if (!isAdminLogin) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/admin/login";
        loginUrl.searchParams.set("next", buildNextPath(request));
        return NextResponse.redirect(loginUrl);
      }
      return response;
    }

    if (!isAdminEmail(user.email)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", buildNextPath(request));
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminLogin) {
      const nextPath = request.nextUrl.searchParams.get("next") || "/admin/dashboard";
      return NextResponse.redirect(new URL(nextPath, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
