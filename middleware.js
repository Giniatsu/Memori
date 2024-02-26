import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

// Add protected paths here
const AUTHENTICATED_PATHS = [
  "/account",
  "/account/**",
  "/activity",
  "/activity/**",
  "/graves",
  "/graves/*",
  "/graves/contributions",
]

// Add paths that can only be accessed by non-authenticated users here
const UNAUTHENTICATED_ONLY = [
  "/login",
  "/signup",
]

// Function to convert * and ** in strings to its appropriate regex patterns
// * examples:
//   /account/* can be /account/a or /account/b but not /account/a/b
//   /account/*/test can be /account/a/test or /account/b/test but not /account/a/b/c/test
// ** examples:
//   /account/** can be /account/a/b or /account/a/b/c/d
//   /account/**/test can be /account/a/b/test or /account/a/test
function wildcardToRegexPattern(path) {
  // Escape special regex characters
  const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Convert ** wildcards to regex equivalents
  const doubleStarRegex = /\\\*\*/g;
  let regexPattern = escapedPath;
  while (doubleStarRegex.test(regexPattern)) {
    regexPattern = regexPattern.replace(doubleStarRegex, '(.+?)');
  }

  // Convert * wildcards to regex equivalents
  const singleStarRegex = /\\\*/g;
  regexPattern = regexPattern.replace(singleStarRegex, '([^/]+)');

  // Ensure the pattern matches the entire string
  return new RegExp(`^${regexPattern}$`);
}

// Convert wildcard paths to regex patterns
const authenticatedPathRegexes = AUTHENTICATED_PATHS.map(wildcardToRegexPattern);
const unauthenticatedPathRegexes = UNAUTHENTICATED_ONLY.map(wildcardToRegexPattern);

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const session = await supabase.auth.getUser();
  console.log(req.nextUrl.pathname);

  console.log(session)
  for (const pathRegex of authenticatedPathRegexes) {
    if (pathRegex.test(req.nextUrl.pathname)) {
      if (!session?.data?.user) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  }

  for (const pathRegex of unauthenticatedPathRegexes) {
    if (pathRegex.test(req.nextUrl.pathname)) {
      if (session?.data?.user) {
        return NextResponse.redirect(new URL("/", req.url));
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
