import { NextResponse } from "next/server";
import { fetchProjects } from "@/lib/db";

export async function GET() {
  const projects = await fetchProjects();
  return NextResponse.json({ message: "Projects fetched", data: projects });
}
