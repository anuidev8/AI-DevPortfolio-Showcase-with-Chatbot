// Enterprise lead finder: companies that are hiring, scored against Angel's skills.
//
//   npm run leads:enterprise -- --source yc   [--limit 150] [--region us|remote]
//   npm run leads:enterprise -- --source hn   [--month "October 2026"] [--region us|remote]
//
// --region us     → US companies (default)
// --region remote → remote companies anywhere, labelled by time-zone fit for working from Colombia
//
// yc → YC company directory (open mirror at yc-oss.github.io), active companies hiring.
// hn → Hacker News "Ask HN: Who is hiring?" thread (official Algolia API); posts often include a founder email.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { crawlSite } from "./crawl.mts";

const OUTPUT_DIR = path.join(import.meta.dirname, "output");
const CONCURRENCY = 6;

// What Angel builds, and the words that signal a company needs it.
const FIT: { reason: string; re: RegExp; weight: number }[] = [
  { reason: "voice / phone", re: /\bvoice|phone calls?|call center|telephon|speech|livekit|twilio|\bivr\b|receptionist/i, weight: 3 },
  { reason: "AI agents / LLM", re: /\bagents?\b|agentic|\bllms?\b|genai|generative ai|chatbot|copilot|langchain|langgraph|rag\b/i, weight: 3 },
  { reason: "patients / clinics", re: /patient|clinic|dental|medical|healthcare|care team|provider/i, weight: 2 },
  { reason: "wellness / mental health", re: /wellness|mental health|meditat|sleep|breath|fitness|therapy/i, weight: 2 },
  { reason: "scheduling / booking", re: /schedul|booking|appointment|intake|front desk/i, weight: 2 },
  { reason: "customer support", re: /customer support|customer service|support team|helpdesk|ticket/i, weight: 2 },
  { reason: "education", re: /education|learning|students?|edtech|course|tutor/i, weight: 1 },
  { reason: "e-commerce", re: /e-?commerce|shopify|storefront|retail|marketplace/i, weight: 1 },
  { reason: "real estate", re: /real estate|property|leasing|tenants?|brokerage/i, weight: 1 },
  { reason: "Spanish / LatAm", re: /spanish|latam|latin america|hispanic|bilingual/i, weight: 2 },
  { reason: "your stack", re: /next\.?js|react native|nestjs|typescript|\breact\b|aws|postgres/i, weight: 1 },
];

const NON_US = /\b(CET|EU|Europe|Berlin|Germany|Freiburg|London|UK|Global|Worldwide|India|Canada only)\b/i;
const PLACEHOLDER_EMAIL = /^(you|name|first|firstname|your\.?name)@|@(company|example|domain)\./i;
const NO_OUTSIDERS = /no (agencies|contractors|consultants|outsourc)|not (working|work) with agencies/i;
const US_SIGNAL = {
  test: (s: string) =>
    /\b(US|USA|SF|NYC|LA)\b/.test(s) ||
    /\b(united states|remote|san francisco|bay area|new york|seattle|austin|boston|los angeles|chicago|miami|denver)\b/i.test(s),
};

// Time-zone fit for working from Colombia (UTC-5).
const SCOPES: { scope: string; re: RegExp; tzFit: number }[] = [
  { scope: "Worldwide", re: /worldwide|anywhere|global/i, tzFit: 3 },
  { scope: "Americas / LatAm", re: /latam|latin america|americas|south america|colombia|mexico|brazil/i, tzFit: 3 },
  { scope: "US time zones", re: /\b(US|USA|EST|PST|CST|ET|PT)\b|united states|eastern|pacific|central time|north america/i, tzFit: 2 },
  { scope: "Europe (~4h overlap)", re: /europe|\bEU\b|\bCET\b|\bUK\b|\bGMT\b|\bEMEA\b|germany|london|berlin|spain|portugal/i, tzFit: 1 },
  { scope: "Asia / Pacific", re: /india|\bAPAC\b|asia|\bIST\b|AEST|australia|singapore/i, tzFit: 0 },
];

function remoteScope(text: string): { scope: string; tzFit: number } {
  const hit = SCOPES.find((s) => s.re.test(text));
  return hit ? { scope: hit.scope, tzFit: hit.tzFit } : { scope: "Remote (unspecified)", tzFit: 2 };
}

const { values } = parseArgs({
  options: {
    source: { type: "string", default: "yc" },
    limit: { type: "string", default: "150" },
    month: { type: "string" },
    region: { type: "string", default: "us" },
    "no-crawl": { type: "boolean", default: false },
  },
});

type Lead = {
  company: string;
  website: string;
  summary: string;
  industry: string;
  teamSize: string;
  location: string;
  remoteScope: string;
  tzFit: number;
  fitScore: number;
  fitReasons: string;
  email: string;
  otherEmails: string;
  hiringFor: string;
  source: string;
  sourceUrl: string;
  contactTip: string;
};

function scoreFit(text: string): { score: number; reasons: string[] } {
  const reasons = FIT.filter((f) => f.re.test(text));
  return { score: reasons.reduce((s, f) => s + f.weight, 0), reasons: reasons.map((f) => f.reason) };
}

function decodeHtml(s: string): string {
  return s
    .replace(/<p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x2F;/g, "/")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

// HN posters hide emails as "jobs [at] acme [dot] com".
function emailsIn(text: string): string[] {
  const t = text
    .replace(/\s*[\[(]\s*at\s*[\])]\s*|\s+at\s+(?=[a-z0-9-]+\s*[\[(]?\s*dot)/gi, "@")
    .replace(/\s*[\[(]\s*dot\s*[\])]\s*|\s+dot\s+(?=[a-z]{2,}\b)/gi, ".");
  return [...new Set((t.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) ?? []).map((e) => e.toLowerCase()))];
}

async function fromYc(limit: number, remote: boolean): Promise<Lead[]> {
  const res = await fetch("https://yc-oss.github.io/api/companies/all.json");
  const all: any[] = await res.json();

  return all
    .filter((c) => {
      const regions: string[] = c.regions ?? [];
      const inRegion = remote
        ? regions.includes("Remote") || regions.includes("Fully Remote")
        : regions.includes("United States of America");
      return (
        c.status === "Active" &&
        c.isHiring &&
        inRegion &&
        c.team_size >= 5 &&
        c.team_size <= 300 &&
        c.website
      );
    })
    .map((c) => {
      const text = `${c.one_liner} ${c.long_description} ${(c.tags ?? []).join(" ")} ${c.industry} ${c.subindustry}`;
      const { score, reasons } = scoreFit(text);
      const regions = (c.regions ?? []).filter((r: string) => !/remote/i.test(r)).join(", ");
      const { scope, tzFit } = remoteScope(regions);
      return {
        company: c.name,
        website: c.website,
        summary: c.one_liner ?? "",
        industry: c.subindustry || c.industry || "",
        teamSize: String(c.team_size ?? ""),
        location: c.all_locations ?? "",
        remoteScope: remote ? scope : "",
        tzFit: remote ? tzFit : 2,
        fitScore: score,
        fitReasons: reasons.join(", "),
        email: "",
        otherEmails: "",
        hiringFor: "hiring (see YC jobs)",
        source: `YC ${c.batch ?? ""}`.trim(),
        sourceUrl: c.url ?? "",
        contactTip: "Founders are listed on the YC page — find the CTO/founder on LinkedIn",
      };
    })
    .filter((l) => l.fitScore >= 3 && l.tzFit > 0)
    .sort((a, b) => b.fitScore + b.tzFit - (a.fitScore + a.tzFit))
    .slice(0, limit);
}

async function fromHn(limit: number, remote: boolean, month?: string): Promise<Lead[]> {
  const q = encodeURIComponent(`Ask HN: Who is hiring?${month ? ` (${month})` : ""}`);
  const search = await fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story,author_whoishiring&query=${q}&hitsPerPage=5`);
  const story = (await search.json()).hits.find((h: any) => /who is hiring/i.test(h.title));
  if (!story) throw new Error("No 'Who is hiring?' thread found");
  console.log(`📌 ${story.title} (${story.num_comments} comments)`);

  const thread = await (await fetch(`https://hn.algolia.com/api/v1/items/${story.objectID}`)).json();
  const leads: Lead[] = [];

  for (const post of thread.children ?? []) {
    if (!post.text) continue;
    const text = decodeHtml(post.text);
    if (NO_OUTSIDERS.test(text)) continue;

    const header = text.split("\n")[0];
    let scope = { scope: "", tzFit: 2 };
    if (remote) {
      if (!/remote/i.test(header) || /no remote|remote:? no\b/i.test(header)) continue;
      scope = remoteScope(header);
      if (scope.tzFit === 0) continue;
    } else {
      if (!US_SIGNAL.test(header)) continue;
      // "Remote (CET ±2h)" or "Berlin / Remote" without a US mention isn't a US lead.
      if (NON_US.test(header) && !/\b(US|USA|NYC|SF)\b|united states|new york|san francisco/i.test(header)) continue;
    }

    const { score, reasons } = scoreFit(text);
    if (score < 3) continue;

    const parts = header.split("|").map((p) => p.trim());
    const url = text.match(/https?:\/\/[^\s)]+/)?.[0] ?? "";
    const emails = emailsIn(text).filter((e) => !PLACEHOLDER_EMAIL.test(e));

    leads.push({
      company: (parts[0] ?? "").replace(/\s*\(https?:[^)]*\)/, "").slice(0, 80),
      website: url,
      summary: text.replace(/\s+/g, " ").slice(0, 280),
      industry: "",
      teamSize: "",
      location: parts.filter((p) => US_SIGNAL.test(p) || /remote|onsite|hybrid/i.test(p)).join(" / ").slice(0, 80),
      remoteScope: scope.scope,
      tzFit: scope.tzFit,
      fitScore: score,
      fitReasons: reasons.join(", "),
      email: emails[0] ?? "",
      otherEmails: emails.slice(1, 3).join(" "),
      hiringFor: parts.slice(1).filter((p) => !US_SIGNAL.test(p) && !/remote|onsite|hybrid/i.test(p)).join(" | ").slice(0, 120),
      source: "HN Who is hiring",
      sourceUrl: `https://news.ycombinator.com/item?id=${post.id}`,
      contactTip: emails.length ? "Email in post — usually the founder or hiring manager" : "Reply on HN or apply link",
    });
  }

  return leads.sort((a, b) => b.fitScore + b.tzFit - (a.fitScore + a.tzFit)).slice(0, limit);
}

async function mapLimit<T>(items: T[], limit: number, fn: (item: T, i: number) => Promise<void>): Promise<void> {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        await fn(items[i], i);
      }
    }),
  );
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

async function main() {
  const limit = Number(values.limit);
  const source = values.source!;
  const remote = values.region === "remote";
  const leads = source === "hn" ? await fromHn(limit, remote, values.month) : await fromYc(limit, remote);
  console.log(`🎯 ${leads.length} companies match your skills`);

  if (!values["no-crawl"]) {
    let done = 0;
    await mapLimit(leads, CONCURRENCY, async (lead) => {
      if (!lead.email && lead.website) {
        const site = await crawlSite(lead.website);
        lead.email = site.emails[0] ?? "";
        lead.otherEmails = site.emails.slice(1, 3).join(" ");
      }
      process.stdout.write(`\r   crawled ${++done}/${leads.length}`);
    });
    console.log();
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  const file = path.join(OUTPUT_DIR, `enterprise-${source}-${remote ? "remote" : "us"}-${new Date().toISOString().slice(0, 10)}.csv`);
  await writeFile(file, toCsv(leads));

  const withEmail = leads.filter((l) => l.email).length;
  console.log(`
✅ ${leads.length} companies → ${path.relative(process.cwd(), file)}
   📧 ${withEmail} with an email
   🔝 Top 5: ${leads.slice(0, 5).map((l) => `${l.company} (${l.fitScore})`).join(", ")}
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
