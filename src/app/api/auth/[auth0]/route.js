import { handleAuth } from "@auth0/nextjs-auth0";

// Note: To skip the consent screen, configure your Auth0 dashboard:
// 1. Mark your application as "First-Party" in Auth0 Dashboard
// 2. Enable "Allow Skipping User Consent" for your API in Auth0 Dashboard
// 3. Ensure callback URLs are properly configured
export const GET = handleAuth();
export const POST = handleAuth();
