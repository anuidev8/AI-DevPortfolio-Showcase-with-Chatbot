import type { MatchBrief, MatchPair } from "@/lib/noshy-match";
import { pairKey, toNoshyPerson } from "@/lib/noshy-match";

const cache = new Map<string, MatchBrief>();

export async function fetchAiMatch(pair: MatchPair): Promise<MatchBrief> {
  const key = pairKey(pair.left.id, pair.right.id);
  const cached = cache.get(key);
  if (cached) return cached;

  const left = toNoshyPerson(pair.left);
  const right = toNoshyPerson(pair.right);

  const response = await fetch("/api/noshy-match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      left,
      right,
      scoreHint: pair.brief.score,
    }),
  });

  if (!response.ok) {
    throw new Error("AI match failed");
  }

  const data = (await response.json()) as Partial<MatchBrief>;
  const brief: MatchBrief = {
    score: typeof data.score === "number" ? data.score : pair.brief.score,
    why: data.why?.trim() || pair.brief.why,
    topics: Array.isArray(data.topics) && data.topics.length ? data.topics : pair.brief.topics,
    youHelpThem: data.youHelpThem?.trim() || pair.brief.youHelpThem,
    theyHelpYou: data.theyHelpYou?.trim() || pair.brief.theyHelpYou,
  };

  cache.set(key, brief);
  return brief;
}
