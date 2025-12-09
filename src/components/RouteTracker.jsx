"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const controller = new AbortController();
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      signal: controller.signal,
    }).catch(() => {});
    return () => controller.abort();
  }, [pathname]);

  return null;
}
