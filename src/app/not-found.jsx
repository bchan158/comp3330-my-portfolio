import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound({ message }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Page not found</CardTitle>
          <CardDescription>
            {message ||
              "The page you're looking for doesn't exist or has been moved."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Don't worry, it happens to the best of us. Let's get you back on
            track.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
