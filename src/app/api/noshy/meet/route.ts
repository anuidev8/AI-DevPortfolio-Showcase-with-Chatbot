import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ensureGameSchema, getProgress, memberExists } from "@/lib/noshy-game-db";
import type { MeetSource } from "@/lib/noshy-game";

export const dynamic = "force-dynamic";

type MeetBody = {
  memberId?: number;
  targetId?: number;
  source?: MeetSource;
  note?: string;
};

const SOURCES: MeetSource[] = ["scan", "voice", "manual", "mission"];

/** Log "I talked to this person". It becomes a confirmed connection when they log you back. */
export async function POST(request: Request) {
  let body: MeetBody;
  try {
    body = (await request.json()) as MeetBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const memberId = Number(body.memberId);
  const targetId = Number(body.targetId);
  if (!Number.isInteger(memberId) || !Number.isInteger(targetId)) {
    return NextResponse.json({ error: "memberId and targetId are required" }, { status: 400 });
  }
  if (memberId === targetId) {
    return NextResponse.json({ error: "That is your own card." }, { status: 400 });
  }

  const source = SOURCES.includes(body.source as MeetSource) ? body.source : "manual";
  const note = body.note?.replace(/\s+/g, " ").trim().slice(0, 280) || null;

  try {
    await ensureGameSchema();
    if (!(await memberExists(memberId)) || !(await memberExists(targetId))) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    await query(
      `INSERT INTO noshy_meets (member_id, target_id, source, note) VALUES ($1, $2, $3, $4)
       ON CONFLICT (member_id, target_id) DO UPDATE SET note = COALESCE(EXCLUDED.note, noshy_meets.note)`,
      [memberId, targetId, source, note]
    );

    const progress = await getProgress(memberId);
    const status = progress.connections.find((c) => c.memberId === targetId)?.status ?? "waiting";
    return NextResponse.json({ ok: true, status, progress });
  } catch (error) {
    console.error("noshy meet POST failed", error);
    return NextResponse.json({ error: "Failed to save connection" }, { status: 500 });
  }
}
