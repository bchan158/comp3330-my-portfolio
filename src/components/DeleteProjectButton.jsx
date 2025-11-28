"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";

export default function DeleteProjectButton({ projectId }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const deleteHandle = async () => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.message || "Failed to delete project");
        return;
      }

      toast.success("Project deleted successfully");
      router.push("/projects");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting the project");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="p-4 rounded bg-red-500 hover:bg-red-800 text-white"
      disabled={isPending}
      onClick={() => startTransition(deleteHandle)}
    >
      {isPending ? "Deleting…" : "🗑️"}
    </Button>
  );
}

