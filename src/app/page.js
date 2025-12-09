import MyNavBar from "@/components/MyNavBar";
import MyHero from "@/components/MyHero";
import ProjectPreviewCard from "@/components/ProjectPreviewCard";
import GitHubCalendar from "@/components/github-calendar";
import { auth0 } from "@/lib/auth0";
import SkillsVisualizer from "@/components/SkillsVisualizer";

export const revalidate = 0;

export default async function Home() {
  // Safely get session, handle errors gracefully
  let session = null;
  try {
    session = await auth0.getSession();
  } catch (error) {
    console.error("Error getting session:", error);
    // Continue without session
  }

  return (
    <>
      <MyHero />
      <SkillsVisualizer />
      <ProjectPreviewCard count={3} />
      <div className="max-w-4xl mx-auto">
        <GitHubCalendar username="bchan158" />
      </div>
    </>
  );
}
