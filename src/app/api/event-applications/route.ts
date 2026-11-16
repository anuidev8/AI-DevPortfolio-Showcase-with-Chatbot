import { NextResponse } from "next/server";
import {
  createEventApplication,
  listEventApplications,
  validateApplication,
  type ApplicationKind,
  type DeckType,
  type EventApplicationInput,
} from "@/lib/event-applications";
import { isAdminAuthorized } from "@/lib/speakers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const kind = searchParams.get("kind") as ApplicationKind | null;
    const applications = await listEventApplications(kind ?? undefined);
    return NextResponse.json({ applications });
  } catch (error) {
    console.error("event-applications GET failed", error);
    return NextResponse.json({ error: "Failed to load applications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<EventApplicationInput>;

    const kind = body.kind;
    if (kind !== "thursday_speaker" && kind !== "saturday_session") {
      return NextResponse.json({ error: "Invalid application kind" }, { status: 400 });
    }

    const deckType = (body.deckType || "google_slides") as DeckType;
    const input: EventApplicationInput = {
      kind,
      name: body.name ?? "",
      profile: body.profile ?? "",
      instagram: body.instagram,
      linkedin: body.linkedin,
      github: body.github,
      sessionTitle: body.sessionTitle ?? "",
      sessionDescription: body.sessionDescription ?? "",
      deckType,
      deckUrl: body.deckUrl ?? "",
      videoProposalUrl: body.videoProposalUrl,
      examples: body.examples,
      email: body.email,
      phone: body.phone,
    };

    const error = validateApplication(input);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const created = await createEventApplication(input);
    return NextResponse.json({ ok: true, ...created }, { status: 201 });
  } catch (error) {
    console.error("event-applications POST failed", error);
    const message = error instanceof Error ? error.message : "Failed to save application";
    const status = message.includes("DATABASE_URL") ? 503 : 500;
    return NextResponse.json(
      {
        error:
          status === 503
            ? "Registration is temporarily unavailable. Try again later or message Visible Builders."
            : "Failed to save application",
      },
      { status }
    );
  }
}
