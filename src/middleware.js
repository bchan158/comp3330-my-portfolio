import { auth0 } from "./lib/auth0";
import { NextResponse } from "next/server";

export default async function middleware(request) {
  // Check if AUTH0_DOMAIN is configured
  if (!process.env.AUTH0_DOMAIN) {
    // If Auth0 is not configured, skip the middleware
    // This prevents the "startsWith" error on undefined domain
    return NextResponse.next();
  }

  try {
    return await auth0.middleware(request);
  } catch (error) {
    // If there's an error, log it and continue
    console.error("Auth0 middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
