"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createSlug } from "@/lib/utils";

const editProjectSchema = z.object({
  title: z.string().min(2, { message: "Title is too short" }).max(200),
  description: z.string().min(10, { message: "Description is too short" }).max(1000),
  image: z.string().url({ message: "Image must be a valid URL" }),
  link: z.string().url({ message: "Link must be a valid URL" }),
  keywords: z.array(z.string()).optional(),
});

export default function EditProjectForm({ project, projectId, slug }) {
  const [draftKeyword, setDraftKeyword] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      title: project.title || "",
      description: project.description || "",
      image: project.image || "",
      link: project.link || "",
      keywords: Array.isArray(project.keywords) ? project.keywords : [],
    },
  });

  function onSubmit(values) {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            image: values.image,
            link: values.link,
            keywords: values.keywords || [],
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to update project");
          return;
        }

        toast.success("Project updated successfully!");
        // Use the updated title to create a new slug, or fall back to the provided slug
        const updatedSlug = values.title ? createSlug(values.title) : slug;
        router.push(`/projects/${updatedSlug}`);
        router.refresh();
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while updating the project");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 m-4 max-w-2xl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Project title" {...field} />
              </FormControl>
              <FormDescription>This is the title of your project.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of your project"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is a brief description of your project.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://your-image-link.com/image.png" {...field} />
              </FormControl>
              <FormDescription>This is the image URL of your project.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Link</FormLabel>
              <FormControl>
                <Input placeholder="https://your-project-link.com" {...field} />
              </FormControl>
              <FormDescription>This is the link to your project.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => {
            const currentKeywords = field.value ?? [];

            const handleAddKeyword = () => {
              const value = draftKeyword.trim();
              if (!value || currentKeywords.includes(value)) return;

              const updated = [...currentKeywords, value];
              field.onChange(updated);
              setDraftKeyword("");
            };

            const handleRemoveKeyword = (keyword) => {
              const updated = currentKeywords.filter((k) => k !== keyword);
              field.onChange(updated);
            };

            const handleKeyDown = (event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddKeyword();
              }
            };

            return (
              <FormItem className="flex flex-col">
                <div className="flex flex-col gap-2 flex-1">
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        value={draftKeyword}
                        onChange={(e) => setDraftKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add a keyword and press Enter"
                      />
                      <Button type="button" onClick={handleAddKeyword}>
                        Add
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>Tag your project so it is easier to filter later.</FormDescription>
                </div>
                <div className="flex flex-1 flex-wrap gap-2 pt-2">
                  {currentKeywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="outline"
                      className="flex items-center gap-1 bg-stone-600 text-stone-200"
                    >
                      {keyword}
                      <button
                        type="button"
                        className="ml-1 text-xs hover:text-red-400"
                        onClick={() => handleRemoveKeyword(keyword)}
                        aria-label={`Remove ${keyword}`}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Saving…" : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => router.back()}
            className="mt-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

