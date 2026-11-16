"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

/** Visible Builders — cyber neon (matches AI After Hours / visiblebuilders.io) */
const VB = {
  bg: "#0b011d",
  bgCard: "#12081f",
  bgCardAlt: "#1a0f2e",
  cyan: "#00f2ff",
  magenta: "#ff007a",
  purple: "#b44aff",
  white: "#f5f5f5",
  muted: "rgba(245,245,245,0.55)",
  border: "rgba(255,255,255,0.1)",
};

const CONTACT =
  "mailto:hello@visiblebuilders.io?subject=Build%20Weekend%20Nov%2026%E2%80%9328%20%E2%80%94%20RSVP";

const days = [
  {
    tag: "THU 26 NOV",
    title: "Speakers night",
    price: "Free",
    accent: VB.cyan,
    line: "Three builders on stage. Real talks, demos, networking — same AI After Hours format.",
  },
  {
    tag: "SAT 28 NOV",
    title: "Build workshop",
    price: "Free if you came Thu · USD 25 public",
    accent: VB.magenta,
    line: "Private cowork. Ship with Vercel, Lovable, connectors & MCPs — plus a bonus ElevenLabs voice session.",
  },
];

const thuAgenda = [
  { t: "6:45", l: "Doors + check-in QR" },
  { t: "7:20", l: "Welcome & community goals" },
  { t: "7:30", l: "Talk 1 — Speaker TBD (20 min)" },
  { t: "7:50", l: "Networking break" },
  { t: "8:00", l: "Talk 2 — Speaker TBD (25 min)" },
  { t: "8:25", l: "Networking break" },
  { t: "8:35", l: "Talk 3 — Speaker TBD (20 min)" },
  { t: "8:55", l: "Open networking + Saturday workshop invite" },
];

const satBlocks = [
  {
    n: "01",
    title: "Cloud build stack",
    body: "Use Lovable (or similar) to move fast on UI, then deploy on Vercel so you leave with a live URL.",
  },
  {
    n: "02",
    title: "Connectors & tools",
    body: "Find the right tools, wire connectors, and plug in extra account tools without getting lost.",
  },
  {
    n: "03",
    title: "MCPs & power connections",
    body: "How agents and builders talk to real systems — MCP-style connections that unlock workflows.",
  },
  {
    n: "04",
    title: "Design + workflows",
    body: "Prompts and patterns for shippable design, plus a clear idea → prototype → live flow.",
  },
  {
    n: "05",
    title: "When to code",
    body: "Drop into code when the builder hits a wall: env vars, keys, and safe multi-account setup.",
  },
  {
    n: "BONUS",
    title: "ElevenLabs voice",
    body: "Extra session: create a voice, generate speech, and plug ElevenLabs into your site or agent so the build talks back.",
  },
];

const satAgenda = [
  { t: "0:00", l: "Welcome, outcome, accounts checklist" },
  { t: "0:20", l: "Scope your site or custom app" },
  { t: "0:50", l: "Build UI with Lovable / AI builder" },
  { t: "1:40", l: "Break" },
  { t: "1:55", l: "Connectors, MCPs & workflows" },
  { t: "2:35", l: "Deploy on Vercel + design polish" },
  { t: "3:05", l: "Bonus · ElevenLabs — add voice to your build" },
  { t: "3:30", l: "Demo circle + next steps" },
  { t: "3:55", l: "Close + resources pack" },
];

const pricing = [
  {
    name: "Thursday night",
    price: "Free",
    note: "Speakers + networking. Check in to unlock Saturday.",
    highlight: false,
  },
  {
    name: "Saturday · Thursday guest",
    price: "Free",
    note: "Check-in on Thu + RSVP. Cap 12–15 seats.",
    highlight: true,
  },
  {
    name: "Saturday · public seat",
    price: "USD 25",
    note: "~COP 100.000. Laptop required.",
    highlight: false,
  },
];

const bring = [
  "Laptop + charger",
  "GitHub account",
  "Vercel account",
  "Lovable (or chosen builder) account",
  "Optional: API keys for tools you want to connect",
];

export default function BuildWeekendPage() {
  return (
    <main className="min-h-screen text-[15px] leading-relaxed" style={{ background: VB.bg, color: VB.white }}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.16]"
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
            background: `
              radial-gradient(ellipse 55% 45% at 75% 15%, ${VB.purple}28 0%, transparent 55%),
              radial-gradient(ellipse 40% 35% at 15% 70%, ${VB.magenta}16 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[980px] px-5 pb-24 pt-8 sm:px-8">
        <Link
          href="/post"
          className="inline-flex items-center gap-2 text-sm no-underline transition-opacity hover:opacity-80"
          style={{ color: VB.muted }}
        >
          <ArrowLeft size={16} /> Back to posts
        </Link>

        <header className="mt-10 max-w-[720px]">
          <p className="font-plex-mono text-[12px] tracking-[0.18em]" style={{ color: VB.cyan }}>
            VISIBLE BUILDERS · MEDELLÍN
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Nov 26 free night", "Nov 28 workshop", "Private cowork Sat"].map((b) => (
              <span
                key={b}
                className="rounded-full border px-3 py-1 font-plex-mono text-[11px] tracking-wide"
                style={{ borderColor: VB.border, color: VB.muted }}
              >
                {b}
              </span>
            ))}
          </div>
          <h1 className="mt-5 font-display text-[clamp(36px,7vw,56px)] font-bold leading-[1.05] tracking-tight">
            Build Weekend
            <span className="block" style={{ color: VB.cyan }}>
              Speakers → Ship
            </span>
          </h1>
          <p className="mt-5 max-w-[560px] text-[17px]" style={{ color: VB.muted }}>
            Thursday: three speakers, same AI After Hours energy. Saturday: a hands-on workshop where you
            build a website or custom app with cloud AI tools — Vercel, Lovable, connectors, MCPs, design and
            workflows — plus a bonus ElevenLabs voice session.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={CONTACT}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-display text-[15px] font-semibold no-underline"
              style={{ background: VB.cyan, color: VB.bg }}
            >
              RSVP the weekend <ArrowRight size={16} />
            </a>
            <Link
              href="/workshop/visible-builders-build-weekend/register-speaker"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-display text-[15px] font-semibold no-underline"
              style={{ borderColor: VB.border, color: VB.white }}
            >
              Apply as speaker
            </Link>
            <Link
              href="/workshop/visible-builders-build-weekend/register-saturday"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-display text-[15px] font-semibold no-underline"
              style={{ borderColor: `${VB.magenta}88`, color: VB.magenta }}
            >
              Propose Saturday session
            </Link>
          </div>
        </header>

        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          {days.map((d, i) => (
            <motion.article
              key={d.tag}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="rounded-[20px] border p-6"
              style={{ background: VB.bgCard, borderColor: VB.border }}
            >
              <p className="font-plex-mono text-[12px] tracking-[0.14em]" style={{ color: d.accent }}>
                {d.tag}
              </p>
              <h2 className="mt-2 font-display text-[26px] font-bold">{d.title}</h2>
              <p className="mt-1 font-display text-[18px] font-semibold" style={{ color: d.accent }}>
                {d.price}
              </p>
              <p className="mt-3" style={{ color: VB.muted }}>
                {d.line}
              </p>
            </motion.article>
          ))}
        </section>

        {/* Thursday */}
        <section id="thursday" className="mt-20">
          <p className="font-plex-mono text-[12px] tracking-[0.18em]" style={{ color: VB.cyan }}>
            THURSDAY 26 · FREE
          </p>
          <h2 className="mt-2 max-w-[640px] font-display text-[clamp(28px,4vw,40px)] font-bold leading-tight">
            Speakers night — three talks, then the room opens.
          </h2>
          <p className="mt-4 max-w-[560px]" style={{ color: VB.muted }}>
            Same format you already run: host opens, three practitioners on stage, short networking breaks,
            then open connections. End of night: invite to Saturday’s private workshop.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-[16px] border p-5"
                style={{ background: VB.bgCardAlt, borderColor: VB.border }}
              >
                <p className="font-plex-mono text-[12px]" style={{ color: VB.purple }}>
                  SPEAKER 0{n}
                </p>
                <p className="mt-2 font-display text-[20px] font-bold">Name TBD</p>
                <p className="mt-1 text-[14px]" style={{ color: VB.muted }}>
                  Topic locked after confirmation
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/workshop/visible-builders-build-weekend/register-speaker"
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 font-display text-[15px] font-semibold no-underline"
            style={{ background: VB.cyan, color: VB.bg }}
          >
            Apply as Thursday speaker <ArrowRight size={16} />
          </Link>

          <ol className="mt-8 space-y-0 border-t" style={{ borderColor: VB.border }}>
            {thuAgenda.map((row) => (
              <li
                key={row.t + row.l}
                className="flex gap-6 border-b py-3 font-plex-mono text-[13px]"
                style={{ borderColor: VB.border }}
              >
                <span className="w-12 shrink-0" style={{ color: VB.cyan }}>
                  {row.t}
                </span>
                <span style={{ color: VB.white }}>{row.l}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Saturday */}
        <section id="saturday" className="mt-20">
          <p className="font-plex-mono text-[12px] tracking-[0.18em]" style={{ color: VB.magenta }}>
            SATURDAY 28 · WORKSHOP
          </p>
          <h2 className="mt-2 max-w-[720px] font-display text-[clamp(28px,4vw,40px)] font-bold leading-tight">
            Build with cloud AI tools — leave with something live.
          </h2>
          <p className="mt-4 max-w-[600px]" style={{ color: VB.muted }}>
            3–4 hours in a private cowork. You’ll learn how to use Vercel and Lovable to ship a website or
            custom app, find tools, wire connectors and MCPs, shape design, and set up workflows — plus when
            to drop into code, and a bonus block on ElevenLabs voice.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {satBlocks.map((b) => (
              <div
                key={b.n}
                className="rounded-[16px] border p-5"
                style={{ background: VB.bgCard, borderColor: VB.border }}
              >
                <p className="font-plex-mono text-[12px]" style={{ color: VB.magenta }}>
                  {b.n}
                </p>
                <h3 className="mt-1 font-display text-[20px] font-bold">{b.title}</h3>
                <p className="mt-2 text-[14px]" style={{ color: VB.muted }}>
                  {b.body}
                </p>
              </div>
            ))}
          </div>

          <h3 className="mt-10 font-display text-[22px] font-bold">Saturday agenda</h3>
          <ol className="mt-4 space-y-0 border-t" style={{ borderColor: VB.border }}>
            {satAgenda.map((row) => (
              <li
                key={row.t + row.l}
                className="flex gap-6 border-b py-3 font-plex-mono text-[13px]"
                style={{ borderColor: VB.border }}
              >
                <span className="w-12 shrink-0" style={{ color: VB.magenta }}>
                  {row.t}
                </span>
                <span>{row.l}</span>
              </li>
            ))}
          </ol>

          <div
            className="mt-8 rounded-[16px] border p-5"
            style={{ background: VB.bgCardAlt, borderColor: VB.border }}
          >
            <p className="font-plex-mono text-[12px] tracking-[0.14em]" style={{ color: VB.cyan }}>
              BRING / CREATE BEFORE SAT
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {bring.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[14px]" style={{ color: VB.muted }}>
                  <Check size={16} className="mt-0.5 shrink-0" style={{ color: VB.cyan }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/workshop/visible-builders-build-weekend/register-saturday"
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 font-display text-[15px] font-semibold no-underline"
            style={{ background: VB.magenta, color: VB.white }}
          >
            Propose a Saturday session <ArrowRight size={16} />
          </Link>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mt-20">
          <p className="font-plex-mono text-[12px] tracking-[0.18em]" style={{ color: VB.purple }}>
            PRICING
          </p>
          <h2 className="mt-2 font-display text-[clamp(28px,4vw,36px)] font-bold">Simple seats.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {pricing.map((p) => (
              <div
                key={p.name}
                className="rounded-[16px] border p-5"
                style={{
                  background: p.highlight ? VB.bgCardAlt : VB.bgCard,
                  borderColor: p.highlight ? `${VB.cyan}66` : VB.border,
                  boxShadow: p.highlight ? `0 0 24px ${VB.cyan}22` : undefined,
                }}
              >
                <p className="font-display text-[16px] font-semibold">{p.name}</p>
                <p className="mt-2 font-display text-[28px] font-bold" style={{ color: VB.cyan }}>
                  {p.price}
                </p>
                <p className="mt-2 text-[13px]" style={{ color: VB.muted }}>
                  {p.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-[24px] border p-8 text-center sm:p-12" style={{ borderColor: VB.border, background: VB.bgCard }}>
          <p className="font-plex-mono text-[12px] tracking-[0.18em]" style={{ color: VB.cyan }}>
            NEXT STEP
          </p>
          <h2 className="mt-3 font-display text-[clamp(26px,4vw,36px)] font-bold">
            Come Thursday. Ship Saturday.
          </h2>
          <p className="mx-auto mt-3 max-w-[480px]" style={{ color: VB.muted }}>
            Speakers night is free. Workshop seats for Thursday guests are free while they last — public seats
            USD 25.
          </p>
          <a
            href={CONTACT}
            className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-display text-[16px] font-semibold no-underline"
            style={{ background: VB.magenta, color: VB.white }}
          >
            RSVP Build Weekend <ArrowRight size={16} />
          </a>
        </section>
      </div>
    </main>
  );
}
