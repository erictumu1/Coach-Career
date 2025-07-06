import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname === "/api/ping") {
    // Bypass middleware for ping route
    return;
  }
  // Your existing logic
  const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/inngest",
    "/api/ping", // You can remove this line temporarily too
    "/",
  ]);

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});
