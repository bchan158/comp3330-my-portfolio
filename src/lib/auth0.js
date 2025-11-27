import "server-only";
import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
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
