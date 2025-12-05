import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSlug } from "@/lib/utils";
import { fetchProjects } from "@/lib/db";
import { auth0 } from "@/lib/auth0";
import EditProjectButton from "@/components/EditProjectButton";
import DeleteProjectButton from "@/components/DeleteProjectButton";

// Force dynamic rendering since we use cookies for authentication
export const dynamic = "force-dynamic";

export default async function AllPojects() {
  try {
    const session = await auth0.getSession();
    const user = session?.user;
    const projects = await fetchProjects();

    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return (
        <div className="flex flex-col flex-wrap w-full items-center justify-center bg-stone-50 font-sans dark:bg-black my-4 p-8">
          <p className="text-stone-700 dark:text-stone-300 text-lg">
            No projects found.
          </p>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
            Check the server console for database query details.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-wrap w-full items-center justify-center bg-stone-50 font-sans dark:bg-black my-4">
        {projects.map((project, index) => {
          const slug = createSlug(project.title);
          return (
            <Card
              key={index}
              className="flex flex-col sm:flex-row w-full max-w-lg m-2 sm:m-4 p-3 sm:p-4 gap-2 hover:scale-105 transition-transform bg-stone-700"
            >
              {project.img ? (
                <Image
                  width={300}
                  height={300}
                  src={project.img}
                  alt={project.title}
                  className="h-[200px] w-full sm:h-[300px] sm:w-[300px] object-contain"
                />
              ) : (
                <div className="h-[200px] w-full sm:h-[300px] sm:w-[300px] bg-stone-600 rounded flex items-center justify-center">
                  <span className="text-stone-400 text-sm">No Image</span>
                </div>
              )}
              <div className="flex flex-col justify-between">
                <h3 className="px-2 text-base sm:text-lg font-bold text-stone-50">
                  {project.title}
                </h3>
                <p className="px-2 leading-relaxed h-auto sm:h-12 text-sm text-stone">
                  {project.link}
                </p>
                <div className="flex flex-col gap-2 m-2">
                  <Button variant="outline">
                    <Link
                      href={`/projects/${createSlug(project.title)}`}
                      target="_blank"
                      rel="noopen"
                    >
                      View Project
                    </Link>
                  </Button>
                  {user && (
                    <div className="flex flex-wrap gap-2">
                      <EditProjectButton
                        projectId={project.id}
                        slug={createSlug(project.title)}
                      />
                      <DeleteProjectButton projectId={project.id} />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return (
      <div className="flex flex-col flex-wrap w-full items-center justify-center bg-stone-50 font-sans dark:bg-black my-4">
        <p className="text-stone-700 dark:text-stone-300">
          Error loading projects. Please try again later.
        </p>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
          {error.message}
        </p>
      </div>
    );
  }
}
