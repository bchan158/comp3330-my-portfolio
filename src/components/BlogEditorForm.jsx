/* Client component to create new blog posts */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSlug } from "@/lib/utils";

export default function BlogEditorForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState("");
  const [content, setContent] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          preview,
          content,
          publishedAt: publishedAt
            ? new Date(publishedAt).toISOString()
            : undefined,
          slug: createSlug(title),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create post");
      }
      const { data } = await response.json();
      router.push(`/blog/${data.slug}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl w-full">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My newest post"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          Preview
        </label>
        <Input
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          placeholder="A quick summary of the post"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          Content
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post in markdown..."
          className="min-h-[200px]"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          Publish date (optional)
        </label>
        <Input
          type="datetime-local"
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Publish post"}
      </Button>
    </form>
  );
}
