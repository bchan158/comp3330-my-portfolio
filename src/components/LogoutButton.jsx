"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <Button asChild variant="outline">
      <Link href="/api/auth/logout">Log Out</Link>
    </Button>
  );
}

