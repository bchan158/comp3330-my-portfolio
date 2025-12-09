"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { toast } from "sonner";
import HeroEditorForm from "@/components/hero-editor-form";
import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState({ totals: [], recent: [] });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      router.push("/api/auth/login");
    }
  }, [error, router]);

  useEffect(() => {
    if (!user) return;
    const loadStats = async () => {
      try {
        setLoadingStats(true);
        const response = await fetch("/api/analytics");
        if (!response.ok) throw new Error("Failed to load analytics");
        const data = await response.json();
        setStats(data.data || { totals: [], recent: [] });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen items-center bg-zinc-50 dark:bg-black">
      <h1 className="mt-8 text-4xl font-bold">Dashboard</h1>
      {isLoading && <p className="mt-4">Loading...</p>}
      {!isLoading && !user && (
        <p className="mt-4 text-lg">Log in to update your portfolio content.</p>
      )}
      {user && (
        <div className="mt-6 w-full max-w-5xl px-4 pb-10">
          <p className="mb-4 text-lg">
            Welcome to your dashboard, {user.nickname}!
          </p>
          <Card className="p-4 mb-6 space-y-3">
            <h2 className="text-xl font-semibold">Route analytics</h2>
            {loadingStats && (
              <p className="text-sm text-stone-500">Loading stats...</p>
            )}
            {!loadingStats && stats.totals.length === 0 && (
              <p className="text-sm text-stone-500">No visits tracked yet.</p>
            )}
            {!loadingStats && stats.totals.length > 0 && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-500 mb-2">Visits by route</p>
                  <div className="space-y-2">
                    {stats.totals.map((row) => (
                      <div key={row.path} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{row.path}</span>
                          <span>{row.count}</span>
                        </div>
                        <div className="h-2 rounded bg-stone-200 dark:bg-stone-800 overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{
                              width: `${Math.min(
                                100,
                                (row.count / (stats.totals[0]?.count || 1)) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-stone-500 mb-2">Recent visits</p>
                  <div className="space-y-1 text-sm">
                    {stats.recent.map((row, idx) => (
                      <div
                        key={`${row.path}-${idx}`}
                        className="flex justify-between border-b border-stone-200 dark:border-stone-800 py-1"
                      >
                        <span>{row.path}</span>
                        <span>
                          {row.visitedAt
                            ? new Date(row.visitedAt).toLocaleString()
                            : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
          <HeroEditorForm />
        </div>
      )}
    </div>
  );
}
