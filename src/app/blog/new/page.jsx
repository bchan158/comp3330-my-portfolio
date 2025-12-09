import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import BlogEditorForm from "@/components/BlogEditorForm";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Card className="p-6 space-y-4">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Create a new post
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          Write in markdown. Title, preview, and content are required.
        </p>
        <BlogEditorForm />
      </Card>
    </main>
  );
}
