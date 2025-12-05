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

// Only initialize Auth0 if domain is provided
let auth0Instance = null;
if (domain) {
  try {
    auth0Instance = new Auth0Client({
      domain: domain,
      appBaseUrl: appBaseUrl,
      routes: {
        login: "/api/auth/login",
        logout: "/api/auth/logout",
        callback: "/api/auth/callback",
        profile: "/api/auth/me",
      },
    });
  } catch (error) {
    console.error("Error initializing Auth0:", error);
  }
}

// Create a proxy that handles missing Auth0 configuration
export const auth0 = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (!auth0Instance) {
        // Return safe defaults for missing Auth0
        if (prop === "getSession") {
          return async () => null;
        }
        if (prop === "requireSession") {
          return async () => {
            throw new Error("Auth0 not configured");
          };
        }
        if (prop === "middleware") {
          return async (request) => {
            const { NextResponse } = await import("next/server");
            return NextResponse.next();
          };
        }
        return () => {
          throw new Error(
            "Auth0 not configured: AUTH0_DOMAIN environment variable is missing"
          );
        };
      }
      return auth0Instance[prop];
    },
  }
);

// Helper method to require a session, throws if not authenticated
auth0.requireSession = async function () {
  const session = await this.getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
};
