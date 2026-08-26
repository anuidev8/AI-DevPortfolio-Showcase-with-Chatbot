import { NextResponse } from "next/server";
import {
  createSpeaker,
  isAdminAuthorized,
  listSpeakers,
} from "@/lib/speakers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "1";
    const includeDisabled = admin && isAdminAuthorized(request);

    const speakers = await listSpeakers({ includeDisabled });
    return NextResponse.json({ speakers });
  } catch (error) {
    console.error("speakers GET failed", error);
    return NextResponse.json({ error: "Failed to load speakers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      role?: string;
      imageUrl?: string;
      accent?: string;
      initials?: string;
      sortOrder?: number;
      enabled?: boolean;
    };

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const speaker = await createSpeaker({
      name: body.name,
      role: body.role,
      imageUrl: body.imageUrl,
      accent: body.accent,
      initials: body.initials,
      sortOrder: body.sortOrder,
      enabled: body.enabled,
    });

    return NextResponse.json({ speaker }, { status: 201 });
  } catch (error) {
    console.error("speakers POST failed", error);
    return NextResponse.json({ error: "Failed to create speaker" }, { status: 500 });
  }
}
