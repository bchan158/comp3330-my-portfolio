"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  avatar: z.string().optional(),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  shortDescription: z.string().min(2, "Short description must be at least 2 characters"),
  longDescription: z.string().min(10, "Long description must be at least 10 characters"),
});

export default function HeroEditorForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: "",
      fullName: "",
      shortDescription: "",
      longDescription: "",
    },
  });

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch("/api/hero");
        if (!response.ok) throw new Error("Failed to fetch hero data");
        const { data } = await response.json();
        if (data) {
          form.reset({
            avatar: data.avatar || "",
            fullName: data.fullName || "",
            shortDescription: data.shortDescription || "",
            longDescription: data.longDescription || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load hero data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHero();
  }, [form]);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("shortDescription", values.shortDescription);
      formData.append("longDescription", values.longDescription);
      // If there's a new file, append it. 
      // The API expects 'avatarFile' for the file object and 'avatar' for the data URL if no file is provided.
      // However, the API logic seems to prioritize 'avatarFile' if present, or uses 'avatar' string.
      // We'll send 'avatar' as the existing string if no new file is selected.
      
      if (avatarFile) {
        formData.append("avatarFile", avatarFile);
      } else {
        formData.append("avatar", values.avatar);
      }

      const response = await fetch("/api/hero", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update hero");
      }

      const { data } = await response.json();
      form.reset({
        avatar: data.avatar,
        fullName: data.fullName,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
      });
      setAvatarFile(null); // Clear the file input state
      toast.success("Hero section updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <div>Loading form...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <div className="flex items-center gap-4">
                {field.value && (
                  <Image
                    src={field.value}
                    alt="Avatar preview"
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full max-w-xs"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input placeholder="Full Stack Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
