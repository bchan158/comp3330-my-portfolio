"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const newProjectSchema = z.object({
  title: z.string().min(2, { message: "Your title is too short" }).max(200),
  description: z
    .string()
    .min(10, { message: "Your description is too short" })
    .max(1000),
  img: z.string().url({ message: "Please enter a valid URL for the image" }),
  link: z
    .string()
    .url({ message: "Please enter a valid URL for the project link" }),
  keywords: z.array(z.string()).optional(),
});

export default function NewPage() {
  const [draftKeyword, setDraftKeyword] = useState("");

  const form = useForm({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      title: "Write your project title here...",
      description: "Write your project description here...",
      img: "https://placehold.co/300.png",
      link: "https://your-project-link.com",
      keywords: [],
    },
  });

  async function onSubmit(values) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("img", values.img);
    formData.append("link", values.link);
    formData.append("keywords", JSON.stringify(values.keywords || []));

    try {
      const response = await fetch("/api/projects/new", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.ok) {
        toast.success("Project received successfully");
      } else {
        toast.error("Failed to create project. Try again.");
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Failed to create project. Try again.");
    }

    // TODO: in future we will write the data to DB
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 m-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="A title of your project" {...field} />
              </FormControl>
              <FormDescription>
                This is the title of your project.
              </FormDescription>
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
                <Input
                  placeholder="A brief description of your project"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is a brief description of your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="img"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://your-image-link.com/image.png"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the image URL of your project.
              </FormDescription>
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
              <FormDescription>
                This is the link to your project.
              </FormDescription>
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
              <FormItem className="flex">
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
                  <FormDescription>
                    Tag your project so it is easier to filter later.
                  </FormDescription>
                </div>
                <div className="flex flex-1 flex-wrap gap-2 pt-6">
                  {currentKeywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="outline"
                      className="flex items-center gap-1 bg-stone-600 text-stone-200"
                    >
                      {keyword}
                      <button
                        type="button"
                        className="ml-1 text-xs"
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
        <Button type="submit" className="mt-2">
          Submit
        </Button>
      </form>
    </Form>
  );
}
