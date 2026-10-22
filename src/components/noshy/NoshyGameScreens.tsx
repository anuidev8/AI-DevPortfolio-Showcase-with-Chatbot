"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Camera, CalendarCheck, Check, ChevronRight, Clock, Compass, Gift, Handshake,
  MessageCircle, Mic, Shuffle, Sparkles, Trophy, Users, Zap,
} from "lucide-react";
import type { CommunityProfile } from "@/lib/community-data";
import {
  CONNECTION_XP, MISSIONS, getMission, parseNoshyCode,
  type ConnectionStatus, type GameProgress, type LeaderboardRow, type NoshyCode,
} from "@/lib/noshy-game";
import { icebreakerAt, icebreakersFor } from "@/lib/noshy-icebreaker";
import type { MatchPair } from "@/lib/noshy-match";
import { CardScanner } from "./CardScanner";
import { NoshyCard } from "./NoshyCard";
import { MatchPill, PersonAvatar, Tags, TopBar, animalTags } from "./NoshyUi";

export type GamePerson = CommunityProfile & { memberId?: number };

type CardInfo = { name: string; role?: string; animalId?: string; lookingFor?: string; url: string };

const first = (name: string) => name.trim().split(/\s+/)[0] || name;

const MISSION_ICONS: Record<string, ReactNode> = {
  Discover: <Compass size={20} />,
  Connect: <MessageCircle size={20} />,
  Give: <Gift size={20} />,
  Close: <CalendarCheck size={20} />,
  Host: <Users size={20} />,
};

function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="noshy-title">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

/** Card number typed by hand ("12", "#12", "NS-12") or a pasted NoShy link. */
function parseTypedCode(text: string): NoshyCode | null {
  const digits = text.trim().replace(/^(#|ns-?)/i, "");
  if (/^\d+$/.test(digits) && Number(digits) > 0) return { kind: "meet", memberId: Number(digits) };
  return parseNoshyCode(text);
}

/* ── Scan mode ── */

export function ScanScreen({ notice, onCode, onExplore, onBack }: {
  notice?: string;
  onCode: (code: NoshyCode) => void;
  onExplore: () => void;
  onBack: () => void;
}) {
  const [mode, setMode] = useState<"camera" | "code">("camera");
  const [scanning, setScanning] = useState(false);
  const [typed, setTyped] = useState("");
  const [typedError, setTypedError] = useState("");

  const submitCode = (event: FormEvent) => {
    event.preventDefault();
    const code = parseTypedCode(typed);
    if (!code) { setTypedError("That doesn't look like a NoShy number."); return; }
    setTypedError("");
    onCode(code);
  };

  return (
    <div className="noshy-scan">
      <TopBar overlay onBack={onBack} />
      <div className="noshy-scan-view">
        {mode === "camera" ? (
          scanning ? (
            <CardScanner onCode={onCode} />
          ) : (
            <button type="button" className="noshy-scan-open" onClick={() => setScanning(true)}>
              <span className="noshy-scanner-frame" aria-hidden="true" />
              <Camera size={30} />
              <strong>Tap to open camera</strong>
              <span>Align their profile QR in the frame</span>
            </button>
          )
        ) : (
          <form className="noshy-scan-code" onSubmit={submitCode}>
            <h3>Enter NoShy number</h3>
            <p>Type the number on their profile QR, or paste their link.</p>
            <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="e.g. 12" inputMode="numeric" autoFocus aria-label="Card code" />
            {typedError && <p className="noshy-error">{typedError}</p>}
            <button type="submit" className="noshy-btn noshy-btn-primary noshy-btn-full" disabled={!typed.trim()}>
              Find person<ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
      <div className="noshy-scan-foot">
        {notice && <p className="noshy-error">{notice}</p>}
        <div className="noshy-segment" role="tablist">
          <button type="button" role="tab" aria-selected={mode === "camera"} className={mode === "camera" ? "active" : ""} onClick={() => setMode("camera")}>Scan QR</button>
          <button type="button" role="tab" aria-selected={mode === "code"} className={mode === "code" ? "active" : ""} onClick={() => setMode("code")}>Enter number</button>
        </div>
        <button type="button" className="noshy-text-btn" onClick={onExplore}>
          <Users size={15} />Explore people instead
        </button>
      </div>
    </div>
  );
}

/* ── Scan result / person ── */

/** Animated +XP burst shown the moment a connection is claimed. */
function PointsBurst({ status }: { status: ConnectionStatus }) {
  const confirmed = status === "confirmed";
  return (
    <motion.div
      className="noshy-reward"
      role="status"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="noshy-reward-burst" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          const dist = 74 + (i % 3) * 26;
          return (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            />
          );
        })}
      </div>
      <motion.strong
        initial={{ scale: 0.5, y: 14 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 17 }}
      >
        <Zap size={22} /> +{CONNECTION_XP} XP
      </motion.strong>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        {confirmed ? "Connection confirmed — you both earned it!" : "Almost there — points unlock when they scan your QR back."}
      </motion.span>
    </motion.div>
  );
}

export function PersonScreen({ pair, aiLoading, status, theyLoggedYou, card, voiceHref, busy, error, onConnect, onBack, scanned }: {
  pair: MatchPair;
  aiLoading: boolean;
  status?: ConnectionStatus;
  theyLoggedYou: boolean;
  card: CardInfo | null;
  voiceHref: string;
  busy: boolean;
  error?: string;
  onConnect: (note: string) => void;
  onBack: () => void;
  /** Opened by scanning their profile QR: reveal the icebreaker card + points immediately. */
  scanned?: boolean;
}) {
  const [note, setNote] = useState("");
  const [iceOffset, setIceOffset] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const them = pair.right;
  const name = first(them.name);
  const [, ...topics] = pair.brief.topics;
  const iceCount = useMemo(() => icebreakersFor(pair.left, pair.right).length, [pair.left, pair.right]);
  const icebreaker = icebreakerAt(pair.left, pair.right, iceOffset % Math.max(iceCount, 1));

  // Points animation fires once the claim lands (waiting = pending, confirmed = paid out).
  useEffect(() => {
    if (!claimed || !status) return;
    setShowReward(true);
    const timer = window.setTimeout(() => setShowReward(false), 3400);
    return () => window.clearTimeout(timer);
  }, [claimed, status]);

  const claim = () => {
    setClaimed(true);
    onConnect(note);
  };

  return (
    <>
      <TopBar onBack={onBack} />
      <AnimatePresence>{showReward && status ? <PointsBurst key="reward" status={status} /> : null}</AnimatePresence>

      {scanned && (
        <motion.p
          className="noshy-scan-unlocked"
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Sparkles size={15} /> QR match unlocked · +{CONNECTION_XP} XP up for grabs
        </motion.p>
      )}

      <motion.div
        className="noshy-profile-hero"
        initial={scanned ? { opacity: 0, scale: 0.9, y: 16 } : false}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 20 }}
      >
        <div className="noshy-duo">
          <PersonAvatar animalId={pair.left.animalId} name={pair.left.name} size={72} shape="circle" />
          <PersonAvatar animalId={them.animalId} name={them.name} size={92} shape="circle" />
        </div>
        <MatchPill score={pair.brief.score} />
        <h2>{them.name}</h2>
        <p>{them.role}</p>
        <Tags items={animalTags(them.animalId)} />
      </motion.div>

      <motion.article
        className="noshy-icebreaker"
        initial={scanned ? { opacity: 0, y: 24, rotate: -1.2 } : false}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: scanned ? 0.18 : 0, type: "spring", stiffness: 220, damping: 21 }}
      >
        <header>
          <span>🧊 Icebreaker — ask {name} this</span>
          <button type="button" onClick={() => setIceOffset((n) => n + 1)} aria-label="Another icebreaker question">
            <Shuffle size={14} /> New question
          </button>
        </header>
        <AnimatePresence mode="wait">
          <motion.p
            key={icebreaker}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {icebreaker}
          </motion.p>
        </AnimatePresence>
        <footer>Talk first · then claim your points below ↓</footer>
      </motion.article>

      <article className="noshy-why">
        <h3>Why you should talk</h3>
        {aiLoading ? <div className="noshy-skeleton-stack"><i /><i /><i className="short" /></div> : <p>{pair.brief.why}</p>}
      </article>

      {!aiLoading && topics.length > 0 && (
        <ol className="noshy-numbered">{topics.map((t) => <li key={t}>{t}</li>)}</ol>
      )}

      {status === "confirmed" ? (
        <div className="noshy-confirmed">
          <strong><Handshake size={18} />Connection confirmed</strong>
          <span>{first(pair.left.name)} × {name} · +{CONNECTION_XP} XP</span>
        </div>
      ) : status === "waiting" ? (
        <div className="noshy-waiting">
          <strong><Clock size={15} />Ask {name} to scan your profile QR</strong>
          <p>Your +{CONNECTION_XP} XP unlocks when they scan you back and confirm.</p>
          {card && <NoshyCard {...card} />}
        </div>
      ) : (
        <>
          {theyLoggedYou && <div className="noshy-note"><Sparkles size={15} />{name} says you two talked. Confirm it to both get +{CONNECTION_XP} XP.</div>}
          <label className="noshy-field">
            What did you talk about? <em>Optional</em>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={`e.g. ${name}'s project`} maxLength={140} />
          </label>
          {error && <p className="noshy-error">{error}</p>}
          <div className="noshy-btn-row">
            <a className="noshy-btn noshy-btn-secondary" href={voiceHref}><Mic size={16} />Ask NoShy</a>
            <button type="button" className="noshy-btn noshy-btn-primary" disabled={busy} onClick={claim}>
              {busy ? "Saving…" : theyLoggedYou ? `Confirm · +${CONNECTION_XP} XP` : `We talked · +${CONNECTION_XP} XP`}
            </button>
          </div>
          <p className="noshy-away">Ask the icebreaker, have a real chat, then tap “We talked”.</p>
        </>
      )}
    </>
  );
}

/* ── Missions ── */

export function MissionsScreen({ progress, people, activeId, busy, error, earned, onPick, onComplete, onBack }: {
  progress: GameProgress;
  people: GamePerson[];
  activeId: string | null;
  busy: boolean;
  error?: string;
  earned: number | null;
  onPick: (missionId: string | null) => void;
  onComplete: (missionId: string, targetId: number) => void;
  onBack: () => void;
}) {
  const active = getMission(activeId);
  const done = new Set(progress.missions.map((m) => m.id));
  const [targetId, setTargetId] = useState<number | null>(null);

  if (active && !done.has(active.id)) {
    return (
      <>
        <TopBar onBack={() => onPick(null)} right={<span className="noshy-counter">+{active.xp} XP</span>} />
        <ScreenTitle title={active.title} subtitle={active.hint} />
        <p className="noshy-section-label">Who did you meet?</p>
        <div className="noshy-list">
          {people.length === 0 && <div className="noshy-empty compact"><Users size={28} /><h3>No one else checked in yet</h3></div>}
          {people.map((person) => (
            <button key={person.id} type="button"
              className={`noshy-row${targetId === person.memberId ? " selected" : ""}`}
              onClick={() => setTargetId(person.memberId ?? null)}>
              <PersonAvatar animalId={person.animalId} name={person.name} size={44} />
              <div><h3>{person.name}</h3><p>{person.role}</p></div>
              {targetId === person.memberId ? <Check size={18} className="noshy-row-check" /> : null}
            </button>
          ))}
        </div>
        {error && <p className="noshy-error">{error}</p>}
        <button type="button" className="noshy-btn noshy-btn-primary noshy-btn-full noshy-sticky"
          disabled={busy || targetId == null}
          onClick={() => targetId != null && onComplete(active.id, targetId)}>
          {busy ? "Saving…" : `Complete mission · +${active.xp} XP`}
        </button>
      </>
    );
  }

  return (
    <>
      <TopBar onBack={onBack} right={<span className="noshy-counter">{done.size}/{MISSIONS.length}</span>} />
      <ScreenTitle title="Your missions" subtitle="Complete challenges to meet new people and earn XP." />
      {earned != null && <div className="noshy-confirmed"><strong>🎉 Mission complete</strong><span>+{earned} XP</span></div>}
      <div className="noshy-list">
        {MISSIONS.map((mission) => {
          const isDone = done.has(mission.id);
          return (
            <button key={mission.id} type="button" className={`noshy-mission${isDone ? " done" : ""}`} disabled={isDone} onClick={() => onPick(mission.id)}>
              <span className="noshy-mission-icon">{isDone ? <Check size={20} /> : MISSION_ICONS[mission.kind] ?? <Compass size={20} />}</span>
              <div>
                <h3>{mission.title}</h3>
                <em>{isDone ? "Done" : `${mission.xp} XP`}</em>
              </div>
              <ChevronRight size={18} />
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ── Connections ── */

export function ConnectionsScreen({ progress, people, onOpen, onBack }: {
  progress: GameProgress;
  people: Map<number, GamePerson>;
  onOpen: (memberId: number) => void;
  onBack: () => void;
}) {
  const row = (memberId: number, label: string, tone: string, note?: string) => {
    const person = people.get(memberId);
    if (!person) return null;
    return (
      <button key={`${tone}-${memberId}`} type="button" className="noshy-row" onClick={() => onOpen(memberId)}>
        <PersonAvatar animalId={person.animalId} name={person.name} size={48} />
        <div>
          <h3>{person.name}</h3>
          <p>{note || person.role}</p>
          <span className={`noshy-status ${tone}`}>{label}</span>
        </div>
        <ChevronRight size={18} />
      </button>
    );
  };
  const empty = progress.connections.length === 0 && progress.incoming.length === 0;

  return (
    <>
      <TopBar onBack={onBack} />
      <ScreenTitle title="Connections" subtitle="People you actually met tonight." />
      <div className="noshy-list">
        {empty && (
          <div className="noshy-empty compact"><Handshake size={28} /><h3>No connections yet</h3><p>Scan someone's profile QR, ask the icebreaker, then tap “We talked”. It counts when you both confirm.</p></div>
        )}
        {progress.incoming.length > 0 && <p className="noshy-section-label">Waiting for you</p>}
        {progress.incoming.map((id) => row(id, "Confirm to get XP", "incoming"))}
        {progress.connections.length > 0 && <p className="noshy-section-label">Your connections</p>}
        {progress.connections.map((c) =>
          row(c.memberId, c.status === "confirmed" ? `Confirmed · +${CONNECTION_XP} XP` : "Waiting for them", c.status, c.note)
        )}
      </div>
    </>
  );
}

/* ── Leaderboard + recap ── */

export function Leaderboard({ rows, memberId }: { rows: LeaderboardRow[]; memberId: number | null }) {
  if (rows.length === 0) {
    return <div className="noshy-empty compact"><Trophy size={28} /><h3>No XP on the board yet</h3><p>The first confirmed connection takes the lead.</p></div>;
  }
  return (
    <ol className="noshy-board">
      {rows.map((row, index) => (
        <li key={row.memberId} className={row.memberId === memberId ? "you" : ""}>
          <span className="noshy-board-rank">{index + 1}</span>
          <PersonAvatar animalId={row.animalId} name={row.name} size={40} />
          <div><h3>{row.name}</h3><p>{row.connections} connections · {row.missions} missions</p></div>
          <em>{row.xp} XP</em>
        </li>
      ))}
    </ol>
  );
}

export function NightScreen({ progress, memberId, strongest, onBack }: {
  progress: GameProgress;
  memberId: number | null;
  strongest: MatchPair | null;
  onBack: () => void;
}) {
  const confirmed = progress.connections.filter((c) => c.status === "confirmed").length;
  return (
    <>
      <TopBar onBack={onBack} right={progress.rank ? <span className="noshy-counter">#{progress.rank}</span> : undefined} />
      <ScreenTitle title="Your night" subtitle="Great conversations! Here's your summary." />
      <div className="noshy-stats">
        <div><strong>{progress.connections.length}</strong><span>People met</span></div>
        <div><strong>{confirmed}</strong><span>Connections</span></div>
        <div><strong>{progress.missions.length}</strong><span>Missions</span></div>
        <div><strong>{progress.xp}</strong><span>XP earned</span></div>
      </div>
      {strongest && (
        <>
          <p className="noshy-section-label">Your strongest connection</p>
          <article className="noshy-match-card static">
            <PersonAvatar animalId={strongest.right.animalId} name={strongest.right.name} size={56} />
            <div>
              <MatchPill score={strongest.brief.score} />
              <h3>{strongest.right.name}</h3>
              <p>{strongest.right.role}</p>
            </div>
          </article>
        </>
      )}
      <button type="button" className="noshy-btn noshy-btn-primary noshy-btn-full" onClick={onBack}>
        Keep exploring<ArrowRight size={16} />
      </button>
      <p className="noshy-section-label">Visible Builders leaderboard</p>
      <Leaderboard rows={progress.leaderboard} memberId={memberId} />
    </>
  );
}

/* ── My card ── */

export function CardScreen({ card, onBack, children }: { card: CardInfo; onBack?: () => void; children?: ReactNode }) {
  return (
    <>
      <TopBar onBack={onBack} />
      <ScreenTitle title="Your profile QR" subtitle="Show this QR when you meet someone. They scan it and instantly get your match + icebreaker card — you scan theirs back to confirm." />
      <NoshyCard {...card} />
      {children}
    </>
  );
}
