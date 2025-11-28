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
  const foundProject = projects.find(
    (proj) => createSlug(proj.title) === slug
  );

  if (!foundProject) {
    notFound();
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-stone-50 font-sans dark:bg-black p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl text-stone-200 bg-stone-600 p-4 rounded mb-4">
          {foundProject.title}
        </h1>
        {foundProject.image && (
          <Image
            width={600}
            height={600}
            src={foundProject.image}
            alt={foundProject.title}
            className="h-auto w-full max-w-2xl object-contain mb-4"
          />
        )}
        <div className="text-stone-700 dark:text-stone-300 mb-4 text-lg">
          {foundProject.description}
        </div>
        {foundProject.keywords && foundProject.keywords.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {foundProject.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="bg-stone-700 text-stone-200">
                {keyword}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="outline" className="m-2">
            <Link href={foundProject.link} target="_blank" rel="noopener noreferrer">
              View Project
            </Link>
          </Button>
          {user && (
            <>
              <EditProjectButton projectId={foundProject.id} slug={slug} />
              <DeleteProjectButton projectId={foundProject.id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
