import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { auth0 } from "@/lib/auth0";

export default async function MyNavBar() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <div className="z-50 w-full sticky top-0 p-2 flex items-center justify-center bg-stone-50 font-sans dark:bg-black">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Resume</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink asChild>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">PDF</a>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/projects">Projects</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/contact">Contact</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              {user ? (
                /* eslint-disable-next-line @next/next/no-html-link-for-pages */
                <a href="/auth/logout">Log Out</a>
              ) : (
                /* eslint-disable-next-line @next/next/no-html-link-for-pages */
                <a href="/auth/login">Log In</a>
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
