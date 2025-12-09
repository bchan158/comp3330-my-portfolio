import Link from "next/link";
import { fetchProjects } from "@/lib/db";
import { auth0 } from "@/lib/auth0";
import ProjectFilterList from "@/components/ProjectFilterList";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-col w-full items-center bg-stone-50 font-sans dark:bg-black my-4 px-2">
        <div className="w-full max-w-5xl space-y-4">
          <header className="flex justify-between items-end px-2">
            <div className="space-y-1">
              <p className="text-sm text-stone-500">Projects</p>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                Search and filter
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Filter by tags or search by title/description.
              </p>
            </div>
            {user && (
              <Button asChild>
                <Link href="/projects/new">New Project</Link>
              </Button>
            )}
          </header>
          <ProjectFilterList projects={projects} user={user} />
        </div>
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
