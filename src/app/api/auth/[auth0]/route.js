import { auth0 } from "@/lib/auth0";

// The Auth0 SDK v4 for Next.js App Router uses this pattern:
// Export the handleAuth result directly as route handlers
export const GET = auth0.handleAuth();
export const POST = auth0.handleAuth();
