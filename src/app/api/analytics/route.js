import { NextResponse } from "next/server";
import { getRouteStats, recordRouteVisit } from "@/lib/db";

import { auth0 } from "@/lib/auth0";

export async function GET() {
  try {
    const session = await auth0.getSession();
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }
    const stats = await getRouteStats();
    return NextResponse.json({ message: "Stats fetched", data: stats });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching analytics stats:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { path } = await request.json();
    if (!path) {
      return NextResponse.json(
        { message: "Path is required" },
        { status: 400 }
      );
    }
    await recordRouteVisit(path);
    return NextResponse.json({ message: "Recorded" }, { status: 201 });
  } catch (error) {
    console.error("Error recording route visit:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
