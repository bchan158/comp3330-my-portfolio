import { NextResponse } from "next/server";
import { z } from "zod";
import { auth0 } from "@/lib/auth0";
import { createPost, fetchPostsPaginated } from "@/lib/db";
import { createSlug } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(1),
  preview: z.string().min(1),
  content: z.string().min(1),
  author: z.string().optional(),
  slug: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 5);
    const data = await fetchPostsPaginated({ page, pageSize });
    return NextResponse.json({ message: "Posts fetched", data });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        message: "Error fetching posts",
        error: error.message,
        data: { items: [] },
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth0.getSession();
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }
    const payload = postSchema.parse(await request.json());
    const post = await createPost({
      ...payload,
      slug: payload.slug ? createSlug(payload.slug) : undefined,
    });
    return NextResponse.json(
      { message: "Post created", data: post },
      { status: 201 }
    );
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid payload", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
