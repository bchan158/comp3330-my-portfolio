import { NextResponse } from "next/server";
import { fetchProjects } from "@/lib/db";

export async function GET() {
  try {
    const projects = await fetchProjects();
    return NextResponse.json({ message: "Projects fetched", data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { message: "Error fetching projects", error: error.message, data: [] },
      { status: 500 }
    );
  }
}
