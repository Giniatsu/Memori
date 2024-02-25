import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

const AUTHENTICATED_PATHS = [
  "/account",
  "/activity",
]

const UNAUTHENTICATED_ONLY = [
  "/login",
  "/signup",
]

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const session = await supabase.auth.getSession();

  for (const path of AUTHENTICATED_PATHS) {
    if (req.nextUrl.pathname.substring(0, path.length) === path) {
      if (!session?.data?.session) {
        return NextResponse.redirect(new URL("/login", req.url))
      } 
    }
  }

  for (const path of UNAUTHENTICATED_ONLY) {
    if (req.nextUrl.pathname.substring(0, path.length) === path) {
      if (session?.data?.session) {
        return NextResponse.redirect(new URL("/", req.url))
      } 
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
