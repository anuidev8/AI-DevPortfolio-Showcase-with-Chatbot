import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type ConnectionBody = {
  memberId?: number;
  profileId?: string;
  action?: "connect" | "pass";
};

export async function POST(request: Request) {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS connections (
        id SERIAL PRIMARY KEY,
        member_id INT,
        profile_id TEXT,
        action TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
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

    const body = (await request.json()) as ConnectionBody;
    if (!body.profileId || (body.action !== "connect" && body.action !== "pass")) {
      return NextResponse.json({ error: "profileId and action are required" }, { status: 400 });
    }

    const result = await query<{ id: number }>(
      `INSERT INTO connections (member_id, profile_id, action) VALUES ($1, $2, $3) RETURNING id`,
      [body.memberId ?? null, body.profileId, body.action]
    );

    await query(
      `INSERT INTO join_events (event_type, payload) VALUES ($1, $2::jsonb)`,
      [
        body.action === "connect" ? "connection_made" : "connection_passed",
        JSON.stringify({ connectionId: result.rows[0].id, memberId: body.memberId ?? null, profileId: body.profileId }),
      ]
    );

    return NextResponse.json({ ok: true, id: result.rows[0].id });
  } catch (error) {
    console.error("connections POST failed", error);
    return NextResponse.json({ error: "Failed to save connection" }, { status: 500 });
  }
}
