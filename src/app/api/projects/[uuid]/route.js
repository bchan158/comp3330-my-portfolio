import { NextResponse } from "next/server";
import { z } from "zod";
import { auth0 } from "@/lib/auth0";
import { getProjectById, updateProject, deleteProject } from "@/lib/db";

const projectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: z.string().url().optional(),
  link: z.string().url().optional(),
  keywords: z.array(z.string()).optional(),
});

export async function GET(request, { params }) {
  const { uuid } = await params;
  const project = await getProjectById(uuid);
  
  if (!project) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  
  return NextResponse.json({ message: "Project fetched", data: project });
}

export async function PUT(request, { params }) {
  try {
    await auth0.requireSession();
    
    const { uuid } = await params;
    const body = projectSchema.parse(await request.json());
    const updated = await updateProject(uuid, body);
    
    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Project updated", data: updated });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid payload", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Update project error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await auth0.requireSession();
    
    const { uuid } = await params;
    const deleted = await deleteProject(uuid);
    
    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Project deleted", data: deleted });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Delete project error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

