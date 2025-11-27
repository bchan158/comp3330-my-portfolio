import MyNavBar from "@/components/MyNavBar";
import MyHero from "@/components/MyHero";
import ProjectPreviewCard from "@/components/ProjectPreviewCard";
import GitHubCalendar from "@/components/github-calendar";
import { auth0 } from "@/lib/auth0";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import Profile from "@/components/Profile";

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

      {/* Auth0 Authentication Section */}
      {user && (
        <div className="mt-8 max-w-4xl mx-auto p-4">
          <div className="bg-card text-card-foreground rounded-lg border p-6">
            <p className="text-green-600 mb-4">✅ Successfully logged in!</p>
            <Profile />
            <div className="mt-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}

      {!user && (
        <div className="mt-8 max-w-4xl mx-auto p-4">
          <div className="bg-card text-card-foreground rounded-lg border p-6 text-center">
            <p className="mb-4">
              Welcome! Please log in to access your protected content.
            </p>
            <LoginButton />
          </div>
        </div>
      )}
    </>
  );
}
