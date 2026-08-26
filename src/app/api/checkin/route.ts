import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const EVENT = "ai-after-hours";

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS event_checkins (
      event_slug TEXT NOT NULL,
      guest_id TEXT NOT NULL,
      name TEXT,
      email TEXT,
      approval_status TEXT,
      checked_in BOOLEAN NOT NULL DEFAULT TRUE,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (event_slug, guest_id)
    )
  `);
}

export async function GET(request: Request) {
  try {
    await ensureTable();
    const event =
      new URL(request.url).searchParams.get("event")?.trim() || EVENT;

    const result = await query<{ guest_id: string }>(
      `SELECT guest_id FROM event_checkins
       WHERE event_slug = $1 AND checked_in = TRUE`,
      [event]
    );

    return NextResponse.json({
      event,
      checked: result.rows.map((r) => r.guest_id),
    });
  } catch (error) {
    console.error("checkin GET failed", error);
    return NextResponse.json(
      { error: "Failed to load check-ins" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const body = (await request.json()) as {
      event?: string;
      guestId?: string;
      checked?: boolean;
      name?: string;
      email?: string;
      status?: string;
    };

    const event = body.event?.trim() || EVENT;
    const guestId = body.guestId?.trim();
    if (!guestId) {
      return NextResponse.json({ error: "guestId required" }, { status: 400 });
    }

    const checked = body.checked !== false;

    if (checked) {
      await query(
        `INSERT INTO event_checkins
           (event_slug, guest_id, name, email, approval_status, checked_in, updated_at)
         VALUES ($1, $2, $3, $4, $5, TRUE, NOW())
         ON CONFLICT (event_slug, guest_id)
         DO UPDATE SET
           checked_in = TRUE,
           name = COALESCE(EXCLUDED.name, event_checkins.name),
           email = COALESCE(EXCLUDED.email, event_checkins.email),
           approval_status = COALESCE(EXCLUDED.approval_status, event_checkins.approval_status),
           updated_at = NOW()`,
        [
          event,
          guestId,
          body.name?.trim() || null,
          body.email?.trim() || null,
          body.status?.trim() || null,
        ]
      );
    } else {
      await query(
        `UPDATE event_checkins
         SET checked_in = FALSE, updated_at = NOW()
         WHERE event_slug = $1 AND guest_id = $2`,
        [event, guestId]
      );
    }

    return NextResponse.json({ ok: true, guestId, checked });
  } catch (error) {
    console.error("checkin POST failed", error);
    return NextResponse.json(
      { error: "Failed to save check-in" },
      { status: 500 }
    );
  }
}
