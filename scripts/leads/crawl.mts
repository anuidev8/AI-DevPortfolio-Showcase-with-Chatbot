// Visits a business website (home + contact/about pages) and pulls
// published emails, socials and WhatsApp links.

export type SiteContacts = {
  emails: string[];
  instagram: string;
  facebook: string;
  whatsapp: string;
  error: string;
};

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const CONTACT_PATH = /contact|contacto|about|nosotros|quienes|team|equipo|location|ubicacion|book|citas|agenda/i;
const MAX_PAGES = 5;
const TIMEOUT_MS = 10_000;

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const IS_EMAIL = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

const JUNK_EMAIL =
  /\.(png|jpe?g|gif|svg|webp|avif|css|js)$|@(example|domain|email|yourdomain|sentry|wixpress|sentry-next\.wixpress|godaddy|squarespace|wordpress|mysite)\.|@company\.com$|^(you|name|user|your|yourname|email|test|noreply|no-reply)@/i;

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get("content-type") ?? "";
  if (!type.includes("html")) return "";
  return res.text();
}

// Cloudflare "email protection" hides addresses as hex in data-cfemail.
function decodeCfEmail(hex: string): string {
  const key = parseInt(hex.slice(0, 2), 16);
  let out = "";
  for (let i = 2; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  }
  return out;
}

function extractEmails(html: string): string[] {
  const found = new Set<string>();
  const text = html.replace(/&#64;|&#x40;|\[at\]|\(at\)/gi, "@");

  for (const m of text.matchAll(/mailto:([^"'?>\s]+)/gi)) found.add(decodeURIComponent(m[1]));
  for (const m of text.matchAll(EMAIL_RE)) found.add(m[0]);
  for (const m of html.matchAll(/data-cfemail="([0-9a-f]+)"/gi)) found.add(decodeCfEmail(m[1]));

  return [...found].map((e) => e.toLowerCase().trim()).filter((e) => !JUNK_EMAIL.test(e) && IS_EMAIL.test(e) && e.length < 80);
}

function firstMatch(html: string, re: RegExp): string {
  const m = html.match(re);
  return m ? m[0].replace(/["'<>\s].*$/, "") : "";
}

function contactLinks(html: string, base: URL): string[] {
  const links = new Set<string>();
  for (const m of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
    try {
      const url = new URL(m[1], base);
      if (url.hostname === base.hostname && CONTACT_PATH.test(url.pathname)) {
        url.hash = "";
        links.add(url.toString());
      }
    } catch {
      // ignore malformed hrefs
    }
  }
  return [...links];
}

// Rank emails on the business's own domain first.
function rankEmails(emails: string[], host: string): string[] {
  const domain = host.replace(/^www\./, "");
  const unique = [...new Set(emails)];
  // Page text like "Email info@x.com" can glue into "emailinfo@x.com" — keep the real one.
  return unique.filter((e) => !unique.some((other) => other !== e && e.endsWith(other))).sort((a, b) => Number(b.endsWith(domain)) - Number(a.endsWith(domain)));
}

export async function crawlSite(website: string): Promise<SiteContacts> {
  const result: SiteContacts = { emails: [], instagram: "", facebook: "", whatsapp: "", error: "" };
  if (!website) return result;

  let base: URL;
  try {
    base = new URL(website);
  } catch {
    result.error = "bad url";
    return result;
  }

  const queue = [base.toString()];
  const seen = new Set<string>();
  const emails: string[] = [];

  while (queue.length && seen.size < MAX_PAGES) {
    const url = queue.shift()!;
    if (seen.has(url)) continue;
    seen.add(url);

    let html: string;
    try {
      html = await fetchHtml(url);
    } catch (err) {
      if (seen.size === 1) result.error = (err as Error).message;
      continue;
    }

    emails.push(...extractEmails(html));
    result.instagram ||= firstMatch(html, /https?:\/\/(www\.)?instagram\.com\/[a-z0-9._]+/i);
    result.facebook ||= firstMatch(html, /https?:\/\/(www\.)?facebook\.com\/[a-z0-9.\-]+/i);
    result.whatsapp ||= firstMatch(html, /https?:\/\/(wa\.me\/\+?\d+|api\.whatsapp\.com\/send\?phone=\+?\d+)/i);

    if (seen.size === 1) queue.push(...contactLinks(html, base));
  }

  result.emails = rankEmails(emails, base.hostname);
  return result;
}
