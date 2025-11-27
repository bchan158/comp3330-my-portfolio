import { auth0 } from "./lib/auth0";

export default async function middleware(request) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
