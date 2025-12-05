import { createSlug } from "@/lib/utils";
import { fetchProjects } from "@/lib/db";
import EditProjectForm from "@/components/EditProjectForm";
import { notFound } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }) {
  const { slug } = await params;
  
  // Check if user is logged in
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect("/api/auth/login");
  }

  // Fetch all projects and find by slug
  const projects = await fetchProjects();
  const foundProject = projects.find(
    (proj) => createSlug(proj.title) === slug
  );

  if (!foundProject) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 font-sans dark:bg-black p-4">
      <h1 className="text-3xl font-bold mb-6 text-stone-700 dark:text-stone-300">
        Edit Project
      </h1>
      <EditProjectForm project={foundProject} projectId={foundProject.id} slug={slug} />
    </div>
  );
}

