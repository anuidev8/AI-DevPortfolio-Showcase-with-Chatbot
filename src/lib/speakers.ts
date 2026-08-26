import { query } from "@/lib/db";

export type EventSpeaker = {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  accent: string;
  initials: string;
  imageFit: "cover" | "contain";
  sortOrder: number;
  enabled: boolean;
  createdAt?: string;
};

export const FALLBACK_SPEAKERS: Omit<EventSpeaker, "id" | "enabled" | "sortOrder" | "createdAt">[] = [
  {
    name: "Erix Mendoza",
    role: "Android Engineer in Mercado Libre | GDG Medellín Lead",
    imageUrl: "/social/ai-after-hours/speakers/erix-mendoza.png",
    accent: "#ff007a",
    initials: "EM",
    imageFit: "cover",
  },
  {
    name: "Penelope Sloan Creative",
    role: "Creative Director, Brand Strategist and AI Consultant",
    imageUrl: "/social/ai-after-hours/speakers/penelope-sloan.png",
    accent: "#b44aff",
    initials: "PS",
    imageFit: "cover",
  },
  {
    name: "Leonel Meneses",
    role: "SHAKE-SOCIAL",
    imageUrl: "/social/ai-after-hours/speakers/leonel-meneses.png",
    accent: "#00f2ff",
    initials: "LM",
    imageFit: "contain",
  },
];

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export async function ensureSpeakersSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS event_speakers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      accent TEXT NOT NULL DEFAULT '#00f2ff',
      initials TEXT NOT NULL DEFAULT '',
      image_fit TEXT NOT NULL DEFAULT 'cover',
      sort_order INT NOT NULL DEFAULT 0,
      enabled BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`ALTER TABLE event_speakers ADD COLUMN IF NOT EXISTS image_fit TEXT NOT NULL DEFAULT 'cover'`);

  const count = await query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM event_speakers`);
  if (Number(count.rows[0]?.count ?? 0) === 0) {
    for (let i = 0; i < FALLBACK_SPEAKERS.length; i++) {
      const s = FALLBACK_SPEAKERS[i];
      await query(
        `INSERT INTO event_speakers (name, role, image_url, accent, initials, image_fit, sort_order, enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)`,
        [s.name, s.role, s.imageUrl, s.accent, s.initials, s.imageFit, i]
      );
    }
  } else {
    for (let i = 0; i < FALLBACK_SPEAKERS.length; i++) {
      const s = FALLBACK_SPEAKERS[i];
      const existing = await query<{ id: number }>(
        `SELECT id FROM event_speakers WHERE lower(trim(name)) = lower(trim($1)) LIMIT 1`,
        [s.name]
      );
      if (!existing.rows[0]) {
        const max = await query<{ max: number | null }>(`SELECT MAX(sort_order) AS max FROM event_speakers`);
        const sortOrder = (max.rows[0]?.max ?? -1) + 1;
        await query(
          `INSERT INTO event_speakers (name, role, image_url, accent, initials, image_fit, sort_order, enabled)
           VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)`,
          [s.name, s.role, s.imageUrl, s.accent, s.initials, s.imageFit, sortOrder]
        );
      } else {
        await query(
          `UPDATE event_speakers
           SET role = $2, image_url = $3, accent = $4, initials = $5, image_fit = $6, updated_at = NOW()
           WHERE id = $1`,
          [existing.rows[0].id, s.role, s.imageUrl, s.accent, s.initials, s.imageFit]
        );
      }
    }
  }
}

function mapRow(row: {
  id: number;
  name: string;
  role: string;
  image_url: string;
  accent: string;
  initials: string;
  image_fit?: string;
  sort_order: number;
  enabled: boolean;
  created_at?: string;
}): EventSpeaker {
  const fit = row.image_fit === "contain" ? "contain" : "cover";
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    imageUrl: row.image_url,
    accent: row.accent,
    initials: row.initials || initialsFromName(row.name),
    imageFit: fit,
    sortOrder: row.sort_order,
    enabled: row.enabled,
    createdAt: row.created_at,
  };
}

export async function listSpeakers(options?: { includeDisabled?: boolean }) {
  await ensureSpeakersSchema();
  const includeDisabled = options?.includeDisabled ?? false;
  const result = await query<{
    id: number;
    name: string;
    role: string;
    image_url: string;
    accent: string;
    initials: string;
    image_fit: string;
    sort_order: number;
    enabled: boolean;
    created_at: string;
  }>(
    includeDisabled
      ? `SELECT * FROM event_speakers ORDER BY sort_order ASC, id ASC`
      : `SELECT * FROM event_speakers WHERE enabled = TRUE ORDER BY sort_order ASC, id ASC`
  );
  return result.rows.map(mapRow);
}

export async function createSpeaker(input: {
  name: string;
  role?: string;
  imageUrl?: string;
  accent?: string;
  initials?: string;
  imageFit?: "cover" | "contain";
  sortOrder?: number;
  enabled?: boolean;
}) {
  await ensureSpeakersSchema();
  const name = input.name.trim();
  if (!name) throw new Error("Name is required");

  const max = await query<{ max: number | null }>(`SELECT MAX(sort_order) AS max FROM event_speakers`);
  const sortOrder = input.sortOrder ?? (max.rows[0]?.max ?? -1) + 1;
  const imageFit = input.imageFit === "contain" ? "contain" : "cover";

  const result = await query<{
    id: number;
    name: string;
    role: string;
    image_url: string;
    accent: string;
    initials: string;
    image_fit: string;
    sort_order: number;
    enabled: boolean;
    created_at: string;
  }>(
    `INSERT INTO event_speakers (name, role, image_url, accent, initials, image_fit, sort_order, enabled)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      name,
      (input.role ?? "").trim(),
      (input.imageUrl ?? "").trim(),
      (input.accent ?? "#00f2ff").trim() || "#00f2ff",
      (input.initials ?? initialsFromName(name)).trim() || initialsFromName(name),
      imageFit,
      sortOrder,
      input.enabled ?? true,
    ]
  );

  return mapRow(result.rows[0]);
}

export async function updateSpeaker(
  id: number,
  input: Partial<{
    name: string;
    role: string;
    imageUrl: string;
    accent: string;
    initials: string;
    imageFit: "cover" | "contain";
    sortOrder: number;
    enabled: boolean;
  }>
) {
  await ensureSpeakersSchema();
  const current = await query<{
    id: number;
    name: string;
    role: string;
    image_url: string;
    accent: string;
    initials: string;
    image_fit: string;
    sort_order: number;
    enabled: boolean;
    created_at: string;
  }>(`SELECT * FROM event_speakers WHERE id = $1`, [id]);

  if (!current.rows[0]) return null;

  const row = current.rows[0];
  const name = input.name !== undefined ? input.name.trim() : row.name;
  const role = input.role !== undefined ? input.role.trim() : row.role;
  const imageUrl = input.imageUrl !== undefined ? input.imageUrl.trim() : row.image_url;
  const accent = input.accent !== undefined ? input.accent.trim() || row.accent : row.accent;
  const initials =
    input.initials !== undefined
      ? input.initials.trim() || initialsFromName(name)
      : row.initials || initialsFromName(name);
  const imageFit =
    input.imageFit !== undefined
      ? input.imageFit === "contain"
        ? "contain"
        : "cover"
      : row.image_fit === "contain"
        ? "contain"
        : "cover";
  const sortOrder = input.sortOrder !== undefined ? input.sortOrder : row.sort_order;
  const enabled = input.enabled !== undefined ? input.enabled : row.enabled;

  const result = await query<{
    id: number;
    name: string;
    role: string;
    image_url: string;
    accent: string;
    initials: string;
    image_fit: string;
    sort_order: number;
    enabled: boolean;
    created_at: string;
  }>(
    `UPDATE event_speakers
     SET name = $2, role = $3, image_url = $4, accent = $5, initials = $6,
         image_fit = $7, sort_order = $8, enabled = $9, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, name, role, imageUrl, accent, initials, imageFit, sortOrder, enabled]
  );

  return mapRow(result.rows[0]);
}

export function isAdminAuthorized(request: Request) {
  const key = process.env.AI_AFTER_HOURS_ADMIN_KEY || process.env.ADMIN_SECRET || "";
  if (!key) return false;
  const header = request.headers.get("x-admin-key") || "";
  return header === key;
}
