import MyNavBar from "@/components/MyNavBar";
import MyHero from "@/components/MyHero";
import ProjectPreviewCard from "@/components/ProjectPreviewCard";
import GitHubCalendar from "@/components/github-calendar";
import { auth0 } from "@/lib/auth0";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import Profile from "@/components/Profile";

export const revalidate = 0;

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <>
      <MyHero />
      <ProjectPreviewCard count={3} />
      <div className="max-w-4xl mx-auto">
        <GitHubCalendar username="bchan158" />
      </div>
    </>
  );
}
