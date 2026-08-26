import { NextResponse } from "next/server";
import { isAdminAuthorized, updateSpeaker } from "@/lib/speakers";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = (await request.json()) as Partial<{
      name: string;
      role: string;
      imageUrl: string;
      accent: string;
      initials: string;
      sortOrder: number;
      enabled: boolean;
    }>;

    const speaker = await updateSpeaker(id, body);
    if (!speaker) {
      return NextResponse.json({ error: "Speaker not found" }, { status: 404 });
    }

    return NextResponse.json({ speaker });
  } catch (error) {
    console.error("speakers PATCH failed", error);
    return NextResponse.json({ error: "Failed to update speaker" }, { status: 500 });
  }
}
