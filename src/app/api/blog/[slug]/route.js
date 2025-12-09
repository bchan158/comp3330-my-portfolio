import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/db";

export async function GET(_request, { params }) {
  try {
    const post = await getPostBySlug(params.slug);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Post fetched", data: post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
