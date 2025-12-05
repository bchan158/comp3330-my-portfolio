"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <Button asChild variant="outline">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/auth/logout">Log Out</a>
    </Button>
  );
}

