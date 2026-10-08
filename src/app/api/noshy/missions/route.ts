import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ensureGameSchema, getProgress, memberExists } from "@/lib/noshy-game-db";
import { getMission } from "@/lib/noshy-game";

export const dynamic = "force-dynamic";

type MissionBody = {
  memberId?: number;
  missionId?: string;
  targetId?: number;
};

/** Complete a mission with the person it was done with. Also logs that person as met. */
export async function POST(request: Request) {
  let body: MissionBody;
  try {
    body = (await request.json()) as MissionBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const memberId = Number(body.memberId);
  const targetId = Number(body.targetId);
  const mission = getMission(body.missionId);
  if (!Number.isInteger(memberId) || !mission) {
    return NextResponse.json({ error: "memberId and a valid missionId are required" }, { status: 400 });
  }
  if (!Number.isInteger(targetId) || targetId === memberId) {
    return NextResponse.json({ error: "Pick the person you did this mission with." }, { status: 400 });
  }

  try {
    await ensureGameSchema();
    if (!(await memberExists(memberId)) || !(await memberExists(targetId))) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const inserted = await query(
      `INSERT INTO noshy_mission_done (member_id, mission_id, target_id) VALUES ($1, $2, $3)
       ON CONFLICT (member_id, mission_id) DO NOTHING`,
      [memberId, mission.id, targetId]
    );
    await query(
      `INSERT INTO noshy_meets (member_id, target_id, source) VALUES ($1, $2, 'mission')
       ON CONFLICT (member_id, target_id) DO NOTHING`,
      [memberId, targetId]
    );

    return NextResponse.json({
      ok: true,
      alreadyDone: inserted.rowCount === 0,
      xp: mission.xp,
      progress: await getProgress(memberId),
    });
  } catch (error) {
    console.error("noshy missions POST failed", error);
    return NextResponse.json({ error: "Failed to save mission" }, { status: 500 });
  }
}
