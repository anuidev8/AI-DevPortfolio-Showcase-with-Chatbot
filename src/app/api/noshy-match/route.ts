import { NextResponse } from "next/server";
import { getNetworkingAnimal } from "@/lib/community-data";
import type { NoshyPerson } from "@/lib/noshy-match";

export const dynamic = "force-dynamic";

type MatchBody = {
  left?: NoshyPerson;
  right?: NoshyPerson;
  scoreHint?: number;
};

type AiBrief = {
  why?: string;
  topics?: string[];
  youHelpThem?: string;
  theyHelpYou?: string;
  score?: number;
};

function asPerson(value: NoshyPerson | undefined) {
  if (!value?.name?.trim()) return null;
  return {
    id: value.id,
    name: value.name.trim(),
    role: value.role?.trim() || "Guest",
    animalId: value.animalId,
    business: value.business?.trim() || "",
    lookingFor: value.lookingFor?.trim() || "",
    canHelp: value.canHelp?.trim() || "",
  };
}

function extractJson(text: string): AiBrief | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1)) as AiBrief;
  } catch {
    return null;
  }
}

function personLine(person: ReturnType<typeof asPerson>) {
  if (!person) return "";
  const animal = getNetworkingAnimal(person.animalId);
  return [
    `Name: ${person.name}`,
    `Role: ${person.role}`,
    animal ? `Animal: ${animal.emoji} ${animal.name} (${animal.vibe})` : "",
    `Business: ${person.business || "(not said)"}`,
    `Looking for: ${person.lookingFor || "(not said)"}`,
    `Can help with: ${person.canHelp || "(not said)"}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = (process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1").replace(/\/$/, "");
    const model = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-nano-30b-a3b:free";

    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const body = (await request.json()) as MatchBody;
    const left = asPerson(body.left);
    const right = asPerson(body.right);
    if (!left || !right) {
      return NextResponse.json({ error: "Two people are required" }, { status: 400 });
    }

    const prompt = `You write match cards for NoShy Networking used live at AI After Hours events.

Goal: lead a 5-minute conversation that is direct, useful, and no BS.

Write for these two people using their 3 answers. If an answer is short, messy, or placeholder text, infer a useful conversation from role + the other person's answers. Do not mock them.

${personLine(left)}

${personLine(right)}

Score hint from the event tool: ${body.scoreHint ?? 75}

Return ONLY JSON:
{
  "score": 84,
  "why": "2 short sentences. First names. Why they should talk tonight.",
  "topics": ["topic 1", "topic 2", "topic 3"],
  "youHelpThem": "What ${left.name.split(" ")[0]} can do for ${right.name.split(" ")[0]} this week, one sentence.",
  "theyHelpYou": "What ${right.name.split(" ")[0]} can do for ${left.name.split(" ")[0]} this week, one sentence."
}

Rules:
- English
- Concrete next steps, not hype
- 3 topics: 1 about each business, 1 clear ask, 1 next step before they leave
- Keep each field under 220 characters
- score is an integer 62-98`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://visiblebuilders.io",
        "X-Title": "NoShy Networking — AI After Hours",
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: "You are NoShy, an event matching assistant. Reply with valid JSON only. No markdown.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("OpenRouter match failed", response.status, detail.slice(0, 400));
      return NextResponse.json({ error: "AI match unavailable" }, { status: 502 });
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content ?? "";
    const parsed = extractJson(content);
    if (!parsed?.why) {
      return NextResponse.json({ error: "AI returned an empty match" }, { status: 502 });
    }

    const topics = (parsed.topics ?? []).map((t) => String(t).trim()).filter(Boolean).slice(0, 3);

    return NextResponse.json({
      score:
        typeof parsed.score === "number"
          ? Math.max(62, Math.min(98, Math.round(parsed.score)))
          : body.scoreHint ?? 80,
      why: String(parsed.why).trim(),
      topics,
      youHelpThem: String(parsed.youHelpThem ?? "").trim(),
      theyHelpYou: String(parsed.theyHelpYou ?? "").trim(),
    });
  } catch (error) {
    console.error("noshy-match POST failed", error);
    return NextResponse.json({ error: "Failed to write match" }, { status: 500 });
  }
}
