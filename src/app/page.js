import MyNavBar from "@/components/MyNavBar";
import MyHero from "@/components/MyHero";
import ProjectPreviewCard from "@/components/ProjectPreviewCard";

export default function Home() {
  return (
    <>
      <MyHero />
      <ProjectPreviewCard count={3} />
    </>
  );
}
