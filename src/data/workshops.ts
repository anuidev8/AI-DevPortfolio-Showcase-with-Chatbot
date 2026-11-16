export type Workshop = {
  slug: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  dateIso: string;
  duration: string;
  location: string;
  price: string;
  status: "upcoming" | "open" | "past";
  tags: string[];
  summary: string;
  outcomes: string[];
  agenda: { t: string; l: string }[];
  bring: string[];
  href: string;
  ctaLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

/** Featured / listed workshops. First entry is the primary upcoming workshop. */
export const workshops: Workshop[] = [
  {
    slug: "build-with-cloud-ai",
    title: "Build with Cloud AI",
    subtitle: "Vercel, Lovable, MCPs + bonus ElevenLabs voice",
    dateLabel: "Saturday · Nov 28, 2026",
    dateIso: "2026-11-28",
    duration: "3–4 hours",
    location: "Private cowork · Medellín",
    price: "Free for Thursday attendees · USD 25 public",
    status: "open",
    tags: ["Vercel", "Lovable", "MCPs", "Connectors", "Design", "Workflows", "ElevenLabs"],
    summary:
      "Hands-on workshop: ship a website or custom app with cloud AI tools — Vercel, Lovable, connectors and MCPs. Plus a bonus session on ElevenLabs: add voice to your prototype.",
    outcomes: [
      "A live site or app URL on Vercel",
      "UI built faster with Lovable (or similar)",
      "At least one connector / MCP / workflow wired",
      "A clear idea → prototype → deploy path",
      "Bonus: first voice clip or agent stub with ElevenLabs",
    ],
    agenda: [
      { t: "0:00", l: "Welcome, outcome, accounts checklist" },
      { t: "0:20", l: "Scope your site or custom app" },
      { t: "0:50", l: "Build UI with Lovable / AI builder" },
      { t: "1:40", l: "Break" },
      { t: "1:55", l: "Connectors, MCPs & workflows" },
      { t: "2:35", l: "Deploy on Vercel + design polish" },
      { t: "3:05", l: "Bonus · ElevenLabs — add voice to your build" },
      { t: "3:30", l: "Demo circle + next steps" },
      { t: "3:55", l: "Close + resources pack" },
    ],
    bring: [
      "Laptop + charger",
      "GitHub account",
      "Vercel account",
      "Lovable (or chosen builder) account",
      "Optional: ElevenLabs account (for the bonus voice session)",
      "Optional: API keys for tools you want to connect",
    ],
    href: "/workshops/build-with-cloud-ai",
    ctaLabel: "View workshop",
    secondaryHref: "/workshop/visible-builders-build-weekend/register-saturday",
    secondaryLabel: "Propose a session",
  },
];

export function getWorkshop(slug: string) {
  return workshops.find((w) => w.slug === slug);
}
