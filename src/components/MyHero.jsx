import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function MyHero() {
  return (
    <Card className="h-max m-3">
      <CardContent className="flex items-center justify-start flex-col md:flex-row gap-4">
        <Image
          src="/profile_image.png"
          alt="Profile image"
          width={300}
          height={300}
          className="rounded-md"
        ></Image>
        <p className="text-center md:text-left">
          Ben is an aspiring full-stack developer currently learning how to
          build modern web applications with Next.js. Passionate about coding
          and problem-solving, he’s exploring how frontend and backend
          technologies come together to create seamless user experiences.
          Through his full-stack course, Ben is gaining hands-on experience with
          React, APIs, and database integration — building the foundation for a
          future in web development.
        </p>
      </CardContent>
    </Card>
  );
}
