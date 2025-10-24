import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ✅ Define public routes (no auth required)
const isPublicRoute = createRouteMatcher([
  "/",                 // Landing page
  "/sign-in(.*)",      // Sign-in
  "/sign-up(.*)",      // Sign-up
  "/api/webhooks(.*)", // Public webhooks (optional)
]);

export default clerkMiddleware((auth, req) => {
  // Skip auth check for public routes
  if (isPublicRoute(req)) return;
  
  // For protected routes, Clerk automatically handles auth
});

// ✅ Minimal, modern matcher for Next.js 16 (App Router)
export const config = {
  matcher: [
    // Exclude static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)",
  ],
};