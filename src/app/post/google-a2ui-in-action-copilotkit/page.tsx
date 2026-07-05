'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ArrowDown, Sparkles, MessageSquare, Layers,
  Boxes, Cpu, Server, Code2, PlayCircle, CheckCircle, Wand2,
  LayoutGrid, LayoutTemplate, MousePointer2, Wrench, BookOpen,
  FileCode2, FileText, Code, Plug, Network, Workflow,
  Terminal, AppWindow, AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

/* ===========================================================================
   Google A2UI in Action — Dynamic Generative UI Frontends with CopilotKit
   Interactive zoom keynote (Prezi-style infinite canvas).
   Desktop: zoom/pan between scenes. Mobile: vertical stacked fallback.
=========================================================================== */

const ACCENT = '#5cbef8';
const G = { blue: '#4285F4', red: '#EA4335', yellow: '#FBBC05', green: '#34A853' };

// Each scene sits on a large 2D plane. `s` is the node's intrinsic scale on the
// plane — focusing always brings it to screen-scale 1, so smaller `s` => the
// camera has to zoom *in* more, which is what produces the dramatic transitions.
// x/y are generated from the array order so inserting a scene stays smooth.
type Scene = { id: string; x: number; y: number; s: number; r: number };

const SCENE_DEFS: { id: string; s: number; r: number }[] = [
  { id: 'title',     s: 1.0,  r: 0 },
  { id: 'problem',   s: 1.3,  r: 4 },
  { id: 'genui',     s: 0.78, r: -3 },
  { id: 'flavors',   s: 1.45, r: 3 },
  { id: 'a2ui',      s: 0.72, r: -4 },
  { id: 'catalog',   s: 1.5,  r: 3 },
  { id: 'ecosystem', s: 1.3,  r: -3 },
  { id: 'copilot',   s: 0.85, r: 3 },
  { id: 'backend',   s: 1.55, r: 2 },
  { id: 'frontend',  s: 0.8,  r: -4 },
  { id: 'demo',      s: 1.5,  r: 3 },
  { id: 'closing',   s: 0.72, r: 0 },
];

const SCENES: Scene[] = SCENE_DEFS.map((d, i) => ({
  ...d,
  x: i * 1500,
  y: (i % 2 === 0 ? -1 : 1) * (i % 4 < 2 ? 540 : 380),
}));

const NODE_W = 1120; // base design width of a scene card (px)

/* ---------------------- live A2UI mini renderer ------------------------- */
type A2Node = { id?: string; component?: { type?: string; props?: any } };

const PRESETS: Record<string, string> = {
  resumen: JSON.stringify(
    {
      surfaceUpdate: {
        surfaceId: 'summary-surface',
        components: [
          { id: 'h1', component: { type: 'Heading', props: { text: 'Resumen de hoy' } } },
          { id: 'c1', component: { type: 'Card', props: { title: '3 reuniones · 5 PRs', body: 'Tu día está al 72%. Buen ritmo 👌' } } },
          { id: 't1', component: { type: 'Text', props: { text: 'Generado por el agente vía A2UI.' } } },
        ],
      },
    }, null, 2,
  ),
  lista: JSON.stringify(
    {
      surfaceUpdate: {
        surfaceId: 'tasks-surface',
        components: [
          { id: 'h', component: { type: 'Heading', props: { text: 'Tareas pendientes' } } },
          { id: 'l', component: { type: 'List', props: { items: ['Revisar PR de A2UI', 'Preparar demo', 'Subir slides'] } } },
          { id: 'b', component: { type: 'Button', props: { label: 'Marcar todo como hecho' } } },
        ],
      },
    }, null, 2,
  ),
  error: '{ "surfaceUpdate": { "components": [ { BROKEN JSON ] }',
};

function A2UIRenderer({ nodes }: { nodes: A2Node[] }) {
  return (
    <div className="space-y-3">
      {nodes.map((n, i) => {
        const c = n.component || {};
        const p = c.props || {};
        switch (c.type) {
          case 'Heading':
            return <div key={i} className="text-xl font-bold text-white">{p.text}</div>;
          case 'Text':
            return <p key={i} className="text-sm text-[#cdd6ea]">{p.text}</p>;
          case 'Card':
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-4"
              >
                <p className="text-base font-extrabold text-white">{p.title}</p>
                <p className="mt-1 text-sm text-[#cdd6ea]">{p.body}</p>
              </motion.div>
            );
          case 'Button':
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block rounded-xl px-4 py-2 text-sm font-bold text-white"
                style={{ background: G.green }}
              >
                {p.label || 'Acción'}
              </motion.span>
            );
          case 'List':
            return (
              <ul key={i} className="space-y-1.5">
                {(p.items || []).map((it: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-[#cdd6ea]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm" style={{ background: G.blue }} />
                    {it}
                  </li>
                ))}
              </ul>
            );
          default:
            return (
              <div key={i} className="font-mono text-xs" style={{ color: G.red }}>
                ⚠ Tipo fuera del catálogo: {c.type || '?'}
              </div>
            );
        }
      })}
    </div>
  );
}

/* --------------------------- scene wrapper ------------------------------ */
function SceneCard({ children, active }: { children: React.ReactNode; active: boolean }) {
  return (
    <div
      className="relative w-full rounded-[32px] border border-white/[0.06] bg-[#0a0a0a]/95 px-12 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-opacity duration-500"
      style={{ opacity: active ? 1 : 0.25 }}
    >
      {/* subtle ambient sheen (matches portfolio keynote cards) */}
      <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
      {/* signature blue accent bar */}
      <div className="absolute left-10 right-10 top-0 h-[3px] rounded-b-lg bg-gradient-to-r from-[#5cbef8] to-[#1283c4] opacity-70" />
      <div className="relative">{children}</div>
    </div>
  );
}

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{children}</p>
);
const Bullet = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <li className="flex items-start gap-3 text-[17px] leading-relaxed text-[#d3dcef]">
    <span className="mt-2 h-3 w-3 shrink-0 rounded-[4px]" style={{ background: color }} />
    <span>{children}</span>
  </li>
);
const Tile = ({ title, color, children }: { title: string; color: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
    <h3 className="mb-2 text-lg font-bold" style={{ color }}>{title}</h3>
    <p className="text-[15px] leading-relaxed text-[#cdd6ea]">{children}</p>
  </div>
);
// Project's signature blue gradient (matches the rest of the portfolio keynotes).
// `grad` aliases it so every gradient title in the deck stays consistent.
const gradBlue = 'text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]';
const grad = gradBlue;
const Inline = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-[#ffd9a8]">{children}</code>
);

// History timeline: how we got from CLI → GUI → chatbots → today's problem
type TLItem = { era: string; title: string; desc: React.ReactNode; icon: any; hot?: boolean };
function HistoryTimeline({ items }: { items: TLItem[] }) {
  return (
    <div className="relative">
      {/* vertical rail */}
      <div className="absolute bottom-5 left-[19px] top-5 w-px bg-gradient-to-b from-white/10 via-white/15 to-[#5cbef8]/50" />
      <div className="space-y-5">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <div key={i} className="relative flex items-start gap-4">
              <span
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                  it.hot ? 'border-[#5cbef8]/50 bg-[#5cbef8]/15 text-[#5cbef8]' : 'border-white/10 bg-[#161617] text-[#86868b]'
                }`}
                style={it.hot ? { boxShadow: '0 0 26px rgba(92,190,248,0.25)' } : undefined}
              >
                <Icon size={18} />
              </span>
              <div className="pt-0.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#86868b]">{it.era}</span>
                  <h3 className={`text-lg font-bold tracking-tight ${it.hot ? 'text-[#5cbef8]' : 'text-white'}`}>{it.title}</h3>
                </div>
                <p className="mt-0.5 max-w-2xl text-[15px] leading-relaxed text-[#86868b]">{it.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- "Spectrum of Generative UI": Fully Controlled → Declarative → Open ---- */
type Flavor = { key: string; pos: number; color: string; icon: any; label: string; title: string; tag: string; desc: string };

const FLAVORS: Flavor[] = [
  {
    key: 'controlled', pos: 21, color: G.green, icon: LayoutGrid, label: 'Controlled',
    title: 'Controlled · UI generativa estática',
    tag: 'El caballo de batalla.',
    desc: 'El agente elige entre componentes ya definidos (p. ej. SummaryCard) y decide con qué datos renderizarlos — pero no puede inventar layouts nuevos.',
  },
  {
    key: 'declarative', pos: 50, color: ACCENT, icon: LayoutTemplate, label: 'Declarative',
    title: 'Declarative · UI generativa declarativa',
    tag: 'El enfoque de esta charla.',
    desc: 'El agente devuelve una especificación estructurada (JSON / A2UI); el cliente la renderiza con componentes nativos del catálogo.',
  },
  {
    key: 'open', pos: 80, color: G.red, icon: Sparkles, label: 'Open',
    title: 'Open · UI generativa abierta',
    tag: 'Máxima flexibilidad, máximo riesgo.',
    desc: 'El agente genera código o HTML libremente. Muy flexible, pero con riesgos de seguridad y UX inconsistente.',
  },
];

const TICKS = [
  { pos: 13, label: 'Manually\nemitted', icon: MousePointer2 },
  { pos: 30, label: 'Tool\nrendering', icon: Wrench },
  { pos: 40, label: 'Fixed\ncatalog', icon: BookOpen },
  { pos: 46, label: 'Fixed\nschema', icon: FileCode2 },
  { pos: 60, label: 'Enriched\nmarkdown', icon: FileText },
  { pos: 66, label: 'Enriched\nHTML', icon: Code },
  { pos: 71, label: 'MCP\nApps', icon: Plug },
];

function FlavorSpectrum({ selected, onSelect }: { selected: string; onSelect: (k: string) => void }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-[64px] shrink-0 whitespace-pre-line text-right text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] text-[#86868b]">{'Fully\ncontrolled'}</span>

      <div className="relative h-[200px] flex-1">
        {/* gradient rail */}
        <div
          className="absolute left-0 right-0 top-[104px] h-[4px] rounded-full"
          style={{ background: `linear-gradient(90deg, rgba(52,168,83,0) 0%, ${G.green} 8%, ${ACCENT} 50%, ${G.red} 92%, rgba(234,67,53,0) 100%)` }}
        />

        {/* sub-technique ticks above the rail */}
        {TICKS.map((t) => (
          <div key={t.label} className="absolute flex w-[84px] -translate-x-1/2 flex-col items-center" style={{ left: `${t.pos}%`, top: 0 }}>
            <span className="whitespace-pre text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.1em] text-[#6b7280]">{t.label}</span>
            <t.icon size={13} className="mt-1.5 text-[#7c869b]" />
            <div className="mt-1.5 h-[52px] w-px bg-white/15" />
          </div>
        ))}

        {/* main flavor nodes on the rail */}
        {FLAVORS.map((f) => {
          const isSel = selected === f.key;
          const Icon = f.icon;
          return (
            <button
              key={f.key}
              onClick={(e) => { e.stopPropagation(); onSelect(f.key); }}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300"
              style={{
                left: `${f.pos}%`, top: '104px', height: 56, width: 56,
                background: isSel ? f.color : '#ffffff',
                color: isSel ? '#fff' : '#1a1a1a',
                boxShadow: isSel ? `0 0 0 10px ${f.color}26, 0 0 42px ${f.color}99` : '0 6px 22px rgba(0,0,0,0.45)',
              }}
            >
              <Icon size={22} />
            </button>
          );
        })}

        {/* node labels below the rail */}
        {FLAVORS.map((f) => (
          <button
            key={f.key + '-lbl'}
            onClick={(e) => { e.stopPropagation(); onSelect(f.key); }}
            className="absolute -translate-x-1/2 text-center text-sm font-bold transition-colors"
            style={{ left: `${f.pos}%`, top: '146px', color: selected === f.key ? f.color : '#fff' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <span className="w-[64px] shrink-0 whitespace-pre-line text-left text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] text-[#86868b]">{'Fully\nopen'}</span>
    </div>
  );
}

/* ---- Agentic protocols ecosystem: MCP / AG-UI / A2A → CopilotKit → app ---- */
function ProtocolEcosystem() {
  const protos = [
    { name: 'MCP', role: 'Agent → Tool', icon: Wrench, hot: false },
    { name: 'AG-UI', role: 'Agent ↔ User · bi-direccional', icon: Workflow, hot: true },
    { name: 'A2A', role: 'Agent → Agent', icon: Network, hot: false },
  ];
  return (
    <div className="flex flex-col items-center">
      <div className="grid w-full grid-cols-3 gap-4">
        {protos.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.name} className="flex flex-col items-center text-center">
              <div
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 ${p.hot ? 'border border-[#5cbef8]/40' : 'border border-white/10'} bg-[#0b0f1a]`}
                style={p.hot ? { boxShadow: '0 0 34px rgba(92,190,248,0.25)' } : undefined}
              >
                <Icon size={16} className={p.hot ? 'text-[#5cbef8]' : 'text-white'} />
                <span className="font-bold text-white">{p.name}</span>
              </div>
              <span className="mt-2 text-xs leading-tight text-[#86868b]">{p.role}</span>
              <div className="mt-2 h-7 w-px bg-white/15" />
            </div>
          );
        })}
      </div>

      <ArrowDown size={18} className="-mt-1 text-[#5cbef8]" />

      <div className="mt-1 rounded-2xl border border-white/[0.08] bg-[#161617]/60 px-7 py-3 text-center backdrop-blur-md">
        <span className="text-base font-bold tracking-tight text-white">CopilotKit</span>
        <span className="ml-2 text-xs text-[#86868b]">· puente runtime → tu app React/Next.js</span>
      </div>
    </div>
  );
}

// "Evolution" flow: text chatbot -> A2UI (declarative JSON) -> agent-generated UI
function EvolutionFlow() {
  const steps = [
    { icon: MessageSquare, label: 'Chatbot de texto', sub: 'Texto entra, texto sale', accent: false },
    { icon: Code2, label: 'A2UI · JSON declarativo', sub: 'El agente describe la UI', accent: false },
    { icon: Sparkles, label: 'UI generada por el agente', sub: 'Componentes en tiempo real', accent: true },
  ];
  return (
    <div className="mt-7 flex flex-wrap items-stretch gap-3">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-stretch gap-3">
          <div className={`flex w-[210px] flex-col rounded-2xl border p-4 backdrop-blur-md transition-colors ${
            s.accent ? 'border-[#5cbef8]/30 bg-[#5cbef8]/[0.06]' : 'border-white/[0.06] bg-[#161617]/40'
          }`}>
            <s.icon size={18} className={s.accent ? 'text-[#5cbef8]' : 'text-[#86868b]'} />
            <p className="mt-2 text-sm font-semibold tracking-tight text-white">{s.label}</p>
            <p className="mt-0.5 text-xs font-light text-[#86868b]">{s.sub}</p>
          </div>
          {i < steps.length - 1 && (
            <div className="flex items-center text-[#5cbef8]"><ArrowRight size={20} /></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function A2UIKeynote() {
  const [active, setActive] = useState(0);
  const [vw, setVw] = useState(1440);
  const [vh, setVh] = useState(900);
  const [isMobile, setIsMobile] = useState(false);

  // selected flavor on the "spectrum of generative UI"
  const [flavor, setFlavor] = useState('declarative');

  // live demo state
  const [a2Input, setA2Input] = useState(PRESETS.resumen);
  const [a2Error, setA2Error] = useState<string | null>(null);
  const [a2Nodes, setA2Nodes] = useState<A2Node[]>([]);

  const renderA2 = useCallback((raw: string) => {
    try {
      const data = JSON.parse(raw);
      const comps: A2Node[] = data?.surfaceUpdate?.components || [];
      if (!comps.length) { setA2Error('surfaceUpdate sin componentes.'); setA2Nodes([]); return; }
      setA2Error(null); setA2Nodes(comps);
    } catch (e: any) {
      setA2Error(e.message); setA2Nodes([]);
    }
  }, []);

  useEffect(() => { renderA2(a2Input); }, []); // initial render

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth); setVh(window.innerHeight);
      setIsMobile(window.innerWidth < 1024);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const go = useCallback((i: number) => {
    setActive(Math.max(0, Math.min(SCENES.length - 1, i)));
  }, []);

  // keyboard navigation
  useEffect(() => {
    if (isMobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) { e.preventDefault(); setActive(v => Math.min(SCENES.length - 1, v + 1)); }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); setActive(v => Math.max(0, v - 1)); }
      else if (e.key === 'Home') setActive(0);
      else if (e.key === 'End') setActive(SCENES.length - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobile]);

  // camera transform for the active scene
  const cam = useMemo(() => {
    const sc = SCENES[active];
    const fit = Math.min(1, (vw * 0.9) / NODE_W);
    const Z = (1 / sc.s) * fit;
    return { x: vw / 2 - sc.x * Z, y: vh / 2 - sc.y * Z, scale: Z };
  }, [active, vw, vh]);

  const progress = SCENES.length > 1 ? active / (SCENES.length - 1) : 0;

  /* ---------------- scene content (shared by zoom + mobile) ------------- */
  const sceneContent: Record<string, React.ReactNode> = {
    title: (
      <>
        <h1 className="mb-5 text-5xl font-semibold leading-[1.05] tracking-tighter text-white md:text-6xl">
          Google <span className={gradBlue}>A2UI</span> in Action
        </h1>
        <p className="mb-1 text-2xl font-normal tracking-tight text-[#86868b] md:text-3xl">
          Dynamic Generative UI Frontends con CopilotKit y agentes de IA.
        </p>
        <p className="text-base font-light text-[#86868b]/90">De chatbots de solo texto → a interfaces dinámicas generadas por agentes.</p>

        <EvolutionFlow />

        <div className="mt-7 flex flex-wrap gap-2.5">
          {['A2UI Spec', 'CopilotKit', 'React / Next.js', 'Generative UI'].map((t) => (
            <span key={t} className="rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-1.5 text-[13px] font-medium text-[#86868b]">{t}</span>
          ))}
        </div>

        <div className="mt-7 inline-block rounded-[20px] border border-white/[0.06] bg-[#161617]/40 px-6 py-4 backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">Presentador</p>
          <p className="mt-0.5 text-xl font-semibold tracking-tight text-white">Angel Arrieta</p>
          <p className="text-sm font-light text-[#86868b]">Founding Tech Lead · Medellín</p>
        </div>
      </>
    ),
    problem: (
      <>
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Problema · Cómo llegamos hasta aquí</p>
        <h2 className="mb-6 flex items-center gap-3 text-4xl font-semibold leading-tight tracking-tighter text-white md:text-5xl">
          <MessageSquare className="shrink-0 text-[#5cbef8]" /> Del chat estático al <span className={gradBlue}>futuro de interfaces dinámicas</span>.
        </h2>
        <HistoryTimeline
          items={[
            { era: '1970s', title: 'Terminal / CLI', icon: Terminal, desc: 'Hablábamos con la máquina escribiendo comandos. Todo era texto, en ambos sentidos.' },
            { era: '1984', title: 'GUI', icon: AppWindow, desc: 'Ventanas, botones y formularios. Potente — pero cada pantalla se diseña 100% a mano.' },
            { era: '2022', title: 'Chatbots + LLMs', icon: MessageSquare, desc: 'La IA llega a las masas… como un chat: texto que entra, texto que sale.' },
            { era: 'Hoy', title: 'El problema', icon: AlertTriangle, hot: true, desc: (<>Mostrar datos complejos —dashboards, listas, formularios— solo con texto es incómodo. El agente <span className="font-medium text-white">“piensa”</span>, pero la UI sigue estática y el trabajo extra lo hace el usuario.</>) },
          ]}
        />
      </>
    ),
    genui: (
      <>
        <Kicker><span style={{ color: ACCENT }}>Concepto</span> · ¿Qué es Generative UI?</Kicker>
        <h2 className="mb-4 flex items-center gap-3 text-4xl font-semibold tracking-tighter"><Sparkles className="text-[#5cbef8]" /><span className={grad}>Generative UI</span></h2>
        <p className="mb-3 text-xl text-[#eaf0ff]">Interfaces donde parte de la UI se genera o controla dinámicamente por un agente, <b>en tiempo de ejecución</b>.</p>
        <p className="mb-5 text-[17px] text-[#cdd6ea]">El agente no solo decide <b>qué decir</b>, también decide <b>qué componentes mostrar</b> y cómo organizarlos.</p>
        <div className="grid grid-cols-2 gap-5">
          <Tile title="UI tradicional" color={G.yellow}>Todas las pantallas y layouts se definen 100% a mano en diseño y código.</Tile>
          <Tile title="Generative UI" color={G.green}>Algunas partes se adaptan a la intención del usuario y al contexto, gracias al agente.</Tile>
        </div>
      </>
    ),
    flavors: (() => {
      const f = FLAVORS.find((x) => x.key === flavor) || FLAVORS[1];
      const FIcon = f.icon;
      return (
        <>
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Taxonomía · El espectro de Generative UI</p>
          <h2 className="mb-1 flex items-center gap-3 text-4xl font-semibold tracking-tighter text-white">
            <Layers className="text-[#5cbef8]" /> Tres <span className={gradBlue}>sabores</span> de Generative UI
          </h2>
          <p className="mb-2 text-sm text-[#86868b]">Un mismo eje: de <b className="text-white">totalmente controlado</b> a <b className="text-white">totalmente abierto</b>. Haz clic en cada nodo.</p>

          <FlavorSpectrum selected={flavor} onSelect={setFlavor} />

          {/* detail for the selected flavor */}
          <div
            className="mt-4 rounded-2xl border p-6 backdrop-blur-md transition-colors"
            style={{ borderColor: `${f.color}55`, background: `${f.color}12` }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${f.color}22`, color: f.color }}>
                <FIcon size={20} />
              </span>
              <div>
                <h3 className="text-xl font-bold tracking-tight" style={{ color: f.color }}>{f.title}</h3>
                <p className="text-sm italic text-[#86868b]">{f.tag}</p>
              </div>
            </div>
            <p className="mt-3 text-base leading-relaxed text-[#d2d2d7]">{f.desc}</p>
          </div>

          <p className="mt-4 text-base text-[#86868b]">👉 En esta charla nos enfocamos en <span className="font-bold text-[#5cbef8]">Declarative</span> — la base de A2UI.</p>
        </>
      );
    })(),
    a2ui: (
      <>
        <Kicker><span style={{ color: ACCENT }}>Google</span> · La especificación</Kicker>
        <h2 className="mb-4 text-4xl font-semibold tracking-tighter">¿Qué es <span className={grad}>Google A2UI</span>?</h2>
        <p className="mb-5 text-xl text-[#eaf0ff]">La especificación de Generative UI de Google para interfaces controladas por agentes.</p>
        <ul className="space-y-4">
          <Bullet color={G.blue}><b>Formato JSONL</b>, amigable para LLMs.</Bullet>
          <Bullet color={G.red}><b>Declarativo</b>: el agente describe qué UI quiere (tipo + props), no HTML ni código ejecutable.</Bullet>
          <Bullet color={G.yellow}><b>Streaming &amp; multi-superficie</b>: distintas áreas se actualizan en tiempo real.</Bullet>
        </ul>
        <p className="mt-5 text-sm italic text-[#9aa6bd]">“A2UI es el lenguaje en JSON que usan los agentes para decirle al frontend qué UI mostrar.”</p>
      </>
    ),
    catalog: (
      <>
        <Kicker><span style={{ color: ACCENT }}>Basic catalog</span> · Sin componentes custom</Kicker>
        <h2 className="mb-4 flex items-center gap-3 text-4xl font-semibold tracking-tighter text-white"><Boxes className="text-[#5cbef8]" /> Catálogo básico A2UI</h2>
        <p className="mb-4 text-[17px] text-[#cdd6ea]">Cada superficie A2UI está respaldada por un <b>catálogo de componentes permitidos</b>.</p>
        <div className="mb-6 flex flex-wrap gap-3">
          {['Text', 'Heading', 'Card', 'Button', 'Listas', 'Form básico'].map(t => (
            <span key={t} className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-base font-semibold text-white">{t}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Tile title="Menos trabajo inicial" color={G.blue}>Demos y productos usando solo el catálogo básico — sin crear componentes React nuevos.</Tile>
          <Tile title="Más seguridad" color={G.red}>El agente no puede inventar tipos fuera del catálogo aprobado.</Tile>
        </div>
      </>
    ),
    ecosystem: (
      <>
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Ecosistema · AG-UI ≠ A2UI</p>
        <h2 className="mb-1 text-4xl font-semibold tracking-tighter text-white">AG-UI y A2UI, <span className={gradBlue}>explicados</span></h2>
        <p className="mb-5 text-base text-[#86868b]">Se parecen en el nombre, pero resuelven cosas distintas — y se complementan.</p>

        <ProtocolEcosystem />

        <div className="mt-6 grid grid-cols-2 gap-5">
          <div className="rounded-2xl border border-[#5cbef8]/30 bg-[#5cbef8]/[0.07] p-5">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles size={18} className="text-[#5cbef8]" />
              <h3 className="text-lg font-bold text-white">A2UI <span className="text-sm font-normal text-[#86868b]">· Google</span></h3>
            </div>
            <p className="text-sm font-semibold text-[#5cbef8]">El QUÉ — la especificación de Generative UI.</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[#d2d2d7]">El agente entrega <b>widgets / UI declarativa</b>. Es una <i>gen UI spec</i>, junto a MCP-UI y Open-JSON-UI.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161617]/40 p-5">
            <div className="mb-1 flex items-center gap-2">
              <Workflow size={18} className="text-white" />
              <h3 className="text-lg font-bold text-white">AG-UI <span className="text-sm font-normal text-[#86868b]">· CopilotKit</span></h3>
            </div>
            <p className="text-sm font-semibold text-[#86868b]">El CÓMO — el protocolo de interacción.</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[#d2d2d7]">La conexión <b>runtime bi-direccional</b> entre el backend agéntico y tu app. <b>No</b> es una spec de gen UI; la transporta.</p>
          </div>
        </div>

        <p className="mt-5 text-base text-[#86868b]">👉 <span className="font-bold text-[#5cbef8]">A2UI describe</span> la UI · <span className="font-bold text-white">AG-UI la transporta</span> en tiempo real.</p>
      </>
    ),
    copilot: (
      <>
        <Kicker><span style={{ color: ACCENT }}>El puente</span> · ¿Dónde entra CopilotKit?</Kicker>
        <h2 className="mb-4 flex items-center gap-3 text-4xl font-semibold tracking-tighter text-white"><Cpu className="text-[#5cbef8]" /> CopilotKit</h2>
        <p className="mb-5 text-xl text-[#eaf0ff]">El stack de frontend (React/Next.js) que implementa <b>AG-UI + A2UI</b> para conectar agentes y UI.</p>
        <ul className="space-y-4">
          <Bullet color={G.blue}><Inline>CopilotKitProvider</Inline> para configurar el runtime y A2UI.</Bullet>
          <Bullet color={G.red}>Componentes listos como <Inline>CopilotChat</Inline> para chat + UI generativa.</Bullet>
          <Bullet color={G.yellow}>Un <b>renderer A2UI</b> que interpreta <Inline>surfaceUpdate</Inline> y pinta el catálogo básico.</Bullet>
        </ul>
        <p className="mt-5 text-sm italic text-[#9aa6bd]">“La forma más rápida de traer A2UI a frontends React sin re-inventar el runtime.”</p>
      </>
    ),
    backend: (
      <>
        <Kicker><span style={{ color: G.red }}>Backend</span> · Agente + A2UI</Kicker>
        <h2 className="mb-4 flex items-center gap-3 text-4xl font-semibold tracking-tighter text-white"><Server className="text-[#5cbef8]" /> Flujo backend</h2>
        <ul className="mb-4 space-y-3">
          <Bullet color={G.blue}>Definimos un <Inline>CopilotRuntime</Inline> con nuestros agentes.</Bullet>
          <Bullet color={G.red}>Activamos A2UI con <Inline>a2ui: {'{}'}</Inline> para transmitir mensajes A2UI.</Bullet>
          <Bullet color={G.yellow}>El agente devuelve eventos <Inline>surfaceUpdate</Inline>, no solo texto.</Bullet>
        </ul>
        <pre className="overflow-auto rounded-2xl border border-white/10 bg-[#060a14] p-5 font-mono text-[13px] leading-relaxed text-[#cfe0ff]">{`{
  "surfaceUpdate": {
    "surfaceId": "summary-surface",
    "components": [{
      "id": "card-1",
      "component": {
        "type": "Card",
        "props": {
          "title": "Resumen de hoy",
          "body":  "Card generado con A2UI."
        }
      }
    }]
  }
}`}</pre>
      </>
    ),
    frontend: (
      <>
        <Kicker><span style={{ color: ACCENT }}>Frontend</span> · React + CopilotKit + A2UI</Kicker>
        <h2 className="mb-4 flex items-center gap-3 text-4xl font-semibold tracking-tighter text-white"><Code2 className="text-[#5cbef8]" /> Flujo frontend</h2>
        <ul className="mb-4 space-y-3">
          <Bullet color={G.blue}>Envolvemos la app con <Inline>CopilotKitProvider</Inline> → <Inline>/api/copilotkit</Inline>.</Bullet>
          <Bullet color={G.red}>Activamos A2UI con el catálogo básico: <Inline>a2ui={'{{}}'}</Inline>.</Bullet>
          <Bullet color={G.yellow}><Inline>CopilotChat</Inline> devuelve texto <b>y</b> componentes UI A2UI.</Bullet>
        </ul>
        <pre className="overflow-auto rounded-2xl border border-white/10 bg-[#060a14] p-5 font-mono text-[13px] leading-relaxed text-[#cfe0ff]">{`<CopilotKitProvider
  runtimeUrl="/api/copilotkit"
  a2ui={{}} // usar catálogo básico A2UI
>
  <CopilotChat title="Google A2UI Demo" />
</CopilotKitProvider>`}</pre>
      </>
    ),
    demo: (
      <>
        <Kicker><span style={{ color: ACCENT }}>Demo en vivo</span> · A2UI → render real</Kicker>
        <h2 className="mb-2 flex items-center gap-3 text-4xl font-semibold tracking-tighter"><PlayCircle className="text-[#5cbef8]" /> Render de A2UI <span className={grad}>en vivo</span></h2>
        <p className="mb-5 text-sm text-[#9aa6bd]">Edita el <Inline>surfaceUpdate</Inline> y pulsa <b>Renderizar</b>. Esto es lo que hace el renderer del catálogo básico.</p>
        <div className="grid grid-cols-2 gap-5">
          {/* input */}
          <div className="flex min-h-[300px] flex-col rounded-2xl border border-white/10 bg-[#060a14] p-4">
            <h3 className="mb-2.5 text-xs uppercase tracking-[0.08em] text-[#9aa6bd]">Agente → JSON A2UI</h3>
            <textarea
              value={a2Input}
              spellCheck={false}
              onChange={(e) => setA2Input(e.target.value)}
              className="min-h-[180px] flex-1 resize-none rounded-lg border border-white/10 bg-[#03060d] p-3 font-mono text-[12.5px] leading-relaxed text-[#cfe0ff] outline-none focus:border-[#4285F4]/60"
            />
            <div className="mt-3 flex flex-wrap gap-2.5">
              <button onClick={() => renderA2(a2Input)} className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold text-white" style={{ background: G.blue }}><Wand2 size={15} /> Renderizar</button>
              <button onClick={() => { setA2Input(PRESETS.resumen); renderA2(PRESETS.resumen); }} className="rounded-lg px-4 py-2 text-sm font-bold text-white" style={{ background: G.green }}>Resumen</button>
              <button onClick={() => { setA2Input(PRESETS.lista); renderA2(PRESETS.lista); }} className="rounded-lg px-4 py-2 text-sm font-bold text-[#1a1300]" style={{ background: G.yellow }}>Lista + Botón</button>
              <button onClick={() => { setA2Input(PRESETS.error); renderA2(PRESETS.error); }} className="rounded-lg border border-white/15 px-4 py-2 text-sm font-bold text-white">Romper JSON</button>
            </div>
          </div>
          {/* surface */}
          <div className="flex min-h-[300px] flex-col rounded-2xl border border-white/10 bg-[#060a14] p-4">
            <h3 className="mb-2.5 text-xs uppercase tracking-[0.08em] text-[#9aa6bd]">CopilotKit → superficie renderizada</h3>
            <div className="flex-1 overflow-auto rounded-xl border border-dashed border-white/10 bg-gradient-to-b from-[#4285F4]/[0.06] to-transparent p-4">
              {a2Error
                ? <div className="font-mono text-[13px]" style={{ color: G.red }}>❌ JSON inválido — el renderer lo rechaza de forma segura.<br />{a2Error}</div>
                : <A2UIRenderer nodes={a2Nodes} />}
            </div>
          </div>
        </div>
      </>
    ),
    closing: (
      <>
        <Kicker><span style={{ color: ACCENT }}>Conclusiones</span></Kicker>
        <h2 className="mb-5 text-4xl font-semibold tracking-tighter text-white">Para cerrar</h2>
        <ul className="space-y-4">
          <Bullet color={G.blue}><b>Generative UI</b>: los agentes influyen en la interfaz, no solo en el texto.</Bullet>
          <Bullet color={G.green}><b>Google A2UI</b>: la especificación declarativa que lo hace seguro, portable y amigable para LLMs.</Bullet>
          <Bullet color={G.yellow}><b>CopilotKit</b>: el puente práctico para llevar A2UI a React/Next.js — incluso con solo el catálogo básico.</Bullet>
        </ul>
        <p className={`mt-6 text-3xl font-extrabold ${grad}`}>¡Gracias! 🚀</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-[#9aa6bd]"><CheckCircle size={15} className="text-[#5cbef8]" /> Preguntas → Angel Arrieta</p>
      </>
    ),
  };

  return (
    <div className="min-h-screen overflow-hidden bg-black font-sans text-[#F5F5F7] antialiased selection:bg-[#5cbef8]/30">
      {/* ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[15%] top-[10%] h-[55vw] w-[55vw] rounded-full bg-[#4285F4]/[0.05] blur-[170px]" />
        <div className="absolute bottom-[8%] right-[8%] h-[45vw] w-[45vw] rounded-full bg-[#EA4335]/[0.04] blur-[180px]" />
        <div className="absolute right-[30%] top-[20%] h-[40vw] w-[40vw] rounded-full bg-[#34A853]/[0.04] blur-[180px]" />
      </div>

      {/* header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-white/[0.06] bg-black/70 px-8 py-5 backdrop-blur-xl">
        <Link href="/" className="group flex items-center space-x-2 text-[#86868b] transition-colors hover:text-white">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span className="text-sm font-medium tracking-tight">Volver al portfolio</span>
        </Link>
        <div className="flex items-center space-x-4">
          <span className="rounded-full border border-white/[0.06] bg-white/[0.08] px-3 py-1 text-[11px] font-semibold tracking-widest text-white">A2UI</span>
          <span className="text-xs font-medium text-[#86868b]">Angel Arrieta</span>
        </div>
      </header>

      {/* progress */}
      <div className="fixed left-0 top-[65px] z-50 h-[2px] w-full bg-white/[0.04]">
        <div className="h-full transition-all duration-500" style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${G.blue}, ${G.green}, ${G.yellow})` }} />
      </div>

      {isMobile ? (
        /* ---------------------- MOBILE: vertical stack -------------------- */
        <div className="relative z-10 flex flex-col gap-10 px-5 pb-24 pt-28">
          {SCENES.map((sc) => (
            <SceneCard key={sc.id} active>{sceneContent[sc.id]}</SceneCard>
          ))}
        </div>
      ) : (
        /* ---------------------- DESKTOP: zoom canvas ---------------------- */
        <>
          <div className="fixed inset-0 z-10">
            <motion.div
              className="absolute left-0 top-0"
              style={{ transformOrigin: '0 0' }}
              animate={{ x: cam.x, y: cam.y, scale: cam.scale }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {SCENES.map((sc, i) => (
                <div
                  key={sc.id}
                  className="absolute"
                  style={{
                    left: sc.x, top: sc.y, width: NODE_W,
                    transform: `translate(-50%, -50%) rotate(${sc.r}deg) scale(${sc.s})`,
                  }}
                  onClick={() => i !== active && go(i)}
                >
                  <SceneCard active={i === active}>{sceneContent[sc.id]}</SceneCard>
                </div>
              ))}
            </motion.div>
          </div>

          {/* nav controls */}
          <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/[0.08] bg-black/60 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
            <button onClick={() => go(active - 1)} disabled={active === 0} className="rounded-full p-1.5 text-white transition-colors hover:bg-white/[0.06] disabled:opacity-20"><ArrowLeft size={16} /></button>
            <div className="flex items-center gap-1.5">
              {SCENES.map((sc, i) => (
                <button key={sc.id} onClick={() => go(i)} title={`Escena ${i + 1}`}
                  className="h-2.5 w-2.5 rounded-full transition-all duration-300"
                  style={{ background: i === active ? G.blue : 'rgba(255,255,255,0.2)', transform: i === active ? 'scale(1.35)' : 'scale(1)' }} />
              ))}
            </div>
            <button onClick={() => go(active + 1)} disabled={active === SCENES.length - 1} className="rounded-full p-1.5 text-white transition-colors hover:bg-white/[0.06] disabled:opacity-20"><ArrowRight size={16} /></button>
            <span className="border-l border-white/[0.08] pl-3 font-mono text-xs text-[#86868b]">{active + 1} / {SCENES.length}</span>
          </div>

          {/* hint */}
          <div className="fixed bottom-8 right-8 z-50 hidden items-center gap-2 text-[11px] text-[#86868b] xl:flex">
            <kbd className="rounded border border-white/10 bg-white/[0.06] px-2 py-0.5 font-mono">←</kbd>
            <kbd className="rounded border border-white/10 bg-white/[0.06] px-2 py-0.5 font-mono">→</kbd>
            <span>o haz clic en una escena para hacer zoom</span>
          </div>
        </>
      )}
    </div>
  );
}
