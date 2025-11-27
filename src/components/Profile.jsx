"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your Auth0 user information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name || "Profile"}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold">{user.name || user.nickname}</p>
            {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

