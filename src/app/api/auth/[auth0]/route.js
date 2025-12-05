import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

// Note: To skip the consent screen, configure your Auth0 dashboard:
// 1. Mark your application as "First-Party" in Auth0 Dashboard
// 2. Enable "Allow Skipping User Consent" for your API in Auth0 Dashboard
// 3. Ensure callback URLs are properly configured

// The middleware handles auth routes, but we need route handlers for Next.js
// These handlers delegate to the Auth0Client middleware
export async function GET(request, { params }) {
  try {
    // Delegate to the auth0 middleware which handles all auth routes
    const response = await auth0.middleware(request);
    return response;
  } catch (error) {
    console.error("Auth route error:", error);
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    // Delegate to the auth0 middleware which handles all auth routes
    const response = await auth0.middleware(request);
    return response;
  } catch (error) {
    console.error("Auth route error:", error);
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 500 }
    );
  }
}
