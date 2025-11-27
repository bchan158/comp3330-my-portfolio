import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth0.getSession();
  if (!session?.user) redirect("/api/auth/login");

  return (
    <section className="min-h-screen flex flex-col items-center gap-3">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome {session.user.email}</p>
      <p className="text-sm text-muted-foreground">
        Future labs will let you edit the hero from here; for now, render
        placeholders.
      </p>
    </section>
  );
}
