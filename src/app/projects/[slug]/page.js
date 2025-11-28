import { createSlug } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProjects } from "@/lib/db";
import { auth0 } from "@/lib/auth0";
import EditProjectButton from "@/components/EditProjectButton";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import { Badge } from "@/components/ui/badge";

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const session = await auth0.getSession();
  const user = session?.user;

  const projects = await fetchProjects();
  const foundProject = projects.find((proj) => createSlug(proj.title) === slug);

  if (!foundProject) {
    notFound();
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl text-stone-200 bg-stone-600 p-4 rounded">
        {foundProject.title}
      </h1>
      {foundProject.image && (
        <Image
          width={300}
          height={300}
          src={foundProject.image}
          alt={foundProject.title}
          className="h-[300px] w-[300px] object-contain"
        />
      )}
      <div>{foundProject.description}</div>
      {foundProject.keywords && foundProject.keywords.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {foundProject.keywords.map((keyword, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-stone-700 text-stone-200"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      )}
      <Button variant="outline" className="m-2">
        <Link
          href={foundProject.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Project
        </Link>
      </Button>
      {user && (
        <div className="flex gap-2">
          <EditProjectButton projectId={foundProject.id} slug={slug} />
          <DeleteProjectButton projectId={foundProject.id} />
        </div>
      )}
    </div>
  );
}
