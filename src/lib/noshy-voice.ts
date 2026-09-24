import { NETWORKING_ANIMALS, NOSHY_QUESTIONS, getNetworkingAnimal } from "@/lib/community-data";
import type { MatchPair } from "@/lib/noshy-match";

export type VoiceField = "name" | "business" | "lookingFor" | "canHelp";

export type VoiceStep = {
  id: VoiceField;
  eyebrow: string;
  label: string;
  hint: string;
};

export type VoiceAnswers = Record<VoiceField, string> & {
  role: string;
  animalId: string;
};

export type VoicePhase = "intro" | "interview" | "matching" | "matches" | "confirmed";

export const EMPTY_ANSWERS: VoiceAnswers = {
  name: "",
  business: "",
  lookingFor: "",
  canHelp: "",
  role: "",
  animalId: "",
};

export const VOICE_STEPS: VoiceStep[] = [
  {
    id: "name",
    eyebrow: "Before we start",
    label: "What's your name?",
    hint: "The name people will see when we match you.",
  },
  ...NOSHY_QUESTIONS.map((q, i) => ({
    id: q.id as VoiceField,
    eyebrow: `Question ${i + 1} of ${NOSHY_QUESTIONS.length}`,
    label: q.label.replace(/^\d+\.\s*/, ""),
    hint: q.placeholder,
  })),
];

export const ANIMAL_IDS = NETWORKING_ANIMALS.map((a) => a.id);

const ANIMAL_HINTS: Array<{ id: (typeof ANIMAL_IDS)[number]; keys: string[] }> = [
  { id: "fox", keys: ["sales", "deal", "partner", "invest", "client", "lead"] },
  { id: "owl", keys: ["mentor", "coach", "advice", "consult", "teach", "legal"] },
  { id: "bee", keys: ["build", "develop", "code", "engineer", "ship", "app", "software"] },
  { id: "hummingbird", keys: ["design", "video", "content", "creative", "brand", "photo", "art"] },
  { id: "dolphin", keys: ["community", "event", "network", "intro", "connect"] },
  { id: "eagle", keys: ["strategy", "founder", "ceo", "vision", "scale", "product"] },
  { id: "lion", keys: ["lead", "agency", "manage", "host", "director"] },
  { id: "wolf", keys: ["team", "cofounder", "co-founder", "hire", "collab"] },
];

export function guessAnimal(answers: Pick<VoiceAnswers, "business" | "lookingFor" | "canHelp">) {
  const blob = `${answers.business} ${answers.canHelp} ${answers.lookingFor}`.toLowerCase();
  const hit = ANIMAL_HINTS.find((hint) => hint.keys.some((key) => blob.includes(key)));
  return hit?.id ?? ANIMAL_IDS[Math.floor(Math.random() * ANIMAL_IDS.length)];
}

export function guessRole(business: string) {
  const clean = business.replace(/\s+/g, " ").trim();
  if (!clean) return "Builder";
  const lower = clean.toLowerCase();
  if (/(founder|ceo|owner)/.test(lower)) return "Founder";
  if (/(develop|engineer|code|software)/.test(lower)) return "Developer";
  if (/(design|creative|brand)/.test(lower)) return "Designer";
  if (/(market|growth|content|social)/.test(lower)) return "Marketer";
  if (/(coach|mentor|consult)/.test(lower)) return "Consultant";
  return "Builder";
}

export function makeUsername(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 18);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slug || "guest"}.${suffix}`;
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

/** Trim to one short sentence that always ends in "." or "…". */
function clip(text: string | undefined, max = 110) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim().replace(/[.…]+$/, "");
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}…` : `${clean}.`;
}

export function motivationLines(pair: MatchPair) {
  const them = pair.right;
  const themFirst = firstName(them.name);
  const animal = getNetworkingAnimal(them.animalId);
  const [topic] = pair.brief.topics;

  return [
    animal
      ? `${themFirst} is the ${animal.emoji} ${animal.name} in the room. Go find them now.`
      : `${themFirst} is in the room right now. Go find them.`,
    topic ? `Open with this: ${clip(topic)}` : `Open with their business, not the weather.`,
    pair.left.lookingFor
      ? `Say your ask out loud: ${clip(pair.left.lookingFor, 90)}`
      : `Say what you need out loud. Clear asks get answers.`,
    pair.brief.youHelpThem
      ? `Offer first: ${clip(pair.brief.youHelpThem, 90)}`
      : `Offer one thing first. Generosity opens doors.`,
    `Five minutes. One next step before you leave. No small talk.`,
  ];
}
