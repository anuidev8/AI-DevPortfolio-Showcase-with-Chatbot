import { NextResponse } from "next/server";
import { getPool, query } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/speakers";

export const dynamic = "force-dynamic";

type DeleteBody = {
  memberId?: number;
  username?: string;
};

export async function DELETE(request: Request) {
  let body: DeleteBody;
  try {
    body = (await request.json()) as DeleteBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const memberId = typeof body.memberId === "number" && Number.isInteger(body.memberId) ? body.memberId : null;
  if (memberId == null) {
    return NextResponse.json({ error: "memberId is required" }, { status: 400 });
  }

  const isAdmin = isAdminAuthorized(request);
  const username = (body.username ?? "").trim().toLowerCase();
  if (!isAdmin && !username) {
    return NextResponse.json({ error: "Username is required to delete your profile" }, { status: 401 });
  }

  try {
    await query(`CREATE TABLE IF NOT EXISTS connections (id SERIAL PRIMARY KEY, member_id INT, profile_id TEXT, action TEXT, created_at TIMESTAMPTZ DEFAULT NOW())`);
    await query(`CREATE TABLE IF NOT EXISTS join_events (id SERIAL PRIMARY KEY, event_type TEXT, payload JSONB, created_at TIMESTAMPTZ DEFAULT NOW())`);
    await query(`CREATE TABLE IF NOT EXISTS member_skills (member_id INT REFERENCES members(id), skill TEXT, PRIMARY KEY (member_id, skill))`);
  } catch (error) {
    console.error("members DELETE schema check failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const client = await getPool().connect();
  try {
    await client.query("BEGIN");

    const found = await client.query<{ id: number; username: string | null; display_name: string | null }>(
      `SELECT id, username, display_name FROM members WHERE id = $1 FOR UPDATE`,
      [memberId]
    );
    const member = found.rows[0];
    if (!member) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    if (!isAdmin && (member.username ?? "").trim().toLowerCase() !== username) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Username does not match this profile" }, { status: 403 });
    }

    await client.query(`DELETE FROM member_skills WHERE member_id = $1`, [memberId]);
    const connections = await client.query(
      `DELETE FROM connections WHERE member_id = $1 OR profile_id = $2`,
      [memberId, `member-${memberId}`]
    );
    await client.query(`DELETE FROM members WHERE id = $1`, [memberId]);
    await client.query(
      `INSERT INTO join_events (event_type, payload) VALUES ($1, $2::jsonb)`,
      [
        "member_deleted",
        JSON.stringify({ memberId, username: member.username, by: isAdmin ? "admin" : "self", connectionsRemoved: connections.rowCount }),
      ]
    );

    await client.query("COMMIT");
    return NextResponse.json({ ok: true, memberId });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    console.error("members DELETE failed", error);
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  } finally {
    client.release();
  }
}

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
