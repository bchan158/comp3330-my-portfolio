import Link from "next/link";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProjects } from "@/lib/db";

export default async function ProjectPreviewCard({ count = 3 }) {
  let projects = [];
  try {
    projects = await fetchProjects();
  } catch (error) {
    console.error("Error fetching projects:", error);
    projects = [];
  }

  return (
    <div className="flex flex-row w-full justify-center flex-wrap items-center">
      {projects.slice(0, count).map((project, index) => (
        <Card
          key={index}
          className="border rounded-lg overflow-hidden shadow-lg m-4 w-80"
        >
          <CardContent className="flex flex-col items-center p-4">
            {/* You could replace the Skeleton with an actual image */}
            <Skeleton className="w-full h-[300px] bg-gray-300 mb-4" />
            <CardTitle className="text-lg font-semibold">
              {project.title}
            </CardTitle>
          </CardContent>

          <CardFooter className="flex flex-col items-center">
            <p className="text-gray-600 mb-4 text-center">{project.description}</p>
            <Link href={project.link} className="text-blue-500 hover:underline">
              Learn More
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
