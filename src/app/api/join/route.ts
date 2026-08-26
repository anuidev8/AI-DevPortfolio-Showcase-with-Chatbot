import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type JoinBody = {
  username?: string;
  displayName?: string;
  role?: string;
  contact?: string;
  hasPhoto?: boolean;
  skills?: string[];
  intentId?: string;
  locationMode?: string;
  animalId?: string;
  business?: string;
  lookingFor?: string;
  canHelp?: string;
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
  await query(`CREATE TABLE IF NOT EXISTS skills (name TEXT PRIMARY KEY)`);
  await query(`
    CREATE TABLE IF NOT EXISTS member_skills (
      member_id INT REFERENCES members(id),
      skill TEXT,
      PRIMARY KEY (member_id, skill)
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS join_events (
      id SERIAL PRIMARY KEY,
      event_type TEXT,
      payload JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function POST(request: Request) {
  try {
    await ensureSchema();

    const body = (await request.json()) as JoinBody;
    const username = normalizeUsername(body.username);
    const displayName = body.displayName?.trim();
    const role = body.role?.trim();
    const animalId = body.animalId?.trim();
    const business = body.business?.trim();
    const lookingFor = body.lookingFor?.trim();
    const canHelp = body.canHelp?.trim();
    const skills = Array.isArray(body.skills)
      ? body.skills.filter((s) => typeof s === "string" && s.trim())
      : [];

    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: "Create a username (at least 3 characters). Letters, numbers, . _ - only." },
        { status: 400 }
      );
    }
    if (!displayName) return NextResponse.json({ error: "Your name is required" }, { status: 400 });
    if (!role) return NextResponse.json({ error: "Your role is required" }, { status: 400 });
    if (!animalId) return NextResponse.json({ error: "Pick an animal avatar" }, { status: 400 });
    if (!business || !lookingFor || !canHelp) {
      return NextResponse.json({ error: "Answer all 3 questions" }, { status: 400 });
    }

    const taken = await query<{ id: number }>(
      `SELECT id FROM members WHERE lower(trim(username)) = $1 LIMIT 1`,
      [username]
    );
    if (taken.rows[0]) {
      return NextResponse.json(
        { error: "That username is already registered. Create another username." },
        { status: 409 }
      );
    }

    const member = await query<{ id: number }>(
      `INSERT INTO members (username, display_name, role, contact, has_photo, location_mode, intent_id, animal_id, business, looking_for, can_help)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id`,
      [
        username,
        displayName,
        role,
        body.contact?.trim() || null,
        Boolean(body.hasPhoto),
        body.locationMode || null,
        body.intentId || null,
        animalId,
        business,
        lookingFor,
        canHelp,
      ]
    );

    const memberId = member.rows[0].id;

    for (const skill of skills) {
      await query(`INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`, [skill]);
      await query(
        `INSERT INTO member_skills (member_id, skill) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [memberId, skill]
      );
    }

    await query(
      `INSERT INTO join_events (event_type, payload) VALUES ($1, $2::jsonb)`,
      [
        "member_joined",
        JSON.stringify({ memberId, username, displayName, role, skills, animalId, business, lookingFor, canHelp }),
      ]
    );

    return NextResponse.json({
      ok: true,
      memberId,
      member: {
        id: `member-${memberId}`,
        memberId,
        username,
        name: displayName,
        role,
        animalId,
        business,
        lookingFor,
        canHelp,
        skills,
      },
    });
  } catch (error) {
    console.error("join POST failed", error);
    return NextResponse.json({ error: "Failed to save join profile" }, { status: 500 });
  }
}
