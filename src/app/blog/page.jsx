import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { fetchPostsPaginated } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function BlogIndex({ searchParams }) {
  const page = Number(searchParams?.page || 1);
  const pageSize = 5;
  const { items, total } = await fetchPostsPaginated({ page, pageSize });
  const session = await auth0.getSession();
  const user = session?.user;
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500 dark:text-stone-300">Blog</p>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            Latest posts
          </h1>
        </div>
        {user && (
          <Button asChild>
            <Link href="/blog/new">New post</Link>
          </Button>
        )}
      </header>

      {(!items || items.length === 0) && (
        <p className="text-stone-600 dark:text-stone-300">
          No posts published yet.
        </p>
      )}

      <div className="space-y-4">
        {items?.map((post) => (
          <Card key={post.id} className="p-4 space-y-2">
            <Link
              href={`/blog/${post.slug}`}
              className="text-xl font-semibold text-blue-600 dark:text-blue-300 hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-sm text-stone-500">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : "Draft"}
            </p>
            <p className="text-stone-700 dark:text-stone-200">{post.preview}</p>
            <div className="flex justify-end">
              <Button asChild variant="outline" size="sm">
                <Link href={`/blog/${post.slug}`}>Read more</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-4">
          <Button asChild disabled={page <= 1} variant="outline">
            <Link href={`/blog?page=${Math.max(1, page - 1)}`}>Previous</Link>
          </Button>
          <span className="text-sm text-stone-600 dark:text-stone-300">
            Page {page} of {totalPages}
          </span>
          <Button asChild disabled={page >= totalPages} variant="outline">
            <Link href={`/blog?page=${Math.min(totalPages, page + 1)}`}>
              Next
            </Link>
          </Button>
        </div>
      )}
    </main>
  );
}
