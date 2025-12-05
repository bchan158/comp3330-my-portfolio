import "server-only";
import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Use the standard Auth0Client which auto-configures from environment variables:
// - AUTH0_SECRET
// - AUTH0_BASE_URL
// - AUTH0_ISSUER_BASE_URL
// - AUTH0_CLIENT_ID
// - AUTH0_CLIENT_SECRET
export const auth0 = new Auth0Client();
