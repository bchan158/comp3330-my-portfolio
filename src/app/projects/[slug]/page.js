import { createSlug } from "@/lib/utils";
import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`);
  const data = await res.json();

  const foundProject = data.projects.find(
    (proj) => createSlug(proj.title) === slug
  );

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl text-stone-200 bg-stone-600 p-4 rounded">
        {foundProject.title}
      </h1>
      <Image
        width={300}
        height={300}
        src={foundProject.img}
        alt={foundProject.title}
        className="h-[300px] w-[300px] object-contain"
      />
      <div>{foundProject.description}</div>
      <Button variant="outline" className="m-2">
        <Link href={`/projects/${createSlug} target="_blank" rel="noopen"`}>
          View Project
        </Link>
      </Button>
    </div>
  );
}
