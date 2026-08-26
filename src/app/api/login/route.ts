import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type LoginBody = {
  username?: string;
  memberId?: number;
};

function normalizeUsername(value?: string) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9._-]/g, "");
}

async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      display_name TEXT,
      role TEXT,
      contact TEXT,
      has_photo BOOLEAN DEFAULT FALSE,
      location_mode TEXT,
      intent_id TEXT,
      animal_id TEXT,
      business TEXT,
      looking_for TEXT,
      can_help TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`ALTER TABLE members ADD COLUMN IF NOT EXISTS username TEXT`);
  await query(`
    CREATE TABLE IF NOT EXISTS join_events (
      id SERIAL PRIMARY KEY,
      event_type TEXT,
      payload JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

function mapMember(m: {
  id: number;
  username: string | null;
  display_name: string | null;
  role: string | null;
  animal_id: string | null;
  business: string | null;
  looking_for: string | null;
  can_help: string | null;
}) {
  const name = m.display_name?.trim() || "Member";
  return {
    id: `member-${m.id}`,
    memberId: m.id,
    username: m.username?.trim() || undefined,
    name,
    role: m.role?.trim() || "Community member",
    animalId: m.animal_id ?? undefined,
    business: m.business ?? undefined,
    lookingFor: m.looking_for ?? undefined,
    canHelp: m.can_help ?? undefined,
    bio: m.business?.trim() || m.looking_for?.trim() || "",
    online: true,
    fromDatabase: true,
  };
}

export async function POST(request: Request) {
  try {
    await ensureSchema();
    const body = (await request.json()) as LoginBody;
    const username = normalizeUsername(body.username);
    const memberId = typeof body.memberId === "number" ? body.memberId : null;

    if (!username && memberId == null) {
      return NextResponse.json({ error: "Enter your username" }, { status: 400 });
    }

    const result =
      memberId != null
        ? await query<{
            id: number;
            username: string | null;
            display_name: string | null;
            role: string | null;
            animal_id: string | null;
            business: string | null;
            looking_for: string | null;
            can_help: string | null;
          }>(
            `SELECT id, username, display_name, role, animal_id, business, looking_for, can_help
             FROM members WHERE id = $1 LIMIT 1`,
            [memberId]
          )
        : await query<{
            id: number;
            username: string | null;
            display_name: string | null;
            role: string | null;
            animal_id: string | null;
            business: string | null;
            looking_for: string | null;
            can_help: string | null;
          }>(
            `SELECT id, username, display_name, role, animal_id, business, looking_for, can_help
             FROM members
             WHERE lower(trim(username)) = $1
             ORDER BY created_at DESC
             LIMIT 1`,
            [username]
          );

    if (!result.rows[0]) {
      return NextResponse.json(
        { error: "No profile found with that username. Start NoShy to register." },
        { status: 404 }
      );
    }

    const member = mapMember(result.rows[0]);

    await query(
      `INSERT INTO join_events (event_type, payload) VALUES ($1, $2::jsonb)`,
      ["member_login", JSON.stringify({ memberId: member.memberId, username: member.username })]
    ).catch(() => undefined);

    return NextResponse.json({ ok: true, memberId: member.memberId, member });
  } catch (error) {
    console.error("login POST failed", error);
    return NextResponse.json({ error: "Failed to find your profile" }, { status: 500 });
  }
}
