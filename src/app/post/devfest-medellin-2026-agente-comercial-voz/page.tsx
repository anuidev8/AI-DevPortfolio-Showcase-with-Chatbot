'use client';

/*
 * DevFest Medellín 2026 · "Agente comercial que escucha, entiende y actúa"
 * Visual system copied from commercial-voice-agent/apps/web (capsule kit):
 * flat navy surfaces, one blue (#2f6bff), Helvetica Neue, IBM Plex Mono for code/tool names,
 * the blue-tile gradient as the only gradient, and the moving wave-mesh print around the edges.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { HookAvatar } from '@/components/devfest-avatar/HookAvatar';
import { IntroSequence, INTRO_HANDOFF_EVENT } from '@/components/devfest-intro/IntroSequence';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Bot,
  Brain,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code2,
  Expand,
  ExternalLink,
  Eye,
  Github,
  Glasses,
  Heart,
  Layers,
  MessageSquare,
  Mic,
  Phone,
  Radio,
  ShoppingBag,
  Sparkles,
  X,
  Lock,
  ShieldCheck,
  FileText,
  Globe,
  type LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Tokens (same values as commercial-voice-agent globals.css)          */
/* ------------------------------------------------------------------ */

const FONT = '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif';

const REPO_URL = 'https://github.com/anuidev8/devfest-medellin-2026-voice-agent-comercial';
const SITE_URL = 'https://www.angelmateus.com';
const COMMUNITY_URL = `${SITE_URL}/community`;
/** Set NEXT_PUBLIC_DEVFEST_DEMO_URL to the deployed web app (e.g. https://xxx.vercel.app); falls back to the repo. */
const DEMO_URL = process.env.NEXT_PUBLIC_DEVFEST_DEMO_URL || REPO_URL;

const KIT_CSS = `
.cva {
  --bg: #070a14; --surface: #0e1322; --raise: #181e30; --line: #232a3f;
  --text: #f2f4f8; --dim: #8d95a8; --signal: #2f6bff; --signal-soft: #9bb8ff;
  --glow: #45d4f5; --good: #3ccf8e; --danger: #ff5d6c; --ink: #05070d; --amber: #f2a65a;
  --violet: #b59bff;
  --blue-tile: linear-gradient(160deg, #1b3fd8 0%, #2f6bff 55%, #5b93ff 100%);
  --title-tile: #0f1a3d;
  --ease-out-soft: cubic-bezier(0.2, 0.8, 0.2, 1);
  background: var(--bg); color: var(--text); font-family: ${FONT};
  -webkit-font-smoothing: antialiased;
}
.cva h1, .cva h2, .cva h3 { font-weight: 500; letter-spacing: -0.02em; text-wrap: balance; }
.cva :focus-visible { outline: 2px solid var(--glow); outline-offset: 2px; }
.cva .eyebrow { font-size: 11px; font-weight: 500; line-height: 1; letter-spacing: 0.08em; text-transform: uppercase; color: var(--dim); }
.cva .tile { border-radius: 24px; background: var(--surface); border: 1px solid var(--line); }
.cva .title-tile { border-radius: 28px; background: var(--title-tile); }
.cva .blue-tile { border-radius: 32px; background: var(--blue-tile); color: #fff; }
.cva .pill { display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 14px; border-radius: 999px; background: var(--raise); color: var(--dim); font-size: 13px; font-weight: 500; transition: background 160ms ease, color 160ms ease; }
.cva a.pill:hover { color: var(--text); background: #222a40; }
.cva .cbtn { display: grid; place-items: center; flex: none; width: 46px; height: 46px; border-radius: 999px; background: #181e30; color: #f2f4f8; transition: background 160ms ease, transform 160ms ease; }
.cva .cbtn:hover { background: #222a40; }
.cva .cbtn:active { transform: scale(0.94); }
.cva .cbtn:disabled { opacity: 0.35; pointer-events: none; }
.cva .dock { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 999px; background: var(--ink); border: 1px solid color-mix(in srgb, var(--line) 80%, transparent); }
.cva .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 999px; padding: 14px 22px; font-size: 15px; font-weight: 500; line-height: 1; transition: transform 160ms ease, opacity 160ms ease; }
.cva .btn:active { transform: scale(0.97); }
.cva .btn-primary { background: var(--text); color: var(--ink); }
.cva .btn-blue { background: var(--signal); color: #fff; }
.cva .btn-quiet { background: var(--raise); color: var(--text); }
.cva .mono { font-family: var(--font-plex-mono), ui-monospace, Menlo, monospace; }
.cva .dot { width: 8px; height: 8px; border-radius: 999px; flex: none; }

/* Edge print (SETI "wake", in blue): drifts around the edges, clear in the middle. */
.cva .edge-wake-mesh { position: absolute; inset: 0; background-image: url("/devfest-2026/wave-mesh-blue.jpg"); background-size: cover; background-position: center; mix-blend-mode: screen; opacity: 0.4; animation: cva-drift 6s ease-in-out infinite; mask: radial-gradient(ellipse 62% 58% at 50% 48%, transparent 48%, rgb(0 0 0 / 0.25) 68%, #000 92%); }
@media (max-width: 768px) { .cva .edge-wake-mesh { background-image: url("/devfest-2026/wave-mesh-blue-mobile.jpg"); } }
.cva .edge-wake-wash { position: absolute; inset: 0; background: radial-gradient(ellipse 78% 72% at 50% 48%, transparent 55%, rgb(47 107 255 / 0.12) 86%, rgb(47 107 255 / 0.2) 100%); }
@keyframes cva-drift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1.05); opacity: 0.3; }
  50% { transform: translate3d(1.4%, -1.1%, 0) scale(1.07); opacity: 0.46; }
}

/* Placeholder presence: the voice orb */
.cva .orb { position: relative; aspect-ratio: 1; border-radius: 50%; background: var(--signal); }
.cva .orb::after { content: ""; position: absolute; inset: -14px; border-radius: 50%; border: 1.5px solid var(--glow); animation: cva-ring 1.8s ease-out infinite; }
.cva .orb-talk { animation: cva-talk 0.5s ease-in-out infinite alternate; }
@keyframes cva-ring { from { transform: scale(0.92); opacity: 0.8; } to { transform: scale(1.28); opacity: 0; } }
@keyframes cva-talk { from { transform: scale(0.98); } to { transform: scale(1.06); } }

.cva .arch { position: relative; border: 1.5px solid var(--line); border-bottom: 0; border-radius: 999px 999px 0 0; }
.cva .arch::after { content: ""; position: absolute; left: -18%; right: -18%; bottom: 0; height: 1.5px; background: var(--line); z-index: 2; }
.cva .holo-beam { position: absolute; left: 50%; bottom: 2%; width: 92%; height: 92%; translate: -50% 0; background: radial-gradient(55% 100% at 50% 100%, rgb(90 160 255 / 0.5), rgb(60 120 255 / 0.12) 55%, transparent 75%); clip-path: polygon(24% 100%, 76% 100%, 100% 0, 0 0); animation: cva-holo-flicker 4s ease-in-out infinite; pointer-events: none; }
@keyframes cva-holo-flicker { 0%, 100% { opacity: 0.85; } 47% { opacity: 1; } 50% { opacity: 0.7; } 53% { opacity: 1; } }
.cva .holo-base { position: absolute; left: 50%; bottom: -5%; z-index: 2; width: 74%; aspect-ratio: 4.2; translate: -50% 0; border-radius: 50%; background: radial-gradient(closest-side, rgb(255 255 255 / 0.95), rgb(150 210 255 / 0.85) 22%, rgb(47 107 255 / 0.55) 50%, transparent 74%); box-shadow: 0 0 36px 6px rgb(70 140 255 / 0.55), inset 0 0 0 1.5px rgb(170 220 255 / 0.7); pointer-events: none; }
.cva .holo-ring { position: absolute; inset: -14%; border-radius: 50%; border: 1.5px solid rgb(150 210 255 / 0.75); box-shadow: 0 0 12px rgb(100 170 255 / 0.6); animation: cva-holo-ring 2.8s ease-out infinite; }
.cva .holo-ring-2 { animation-delay: 1.4s; }
@keyframes cva-holo-ring { from { transform: scale(0.75); opacity: 0.9; } to { transform: scale(1.25); opacity: 0; } }

/* ---------- Intro "journey" material (same as the product intro) ---------- */
.cva .j-stage { background: radial-gradient(65% 75% at 50% 42%, #2a6bff 0%, #1240d6 30%, #08227a 62%, #02040c 100%); }
.cva .j-stage-grid { background-image: linear-gradient(rgb(160 210 255 / 0.08) 1px, transparent 1px), linear-gradient(90deg, rgb(160 210 255 / 0.08) 1px, transparent 1px); background-size: 40px 40px; mask: radial-gradient(70% 70% at 50% 45%, #000 30%, transparent 85%); }
.cva .j-glass, .cva .j-card {
  position: relative;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.22) 0%, rgb(255 255 255 / 0.04) 38%, rgb(255 255 255 / 0) 60%),
    linear-gradient(160deg, rgb(46 104 235 / 0.62), rgb(9 26 96 / 0.86));
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.65),
    inset 0 0 0 1px rgb(160 210 255 / 0.42),
    inset 0 -12px 24px rgb(0 10 60 / 0.35),
    0 0 28px rgb(70 150 255 / 0.5),
    0 18px 40px rgb(0 6 40 / 0.55);
  color: #fff;
}
.cva .j-glass { backdrop-filter: blur(10px) saturate(140%); }
.cva .j-card { overflow: hidden; }
.cva .j-card::before {
  content: ""; position: absolute; inset: -40% -60%;
  background: linear-gradient(105deg, transparent 42%, rgb(255 255 255 / 0.28) 50%, transparent 58%);
  transform: translateX(-60%); animation: j-sheen 3.2s ease-in-out infinite; pointer-events: none;
}
@keyframes j-sheen { 0%, 55% { transform: translateX(-60%); } 100% { transform: translateX(60%); } }
.cva .j-kind { background: rgb(255 255 255 / 0.92); color: #1d4fe0; box-shadow: 0 0 12px rgb(140 200 255 / 0.9); }
.cva .j-tag { background: linear-gradient(90deg, #3b7bff, #1d4fe0); color: #fff; box-shadow: 0 0 10px rgb(60 130 255 / 0.7); }
.cva .j-icon { background: linear-gradient(135deg, #8fd0ff, #2f6bff); color: #fff; box-shadow: 0 0 18px rgb(80 160 255 / 0.7); }
.cva .j-badge { background: linear-gradient(90deg, #10b981, #059669); color: #fff; box-shadow: 0 0 16px rgb(16 185 129 / 0.6); }
.cva .j-beam-in { stroke-dasharray: 6 60; animation: j-flow 1.1s linear infinite; }
@keyframes j-flow { to { stroke-dashoffset: -66; } }

@media (prefers-reduced-motion: reduce) {
  .cva .edge-wake-mesh, .cva .orb::after, .cva .orb-talk, .cva .j-card::before, .cva .j-beam-in, .cva .holo-beam, .cva .holo-ring { animation: none; }
}
`;

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const H2 = 'text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.04] text-[var(--text)]';
const LEAD = 'text-lg leading-[1.45] text-[var(--dim)] md:text-2xl';
const ACCENT = 'text-[var(--signal-soft)]';

function SlideHead({ eyebrow, title, accent, lead }: { eyebrow: string; title: ReactNode; accent?: ReactNode; lead?: ReactNode }) {
  return (
    <>
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`${H2} mt-4`}>
          {title}
          {accent && (
            <>
              <br />
              <span className={ACCENT}>{accent}</span>
            </>
          )}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.14}>
          <p className={`${LEAD} mt-5 max-w-3xl`}>{lead}</p>
        </Reveal>
      )}
    </>
  );
}

type Resource = { label: string; url: string };

function Resources({ items, delay = 0.5, className = 'mt-10' }: { items: Resource[]; delay?: number; className?: string }) {
  return (
    <Reveal delay={delay} className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-2">Recursos</span>
        {items.map((r) => (
          <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="pill">
            {r.label}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ))}
      </div>
    </Reveal>
  );
}

function IconTile({ icon: Icon, tone = 'signal' }: { icon: LucideIcon; tone?: 'signal' | 'glow' | 'good' | 'amber' | 'violet' }) {
  return (
    <div
      className="grid h-11 w-11 place-items-center rounded-2xl"
      style={{ background: `color-mix(in srgb, var(--${tone}) 16%, var(--raise))`, color: `var(--${tone})` }}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}

/** Code block with a tiny highlighter: comments dim, strings blue-soft, keys glow. */
function Code({ code, title, className = '' }: { code: string; title?: string; className?: string }) {
  const lines = code.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n');
  return (
    <div className={`tile overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-3">
          <span className="dot" style={{ background: 'var(--danger)', opacity: 0.7 }} />
          <span className="dot" style={{ background: 'var(--amber)', opacity: 0.7 }} />
          <span className="dot" style={{ background: 'var(--good)', opacity: 0.7 }} />
          <span className="mono ml-2 text-xs text-[var(--dim)]">{title}</span>
        </div>
      )}
      <pre className="mono overflow-x-auto p-4 text-[12.5px] leading-[1.65] text-[var(--text)] md:text-[13px]">
        {lines.map((line, i) => {
          const trimmed = line.trimStart();
          if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
            return (
              <div key={i} className="text-[var(--dim)]">
                {line || ' '}
              </div>
            );
          }
          const parts = line.split(/("(?:[^"\\]|\\.)*"|`[^`]*`)/g);
          return (
            <div key={i}>
              {parts.map((p, j) =>
                /^["`]/.test(p) ? (
                  <span key={j} className="text-[var(--signal-soft)]">
                    {p}
                  </span>
                ) : (
                  <span key={j}>{p}</span>
                ),
              )}
              {line === '' ? ' ' : null}
            </div>
          );
        })}
      </pre>
    </div>
  );
}

function ConceptList({ items, tone = 'signal' }: { items: { term: string; body: string }[]; tone?: string }) {
  return (
    <ol className="space-y-2">
      {items.map((it, i) => (
        <li key={it.term} className="tile flex gap-4 p-4">
          <span className="mono mt-0.5 text-sm" style={{ color: `var(--${tone})` }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <p className="mono text-[15px] text-[var(--text)]">{it.term}</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--dim)]">{it.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* 01 · Hook                                                           */
/* ------------------------------------------------------------------ */

function HookSlide() {
  return (
    <div className="grid h-full items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <Reveal>
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill">
              <span className="dot bg-[var(--good)]" /> DevFest Medellín 2026
            </span>
            <span className="pill">GDG Medellín</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mono mt-8 text-sm tracking-[0.2em] text-[var(--signal-soft)]">NOSHY · CONCIERGE</p>
          <h1 className="mt-3 text-[clamp(2.5rem,5.4vw,5rem)] leading-[1.02] text-[var(--text)]">
            Agente comercial que
            <br />
            <span className={ACCENT}>escucha, entiende y actúa.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className={`${LEAD} mt-7 max-w-2xl`}>
            Voz en tiempo real + UI generativa + herramientas reales. Construido con Google ADK, AG-UI, A2UI,
            CopilotKit y LiveKit.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Ver demo <ArrowRight className="h-4 w-4" />
            </a>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-quiet">
              <Github className="h-4 w-4" /> Código
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="mt-8 text-sm text-[var(--dim)]">Angel Arrieta · Frontend & UI agéntica</p>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="mx-auto w-full max-w-[460px]">
        <HookAvatar />
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Voz para todos                                                 */
/* ------------------------------------------------------------------ */

const PEOPLE = [
  {
    icon: Calendar,
    who: 'Un recordatorio',
    quote: '“Recuérdame la cita a las tres.”',
    body: 'Lo de todos los días: agendar, recordar, no olvidar. Se pide hablando, sin abrir el calendario.',
  },
  {
    icon: Phone,
    who: 'Una llamada',
    quote: '“Llama a mamá.”',
    body: 'Contactar a alguien no debería ser buscar contactos y tocar tres pantallas. Es una frase.',
  },
  {
    icon: ShoppingBag,
    who: 'Un pedido',
    quote: '“Pide el domicilio de siempre.”',
    body: 'Compras, citas, preguntas del día a día. La voz deja hacer lo básico sin aprender menús.',
  },
];

/* ------------------------------------------------------------------ */
/* 03 · Evolución de las interfaces                                    */
/* ------------------------------------------------------------------ */

type MediaSrc = {
  kind: 'image' | 'video';
  src: string;
  poster?: string;
  fit?: 'cover' | 'contain';
  bg?: string;
  alt: string;
  caption?: string;
};

/** Photo or muted looping clip inside a rounded frame, with a slow Ken Burns drift on photos. */
function Media({ media, className = '' }: { media: MediaSrc; className?: string }) {
  const fit = media.fit === 'contain' ? 'object-contain' : 'object-cover';
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ background: media.bg ?? 'var(--raise)' }}>
      {media.kind === 'video' ? (
        <video
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          aria-label={media.alt}
          className={`h-full w-full ${fit}`}
        />
      ) : (
        <motion.img
          src={media.src}
          alt={media.alt}
          draggable={false}
          className={`h-full w-full ${fit}`}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: 'easeOut' }}
        />
      )}
    </div>
  );
}

/** Thumbnail that opens the same picture or video in a full-screen lightbox. */
function ExpandableMedia({ media, aspect = 'aspect-[4/3]' }: { media: MediaSrc; aspect?: string }) {
  const [open, setOpen] = useState(false);
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);

  const close = useCallback(() => {
    delete document.body.dataset.mediaLightbox;
    setOpen(false);
  }, []);

  const openLightbox = () => {
    document.body.dataset.mediaLightbox = 'open';
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onClose = () => close();
    window.addEventListener('close-media-lightbox', onClose);
    return () => window.removeEventListener('close-media-lightbox', onClose);
  }, [open, close]);

  // Fullscreen playback with sound (thumbnail stays muted/looping).
  useEffect(() => {
    if (!open || media.kind !== 'video') return;
    const video = lightboxVideoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    const play = () => {
      void video.play().catch(() => {
        // Autoplay-with-sound blocked: controls stay available so the viewer can unmute.
      });
    };
    if (video.readyState >= 2) play();
    else video.addEventListener('loadeddata', play, { once: true });
  }, [open, media.kind]);

  useEffect(() => () => {
    delete document.body.dataset.mediaLightbox;
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openLightbox}
        className="group relative block w-full cursor-zoom-in text-left"
        aria-label={`Ver en pantalla completa: ${media.alt}`}
      >
        <Media media={media} className={`pointer-events-none ${aspect}`} />
        {media.caption && (
          <span className="pointer-events-none absolute left-2 top-2 mono inline-flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[11px] tracking-[0.5px] text-[var(--amber)] backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--amber)]" />
            {media.caption}
          </span>
        )}
        <span className="pointer-events-none absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] text-white backdrop-blur">
          <Expand className="h-3.5 w-3.5" aria-hidden />
          Pantalla completa
        </span>
      </button>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4 md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={media.alt}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              autoFocus
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
            {media.kind === 'video' ? (
              <video
                ref={lightboxVideoRef}
                src={media.src}
                poster={media.poster}
                controls
                autoPlay
                loop
                playsInline
                className="max-h-[90svh] max-w-full rounded-2xl bg-black"
                onClick={(event) => event.stopPropagation()}
              />
            ) : (
              <img
                src={media.src}
                alt={media.alt}
                className="max-h-[90svh] max-w-full rounded-2xl object-contain"
                onClick={(event) => event.stopPropagation()}
              />
            )}
          </div>,
          document.body,
        )}
    </>
  );
}

/** Case card media: single expandable frame, or a swipeable gallery with captions. */
function ExpandableMediaGallery({ media, aspect = 'aspect-[4/3]', label }: { media: MediaSrc[]; aspect?: string; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);
  const multiple = media.length > 1;
  const current = media[active] ?? media[0];

  const close = useCallback(() => {
    delete document.body.dataset.mediaLightbox;
    setOpen(false);
  }, []);

  const openLightbox = () => {
    document.body.dataset.mediaLightbox = 'open';
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onClose = () => close();
    window.addEventListener('close-media-lightbox', onClose);
    return () => window.removeEventListener('close-media-lightbox', onClose);
  }, [open, close]);

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([i, video]) => {
      if (!video) return;
      if (Number(i) === active) video.play().catch(() => {});
      else video.pause();
    });
  }, [active]);

  useEffect(() => {
    if (!open || current.kind !== 'video') return;
    const video = lightboxVideoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    const play = () => {
      void video.play().catch(() => {});
    };
    if (video.readyState >= 2) play();
    else video.addEventListener('loadeddata', play, { once: true });
  }, [open, current]);

  useEffect(() => () => {
    delete document.body.dataset.mediaLightbox;
  }, []);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = (index + media.length) % media.length;
    track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  if (!multiple) {
    return <ExpandableMedia media={media[0]} aspect={aspect} />;
  }

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl ${aspect}`}
        style={{ background: current.bg ?? 'var(--raise)' }}
        role="region"
        aria-roledescription="carousel"
        aria-label={`Galería · ${label}`}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={0}
          className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--glow)] [&::-webkit-scrollbar]:hidden"
        >
          {media.map((item, i) => {
            const fit = item.fit === 'contain' ? 'object-contain' : 'object-cover';
            return (
              <div
                key={item.src}
                className="relative h-full w-full flex-none snap-center overflow-hidden"
                style={{ background: item.bg ?? 'var(--raise)' }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} de ${media.length}`}
              >
                {item.kind === 'video' ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={item.src}
                    poster={item.poster}
                    muted
                    loop
                    playsInline
                    aria-label={item.alt}
                    className={`h-full w-full ${fit}`}
                  />
                ) : (
                  <img src={item.src} alt={item.alt} draggable={false} className={`h-full w-full ${fit}`} />
                )}
              </div>
            );
          })}
        </div>

        {current.caption && (
          <span className="pointer-events-none absolute left-2 top-2 mono z-[1] inline-flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[11px] tracking-[0.5px] text-[var(--amber)] backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--amber)]" />
            {current.caption}
          </span>
        )}

        <button
          type="button"
          onClick={openLightbox}
          className="absolute right-2 top-2 z-[1] inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] text-white backdrop-blur hover:bg-black/85"
          aria-label={`Ver en pantalla completa: ${current.alt}`}
        >
          <Expand className="h-3.5 w-3.5" aria-hidden />
          Pantalla completa
        </button>

        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Anterior"
          className="absolute left-2 top-1/2 z-[1] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur hover:bg-black/75"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="Siguiente"
          className="absolute right-2 top-1/2 z-[1] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur hover:bg-black/75"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="absolute bottom-2 left-1/2 z-[1] flex -translate-x-1/2 gap-1 rounded-full bg-black/55 px-1.5 backdrop-blur">
          {media.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Mostrar ${i + 1}`}
              aria-current={i === active}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all ${i === active ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`}
              />
            </button>
          ))}
        </div>
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4 md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              autoFocus
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
            {current.kind === 'video' ? (
              <video
                ref={lightboxVideoRef}
                src={current.src}
                poster={current.poster}
                controls
                autoPlay
                loop
                playsInline
                className="max-h-[90svh] max-w-full rounded-2xl bg-black"
                onClick={(event) => event.stopPropagation()}
              />
            ) : (
              <img
                src={current.src}
                alt={current.alt}
                className="max-h-[90svh] max-w-full rounded-2xl object-contain"
                onClick={(event) => event.stopPropagation()}
              />
            )}
          </div>,
          document.body,
        )}
    </>
  );
}

function Credits({ text, delay = 0.8 }: { text: string; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <p className="mt-6 text-[11px] leading-relaxed text-[var(--dim)] opacity-80">{text}</p>
    </Reveal>
  );
}

const PEOPLE_MEDIA: MediaSrc = {
  kind: 'video',
  src: '/devfest-2026/voice-daily.mp4',
  poster: '/devfest-2026/voice-daily-poster.jpg',
  bg: '#070a14',
  alt: 'Persona usando la voz para hacer tareas cotidianas',
};

function PeopleSlide() {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(220px,32%)] lg:gap-10">
        <div>
          <SlideHead
            eyebrow="01 · Para quién"
            title="La voz deja hacer"
            accent="lo de todos los días."
            lead="Recordatorios, llamadas, pedidos, preguntas. Lo básico de la vida diaria, con la interfaz que ya sabemos usar: hablar."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {PEOPLE.map((p, i) => (
              <Reveal key={p.who} delay={0.2 + i * 0.08}>
                <div className="tile flex h-full flex-col gap-4 p-5">
                  <IconTile icon={p.icon} tone={i === 0 ? 'glow' : i === 1 ? 'signal' : 'good'} />
                  <div>
                    <p className="eyebrow">{p.who}</p>
                    <p className="mt-2 text-xl leading-snug text-[var(--text)]">{p.quote}</p>
                  </div>
                  <p className="mt-auto text-sm leading-relaxed text-[var(--dim)]">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.28} className="mx-auto w-full max-w-[260px] lg:mx-0 lg:max-w-[min(100%,320px)]">
          <ExpandableMedia media={PEOPLE_MEDIA} aspect="aspect-[9/16]" />
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02.5 · Repo QR — escanea el código del agente                       */
/* ------------------------------------------------------------------ */

function RepoQrSlide() {
  return (
    <div className="flex min-h-[calc(100svh-14rem)] flex-col items-center justify-center text-center">
      <Reveal>
        <p className="eyebrow">02.5 · Código abierto</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`${H2} mt-4 max-w-3xl`}>
          Escanea el repo.
          <br />
          <span className={ACCENT}>Todo el código del agente.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <p className={`${LEAD} mx-auto mt-5 max-w-xl`}>
          Google ADK · LiveKit · CopilotKit · AG-UI. Quickstart en 5 minutos.
        </p>
      </Reveal>
      <Reveal delay={0.22} className="mt-10">
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex flex-col items-center gap-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_0_48px_rgb(47_107_255/0.35)]">
            <QRCodeSVG value={REPO_URL} size={280} fgColor="#05070d" bgColor="#ffffff" level="M" />
          </div>
          <span className="inline-flex items-center gap-2 text-[15px] text-[var(--signal-soft)]">
            <Github className="h-4 w-4" />
            github.com/anuidev8/devfest-medellin-2026-voice-agent-comercial
          </span>
        </a>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03.5 · Quién habla — perfil (frontend, no comunidad)                */
/* ------------------------------------------------------------------ */

function WhoSlide() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex min-h-[calc(100svh-14rem)] flex-col justify-center lg:ml-[calc(50%-50vw)] lg:w-screen lg:pl-10 lg:pr-[min(42vw,900px)]">
      <div className="w-full max-w-xl lg:ml-auto lg:max-w-[min(100%,34rem)] lg:pr-6">
        <SlideHead
          eyebrow="02.5 · Quién habla"
          title="Soy Angel."
          accent="Frontend."
          lead="Desarrollador de software hace casi 7 años, especializado en frontend. Con mi propia agencia construyo productos con interfaz de voz, y he liderado el trabajo con negocios de wellness. Fundador de Visible Builders y organizador de The AI Hub, bilingüe, en Medellín."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Reveal delay={0.4}>
            <QrCard value={SITE_URL} label="angelmateus.com" size={104} className="!gap-2 !p-3" />
          </Reveal>
          <Reveal delay={0.48}>
            <QrCard value={`${SITE_URL}/work`} label="El trabajo" sub="angelmateus.com/work" size={104} className="!gap-2 !p-3" />
          </Reveal>
        </div>
      </div>
      <img
        src="/devfest-2026/avatar-yoga.png"
        alt="Angel en postura de yoga"
        className="mx-auto mt-8 h-auto w-[min(100%,360px)] lg:hidden"
        draggable={false}
      />
      {mounted &&
        createPortal(
          <img
            src="/devfest-2026/avatar-yoga.png"
            alt=""
            className="pointer-events-none fixed bottom-0 right-0 z-[15] hidden h-[92svh] w-[min(42vw,900px)] object-contain object-bottom lg:block"
            draggable={false}
          />,
          document.body,
        )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · El futuro de las interfaces                                    */
/* ------------------------------------------------------------------ */

const FUTURES: { icon: LucideIcon; title: string; body: string; source: string; media: MediaSrc }[] = [
  {
    icon: Bot,
    title: '¿Jarvis?',
    body: 'Un asistente siempre presente que te escucha, entiende el contexto y actúa por ti.',
    source: 'LiveKit Agents UI · Aura',
    media: {
      kind: 'video',
      src: '/devfest-2026/future-livekit-aura.mp4',
      poster: '/devfest-2026/future-livekit-aura-poster.jpg',
      fit: 'contain',
      bg: '#ffffff',
      alt: 'Visualizador de voz Aura de LiveKit reaccionando al estado del agente',
    },
  },
  {
    icon: Glasses,
    title: '¿Lentes?',
    body: 'La UI flota sobre el mundo real: contexto visual + voz, sin sacar el teléfono.',
    source: 'Rokid Glasses, 2025',
    media: {
      kind: 'video',
      src: '/devfest-2026/future-rokid-glasses.mp4',
      poster: '/devfest-2026/future-rokid-glasses-poster.jpg',
      bg: '#000000',
      alt: 'Lentes inteligentes con interfaz de realidad aumentada',
    },
  },
  {
    icon: Sparkles,
    title: '¿Nada?',
    body: 'La UI aparece solo cuando hace falta: el agente la genera, la usas y desaparece.',
    source: 'CopilotKit · A2UI sobre AG-UI',
    media: {
      kind: 'video',
      src: '/devfest-2026/future-copilotkit-a2ui.mp4',
      poster: '/devfest-2026/future-copilotkit-a2ui-poster.jpg',
      bg: '#05032a',
      alt: 'Un agente genera una tarjeta de vuelos con A2UI y CopilotKit la renderiza',
    },
  },
];

function FutureSlide() {
  return (
    <div className="flex h-full flex-col justify-center">
      <SlideHead eyebrow="03 · Hacia dónde vamos" title="El futuro de las interfaces" accent="¿Jarvis, lentes… o nada?" />
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {FUTURES.map((f, i) => (
          <Reveal key={f.title} delay={0.15 + i * 0.1}>
            <div className="tile flex h-full flex-col overflow-hidden p-2">
              <div className="relative">
                <Media media={f.media} className="aspect-[2/1]" />
                <span className="mono absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] text-[var(--text)] backdrop-blur">
                  {f.source}
                </span>
              </div>
              <div className="flex items-start gap-3 px-3 pb-3 pt-4">
                <IconTile icon={f.icon} tone="glow" />
                <div>
                  <p className="text-2xl text-[var(--text)]">{f.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--dim)]">{f.body}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Credits text="Video: “Rokid Glasses in 2025” — BooredAtWork (CC BY 4.0), vía Wikimedia Commons. Capturas: LiveKit Agents UI (docs.livekit.io) y CopilotKit AG-UI + A2UI (copilotkit.ai)." />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 04.1 · Hoy ya existe: apps de voz + CopilotKit                      */
/* ------------------------------------------------------------------ */

const TODAY: { label: string; media: MediaSrc; area: string }[] = [
  {
    label: 'Gemini Live · voz + cámara + apps',
    area: 'lg:row-span-2',
    media: {
      kind: 'video',
      src: '/devfest-2026/voice-gemini-live.mp4',
      poster: '/devfest-2026/voice-gemini-live-poster.jpg',
      fit: 'contain',
      bg: '#000000',
      alt: 'Gemini Live: conversación por voz que crea tareas y resúmenes en pantalla',
    },
  },
  {
    label: 'ElevenLabs Agents · chat y voz',
    area: '',
    media: { kind: 'image', src: '/devfest-2026/voice-elevenlabs-agent.jpg', fit: 'contain', bg: 'linear-gradient(160deg,#1f5aa8,#3f8f9a 60%,#4d9a6a)', alt: 'Widget de agente conversacional de ElevenLabs' },
  },
  {
    label: 'CopilotKit · Generative UI sobre AG-UI',
    area: '',
    media: {
      kind: 'image',
      src: '/devfest-2026/ck-genui-diagram.jpg',
      fit: 'contain',
      bg: '#eef0fa',
      alt: 'Diagrama de CopilotKit: el agente genera UI que viaja por AG-UI hasta la app',
    },
  },
  {
    label: 'CopilotKit · un agente, todos los canales (incluye Google ADK)',
    area: 'lg:col-span-2',
    media: {
      kind: 'image',
      src: '/devfest-2026/ck-channels.jpg',
      fit: 'contain',
      bg: 'linear-gradient(90deg,#8eb6f1,#7b88e7)',
      alt: 'CopilotKit conecta frameworks de agentes como Google ADK con Web, iOS, Android, Slack, Teams y WhatsApp',
    },
  },
];

function TodaySlide() {
  return (
    <div className="flex h-full flex-col justify-center">
      <SlideHead eyebrow="03.1 · Esto ya existe" title="Así se ven hoy" accent="las interfaces de voz y UI generativa." />
      <div className="mt-8 grid gap-3 lg:h-[29rem] lg:grid-cols-[0.62fr_1fr_1fr] lg:grid-rows-2">
        {TODAY.map((t, i) => (
          <Reveal key={t.label} delay={0.15 + i * 0.1} className={`${t.area} h-full min-h-0`}>
            <div className="tile relative h-full overflow-hidden p-2">
              <Media media={t.media} className="h-full min-h-[220px]" />
              <span className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1.5 text-[12px] text-[var(--text)] backdrop-blur">
                {t.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
      <Credits text="Capturas de gemini.google, elevenlabs.io y copilotkit.ai — © sus respectivos dueños, uso ilustrativo." delay={0.6} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 06 · El problema                                                    */
/* ------------------------------------------------------------------ */

function ProblemSlide() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex min-h-[calc(100svh-14rem)] items-center justify-center lg:pr-[min(42vw,520px)]">
      <div className="w-full max-w-5xl">
        <Reveal>
          <p className="eyebrow">05 · El problema</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-3 text-[clamp(2.35rem,4.8vw,4.6rem)] leading-[0.96] tracking-[-0.03em] text-[var(--text)]">
            Vender IA… <span className={ACCENT}>con IA.</span>
          </h2>
        </Reveal>

        <div className="mt-4 grid content-start gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <Reveal delay={0.15}>
            <div className="tile flex h-full flex-col justify-center gap-2 p-5 md:gap-3 md:p-6">
              <span className="eyebrow">Caso A · Consultoría</span>
              <p className="text-[clamp(1.2rem,1.9vw,1.8rem)] leading-snug text-[var(--text)]">
                Una empresa que construye con IA necesitaba <span className={ACCENT}>demostrarlo</span> en vivo, no con
                slides.
              </p>
              <p className="text-[15px] leading-snug text-[var(--dim)] md:text-lg">
                Cada comercial tenía su Excel. El agente centraliza la conversación y potencia al equipo.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.22} className="hidden place-items-center lg:grid">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--signal)] text-2xl text-white">+</div>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="tile flex h-full flex-col justify-center gap-2 p-5 md:gap-3 md:p-6">
              <span className="eyebrow">Caso B · Mi comunidad</span>
              <p className="text-[clamp(1.2rem,1.9vw,1.8rem)] leading-snug text-[var(--text)]">
                Personas que <span className={ACCENT}>empiezan a vender</span> y no saben mostrar su producto.
              </p>
              <p className="text-[15px] leading-snug text-[var(--dim)] md:text-lg">
                Les cuesta el pitch y el seguimiento. La comunidad tiene el talento para cada necesidad.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.34} className="mt-3">
          <div className="blue-tile flex flex-col gap-1 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-5">
            <p className="text-[clamp(1.15rem,1.8vw,1.7rem)] leading-snug">Los combiné: un concierge comercial de voz.</p>
            <p className="shrink-0 text-sm text-white/80 md:text-base">Discovery → propuesta → reunión → follow-up</p>
          </div>
        </Reveal>
        <img
          src="/devfest-2026/avatar-thinking.png"
          alt=""
          className="mx-auto mt-6 h-auto w-[min(100%,380px)] lg:hidden"
          draggable={false}
        />
      </div>
      {mounted &&
        createPortal(
          <img
            src="/devfest-2026/avatar-thinking.png"
            alt=""
            className="pointer-events-none fixed bottom-0 right-0 z-[15] hidden h-[100svh] w-[min(42vw,520px)] object-contain object-bottom lg:block"
            draggable={false}
          />,
          document.body,
        )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 07 · Casos de uso reales                                            */
/* ------------------------------------------------------------------ */

const CASES: {
  n: string;
  icon: LucideIcon;
  title: string;
  client?: string;
  body: string;
  stack: string[];
  tone: 'amber' | 'signal' | 'violet';
  media: MediaSrc[];
}[] = [
  {
    n: '01',
    icon: AudioLines,
    title: 'SETI',
    body: 'Agente comercial de voz para uso interno: discovery por voz, propuesta generada como UI, reunión agendada y correo de seguimiento.',
    stack: ['Google ADK', 'Gemini', 'Google Cloud (GCP)', 'LiveKit'],
    tone: 'signal',
    media: [
      {
        kind: 'image',
        src: '/devfest-2026/seti-escuchando.png',
        fit: 'cover',
        bg: '#05070d',
        alt: 'Agente de voz SETI escuchando: micrófono rojo y onda de audio',
      },
    ],
  },
  {
    n: '02',
    icon: Radio,
    title: 'Huella Digital',
    client: 'SETI × Corficolombiana',
    body: 'Experiencia de IA para explorar el propio perfil digital, construida en IA y frontend con LiveKit, LangGraph y CopilotKit sobre AWS. En vivo con líderes y ejecutivos en Conexión Inteligente.',
    stack: ['LiveKit', 'LangGraph', 'CopilotKit', 'AWS'],
    tone: 'amber',
    media: [
      {
        kind: 'video',
        src: '/devfest-2026/huella-digital-kiosk.mp4',
        poster: '/devfest-2026/huella-digital-kiosk-poster.jpg',
        fit: 'contain',
        bg: '#0b1020',
        alt: 'Kiosco de Huella Digital en Conexión Inteligente: una persona con audífonos frente a la pantalla del perfil',
        caption: 'EN VIVO',
      },
      {
        kind: 'image',
        src: '/events/conexion-inteligente/huella-digital.jpg',
        fit: 'cover',
        bg: '#0b1020',
        alt: 'Angel en el stand Tu Huella Digital durante Conexión Inteligente',
        caption: 'EL STAND',
      },
      {
        kind: 'image',
        src: '/work/seti-conexion-inteligente.jpg',
        fit: 'contain',
        bg: '#0b1020',
        alt: 'Angel con un invitado en el stand de SETI durante Conexión Inteligente',
        caption: 'CONEXIÓN INTELIGENTE',
      },
    ],
  },
  {
    n: '03',
    icon: MessageSquare,
    title: 'Chat MCP-UI para Copilot Enterprise',
    body: 'Un agente en Microsoft Teams que consulta los recursos de toda la compañía y responde con componentes, no con párrafos.',
    stack: ['MCP', 'MCP-UI', 'Teams', 'Copilot Enterprise'],
    tone: 'violet',
    media: [
      {
        kind: 'image',
        src: '/devfest-2026/mcp-ui-chat.jpg',
        fit: 'cover',
        bg: '#f4f1ea',
        alt: 'MCP Apps renderizando una interfaz dentro del chat',
      },
    ],
  },
];

function CasesSlide() {
  return (
    <div className="flex h-full flex-col justify-center">
      <SlideHead
        eyebrow="05.1 · Casos reales"
        title="Tres productos en producción."
        accent="Voz + AG-UI + UI generativa."
        lead="El mismo patrón, en productos que ya están en uso."
      />
      <div className="mt-8 grid gap-3 lg:grid-cols-3">
        {CASES.map((c, i) => (
          <Reveal key={c.n} delay={0.2 + i * 0.08}>
            <div className="tile flex h-full flex-col overflow-hidden p-2">
              <ExpandableMediaGallery media={c.media} label={c.title} />
              <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-4">
                <div className="flex items-center justify-between">
                  <IconTile icon={c.icon} tone={c.tone} />
                  <span className="mono text-sm text-[var(--dim)]">{c.n}</span>
                </div>
                {c.client && <p className="eyebrow">{c.client}</p>}
                <p className="text-2xl leading-snug text-[var(--text)]">{c.title}</p>
                <p className="text-sm leading-relaxed text-[var(--dim)]">{c.body}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {c.stack.map((s) => (
                    <span key={s} className="mono rounded-full bg-[var(--raise)] px-3 py-1 text-[11px] text-[var(--text)]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Credits text="Pantalla de voz: agente comercial SETI. Galería Huella Digital: kiosco, stand y networking en Conexión Inteligente (SETI × Corficolombiana). Captura MCP Apps: demo Excalidraw, modelcontextprotocol/ext-apps." />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 08 · Arquitectura — canvas vertical (arrastrar, rueda, zoom)        */
/* ------------------------------------------------------------------ */

const ANTHROPIC_URL = 'https://www.anthropic.com/research/building-effective-agents';

type JIconName = 'user' | 'mic' | 'spark' | 'layers' | 'brain' | 'doc' | 'check' | 'flow' | 'cloud' | 'code' | 'tool' | 'db' | 'star' | 'image' | 'pause';

/** Same stroke icon set as the product intro (1.8 stroke, round caps). */
function JIcon({ name, className = 'h-4 w-4' }: { name: JIconName; className?: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {name === 'user' && <g {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></g>}
      {name === 'mic' && <g {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></g>}
      {name === 'spark' && <g {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></g>}
      {name === 'layers' && <g {...p}><path d="M12 3 3 8l9 5 9-5z" /><path d="m3 13 9 5 9-5" /></g>}
      {name === 'brain' && <g {...p}><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1" /></g>}
      {name === 'doc' && <g {...p}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></g>}
      {name === 'check' && <g {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></g>}
      {name === 'flow' && <g {...p}><path d="M4 7h11l-3-3M20 17H9l3 3" /></g>}
      {name === 'cloud' && <g {...p}><path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z" /></g>}
      {name === 'code' && <g {...p}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" /></g>}
      {name === 'tool' && <g {...p}><path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z" /></g>}
      {name === 'star' && <g {...p}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></g>}
      {name === 'image' && <g {...p}><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></g>}
      {name === 'pause' && <g {...p}><path d="M9 5v14M15 5v14" /></g>}
      {name === 'db' && <g {...p}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" /></g>}
    </svg>
  );
}

type CanvasNode = {
  id: string;
  kind: 'main' | 'child' | 'pill';
  icon: JIconName;
  title: string;
  eyebrow?: string;
  sub?: string;
  badge?: string;
  dashed?: boolean;
  mono?: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
};

const CANVAS_W = 1400;
const CANVAS_H = 1700;

const CHILD_H = 46;
const fnY = (i: number) => 556 + i * 58;

const CANVAS_NODES: CanvasNode[] = [
  // Voz (arriba)
  { id: 'eleven', kind: 'child', icon: 'mic', title: 'ElevenLabs', x: 300, y: 30, w: 200, h: CHILD_H },
  { id: 'grt', kind: 'child', icon: 'spark', title: 'Google Realtime', x: 900, y: 30, w: 220, h: CHILD_H },
  { id: 'custom', kind: 'main', icon: 'mic', eyebrow: 'Pipeline', title: 'LiveKit Custom', sub: 'Voz por piezas: eliges cada proveedor.', x: 250, y: 145, w: 300, h: 124 },
  { id: 'stt', kind: 'child', icon: 'flow', title: 'STT', mono: true, x: 40, y: 126, w: 150, h: 40 },
  { id: 'llm', kind: 'child', icon: 'brain', title: 'LLM', mono: true, x: 40, y: 187, w: 150, h: 40 },
  { id: 'tts', kind: 'child', icon: 'mic', title: 'TTS', mono: true, x: 40, y: 248, w: 150, h: 40 },
  { id: 'cloud', kind: 'main', icon: 'cloud', eyebrow: 'Infra', title: 'LiveKit Cloud', sub: 'Audio en tiempo real, escalable.', x: 850, y: 145, w: 300, h: 124 },
  { id: 'rooms', kind: 'child', icon: 'user', title: 'Rooms', mono: true, x: 1210, y: 150, w: 160, h: 40 },
  { id: 'webrtc', kind: 'child', icon: 'flow', title: 'WebRTC', mono: true, x: 1210, y: 212, w: 160, h: 40 },
  { id: 'voice', kind: 'main', icon: 'mic', eyebrow: 'Voz', title: 'LiveKit Voice', sub: 'Conversa, entiende y decide cuándo consultar al cerebro.', badge: 'Orquestador', x: 490, y: 360, w: 420, h: 140 },
  // Interfaz (medio)
  { id: 'ck', kind: 'main', icon: 'layers', eyebrow: 'Middleware', title: 'CopilotKit Runtime', sub: 'Renderiza según la respuesta de ADK + frontend tools.', badge: 'Middleware', x: 170, y: 640, w: 380, h: 140 },
  { id: 'app', kind: 'main', icon: 'user', eyebrow: 'Next.js', title: 'App Client', sub: 'La interfaz que ve el usuario, con las funciones de CopilotKit.', x: 780, y: 640, w: 340, h: 140 },
  { id: 'f1', kind: 'child', icon: 'check', title: 'Shared state', x: 1180, y: fnY(0), w: 205, h: CHILD_H },
  { id: 'f2', kind: 'child', icon: 'check', title: 'Render UI', x: 1180, y: fnY(1), w: 205, h: CHILD_H },
  { id: 'f3', kind: 'child', icon: 'check', title: 'Streaming', x: 1180, y: fnY(2), w: 205, h: CHILD_H },
  { id: 'f4', kind: 'child', icon: 'check', title: 'Catálogo A2UI', x: 1180, y: fnY(3), w: 205, h: CHILD_H },
  { id: 'f5', kind: 'child', icon: 'check', title: 'Human-in-the-loop', x: 1180, y: fnY(4), w: 205, h: CHILD_H },
  { id: 'f6', kind: 'child', icon: 'check', title: 'Generative UI', x: 1180, y: fnY(5), w: 205, h: CHILD_H },
  { id: 'agui', kind: 'pill', icon: 'flow', title: 'AG-UI protocol', x: 0, y: 910, w: 210, h: 52, dashed: true },
  { id: 'a2ui', kind: 'main', icon: 'code', eyebrow: 'Formato', title: 'A2UI', sub: 'UI declarativa como JSON.', x: 260, y: 880, w: 290, h: 112 },
  // Cerebro (abajo)
  { id: 'adk', kind: 'main', icon: 'brain', eyebrow: 'Backend', title: 'Google ADK', sub: 'LlmAgent · Gemini. Piensa y responde con texto + A2UI JSON.', badge: 'Cerebro', x: 170, y: 1110, w: 420, h: 150 },
  { id: 'adkweb', kind: 'child', icon: 'code', title: 'ADK Web · dev UI', dashed: true, x: 0, y: 1300, w: 200, h: CHILD_H },
  { id: 'catalog', kind: 'main', icon: 'doc', eyebrow: 'Catálogo A2UI', title: 'Componentes permitidos', sub: 'Lo único que el agente puede pintar.', x: 720, y: 1120, w: 340, h: 130 },
  { id: 'plan', kind: 'child', icon: 'doc', title: 'Plan', x: 1140, y: 1092, w: 200, h: CHILD_H },
  { id: 'com', kind: 'child', icon: 'user', title: 'Comunidad', x: 1140, y: 1162, w: 200, h: CHILD_H },
  { id: 'rdb', kind: 'child', icon: 'db', title: 'Resource DB', x: 1140, y: 1232, w: 200, h: CHILD_H },
  { id: 'agent', kind: 'main', icon: 'spark', eyebrow: 'Agent', title: 'LLM + tools', sub: 'Elige qué tool usar en cada turno.', x: 230, y: 1370, w: 300, h: 116 },
  { id: 't1', kind: 'child', icon: 'tool', title: 'send_telegram', mono: true, x: 20, y: 1590, w: 220, h: CHILD_H },
  { id: 't2', kind: 'child', icon: 'tool', title: 'search_resources', mono: true, x: 270, y: 1590, w: 230, h: CHILD_H },
  { id: 't3', kind: 'child', icon: 'tool', title: 'update_plan', mono: true, x: 530, y: 1590, w: 200, h: CHILD_H },
  { id: 't4', kind: 'child', icon: 'tool', title: '+ más tools', mono: true, dashed: true, x: 760, y: 1590, w: 190, h: CHILD_H },
];

type Side = 'top' | 'bottom' | 'left' | 'right';
type CanvasEdge = { from: string; fs: Side; to: string; ts: Side; tone: 'data' | 'voice' | 'child' | 'human'; dashed?: boolean; label?: string };

const CANVAS_EDGES: CanvasEdge[] = [
  { from: 'eleven', fs: 'bottom', to: 'custom', ts: 'top', tone: 'voice' },
  { from: 'grt', fs: 'bottom', to: 'cloud', ts: 'top', tone: 'voice' },
  ...['stt', 'llm', 'tts'].map((id) => ({ from: id, fs: 'right' as Side, to: 'custom', ts: 'left' as Side, tone: 'child' as const })),
  ...['rooms', 'webrtc'].map((id) => ({ from: 'cloud', fs: 'right' as Side, to: id, ts: 'left' as Side, tone: 'child' as const })),
  { from: 'custom', fs: 'bottom', to: 'voice', ts: 'top', tone: 'voice' },
  { from: 'cloud', fs: 'bottom', to: 'voice', ts: 'top', tone: 'voice' },
  { from: 'voice', fs: 'bottom', to: 'ck', ts: 'top', tone: 'voice', dashed: true, label: 'RPC · consult_brain' },
  { from: 'voice', fs: 'bottom', to: 'app', ts: 'top', tone: 'voice', label: 'voz' },
  { from: 'ck', fs: 'right', to: 'app', ts: 'left', tone: 'data', label: '↔' },
  ...['f1', 'f2', 'f3', 'f4', 'f5', 'f6'].map((id) => ({ from: 'app', fs: 'right' as Side, to: id, ts: 'left' as Side, tone: 'child' as const })),
  { from: 'agui', fs: 'right', to: 'a2ui', ts: 'left', tone: 'data', dashed: true },
  { from: 'a2ui', fs: 'top', to: 'ck', ts: 'bottom', tone: 'data' },
  { from: 'adk', fs: 'top', to: 'a2ui', ts: 'bottom', tone: 'data', label: 'A2UI JSON' },
  { from: 'adkweb', fs: 'top', to: 'adk', ts: 'left', tone: 'child', dashed: true },
  { from: 'catalog', fs: 'left', to: 'adk', ts: 'right', tone: 'data' },
  ...['plan', 'com', 'rdb'].map((id) => ({ from: 'catalog', fs: 'right' as Side, to: id, ts: 'left' as Side, tone: 'child' as const })),
  { from: 'adk', fs: 'bottom', to: 'agent', ts: 'top', tone: 'data' },
  ...['t1', 't2', 't3', 't4'].map((id) => ({ from: 'agent', fs: 'bottom' as Side, to: id, ts: 'top' as Side, tone: 'child' as const })),
];

const NODE_BY_ID = Object.fromEntries(CANVAS_NODES.map((n) => [n.id, n]));

function anchor(n: CanvasNode, s: Side) {
  if (s === 'top') return { x: n.x + n.w / 2, y: n.y };
  if (s === 'bottom') return { x: n.x + n.w / 2, y: n.y + n.h };
  if (s === 'left') return { x: n.x, y: n.y + n.h / 2 };
  return { x: n.x + n.w, y: n.y + n.h / 2 };
}

function edgePath(e: CanvasEdge, byId: Record<string, CanvasNode> = NODE_BY_ID) {
  const a = anchor(byId[e.from], e.fs);
  const b = anchor(byId[e.to], e.ts);
  const vert = (s: Side) => s === 'top' || s === 'bottom';
  const k = Math.max(40, Math.min(160, (vert(e.fs) ? Math.abs(b.y - a.y) : Math.abs(b.x - a.x)) / 2));
  const off = (s: Side) => (s === 'top' ? { x: 0, y: -k } : s === 'bottom' ? { x: 0, y: k } : s === 'left' ? { x: -k, y: 0 } : { x: k, y: 0 });
  const oa = off(e.fs);
  const ob = off(e.ts);
  const d = `M ${a.x} ${a.y} C ${a.x + oa.x} ${a.y + oa.y}, ${b.x + ob.x} ${b.y + ob.y}, ${b.x} ${b.y}`;
  // Label sits halfway along the bezier.
  const mid = {
    x: 0.125 * a.x + 0.375 * (a.x + oa.x) + 0.375 * (b.x + ob.x) + 0.125 * b.x,
    y: 0.125 * a.y + 0.375 * (a.y + oa.y) + 0.375 * (b.y + ob.y) + 0.125 * b.y,
  };
  return { d, mid };
}

function CanvasNodeView({ n, height = CANVAS_H }: { n: CanvasNode; height?: number }) {
  const delay = 0.15 + (n.y / height) * 1.1;
  const style = { left: n.x, top: n.y, width: n.w, height: n.h };
  if (n.kind === 'main') {
    return (
      <motion.div className="absolute" style={style} initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}>
        {n.badge && <span className="j-badge absolute -top-3 right-4 z-10 rounded-full px-3 py-1 text-[12px] font-semibold">{n.badge}</span>}
        <div className="j-card h-full rounded-[22px] p-4 text-left">
          <span className="j-kind absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full">
            <JIcon name={n.icon} className="h-3.5 w-3.5" />
          </span>
          <div className="flex items-center gap-3 pr-8">
            <span className="j-icon grid h-11 w-11 flex-none place-items-center rounded-[13px]">
              <JIcon name={n.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              {n.eyebrow && <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/60">{n.eyebrow}</p>}
              <p className="text-[21px] font-semibold leading-tight">{n.title}</p>
            </div>
          </div>
          {n.sub && <p className="mt-2.5 text-[14px] leading-snug text-white/80">{n.sub}</p>}
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div className="absolute" style={style} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: delay + 0.15, duration: 0.45 }}>
      <div
        className={`j-glass flex h-full items-center gap-2.5 px-3 ${n.kind === 'pill' ? 'justify-center rounded-full' : 'rounded-[14px]'} ${n.dashed ? 'outline-dashed outline-1 outline-[#8fd0ff]/70' : ''}`}
      >
        <span className={`grid h-7 w-7 flex-none place-items-center rounded-full ${n.icon === 'check' ? 'bg-emerald-500 text-white' : 'j-kind'}`}>
          <JIcon name={n.icon} className="h-3.5 w-3.5" />
        </span>
        <span className={`truncate ${n.mono ? 'mono text-[13px]' : 'text-[14px] font-semibold'}`}>{n.title}</span>
      </div>
    </motion.div>
  );
}

/** Pan (drag / wheel) + zoom (⌘/Ctrl + wheel, buttons) over a fixed-size canvas. Stops the deck's swipe while dragging. */
function PanZoomCanvas({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, s: 1 });
  const viewRef = useRef(view);
  viewRef.current = view;
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const s = Math.min(1, (r.width - 32) / width);
    setView({ s, x: (r.width - width * s) / 2, y: 20 });
  }, [width]);

  useEffect(() => {
    fit();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    // Native listeners: they run before the slide's swipe handler (and React's root listeners), so dragging
    // the canvas never swipes the deck, and wheel can preventDefault.
    const onDown = (e: PointerEvent) => {
      e.stopPropagation();
      if ((e.target as HTMLElement).closest('button')) return;
      drag.current = { px: e.clientX, py: e.clientY, x: viewRef.current.x, y: viewRef.current.y };
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
      setGrabbing(true);
    };
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      e.stopPropagation();
      setView((v) => ({ ...v, x: d.x + e.clientX - d.px, y: d.y + e.clientY - d.py }));
    };
    const onUp = () => {
      drag.current = null;
      setGrabbing(false);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        const cx = e.clientX - r.left;
        const cy = e.clientY - r.top;
        setView((v) => {
          const s = Math.max(0.35, Math.min(1.8, v.s * Math.exp(-e.deltaY * 0.0025)));
          return { s, x: cx - ((cx - v.x) / v.s) * s, y: cy - ((cy - v.y) / v.s) * s };
        });
      } else {
        setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
      }
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [fit]);

  const zoomBy = (f: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setView((v) => {
      const s = Math.max(0.35, Math.min(1.8, v.s * f));
      const cx = r.width / 2;
      const cy = r.height / 2;
      return { s, x: cx - ((cx - v.x) / v.s) * s, y: cy - ((cy - v.y) / v.s) * s };
    });
  };

  return (
    <div
      ref={ref}
      className={`relative h-full w-full touch-none select-none overflow-hidden ${grabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div className="absolute left-0 top-0 origin-top-left" style={{ width, height, transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}>
        {children}
      </div>

      <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5">
        <button onClick={() => zoomBy(1 / 1.2)} className="cbtn !h-9 !w-9 !text-lg" aria-label="Alejar">−</button>
        <span className="mono w-12 text-center text-[11px] text-white/80">{Math.round(view.s * 100)}%</span>
        <button onClick={() => zoomBy(1.2)} className="cbtn !h-9 !w-9 !text-lg" aria-label="Acercar">+</button>
        <button onClick={fit} className="pill !h-9 !bg-[#181e30] !text-[#f2f4f8]">Encuadrar</button>
      </div>
      <p className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-full bg-black/55 px-3 py-1.5 text-[11.5px] text-white/85 backdrop-blur">
        Arrastra para moverte · rueda para bajar · ⌘/Ctrl + rueda para zoom
      </p>
    </div>
  );
}

/** Node cards + glowing bezier edges on a fixed-size canvas (used by the architecture and the skill flow). */
function NodeGraph({ id, nodes, edges: list, width, height, children }: { id: string; nodes: CanvasNode[]; edges: CanvasEdge[]; width: number; height: number; children?: ReactNode }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const edges = list.map((e, i) => ({ e, i, ...edgePath(e, byId) }));
  const stroke = (t: CanvasEdge['tone']) =>
    t === 'voice' ? '#ffd59a' : t === 'human' ? '#a8f5cf' : t === 'child' ? 'rgba(191,227,255,0.55)' : '#cfe8ff';
  const glow = (t: CanvasEdge['tone']) => (t === 'voice' ? '#f2a65a' : t === 'human' ? '#3ccf8e' : '#5aa8ff');
  const labelTone = (t: CanvasEdge['tone']) =>
    t === 'voice'
      ? 'bg-[#2a1606]/90 text-[#ffd59a] ring-[#ffb547]/50'
      : t === 'human'
        ? 'bg-[#062a1b]/90 text-[#a8f5cf] ring-[#3ccf8e]/50'
        : 'bg-[#06103a]/90 text-[#bfe3ff] ring-[#8fd0ff]/40';
  return (
    <div className="relative" style={{ width, height }}>
      <svg className="pointer-events-none absolute inset-0" width={width} height={height} aria-hidden="true">
        <defs>
          <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        {edges.map(({ e, i, d }) => (
          <g key={i}>
            {e.tone !== 'child' && <path d={d} stroke={glow(e.tone)} strokeWidth="12" fill="none" filter={`url(#${id}-glow)`} opacity="0.5" />}
            <path d={d} stroke={stroke(e.tone)} strokeWidth={e.tone === 'child' ? 1.5 : 2.5} fill="none" strokeDasharray={e.dashed ? '8 8' : undefined} />
            {e.tone !== 'child' && (
              <path d={d} className="j-beam-in" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" style={{ animationDelay: `${(i % 6) * 0.2}s` }} />
            )}
          </g>
        ))}
      </svg>
      {nodes.map((n) => (
        <CanvasNodeView key={n.id} n={n} height={height} />
      ))}
      {edges
        .filter(({ e }) => e.label)
        .map(({ e, i, mid }) => (
          <span
            key={`l${i}`}
            className={`mono absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] ring-1 ${labelTone(e.tone)}`}
            style={{ left: mid.x, top: mid.y }}
          >
            {e.label}
          </span>
        ))}
      {children}
    </div>
  );
}

function ArchitectureCanvas() {
  return (
    <NodeGraph id="arch" nodes={CANVAS_NODES} edges={CANVAS_EDGES} width={CANVAS_W} height={CANVAS_H}>
      {/* Layer labels on the left edge */}
      {[
        { y: 70, t: 'Voz' },
        { y: 600, t: 'Interfaz' },
        { y: 1080, t: 'Cerebro' },
      ].map((l) => (
        <span key={l.t} className="absolute left-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40" style={{ top: l.y }}>
          {l.t}
        </span>
      ))}
    </NodeGraph>
  );
}

function ArchitectureSlide() {
  const [showImage, setShowImage] = useState(false);
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Reveal>
            <a href={ANTHROPIC_URL} target="_blank" rel="noopener noreferrer" className="eyebrow inline-flex items-center gap-1.5 hover:text-[var(--text)]">
              06 · Arquitectura · Patrón “Orchestrator-workers” + “Augmented LLM” — Anthropic, Building effective agents
              <ExternalLink className="h-3 w-3" />
            </a>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.04] text-[var(--text)]">
              LiveKit orquesta, <span className={ACCENT}>ADK piensa, CopilotKit muestra.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <button onClick={() => setShowImage((v) => !v)} className="pill" aria-pressed={showImage}>
            {showImage ? 'Ver canvas' : 'Ver captura'}
          </button>
        </Reveal>
      </div>

      {showImage ? (
        <Reveal delay={0.05} className="mt-4">
          <img
            src="/devfest-2026/arquitectura.png"
            alt="Diagrama: Google ADK, A2UI, AG-UI, CopilotKit Runtime, app Next.js y LiveKit Voice"
            className="tile max-h-[calc(100svh-17rem)] w-full object-contain"
          />
        </Reveal>
      ) : (
        <Reveal delay={0.1} className="mt-4">
          <div className="j-stage relative h-[max(22rem,calc(100svh-19.5rem))] overflow-hidden rounded-[28px]">
            <div className="j-stage-grid pointer-events-none absolute inset-0" aria-hidden="true" />
            <PanZoomCanvas width={CANVAS_W} height={CANVAS_H}>
              <ArchitectureCanvas />
            </PanZoomCanvas>
          </div>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 09 · Google ADK                                                     */
/* ------------------------------------------------------------------ */

const ADK_PARTS = [
  {
    id: 'agent',
    term: 'LlmAgent',
    body: 'Modelo + instrucciones + tools = el “cerebro”.',
    file: 'packages/agent/src/agent.ts',
    doc: 'https://adk.dev/agents/llm-agents/',
    docLabel: 'adk.dev · LlmAgent',
    note: 'Mismo constructor que en la doc de ADK para TypeScript: name, model, instruction y tools.',
    code: `
import { LlmAgent } from "@google/adk";

export const agent = new LlmAgent({
  name: "noshy_concierge",
  model: "gemini-2.5-flash",
  instruction: \`
# Persona
Eres NoShy Concierge, el compañero comercial de voz.
Cálido, con energía y directo. Hablas de valor, no de tecnología.
# Límites
- Usa las tools para datos reales. No inventes precios.
- Una pregunta por turno.\`,
  tools: [assessContext, buildProductPlan, bookMeeting, sendPlanEmail],
});`,
  },
  {
    id: 'instruction',
    term: 'Instructions',
    body: 'Persona, reglas, límites, formato y ejemplos. El estado va al final.',
    file: 'packages/agent/src/instruction.ts',
    doc: 'https://adk.dev/agents/llm-agents/',
    docLabel: 'adk.dev · instruction',
    note: 'ADK pide objetivo, persona, restricciones, cuándo usar cada tool y el formato. En voz, Live API las ordena así. El contexto variable va al final para dejar un prefijo estable.',
    code: `
1. Persona
   Quién, tono, idioma. En voz, la persona va primero.

2. Reglas de conversación
   Pasos en orden. Una herramienta por frase.
   Separa lo de una sola vez de los bucles.

3. Límites
   Qué no hacer: no inventar precios, personas ni enlaces.

4. Formato de respuesta
   Voz = texto plano. 2–3 frases. Una pregunta al final.

5. Ejemplos
   Siempre la misma forma: Usuario / Acción / Tú.

6. Contexto de la sesión
   {state?} al final. Lo fijo de arriba se puede cachear.`,
  },
  {
    id: 'tool',
    term: 'Tools / FunctionTool',
    body: 'Hechos reales: productos, cotización, CRM, agenda.',
    file: 'packages/agent/src/tools.ts',
    doc: 'https://adk.dev/tools-custom/function-tools/',
    docLabel: 'adk.dev · FunctionTool',
    note: 'FunctionTool + Zod, como en la guía de tools: name, description, parameters y execute.',
    code: `
import { FunctionTool } from "@google/adk";
import { z } from "zod";

export const assessContext = new FunctionTool({
  name: "assess_context",
  description: "Guarda lo que el usuario contó y revisa si ya hay contexto.",
  parameters: z.object({
    facts: z.array(factSchema).optional(),
  }),
  execute: async ({ facts }, ctx) => {
    for (const fact of facts ?? []) saveFact(ctx, fact);
    const readiness = assessContextLogic(currentBrief(ctx));
    ctx?.state.set("context_ready", readiness.ready);
    return readiness;
  },
});`,
  },
  {
    id: 'runner',
    term: 'Runner',
    body: 'Orquesta usuario ↔ agente ↔ sesión ↔ eventos.',
    file: 'InMemoryRunner · runAsync',
    doc: 'https://adk.dev/api-reference/typescript/classes/Runner.html',
    docLabel: 'adk.dev · Runner',
    note: 'El Runner carga la sesión, corre el agente y entrega cada Event. InMemoryRunner basta para probar en local.',
    code: `
import { InMemoryRunner } from "@google/adk";

const runner = new InMemoryRunner({ agent: rootAgent });

for await (const event of runner.runAsync({
  userId: "user_1",
  sessionId: "s_42",
  newMessage: {
    role: "user",
  },
})) {
  console.log(event);
}`,
  },
  {
    id: 'sessions',
    term: 'Sessions & Events',
    body: 'Cada turno, tool y resultado queda auditado.',
    file: 'EventType · adk web',
    doc: 'https://adk.dev/runtime/event-loop/',
    docLabel: 'adk.dev · event loop',
    note: 'Cada yield es un evento: content, tool_call, tool_result o finished. ADK Web los muestra en vivo.',
    code: `
# Chat, eventos y estado en el navegador
npx adk web packages/agent/src/agent.ts
# → http://localhost:8000   Events · State · Trace

# Tipos oficiales (EventType)
# content · tool_call · tool_result · finished
# El Runner los guarda en la sesión, turno por turno.`,
  },
] as const;

function AdkSlide() {
  const [active, setActive] = useState(0);
  const part = ADK_PARTS[active];

  return (
    <div className="flex h-full flex-col justify-center">
      <SlideHead eyebrow="09 · Google ADK" title="El asesor" accent="que está en la llamada." />
      <div className="mt-6 grid items-start gap-4 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="space-y-2" role="tablist" aria-label="Piezas de Google ADK">
          {ADK_PARTS.map((item, i) => {
            const selected = i === active;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(i)}
                className={`tile flex w-full items-start gap-4 p-4 text-left ${selected ? 'ring-1 ring-[var(--signal)]' : ''}`}
              >
                <span className="mono mt-0.5 text-sm text-[var(--signal)]">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="mono text-[15px] text-[var(--text)]">{item.term}</span>
                    <span className={`mono text-[11px] ${selected ? 'text-[var(--signal-soft)]' : 'text-[var(--dim)]'}`}>
                      {selected ? 'viendo' : 'ver código'}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-[var(--dim)]">{item.body}</span>
                </span>
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={part.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            <Code code={part.code} title={part.file} className="max-h-[min(42vh,380px)] overflow-auto" />
            <div className="title-tile p-5">
              <p className="text-sm leading-relaxed text-[var(--text)]">{part.note}</p>
              <a href={part.doc} target="_blank" rel="noopener noreferrer" className="pill mt-3">
                {part.docLabel}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <Resources
        className="mt-5"
        items={[
          { label: 'ADK · Integraciones', url: 'https://adk.dev/integrations/' },
          { label: 'ADK + AG-UI', url: 'https://adk.dev/integrations/ag-ui/' },
          { label: 'Runner', url: 'https://adk.dev/api-reference/typescript/classes/Runner.html' },
          { label: 'Event loop', url: 'https://adk.dev/runtime/event-loop/' },
        ]}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 12 · LiveKit                                                        */
/* ------------------------------------------------------------------ */

const LIVEKIT_PARTS = [
  {
    id: 'room',
    term: 'Room',
    body: 'Espacio virtual donde viven usuario y agente.',
    file: 'packages/livekit/agent.py',
    doc: 'https://docs.livekit.io/intro/basics/rooms-participants-tracks/',
    docLabel: 'LiveKit · rooms',
    note: 'El worker entra al room con ctx.connect(). LiveKit lleva el WebRTC, los permisos y la observabilidad.',
    code: `
@server.rtc_session(agent_name="noshy_concierge")
async def noshy_concierge(ctx: JobContext) -> None:
    ctx.log_context_fields = {"room": ctx.room.name}
    await ctx.connect()

    session = build_session()
    await session.start(room=ctx.room, agent=agent)`,
  },
  {
    id: 'participant',
    term: 'Participant',
    body: 'El agente es un participante más, no un “bot aparte”.',
    file: 'packages/livekit/agent.py',
    doc: 'https://docs.livekit.io/intro/basics/rooms-participants-tracks/',
    docLabel: 'LiveKit · participants',
    note: 'Quien llama y el agente son participantes del mismo room. El RPC sale del participante local hacia el del navegador.',
    code: `
caller = await ctx.wait_for_participant()
local = ctx.room.local_participant

await local.perform_rpc(
    destination_identity=caller.identity,
    method="concierge.ask",
    payload=json.dumps(payload),
)`,
  },
  {
    id: 'tracks',
    term: 'Tracks',
    body: 'Audio (y video / data) en tiempo real.',
    file: 'AgentSession · audio track',
    doc: 'https://docs.livekit.io/intro/basics/rooms-participants-tracks/',
    docLabel: 'LiveKit · tracks',
    note: 'Cada participante publica tracks. El micrófono del usuario entra como audio; session.say publica la voz del agente.',
    code: `
await session.start(room=ctx.room, agent=agent)
# El agente publica su track de audio.
# El micrófono del usuario llega como otro track.

session.say("Listo, tu propuesta va en camino.")`,
  },
  {
    id: 'worker',
    term: 'Worker / Agent',
    body: 'Proceso que se une al room, escucha y responde.',
    file: 'packages/livekit/agent.py',
    doc: 'https://docs.livekit.io/agents/server/job/',
    docLabel: 'LiveKit · jobs',
    note: 'AgentServer espera un job y despacha la sesión. En local: python agent.py dev.',
    code: `
server = AgentServer()

@server.rtc_session(agent_name="noshy_concierge")
async def noshy_concierge(ctx: JobContext) -> None:
    await ctx.connect()

if __name__ == "__main__":
    cli.run_app(server)`,
  },
  {
    id: 'session',
    term: 'AgentSession',
    body: 'Une STT, LLM, TTS, turnos e interrupciones en un solo objeto.',
    file: 'build_session()',
    doc: 'https://docs.livekit.io/agents/logic/sessions/',
    docLabel: 'LiveKit · AgentSession',
    note: 'Pipeline (STT → LLM → TTS) cuando quieres elegir la voz. Realtime cuando un solo modelo escucha y habla.',
    code: `
def build_session() -> AgentSession:
    if elevenlabs:
        return AgentSession(
            stt=inference.STT(model="deepgram/nova-3", language="es"),
            llm=inference.LLM(model="google/gemini-2.5-flash"),
            tts=elevenlabs.TTS(model="eleven_flash_v2_5"),
        )
    return AgentSession(
        llm=inference.RealtimeModel(model=MODEL, voice="Puck"),
    )`,
  },
  {
    id: 'instructions',
    term: 'Instructions',
    body: 'Identity → output → flow → tools → guardrails → user info. Markdown, como en ADK.',
    file: 'packages/livekit/tools.py',
    doc: 'https://docs.livekit.io/agents/start/prompting/',
    docLabel: 'LiveKit · Prompting guide',
    note: 'Misma lógica que ADK instruction.ts, con el vocabulario de LiveKit. Los detalles de cada tool viven en su definición; el prompt solo dice cuándo y cómo hablar el resultado. Datos del usuario al final.',
    code: `
# Identity
Eres NoShy Concierge, la voz del compañero comercial…

# Output rules
Español. Texto plano. 1–3 frases. Una pregunta al final.
(Realtime: no hace falta deletrear números ni SSML.)

# Goals / Conversational flow
1. Presentación (una sola vez)
2. Contexto → Discovery → Resumen → Plan → Cierre
   En cualquier momento: comunidad  ← bucle marcado

# Tools
Recoge inputs → llama → resume el resultado en voz.
No leas IDs ni JSON.

# Guardrails
Nunca inventes personas, precios ni enlaces Meet.

# User information
{{ user_name }} · {{ persona }} · {{ lookingFor }}`,
  },
] as const;

/* ------------------------------------------------------------------ */
/* ¿Qué es…? — portada grande de cada producto, con captura real       */
/* ------------------------------------------------------------------ */

type ProductIntro = {
  eyebrow: string;
  kicker: string;
  headline: ReactNode;
  es: string;
  points: string[];
  shot: { src: string; alt: string; dark?: boolean; bg?: string; fit?: 'contain' | 'cover'; position?: string };
  source: string;
  url: string;
  accent: string;
};

function ProductIntroSlide({ p }: { p: ProductIntro }) {
  return (
    <div className="flex h-full flex-col">
      <Reveal>
        <p className="eyebrow">{p.eyebrow}</p>
      </Reveal>
      <Reveal delay={0.06}>
        <p className="mono mt-4 text-[13px] uppercase tracking-[0.18em]" style={{ color: p.accent }}>
          {p.kicker}
        </p>
      </Reveal>
      <Reveal delay={0.12}>
        <h2 className="mt-2 text-[clamp(2.25rem,4.8vw,4.5rem)] leading-[1.0] text-[var(--text)]">{p.headline}</h2>
      </Reveal>
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <Reveal delay={0.18}>
          <p className={`${LEAD} max-w-2xl`}>{p.es}</p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {p.points.map((t) => (
              <span key={t} className="pill !text-[var(--text)]">
                <Check className="h-3.5 w-3.5" style={{ color: p.accent }} /> {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.3} className="mt-5 lg:h-[max(14rem,calc(100svh-30rem))]">
        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex h-full flex-col"
          style={{ transformPerspective: 1200 }}
        >
          <BrowserFrame url={p.source} dark={p.shot.dark} bg={p.shot.bg}>
            <img
              src={p.shot.src}
              alt={p.shot.alt}
              draggable={false}
              className={`absolute inset-0 h-full w-full ${p.shot.fit === 'cover' ? 'object-cover' : 'object-contain'}`}
              style={p.shot.position ? { objectPosition: p.shot.position } : undefined}
            />
          </BrowserFrame>
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 self-end text-[12px] text-[var(--dim)] hover:text-[var(--text)]">
            Captura real · {p.source} <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>
      </Reveal>
    </div>
  );
}

const LIVEKIT_INTRO: ProductIntro = {
  eyebrow: '10 · ¿Qué es LiveKit?',
  kicker: 'Voice AI · Video AI · Robotics',
  headline: (
    <>
      Build <span className="text-[#45d4f5]">voice, video,</span> and <span className="text-[#45d4f5]">physical AI</span> agents
    </>
  ),
  es: 'Framework open source + plataforma para construir, desplegar, escalar y observar agentes en producción.',
  points: ['Millones de llamadas concurrentes', 'Detección de turnos e interrupciones', 'LiveKit Cloud'],
  shot: {
    src: '/devfest-2026/lk-hero.jpg',
    alt: 'Inicio de LiveKit: Build voice, video, and physical AI agents',
    dark: true,
    fit: 'cover',
    position: 'center 82%',
  },
  source: 'livekit.com',
  url: 'https://livekit.com/',
  accent: '#45d4f5',
};

const COPILOTKIT_INTRO: ProductIntro = {
  eyebrow: '12 · ¿Qué es CopilotKit?',
  kicker: 'The Enterprise Product Stack for Agents',
  headline: (
    <>
      Connect <span className="bg-gradient-to-r from-[#8b8cff] to-[#4fd1c5] bg-clip-text text-transparent">any agent</span> to{' '}
      <span className="bg-gradient-to-r from-[#8b8cff] to-[#4fd1c5] bg-clip-text text-transparent">any user</span>
    </>
  ),
  es: 'Apps agénticas que aprenden de cada interacción. Self-hostable y hechas para escalar con tu organización.',
  points: ['Web · iOS · Android', 'Slack · Teams · WhatsApp', 'Google ADK, LangGraph…'],
  shot: { src: '/devfest-2026/ck-channels.jpg', alt: 'CopilotKit conecta agentes como Google ADK con Web, iOS, Android, Slack, Teams y WhatsApp', bg: 'linear-gradient(90deg,#8eb6f1,#7b88e7)' },
  source: 'copilotkit.ai',
  url: 'https://www.copilotkit.ai/',
  accent: '#8b8cff',
};

function LiveKitIntroSlide() {
  return <ProductIntroSlide p={LIVEKIT_INTRO} />;
}

function CopilotKitIntroSlide() {
  return <ProductIntroSlide p={COPILOTKIT_INTRO} />;
}

function LiveKitSlide() {
  const [active, setActive] = useState(0);
  const part = LIVEKIT_PARTS[active];

  return (
    <div className="flex h-full flex-col justify-center">
      <Reveal>
        <p className="eyebrow">10 · LiveKit</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-3 text-[clamp(1.9rem,4vw,3.5rem)] leading-[1.04] text-[var(--text)]">
          La llamada telefónica. <span className={ACCENT}>ADK es el asesor en ella.</span>
        </h2>
      </Reveal>
      <div className="mt-6 grid items-start gap-4 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="space-y-1.5" role="tablist" aria-label="Piezas de LiveKit">
          {LIVEKIT_PARTS.map((item, i) => {
            const selected = i === active;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(i)}
                className={`tile flex w-full items-start gap-3 px-4 py-3 text-left ${selected ? 'ring-1 ring-[var(--amber)]' : 'hover:!bg-[var(--raise)]'}`}
              >
                <span className="mono mt-0.5 text-sm text-[var(--amber)]">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="mono text-[15px] text-[var(--text)]">{item.term}</span>
                    {!selected && <span className="mono text-[11px] text-[var(--dim)]">ver código</span>}
                  </span>
                  {selected && <span className="mt-1 block text-[13px] leading-relaxed text-[var(--dim)]">{item.body}</span>}
                </span>
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={part.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            <Code code={part.code} title={part.file} className="max-h-[min(42vh,380px)] overflow-auto" />
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <p className="max-w-xl text-[13.5px] leading-relaxed text-[var(--dim)]">{part.note}</p>
              <a href={part.doc} target="_blank" rel="noopener noreferrer" className="pill !h-8 !text-[12px]">
                {part.docLabel}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <Resources
        className="mt-5"
        items={[
          { label: 'LiveKit · Overview', url: 'https://docs.livekit.io/intro/overview/' },
          { label: 'AgentSession', url: 'https://docs.livekit.io/agents/logic/sessions/' },
          { label: 'Jobs', url: 'https://docs.livekit.io/agents/server/job/' },
          { label: 'Prompting guide', url: 'https://docs.livekit.io/agents/start/prompting/' },
          { label: 'ADK + LiveKit', url: 'https://adk.dev/integrations/livekit/' },
        ]}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 10.1 · ¿Cuánto cuesta una conversación? (precios LiveKit Cloud docs) */
/* Source: livekit.com/pricing + docs.livekit.io/deploy/admin/billing */
/* ------------------------------------------------------------------ */

// One NoShy session timed against the app's real flow (see "Concierge Voice Costs").
const SESSION_STEPS = [
  { t: 'Saludo', s: 20 },
  { t: 'Intake', s: 90 },
  { t: 'Contexto', s: 20 },
  { t: 'Resumen', s: 60 },
  { t: 'Elige plan', s: 20 },
  { t: 'Comunidad', s: 45 },
  { t: 'Plan reunión', s: 75 },
  { t: 'Plan producto', s: 60 },
  { t: 'Aprobación', s: 40 },
  { t: 'Cierre', s: 40 },
];
const SESSION_SECONDS = SESSION_STEPS.reduce((a, b) => a + b.s, 0); // 470s ≈ 7:50
const SESSION_MINUTES = SESSION_SECONDS / 60; // ≈ 7.833

// LiveKit Cloud metering (after included minutes on Ship/Scale).
// Agent session starts when the agent connects to the room; stops on room end / disconnect.
// WebRTC = user joining the room. Min billable unit: 1s, 10s minimum per session.
const METERING = [
  {
    label: 'Sesión de agente',
    rate: '$0.01 / min',
    session: `≈ $${(0.01 * SESSION_MINUTES).toFixed(2)}`,
    note: 'Agente conectado al room',
  },
  {
    label: 'Room · WebRTC',
    rate: '$0.0005 / min',
    session: `≈ $${(0.0005 * SESSION_MINUTES).toFixed(3)}`,
    note: 'Usuario entra al room (Ship)',
  },
  {
    label: 'Join → agente',
    rate: '~$0.011 / min',
    session: `≈ $${(0.011 * SESSION_MINUTES).toFixed(2)}`,
    note: 'Agente + WebRTC (sin modelo)',
  },
];

// Total ≈ agent + WebRTC + inference (Gemini Live ~$0.0182/min) + data ≈ $0.029/min
const COST_OPTIONS = [
  {
    name: 'Gemini Live',
    kind: 'Realtime · speech-to-speech',
    perSession: '$0.23',
    perMin: '$0.029 / min',
    hundred: '$23',
    bills: '1 factura · LiveKit (agente + room + Inference)',
    tone: 'var(--glow)',
  },
  {
    name: 'Pipeline + ElevenLabs',
    kind: 'STT → LLM → TTS',
    perSession: '$0.35',
    perMin: '$0.045 / min',
    hundred: '$35',
    bills: '2 facturas · LiveKit + ElevenLabs',
    tone: 'var(--amber)',
  },
];

// Membership plans — LiveKit Cloud (short)
const CLOUD_PLANS = [
  { name: 'Build', price: '$0/mo', mins: '1k min agente · 5k WebRTC', note: '~127 sesiones NoShy' },
  { name: 'Ship', price: '$50/mo', mins: '5k min → $0.01/min', note: 'Equipos · email support' },
  { name: 'Scale', price: '$500/mo', mins: '50k min → $0.01/min', note: 'HIPAA · region pin' },
  { name: 'Enterprise', price: 'Custom', mins: 'Volumen · SLA', note: 'SSO · Slack' },
];

function LiveKitCostSlide() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Reveal>
        <p className="eyebrow">10.1 · LiveKit · Costos</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-3 text-[clamp(1.9rem,4vw,3.5rem)] leading-[1.04] text-[var(--text)]">
          ¿Cuánto cuesta <span className={ACCENT}>una conversación?</span>
        </h2>
      </Reveal>

      {/* Timing · ~7:50 — big session totals on top */}
      <Reveal delay={0.14}>
        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="eyebrow">Una sesión de NoShy · ~7:50 min</p>
            <p className="mono text-[11px] text-[var(--dim)]">mín. 10s · se cobra por segundo conectado</p>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {COST_OPTIONS.map((o) => (
              <div key={o.name} className="flex items-end gap-4">
                <p className="text-[clamp(2.6rem,6vw,4.2rem)] leading-none tracking-tight" style={{ color: o.tone }}>
                  {o.perSession}
                </p>
                <div className="pb-1">
                  <p className="text-[15px] leading-tight text-[var(--text)]">{o.name}</p>
                  <p className="mono text-[11px] text-[var(--dim)]">por sesión · ~7:50</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex h-12 w-full gap-1 overflow-hidden rounded-2xl">
            {SESSION_STEPS.map((st, i) => (
              <motion.div
                key={st.t}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex min-w-0 origin-left items-center justify-center bg-[var(--raise)] px-1"
                style={{ flex: st.s, background: i % 2 ? 'var(--raise)' : 'color-mix(in srgb, var(--signal) 22%, var(--raise))' }}
                title={`${st.t} · ${st.s}s`}
              >
                <span className="truncate text-center text-[11px] leading-tight text-[var(--text)]">
                  {st.t}
                  <span className="mono block text-[10px] text-[var(--dim)]">
                    {Math.floor(st.s / 60)}:{String(st.s % 60).padStart(2, '0')}
                  </span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* LiveKit metering: session · room · join */}
      <Reveal delay={0.28}>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {METERING.map((m) => (
            <div key={m.label} className="rounded-2xl bg-[var(--raise)] px-4 py-3">
              <p className="mono text-[10px] uppercase tracking-wide text-[var(--dim)]">{m.label}</p>
              <p className="mt-1 text-lg leading-none text-[var(--text)]">{m.rate}</p>
              <p className="mt-1.5 mono text-[12px] text-[var(--glow)]">{m.session} / sesión</p>
              <p className="mt-1 text-[11px] text-[var(--dim)]">{m.note}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {COST_OPTIONS.map((o, i) => (
          <Reveal key={o.name} delay={0.4 + i * 0.08}>
            <div className="tile h-full p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg text-[var(--text)]">{o.name}</p>
                  <p className="mono text-[11px] text-[var(--dim)]">{o.kind}</p>
                </div>
                <span className="mono rounded-full bg-[var(--raise)] px-2.5 py-1 text-[11px]" style={{ color: o.tone }}>
                  {o.perMin}
                </span>
              </div>
              <div className="mt-3 flex items-end gap-6">
                <div>
                  <p className="text-xl leading-none" style={{ color: o.tone }}>
                    {o.perSession}
                  </p>
                  <p className="mt-1 text-[12px] text-[var(--dim)]">por sesión (todo incluido)</p>
                </div>
                <div>
                  <p className="text-xl leading-none text-[var(--text)]">{o.hundred}</p>
                  <p className="mt-1 text-[12px] text-[var(--dim)]">× 100 sesiones</p>
                </div>
              </div>
              <p className="mt-3 text-[12px] text-[var(--dim)]">{o.bills}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Membership plans — short */}
      <Reveal delay={0.58}>
        <div className="mt-4">
          <p className="eyebrow mb-2">Planes LiveKit Cloud</p>
          <div className="grid gap-2 sm:grid-cols-4">
            {CLOUD_PLANS.map((p) => (
              <div key={p.name} className="rounded-2xl border border-[var(--line)] px-3 py-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[13px] text-[var(--text)]">{p.name}</p>
                  <p className="mono text-[12px] text-[var(--glow)]">{p.price}</p>
                </div>
                <p className="mt-1 mono text-[10px] text-[var(--dim)]">{p.mins}</p>
                <p className="mt-0.5 text-[11px] text-[var(--dim)]">{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.68}>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="pill !text-[var(--text)]">
            <span className="dot bg-[var(--good)]" /> Build gratis: 1.000 min agente ≈ 127 sesiones
          </span>
          <a href="https://livekit.com/pricing" target="_blank" rel="noopener noreferrer" className="pill">
            Precios LiveKit Cloud <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 10.2 · Seguridad, cumplimiento y datos                              */
/* ------------------------------------------------------------------ */

const SECURITY_POINTS: { icon: LucideIcon; title: string; body: string; plan: string }[] = [
  { icon: Lock, title: 'Cifrado extremo a extremo', body: 'Audio y datos cifrados en tránsito.', plan: 'Todos los planes' },
  { icon: ShieldCheck, title: 'Zero data retention', body: 'La inferencia no guarda ni entrena con tu audio o tus prompts.', plan: 'Todos los planes' },
  { icon: Eye, title: 'Redacción de PII', body: 'Las transcripciones se limpian antes de guardarse.', plan: 'Observabilidad' },
  { icon: FileText, title: 'SOC 2 Type II · pentest', body: 'Reportes de seguridad para tu equipo legal.', plan: 'Scale' },
  { icon: Heart, title: 'HIPAA · DPA', body: 'HIPAA para salud; DPA estándar para todos.', plan: 'Scale · todos' },
  { icon: Globe, title: 'Region pinning · roles · SSO', body: 'Los datos se quedan en tu región y con tu gente.', plan: 'Scale · Enterprise' },
];

function LiveKitSecuritySlide() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Reveal>
        <p className="eyebrow">10.2 · LiveKit · Seguridad</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-3 text-[clamp(1.9rem,4vw,3.5rem)] leading-[1.04] text-[var(--text)]">
          Seguro por defecto. <span className={ACCENT}>Datos que sí sirven.</span>
        </h2>
      </Reveal>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECURITY_POINTS.map((p, i) => (
          <Reveal key={p.title} delay={0.15 + i * 0.06}>
            <div className="tile flex h-full items-start gap-4 p-5">
              <IconTile icon={p.icon} tone="good" />
              <div className="min-w-0">
                <p className="text-[16px] text-[var(--text)]">{p.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--dim)]">{p.body}</p>
                <p className="mono mt-2 text-[10.5px] uppercase tracking-[0.08em] text-[var(--good)]">{p.plan}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.55}>
        <div className="title-tile mt-4 flex flex-col gap-2 p-5 md:flex-row md:items-center md:justify-between">
          <p className="text-[15px] leading-relaxed text-[var(--text)]">
            <span className={ACCENT}>Recolección de datos:</span> grabación, transcripción y trazas de cada sesión → el equipo comercial ve
            qué preguntó el cliente y recibe feedback al instante.
          </p>
          <a href="https://docs.livekit.io/agents/models/inference/" target="_blank" rel="noopener noreferrer" className="pill flex-none">
            Docs · Inference <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 13 · Voz y emoción                                                  */
/* ------------------------------------------------------------------ */

const VOICE_FLOWS = [
  {
    id: 'pipeline',
    title: 'STT → LLM → TTS',
    tone: '#f2a65a',
    summary: 'Tres piezas. Más control. La emoción entra en el TTS.',
    example: 'Deepgram · Gemini · ElevenLabs',
    steps: [
      { name: 'Tú', proto: 'WebRTC' },
      { name: 'STT', proto: 'WebSocket' },
      { name: 'LLM', proto: 'HTTPS' },
      { name: 'TTS', proto: 'WebSocket' },
    ],
  },
  {
    id: 'realtime',
    title: 'Realtime',
    tone: '#45d4f5',
    summary: 'Un modelo escucha y habla. La emoción va en el audio.',
    example: 'Gemini Live',
    steps: [
      { name: 'Tú', proto: 'WebRTC' },
      { name: 'Modelo', proto: 'WebSocket' },
      { name: 'Voz', proto: 'Audio' },
    ],
  },
] as const;

function VoiceFlow({ flow, delay }: { flow: (typeof VOICE_FLOWS)[number]; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h3 className="text-3xl leading-none" style={{ color: flow.tone }}>
            {flow.title}
          </h3>
          <p className="text-xl text-white/90">{flow.example}</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {flow.steps.map((step, i) => (
            <div key={step.name} className="contents">
              <div className="j-card min-w-0 flex-1 rounded-2xl px-3 py-4 text-center md:px-4">
                <p className="text-2xl font-medium text-white md:text-3xl">{step.name}</p>
                <p className="mt-2 text-lg md:text-xl" style={{ color: flow.tone }}>
                  {step.proto}
                </p>
              </div>
              {i < flow.steps.length - 1 && (
                <span className="text-3xl leading-none text-white/80" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xl leading-snug text-white">{flow.summary}</p>
      </div>
    </Reveal>
  );
}

function EmotionSlide() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex h-full flex-col">
      <SlideHead eyebrow="11 · Voz y emoción" title="Dos formas de hablar." accent="Pipeline o realtime." />
      <Reveal delay={0.12}>
        <div className="mt-4 grid gap-3 text-xl leading-snug text-[var(--text)] md:grid-cols-3 md:text-2xl">
          <p>
            <span className={ACCENT}>SER.</span> Estima la emoción expresada: enojo, tristeza, alegría o neutral. No el estado interno.
          </p>
          <p>
            <span className={ACCENT}>Hoy.</span> wav2vec 2.0 aprende la onda, auto-supervisado. Un clasificador supervisado pone la etiqueta.
          </p>
          <p>
            <span className={ACCENT}>Tiempo.</span> Ventanas de unos segundos se juntan en la emoción de la conversación.
          </p>
        </div>
      </Reveal>
      <div className="j-stage relative mt-5 overflow-hidden rounded-[28px] p-5 md:p-6">
        <div className="j-stage-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative flex flex-col gap-6">
          {VOICE_FLOWS.map((flow, i) => (
            <VoiceFlow key={flow.id} flow={flow} delay={0.2 + i * 0.12} />
          ))}
        </div>
      </div>
      <img
        src="/devfest-2026/avatar-comfort.png"
        alt=""
        className="mx-auto mt-4 h-auto w-[min(100%,420px)] lg:hidden"
        draggable={false}
      />
      {mounted &&
        createPortal(
          <img
            src="/devfest-2026/avatar-comfort.png"
            alt=""
            className="pointer-events-none fixed bottom-0 right-0 z-[15] hidden w-[min(50vw,760px)] max-w-none object-contain object-bottom lg:block"
            draggable={false}
          />,
          document.body,
        )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 14 · CopilotKit + AG-UI                                             */
/* ------------------------------------------------------------------ */

const DOJO = 'https://dojo.ag-ui.com/';

const CK_CONCEPTS: {
  term: string;
  body: string;
  shots?: { src: string; alt: string; label?: string }[];
  source: string;
  url: string;
  code?: string;
  file?: string;
  note?: string;
}[] = [
  {
    term: 'AG-UI protocol',
    body: 'Eventos SSE entre tu app y cualquier agente: mensajes, tool calls, state y lifecycle.',
    shots: [{ src: '/devfest-2026/ck-agui-protocol.jpg', alt: 'Tu app CopilotKit conectada por AG-UI a Google ADK, LangGraph, Strands y más' }],
    source: 'copilotkit.ai/ag-ui',
    url: 'https://www.copilotkit.ai/ag-ui',
    file: 'packages/agent/src/server.ts',
    note: 'El bridge traduce cada evento de ADK a un evento AG-UI por SSE. CopilotKit los consume igual venga de ADK, LangGraph u otro runtime.',
    code: `
// packages/agent/src/server.ts
sse(res, { type: "RUN_STARTED", threadId, runId });
sse(res, {
  type: "TOOL_CALL_START",
  toolCallId,
  toolCallName: call.name,
});
sse(res, { type: "TEXT_MESSAGE_CONTENT", messageId, delta: part.text });
sse(res, { type: "RUN_FINISHED", threadId, runId });`,
  },
  {
    term: 'CopilotRuntime + shared state',
    body: 'Middleware frontend ↔ agente (aquí, ADK vía @ag-ui/adk). Chat y app leen y escriben el mismo estado.',
    shots: [{ src: '/devfest-2026/ck-shared-state.jpg', alt: 'Chat de CopilotKit que llama manage_todos y actualiza un tablero de tareas compartido' }],
    source: 'AG-UI Dojo · Shared State',
    url: DOJO,
    file: 'apps/web/app/api/copilotkit/[[...slug]]/route.ts',
    note: 'CopilotRuntime vive en Next.js. El agente default es ADKAgent apuntando a /ag-ui, y a2ui deja pasar el estado compartido.',
    code: `
const runtime = new CopilotRuntime({
  agents: {
    default: new ADKAgent({
      url: process.env.ADK_AG_UI_URL ?? "http://localhost:8000/ag-ui",
    }) as never,
  },
  a2ui: {},
  runner: new InMemoryAgentRunner(),
});`,
  },
  {
    term: 'Tool rendering',
    body: 'toolCallName → componente React. El mismo resultado, como texto y como tarjeta.',
    shots: [{ src: '/devfest-2026/ck-tool-rendering.jpg', alt: 'Resultado de vuelos en texto y renderizado como tarjeta FlightListCard' }],
    source: 'AG-UI Dojo · Tool Rendering',
    url: DOJO,
    file: 'apps/web/app/components/CommunityCards.tsx',
    note: 'useRenderTool engancha el nombre de la tool. Mientras corre, skeleton; al terminar, la tarjeta.',
    code: `
useRenderTool({
  name: "summarize_context",
  render: ({ status, result }) => {
    if (!isDone(status)) return <MasonrySkeletonBoard count={4} />;
    return <SummaryCard data={parseToolResult(result)} />;
  },
});`,
  },
  {
    term: 'Frontend tools',
    body: 'Acciones que el agente dispara en el navegador (useFrontendTool): abrir el calendario y ofrecer horarios.',
    shots: [{ src: '/devfest-2026/ck-frontend-tools.jpg', alt: 'El agente cambia el fondo de la app a un degradado de atardecer' }],
    source: 'AG-UI Dojo · Frontend Tools',
    url: DOJO,
    file: 'apps/web/app/components/CalendarTool.tsx',
    note: 'useFrontendTool corre en el navegador. El agente llama open_calendar y el handler abre los horarios de Bogotá.',
    code: `
useFrontendTool({
  name: "open_calendar",
  description: "Abre el calendario para que el usuario agende una reunión.",
  parameters: z.object({
    reason: z.string().describe("Motivo de la reunión"),
  }),
  handler: async ({ reason }) => {
    const list = open();
    return \`Calendario abierto para: \${reason}. Esperando selección.\`;
  },
});`,
  },
  {
    term: 'Generative UI',
    body: 'Display-only (solo muestra) vs. interactiva (el usuario responde y el agente continúa).',
    shots: [
      { src: '/devfest-2026/ck-gen-ui-display.jpg', alt: 'Dashboard de ventas generado con A2UI', label: 'Display-only · A2UI' },
      { src: '/devfest-2026/ck-gen-ui-interactive.jpg', alt: 'Selector de horario human-in-the-loop dentro del chat', label: 'Interactiva · human-in-the-loop' },
    ],
    source: 'AG-UI Dojo · A2UI + Human in the Loop',
    url: DOJO,
    file: 'packages/agent/src/server.ts',
    note: 'La UI generativa viaja como ACTIVITY_SNAPSHOT. El catálogo de la app dibuja la tarjeta y el usuario puede aprobar.',
    code: `
sse(res, {
  type: "ACTIVITY_SNAPSHOT",
  activityType: "a2ui-surface",
  content: { a2ui_operations: ops },
  replace: true,
});`,
  },
];

function BrowserFrame({ url, children, dark = false, bg, fill = true }: { url: string; children: ReactNode; dark?: boolean; bg?: string; fill?: boolean }) {
  return (
    <div className={`tile flex flex-col overflow-hidden ${fill ? 'h-full' : 'min-h-0 flex-1'}`}>
      <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-2.5">
        <span className="dot" style={{ background: 'var(--danger)', opacity: 0.7 }} />
        <span className="dot" style={{ background: 'var(--amber)', opacity: 0.7 }} />
        <span className="dot" style={{ background: 'var(--good)', opacity: 0.7 }} />
        <span className="mono ml-2 truncate rounded-full bg-[var(--raise)] px-3 py-1 text-[11px] text-[var(--dim)]">{url}</span>
      </div>
      <div className={`relative flex-1 ${fill ? 'min-h-[16rem]' : 'min-h-[8.5rem]'} ${dark ? 'bg-black' : 'bg-white'}`} style={bg ? { background: bg } : undefined}>{children}</div>
    </div>
  );
}

function CopilotKitSlide() {
  const [active, setActive] = useState(0);
  const [panel, setPanel] = useState<'concept' | 'json' | 'channels'>('concept');
  const c = CK_CONCEPTS[active];
  return (
    <div className="flex h-full flex-col justify-center">
      <Reveal>
        <p className="eyebrow">12 · CopilotKit + AG-UI</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-3 text-[clamp(1.9rem,4vw,3.5rem)] leading-[1.04] text-[var(--text)]">
          El puente <span className={ACCENT}>entre el agente y la interfaz.</span>
        </h2>
      </Reveal>
      <div className="mt-5 grid gap-4 lg:grid-cols-[0.66fr_1.34fr]">
        <Reveal delay={0.15}>
          <ol className="space-y-1.5" role="tablist" aria-label="Conceptos de CopilotKit">
            {CK_CONCEPTS.map((it, i) => {
              const on = i === active && panel === 'concept';
              return (
                <li key={it.term}>
                  <button
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setActive(i);
                      setPanel('concept');
                    }}
                    className={`tile flex w-full gap-3 px-4 py-3 text-left transition-colors ${on ? '!border-[var(--violet)] !bg-[#1a1838]' : 'hover:!bg-[var(--raise)]'}`}
                  >
                    <span className="mono mt-0.5 text-sm" style={{ color: 'var(--violet)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="mono block text-[15px] text-[var(--text)]">{it.term}</span>
                      {on && <span className="mt-1 block text-[13px] leading-relaxed text-[var(--dim)]">{it.body}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
            <li>
              <button
                role="tab"
                aria-selected={panel === 'json'}
                onClick={() => setPanel('json')}
                className={`tile flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${panel === 'json' ? '!border-[var(--violet)] !bg-[#1a1838]' : 'hover:!bg-[var(--raise)]'}`}
              >
                <span className="mono text-sm" style={{ color: 'var(--violet)' }}>
                  {String(CK_CONCEPTS.length + 1).padStart(2, '0')}
                </span>
                <span className="mono text-[15px] text-[var(--text)]">{'{ }'} Eventos JSON</span>
              </button>
            </li>
            <li>
              <button
                role="tab"
                aria-selected={panel === 'channels'}
                onClick={() => setPanel('channels')}
                className={`tile flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${panel === 'channels' ? '!border-[var(--violet)] !bg-[#1a1838]' : 'hover:!bg-[var(--raise)]'}`}
              >
                <span className="mono text-sm" style={{ color: 'var(--violet)' }}>
                  {String(CK_CONCEPTS.length + 2).padStart(2, '0')}
                </span>
                <span className="mono text-[15px] text-[var(--text)]">Canales</span>
              </button>
            </li>
          </ol>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="eyebrow mr-1">Recursos</span>
            {[
              { label: 'AG-UI', url: 'https://www.copilotkit.ai/ag-ui' },
              { label: 'Dojo · demos en vivo', url: DOJO },
              { label: 'Docs', url: 'https://docs.copilotkit.ai/' },
              { label: 'Build with agents', url: 'https://docs.copilotkit.ai/build-with-agents' },
            ].map((r) => (
              <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="pill !h-8 !px-3 !text-[12px]">
                {r.label} <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.25} className="lg:h-[max(18rem,calc(100svh-22rem))]">
          <AnimatePresence mode="wait">
            {panel === 'channels' ? (
              <motion.div key="channels" initial={{ opacity: 0, y: 14, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }} className="flex h-full flex-col">
                <BrowserFrame url="copilotkit.ai" bg="linear-gradient(90deg,#8eb6f1,#7b88e7)">
                  <img src="/devfest-2026/ck-channels.jpg" alt="CopilotKit conecta Web, iOS, Android, Slack, Teams y WhatsApp con Google ADK y otros agentes" draggable={false} className="absolute inset-0 h-full w-full object-contain" />
                </BrowserFrame>
                <a href="https://www.copilotkit.ai/" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 self-end text-[12px] text-[var(--dim)] hover:text-[var(--text)]">
                  Captura real · copilotkit.ai <ExternalLink className="h-3 w-3" />
                </a>
              </motion.div>
            ) : panel === 'json' ? (
              <motion.div key="json" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-col gap-3">
                <Code
                  title="cliente → servidor · RunAgentInput"
                  code={`
{
  "threadId": "t_42",
  "runId": "r_7",
  "messages": [{ "role": "user", "content": "Arma el plan" }],
  "state": { "plan_status": "none" },
  "tools": [{ "name": "open_calendar", "parameters": { ... } }],
  "context": [{ "description": "brand", "value": "NoShy" }]
}`}
                />
                <Code
                  title="servidor → cliente · eventos"
                  code={`
{ "type": "TOOL_CALL_START", "toolCallName": "build_product_plan" }
{ "type": "STATE_SNAPSHOT", "snapshot": { "plan_status": "pending" } }
{ "type": "TEXT_MESSAGE_CONTENT", "delta": "¿Lo apruebas?" }
{ "type": "RUN_FINISHED" }`}
                />
              </motion.div>
            ) : (
              <motion.div
                key={c.term}
                initial={{ opacity: 0, y: 14, rotateX: 8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex h-full min-h-0 flex-col gap-3"
              >
                {c.shots && c.shots.length > 0 && (
                  <BrowserFrame url={c.source} fill={!c.code}>
                    {c.shots.length === 1 ? (
                      <img src={c.shots[0].src} alt={c.shots[0].alt} draggable={false} className="absolute inset-0 h-full w-full object-contain" />
                    ) : (
                      <div className="absolute inset-0 grid gap-px bg-[var(--line)] sm:grid-cols-2">
                        {c.shots.map((s) => (
                          <figure key={s.src} className="relative flex items-center bg-white">
                            <img src={s.src} alt={s.alt} draggable={false} className="h-full w-full object-contain" />
                            <figcaption className="absolute bottom-2 left-2 rounded-full bg-black/75 px-2.5 py-1 text-[11px] text-white">{s.label}</figcaption>
                          </figure>
                        ))}
                      </div>
                    )}
                  </BrowserFrame>
                )}
                {c.code && <Code code={c.code} title={c.file} className="max-h-[38%] shrink-0 overflow-auto" />}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {c.note ? <p className="max-w-[46ch] text-[12px] leading-snug text-[var(--dim)]">{c.note}</p> : <span />}
                  <a href={c.file ? `${REPO_URL}/blob/main/${c.file}` : c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[12px] text-[var(--dim)] hover:text-[var(--text)]">
                    {c.file ? c.file : `Captura real · ${c.source}`} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 15 · Tecnologías                                                    */
/* ------------------------------------------------------------------ */

const STACK: { group: string; tone: string; items: { name: string; logo: string; note?: string }[] }[] = [
  {
    group: 'Agente',
    tone: 'var(--signal)',
    items: [
      { name: 'Google ADK', logo: 'google-adk.png' },
      { name: 'Gemini', logo: 'gemini.svg' },
      { name: 'AWS Bedrock', logo: 'aws.svg' },
      { name: 'Qwen', logo: 'qwen.png', note: 'modelo local' },
    ],
  },
  {
    group: 'Voz',
    tone: 'var(--amber)',
    items: [
      { name: 'LiveKit', logo: 'livekit.svg' },
      { name: 'Cartesia', logo: 'cartesia.png' },
      { name: 'ElevenLabs', logo: 'elevenlabs.svg' },
      { name: 'Chatterbox', logo: 'chatterbox.png', note: 'Resemble AI' },
      { name: 'Google Realtime', logo: 'gemini.svg', note: 'Gemini Live' },
    ],
  },
  {
    group: 'UI agéntica',
    tone: 'var(--violet)',
    items: [
      { name: 'CopilotKit', logo: 'copilotkit.png' },
      { name: 'AG-UI', logo: 'agui.png' },
      { name: 'A2UI', logo: 'a2ui.png' },
      { name: 'Next.js', logo: 'nextjs.svg' },
      { name: 'React', logo: 'react.svg' },
    ],
  },
  {
    group: 'Motion y diseño',
    tone: 'var(--glow)',
    items: [
      { name: 'LottieFiles', logo: 'lottiefiles.png' },
      { name: 'Framer', logo: 'framer.svg' },
      { name: 'HyperFrames', logo: 'hyperframes.png' },
      { name: 'Three.js', logo: 'threejs.svg' },
    ],
  },
  {
    group: 'Flujo de trabajo',
    tone: 'var(--good)',
    items: [
      { name: 'Context7 MCP', logo: 'context7.png' },
      { name: 'Claude Code', logo: 'claude.svg' },
      { name: 'ADK Web', logo: 'google-adk.png', note: 'dev UI' },
      { name: 'Google Cloud', logo: 'googlecloud.svg' },
    ],
  },
  {
    group: 'Lenguajes',
    tone: 'var(--signal-soft)',
    items: [
      { name: 'TypeScript', logo: 'typescript.svg' },
      { name: 'Python', logo: 'python.svg' },
    ],
  },
];

function StackSlide() {
  let n = 0;
  return (
    <div className="flex h-full flex-col justify-center">
      <Reveal>
        <p className="eyebrow">14 · Tecnologías</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-3 text-[clamp(1.9rem,4vw,3.5rem)] leading-[1.04] text-[var(--text)]">
          Lo que uso hoy <span className={ACCENT}>para construir agentes de voz.</span>
        </h2>
      </Reveal>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STACK.map((g, gi) => (
          <Reveal key={g.group} delay={0.12 + gi * 0.06}>
            <div className="tile h-full p-5">
              <p className="eyebrow flex items-center gap-2">
                <span className="dot" style={{ background: g.tone }} />
                {g.group}
              </p>
              <ul className="mt-5 space-y-4">
                {g.items.map((it) => {
                  const d = 0.25 + n++ * 0.035;
                  return (
                    <motion.li
                      key={it.name}
                      initial={{ opacity: 0, y: 10, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: d, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                      className="flex items-center gap-3.5"
                    >
                      <span className="grid h-16 w-16 flex-none place-items-center rounded-[20px] bg-white p-3 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.7)]">
                        <img src={`/logos/${it.logo}`} alt="" className="max-h-full max-w-full object-contain" draggable={false} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[17px] leading-tight text-[var(--text)]">{it.name}</span>
                        {it.note && <span className="block text-[12.5px] text-[var(--dim)]">{it.note}</span>}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 14.1 · Mi skill: AI Design Framework (de pins de Pinterest a código) */
/* ------------------------------------------------------------------ */

const SKILL_REPO = 'https://github.com/anuidev8/ai-design-framework';

const SKILL_W = 1400;
const SKILL_H = 1660;
const SK = 46; // child node height

const SKILL_NODES: CanvasNode[] = [
  // 01 · Tú pegas los pins
  { id: 's1', kind: 'main', icon: 'user', eyebrow: '01 · Tú · ~1 min', title: 'Pegas los pins', sub: 'Brief + stack + 10–15 links de Pinterest.', badge: 'Tú', x: 490, y: 40, w: 420, h: 140 },
  { id: 'brief', kind: 'child', icon: 'doc', title: 'brief: calma, premium', x: 60, y: 30, w: 280, h: SK },
  { id: 'stack', kind: 'child', icon: 'code', title: 'stack: nextjs-tailwind', mono: true, x: 60, y: 90, w: 280, h: SK },
  { id: 'links', kind: 'child', icon: 'image', title: '10–15 links de Pinterest', x: 60, y: 150, w: 280, h: SK },
  { id: 'cmd', kind: 'pill', icon: 'flow', title: '/ai-design-framework', x: 1000, y: 86, w: 300, h: 52 },
  // 02 · Recolecta
  { id: 's2', kind: 'main', icon: 'db', eyebrow: '02 · Auto · ~1 min', title: 'Recolecta', sub: 'Descarga los pins, extrae colores y escribe el alma del proyecto.', x: 490, y: 300, w: 420, h: 140 },
  { id: 'pins', kind: 'child', icon: 'image', title: 'design/pins/', mono: true, x: 1000, y: 280, w: 260, h: SK },
  { id: 'colors', kind: 'child', icon: 'spark', title: 'Colores por imagen', x: 1000, y: 340, w: 260, h: SK },
  { id: 'soul', kind: 'child', icon: 'doc', title: 'soul.md', mono: true, x: 1000, y: 400, w: 260, h: SK },
  { id: 'skip', kind: 'child', icon: 'flow', title: 'Pin privado → se salta', dashed: true, x: 60, y: 347, w: 280, h: SK },
  // 03 · Califica y se detiene
  { id: 's3', kind: 'main', icon: 'star', eyebrow: '03 · Se detiene ⏸', title: 'Califica', sub: 'Top 5 de 14 pins según el brief. Rechaza lo que no encaja.', badge: 'Tú eliges', x: 490, y: 570, w: 420, h: 150 },
  ...['Brief fit', 'Jerarquía', 'Color', 'Tipografía', 'Originalidad', 'Build'].map((t, i) => ({
    id: `c${i}`,
    kind: 'child' as const,
    icon: 'check' as JIconName,
    title: t,
    x: i < 3 ? 40 : 230,
    y: 560 + (i % 3) * 60,
    w: 175,
    h: SK,
  })),
  { id: 'ratings', kind: 'child', icon: 'db', title: 'ratings.json', mono: true, x: 1000, y: 570, w: 260, h: SK },
  { id: 'r1', kind: 'child', icon: 'user', title: '“ok, reemplaza 4 por 9”', x: 1000, y: 650, w: 300, h: SK },
  // 04 · Mood board
  { id: 's4', kind: 'main', icon: 'image', eyebrow: '04 · Auto', title: 'Mood board', sub: 'Una página para mostrarle al cliente.', x: 490, y: 850, w: 420, h: 140 },
  { id: 'm1', kind: 'child', icon: 'image', title: '5 imágenes', x: 1000, y: 812, w: 260, h: SK },
  { id: 'm2', kind: 'child', icon: 'spark', title: 'Paleta de color', x: 1000, y: 868, w: 260, h: SK },
  { id: 'm3', kind: 'child', icon: 'doc', title: 'Fuentes sugeridas', x: 1000, y: 924, w: 260, h: SK },
  { id: 'm4', kind: 'child', icon: 'star', title: 'slow · airy · warm', x: 1000, y: 980, w: 260, h: SK },
  { id: 'mb', kind: 'child', icon: 'doc', title: 'moodboard.html · link', mono: true, x: 60, y: 897, w: 290, h: SK },
  // 05 · Propuesta
  { id: 's5', kind: 'main', icon: 'doc', eyebrow: '05 · Se detiene ⏸', title: 'Propuesta', sub: 'Dirección “Tidal Calm”: arena + teal profundo, mucho espacio.', badge: 'Tú apruebas', x: 490, y: 1120, w: 420, h: 150 },
  { id: 'p1', kind: 'child', icon: 'spark', title: 'Tokens de color', x: 40, y: 1080, w: 260, h: SK },
  { id: 'p2', kind: 'child', icon: 'doc', title: 'Fraunces + Inter', x: 40, y: 1140, w: 260, h: SK },
  { id: 'p3', kind: 'child', icon: 'doc', title: 'proposal.html', mono: true, x: 40, y: 1200, w: 260, h: SK },
  { id: 'p4', kind: 'child', icon: 'flow', title: 'Motion = respiración', x: 1000, y: 1070, w: 300, h: SK },
  { id: 'p5', kind: 'child', icon: 'user', title: 'Interacciones', x: 1000, y: 1126, w: 300, h: SK },
  { id: 'p6', kind: 'child', icon: 'check', title: 'Accesibilidad · reduced motion', x: 1000, y: 1182, w: 300, h: SK },
  { id: 'r2', kind: 'child', icon: 'user', title: '“acento más cálido, aprobado”', x: 1000, y: 1250, w: 320, h: SK },
  // 06 · Construye
  { id: 's6', kind: 'main', icon: 'code', eyebrow: '06 · Auto · ~10–20 min', title: 'Construye', sub: 'Código real en tu proyecto, listo para npm run dev.', x: 490, y: 1370, w: 420, h: 140 },
  { id: 'b1', kind: 'child', icon: 'code', title: 'tokens → Tailwind', mono: true, x: 20, y: 1590, w: 240, h: SK },
  { id: 'b2', kind: 'child', icon: 'code', title: 'BreathOrb.tsx', mono: true, x: 290, y: 1590, w: 230, h: SK },
  { id: 'b3', kind: 'child', icon: 'code', title: 'Hero · Programs · CTA', x: 550, y: 1590, w: 270, h: SK },
  { id: 'b4', kind: 'child', icon: 'check', title: 'Reduced motion', x: 850, y: 1590, w: 230, h: SK },
  { id: 'b5', kind: 'child', icon: 'check', title: 'Check responsive', x: 1110, y: 1590, w: 240, h: SK },
];

const SKILL_EDGES: CanvasEdge[] = [
  { from: 's1', fs: 'bottom', to: 's2', ts: 'top', tone: 'human' },
  { from: 's2', fs: 'bottom', to: 's3', ts: 'top', tone: 'data' },
  { from: 's3', fs: 'bottom', to: 's4', ts: 'top', tone: 'human', label: 'top 5 aprobado' },
  { from: 's4', fs: 'bottom', to: 's5', ts: 'top', tone: 'data' },
  { from: 's5', fs: 'bottom', to: 's6', ts: 'top', tone: 'human', label: 'propuesta aprobada' },
  ...['brief', 'stack', 'links'].map((id) => ({ from: id, fs: 'right' as Side, to: 's1', ts: 'left' as Side, tone: 'child' as const })),
  { from: 's1', fs: 'right', to: 'cmd', ts: 'left', tone: 'data' },
  ...['pins', 'colors', 'soul'].map((id) => ({ from: 's2', fs: 'right' as Side, to: id, ts: 'left' as Side, tone: 'child' as const })),
  { from: 'skip', fs: 'right', to: 's2', ts: 'left', tone: 'child', dashed: true },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ from: `c${i}`, fs: 'right' as Side, to: 's3', ts: 'left' as Side, tone: 'child' as const })),
  { from: 's3', fs: 'right', to: 'ratings', ts: 'left', tone: 'child' },
  { from: 'r1', fs: 'left', to: 's3', ts: 'right', tone: 'human' },
  ...['m1', 'm2', 'm3', 'm4'].map((id) => ({ from: 's4', fs: 'right' as Side, to: id, ts: 'left' as Side, tone: 'child' as const })),
  { from: 's4', fs: 'left', to: 'mb', ts: 'right', tone: 'child' },
  ...['p1', 'p2', 'p3'].map((id) => ({ from: 's5', fs: 'left' as Side, to: id, ts: 'right' as Side, tone: 'child' as const })),
  ...['p4', 'p5', 'p6'].map((id) => ({ from: 's5', fs: 'right' as Side, to: id, ts: 'left' as Side, tone: 'child' as const })),
  { from: 'r2', fs: 'left', to: 's5', ts: 'right', tone: 'human' },
  ...['b1', 'b2', 'b3', 'b4', 'b5'].map((id) => ({ from: 's6', fs: 'bottom' as Side, to: id, ts: 'top' as Side, tone: 'child' as const })),
];

function SkillSlide() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Reveal>
            <p className="eyebrow">14.1 · Mi skill · AI Design Framework</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.04] text-[var(--text)]">
              De pins de Pinterest <span className={ACCENT}>a código que funciona.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill !text-[var(--text)]">
              <span className="dot bg-[var(--good)]" /> Tú: pegar links + aprobar 2 veces
            </span>
            <a href={SKILL_REPO} target="_blank" rel="noopener noreferrer" className="pill !text-[var(--text)]">
              <Github className="h-4 w-4" /> ai-design-framework
            </a>
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.1} className="mt-4">
        <div className="j-stage relative h-[max(22rem,calc(100svh-19.5rem))] overflow-hidden rounded-[28px]">
          <div className="j-stage-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <PanZoomCanvas width={SKILL_W} height={SKILL_H}>
            <NodeGraph id="skill" nodes={SKILL_NODES} edges={SKILL_EDGES} width={SKILL_W} height={SKILL_H} />
          </PanZoomCanvas>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 16 · Paso a paso                                                    */
/* ------------------------------------------------------------------ */

const STEPS = [
  { t: 'Crea el agente ADK', b: 'LlmAgent con instrucción en español y tus primeras tools con Zod.', link: { label: 'adk.dev', url: 'https://adk.dev/integrations/' }, icon: Brain },
  { t: 'Pruébalo en ADK Web', b: 'npx adk web: chat, eventos y estado antes de tocar el frontend.', link: { label: 'Guía ADK', url: `${REPO_URL}/blob/main/docs/guides/01-google-adk.md` }, icon: Eye },
  { t: 'Expónlo por AG-UI', b: 'Servidor con @ag-ui/adk para que el frontend reciba eventos SSE.', link: { label: 'ADK + AG-UI', url: 'https://adk.dev/integrations/ag-ui/' }, icon: Layers },
  { t: 'Conecta CopilotKit', b: 'CopilotRuntime en /api/copilotkit + useRenderTool por cada tool visible.', link: { label: 'Guía CopilotKit', url: `${REPO_URL}/blob/main/docs/guides/03-copilotkit.md` }, icon: Code2 },
  { t: 'Agrega UI generativa', b: 'Catálogo A2UI propio: plan, tarjetas de comunidad, aprobación humana.', link: { label: 'A2UI', url: 'https://a2ui.org/' }, icon: Sparkles },
  { t: 'Suma la voz con LiveKit', b: 'Worker Python con AgentSession; habla con la app por RPC.', link: { label: 'Guía LiveKit', url: `${REPO_URL}/blob/main/docs/guides/02-livekit.md` }, icon: Mic },
  { t: 'Despliega', b: 'Agente en Cloud Run, web en Vercel, voz en LiveKit Cloud.', link: { label: 'Guía deploy', url: `${REPO_URL}/blob/main/docs/guides/04-deploy-cloud.md` }, icon: Cloud },
];

function StepsSlide() {
  return (
    <div className="flex h-full flex-col justify-center">
      <SlideHead eyebrow="15 · Constrúyelo tú" title="Siete pasos" accent="para tu propio agente de voz." />
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.t} delay={0.12 + i * 0.05}>
            <div className="tile flex h-full flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <IconTile icon={s.icon} />
                <span className="mono text-sm text-[var(--dim)]">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="text-lg text-[var(--text)]">{s.t}</p>
              <p className="text-[13px] leading-relaxed text-[var(--dim)]">{s.b}</p>
              <a href={s.link.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 text-[13px] text-[var(--signal-soft)] hover:underline">
                {s.link.label} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </Reveal>
        ))}
        <Reveal delay={0.5}>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="blue-tile flex h-full flex-col justify-between gap-4 p-5">
            <Github className="h-6 w-6" />
            <div>
              <p className="text-lg">Todo el código</p>
              <p className="mt-1 text-[13px] text-white/80">Quickstart en 5 minutos · docs/guides</p>
            </div>
          </a>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 19 · Audiencia + perfil                                             */
/* ------------------------------------------------------------------ */

function QrCard({
  value,
  label,
  sub,
  size = 168,
  className = '',
}: {
  value: string;
  label: string;
  sub?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`tile flex h-full flex-col items-center gap-3 p-5 ${className}`}>
      <div className="rounded-2xl bg-white p-3">
        <QRCodeSVG value={value} size={size} fgColor="#05070d" bgColor="#ffffff" level="M" />
      </div>
      <p className="text-[15px] text-[var(--text)]">{label}</p>
      {sub && <p className="mono -mt-2 text-[11px] text-[var(--dim)]">{sub}</p>}
    </div>
  );
}

function AudienceSlide() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex min-h-[calc(100svh-14rem)] flex-col justify-center lg:pr-[min(46vw,620px)]">
      <Reveal>
        <p className="eyebrow">16 · Tu turno</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`${H2} mt-4`}>
          Gracias.
          <br />
          <span className={ACCENT}>No tengas miedo de aparecer.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <p className={`${LEAD} mt-5 max-w-xl`}>
          Muéstrate. El trabajo ya está. Falta que te vean. Escanea para conocer el trabajo y las comunidades.
        </p>
      </Reveal>
      <div className="mt-8 flex flex-wrap gap-4">
        <Reveal delay={0.28}>
          <QrCard value={SITE_URL} label="angelmateus.com" sub="Sitio y trabajo" size={148} />
        </Reveal>
        <Reveal delay={0.34}>
          <QrCard value={COMMUNITY_URL} label="Comunidades" sub="Visible Builders · AI Hub" size={148} />
        </Reveal>
      </div>
      <img
        src="/devfest-2026/angel-close.png"
        alt="Angel Arrieta"
        className="mx-auto mt-8 h-auto w-[min(100%,420px)] lg:hidden"
        draggable={false}
      />
      {mounted &&
        createPortal(
          <img
            src="/devfest-2026/angel-close.png"
            alt=""
            className="pointer-events-none fixed bottom-0 right-0 z-[15] hidden max-h-[94svh] w-[min(46vw,620px)] object-contain object-bottom lg:block"
            draggable={false}
          />,
          document.body,
        )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Presentación                                                        */
/* ------------------------------------------------------------------ */

const SLIDES = [
  { id: 'inicio', label: 'Inicio', Component: HookSlide },
  { id: 'voz-para-todos', label: 'Voz para todos', Component: PeopleSlide },
  { id: 'repo', label: 'Repo', Component: RepoQrSlide },
  { id: 'quien-soy', label: 'Quién soy', Component: WhoSlide },
  { id: 'futuro', label: 'El futuro', Component: FutureSlide },
  { id: 'hoy', label: 'Así se ven hoy', Component: TodaySlide },
  { id: 'problema', label: 'El problema', Component: ProblemSlide },
  { id: 'casos', label: 'Casos reales', Component: CasesSlide },
  { id: 'arquitectura', label: 'Arquitectura', Component: ArchitectureSlide },
  { id: 'adk', label: 'Google ADK', Component: AdkSlide },
  { id: 'que-es-livekit', label: '¿Qué es LiveKit?', Component: LiveKitIntroSlide },
  { id: 'livekit', label: 'LiveKit', Component: LiveKitSlide },
  { id: 'livekit-costos', label: 'Costos', Component: LiveKitCostSlide },
  { id: 'livekit-seguridad', label: 'Seguridad', Component: LiveKitSecuritySlide },
  { id: 'emocion', label: 'Voz y emoción', Component: EmotionSlide },
  { id: 'que-es-copilotkit', label: '¿Qué es CopilotKit?', Component: CopilotKitIntroSlide },
  { id: 'copilotkit', label: 'CopilotKit', Component: CopilotKitSlide },
  { id: 'tecnologias', label: 'Tecnologías', Component: StackSlide },
  { id: 'ai-design-framework', label: 'Mi skill de diseño', Component: SkillSlide },
  { id: 'paso-a-paso', label: 'Paso a paso', Component: StepsSlide },
  { id: 'audiencia', label: 'Audiencia', Component: AudienceSlide },
];

export default function DevFestVoiceAgentDeck() {
  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);
  /** Product intro + ElevenLabs narration — plays once on first open of Inicio (skipped on deep-links). */
  const [introOpen, setIntroOpen] = useState(true);
  /** Deck chrome stays hidden until the intro handoff (or skip), so slide 1 never flashes first. */
  const [deckVisible, setDeckVisible] = useState(false);
  const introPlayed = useRef(false);

  const go = useCallback((next: number) => {
    setPage(([current]) => {
      const clamped = Math.max(0, Math.min(SLIDES.length - 1, next));
      return clamped === current ? [current, 0] : [clamped, clamped > current ? 1 : -1];
    });
  }, []);

  const closeIntro = useCallback(() => {
    document.documentElement.removeAttribute('data-intro');
    setIntroOpen(false);
    setDeckVisible(true);
    introPlayed.current = true;
  }, []);

  // Deep-link: #arquitectura opens that slide (handy while presenting / sharing).
  useEffect(() => {
    const fromHash = SLIDES.findIndex((s) => s.id === window.location.hash.slice(1));
    if (fromHash > 0) {
      setPage([fromHash, 0]);
      introPlayed.current = true;
      setIntroOpen(false);
      setDeckVisible(true);
      document.documentElement.removeAttribute('data-intro');
      return;
    }
    document.documentElement.setAttribute('data-intro', '1');
  }, []);

  // Reveal the deck when the intro hole opens (handoff), not before.
  useEffect(() => {
    if (!introOpen) {
      setDeckVisible(true);
      return;
    }
    const onHandoff = () => setDeckVisible(true);
    window.addEventListener(INTRO_HANDOFF_EVENT, onHandoff);
    return () => window.removeEventListener(INTRO_HANDOFF_EVENT, onHandoff);
  }, [introOpen]);

  useEffect(() => {
    window.history.replaceState(null, '', index === 0 ? window.location.pathname : `#${SLIDES[index].id}`);
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable="true"]')) return;
      // While the cinematic intro plays, only Escape/Enter (handled inside IntroSequence) matter.
      if (introOpen) return;
      if (document.body.dataset.mediaLightbox === 'open') {
        const onVideo = Boolean(target?.closest('video'));
        if (!onVideo && (event.key === ' ' || event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'PageDown' || event.key === 'PageUp')) {
          event.preventDefault();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          window.dispatchEvent(new Event('close-media-lightbox'));
        }
        return;
      }
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        setPage(([current]) => (current < SLIDES.length - 1 ? [current + 1, 1] : [current, 0]));
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        setPage(([current]) => (current > 0 ? [current - 1, -1] : [current, 0]));
      } else if (event.key === 'Home') {
        setPage(([current]) => [0, current === 0 ? 0 : -1]);
      } else if (event.key === 'End') {
        setPage(([current]) => [SLIDES.length - 1, current === SLIDES.length - 1 ? 0 : 1]);
      } else if (event.key === 'f' || event.key === 'F') {
        if (document.fullscreenElement) document.exitFullscreen?.();
        else document.documentElement.requestFullscreen?.().catch(() => {});
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [introOpen]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (introOpen) return;
    if (info.offset.x < -80 || info.velocity.x < -500) go(index + 1);
    else if (info.offset.x > 80 || info.velocity.x > 500) go(index - 1);
  };

  const { Component } = SLIDES[index];

  return (
    <main lang="es" className="cva relative flex h-[100svh] flex-col overflow-hidden selection:bg-[#2f6bff]/40">
      <style dangerouslySetInnerHTML={{ __html: KIT_CSS }} />

      {/* Solid cover from first paint — kills the hook-slide flash before the intro portal mounts. */}
      {introOpen && <div className="fixed inset-0 z-[79] bg-[#02040c]" aria-hidden="true" />}
      {introOpen && <IntroSequence onDone={closeIntro} />}

      {/* Moving print border, same as the product */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="edge-wake-mesh" />
        <div className="edge-wake-wash" />
      </div>

      <div
        className={`relative z-10 flex min-h-0 flex-1 flex-col transition-[opacity,filter] duration-700 ease-out ${
          deckVisible ? 'opacity-100' : 'pointer-events-none opacity-0 blur-sm'
        }`}
        aria-hidden={!deckVisible}
      >
        <header className="relative z-20">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-5 py-4 md:px-10">
            <Link href="/post" className="pill !text-[var(--text)]">
              <ArrowLeft className="h-4 w-4" /> Posts
            </Link>
            <p className="hidden truncate text-sm text-[var(--dim)] md:block">
              DevFest Medellín 2026 · Agente comercial de voz
            </p>
            <p className="mono pill tabular-nums">
              {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </p>
          </div>
          <div className="mx-auto h-[2px] max-w-[1400px] px-5 md:px-10">
            <div className="h-full rounded-full bg-[var(--line)]">
              <motion.div
                className="h-full rounded-full bg-[var(--signal)]"
                animate={{ width: `${((index + 1) / SLIDES.length) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              />
            </div>
          </div>
        </header>

        <div className="relative z-10 flex-1 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.section
              key={SLIDES[index].id}
              custom={direction}
              variants={{
                enter: (dir: number) => ({ opacity: 0, x: dir * 60, filter: 'blur(6px)' }),
                center: { opacity: 1, x: 0, filter: 'blur(0px)' },
                exit: (dir: number) => ({ opacity: 0, x: dir * -60, filter: 'blur(6px)' }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={onDragEnd}
              className="absolute inset-0 overflow-y-auto"
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${SLIDES.length}: ${SLIDES[index].label}`}
            >
              <div className="mx-auto min-h-full max-w-[1400px] px-5 pb-32 pt-8 md:px-10 md:pt-12">
                <Component />
              </div>
            </motion.section>
          </AnimatePresence>
        </div>

        <nav className="dock absolute bottom-5 left-1/2 z-20 -translate-x-1/2" aria-label="Diapositivas">
          <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Diapositiva anterior" className="cbtn">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-1.5 px-2 sm:flex">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => go(i)}
                aria-label={`Ir a ${slide.label}`}
                aria-current={i === index ? 'step' : undefined}
                className="group relative py-2"
              >
                <motion.span
                  className="block h-1.5 rounded-full"
                  animate={{ width: i === index ? 22 : 6, backgroundColor: i === index ? '#2f6bff' : 'rgba(242,244,248,0.3)' }}
                  transition={{ duration: 0.35 }}
                />
                <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--raise)] px-2.5 py-1 text-xs text-[var(--text)] group-hover:block">
                  {slide.label}
                </span>
              </button>
            ))}
          </div>
          <p className="whitespace-nowrap px-3 text-sm text-[var(--dim)] sm:hidden">{SLIDES[index].label}</p>
          <button onClick={() => go(index + 1)} disabled={index === SLIDES.length - 1} aria-label="Siguiente diapositiva" className="cbtn">
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </main>
  );
}
