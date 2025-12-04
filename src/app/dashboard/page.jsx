"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { toast } from "sonner";
import HeroEditorForm from "@/components/hero-editor-form";

export default function DashboardPage() {
  const { user, error, isLoading } = useUser();
  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);
  if (error) redirect("/auth/login");

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
          <HeroEditorForm />
        </div>
      )}
    </div>
  );
}
