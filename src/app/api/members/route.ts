import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    const members = await query<{
      id: number;
      username: string | null;
      display_name: string | null;
      role: string | null;
      has_photo: boolean;
      location_mode: string | null;
      intent_id: string | null;
      animal_id: string | null;
      business: string | null;
      looking_for: string | null;
      can_help: string | null;
      created_at: string;
    }>(
      `SELECT id, username, display_name, role, has_photo, location_mode, intent_id,
              animal_id, business, looking_for, can_help, created_at
       FROM members
       WHERE display_name IS NOT NULL AND trim(display_name) <> ''
       ORDER BY created_at DESC
       LIMIT 50`
    );

    const skills = await query<{ member_id: number; skill: string }>(
      `SELECT member_id, skill FROM member_skills`
    );

    const skillsByMember = new Map<number, string[]>();
    for (const row of skills.rows) {
      const list = skillsByMember.get(row.member_id) ?? [];
      list.push(row.skill);
      skillsByMember.set(row.member_id, list);
    }

    return NextResponse.json({
      members: members.rows.map((m) => {
        const name = m.display_name?.trim() || "Member";
        return {
          id: `member-${m.id}`,
          memberId: m.id,
          username: m.username ?? undefined,
          name,
          role: m.role?.trim() || "Community member",
          avatar: m.animal_id || name,
          location: "Medellín",
          skills: skillsByMember.get(m.id) ?? [],
          intent: m.intent_id ?? "",
          animalId: m.animal_id ?? undefined,
          business: m.business ?? undefined,
          lookingFor: m.looking_for ?? undefined,
          canHelp: m.can_help ?? undefined,
          bio: m.business?.trim() || m.looking_for?.trim() || "",
          online: true,
          fromDatabase: true,
        };
      }),
    });
  } catch (error) {
    console.error("members GET failed", error);
    return NextResponse.json({ error: "Failed to load members" }, { status: 500 });
  }
}
