import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cardCode, pickChallenge } from "@/lib/noshy-challenges";

export const dynamic = "force-dynamic";

const VISITOR_ID = /^[a-zA-Z0-9-]{8,64}$/;

async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS noshy_challenge_draws (
      id SERIAL PRIMARY KEY,
      code TEXT,
      visitor_id TEXT NOT NULL,
      challenge_id TEXT NOT NULL,
      source TEXT,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`
    ALTER TABLE noshy_challenge_draws
      ADD COLUMN IF NOT EXISTS code TEXT,
      ADD COLUMN IF NOT EXISTS name TEXT,
      ADD COLUMN IF NOT EXISTS role TEXT
  `);
}

function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return null;
  const clean = value.replace(/\s+/g, " ").trim().slice(0, max);
  return clean || null;
}

async function readBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

/** Generate a card: random challenge plus a random card ID, logged per visitor. */
export async function POST(request: Request) {
  const body = await readBody<{ visitorId?: string; source?: string; name?: string; role?: string }>(request);
  const visitorId = String(body?.visitorId ?? "");
  if (!VISITOR_ID.test(visitorId)) {
    return NextResponse.json({ error: "visitorId is required" }, { status: 400 });
  }
  const source = cleanText(body?.source, 32);
  const name = cleanText(body?.name, 40);
  const role = cleanText(body?.role, 48);
  const code = cardCode();

  try {
    await ensureSchema();
    const seen = await query<{ challenge_id: string }>(
      `SELECT challenge_id FROM noshy_challenge_draws WHERE visitor_id = $1 ORDER BY created_at`,
      [visitorId]
    );
    const challenge = pickChallenge(seen.rows.map((row) => row.challenge_id));
    const inserted = await query<{ id: number }>(
      `INSERT INTO noshy_challenge_draws (code, visitor_id, challenge_id, source, name, role)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [code, visitorId, challenge.id, source, name, role]
    );
    return NextResponse.json({ challengeId: challenge.id, drawId: inserted.rows[0].id, code });
  } catch (error) {
    // The card still works without the database; it just isn't tracked.
    console.error("noshy challenge POST failed", error);
    return NextResponse.json({ challengeId: pickChallenge([]).id, drawId: null, code });
  }
}

/** Mark a card as done ("I found them"). */
export async function PATCH(request: Request) {
  const body = await readBody<{ visitorId?: string; drawId?: number }>(request);
  const visitorId = String(body?.visitorId ?? "");
  const drawId = Number(body?.drawId);
  if (!VISITOR_ID.test(visitorId) || !Number.isInteger(drawId)) {
    return NextResponse.json({ error: "visitorId and drawId are required" }, { status: 400 });
  }

  try {
    await ensureSchema();
    const updated = await query(
      `UPDATE noshy_challenge_draws SET completed_at = COALESCE(completed_at, NOW()) WHERE id = $1 AND visitor_id = $2`,
      [drawId, visitorId]
    );
    if (updated.rowCount === 0) return NextResponse.json({ error: "Card not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("noshy challenge PATCH failed", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
