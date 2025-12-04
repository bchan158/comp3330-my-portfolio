import "server-only";
import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Get required Auth0 configuration from environment variables
// Ensure domain is always a string to prevent "startsWith" errors
const domain = process.env.AUTH0_DOMAIN || "";
const appBaseUrl =
  process.env.APP_BASE_URL ||
  process.env.AUTH0_BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3000";

export const auth0 = new Auth0Client({
  domain: domain,
  appBaseUrl: appBaseUrl,
  routes: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    callback: "/api/auth/callback",
    profile: "/api/auth/me",
  },
});

// Helper method to require a session, throws if not authenticated
auth0.requireSession = async function () {
  const session = await this.getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
};
