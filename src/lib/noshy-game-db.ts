import { query } from "@/lib/db";
import {
  CONNECTION_XP,
  getMission,
  type GameConnection,
  type GameProgress,
  type LeaderboardRow,
} from "@/lib/noshy-game";

const LEADERBOARD_SIZE = 10;

export async function ensureGameSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS noshy_meets (
      id SERIAL PRIMARY KEY,
      member_id INT NOT NULL,
      target_id INT NOT NULL,
      source TEXT,
      note TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (member_id, target_id)
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS noshy_mission_done (
      id SERIAL PRIMARY KEY,
      member_id INT NOT NULL,
      mission_id TEXT NOT NULL,
      target_id INT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (member_id, mission_id)
    )
  `);
}

export async function memberExists(memberId: number) {
  const found = await query<{ id: number }>(`SELECT id FROM members WHERE id = $1 LIMIT 1`, [memberId]);
  return Boolean(found.rows[0]);
}

/** XP is derived, never stored: mutual connections plus completed missions. */
export async function getProgress(memberId: number): Promise<GameProgress> {
  const [meets, missions, members] = await Promise.all([
    query<{ member_id: number; target_id: number; note: string | null; created_at: string }>(
      `SELECT member_id, target_id, note, created_at FROM noshy_meets ORDER BY created_at DESC`
    ),
    query<{ member_id: number; mission_id: string; target_id: number | null }>(
      `SELECT member_id, mission_id, target_id FROM noshy_mission_done ORDER BY created_at`
    ),
    query<{ id: number; display_name: string | null; animal_id: string | null }>(
      `SELECT id, display_name, animal_id FROM members WHERE display_name IS NOT NULL AND trim(display_name) <> ''`
    ),
  ]);

  const logged = new Set(meets.rows.map((row) => `${row.member_id}:${row.target_id}`));
  const rows = new Map<number, LeaderboardRow>();
  for (const member of members.rows) {
    rows.set(member.id, {
      memberId: member.id,
      name: member.display_name?.trim() || "Member",
      animalId: member.animal_id ?? undefined,
      xp: 0,
      connections: 0,
      missions: 0,
    });
  }

  const connections: GameConnection[] = [];
  const incoming: number[] = [];
  for (const row of meets.rows) {
    const mutual = logged.has(`${row.target_id}:${row.member_id}`);
    const entry = rows.get(row.member_id);
    if (mutual && entry && rows.has(row.target_id)) {
      entry.connections += 1;
      entry.xp += CONNECTION_XP;
    }
    if (row.member_id === memberId && rows.has(row.target_id)) {
      connections.push({
        memberId: row.target_id,
        status: mutual ? "confirmed" : "waiting",
        note: row.note ?? undefined,
        at: row.created_at,
      });
    }
    if (row.target_id === memberId && !mutual && rows.has(row.member_id)) incoming.push(row.member_id);
  }

  const mine: GameProgress["missions"] = [];
  for (const row of missions.rows) {
    const mission = getMission(row.mission_id);
    if (!mission) continue;
    const entry = rows.get(row.member_id);
    if (entry) {
      entry.missions += 1;
      entry.xp += mission.xp;
    }
    if (row.member_id === memberId) mine.push({ id: mission.id, targetId: row.target_id });
  }

  const ranked = [...rows.values()].filter((row) => row.xp > 0).sort((a, b) => b.xp - a.xp || a.memberId - b.memberId);
  const rank = ranked.findIndex((row) => row.memberId === memberId);

  return {
    xp: rows.get(memberId)?.xp ?? 0,
    connections,
    incoming,
    missions: mine,
    leaderboard: ranked.slice(0, LEADERBOARD_SIZE),
    rank: rank === -1 ? null : rank + 1,
  };
}
