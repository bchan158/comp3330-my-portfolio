import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditProjectButton({ projectId, slug }) {
  return (
    <Button variant="outline" className="p-4 rounded bg-yellow-500 hover:bg-yellow-800">
      <Link href={`/projects/${slug}/edit`}>
        ✏️
      </Link>
    </Button>
  );
}

