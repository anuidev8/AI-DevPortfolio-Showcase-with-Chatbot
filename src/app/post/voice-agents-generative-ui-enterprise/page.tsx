'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  AudioLines,
  Brain,
  Building2,
  ChevronLeft,
  ChevronRight,
  Ear,
  Github,
  Globe,
  Languages,
  LayoutGrid,
  Linkedin,
  MessageCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Target,
  Lock,
  DollarSign,
  type LucideIcon,
} from 'lucide-react';

const APPLE_FONT =
  '"SF Pro Display","SF Pro Icons","Helvetica Neue",Helvetica,Arial,system-ui,-apple-system,BlinkMacSystemFont,sans-serif';

const PHOTO =
  'https://res.cloudinary.com/dnmjmjdsj/image/upload/v1730585859/image/Screenshot_2024-11-02_at_5.14.48_PM_ynwltl.png';

const SOCIALS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/angel-mateus-arrieta-morelo-739623123/', icon: Linkedin },
  { label: 'GitHub', url: 'https://github.com/anuidev8', icon: Github },
  { label: 'WhatsApp', url: 'https://wa.me/573206456179', icon: MessageCircle },
];

const GRADIENT_TEXT = 'bg-gradient-to-r from-[#ffffff] via-[#8ec5ff] to-[#2997ff] bg-clip-text text-transparent';
const HEADLINE = 'font-semibold leading-[1.02] tracking-[-0.035em] text-[#f5f5f7]';
const BODY = 'text-lg leading-[1.45] tracking-[-0.01em] text-[#9fb3d1] md:text-2xl';

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 · Quién soy                                                      */
/* ------------------------------------------------------------------ */

function WhoSlide() {
  return (
    <div className="grid h-full items-center gap-12 lg:grid-cols-[1.25fr_0.75fr]">
      <div>
        <Reveal delay={0.1}>
          <h1 className={`${HEADLINE} text-[clamp(3rem,7vw,6.5rem)]`}>
            Angel Arrieta.
            <br />
            <span className={GRADIENT_TEXT}>Frontend & UI agéntica.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-7 flex flex-wrap gap-2">
            {['Community Lead', 'Consultoría de software', 'Ciencias de la Computación'].map((role) => (
              <span
                key={role}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-[#f5f5f7] md:text-base"
              >
                {role}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className={`${BODY} mt-7 max-w-2xl`}>
            Especialista en frontend e interfaces agénticas con UI generativa: experiencias donde la conversación y la
            interfaz se construyen juntas. Más de 7 años llevando productos web y móviles de la idea a producción.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-3xl bg-[#0b1a36] p-3 transition-colors hover:bg-[#132a52]"
              >
                <div className="rounded-2xl bg-white p-2">
                  <QRCodeSVG value={social.url} size={92} fgColor="#020b1f" bgColor="#ffffff" level="M" />
                </div>
                <span className="flex items-center gap-1.5 text-sm font-medium text-[#f5f5f7]">
                  <social.icon className="h-4 w-4 text-[#2997ff]" />
                  {social.label}
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="mx-auto w-full max-w-[360px]">
        <div className="relative aspect-square overflow-hidden rounded-full border border-white/15 shadow-[0_40px_120px_-30px_rgba(41,151,255,0.5)]">
          <img src={PHOTO} alt="Angel Arrieta" className="h-full w-full object-cover" draggable={false} />
        </div>
        <p className="mt-6 text-center text-base text-[#9fb3d1]">Medellín, Colombia</p>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Qué significa voz agéntica                                     */
/* ------------------------------------------------------------------ */

const LOOP = [
  { icon: Ear, title: 'Escucha', body: 'Voz en tiempo real, cualquier acento, con interrupciones.' },
  { icon: Brain, title: 'Entiende', body: 'Intención, contexto y memoria — no palabras clave.' },
  { icon: Sparkles, title: 'Decide', body: 'Planea el siguiente paso hacia un objetivo.' },
  { icon: Zap, title: 'Actúa', body: 'Llama herramientas, APIs y sistemas empresariales.' },
  { icon: LayoutGrid, title: 'Muestra', body: 'Genera la UI correcta en el momento correcto.' },
];

function AgenticSlide() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Reveal delay={0.1}>
        <h2 className={`${HEADLINE} text-[clamp(2.75rem,7.5vw,7rem)]`}>
          No solo responde.
          <br />
          <span className={GRADIENT_TEXT}>Actúa.</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {LOOP.map((step, index) => (
          <Reveal key={step.title} delay={0.2 + index * 0.08}>
            <div className="h-full rounded-3xl bg-[#0b1a36] p-6">
              <div className="flex items-center justify-between">
                <step.icon className="h-7 w-7 text-[#2997ff]" />
                <span className="text-sm font-semibold text-[#9fb3d1]">0{index + 1}</span>
              </div>
              <p className="mt-8 text-3xl font-semibold tracking-[-0.02em] text-[#f5f5f7]">{step.title}</p>
              <p className="mt-2 text-base leading-snug text-[#9fb3d1]">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.7}>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#9fb3d1]">Antes</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[#9fb3d1] md:text-3xl">
              “Marque 1 para ventas. Marque 2 para soporte.”
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-[#2997ff]/20 to-[#0a3dbf]/20 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2997ff]">Agéntica</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[#f5f5f7] md:text-3xl">
              “Di lo que necesitas. Se resuelve — y lo ves en pantalla.”
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · El futuro de la voz agéntica                                   */
/* ------------------------------------------------------------------ */

const FUTURE = [
  {
    icon: LayoutGrid,
    title: 'Interfaces generadas en cada conversación.',
    body: 'Sin pantallas fijas. El agente arma la UI que cada usuario necesita, en el momento.',
  },
  {
    icon: Building2,
    title: 'La voz como puerta de entrada a la empresa.',
    body: 'CRM, ERP, tickets y datos — accesibles con una sola frase.',
  },
  {
    icon: Languages,
    title: 'Multilingüe por defecto.',
    body: 'Español, inglés y cambios a mitad de frase. Hecho para Latinoamérica y el mundo.',
  },
  {
    icon: ShieldCheck,
    title: 'El humano sigue al mando.',
    body: 'Consentimiento, trazabilidad y escalamiento son parte del producto, no un extra.',
  },
];

function FutureSlide() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Reveal delay={0.1}>
        <h2 className={`${HEADLINE} text-[clamp(2.5rem,7vw,6.5rem)]`}>
          Cada pantalla, una conversación.
          <br />
          <span className={GRADIENT_TEXT}>Cada conversación, una pantalla.</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-3 md:grid-cols-2">
        {FUTURE.map((item, index) => (
          <Reveal key={item.title} delay={0.2 + index * 0.1}>
            <div className="flex h-full gap-5 rounded-3xl bg-[#0b1a36] p-7">
              <item.icon className="mt-1 h-8 w-8 shrink-0 text-[#2997ff]" />
              <div>
                <p className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#f5f5f7] md:text-3xl">
                  {item.title}
                </p>
                <p className="mt-3 text-base leading-snug text-[#9fb3d1] md:text-lg">{item.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · Mi experiencia construyendo para empresas                      */
/* ------------------------------------------------------------------ */

const LESSONS = [
  'La latencia es UX.',
  'Integrar vale más que impresionar.',
  'Gobernanza primero.',
  'El wow abre la puerta. El ROI la cierra.',
];

const GALLERY_DIR = '/events/conexion-inteligente';

const EVENT_GALLERY = [
  { src: `${GALLERY_DIR}/huella-digital.jpg`, caption: 'Stand Tu Huella Digital' },
  { src: `${GALLERY_DIR}/experiencia-en-vivo.jpg`, caption: 'Un asistente viviendo Tu Huella Digital' },
  { src: `${GALLERY_DIR}/asistente-virtual-microsoft.png`, caption: 'Stand Tu Asistente Virtual · Microsoft' },
  { src: `${GALLERY_DIR}/networking.jpg`, caption: 'Conexiones con líderes empresariales' },
];

function EventGallery() {
  const [active, setActive] = useState(0);
  const item = EVENT_GALLERY[active];
  const go = (delta: number) => setActive((i) => (i + delta + EVENT_GALLERY.length) % EVENT_GALLERY.length);

  return (
    <div
      className="relative h-[460px] overflow-hidden rounded-[2rem] bg-[#0b1a36] md:h-[540px]"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={item.src}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={item.src}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
            draggable={false}
          />
          <img src={item.src} alt={item.caption} className="relative h-full w-full object-contain" draggable={false} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute right-4 top-4 flex gap-2">
        <button
          onClick={() => go(-1)}
          aria-label="Anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#020b1f]/70 text-[#f5f5f7] backdrop-blur-xl transition-colors hover:bg-[#132a52]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Siguiente"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#020b1f]/70 text-[#f5f5f7] backdrop-blur-xl transition-colors hover:bg-[#132a52]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-[#020b1f]/60 px-3 py-2 backdrop-blur-xl">
        {EVENT_GALLERY.map((entry, i) => (
          <button key={entry.src} onClick={() => setActive(i)} aria-label={entry.caption}>
            <motion.span
              className="block h-1.5 rounded-full"
              animate={{ width: i === active ? 22 : 6, backgroundColor: i === active ? '#f5f5f7' : 'rgba(245,245,247,0.4)' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function EventSlide() {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <Reveal delay={0.1}>
            <h2 className={`${HEADLINE} text-[clamp(2.5rem,5.5vw,5.25rem)]`}>
              Mi experiencia
              <br />
              <span className={GRADIENT_TEXT}>en un evento empresarial.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className={`${BODY} mt-8 max-w-xl`}>
              <span className="text-[#f5f5f7]">Conexión Inteligente</span> fue el evento de Corficolombiana que reunió a
              líderes y directivos de empresas como AWS y Microsoft para hablar de tecnología, datos e IA. Participé como{' '}
              <span className="text-[#f5f5f7]">consultor de software</span> junto a SETI, llevando experiencias de IA en
              vivo a cada asistente.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-[#0b1a36] p-6">
                <p className={`text-6xl font-semibold tracking-[-0.04em] md:text-7xl ${GRADIENT_TEXT}`}>500+</p>
                <p className="mt-2 text-base text-[#9fb3d1]">asistentes</p>
              </div>
              <div className="rounded-3xl bg-[#0b1a36] p-6">
                <p className="text-6xl font-semibold tracking-[-0.04em] text-[#f5f5f7] md:text-7xl">3</p>
                <p className="mt-2 text-base text-[#9fb3d1]">experiencias de IA en vivo en el stand</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <EventGallery />
        </Reveal>
      </div>

      <div className="mt-12">
        <Reveal delay={0.4}>
          <p className="text-2xl font-semibold tracking-[-0.02em] text-[#f5f5f7] md:text-3xl">
            Lo que me enseñó esta experiencia.
          </p>
        </Reveal>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {LESSONS.map((title, index) => (
            <Reveal key={title} delay={0.5 + index * 0.08}>
              <div className="flex h-full min-h-[170px] items-end rounded-3xl bg-[#0b1a36] p-7">
                <p className="text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#f5f5f7] md:text-4xl">
                  {title}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · Tecnologías que uso                                            */
/* ------------------------------------------------------------------ */

const STACK: { name: string; role: string; group: string; logo: string; fullBleed?: boolean }[] = [
  { name: 'LiveKit Agents', role: 'Salas WebRTC en tiempo real y orquestación del agente', group: 'Voz', logo: '/logos/livekit.svg' },
  { name: 'Deepgram Nova-3', role: 'Voz a texto, multilingüe', group: 'Voz', logo: '/logos/deepgram.svg' },
  { name: 'ElevenLabs Flash v2.5', role: 'Voz natural y de baja latencia', group: 'Voz', logo: '/logos/elevenlabs.svg' },
  { name: 'LiveKit Turn Detector', role: 'Sabe cuándo terminaste de hablar', group: 'Voz', logo: '/logos/livekit.svg' },
  { name: 'Gemma 4 · LiveKit Inference', role: 'Razonamiento y llamadas a herramientas', group: 'Inteligencia', logo: '/logos/gemma.png' },
  { name: 'OpenAI', role: 'Temas de conversación generados', group: 'Inteligencia', logo: '/logos/openai.png' },
  { name: 'Next.js 15 + React', role: 'Superficie de UI generativa', group: 'Interfaz', logo: '/logos/nextjs.svg' },
  { name: 'Framer Motion', role: 'Animaciones fluidas', group: 'Interfaz', logo: '/logos/framer.svg' },
  {
    name: 'CopilotKit',
    role: 'Renderizado de interfaces con UI generativa',
    group: 'Interfaz',
    logo: '/logos/copilotkit.png',
    fullBleed: true,
  },
  { name: 'Python + uv', role: 'Runtime del agente', group: 'Plataforma', logo: '/logos/python.svg' },
  { name: 'PostgreSQL', role: 'Perfiles y memoria', group: 'Plataforma', logo: '/logos/postgresql.svg' },
  { name: 'LiveKit Cloud', role: 'Despliegue y escala de agentes', group: 'Plataforma', logo: '/logos/livekit.svg' },
  { name: 'TypeScript', role: 'Contratos RPC tipados', group: 'Plataforma', logo: '/logos/typescript.svg' },
  { name: 'AWS Core Agent', role: 'Agentes generativos y orquestación', group: 'Agentes', logo: '/logos/aws.svg' },
  { name: 'Amazon Nova Voice', role: 'Voz de nueva generación', group: 'Voz', logo: '/logos/aws.svg' },
  { name: 'Google Cloud Agent (ADK)', role: 'Agentes con Agent Development Kit', group: 'Agentes', logo: '/logos/googlecloud.svg' },
];

const GROUP_COLOR: Record<string, string> = {
  Voz: 'text-[#2997ff]',
  Inteligencia: 'text-[#8ec5ff]',
  Interfaz: 'text-white',
  Plataforma: 'text-[#5b8def]',
  Agentes: 'text-[#2997ff]',
};

function StackSlide() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Reveal delay={0.1}>
        <h2 className={`${HEADLINE} text-[clamp(2.5rem,5.5vw,5rem)]`}>
          El stack. <span className={GRADIENT_TEXT}>Pro.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <p className={`${BODY} mt-6 max-w-3xl`}>La mejor pieza para cada tarea: escuchar, pensar, hablar y mostrar.</p>
      </Reveal>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STACK.map((tech, index) => (
          <Reveal key={tech.name} delay={0.2 + index * 0.03}>
            <div className="flex h-full gap-4 rounded-3xl border border-white/10 bg-[#0b1a36] p-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${
                  tech.fullBleed ? '' : 'bg-white p-2'
                }`}
              >
                <img src={tech.logo} alt={tech.name} className="h-full w-full object-contain" draggable={false} />
              </div>
              <div className="min-w-0">
                <p className={`text-[11px] font-semibold uppercase tracking-widest ${GROUP_COLOR[tech.group]}`}>
                  {tech.group}
                </p>
                <p className="mt-1 text-lg font-semibold leading-tight tracking-[-0.02em] text-[#f5f5f7]">{tech.name}</p>
                <p className="mt-1 text-sm leading-snug text-[#9fb3d1]">{tech.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 06 · Arquitectura                                                   */
/* ------------------------------------------------------------------ */

type NodeId = 'browser' | 'cloud' | 'agent';

type ArchItem = { label: string; logo?: string; icon?: LucideIcon; fullBleed?: boolean };

function LogoTile({ item, size = 'h-8 w-8' }: { item: ArchItem; size?: string }) {
  const Icon = item.icon;
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-lg ${
        item.fullBleed ? '' : item.logo ? 'bg-white p-1' : 'bg-[#2997ff]/15'
      }`}
    >
      {item.logo ? (
        <img src={item.logo} alt="" className="h-full w-full object-contain" draggable={false} />
      ) : Icon ? (
        <Icon className="h-4 w-4 text-[#8ec5ff]" />
      ) : null}
    </span>
  );
}

function FlowLine({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-2 py-3 lg:py-0">
      <p
        className={`text-center text-xs font-medium transition-colors duration-500 ${
          active ? 'text-[#f5f5f7]' : 'text-[#9fb3d1]'
        }`}
      >
        {label}
      </p>
      <span className="text-lg text-[#2997ff] lg:hidden">↕</span>
      <div className="relative hidden h-6 w-full lg:block">
        <div
          className={`absolute inset-x-0 top-1 h-px transition-colors duration-500 ${
            active ? 'bg-[#2997ff]/60' : 'bg-white/15'
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-1 h-px transition-colors duration-500 ${
            active ? 'bg-[#8ec5ff]/50' : 'bg-white/15'
          }`}
        />
        <motion.span
          className="absolute top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#2997ff]"
          style={{ boxShadow: '0 0 12px #2997ff' }}
          animate={{ left: ['0%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute bottom-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#8ec5ff]"
          style={{ boxShadow: '0 0 12px #8ec5ff' }}
          animate={{ left: ['100%', '0%'] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut', delay: 0.8 }}
        />
      </div>
    </div>
  );
}

function ArchNode({
  title,
  subtitle,
  hero,
  items,
  active,
}: {
  title: string;
  subtitle: string;
  hero: ArchItem;
  items: ArchItem[];
  active: boolean;
}) {
  return (
    <motion.div
      animate={{
        borderColor: active ? 'rgba(41,151,255,0.7)' : 'rgba(255,255,255,0.1)',
        boxShadow: active ? '0 0 48px rgba(41,151,255,0.25)' : '0 0 0 rgba(41,151,255,0)',
        scale: active ? 1.02 : 1,
      }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border bg-[#0b1a36] p-6"
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ repeat: active ? Infinity : 0, duration: 1.6 }}
        >
          <LogoTile item={hero} size="h-12 w-12" />
        </motion.div>
        <div>
          <p className="text-2xl font-semibold tracking-[-0.02em] text-[#f5f5f7]">{title}</p>
          <p className="text-sm text-[#9fb3d1]">{subtitle}</p>
        </div>
      </div>
      <ul className="mt-5 space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3 rounded-xl bg-[#020b1f]/60 px-2.5 py-2">
            <LogoTile item={item} size="h-7 w-7" />
            <span className="text-sm text-[#f5f5f7]/90">{item.label}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

const ARCH_STEPS: { text: string; nodes: NodeId[]; flows: ('left' | 'right')[] }[] = [
  { text: 'El navegador pide acceso y LiveKit envía al agente a una sala.', nodes: ['browser', 'cloud'], flows: ['left'] },
  { text: 'La voz viaja en ambos sentidos, en tiempo real.', nodes: ['cloud'], flows: ['left', 'right'] },
  { text: 'El agente escucha, piensa con Gemma y elige una herramienta.', nodes: ['agent'], flows: [] },
  { text: 'La herramienta llega al navegador y CopilotKit dibuja la UI.', nodes: ['browser'], flows: ['left', 'right'] },
  { text: 'Cada toque vuelve al agente: voz y UI siempre en sincronía.', nodes: ['browser', 'agent'], flows: ['left', 'right'] },
];

function ArchitectureSlide() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep((current) => (current + 1) % ARCH_STEPS.length), 2800);
    return () => clearInterval(timer);
  }, []);

  const current = ARCH_STEPS[step];

  return (
    <div className="flex h-full flex-col justify-center">
      <Reveal delay={0.1}>
        <h2 className={`${HEADLINE} text-[clamp(2.5rem,5.5vw,5rem)]`}>
          El agente habla.
          <br />
          <span className={GRADIENT_TEXT}>La UI escucha.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.25}>
        <div className="mt-8 grid items-center lg:grid-cols-[1fr_110px_1fr_110px_1fr]">
          <ArchNode
            title="Navegador"
            subtitle="UI generativa"
            hero={{ label: 'Next.js', logo: '/logos/nextjs.svg' }}
            active={current.nodes.includes('browser')}
            items={[
              { label: 'CopilotKit · renderiza la UI', logo: '/logos/copilotkit.png', fullBleed: true },
              { label: 'Next.js + React', logo: '/logos/nextjs.svg' },
              { label: 'Framer Motion', logo: '/logos/framer.svg' },
              { label: 'TypeScript', logo: '/logos/typescript.svg' },
            ]}
          />
          <FlowLine label="Voz + UI" active={current.flows.includes('left')} />
          <ArchNode
            title="LiveKit Cloud"
            subtitle="Sala en tiempo real"
            hero={{ label: 'LiveKit', logo: '/logos/livekit.svg' }}
            active={current.nodes.includes('cloud')}
            items={[
              { label: 'Envía al agente a la sala', icon: Radio },
              { label: 'Audio de baja latencia', icon: AudioLines },
              { label: 'Canal de datos', icon: Zap },
              { label: 'Red global', icon: Globe },
            ]}
          />
          <FlowLine label="Herramientas" active={current.flows.includes('right')} />
          <ArchNode
            title="Agente"
            subtitle="Python · LiveKit Agents"
            hero={{ label: 'Python', logo: '/logos/python.svg' }}
            active={current.nodes.includes('agent')}
            items={[
              { label: 'Escucha · Deepgram', logo: '/logos/deepgram.svg' },
              { label: 'Piensa · Gemma 4', logo: '/logos/gemma.png' },
              { label: 'Habla · ElevenLabs', logo: '/logos/elevenlabs.svg' },
              { label: 'Turnos · LiveKit', logo: '/logos/livekit.svg' },
            ]}
          />
        </div>
      </Reveal>

      <Reveal delay={0.4}>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#9fb3d1]">
          <span className="flex items-center gap-2">
            <LogoTile item={{ label: 'PostgreSQL', logo: '/logos/postgresql.svg' }} size="h-6 w-6" />
            Perfiles y memoria
          </span>
          <span className="flex items-center gap-2">
            <LogoTile item={{ label: 'OpenAI', logo: '/logos/openai.png' }} size="h-6 w-6" />
            Temas de conversación
          </span>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {ARCH_STEPS.map((item, index) => (
          <Reveal key={item.text} delay={0.5 + index * 0.08}>
            <button
              type="button"
              onClick={() => setStep(index)}
              className={`flex h-full w-full gap-3 rounded-2xl border p-4 text-left transition-colors duration-500 ${
                index === step ? 'border-[#2997ff]/70 bg-[#0b1a36]' : 'border-white/10 hover:bg-[#0b1a36]/60'
              }`}
            >
              <p className={`text-2xl font-semibold leading-none ${GRADIENT_TEXT}`}>{index + 1}</p>
              <p className="text-sm leading-snug text-[#f5f5f7]/85">{item.text}</p>
            </button>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 07 · Lo que aprendí sobre el negocio empresarial                   */
/* ------------------------------------------------------------------ */

const ENTERPRISE_INSIGHTS: { icon: LucideIcon; title: string; body: string; tag: string }[] = [
  {
    icon: DollarSign,
    title: 'El ROI habla más que el demo.',
    body: 'Las empresas no compran tecnología — compran resultados. Conectar cada feature a un ahorro de tiempo o un nuevo ingreso es lo que cierra el deal.',
    tag: 'Ventas',
  },
  {
    icon: Lock,
    title: 'Seguridad y compliance son no-negociables.',
    body: 'Antes de escalar cualquier agente de voz, las empresas preguntan: ¿dónde viven los datos? ¿Quién tiene acceso? Tener respuestas claras es requisito.',
    tag: 'Confianza',
  },
  {
    icon: Users,
    title: 'El campeón interno lo es todo.',
    body: 'La adopción tecnológica en empresas necesita a alguien adentro que crea en el proyecto. Sin patrocinador interno, el mejor producto muere en el piloto.',
    tag: 'Adopción',
  },
  {
    icon: Target,
    title: 'Empieza pequeño, comprueba, luego escala.',
    body: 'Un piloto acotado — un solo caso de uso, un equipo, 30 días — genera datos reales y reduce el riesgo percibido por los tomadores de decisión.',
    tag: 'Estrategia',
  },
  {
    icon: TrendingUp,
    title: 'La integración vale más que la innovación.',
    body: 'Las empresas tienen CRMs, ERPs y datos en silos. Un agente que se conecta a sus sistemas actuales tiene 10× más valor que uno que requiere reemplazarlos.',
    tag: 'Integración',
  },
  {
    icon: Building2,
    title: 'Velocidad de respuesta = credibilidad.',
    body: 'En contextos empresariales, responder rápido a preguntas técnicas o comerciales comunica madurez. La latencia en personas también importa.',
    tag: 'Ejecución',
  },
];

const ENTERPRISE_QUOTES = [
  {
    quote: 'El wow abre la puerta. El ROI la cierra.',
    context: '',
  },
];

function EnterpriseSlide() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Reveal delay={0.1}>
        <h2 className={`${HEADLINE} text-[clamp(2.25rem,5.5vw,5rem)]`}>
          Lo que aprendí
          <br />
          <span className={GRADIENT_TEXT}>sobre el negocio empresarial.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <p className={`${BODY} mt-5 max-w-3xl`}>
          Construir para empresas es distinto. Estas son las lecciones que me dejó llevar IA agéntica a directivos,
          CTOs y líderes de grandes organizaciones colombianas.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ENTERPRISE_INSIGHTS.map((item, index) => (
          <Reveal key={item.title} delay={0.2 + index * 0.07}>
            <div className="flex h-full flex-col gap-4 rounded-3xl bg-[#0b1a36] p-6">
              <p className="text-xl font-semibold leading-snug tracking-[-0.02em] text-[#f5f5f7]">{item.title}</p>
              <p className="text-sm leading-relaxed text-[#9fb3d1]">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {ENTERPRISE_QUOTES.map((item, index) => (
          <Reveal key={item.quote} delay={0.65 + index * 0.08}>
            <figure className="h-full rounded-3xl border border-[#2997ff]/30 bg-gradient-to-br from-[#2997ff]/10 to-[#0a3dbf]/10 p-7">
              <blockquote className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#f5f5f7] md:text-3xl">
                "{item.quote}"
              </blockquote>
              {item.context && (
                <figcaption className="mt-4 text-sm text-[#9fb3d1]">{item.context}</figcaption>
              )}
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Presentación                                                        */
/* ------------------------------------------------------------------ */

const SLIDES = [
  { id: 'quien-soy', label: 'Quién soy', Component: WhoSlide },
  { id: 'voz-agentica', label: 'Voz agéntica', Component: AgenticSlide },
  { id: 'futuro', label: 'El futuro', Component: FutureSlide },
  { id: 'evento', label: 'Experiencia', Component: EventSlide },
  { id: 'tecnologias', label: 'Tecnologías', Component: StackSlide },
  { id: 'arquitectura', label: 'Arquitectura', Component: ArchitectureSlide },
  { id: 'empresa', label: 'Negocio empresarial', Component: EnterpriseSlide },
];

export default function VoiceAgentsGenerativeUiEnterprise() {
  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);

  const go = useCallback((next: number) => {
    setPage(([current]) => {
      const clamped = Math.max(0, Math.min(SLIDES.length - 1, next));
      return clamped === current ? [current, 0] : [clamped, clamped > current ? 1 : -1];
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        setPage(([current]) => (current < SLIDES.length - 1 ? [current + 1, 1] : [current, 0]));
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        setPage(([current]) => (current > 0 ? [current - 1, -1] : [current, 0]));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -500) go(index + 1);
    else if (info.offset.x > 80 || info.velocity.x > 500) go(index - 1);
  };

  const { Component } = SLIDES[index];

  return (
    <main
      lang="es"
      className="relative flex h-[100svh] flex-col overflow-hidden bg-[#020b1f] text-[#f5f5f7] antialiased selection:bg-[#0a5cff]/40"
      style={{ fontFamily: APPLE_FONT }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(41,151,255,0.2),transparent)]" />
        <div className="absolute bottom-[-25%] right-[-10%] h-[60vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgba(10,92,255,0.18),transparent)]" />
      </div>

      <header className="relative z-20 border-b border-white/10 bg-[#020b1f]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3 md:px-10">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-[#f5f5f7]/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Portafolio
          </Link>
          <p className="hidden text-sm font-semibold tracking-[-0.01em] md:block">
            Agentes de voz con UI generativa para empresas
          </p>
          <p className="text-sm tabular-nums text-[#9fb3d1]">
            {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </p>
        </div>
        <motion.div
          className="h-px bg-gradient-to-r from-[#ffffff] via-[#8ec5ff] to-[#2997ff]"
          animate={{ width: `${((index + 1) / SLIDES.length) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </header>

      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.section
            key={SLIDES[index].id}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ opacity: 0, x: dir * 80 }),
              center: { opacity: 1, x: 0 },
              exit: (dir: number) => ({ opacity: 0, x: dir * -80 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
            className="absolute inset-0 overflow-y-auto"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${SLIDES.length}: ${SLIDES[index].label}`}
          >
            <div className="mx-auto min-h-full max-w-[1400px] px-6 pb-32 pt-10 md:px-10 md:pt-14">
              <Component />
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      <nav
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3"
        aria-label="Diapositivas"
      >
        <button
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Diapositiva anterior"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0b1a36]/90 text-[#f5f5f7] backdrop-blur-xl transition-opacity hover:bg-[#132a52] disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-[#0b1a36]/90 px-4 py-3.5 backdrop-blur-xl">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => go(i)}
              aria-label={`Ir a ${slide.label}`}
              aria-current={i === index ? 'step' : undefined}
              className="group relative"
            >
              <motion.span
                className="block h-2 rounded-full"
                animate={{
                  width: i === index ? 28 : 8,
                  backgroundColor: i === index ? '#f5f5f7' : 'rgba(245,245,247,0.35)',
                }}
                transition={{ duration: 0.35 }}
              />
              <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[#132a52] px-2 py-1 text-xs text-[#f5f5f7] group-hover:block">
                {slide.label}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => go(index + 1)}
          disabled={index === SLIDES.length - 1}
          aria-label="Siguiente diapositiva"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0b1a36]/90 text-[#f5f5f7] backdrop-blur-xl transition-opacity hover:bg-[#132a52] disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </main>
  );
}
