export type Workshop = {
  slug: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  dateIso: string;
  duration: string;
  location: string;
  /** Short audience/level line shown instead of a price. */
  level: string;
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
    slug: "build-ai-voice-agent-claude-elevenlabs",
    title: "Build Your AI Voice Agent with Claude + ElevenLabs",
    subtitle: "No-code workshop: custom AI voice, voice agent and a lead-capture landing page",
    dateLabel: "Saturday · Nov 28, 2026",
    dateIso: "2026-11-28",
    duration: "1:30–5:30 PM",
    location: "Private cowork · Medellín",
    level: "Beginner friendly · no code",
    status: "open",
    tags: ["Claude", "ElevenLabs", "Custom voice", "Voice agents", "Lead capture", "Content plan"],
    summary:
      "One afternoon, no code. Build a landing page that captures leads with Claude, create your own AI voice in ElevenLabs, and publish a voice assistant that answers your customers.",
    outcomes: [
      "A 30-day content plan",
      "A live landing page built with Claude",
      "Lead capture: form, WhatsApp, FAQ, booking",
      "Your custom AI voice in ElevenLabs",
      "A voice assistant embedded on your page",
      "A next-30-days action plan",
    ],
    agenda: [
      { t: "1:30", l: "Plan: audience, offer and a 30-day content plan" },
      { t: "2:30", l: "Build: landing page with Claude, with form, WhatsApp and booking" },
      { t: "3:15", l: "Break" },
      { t: "3:30", l: "Voice: custom brand voice and a voice assistant on your page" },
      { t: "4:50", l: "Ship: publish, demo and action plan" },
    ],
    bring: [
      "Laptop + charger, and headphones",
      "Claude and ElevenLabs accounts",
      "A 2-minute voice recording (script sent on WhatsApp)",
      "Your offer, 5–10 customer FAQs and your WhatsApp",
    ],
    href: "/workshops/build-ai-voice-agent-claude-elevenlabs",
    ctaLabel: "View workshop",
  },
];

export function getWorkshop(slug: string) {
  return workshops.find((w) => w.slug === slug);
}
