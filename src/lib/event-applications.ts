import { query } from "@/lib/db";

export type ApplicationKind = "thursday_speaker" | "saturday_session";
export type DeckType = "google_slides" | "pdf" | "web";

export type EventApplicationInput = {
  kind: ApplicationKind;
  name: string;
  profile: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  sessionTitle: string;
  sessionDescription: string;
  deckType: DeckType;
  deckUrl: string;
  /** Saturday only */
  videoProposalUrl?: string;
  examples?: string;
  email?: string;
  phone?: string;
};

export type EventApplication = EventApplicationInput & {
  id: number;
  status: string;
  createdAt: string;
};

export async function ensureEventApplicationsSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS event_applications (
      id SERIAL PRIMARY KEY,
      kind TEXT NOT NULL,
      name TEXT NOT NULL,
      profile TEXT NOT NULL DEFAULT '',
      instagram TEXT,
      linkedin TEXT,
      github TEXT,
      session_title TEXT NOT NULL DEFAULT '',
      session_description TEXT NOT NULL DEFAULT '',
      deck_type TEXT NOT NULL DEFAULT 'google_slides',
      deck_url TEXT NOT NULL DEFAULT '',
      video_proposal_url TEXT,
      examples TEXT,
      email TEXT,
      phone TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`CREATE INDEX IF NOT EXISTS event_applications_kind_idx ON event_applications (kind)`);
  await query(`CREATE INDEX IF NOT EXISTS event_applications_created_idx ON event_applications (created_at DESC)`);
}

function trimOrNull(value?: string) {
  const v = value?.trim();
  return v ? v : null;
}

export function validateApplication(input: EventApplicationInput): string | null {
  if (!input.name?.trim()) return "Name is required";
  if (!input.profile?.trim()) return "Profile / bio is required";
  if (!input.sessionTitle?.trim()) return "Session title is required";
  if (!input.sessionDescription?.trim()) return "Session description is required";
  if (!input.deckUrl?.trim()) return "Deck / slides link is required";
  if (!["google_slides", "pdf", "web"].includes(input.deckType)) {
    return "Deck type must be Google Slides, PDF, or web link";
  }
  if (input.kind === "saturday_session" && !input.videoProposalUrl?.trim()) {
    return "Video proposal link is required for Saturday";
  }
  try {
    // eslint-disable-next-line no-new
    new URL(input.deckUrl.trim());
  } catch {
    return "Deck URL must be a valid link";
  }
  if (input.videoProposalUrl?.trim()) {
    try {
      // eslint-disable-next-line no-new
      new URL(input.videoProposalUrl.trim());
    } catch {
      return "Video proposal must be a valid link";
    }
  }
  return null;
}

export async function createEventApplication(input: EventApplicationInput) {
  await ensureEventApplicationsSchema();
  const result = await query<{ id: number; created_at: string }>(
    `INSERT INTO event_applications (
      kind, name, profile, instagram, linkedin, github,
      session_title, session_description, deck_type, deck_url,
      video_proposal_url, examples, email, phone
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING id, created_at`,
    [
      input.kind,
      input.name.trim(),
      input.profile.trim(),
      trimOrNull(input.instagram),
      trimOrNull(input.linkedin),
      trimOrNull(input.github),
      input.sessionTitle.trim(),
      input.sessionDescription.trim(),
      input.deckType,
      input.deckUrl.trim(),
      trimOrNull(input.videoProposalUrl),
      trimOrNull(input.examples),
      trimOrNull(input.email),
      trimOrNull(input.phone),
    ]
  );
  return {
    id: result.rows[0].id,
    createdAt: result.rows[0].created_at,
  };
}

export async function listEventApplications(kind?: ApplicationKind) {
  await ensureEventApplicationsSchema();
  const result = kind
    ? await query(
        `SELECT * FROM event_applications WHERE kind = $1 ORDER BY created_at DESC`,
        [kind]
      )
    : await query(`SELECT * FROM event_applications ORDER BY created_at DESC`);

  return result.rows.map((row) => ({
    id: row.id as number,
    kind: row.kind as ApplicationKind,
    name: row.name as string,
    profile: row.profile as string,
    instagram: row.instagram as string | null,
    linkedin: row.linkedin as string | null,
    github: row.github as string | null,
    sessionTitle: row.session_title as string,
    sessionDescription: row.session_description as string,
    deckType: row.deck_type as DeckType,
    deckUrl: row.deck_url as string,
    videoProposalUrl: row.video_proposal_url as string | null,
    examples: row.examples as string | null,
    email: row.email as string | null,
    phone: row.phone as string | null,
    status: row.status as string,
    createdAt: row.created_at as string,
  }));
}
