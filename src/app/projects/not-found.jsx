"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  const params = useParams();
  const pathname = usePathname();
  // Try to get slug from params first, fallback to extracting from pathname
  const slug = params?.slug || pathname?.split("/projects/")[1];

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Project not found</CardTitle>
          <CardDescription>
            {slug 
              ? `The project "${slug}" doesn't exist or has been removed.`
              : "The project you're looking for doesn't exist or has been moved."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This might be a typo in the URL, or the project may have been removed. 
            Check out our other projects or return to the homepage.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/projects">View all projects</Link>
          </Button>
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

