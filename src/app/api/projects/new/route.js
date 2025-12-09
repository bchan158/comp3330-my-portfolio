import { NextResponse } from "next/server";
import { z } from "zod";
import { auth0 } from "@/lib/auth0";
import { insertProject } from "@/lib/db";

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url(),
  link: z.string().url(),
  keywords: z.array(z.string()).optional().default([]),
});

export async function POST(request) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Try to parse as JSON first, fallback to FormData
    let body;
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      const keywordsFromForm = formData.getAll("keywords[]");
      const keywordsString = formData.get("keywords");
      
      let keywords = [];
      if (keywordsFromForm.length > 0) {
        keywords = Array.from(keywordsFromForm);
      } else if (keywordsString) {
        try {
          keywords = JSON.parse(keywordsString);
        } catch {
          keywords = [];
        }
      }
      
      body = {
        title: formData.get("title") ?? "",
        description: formData.get("description") ?? "",
        image: formData.get("image") ?? formData.get("img") ?? "",
        link: formData.get("link") ?? "",
        keywords: keywords,
      };
    }

    const payload = projectSchema.parse(body);
    const project = await insertProject(payload);
    
    return NextResponse.json(
      { message: "Project created", data: project },
      { status: 201 }
    );
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
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
