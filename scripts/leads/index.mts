// Lead finder: Google Places → website crawl → email check → CSV for Instantly.
//
//   npm run leads -- --query "med spa" --city "Miami,Houston" --limit 60
//
// Needs GOOGLE_PLACES_API_KEY in .env.local.

import { promises as dns } from "node:dns";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { crawlSite } from "./crawl.mts";
import { searchPlaces, type Place } from "./places.mts";

const OUTPUT_DIR = path.join(import.meta.dirname, "output");
const CONCURRENCY = 6;

const PAIN_SIGNALS =
  /no one answer|nobody answer|never answer|didn'?t answer|don'?t answer|couldn'?t reach|can'?t reach|hard to reach|can'?t get through|couldn'?t get through|voicemail|never call(ed)? back|didn'?t call back|no call back|no contesta|nunca contesta|no responden|nunca responden|no respondieron|no devuelven|no me devolvieron|imposible comunicarse|dif[ií]cil comunicarse/i;

const GENERIC_INBOX =
  /^(info|contact|contacto|hello|hola|hi|admin|office|oficina|reception|recepcion|frontdesk|front\.desk|appointments?|citas|booking|bookings|reservas|ventas|sales|support|soporte|team|marketing|billing|care|clinic|clinica|mail|email|general|enquiries|inquiries)$/i;

try {
  process.loadEnvFile(".env.local");
} catch {
  // fine — key may come from the shell
}

const { values } = parseArgs({
  options: {
    query: { type: "string" },
    city: { type: "string" },
    limit: { type: "string", default: "60" },
    out: { type: "string" },
  },
});

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
if (!values.query || !values.city) {
  console.error('Usage: npm run leads -- --query "med spa" --city "Miami,Houston" [--limit 60] [--out name]');
  process.exit(1);
}
if (!apiKey) {
  console.error("Missing GOOGLE_PLACES_API_KEY in .env.local");
  process.exit(1);
}

type Lead = Place & {
  city: string;
  email: string;
  otherEmails: string;
  firstName: string;
  emailDomainOk: boolean;
  instagram: string;
  facebook: string;
  whatsapp: string;
  painSignal: string;
  crawlError: string;
};

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// "maria.lopez@" → "Maria"; generic inboxes stay blank.
function guessFirstName(email: string): string {
  const local = email.split("@")[0];
  if (GENERIC_INBOX.test(local)) return "";
  const m = local.match(/^([a-z]{3,15})[._-][a-z]{2,}$/i);
  if (!m || GENERIC_INBOX.test(m[1]) || /^(dr|dra)$/i.test(m[1])) return "";
  return m[1][0].toUpperCase() + m[1].slice(1).toLowerCase();
}

const mxCache = new Map<string, Promise<boolean>>();
function hasMx(email: string): Promise<boolean> {
  const domain = email.split("@")[1];
  if (!mxCache.has(domain)) {
    mxCache.set(
      domain,
      dns.resolveMx(domain).then((r) => r.length > 0, () => false),
    );
  }
  return mxCache.get(domain)!;
}

function painSnippet(reviews: string[]): string {
  for (const review of reviews) {
    const m = review.match(PAIN_SIGNALS);
    if (!m) continue;
    const start = Math.max(0, (m.index ?? 0) - 60);
    return review.slice(start, start + 160).replace(/\s+/g, " ").trim();
  }
  return "";
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i], i);
      }
    }),
  );
  return results;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n") + "\n";
}

async function enrich(place: Place, city: string): Promise<Lead> {
  const site = await crawlSite(place.website);
  const valid: string[] = [];
  for (const e of site.emails) if (await hasMx(e)) valid.push(e);
  const email = valid[0] ?? "";

  return {
    ...place,
    city,
    email,
    otherEmails: valid.slice(1, 4).join(" "),
    firstName: email ? guessFirstName(email) : "",
    emailDomainOk: valid.length > 0,
    instagram: site.instagram,
    facebook: site.facebook,
    whatsapp: site.whatsapp,
    painSignal: painSnippet(place.reviews),
    crawlError: site.error,
  };
}

async function main() {
  const cities = values.city!.split(",").map((c) => c.trim()).filter(Boolean);
  const limit = Number(values.limit);
  const seen = new Set<string>();
  const leads: Lead[] = [];

  for (const city of cities) {
    const textQuery = `${values.query} in ${city}`;
    process.stdout.write(`🔎 ${textQuery} … `);
    const places = (await searchPlaces(textQuery, limit, apiKey!)).filter((p) => !seen.has(p.placeId));
    places.forEach((p) => seen.add(p.placeId));
    console.log(`${places.length} places`);

    let done = 0;
    const enriched = await mapLimit(places, CONCURRENCY, async (p) => {
      const lead = await enrich(p, city);
      process.stdout.write(`\r   crawled ${++done}/${places.length}`);
      return lead;
    });
    console.log();
    leads.push(...enriched);
  }

  // One lead per email address (chains often share one inbox).
  const byEmail = new Set<string>();
  const withEmail = leads.filter((l) => l.email && !byEmail.has(l.email) && byEmail.add(l.email));
  const withoutEmail = leads.filter((l) => !l.email);

  const name = values.out ?? `${slugify(values.query!)}-${slugify(cities.join("-"))}-${new Date().toISOString().slice(0, 10)}`;
  await mkdir(OUTPUT_DIR, { recursive: true });

  const emailFile = path.join(OUTPUT_DIR, `${name}.csv`);
  const callFile = path.join(OUTPUT_DIR, `${name}-no-email.csv`);

  await writeFile(
    emailFile,
    toCsv(
      withEmail.map((l) => ({
        email: l.email,
        firstName: l.firstName,
        companyName: l.name,
        city: l.city,
        website: l.website,
        phone: l.phone,
        rating: l.rating,
        reviewCount: l.reviewCount,
        painSignal: l.painSignal,
        instagram: l.instagram,
        whatsapp: l.whatsapp,
        otherEmails: l.otherEmails,
        address: l.address,
        mapsUrl: l.mapsUrl,
      })),
    ),
  );

  await writeFile(
    callFile,
    toCsv(
      withoutEmail.map((l) => ({
        companyName: l.name,
        city: l.city,
        phone: l.phone,
        whatsapp: l.whatsapp,
        instagram: l.instagram,
        facebook: l.facebook,
        website: l.website,
        rating: l.rating,
        reviewCount: l.reviewCount,
        painSignal: l.painSignal,
        note: l.website ? l.crawlError || "no email on site" : "no website",
        mapsUrl: l.mapsUrl,
      })),
    ),
  );

  const withPain = leads.filter((l) => l.painSignal).length;
  console.log(`
✅ ${leads.length} businesses
   📧 ${withEmail.length} with email  → ${path.relative(process.cwd(), emailFile)}
   📞 ${withoutEmail.length} phone/WhatsApp only → ${path.relative(process.cwd(), callFile)}
   🔥 ${withPain} with "nobody answers" reviews (painSignal column)
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
