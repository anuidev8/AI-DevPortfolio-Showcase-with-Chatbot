import { getNetworkingAnimal, type CommunityProfile } from "@/lib/community-data";

export type NoshyPerson = {
  id: string;
  name: string;
  role: string;
  animalId?: string;
  business: string;
  lookingFor: string;
  canHelp: string;
};

export type MatchBrief = {
  score: number;
  why: string;
  topics: string[];
  youHelpThem: string;
  theyHelpYou: string;
};

export type MatchPair = {
  left: CommunityProfile;
  right: CommunityProfile;
  brief: MatchBrief;
};

export function pairKey(leftId: string, rightId: string) {
  return [leftId, rightId].sort().join("::");
}

const STOP = new Set([
  "the", "and", "for", "with", "that", "this", "from", "your", "you",
  "are", "was", "have", "has", "can", "our", "their", "someone", "here",
  "want", "need", "looking", "help", "also", "into", "about", "more",
  "than", "just", "one",
]);

const NEED_HINTS = [
  { keys: ["ai", "automat", "workflow", "tool", "system"], offer: ["ai", "automat", "workflow", "tool", "system"] },
  { keys: ["market", "offer", "campaign", "lead", "client", "sales"], offer: ["market", "offer", "campaign", "lead", "client", "sales"] },
  { keys: ["video", "reel", "content", "edit", "photo", "design"], offer: ["video", "reel", "content", "edit", "photo", "design"] },
  { keys: ["spanish", "english", "bilingual", "language"], offer: ["spanish", "english", "bilingual", "language"] },
  { keys: ["airbnb", "host", "listing", "guest", "stay"], offer: ["airbnb", "host", "listing", "guest", "stay"] },
  { keys: ["mentor", "coach", "advice", "teach"], offer: ["mentor", "coach", "advice", "teach"] },
  { keys: ["partner", "intro", "network", "collab", "refer"], offer: ["partner", "intro", "network", "collab", "refer"] },
  { keys: ["cafe", "coffee", "food", "restaurant"], offer: ["cafe", "coffee", "food", "restaurant", "table"] },
];

function compact(text?: string) {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function tokens(text?: string) {
  return new Set(
    compact(text)
      .toLowerCase()
      .split(/[^a-z0-9áéíóúñü]+/i)
      .filter((word) => word.length > 2 && !STOP.has(word))
  );
}

function overlapCount(a: Set<string>, b: Set<string>) {
  let count = 0;
  for (const word of a) {
    if (b.has(word)) count += 1;
  }
  return count;
}

function haystack(parts: Array<string | undefined>) {
  return compact(parts.filter(Boolean).join(" ")).toLowerCase();
}

function coversNeed(need: string, offer: string) {
  const needBlob = need.toLowerCase();
  const offerBlob = offer.toLowerCase();
  return NEED_HINTS.some(
    (hint) =>
      hint.keys.some((key) => needBlob.includes(key)) &&
      hint.offer.some((key) => offerBlob.includes(key))
  );
}

function firstSentence(text: string | undefined, fallback: string) {
  const clean = compact(text);
  if (!clean) return fallback;
  const clipped = clean.split(/(?<=[.!?])\s/)[0] ?? clean;
  return clipped.length > 120 ? `${clipped.slice(0, 117).trim()}…` : clipped;
}

export function toNoshyPerson(profile: CommunityProfile): NoshyPerson {
  return {
    id: profile.id,
    name: profile.name,
    role: profile.role,
    animalId: profile.animalId,
    business: profile.business ?? profile.bio ?? "",
    lookingFor: profile.lookingFor ?? "",
    canHelp: profile.canHelp ?? "",
  };
}

export function buildMatchBrief(left: NoshyPerson, right: NoshyPerson): MatchBrief {
  const leftNeed = haystack([left.lookingFor, left.role]);
  const rightNeed = haystack([right.lookingFor, right.role]);
  const leftOffer = haystack([left.canHelp, left.business, left.role]);
  const rightOffer = haystack([right.canHelp, right.business, right.role]);

  const needOffer = overlapCount(tokens(left.lookingFor), tokens(`${right.business} ${right.canHelp}`));
  const offerNeed = overlapCount(tokens(right.lookingFor), tokens(`${left.business} ${left.canHelp}`));
  const businessOverlap = overlapCount(tokens(left.business), tokens(right.business));
  const theyCoverNeed = coversNeed(leftNeed, rightOffer) || needOffer > 0;
  const youCoverNeed = coversNeed(rightNeed, leftOffer) || offerNeed > 0;

  let score = 70 + needOffer * 6 + offerNeed * 6 + businessOverlap * 3;
  if (theyCoverNeed) score += 8;
  if (youCoverNeed) score += 8;
  if (left.role && right.role && left.role.toLowerCase() !== right.role.toLowerCase()) score += 2;
  score = Math.max(62, Math.min(98, score));

  const leftAnimal = getNetworkingAnimal(left.animalId);
  const rightAnimal = getNetworkingAnimal(right.animalId);
  const animalLine =
    leftAnimal && rightAnimal
      ? ` ${leftAnimal.emoji} ${leftAnimal.name} + ${rightAnimal.emoji} ${rightAnimal.name}.`
      : "";

  const why = [
    `${left.name} and ${right.name} should talk because their businesses fit.`,
    left.lookingFor
      ? ` ${left.name.split(" ")[0]} wants ${firstSentence(left.lookingFor, "a useful next step").replace(/\.$/, "")}.`
      : "",
    theyCoverNeed
      ? ` ${right.name.split(" ")[0]} can help: ${firstSentence(right.canHelp || right.business, "what they already do").replace(/\.$/, "")}.`
      : ` ${right.name.split(" ")[0]} runs ${firstSentence(right.business || right.role, right.role).replace(/\.$/, "")}.`,
    youCoverNeed
      ? ` ${left.name.split(" ")[0]} can return it: ${firstSentence(left.canHelp || left.business, "their offer").replace(/\.$/, "")}.`
      : "",
    animalLine,
  ]
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  const topics = [
    `${right.name.split(" ")[0]}'s business: ${firstSentence(right.business, right.role)}`,
    `${left.name.split(" ")[0]} needs: ${firstSentence(left.lookingFor, "one specific next step")} — can ${right.name.split(" ")[0]} do it?`,
    `One next step before you leave: intro, date, or 15-minute follow-up. No small talk.`,
  ];

  return {
    score,
    why,
    topics,
    youHelpThem: firstSentence(
      left.canHelp || left.business,
      `${left.name.split(" ")[0]} shares one thing from their work this week`
    ),
    theyHelpYou: firstSentence(
      right.canHelp || right.business,
      `${right.name.split(" ")[0]} opens a door from their business`
    ),
  };
}

export function matchesFor(person: CommunityProfile, others: CommunityProfile[]): MatchPair[] {
  return others
    .filter((other) => other.id !== person.id)
    .map((other) => ({
      left: person,
      right: other,
      brief: buildMatchBrief(toNoshyPerson(person), toNoshyPerson(other)),
    }))
    .sort((a, b) => b.brief.score - a.brief.score);
}

export function rankPairs(people: CommunityProfile[]): MatchPair[] {
  const pairs: MatchPair[] = [];
  for (let i = 0; i < people.length; i += 1) {
    for (let j = i + 1; j < people.length; j += 1) {
      const left = people[i];
      const right = people[j];
      pairs.push({
        left,
        right,
        brief: buildMatchBrief(toNoshyPerson(left), toNoshyPerson(right)),
      });
    }
  }
  return pairs.sort((a, b) => b.brief.score - a.brief.score);
}
