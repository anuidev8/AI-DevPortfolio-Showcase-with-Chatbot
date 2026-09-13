'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

/**
 * Wellness palette — spa / breath / recovery
 * Deep teal + sage + soft clay on mist (not cyber neon)
 * Refs: dusty teal #5E8B87, sage greens, soft terracotta accents
 */
const VB = {
  bg: '#F2F7F5',
  bgAlt: '#E6F0EC',
  bgCard: '#FFFFFF',
  cyan: '#1F6F68', // deep spa teal
  magenta: '#C97B6B', // soft clay / blush
  purple: '#6B9B8A', // sage
  white: '#1A2E2B', // forest ink (text)
  muted: 'rgba(26, 46, 43, 0.58)',
  border: 'rgba(31, 111, 104, 0.16)',
  glow: '0 0 28px rgba(31, 111, 104, 0.22)',
  soft: '#83C5BE', // light aqua highlight
};

type Lang = 'en' | 'es';
const LANG_KEY = 'vb-voice-wellness-lang';

const CONTACT: Record<Lang, string> = {
  en: 'mailto:hello@visiblebuilders.io?subject=Agentic%20Voice%20Wellness%20Hackathon%20%E2%80%94%20Join',
  es: 'mailto:hello@visiblebuilders.io?subject=Hackathon%20Agentic%20Voice%20Wellness%20%E2%80%94%20Inscripci%C3%B3n',
};

const copy = {
  en: {
    back: 'Back',
    eyebrow: 'Challenge reveal · Teams · Medellín',
    badges: ['One-day hackathon', 'Multidisciplinary teams', 'Voice AI builders'],
    titleA: 'Agentic Voice',
    titleB: 'Wellness',
    titleC: 'Hackathon',
    heroLead:
      'Build voice agents that help people breathe, move, focus, rest and feel better — with real listening, reasoning, tool use and safe wellness actions.',
    heroPrize: 'Named prizes · Category awards · Path to pilot',
    ctaPrimary: 'Join the challenge',
    ctaSecondary: 'See the brief',
    strip: 'Prevention & everyday wellness · Not diagnosis or treatment',

    whatLabel: 'What you build',
    whatTitle: 'A working agentic voice wellness prototype.',
    whatBody:
      'In one day, your team ships a voice agent that listens, understands needs, decides next steps, calls tools or APIs, responds naturally, and completes a useful wellness action — without medical claims.',
    whatPills: ['Listen', 'Reason', 'Tool use', 'Voice reply', 'Wellness action'],

    rewardsLabel: 'Awards designed for builders',
    rewardsTitle: 'Compete across tracks. Win category and grand prizes.',
    rewards: [
      { place: 'Grand Prize', prize: 'Best Agentic Voice Wellness Experience' },
      { place: 'Track awards', prize: 'Breath · Move · Mind · Sleep · Work · Inclusive' },
      { place: 'Special', prize: 'Best sponsor tech · People’s Choice' },
    ],
    rewardsNote: 'Prizes may include API credits, coaching, memberships, coworking, courses, cloud and pilot intros.',

    milestonesLabel: 'How the challenge runs',
    milestonesTitle: 'Prep first. Then one focused build day.',
    milestones: [
      { n: '01', title: 'Prep session', body: '1–2 weeks before: Voice AI workshop, API setup, starter repo, wellness & safety briefing, category pick.' },
      { n: '02', title: 'Kickoff', body: 'Welcome, wellness keynote, Voice AI briefing, challenge tracks explained.' },
      { n: '03', title: 'Build sprints', body: 'Team formation, mentor support, two building sprints, troubleshooting block.' },
      { n: '04', title: 'Demo day', body: '5-minute pitches, judging, awards and next steps toward pilots.' },
    ],

    agendaLabel: 'Main event agenda',
    agendaTitle: 'From registration to awards.',
    agenda: [
      { t: '9:30', l: 'Registration & networking' },
      { t: '10:00', l: 'Welcome & sponsor intros' },
      { t: '10:15', l: 'Wellness keynote' },
      { t: '10:35', l: 'Voice AI & agentic briefing' },
      { t: '10:55', l: 'Categories & challenges' },
      { t: '11:10', l: 'Team formation' },
      { t: '12:00', l: 'Build sprint one' },
      { t: '13:00', l: 'Lunch' },
      { t: '13:40', l: 'Build sprint two' },
      { t: '14:45', l: 'Mentor reviews' },
      { t: '15:15', l: 'Final build & pitch prep' },
      { t: '16:00', l: 'Demos & judging' },
      { t: '16:45', l: 'Awards & closing' },
    ],

    tracksLabel: 'Challenge tracks',
    tracksTitle: 'Six wellness categories. Pick one.',
    tracksBody: 'Each track has a concrete challenge for teams — not medical treatment.',
    tracks: [
      { letter: 'A', title: 'Breathwork', body: 'Guided breathing, stress resets, sleep prep, focus sessions.' },
      { letter: 'B', title: 'Yoga & movement', body: 'Desk stretches, mobility breaks, beginner voice-guided routines. No injury treatment.' },
      { letter: 'C', title: 'Mindfulness', body: 'Meditation, grounding, focus, emotional awareness, digital detox.' },
      { letter: 'D', title: 'Sleep & recovery', body: 'Evening wind-down and calm routines — no clinical sleep claims.' },
      { letter: 'E', title: 'Workplace wellbeing', body: 'Meeting prep, focus breaks, private check-ins. Employers never see private chat.' },
      { letter: 'F', title: 'Inclusive wellness', body: 'Older adults, visual disability, low digital literacy, multilingual Medellín visitors.' },
    ],

    agenticLabel: 'Quality bar',
    agenticTitle: 'What “agentic voice” means here.',
    agenticBody:
      'A fixed meditation recording alone does not qualify. Include at least two capabilities:',
    agenticCaps: [
      'Conversation',
      'Planning',
      'Memory + consent',
      'Tool use',
      'Personalization',
      'Multimodal output',
      'Human escalation',
      'Evaluation',
    ],

    deliverLabel: 'Required deliverables',
    deliverTitle: 'Ship a small prototype — not a full product.',
    deliverables: [
      'One clear user + wellness problem',
      'One primary voice flow',
      'Working live demo',
      'At least one agentic action / tool call',
      'Safety & privacy explanation',
      '5-minute final presentation',
      'Public repo + README with setup',
    ],
    deliverNot: 'Not required: production infra, subscriptions, clinical validation, finished mobile app, multi-agent complexity.',

    rubricLabel: 'Judging · 100 points',
    rubricTitle: 'A clear rubric before you build.',
    rubricGatesTitle: 'Before scoring, every team must show',
    rubricGates: [
      'Real voice interaction',
      'Defined problem + target user',
      'At least one agentic action',
      'Safe response when uncertain',
      'Working prototype + pitch',
    ],
    rubric: [
      { pts: 20, label: 'Problem clarity & user relevance' },
      { pts: 20, label: 'Voice experience & conversation' },
      { pts: 20, label: 'Wellness value' },
      { pts: 15, label: 'Agentic behavior & technical depth' },
      { pts: 15, label: 'Safety, privacy & responsible design' },
      { pts: 5, label: 'Accessibility & inclusion' },
      { pts: 5, label: 'Business / pilot potential' },
    ],

    safetyLabel: 'Safety gates',
    safetyTitle: 'Non‑negotiable for every team.',
    safety: [
      'Agent is not a doctor or therapist',
      'No diagnosis or medication advice',
      'No cure promises for anxiety, depression, insomnia',
      'No dangerous breathing exercises',
      'Immediate stop for the session',
      'Consent before storing voice or emotional data',
      'Data minimization + escalation plan',
    ],

    stackLabel: 'Recommended stack',
    stackTitle: 'Build with tools sponsors and mentors support.',
    stack:
      'ElevenLabs · LiveKit · CopilotKit · OpenAI / Anthropic / Gemini · Next.js · TypeScript · Vercel · Supabase · Twilio / Telnyx · MCP',

    afterLabel: 'After the hackathon',
    afterTitle: 'From demo to pilot.',
    afterBody:
      'Top three projects get 2–4 weeks of mentorship. Harden safety and UX, test with volunteers, then place one or two into a small pilot with a partner.',

    finalTitle: 'Ready to build?',
    finalBody: 'Pick a track. Ship agentic voice. Demo with care. Join Visible Builders in Medellín.',
    finalCta: 'Request a spot',
    footer: 'Medellín Agentic Voice Wellness Hackathon · Visible Builders · Wellness & prevention only',
  },
  es: {
    back: 'Volver',
    eyebrow: 'Challenge reveal · Equipos · Medellín',
    badges: ['Hackathon de un día', 'Equipos multidisciplinarios', 'Builders de Voice AI'],
    titleA: 'Agentic Voice',
    titleB: 'Wellness',
    titleC: 'Hackathon',
    heroLead:
      'Construyan agentes de voz que ayudan a respirar, moverse, enfocarse, descansar y sentirse mejor — con escucha real, razonamiento, tool use y acciones de wellness seguras.',
    heroPrize: 'Premios nominados · Awards por categoría · Camino a piloto',
    ctaPrimary: 'Unirme al reto',
    ctaSecondary: 'Ver el brief',
    strip: 'Prevención y wellness cotidiano · Sin diagnóstico ni tratamiento',

    whatLabel: 'Qué construyen',
    whatTitle: 'Un prototipo agentic de voz para wellness que funciona.',
    whatBody:
      'En un día, su equipo entrega un agente de voz que escucha, entiende, decide el siguiente paso, llama tools o APIs, responde con voz natural y completa una acción útil de bienestar — sin afirmaciones médicas.',
    whatPills: ['Escucha', 'Razona', 'Tool use', 'Respuesta', 'Acción wellness'],

    rewardsLabel: 'Premios para builders',
    rewardsTitle: 'Compitan por tracks. Ganen categoría y gran premio.',
    rewards: [
      { place: 'Gran premio', prize: 'Mejor experiencia Agentic Voice Wellness' },
      { place: 'Premios por track', prize: 'Respirar · Mover · Mind · Sueño · Work · Inclusivo' },
      { place: 'Especiales', prize: 'Mejor tech sponsor · People’s Choice' },
    ],
    rewardsNote: 'Los premios pueden incluir créditos de API, coaching, membresías, coworking, cursos, cloud e intros a pilots.',

    milestonesLabel: 'Cómo corre el reto',
    milestonesTitle: 'Primero prep. Luego un día de build.',
    milestones: [
      { n: '01', title: 'Sesión de prep', body: '1–2 semanas antes: workshop Voice AI, cuentas, repo starter, briefing de wellness y seguridad, elección de categoría.' },
      { n: '02', title: 'Kickoff', body: 'Welcome, keynote de wellness, briefing de Voice AI, explicación de tracks.' },
      { n: '03', title: 'Sprints de build', body: 'Formación de equipos, mentores, dos sprints y bloque de troubleshooting.' },
      { n: '04', title: 'Demo day', body: 'Pitch de 5 minutos, judging, premios y siguientes pasos hacia pilots.' },
    ],

    agendaLabel: 'Agenda del día',
    agendaTitle: 'Del registro a los premios.',
    agenda: [
      { t: '9:30', l: 'Registro y networking' },
      { t: '10:00', l: 'Welcome e intros de sponsors' },
      { t: '10:15', l: 'Keynote de wellness' },
      { t: '10:35', l: 'Briefing Voice AI y agentic' },
      { t: '10:55', l: 'Categorías y retos' },
      { t: '11:10', l: 'Formación de equipos' },
      { t: '12:00', l: 'Sprint de build uno' },
      { t: '13:00', l: 'Almuerzo' },
      { t: '13:40', l: 'Sprint de build dos' },
      { t: '14:45', l: 'Reviews con mentores' },
      { t: '15:15', l: 'Build final y prep de pitch' },
      { t: '16:00', l: 'Demos y judging' },
      { t: '16:45', l: 'Premios y cierre' },
    ],

    tracksLabel: 'Tracks del reto',
    tracksTitle: 'Seis categorías de wellness. Elijan una.',
    tracksBody: 'Cada track tiene un reto concreto para equipos — no tratamiento médico.',
    tracks: [
      { letter: 'A', title: 'Respiración', body: 'Respiración guiada, resets de estrés, prep para dormir, sesiones de foco.' },
      { letter: 'B', title: 'Yoga y movimiento', body: 'Estiramientos de escritorio, pausas de movilidad, rutinas para principiantes. Sin tratar lesiones.' },
      { letter: 'C', title: 'Mindfulness', body: 'Meditación, grounding, foco, conciencia emocional, detox digital.' },
      { letter: 'D', title: 'Sueño y recovery', body: 'Cierre del día y rutinas calmadas — sin promesas clínicas de sueño.' },
      { letter: 'E', title: 'Bienestar laboral', body: 'Prep de reuniones, breaks de foco, check-ins privados. El empleador no ve la conversación.' },
      { letter: 'F', title: 'Wellness inclusivo', body: 'Adultos mayores, discapacidad visual, baja alfabetización digital, visitantes multilenguaje en Medellín.' },
    ],

    agenticLabel: 'Barra de calidad',
    agenticTitle: 'Qué significa “agentic voice” aquí.',
    agenticBody:
      'Un audio fijo de meditación solo no califica. Incluyan al menos dos capacidades:',
    agenticCaps: [
      'Conversación',
      'Planificación',
      'Memoria + consentimiento',
      'Tool use',
      'Personalización',
      'Salida multimodal',
      'Escalamiento humano',
      'Evaluación',
    ],

    deliverLabel: 'Entregables requeridos',
    deliverTitle: 'Un prototipo pequeño — no un producto completo.',
    deliverables: [
      'Un usuario + problema de wellness claros',
      'Un flujo primario de voz',
      'Demo en vivo funcionando',
      'Al menos una acción agentic / tool call',
      'Explicación de seguridad y privacidad',
      'Presentación final de 5 minutos',
      'Repo público + README con setup',
    ],
    deliverNot: 'No se pide: infra de producción, suscripciones, validación clínica, app móvil terminada, multi-agente complejo.',

    rubricLabel: 'Judging · 100 puntos',
    rubricTitle: 'Rúbrica clara antes de construir.',
    rubricGatesTitle: 'Antes de puntuar, cada equipo debe mostrar',
    rubricGates: [
      'Interacción de voz real',
      'Problema + usuario definidos',
      'Al menos una acción agentic',
      'Respuesta segura si no sabe',
      'Prototipo + pitch',
    ],
    rubric: [
      { pts: 20, label: 'Claridad del problema y relevancia' },
      { pts: 20, label: 'Experiencia de voz y conversación' },
      { pts: 20, label: 'Valor de wellness' },
      { pts: 15, label: 'Comportamiento agentic y técnica' },
      { pts: 15, label: 'Seguridad, privacidad y diseño responsable' },
      { pts: 5, label: 'Accesibilidad e inclusión' },
      { pts: 5, label: 'Potencial de negocio / piloto' },
    ],

    safetyLabel: 'Compuertas de seguridad',
    safetyTitle: 'No negociables para cada equipo.',
    safety: [
      'El agente no es médico ni terapeuta',
      'Sin diagnóstico ni medicamentos',
      'Sin promesas de curar ansiedad, depresión o insomnia',
      'Sin ejercicios de respiración peligrosos',
      'Stop inmediato de la sesión',
      'Consentimiento antes de guardar voz o datos emocionales',
      'Minimización de datos + plan de escalamiento',
    ],

    stackLabel: 'Stack recomendado',
    stackTitle: 'Construyan con tools que sponsors y mentores apoyan.',
    stack:
      'ElevenLabs · LiveKit · CopilotKit · OpenAI / Anthropic / Gemini · Next.js · TypeScript · Vercel · Supabase · Twilio / Telnyx · MCP',

    afterLabel: 'Después del hackathon',
    afterTitle: 'De demo a piloto.',
    afterBody:
      'Los tres mejores reciben 2–4 semanas de mentoría. Endurecen seguridad y UX, prueban con voluntarios y colocan uno o dos en un piloto pequeño con un partner.',

    finalTitle: '¿Listos para construir?',
    finalBody: 'Elijan track. Ship agentic voice. Demuestren con cuidado. Visible Builders en Medellín.',
    finalCta: 'Pedir un cupo',
    footer: 'Medellín Agentic Voice Wellness Hackathon · Visible Builders · Solo wellness y prevención',
  },
} as const;

function BrandAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, ${VB.cyan}18 1px, transparent 0)
          `,
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 80% 8%, ${VB.soft}55 0%, transparent 55%),
            radial-gradient(ellipse 50% 45% at 8% 90%, ${VB.magenta}22 0%, transparent 50%),
            radial-gradient(ellipse 40% 35% at 50% 50%, ${VB.purple}18 0%, transparent 60%)
          `,
        }}
      />
    </>
  );
}

function BrandPill() {
  return (
    <div
      className="inline-block px-4 py-1 font-mono text-xs font-bold uppercase tracking-widest"
      style={{ border: `2px solid ${VB.cyan}`, background: VB.cyan + '14', boxShadow: VB.glow }}
    >
      <span style={{ color: VB.cyan }}>VISIBLE</span>{' '}
      <span style={{ color: VB.magenta }}>BUILDERS</span>
    </div>
  );
}

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div
      className="inline-flex p-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em]"
      style={{ border: `1px solid ${VB.border}`, background: VB.bgCard }}
      role="group"
      aria-label="Language"
    >
      {(['en', 'es'] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            className="px-3 py-1.5"
            style={{
              background: active ? VB.cyan + '22' : 'transparent',
              color: active ? VB.cyan : VB.muted,
              boxShadow: active ? `inset 0 0 0 1px ${VB.cyan}55` : undefined,
            }}
            aria-pressed={active}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs font-bold uppercase tracking-[0.22em]" style={{ color: VB.cyan }}>
      {children}
    </p>
  );
}

function Cta({ href, label, solid = true }: { href: string; label: string; solid?: boolean }) {
  if (solid) {
    return (
      <a
        href={href}
        className="group inline-flex items-center gap-3 px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.16em] transition-transform hover:scale-[1.02]"
        style={{ background: VB.cyan, color: '#F7FBFA', boxShadow: VB.glow }}
      >
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </a>
    );
  }
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.16em]"
      style={{ border: `1.5px solid ${VB.cyan}66`, color: VB.cyan, background: VB.bgCard }}
    >
      {label}
    </a>
  );
}

export default function MedellinVoiceWellnessHackathonPage() {
  const [lang, setLang] = useState<Lang>('es');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'es') setLang(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const setLanguage = (next: Lang) => {
    setLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const t = copy[lang];
  const mail = CONTACT[lang];

  return (
    <main className="min-h-screen" style={{ background: VB.bg, color: VB.white }} lang={lang}>
      {/* HERO — Challenge Reveal */}
      <section className="relative flex min-h-[92svh] flex-col overflow-hidden">
        <BrandAtmosphere />

        <div className="relative z-10 flex items-center justify-between gap-3 px-6 py-6 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
            style={{ color: VB.muted }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t.back}
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <LangSwitch lang={lang} onChange={setLanguage} />
            <a
              href="https://visiblebuilders.io"
              target="_blank"
              rel="noreferrer"
              className="hidden font-mono text-xs font-bold uppercase tracking-[0.2em] sm:inline"
              style={{ color: VB.muted }}
            >
              <span style={{ color: VB.cyan }}>{'>'}</span> visiblebuilders.io
            </a>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pb-20 pt-10 text-center sm:px-10 sm:pb-28 sm:pt-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <BrandPill />
          </motion.div>

          <motion.p
            className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.28em] sm:text-sm"
            style={{ color: VB.muted }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {t.eyebrow}
          </motion.p>

          <motion.div
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {t.badges.map((b) => (
              <span
                key={b}
                className="px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px]"
                style={{ border: `1px solid ${VB.cyan}44`, color: VB.cyan }}
              >
                {b}
              </span>
            ))}
          </motion.div>

          <motion.h1
            className="mt-10 font-sans font-black uppercase leading-[0.88] tracking-tight"
            style={{
              fontSize: 'clamp(2.4rem, 8vw, 5.75rem)',
              color: VB.white,
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t.titleA}
            <br />
            <span style={{ color: VB.cyan }}>{t.titleB}</span>{' '}
            <span style={{ color: VB.magenta }}>{t.titleC}</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-7 max-w-2xl font-mono text-sm leading-relaxed sm:text-base"
            style={{ color: VB.muted }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t.heroLead}
          </motion.p>

          <motion.p
            className="mt-6 font-mono text-sm font-bold uppercase tracking-[0.14em] sm:text-base"
            style={{ color: VB.white }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {t.heroPrize}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Cta href={mail} label={t.ctaPrimary} />
            <Cta href="#brief" label={t.ctaSecondary} solid={false} />
          </motion.div>
        </div>

        <div className="relative z-10 border-t px-6 py-4 text-center" style={{ borderColor: VB.border }}>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] sm:text-xs" style={{ color: VB.muted }}>
            {t.strip}
          </p>
        </div>
      </section>

      {/* WHAT YOU BUILD */}
      <section id="brief" className="relative scroll-mt-8 border-t px-6 py-28 sm:px-10 md:py-40" style={{ borderColor: VB.border, background: VB.bgAlt }}>
        <BrandAtmosphere />
        <div className="relative z-10 mx-auto max-w-5xl">
          <SectionLabel>{t.whatLabel}</SectionLabel>
          <h2
            className="mt-5 max-w-3xl font-sans font-black uppercase leading-[0.92]"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3rem)' }}
          >
            {t.whatTitle}
          </h2>
          <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed sm:text-base" style={{ color: VB.muted }}>
            {t.whatBody}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {t.whatPills.map((p, i) => (
              <span
                key={p}
                className="px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em]"
                style={{
                  border: `1px solid ${i % 2 === 0 ? VB.cyan : VB.magenta}55`,
                  color: i % 2 === 0 ? VB.cyan : VB.magenta,
                  background: (i % 2 === 0 ? VB.cyan : VB.magenta) + '0c',
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* REWARDS */}
      <section className="relative border-t px-6 py-28 sm:px-10 md:py-36" style={{ borderColor: VB.border, background: VB.bg }}>
        <div className="relative z-10 mx-auto max-w-5xl">
          <SectionLabel>{t.rewardsLabel}</SectionLabel>
          <h2
            className="mt-5 max-w-3xl font-sans font-black uppercase leading-[0.92]"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3rem)' }}
          >
            {t.rewardsTitle}
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {t.rewards.map((r, i) => (
              <div
                key={r.place}
                className="px-6 py-10"
                style={{
                  background: VB.bgCard,
                  borderTop: `3px solid ${i === 0 ? VB.cyan : i === 1 ? VB.magenta : VB.purple}`,
                  borderRight: `1px solid ${VB.border}`,
                  borderBottom: `1px solid ${VB.border}`,
                  borderLeft: `1px solid ${VB.border}`,
                  boxShadow: '0 12px 40px rgba(31, 111, 104, 0.08)',
                }}
              >
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em]" style={{ color: i === 0 ? VB.cyan : i === 1 ? VB.magenta : VB.purple }}>
                  {r.place}
                </p>
                <p className="mt-4 font-sans text-xl font-black uppercase leading-tight">{r.prize}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 font-mono text-sm" style={{ color: VB.muted }}>
            {t.rewardsNote}
          </p>
        </div>
      </section>

      {/* 4 MILESTONES */}
      <section className="relative border-t px-6 py-28 sm:px-10 md:py-40" style={{ borderColor: VB.border, background: VB.bgAlt }}>
        <BrandAtmosphere />
        <div className="relative z-10 mx-auto max-w-5xl">
          <SectionLabel>{t.milestonesLabel}</SectionLabel>
          <h2
            className="mt-5 max-w-3xl font-sans font-black uppercase leading-[0.92]"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3rem)' }}
          >
            {t.milestonesTitle}
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {t.milestones.map((m) => (
              <div
                key={m.n}
                className="flex gap-5 px-6 py-8"
                style={{
                  background: VB.bgCard,
                  border: `1px solid ${VB.cyan}28`,
                  boxShadow: '0 12px 40px rgba(31, 111, 104, 0.07)',
                }}
              >
                <span className="shrink-0 font-mono text-3xl font-black" style={{ color: VB.cyan }}>
                  {m.n}
                </span>
                <div>
                  <h3 className="font-sans text-lg font-black uppercase tracking-wide">{m.title}</h3>
                  <p className="mt-2 font-mono text-sm leading-relaxed" style={{ color: VB.muted }}>
                    {m.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section className="relative border-t px-6 py-28 sm:px-10 md:py-36" style={{ borderColor: VB.border, background: VB.bg }}>
        <div className="relative z-10 mx-auto max-w-5xl">
          <SectionLabel>{t.agendaLabel}</SectionLabel>
          <h2
            className="mt-3 font-sans font-black uppercase leading-[0.92]"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' }}
          >
            {t.agendaTitle}
          </h2>
          <ol className="mt-10 columns-1 gap-x-12 sm:columns-2">
            {t.agenda.map((row, i) => (
              <li
                key={row.t + row.l}
                className="mb-0 flex break-inside-avoid items-baseline gap-4 border-b py-3.5 font-mono text-sm"
                style={{ borderColor: VB.border }}
              >
                <span className="w-12 shrink-0 font-bold" style={{ color: i % 2 === 0 ? VB.cyan : VB.magenta }}>
                  {row.t}
                </span>
                <span>{row.l}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TRACKS */}
      <section id="tracks" className="relative scroll-mt-8 border-t px-6 py-28 sm:px-10 md:py-40" style={{ borderColor: VB.border, background: VB.bgAlt }}>
        <BrandAtmosphere />
        <div className="relative z-10 mx-auto max-w-5xl">
          <SectionLabel>{t.tracksLabel}</SectionLabel>
          <h2
            className="mt-5 max-w-3xl font-sans font-black uppercase leading-[0.92]"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3rem)' }}
          >
            {t.tracksTitle}
          </h2>
          <p className="mt-4 max-w-xl font-mono text-sm" style={{ color: VB.muted }}>
            {t.tracksBody}
          </p>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {t.tracks.map((track, i) => {
              const accent = i % 3 === 0 ? VB.cyan : i % 3 === 1 ? VB.magenta : VB.purple;
              return (
                <article
                  key={track.letter}
                  className="px-5 py-8"
                  style={{
                    background: VB.bgCard,
                    border: `1px solid ${accent}40`,
                    boxShadow: '0 12px 36px rgba(31, 111, 104, 0.06)',
                  }}
                >
                  <span className="font-mono text-2xl font-black" style={{ color: accent }}>
                    {track.letter}
                  </span>
                  <h3 className="mt-2 font-sans text-lg font-black uppercase tracking-wide">{track.title}</h3>
                  <p className="mt-2 font-mono text-sm leading-relaxed" style={{ color: VB.muted }}>
                    {track.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* AGENTIC BAR */}
      <section className="relative border-t px-6 py-28 sm:px-10 md:py-36" style={{ borderColor: VB.border, background: VB.bg }}>
        <div className="relative z-10 mx-auto max-w-5xl">
          <SectionLabel>{t.agenticLabel}</SectionLabel>
          <h2
            className="mt-5 max-w-3xl font-sans font-black uppercase leading-[0.92]"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3rem)' }}
          >
            {t.agenticTitle}
          </h2>
          <p className="mt-4 max-w-2xl font-mono text-sm sm:text-base" style={{ color: VB.muted }}>
            {t.agenticBody}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {t.agenticCaps.map((c, i) => (
              <span
                key={c}
                className="px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.1em]"
                style={{
                  border: `1px solid ${VB.border}`,
                  color: i % 2 === 0 ? VB.cyan : VB.magenta,
                  background: VB.bgCard,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className="relative border-t px-6 py-28 sm:px-10 md:py-36" style={{ borderColor: VB.border, background: VB.bgAlt }}>
        <div className="relative z-10 mx-auto max-w-5xl">
          <SectionLabel>{t.deliverLabel}</SectionLabel>
          <h2
            className="mt-5 max-w-3xl font-sans font-black uppercase leading-[0.92]"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3rem)' }}
          >
            {t.deliverTitle}
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {t.deliverables.map((d) => (
              <li
                key={d}
                className="flex items-start gap-3 px-4 py-3 font-mono text-sm"
                style={{ border: `1px solid ${VB.border}`, background: VB.bgCard }}
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: VB.cyan }} />
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-sm" style={{ color: VB.muted }}>
            {t.deliverNot}
          </p>
        </div>
      </section>

      {/* RUBRIC 100 */}
      <section className="relative border-t px-6 py-28 sm:px-10 md:py-40" style={{ borderColor: VB.border, background: VB.bg }}>
        <BrandAtmosphere />
        <div className="relative z-10 mx-auto max-w-5xl">
          <SectionLabel>{t.rubricLabel}</SectionLabel>
          <h2
            className="mt-5 max-w-3xl font-sans font-black uppercase leading-[0.92]"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3rem)' }}
          >
            {t.rubricTitle}
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em]" style={{ color: VB.magenta }}>
                {t.rubricGatesTitle}
              </p>
              <ul className="mt-4 space-y-3">
                {t.rubricGates.map((g) => (
                  <li key={g} className="flex gap-3 font-mono text-sm" style={{ color: VB.white }}>
                    <span style={{ color: VB.cyan }}>▸</span>
                    {g}
                  </li>
                ))}
              </ul>
              <p
                className="mt-8 font-sans font-black uppercase leading-none"
                style={{ fontSize: 'clamp(4rem, 12vw, 7rem)', color: VB.cyan, textShadow: VB.glow }}
              >
                100
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: VB.muted }}>
                pts
              </p>
            </div>

            <div className="space-y-0">
              {t.rubric.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center gap-5 border-b py-4"
                  style={{ borderColor: VB.border }}
                >
                  <span
                    className="w-12 shrink-0 font-mono text-2xl font-black"
                    style={{ color: VB.cyan }}
                  >
                    {r.pts}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm">{r.label}</p>
                    <div className="mt-2 h-1 w-full" style={{ background: VB.border }}>
                      <div className="h-full" style={{ width: `${r.pts}%`, background: VB.cyan }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section className="relative border-t px-6 py-28 sm:px-10 md:py-36" style={{ borderColor: VB.border, background: VB.bgAlt }}>
        <div className="relative z-10 mx-auto max-w-5xl">
          <SectionLabel>{t.safetyLabel}</SectionLabel>
          <h2
            className="mt-5 max-w-3xl font-sans font-black uppercase leading-[0.92]"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3rem)' }}
          >
            {t.safetyTitle}
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {t.safety.map((s) => (
              <li
                key={s}
                className="flex gap-3 px-4 py-3 font-mono text-sm"
                style={{ border: `1px solid ${VB.magenta}33`, background: VB.bgCard }}
              >
                <span style={{ color: VB.magenta }}>◆</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STACK + AFTER */}
      <section className="relative border-t px-6 py-32 sm:px-10 md:py-44" style={{ borderColor: VB.border, background: VB.bg }}>
        <div className="relative z-10 mx-auto grid max-w-5xl gap-14 md:grid-cols-2">
          <div>
            <SectionLabel>{t.stackLabel}</SectionLabel>
            <h3 className="mt-3 font-sans text-xl font-black uppercase sm:text-2xl">{t.stackTitle}</h3>
            <p className="mt-4 font-mono text-xs font-bold uppercase leading-relaxed tracking-[0.1em] sm:text-sm">
              {t.stack}
            </p>
          </div>
          <div>
            <SectionLabel>{t.afterLabel}</SectionLabel>
            <h3 className="mt-3 font-sans text-xl font-black uppercase sm:text-2xl">{t.afterTitle}</h3>
            <p className="mt-4 font-mono text-sm leading-relaxed" style={{ color: VB.muted }}>
              {t.afterBody}
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t px-6 py-32 sm:px-10 md:py-44" style={{ borderColor: VB.border, background: VB.bgAlt }}>
        <BrandAtmosphere />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <BrandPill />
          <h2
            className="mt-8 font-sans font-black uppercase leading-[0.9]"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}
          >
            {t.finalTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-lg font-mono text-sm leading-relaxed" style={{ color: VB.muted }}>
            {t.finalBody}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Cta href={mail} label={t.finalCta} />
          </div>
        </div>
      </section>

      <footer className="border-t px-6 py-8 text-center sm:px-10" style={{ borderColor: VB.border }}>
        <div className="mb-4 flex justify-center">
          <LangSwitch lang={lang} onChange={setLanguage} />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: VB.muted }}>
          {t.footer}
        </p>
      </footer>
    </main>
  );
}
