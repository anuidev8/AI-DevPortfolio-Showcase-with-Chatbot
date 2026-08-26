'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// VisibleBuilders brand palette — cyber neon from visiblebuilders.io
const VB = {
  bg: '#0b011d',
  bgCard: '#12081f',
  bgCardAlt: '#1a0f2e',
  cyan: '#00f2ff',
  magenta: '#ff007a',
  purple: '#b44aff',
  white: '#f5f5f5',
  muted: 'rgba(245,245,245,0.45)',
  border: 'rgba(255,255,255,0.1)',
  borderAccent: 'rgba(0,242,255,0.4)',
  glow: '0 0 24px rgba(0,242,255,0.45)',
  glowMagenta: '0 0 24px rgba(255,0,122,0.4)',
};

const SLIDES = ['intro', 'purpose', 'talks', 'community'] as const;
type Slide = (typeof SLIDES)[number];

const purposePoints = [
  {
    number: '01',
    title: 'Real Talks',
    description: 'Builders share what they are shipping — AI workflows, products, and lessons from the field.',
    accent: VB.cyan,
  },
  {
    number: '02',
    title: 'Real Experiences',
    description: 'Not panels. Live stories, demos, and conversations you can take into your next build.',
    accent: VB.magenta,
  },
  {
    number: '03',
    title: 'New Connections',
    description: 'Meet AI solo builders, creators, and the Visible Builders tribe in Medellín.',
    accent: VB.purple,
  },
];

const FALLBACK_SPEAKERS = [
  {
    id: 1,
    name: 'Erix Mendoza',
    role: 'Android Engineer in Mercado Libre | GDG Medellín Lead',
    image: '/social/ai-after-hours/speakers/erix-mendoza.png',
    initials: 'EM',
    accent: VB.magenta,
  },
  {
    id: 2,
    name: 'Penelope Sloan Creative',
    role: 'Creative Director, Brand Strategist and AI Consultant',
    image: '/social/ai-after-hours/speakers/penelope-sloan.png',
    initials: 'PS',
    accent: VB.purple,
  },
];

type SlideSpeaker = {
  id: number;
  name: string;
  role: string;
  image: string;
  initials: string;
  accent: string;
};

const sponsors = [
  {
    name: 'The School of Breath',
    image: '/sponsors/school-of-breath.png',
    fit: 'cover' as const,
    mark: 'photo' as const,
  },
  {
    name: 'Vivus La Martina Boutique Hotel',
    image: '/sponsors/vivus-la-martina.png',
    fit: 'contain' as const,
    mark: 'vivus' as const,
  },
];

/* Vivus mark — overlapping circles + center dot */
function VivusMark({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const box = size === 'lg' ? 'h-36 w-36 sm:h-44 sm:w-44' : 'h-20 w-20';
  return (
    <div
      className={`${box} flex items-center justify-center overflow-hidden rounded-full`}
      style={{
        background: '#f5f0e8',
        boxShadow: `0 0 ${size === 'lg' ? '36px' : '18px'} ${VB.magenta}44`,
        border: `1px solid ${VB.magenta}40`,
      }}
      aria-label="Vivus La Martina"
    >
      <svg
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        className={size === 'lg' ? 'h-[88%] w-[88%]' : 'h-[90%] w-[90%]'}
      >
        <circle cx="46" cy="62" r="34" fill="none" stroke="#6b5344" strokeWidth="2" opacity="0.55" />
        <circle cx="74" cy="62" r="34" fill="none" stroke="#6b5344" strokeWidth="2" />
        <circle cx="60" cy="38" r="23" fill="none" stroke="#6b5344" strokeWidth="1.2" opacity="0.32" />
        <circle cx="60" cy="62" r="4" fill="#6b5344" />
      </svg>
    </div>
  );
}

function SponsorLogo({
  name,
  image,
  fit,
  mark = 'photo',
  size = 'lg',
}: {
  name: string;
  image: string;
  fit: 'cover' | 'contain';
  mark?: 'photo' | 'vivus';
  size?: 'lg' | 'sm';
}) {
  if (mark === 'vivus') {
    return <VivusMark size={size} />;
  }

  const box = size === 'lg' ? 'h-36 w-36 sm:h-44 sm:w-44' : 'h-20 w-20';
  return (
    <div
      className={`${box} overflow-hidden rounded-full`}
      style={{
        background: 'transparent',
        boxShadow: `0 0 ${size === 'lg' ? '36px' : '18px'} ${VB.cyan}55`,
        border: `1px solid ${VB.cyan}33`,
      }}
    >
      <img
        src={image}
        alt={name}
        className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
      />
    </div>
  );
}

/* ── Grid + purple ambience like visiblebuilders.io ── */
function BrandAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(${VB.cyan}18 1px, transparent 1px),
            linear-gradient(90deg, ${VB.cyan}18 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 70% 40%, ${VB.purple}22 0%, transparent 55%),
            radial-gradient(ellipse 45% 40% at 20% 80%, ${VB.magenta}12 0%, transparent 50%)
          `,
        }}
      />
    </>
  );
}
function CircuitPattern() {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 h-52 w-52 opacity-30"
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="20" y1="20" x2="80" y2="20" stroke={VB.cyan} strokeWidth="1.5" />
      <line x1="80" y1="20" x2="80" y2="60" stroke={VB.cyan} strokeWidth="1.5" />
      <line x1="80" y1="60" x2="140" y2="60" stroke={VB.cyan} strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="100" stroke={VB.cyan} strokeWidth="1.5" />
      <line x1="40" y1="100" x2="100" y2="100" stroke={VB.cyan} strokeWidth="1.5" />
      <line x1="100" y1="80" x2="100" y2="130" stroke={VB.cyan} strokeWidth="1.5" />
      <line x1="20" y1="50" x2="40" y2="50" stroke={VB.cyan} strokeWidth="1.5" />
      <circle cx="20" cy="20" r="4" fill={VB.cyan} />
      <circle cx="80" cy="20" r="4" fill={VB.cyan} />
      <circle cx="40" cy="20" r="3" fill={VB.cyan} />
      <circle cx="80" cy="60" r="4" fill={VB.cyan} />
      <circle cx="140" cy="60" r="4" fill={VB.cyan} />
      <circle cx="40" cy="100" r="4" fill={VB.cyan} />
      <circle cx="100" cy="100" r="4" fill={VB.cyan} />
      <circle cx="100" cy="130" r="4" fill={VB.cyan} />
      <circle cx="20" cy="50" r="3" fill={VB.cyan} />
    </svg>
  );
}

/* ── Wave mesh texture — edges only, center clear ── */
function WaveTexture() {
  const mesh = {
    backgroundImage: 'url(/social/ai-after-hours/textures/hero-wave-mesh.jpg)',
    backgroundSize: 'cover' as const,
    backgroundRepeat: 'no-repeat' as const,
    mixBlendMode: 'screen' as const,
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Left edge */}
      <div
        className="absolute inset-y-0 left-0"
        style={{
          ...mesh,
          width: 'min(42%, 520px)',
          backgroundPosition: 'left center',
          opacity: 0.7,
          filter: 'hue-rotate(175deg) saturate(2) brightness(1.3) contrast(1.1)',
          WebkitMaskImage: 'linear-gradient(90deg, #000 0%, #000 40%, transparent 100%)',
          maskImage: 'linear-gradient(90deg, #000 0%, #000 40%, transparent 100%)',
        }}
      />
      {/* Right edge */}
      <div
        className="absolute inset-y-0 right-0"
        style={{
          ...mesh,
          width: 'min(42%, 520px)',
          backgroundPosition: 'right center',
          opacity: 0.7,
          filter: 'hue-rotate(300deg) saturate(2.2) brightness(1.25) contrast(1.1)',
          WebkitMaskImage: 'linear-gradient(270deg, #000 0%, #000 40%, transparent 100%)',
          maskImage: 'linear-gradient(270deg, #000 0%, #000 40%, transparent 100%)',
        }}
      />
      {/* Top edge */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          ...mesh,
          height: 'min(28%, 240px)',
          backgroundPosition: 'center top',
          opacity: 0.45,
          filter: 'hue-rotate(180deg) saturate(1.8) brightness(1.25)',
          WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 35%, transparent 100%)',
          maskImage: 'linear-gradient(180deg, #000 0%, #000 35%, transparent 100%)',
        }}
      />
      {/* Bottom edge */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          ...mesh,
          height: 'min(30%, 260px)',
          backgroundPosition: 'center bottom',
          opacity: 0.5,
          filter: 'hue-rotate(310deg) saturate(2) brightness(1.3)',
          WebkitMaskImage: 'linear-gradient(0deg, #000 0%, #000 35%, transparent 100%)',
          maskImage: 'linear-gradient(0deg, #000 0%, #000 35%, transparent 100%)',
        }}
      />
      {/* Soft corner glows — cyan + magenta energy */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 35% 50% at 0% 50%, ${VB.cyan}28 0%, transparent 70%),
            radial-gradient(ellipse 35% 50% at 100% 50%, ${VB.magenta}26 0%, transparent 70%),
            radial-gradient(ellipse 40% 28% at 50% 0%, ${VB.purple}18 0%, transparent 65%),
            radial-gradient(ellipse 40% 28% at 50% 100%, ${VB.cyan}16 0%, transparent 65%)
          `,
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}

/* ── Martini glass ── */
function MartiniGlass() {
  return (
    <svg
      className="pointer-events-none absolute bottom-8 right-8 h-28 w-20 opacity-25"
      viewBox="0 0 80 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 8 L70 8 L40 52 Z" stroke={VB.cyan} strokeWidth="2.5" fill="none" />
      <line x1="40" y1="52" x2="40" y2="88" stroke={VB.cyan} strokeWidth="2.5" />
      <line x1="22" y1="88" x2="58" y2="88" stroke={VB.cyan} strokeWidth="2.5" />
      <circle cx="68" cy="6" r="3" fill={VB.cyan} />
      <line x1="68" y1="6" x2="60" y2="16" stroke={VB.cyan} strokeWidth="1.5" />
      <circle cx="60" cy="6" r="2" fill={VB.cyan} opacity="0.7" />
    </svg>
  );
}

/* ── Speaker avatar ── */
function SpeakerAvatar({ image, name, initials, accent }: { image: string; name: string; initials: string; accent: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div
      className="mx-auto h-64 w-64 overflow-hidden rounded-full sm:h-80 sm:w-80 md:h-[26rem] md:w-[26rem]"
      style={{ border: `4px solid ${accent}`, boxShadow: `0 0 56px ${accent}88` }}
    >
      {ok ? (
        <img src={image} alt={name} className="h-full w-full object-cover object-top" onError={() => setOk(false)} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-6xl font-black" style={{ backgroundColor: accent + '22', color: accent }}>
          {initials}
        </div>
      )}
    </div>
  );
}

/* ── Slide 1: Intro ── */
function SlideIntro() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden" style={{ background: VB.bg }}>
      {/* scanline texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)', backgroundSize: '100% 3px' }} />

      <BrandAtmosphere />
      <CircuitPattern />
      <WaveTexture />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 py-10 text-center">
        {/* Brand pill */}
        <div
          className="mb-8 inline-block px-7 py-2.5 font-mono text-sm font-bold uppercase tracking-[0.28em] sm:text-base"
          style={{ border: `2px solid ${VB.cyan}`, background: VB.cyan + '14', boxShadow: VB.glow }}
        >
          <span style={{ color: VB.cyan }}>VISIBLE</span>{' '}
          <span style={{ color: VB.magenta }}>BUILDERS</span>
        </div>

        <h1
          className="font-sans font-black uppercase leading-[0.8] tracking-tight"
          style={{ fontSize: 'clamp(5.5rem, 18vw, 11rem)', color: VB.white, textShadow: `0 0 40px ${VB.cyan}33` }}
        >
          AI
          <br />
          AFTER
          <br />
          HOURS
        </h1>

        <p
          className="mt-8 px-4 text-center font-sans font-black uppercase leading-tight tracking-tight"
          style={{ fontSize: 'clamp(1.25rem, 4vw, 2.25rem)', color: VB.muted }}
        >
          <span style={{ color: VB.cyan, textShadow: VB.glow }}>The Power</span>
          <span style={{ color: VB.white }}> of </span>
          <span style={{ color: VB.magenta, textShadow: VB.glowMagenta }}>Being Visible</span>
        </p>

        {/* Sponsors */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-10 sm:gap-14">
          {sponsors.map((sponsor) => (
            <div key={sponsor.name} className="flex flex-col items-center gap-3">
              <SponsorLogo name={sponsor.name} image={sponsor.image} fit={sponsor.fit} mark={sponsor.mark} size="lg" />
              <p className="max-w-[200px] text-center font-mono text-sm font-bold uppercase leading-snug tracking-wide sm:text-base" style={{ color: VB.white }}>
                {sponsor.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t px-8 py-4 text-center" style={{ borderColor: VB.border }}>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.28em]" style={{ color: VB.muted }}>
          <span style={{ color: VB.cyan }}>{'>'}</span> VISIBLEBUILDERS.IO
        </p>
      </div>

      <MartiniGlass />
    </div>
  );
}

/* ── Slide 2: Purpose ── */
function SlidePurpose() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden" style={{ background: VB.bg }}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)', backgroundSize: '100% 3px' }} />

      <BrandAtmosphere />
      <CircuitPattern />
      <WaveTexture />

      <div className="relative z-10 flex flex-1 flex-col px-8 py-10 md:px-14">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 inline-block px-4 py-1 font-mono text-xs font-bold uppercase tracking-widest"
            style={{ border: `1px solid ${VB.cyan}`, background: VB.cyan + '14', boxShadow: VB.glow }}>
            <span style={{ color: VB.cyan }}>VISIBLE</span>{' '}
            <span style={{ color: VB.magenta }}>BUILDERS</span>
          </div>
          <h2
            className="font-sans font-black uppercase leading-[0.88]"
            style={{ fontSize: 'clamp(2.2rem, 8vw, 5rem)', color: VB.white }}
          >
            WHY WE GATHER
          </h2>
          <p className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.22em]" style={{ color: VB.muted }}>
            The purpose of AI After Hours
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-5 md:gap-6">
          {purposePoints.map((point) => (
            <div
              key={point.number}
              className="flex items-start gap-5 px-5 py-5 md:gap-7 md:px-7 md:py-6"
              style={{
                background: `linear-gradient(135deg, ${point.accent}22 0%, ${VB.bgCard} 42%, ${VB.bg} 100%)`,
                border: `1px solid ${point.accent}55`,
                boxShadow: `0 0 28px ${point.accent}18`,
              }}
            >
              <span
                className="shrink-0 font-mono text-3xl font-black md:text-5xl"
                style={{ color: point.accent, textShadow: `0 0 20px ${point.accent}66` }}
              >
                {point.number}
              </span>
              <div className="min-w-0 text-left">
                <h3
                  className="font-sans text-2xl font-black uppercase leading-tight tracking-wide md:text-4xl"
                  style={{ color: VB.white }}
                >
                  {point.title}
                </h3>
                <p className="mt-2 max-w-xl font-mono text-sm leading-relaxed md:text-base" style={{ color: VB.muted }}>
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Slide 3: Talks ── */
function SlideTalks() {
  const [speakers, setSpeakers] = useState<SlideSpeaker[]>(FALLBACK_SPEAKERS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/speakers', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as {
          speakers?: Array<{
            id: number;
            name: string;
            role: string;
            imageUrl: string;
            accent: string;
            initials: string;
          }>;
        };
        if (cancelled || !data.speakers?.length) return;
        setSpeakers(
          data.speakers.map((s) => ({
            id: s.id,
            name: s.name,
            role: s.role,
            image: s.imageUrl,
            initials: s.initials,
            accent: s.accent || VB.cyan,
          }))
        );
      } catch {
        // keep fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden" style={{ background: VB.bg }}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)', backgroundSize: '100% 3px' }} />

      <BrandAtmosphere />
      <CircuitPattern />
      <WaveTexture />

      <div className="relative z-10 flex flex-1 flex-col items-center px-8 py-10">
        <div className="mb-8 w-full text-center">
          <div className="mx-auto mb-4 inline-block px-4 py-1 font-mono text-xs font-bold uppercase tracking-widest"
            style={{ border: `1px solid ${VB.cyan}`, background: VB.cyan + '14', boxShadow: VB.glow }}>
            <span style={{ color: VB.cyan }}>VISIBLE</span>{' '}
            <span style={{ color: VB.magenta }}>BUILDERS</span>
          </div>
          <p
            className="mx-auto font-sans font-black uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(1.6rem, 5.5vw, 3.5rem)' }}
          >
            <span style={{ color: VB.cyan, textShadow: VB.glow }}>The Power</span>
            <span style={{ color: VB.white }}> of </span>
            <span style={{ color: VB.magenta, textShadow: VB.glowMagenta }}>Being Visible</span>
          </p>
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center gap-10 sm:flex-row sm:flex-wrap sm:items-start sm:justify-center sm:gap-20 md:gap-28">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="flex max-w-[420px] flex-col items-center text-center">
              <SpeakerAvatar image={speaker.image} name={speaker.name} initials={speaker.initials} accent={speaker.accent} />
              <p className="mt-6 font-sans text-xl font-black uppercase leading-tight tracking-wide sm:text-2xl" style={{ color: VB.white }}>
                {speaker.name}
              </p>
              <p className="mt-2 max-w-sm font-mono text-sm leading-relaxed sm:text-base" style={{ color: VB.muted }}>
                {speaker.role}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="font-mono text-sm font-black uppercase tracking-[0.18em]" style={{ color: VB.white }}>
            JOIN THE <span style={{ color: VB.magenta, textShadow: VB.glowMagenta }}>BUILD</span>
          </p>
          <p className="mt-1 font-mono text-xs font-bold uppercase tracking-widest" style={{ color: VB.muted }}>
            <span style={{ color: VB.cyan }}>{'>'}</span> VISIBLEBUILDERS.IO
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Slide 4: Community ── */
function SlideCommunity() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden" style={{ background: VB.bg }}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)', backgroundSize: '100% 3px' }} />

      <BrandAtmosphere />
      <CircuitPattern />
      <WaveTexture />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-8 text-center sm:px-8 sm:py-10">
        <div className="mb-4 inline-block px-4 py-1 font-mono text-xs font-bold uppercase tracking-widest sm:mb-5"
          style={{ border: `1px solid ${VB.cyan}`, background: VB.cyan + '14', boxShadow: VB.glow }}>
          <span style={{ color: VB.cyan }}>VISIBLE</span>{' '}
          <span style={{ color: VB.magenta }}>BUILDERS</span>
        </div>

        <h2 className="font-sans font-black uppercase leading-[0.88]" style={{ fontSize: 'clamp(3rem, 12vw, 6.5rem)', color: VB.white }}>
          JOIN<br />THE <span style={{ color: VB.magenta, textShadow: VB.glowMagenta }}>BUILD</span>
        </h2>

        <p className="mt-3 max-w-sm font-mono text-xs leading-relaxed sm:mt-4 sm:text-sm" style={{ color: VB.muted }}>
          Connect with builders, creators and AI enthusiasts in Medellín.
        </p>

        {/* QR — WhatsApp Medellín AI VisibleBuilders invite */}
        <div className="mt-6 p-3 sm:mt-8 sm:p-4" style={{ background: VB.white, border: `3px solid ${VB.cyan}`, boxShadow: VB.glow }}>
          <img
            src="/social/ai-after-hours/community-qr.png"
            alt="Scan to join Medellín AI VisibleBuilders on WhatsApp"
            className="h-56 w-56 object-contain sm:h-72 sm:w-72 md:h-80 md:w-80"
          />
        </div>

        <p className="mt-4 font-mono text-sm font-bold uppercase tracking-[0.28em] sm:text-base" style={{ color: VB.magenta, textShadow: VB.glowMagenta }}>
          {'>'} SCAN TO JOIN
        </p>

        <div className="mt-6 flex w-full max-w-md items-center gap-3 sm:mt-7">
          <div className="h-px flex-1" style={{ background: VB.border }} />
          <span className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: VB.muted }}>visiblebuilders.io</span>
          <div className="h-px flex-1" style={{ background: VB.border }} />
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function AIAfterHoursPost() {
  const [current, setCurrent] = useState<Slide>('intro');
  const idx = SLIDES.indexOf(current);

  function prev() { if (idx > 0) setCurrent(SLIDES[idx - 1]); }
  function next() { if (idx < SLIDES.length - 1) setCurrent(SLIDES[idx + 1]); }

  return (
    <main className="relative flex h-screen flex-col overflow-hidden font-sans" style={{ background: VB.bg }}>
      {/* Overlay nav */}
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link href="/" className="group flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors hover:text-white" style={{ color: VB.muted }}>
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
            Portfolio
          </Link>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: VB.muted }}>AI After Hours</p>
          <Link
            href="/post/ai-after-hours/admin"
            className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/30 transition-colors hover:text-[#00f2ff]"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Full-screen slide */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {current === 'intro' && <SlideIntro />}
            {current === 'purpose' && <SlidePurpose />}
            {current === 'talks' && <SlideTalks />}
            {current === 'community' && <SlideCommunity />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 inset-x-0 z-50 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={s}
              onClick={() => setCurrent(s)}
              className="h-2 rounded-full transition-all"
              style={{ width: s === current ? '2.5rem' : '0.5rem', background: s === current ? VB.cyan : VB.border }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-5">
          <button onClick={prev} disabled={idx === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-25"
            style={{ border: `1px solid ${VB.cyan}40`, background: VB.cyan + '14', color: VB.cyan }}>
            <ArrowLeft size={16} />
          </button>
          <span className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: VB.muted }}>
            {idx + 1} / {SLIDES.length}
          </span>
          <button onClick={next} disabled={idx === SLIDES.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-25"
            style={{ border: `1px solid ${VB.cyan}40`, background: VB.cyan + '14', color: VB.cyan }}>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}
