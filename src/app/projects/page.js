import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createSlug } from "@/lib/utils";

export default async function AllPojects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`);
  const { projects } = await res.json();

  return (
    <div className="flex flex-col flex-wrap w-full items-center justify-center bg-stone-50 font-sans dark:bg-black my-4">
      {projects.map((project, index) => {
        const slug = createSlug(project.title);
        return (
          <Card
            key={index}
            className="flex flex-row flex-1 m-4 p-4 gap-2 hover:scale-105 transition-transform bg-stone-700"
          >
            {project.img ? (
              <Image
                width={300}
                height={300}
                src={project.img}
                alt={project.title}
                className="h-[300px] w-[300px] object-contain"
              />
            ) : (
              <Skeleton className="h-[300px] w-[300] rounded self-center" />
            )}
            <div className="flex flex-col justify-between">
              <h3 className="px-2 text-lg font-bold text-stone-50">
                {project.title}
              </h3>
              <p className="px-2 leading-relaxed h-12 text-sm text-stone">
                {project.link}
              </p>
              <Button variant="outline" className="m-2">
                <Link
                  href={`/projects/${createSlug(project.title)}`}
                  target="_blank"
                  rel="noopen"
                >
                  View Project
                </Link>
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
