import { NextResponse } from "next/server";
import { z } from "zod";
import { auth0 } from "@/lib/auth0";
import { getHero, upsertHero } from "@/lib/db";
import image2uri, { extTypeMap } from "image2uri";
import fs from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

const heroSchema = z.object({
  avatar: z
    .string()
    .trim()
    .min(1)
    .refine((v) => v.startsWith("data:"), "Avatar must be a data URL"),
  fullName: z.string().trim().min(2).max(200),
  shortDescription: z.string().trim().min(2).max(120),
  longDescription: z.string().trim().min(10).max(5000),
});

export async function GET() {
  const hero = await getHero();
  return NextResponse.json({ data: hero });
}

export const PUT = auth0.withApiAuthRequired(async (request) => {
  const session = await auth0.getSession();
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "You must be logged in to edit the hero section" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const avatarFile = formData.get("avatarFile");
  const avatarFromForm = formData.get("avatar");
  const avatarDataUrl = await toDataUrl(avatarFile, avatarFromForm);

  const payload = heroSchema.parse({
    avatar: avatarDataUrl ?? "",
    fullName: formData.get("fullName") ?? "",
    shortDescription: formData.get("shortDescription") ?? "",
    longDescription: formData.get("longDescription") ?? "",
  });

  const hero = await upsertHero(payload);
  return NextResponse.json(
    { message: "Hero updated", data: hero },
    { status: 200 }
  );
});

async function toDataUrl(file, fallbackString) {
  const fallback =
    typeof fallbackString === "string" ? fallbackString.trim() : "";
  if (file && typeof file.arrayBuffer === "function") {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(file.name || "") || ".bin";
    const mime = extTypeMap[ext] ?? file.type ?? "application/octet-stream";
    const tmp = path.join(os.tmpdir(), `${randomUUID()}${ext}`);
    fs.writeFileSync(tmp, buffer);
    try {
      const uri = await image2uri(tmp, { ext });
      return uri.startsWith("data:") ? uri : `data:${mime};base64,${uri}`;
    } finally {
      fs.rmSync(tmp, { force: true });
    }
  }
  return fallback;
}
