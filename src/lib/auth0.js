import "server-only";
import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Explicitly configure Auth0Client with appBaseUrl
// The SDK requires APP_BASE_URL or AUTH0_BASE_URL
export const auth0 = new Auth0Client({
  appBaseUrl: process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL || "http://localhost:3000",
});
