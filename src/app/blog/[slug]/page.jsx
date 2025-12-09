import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPostBySlug } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <Button asChild variant="outline" size="sm">
        <Link href="/blog">← Back to all posts</Link>
      </Button>

      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-stone-500 text-sm">
          <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"}</span>
          {post.author && <span>by {post.author}</span>}
        </div>
      </header>

      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </main>
  );
}
