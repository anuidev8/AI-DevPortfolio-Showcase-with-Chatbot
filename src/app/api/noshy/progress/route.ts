import { NextResponse } from "next/server";
import { ensureGameSchema, getProgress } from "@/lib/noshy-game-db";

export const dynamic = "force-dynamic";

/** XP, connections, missions, and the leaderboard for one member (memberId=0 for leaderboard only). */
export async function GET(request: Request) {
  const memberId = Number(new URL(request.url).searchParams.get("memberId") ?? 0);
  if (!Number.isInteger(memberId) || memberId < 0) {
    return NextResponse.json({ error: "memberId is required" }, { status: 400 });
  }

  try {
    await ensureGameSchema();
    return NextResponse.json({ ok: true, progress: await getProgress(memberId) });
  } catch (error) {
    console.error("noshy progress GET failed", error);
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }
}
