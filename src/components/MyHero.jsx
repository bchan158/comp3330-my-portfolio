import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { getHero } from "@/lib/db";

export default async function MyHero() {
  const hero = await getHero();

  // Fallback content if no hero data exists yet
  const avatarSrc = hero?.avatar || "/profile_image.png";
  const fullName = hero?.fullName || "Ben";
  const description = hero?.longDescription || 
    "Ben is an aspiring full-stack developer currently learning how to build modern web applications with Next.js. Passionate about coding and problem-solving, he's exploring how frontend and backend technologies come together to create seamless user experiences.";

  return (
    <Card className="h-max m-3">
      <CardContent className="flex items-center justify-start flex-col md:flex-row gap-4">
        <div className="flex flex-col items-center gap-2">
          <Image
            src={avatarSrc}
            alt={`${fullName}'s profile image`}
            width={300}
            height={300}
            className="rounded-md"
          />
          {hero?.shortDescription && (
            <p className="text-sm text-muted-foreground">{hero.shortDescription}</p>
          )}
        </div>
        <p className="text-center md:text-left">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
