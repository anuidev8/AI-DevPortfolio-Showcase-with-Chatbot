export type Challenge = {
  id: string;
  title: string;
  /** Words of the title that stay white before the blue accent. */
  split: number;
  hint: string;
  xp: number;
};

export const CHALLENGES: Challenge[] = [
  { id: "outside-industry", title: "Find someone outside your industry.", split: 2, hint: "Discover one thing you have in common.", xp: 10 },
  { id: "different-city", title: "Find someone from a different city.", split: 2, hint: "Ask what they love about where they're from.", xp: 10 },
  { id: "skill-wish", title: "Find someone with a skill you wish you had.", split: 2, hint: "Ask how they learned it and where to start.", xp: 10 },
  { id: "not-spoken", title: "Find someone you haven't spoken to yet.", split: 2, hint: "Say hi and ask what brought them here tonight.", xp: 10 },
  { id: "learning-new", title: "Find someone who is learning something new.", split: 2, hint: "Ask what surprised them the most so far.", xp: 10 },
];

export function getChallenge(id?: string | null) {
  return CHALLENGES.find((challenge) => challenge.id === id);
}

/** Prefer challenges this visitor hasn't seen; once all are used, only avoid repeating the last one. */
export function pickChallenge(seen: string[]) {
  const fresh = CHALLENGES.filter((c) => !seen.includes(c.id));
  const last = seen[seen.length - 1];
  const pool = fresh.length > 0 ? fresh : CHALLENGES.filter((c) => c.id !== last);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** No 0/O or 1/I, so the code can be read aloud. 32 symbols keeps byte % 32 unbiased. */
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Random ID printed on each generated card, e.g. "K7Q3MX". */
export function cardCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

export function challengeScene(id: string) {
  return `/noshy/challenge/${id}.jpg`;
}
