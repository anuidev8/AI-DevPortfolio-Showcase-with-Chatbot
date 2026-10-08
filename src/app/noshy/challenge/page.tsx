"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Check, Shuffle } from "lucide-react";
import { ChallengeFront, MissionFace } from "@/components/noshy/NoshyCard";
import { cardCode, challengeScene, getChallenge, pickChallenge, type Challenge } from "@/lib/noshy-challenges";

const VISITOR_KEY = "noshy-challenge-visitor";
const FLIP_MS = 800;
/** How long the front stays up on first load before the card turns over. */
const FIRST_REVEAL_MS = 1100;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function visitorId() {
  const saved = localStorage.getItem(VISITOR_KEY);
  if (saved) return saved;
  const fresh = crypto.randomUUID();
  localStorage.setItem(VISITOR_KEY, fresh);
  return fresh;
}

/** Scan the QR, get a random icebreaker. Separate from the NoShy game: no profile needed. */
export default function ChallengePage() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [drawId, setDrawId] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(true);
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const draws = useRef(0);

  const draw = useCallback(async () => {
    setBusy(true);
    setDone(false);
    setFlipped(false);
    const startedAt = Date.now();
    const source = draws.current === 0 ? new URLSearchParams(window.location.search).get("src") ?? "direct" : "again";
    draws.current += 1;

    let next = pickChallenge([]);
    let id: number | null = null;
    let nextCode = cardCode();
    try {
      const res = await fetch("/api/noshy/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: visitorId(), source }),
      });
      const data = (await res.json()) as { challengeId?: string; drawId?: number | null; code?: string };
      next = getChallenge(data.challengeId) ?? next;
      id = data.drawId ?? null;
      nextCode = data.code ?? nextCode;
    } catch { /* fall back to a local draw */ }

    const minFront = draws.current === 1 ? FIRST_REVEAL_MS : FLIP_MS;
    await wait(Math.max(0, minFront - (Date.now() - startedAt)));
    setChallenge(next);
    setDrawId(id);
    setCode(nextCode);
    setFlipped(true);
    setBusy(false);
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void draw();
  }, [draw]);

  const markDone = async () => {
    setDone(true);
    if (drawId == null) return;
    try {
      await fetch("/api/noshy/challenge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: visitorId(), drawId }),
      });
    } catch { /* the tap still counts on screen */ }
  };

  const flip = () => {
    if (challenge && !busy) setFlipped((value) => !value);
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flip();
    }
  };

  return (
    <main className="noshy-challenge">
      <p className="noshy-challenge-eyebrow">Tonight&apos;s icebreaker</p>

      <div
        className={`noshy-flip${flipped ? " flipped" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Show the front of the card" : "Show your challenge"}
        onClick={flip}
        onKeyDown={onKey}
      >
        <div className="noshy-flip-inner">
          <ChallengeFront className="noshy-flip-face" />
          {challenge ? (
            <MissionFace
              className="noshy-flip-face noshy-flip-back"
              kind="Discover"
              title={challenge.title}
              split={challenge.split}
              hint={challenge.hint}
              xp={challenge.xp}
              scene={challengeScene(challenge.id)}
              aside={<span className="noshy-card-draw">Card ID<b>#{code}</b></span>}
            />
          ) : (
            <article className="noshy-card noshy-flip-face noshy-flip-back" aria-hidden="true" />
          )}
        </div>
      </div>

      <p className="noshy-challenge-status" aria-live="polite">
        {busy ? "Shuffling the deck…" : done ? "Nice one. Ready for another?" : "Tap the card to flip it."}
      </p>

      <div className="noshy-btn-row noshy-challenge-actions">
        <button type="button" className="noshy-btn noshy-btn-secondary" onClick={() => void draw()} disabled={busy}>
          <Shuffle size={17} />New question
        </button>
        <button type="button" className="noshy-btn noshy-btn-primary" onClick={() => void markDone()} disabled={busy || done || !challenge}>
          {done ? <><Check size={17} />Done</> : "I found them"}
        </button>
      </div>
    </main>
  );
}
