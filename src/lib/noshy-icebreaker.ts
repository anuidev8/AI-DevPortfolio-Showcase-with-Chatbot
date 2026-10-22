import { getNetworkingAnimal, type CommunityProfile } from "@/lib/community-data";

const first = (name: string) => name.trim().split(/\s+/)[0] || name;

function clean(text?: string) {
  return (text ?? "").replace(/\s+/g, " ").trim().replace(/[.!?]+$/, "");
}

function lowerFirst(text: string) {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

/** Stable hash so the same pair always starts on the same question card. */
function pairSeed(a: string, b: string) {
  const raw = [a, b].sort().join("::");
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  return hash;
}

/**
 * Icebreaker question cards for a scanned match.
 * Personal questions (from their 3 NoShy answers) come first, then universal ones.
 * Ask them out loud — the card is the permission to start.
 */
export function icebreakersFor(you: CommunityProfile, them: CommunityProfile): string[] {
  const name = first(them.name);
  const lookingFor = clean(them.lookingFor);
  const canHelp = clean(them.canHelp);
  const business = clean(them.business || them.bio);
  const yourAnimal = getNetworkingAnimal(you.animalId);
  const theirAnimal = getNetworkingAnimal(them.animalId);

  const questions: string[] = [];

  if (lookingFor) {
    questions.push(`“${name}, you're looking for ${lowerFirst(lookingFor)} — what would perfect help look like this week?”`);
  }
  if (business) {
    questions.push(`“Tell me about ${lowerFirst(business)} — who is it for, in one sentence?”`);
  }
  if (canHelp) {
    questions.push(`“You said you can help with ${lowerFirst(canHelp)} — how can someone here take you up on that tonight?”`);
  }
  if (yourAnimal && theirAnimal) {
    questions.push(
      yourAnimal.id === theirAnimal.id
        ? `“We both picked the ${theirAnimal.name} ${theirAnimal.emoji} — why did you pick it?”`
        : `“You picked the ${theirAnimal.name} ${theirAnimal.emoji}, I picked the ${yourAnimal.name} ${yourAnimal.emoji} — does yours fit how you meet people?”`
    );
  }

  questions.push(
    `“What's a problem you solve every day that I'd never see in my work?”`,
    `“What are you learning right now — and what surprised you most so far?”`,
    `“If I could introduce you to one person tonight, who would change your week?”`,
    `“What brought you here tonight — really?”`
  );

  return [...new Set(questions)];
}

/** Starting card for a pair (deterministic), then `offset` shuffles forward. */
export function icebreakerAt(you: CommunityProfile, them: CommunityProfile, offset: number) {
  const all = icebreakersFor(you, them);
  const start = pairSeed(you.id, them.id) % all.length;
  return all[(start + offset) % all.length];
}
