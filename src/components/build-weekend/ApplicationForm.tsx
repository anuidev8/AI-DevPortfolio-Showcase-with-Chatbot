"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

const VB = {
  bg: "#0b011d",
  bgCard: "#12081f",
  cyan: "#00f2ff",
  magenta: "#ff007a",
  purple: "#b44aff",
  white: "#f5f5f5",
  muted: "rgba(245,245,245,0.55)",
  border: "rgba(255,255,255,0.12)",
  danger: "#ff6b8a",
};

type DeckType = "google_slides" | "pdf" | "web";
type Kind = "thursday_speaker" | "saturday_session";

type Props = {
  kind: Kind;
  title: string;
  eyebrow: string;
  intro: string;
  accent: string;
  submitLabel: string;
};

const fieldClass =
  "mt-1.5 block w-full rounded-xl border bg-transparent px-3.5 py-3 text-[15px] outline-none placeholder:opacity-40";

const labelClass = "block text-[14px] font-semibold";

export function ApplicationForm({ kind, title, eyebrow, intro, accent, submitLabel }: Props) {
  const isSaturday = kind === "saturday_session";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [deckType, setDeckType] = useState<DeckType>("google_slides");
  const [deckUrl, setDeckUrl] = useState("");
  const [videoProposalUrl, setVideoProposalUrl] = useState("");
  const [examples, setExamples] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/event-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name,
          email,
          phone,
          profile,
          instagram,
          linkedin,
          github,
          sessionTitle,
          sessionDescription,
          deckType,
          deckUrl,
          videoProposalUrl: isSaturday ? videoProposalUrl : undefined,
          examples: isSaturday ? examples : undefined,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Could not submit. Try again.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Network error. Check your connection and try again.");
    }
  }

  const inputStyle = {
    borderColor: VB.border,
    color: VB.white,
    background: VB.bg,
  } as const;

  if (status === "done") {
    return (
      <main className="min-h-screen px-5 py-16 sm:px-8" style={{ background: VB.bg, color: VB.white }}>
        <div
          className="mx-auto max-w-[520px] rounded-[24px] border p-8 text-center"
          style={{ borderColor: VB.border, background: VB.bgCard }}
        >
          <div
            className="mx-auto grid h-12 w-12 place-items-center rounded-full"
            style={{ background: `${accent}22`, color: accent }}
          >
            <Check size={22} />
          </div>
          <h1 className="mt-5 font-display text-[28px] font-bold">Application received</h1>
          <p className="mt-3" style={{ color: VB.muted }}>
            Thanks {name.trim() || "builder"}. Visible Builders will review your{" "}
            {isSaturday ? "Saturday session" : "Thursday speaker"} application and follow up.
          </p>
          <Link
            href="/workshop/visible-builders-build-weekend"
            className="mt-8 inline-flex no-underline"
            style={{ color: accent }}
          >
            ← Back to Build Weekend
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: VB.bg, color: VB.white }}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `
              linear-gradient(${VB.cyan}18 1px, transparent 1px),
              linear-gradient(90deg, ${VB.cyan}18 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 50% 40% at 80% 10%, ${accent}22 0%, transparent 55%)`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[640px] px-5 pb-24 pt-8 sm:px-8">
        <Link
          href="/workshop/visible-builders-build-weekend"
          className="inline-flex items-center gap-2 text-sm no-underline"
          style={{ color: VB.muted }}
        >
          <ArrowLeft size={16} /> Build Weekend
        </Link>

        <header className="mt-8">
          <p className="font-plex-mono text-[12px] tracking-[0.18em]" style={{ color: accent }}>
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-[clamp(30px,6vw,42px)] font-bold leading-tight">{title}</h1>
          <p className="mt-3" style={{ color: VB.muted }}>
            {intro}
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-5 rounded-[22px] border p-5 sm:p-7"
          style={{ borderColor: VB.border, background: VB.bgCard }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              Full name *
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className={fieldClass}
                style={inputStyle}
              />
            </label>
            <label className={labelClass}>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={fieldClass}
                style={inputStyle}
              />
            </label>
          </div>

          <label className={labelClass}>
            Profile / bio *
            <textarea
              required
              rows={4}
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              placeholder="Who you are, what you build, why this talk/session."
              className={fieldClass}
              style={inputStyle}
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-3">
            <label className={labelClass}>
              Instagram
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@handle or URL"
                className={fieldClass}
                style={inputStyle}
              />
            </label>
            <label className={labelClass}>
              LinkedIn
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="Profile URL"
                className={fieldClass}
                style={inputStyle}
              />
            </label>
            <label className={labelClass}>
              GitHub
              <input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="github.com/you"
                className={fieldClass}
                style={inputStyle}
              />
            </label>
          </div>

          <label className={labelClass}>
            Phone / WhatsApp
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className={fieldClass}
              style={inputStyle}
            />
          </label>

          <label className={labelClass}>
            Session title *
            <input
              required
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder={isSaturday ? "Workshop session title" : "Talk title"}
              className={fieldClass}
              style={inputStyle}
            />
          </label>

          <label className={labelClass}>
            Session description *
            <textarea
              required
              rows={4}
              value={sessionDescription}
              onChange={(e) => setSessionDescription(e.target.value)}
              placeholder="What attendees will learn or see."
              className={fieldClass}
              style={inputStyle}
            />
          </label>

          {isSaturday && (
            <>
              <label className={labelClass}>
                Video proposal *{" "}
                <span className="font-normal" style={{ color: VB.muted }}>
                  (YouTube, Loom, Drive…)
                </span>
                <input
                  required
                  type="url"
                  value={videoProposalUrl}
                  onChange={(e) => setVideoProposalUrl(e.target.value)}
                  placeholder="https://"
                  className={fieldClass}
                  style={inputStyle}
                />
              </label>
              <label className={labelClass}>
                Examples{" "}
                <span className="font-normal" style={{ color: VB.muted }}>
                  (links, past work, demos)
                </span>
                <textarea
                  rows={3}
                  value={examples}
                  onChange={(e) => setExamples(e.target.value)}
                  placeholder="Past workshops, live demos, GitHub repos, product URLs…"
                  className={fieldClass}
                  style={inputStyle}
                />
              </label>
            </>
          )}

          <fieldset>
            <legend className={labelClass}>Deck / slides *</legend>
            <p className="mt-1 text-[13px]" style={{ color: VB.muted }}>
              Google Slides, PDF link, or any web deck URL.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["google_slides", "Google Slides"],
                  ["pdf", "PDF link"],
                  ["web", "Web / other"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDeckType(value)}
                  className="rounded-full border px-3.5 py-1.5 font-plex-mono text-[12px]"
                  style={{
                    borderColor: deckType === value ? accent : VB.border,
                    color: deckType === value ? accent : VB.muted,
                    background: deckType === value ? `${accent}18` : "transparent",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              required
              type="url"
              value={deckUrl}
              onChange={(e) => setDeckUrl(e.target.value)}
              placeholder={
                deckType === "google_slides"
                  ? "https://docs.google.com/presentation/..."
                  : deckType === "pdf"
                    ? "https://.../deck.pdf"
                    : "https://..."
              }
              className={fieldClass}
              style={inputStyle}
            />
          </fieldset>

          {error && (
            <p className="rounded-xl border px-3.5 py-3 text-[14px]" style={{ borderColor: VB.danger, color: VB.danger }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 font-display text-[16px] font-semibold disabled:opacity-60"
            style={{ background: accent, color: VB.bg }}
          >
            {status === "loading" ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Submitting…
              </>
            ) : (
              submitLabel
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
