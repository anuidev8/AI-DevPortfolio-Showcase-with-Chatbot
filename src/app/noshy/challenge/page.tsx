"use client";

import { useCallback, useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowRight, Check, Shuffle } from "lucide-react";
import { ChallengeFront, MissionFace } from "@/components/noshy/NoshyCard";
import { cardCode, challengeScene, getChallenge, pickChallenge, type Challenge } from "@/lib/noshy-challenges";

const VISITOR_KEY = "noshy-challenge-visitor";
const PLAYER_KEY = "noshy-challenge-player";
const FLIP_MS = 800;
/** Minimum time the front stays up on the first reveal, so the flip reads as a reveal. */
const FIRST_REVEAL_MS = 900;

type Player = { name: string; role: string };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function visitorId() {
  const saved = localStorage.getItem(VISITOR_KEY);
  if (saved) return saved;
  const fresh = crypto.randomUUID();
  localStorage.setItem(VISITOR_KEY, fresh);
  return fresh;
}

function savedPlayer(): Player {
  try {
    const parsed = JSON.parse(localStorage.getItem(PLAYER_KEY) ?? "{}") as Partial<Player>;
    return { name: parsed.name ?? "", role: parsed.role ?? "" };
  } catch {
    return { name: "", role: "" };
  }
}

/** Scan the QR, say who you are, get a random icebreaker. Separate from the NoShy game. */
export default function ChallengePage() {
  const [player, setPlayer] = useState<Player>({ name: "", role: "" });
  const [asking, setAsking] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [drawId, setDrawId] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [draws, setDraws] = useState(0);

  useEffect(() => {
    setPlayer(savedPlayer());
  }, []);

  const draw = useCallback(async (who: Player, first: boolean) => {
    setBusy(true);
    setDone(false);
    setFlipped(false);
    const startedAt = Date.now();
    const source = first ? new URLSearchParams(window.location.search).get("src") ?? "direct" : "again";
    setDraws((n) => n + 1);

    let next = pickChallenge([]);
    let id: number | null = null;
    let nextCode = cardCode();
    try {
      const res = await fetch("/api/noshy/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: visitorId(), source, name: who.name, role: who.role }),
      });
      const data = (await res.json()) as { challengeId?: string; drawId?: number | null; code?: string };
      next = getChallenge(data.challengeId) ?? next;
      id = data.drawId ?? null;
      nextCode = data.code ?? nextCode;
    } catch { /* fall back to a local draw */ }

    await wait(Math.max(0, (first ? FIRST_REVEAL_MS : FLIP_MS) - (Date.now() - startedAt)));
    setChallenge(next);
    setDrawId(id);
    setCode(nextCode);
    setFlipped(true);
    setBusy(false);
  }, []);

  const submitPlayer = (event: FormEvent) => {
    event.preventDefault();
    const who = { name: player.name.trim(), role: player.role.trim() };
    if (!who.name || !who.role) return;
    localStorage.setItem(PLAYER_KEY, JSON.stringify(who));
    setPlayer(who);
    setAsking(false);
    void draw(who, draws === 0);
  };

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
    if (challenge && !busy && !asking) setFlipped((value) => !value);
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flip();
    }
  };

  return (
    <main className={`noshy-challenge${asking ? " asking" : ""}`}>
      <p className="noshy-challenge-eyebrow">Tonight&apos;s icebreaker</p>

      {!asking && (
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
                corner={`#${code}`}
                aside={<span className="noshy-card-player"><b>{player.name}</b>{player.role}</span>}
              />
            ) : (
              <article className="noshy-card noshy-flip-face noshy-flip-back" aria-hidden="true" />
            )}
          </div>
        </div>
      )}

      {asking ? (
        <form className="noshy-challenge-form" onSubmit={submitPlayer}>
          <h1 className="noshy-challenge-title">Tell us who <em>you are.</em></h1>
          <p className="noshy-challenge-sub">We&apos;ll put it on your card, then deal you a challenge.</p>
          <label className="noshy-field">
            Your name
            <input
              value={player.name}
              onChange={(e) => setPlayer((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Sofia Arboleda"
              autoComplete="name"
              maxLength={40}
              required
            />
          </label>
          <label className="noshy-field">
            What do you do?
            <input
              value={player.role}
              onChange={(e) => setPlayer((p) => ({ ...p, role: e.target.value }))}
              placeholder="e.g. AI × Robotics"
              autoComplete="organization-title"
              maxLength={48}
              required
            />
          </label>
          <button type="submit" className="noshy-btn noshy-btn-primary noshy-btn-full" disabled={!player.name.trim() || !player.role.trim()}>
            Reveal my challenge<ArrowRight size={17} />
          </button>
        </form>
      ) : (
        <>
          <p className="noshy-challenge-status" aria-live="polite">
            {busy ? "Shuffling the deck…" : done ? "Nice one. Ready for another?" : "Tap the card to flip it."}
          </p>
          <div className="noshy-btn-row noshy-challenge-actions">
            <button type="button" className="noshy-btn noshy-btn-secondary" onClick={() => void draw(player, false)} disabled={busy}>
              <Shuffle size={17} />New question
            </button>
            <button type="button" className="noshy-btn noshy-btn-primary" onClick={() => void markDone()} disabled={busy || done || !challenge}>
              {done ? <><Check size={17} />Done</> : "I found them"}
            </button>
          </div>
          <button type="button" className="noshy-challenge-edit" onClick={() => { setAsking(true); setFlipped(false); }} disabled={busy}>
            Not {player.name.split(" ")[0]}? Change name
          </button>
        </>
      )}
    </main>
  );
}
