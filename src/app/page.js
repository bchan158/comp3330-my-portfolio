import MyNavBar from "@/components/MyNavBar";
import MyHero from "@/components/MyHero";
import ProjectPreviewCard from "@/components/ProjectPreviewCard";
import GitHubCalendar from "@/components/github-calendar";

export default function Home() {
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
