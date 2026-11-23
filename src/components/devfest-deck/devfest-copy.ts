export type DevFestLang = 'es' | 'en';

export const DEVFEST_LANG_KEY = 'am-devfest-lang';

type ProductIntroCopy = {
  eyebrow: string;
  lead: string;
  points: string[];
  shotAlt: string;
};

type CaseMedia = { alt: string; caption?: string };

type ProblemCase = {
  eyebrow: string;
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  body: string;
};

export type DevFestCopy = {
  chrome: {
    posts: string;
    title: string;
    langAria: string;
    slidesNav: string;
    prevSlide: string;
    nextSlide: string;
    goTo: (label: string) => string;
    slideAria: (n: number, total: number, label: string) => string;
    resources: string;
    fullscreen: string;
    fullscreenAria: (alt: string) => string;
    close: string;
    prev: string;
    next: string;
    showN: (n: number) => string;
    galleryAria: (label: string) => string;
    slideOf: (i: number, total: number) => string;
    zoomOut: string;
    zoomIn: string;
    fit: string;
    panHint: string;
    viewing: string;
    viewCode: string;
    realCapture: (source: string) => string;
  };
  slides: Record<string, string>;
  intro: {
    aria: string;
    welcome: string;
    event: string;
    kicker: string;
    hello: string;
    sub: string;
    skip: string;
  };
  hook: { title: string; accent: string; lead: string; demo: string; code: string; byline: string };
  people: {
    eyebrow: string;
    title: string;
    accent: string;
    lead: string;
    mediaAlt: string;
    items: { who: string; quote: string; body: string }[];
  };
  repo: { eyebrow: string; title: string; accent: string; lead: string };
  who: { eyebrow: string; title: string; accent: string; lead: string; yogaAlt: string };
  future: {
    eyebrow: string;
    title: string;
    accent: string;
    credits: string;
    items: { title: string; body: string; alt: string }[];
  };
  today: {
    eyebrow: string;
    title: string;
    accent: string;
    credits: string;
    items: { label: string; alt: string }[];
  };
  problem: {
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    caseA: ProblemCase;
    caseB: ProblemCase;
    combined: string;
    funnel: string;
  };
  cases: {
    eyebrow: string;
    title: string;
    accent: string;
    lead: string;
    credits: string;
    items: { title: string; client?: string; body: string; media: CaseMedia[] }[];
  };
  architecture: {
    eyebrow: string;
    title: string;
    accent: string;
    viewCanvas: string;
    viewShot: string;
    diagramAlt: string;
    layers: { voz: string; interfaz: string; cerebro: string };
    nodeText: Record<string, { eyebrow?: string; title?: string; sub?: string; badge?: string }>;
    edgeLabels: Record<string, string>;
  };
  adk: {
    eyebrow: string;
    title: string;
    accent: string;
    tablist: string;
    resources: { label: string; url: string }[];
    parts: { id: string; body: string; note: string }[];
  };
  productIntros: { livekit: ProductIntroCopy; copilotkit: ProductIntroCopy; anthropic: ProductIntroCopy };
  livekit: {
    eyebrow: string;
    title: string;
    accent: string;
    tablist: string;
    resources: { label: string; url: string }[];
    parts: { id: string; body: string; note: string }[];
  };
  costs: {
    perSessionSuffix: string;
    allIn: string;
    times100: string;
    plansEyebrow: string;
    metering: { label: string; note: string }[];
    options: { bills: string }[];
  };
  security: {
    eyebrow: string;
    title: string;
    accent: string;
    dataLabel: string;
    dataBody: string;
    points: { title: string; body: string; plan: string }[];
  };
  emotion: {
    eyebrow: string;
    title: string;
    accent: string;
    serLabel: string;
    ser: string;
    hoyLabel: string;
    hoy: string;
    tiempoLabel: string;
    tiempo: string;
    flows: { id: string; summary: string; stepNames: string[] }[];
  };
  copilotkit: {
    eyebrow: string;
    title: string;
    accent: string;
    tablist: string;
    jsonEvents: string;
    channels: string;
    resources: { label: string; url: string }[];
    concepts: { term: string; body: string; note?: string; shotLabels?: string[] }[];
  };
  stack: {
    eyebrow: string;
    title: string;
    accent: string;
    groups: { group: string; itemNotes?: Record<string, string> }[];
  };
  skill: {
    eyebrow: string;
    title: string;
    accent: string;
    youPill: string;
    edgeLabels: Record<string, string>;
    nodeText: Record<string, { eyebrow?: string; title?: string; sub?: string; badge?: string }>;
  };
  moodboard: { eyebrow: string; title: string; alt: string };
  steps: {
    eyebrow: string;
    title: string;
    accent: string;
    allCode: string;
    quickstart: string;
    items: { t: string; b: string; linkLabel: string }[];
  };
  audience: {
    eyebrow: string;
    title: string;
    accent: string;
    lead: string;
    siteSub: string;
    communities: string;
    communitiesSub: string;
    photoAlt: string;
  };
};

const chromeEs: DevFestCopy['chrome'] = {
  posts: "Posts",
  title: "DevFest Medellín 2026 · Agente comercial de voz",
  langAria: "Idioma",
  slidesNav: "Diapositivas",
  prevSlide: "Diapositiva anterior",
  nextSlide: "Siguiente diapositiva",
  resources: "Recursos",
  fullscreen: "Pantalla completa",
  close: "Cerrar",
  prev: "Anterior",
  next: "Siguiente",
  zoomOut: "Alejar",
  zoomIn: "Acercar",
  fit: "Encuadrar",
  panHint: "Arrastra para moverte · rueda para bajar · ⌘/Ctrl + rueda para zoom",
  viewing: "viendo",
  viewCode: "ver código",
  goTo: (label) => `Ir a ${label}`,
  slideAria: (n, total, label) => `${n} de ${total}: ${label}`,
  fullscreenAria: (alt) => `Ver en pantalla completa: ${alt}`,
  showN: (n) => `Mostrar ${n}`,
  galleryAria: (label) => `Galería · ${label}`,
  slideOf: (i, total) => `${i} de ${total}`,
  realCapture: (source) => `Captura real · ${source}`,
};

const chromeEn: DevFestCopy['chrome'] = {
  posts: "Posts",
  title: "DevFest Medellín 2026 · Commercial voice agent",
  langAria: "Language",
  slidesNav: "Slides",
  prevSlide: "Previous slide",
  nextSlide: "Next slide",
  resources: "Resources",
  fullscreen: "Fullscreen",
  close: "Close",
  prev: "Previous",
  next: "Next",
  zoomOut: "Zoom out",
  zoomIn: "Zoom in",
  fit: "Fit",
  panHint: "Drag to pan · scroll to move · ⌘/Ctrl + scroll to zoom",
  viewing: "viewing",
  viewCode: "view code",
  goTo: (label) => `Go to ${label}`,
  slideAria: (n, total, label) => `${n} of ${total}: ${label}`,
  fullscreenAria: (alt) => `View fullscreen: ${alt}`,
  showN: (n) => `Show ${n}`,
  galleryAria: (label) => `Gallery · ${label}`,
  slideOf: (i, total) => `${i} of ${total}`,
  realCapture: (source) => `Live capture · ${source}`,
};

const slidesEs: Record<string, string> = {
  inicio: "Inicio",
  "voz-para-todos": "Voz para todos",
  repo: "Repo",
  "quien-soy": "Quién soy",
  futuro: "El futuro",
  hoy: "Así se ven hoy",
  problema: "El problema",
  casos: "Casos reales",
  arquitectura: "Arquitectura",
  adk: "Google ADK",
  patrones: "Patrones",
  "que-es-livekit": "¿Qué es LiveKit?",
  livekit: "LiveKit",
  "livekit-costos": "Costos",
  "livekit-seguridad": "Seguridad",
  emocion: "Voz y emoción",
  "que-es-copilotkit": "¿Qué es CopilotKit?",
  copilotkit: "CopilotKit",
  tecnologias: "Tecnologías",
  "ai-design-framework": "Mi skill de diseño",
  "mood-board-ametoion": "mood board ametoion",
  "paso-a-paso": "Paso a paso",
  audiencia: "Audiencia"
};

const slidesEn: Record<string, string> = {
  inicio: "Start",
  "voz-para-todos": "Voice for everyone",
  repo: "Repo",
  "quien-soy": "About me",
  futuro: "The future",
  hoy: "How they look today",
  problema: "The problem",
  casos: "Real cases",
  arquitectura: "Architecture",
  adk: "Google ADK",
  patrones: "Patterns",
  "que-es-livekit": "What is LiveKit?",
  livekit: "LiveKit",
  "livekit-costos": "Costs",
  "livekit-seguridad": "Security",
  emocion: "Voice & emotion",
  "que-es-copilotkit": "What is CopilotKit?",
  copilotkit: "CopilotKit",
  tecnologias: "Stack",
  "ai-design-framework": "My design skill",
  "mood-board-ametoion": "mood board ametoion",
  "paso-a-paso": "Step by step",
  audiencia: "Audience"
};

const introEs = {
  aria: "Introducción",
  welcome: "Bienvenidos",
  event: "DevFest Medellín 2026 · GDG",
  kicker: "NoShy Concierge",
  hello: "Hola",
  sub: "Te ayudo a preparar una venta, o a resolver lo que tu empresa necesita.",
  skip: "Saltar intro"
};

const introEn = {
  aria: "Introduction",
  welcome: "Welcome",
  event: "DevFest Medellín 2026 · GDG",
  kicker: "NoShy Concierge",
  hello: "Hello",
  sub: "I help you prep a sale — or solve what your company needs.",
  skip: "Skip intro"
};

const hookEs = {
  title: "Agente comercial que",
  accent: "escucha, entiende y actúa.",
  lead: "Voz en tiempo real + UI generativa + herramientas reales. Construido con Google ADK, AG-UI, A2UI, CopilotKit y LiveKit.",
  demo: "Ver demo",
  code: "Código",
  byline: "Angel Arrieta · Frontend & UI agéntica"
};

const hookEn = {
  title: "A commercial agent that",
  accent: "listens, understands, and acts.",
  lead: "Realtime voice + generative UI + real tools. Built with Google ADK, AG-UI, A2UI, CopilotKit, and LiveKit.",
  demo: "See demo",
  code: "Code",
  byline: "Angel Arrieta · Frontend & agentic UI"
};

const peopleEs = {
  eyebrow: "01 · Para quién",
  title: "La voz deja hacer",
  accent: "lo de todos los días.",
  lead: "Recordatorios, llamadas, pedidos, preguntas. Lo básico de la vida diaria, con la interfaz que ya sabemos usar: hablar.",
  mediaAlt: "Persona usando la voz para hacer tareas cotidianas",
  items: [
    {
      who: "Un recordatorio",
      quote: "“Recuérdame la cita a las tres.”",
      body: "Lo de todos los días: agendar, recordar, no olvidar. Se pide hablando, sin abrir el calendario."
    },
    {
      who: "Una llamada",
      quote: "“Llama a mamá.”",
      body: "Contactar a alguien no debería ser buscar contactos y tocar tres pantallas. Es una frase."
    },
    {
      who: "Un pedido",
      quote: "“Pide el domicilio de siempre.”",
      body: "Compras, citas, preguntas del día a día. La voz deja hacer lo básico sin aprender menús."
    }
  ]
};

const peopleEn = {
  eyebrow: "01 · Who it’s for",
  title: "Voice gets everyday",
  accent: "things done.",
  lead: "Reminders, calls, orders, questions. Daily life basics — with the interface we already know: talking.",
  mediaAlt: "Someone using voice for everyday tasks",
  items: [
    {
      who: "A reminder",
      quote: "“Remind me about the appointment at three.”",
      body: "Everyday stuff: schedule, remember, don’t forget. Ask by speaking — no calendar to open."
    },
    {
      who: "A call",
      quote: "“Call mom.”",
      body: "Reaching someone shouldn’t mean hunting contacts and tapping three screens. It’s one sentence."
    },
    {
      who: "An order",
      quote: "“Order the usual delivery.”",
      body: "Purchases, appointments, daily questions. Voice handles the basics without learning menus."
    }
  ]
};

const repoEs = {
  eyebrow: "02.5 · Código abierto",
  title: "Escanea el repo.",
  accent: "Todo el código del agente.",
  lead: "Google ADK · LiveKit · CopilotKit · AG-UI. Quickstart en 5 minutos."
};

const repoEn = {
  eyebrow: "02.5 · Open source",
  title: "Scan the repo.",
  accent: "The full agent codebase.",
  lead: "Google ADK · LiveKit · CopilotKit · AG-UI. Quickstart in 5 minutes."
};

const whoEs = {
  eyebrow: "02.5 · Quién habla",
  title: "Soy Angel.",
  accent: "Frontend.",
  lead: "Desarrollador de software hace casi 7 años, especializado en frontend. Con mi propia agencia construyo productos con interfaz de voz, y he liderado el trabajo con negocios de wellness. Fundador de Visible Builders y organizador de The AI Hub, bilingüe, en Medellín.",
  yogaAlt: "Angel en postura de yoga"
};

const whoEn = {
  eyebrow: "02.5 · Who’s speaking",
  title: "I’m Angel.",
  accent: "Frontend.",
  lead: "Software developer for almost 7 years, focused on frontend. With my own agency I build voice-interface products, and I’ve led work with wellness businesses. Founder of Visible Builders and organizer of The AI Hub — bilingual, in Medellín.",
  yogaAlt: "Angel in a yoga pose"
};

const futureEs = {
  eyebrow: "03 · Hacia dónde vamos",
  title: "El futuro de las interfaces",
  accent: "¿Jarvis, lentes… o nada?",
  credits: "Video: “Rokid Glasses in 2025” — BooredAtWork (CC BY 4.0), vía Wikimedia Commons. Capturas: LiveKit Agents UI (docs.livekit.io) y CopilotKit AG-UI + A2UI (copilotkit.ai).",
  items: [
    {
      title: "¿Jarvis?",
      body: "Un asistente siempre presente que te escucha, entiende el contexto y actúa por ti.",
      alt: "Visualizador de voz Aura de LiveKit reaccionando al estado del agente"
    },
    {
      title: "¿Lentes?",
      body: "La UI flota sobre el mundo real: contexto visual + voz, sin sacar el teléfono.",
      alt: "Lentes inteligentes con interfaz de realidad aumentada"
    },
    {
      title: "¿Nada?",
      body: "La UI aparece solo cuando hace falta: el agente la genera, la usas y desaparece.",
      alt: "Un agente genera una tarjeta de vuelos con A2UI y CopilotKit la renderiza"
    }
  ]
};

const futureEn = {
  eyebrow: "03 · Where we’re headed",
  title: "The future of interfaces",
  accent: "Jarvis, glasses… or nothing?",
  credits: "Video: “Rokid Glasses in 2025” — BooredAtWork (CC BY 4.0), via Wikimedia Commons. Captures: LiveKit Agents UI (docs.livekit.io) and CopilotKit AG-UI + A2UI (copilotkit.ai).",
  items: [
    {
      title: "Jarvis?",
      body: "An always-on assistant that listens, gets context, and acts for you.",
      alt: "LiveKit Aura voice visualizer reacting to agent state"
    },
    {
      title: "Glasses?",
      body: "UI floats over the real world: visual context + voice, without pulling out your phone.",
      alt: "Smart glasses with an augmented-reality interface"
    },
    {
      title: "Nothing?",
      body: "UI shows up only when needed: the agent generates it, you use it, it disappears.",
      alt: "An agent generates a flights card with A2UI and CopilotKit renders it"
    }
  ]
};

const todayEs = {
  eyebrow: "03.1 · Esto ya existe",
  title: "Así se ven hoy",
  accent: "las interfaces de voz y UI generativa.",
  credits: "Capturas de gemini.google, elevenlabs.io y copilotkit.ai — © sus respectivos dueños, uso ilustrativo.",
  items: [
    {
      label: "Gemini Live · voz + cámara + apps",
      alt: "Gemini Live: conversación por voz que crea tareas y resúmenes en pantalla"
    },
    {
      label: "ElevenLabs Agents · chat y voz",
      alt: "Widget de agente conversacional de ElevenLabs"
    },
    {
      label: "CopilotKit · Generative UI sobre AG-UI",
      alt: "Diagrama de CopilotKit: el agente genera UI que viaja por AG-UI hasta la app"
    },
    {
      label: "CopilotKit · un agente, todos los canales (incluye Google ADK)",
      alt: "CopilotKit conecta frameworks de agentes como Google ADK con Web, iOS, Android, Slack, Teams y WhatsApp"
    }
  ]
};

const todayEn = {
  eyebrow: "03.1 · This already exists",
  title: "What voice & generative UI",
  accent: "look like today.",
  credits: "Captures from gemini.google, elevenlabs.io, and copilotkit.ai — © respective owners, illustrative use.",
  items: [
    {
      label: "Gemini Live · voice + camera + apps",
      alt: "Gemini Live: voice conversation that creates tasks and on-screen summaries"
    },
    {
      label: "ElevenLabs Agents · chat and voice",
      alt: "ElevenLabs conversational agent widget"
    },
    {
      label: "CopilotKit · Generative UI over AG-UI",
      alt: "CopilotKit diagram: the agent generates UI that travels over AG-UI into the app"
    },
    {
      label: "CopilotKit · one agent, every channel (includes Google ADK)",
      alt: "CopilotKit connects agent frameworks like Google ADK to Web, iOS, Android, Slack, Teams, and WhatsApp"
    }
  ]
};

const problemEs = {
  eyebrow: "05 · El problema",
  titleBefore: "Vender IA… ",
  titleAccent: "con IA.",
  caseA: {
    eyebrow: "Caso A · Consultoría",
    titleBefore: "Una empresa que construye con IA necesitaba ",
    titleAccent: "demostrarlo",
    titleAfter: " en vivo, no con slides.",
    body: "Cada comercial tenía su Excel. El agente centraliza la conversación y potencia al equipo."
  },
  caseB: {
    eyebrow: "Caso B · Mi comunidad",
    titleBefore: "Personas que ",
    titleAccent: "empiezan a vender",
    titleAfter: " y no saben mostrar su producto.",
    body: "Les cuesta el pitch y el seguimiento. La comunidad tiene el talento para cada necesidad."
  },
  combined: "Los combiné: un concierge comercial de voz.",
  funnel: "Discovery → propuesta → reunión → follow-up"
};

const problemEn = {
  eyebrow: "05 · The problem",
  titleBefore: "Selling AI… ",
  titleAccent: "with AI.",
  caseA: {
    eyebrow: "Case A · Consulting",
    titleBefore: "A company building with AI needed to ",
    titleAccent: "prove it",
    titleAfter: " live — not with slides.",
    body: "Every salesperson had their own spreadsheet. The agent centralizes the conversation and powers the team."
  },
  caseB: {
    eyebrow: "Case B · My community",
    titleBefore: "People who ",
    titleAccent: "are just starting to sell",
    titleAfter: " and don’t know how to show their product.",
    body: "Pitch and follow-up are hard. The community has the talent for every need."
  },
  combined: "I combined them: a commercial voice concierge.",
  funnel: "Discovery → proposal → meeting → follow-up"
};

const casesEs = {
  eyebrow: "05.1 · Casos reales",
  title: "Tres productos en producción.",
  accent: "Voz + AG-UI + UI generativa.",
  lead: "El mismo patrón, en productos que ya están en uso.",
  credits: "Pantalla de voz: agente comercial SETI. Galería Huella Digital: kiosco, stand y networking en Conexión Inteligente (SETI × Corficolombiana). Captura MCP Apps: demo Excalidraw, modelcontextprotocol/ext-apps.",
  items: [
    {
      title: "SETI",
      body: "Agente comercial de voz para uso interno: discovery por voz, propuesta generada como UI, reunión agendada y correo de seguimiento.",
      media: [
        {
          alt: "Agente de voz SETI escuchando: micrófono rojo y onda de audio"
        }
      ]
    },
    {
      title: "Huella Digital",
      client: "SETI × Corficolombiana",
      body: "Experiencia de IA para explorar el propio perfil digital, construida en IA y frontend con LiveKit, LangGraph y CopilotKit sobre AWS. En vivo con líderes y ejecutivos en Conexión Inteligente.",
      media: [
        {
          alt: "Kiosco de Huella Digital en Conexión Inteligente: una persona con audífonos frente a la pantalla del perfil",
          caption: "EN VIVO"
        },
        {
          alt: "Angel en el stand Tu Huella Digital durante Conexión Inteligente",
          caption: "EL STAND"
        },
        {
          alt: "Angel con un invitado en el stand de SETI durante Conexión Inteligente",
          caption: "CONEXIÓN INTELIGENTE"
        }
      ]
    },
    {
      title: "Chat MCP-UI para Copilot Enterprise",
      body: "Un agente en Microsoft Teams que consulta los recursos de toda la compañía y responde con componentes, no con párrafos.",
      media: [
        {
          alt: "MCP Apps renderizando una interfaz dentro del chat"
        }
      ]
    }
  ]
};

const casesEn = {
  eyebrow: "05.1 · Real cases",
  title: "Three products in production.",
  accent: "Voice + AG-UI + generative UI.",
  lead: "The same pattern — in products people already use.",
  credits: "Voice screen: SETI commercial agent. Huella Digital gallery: kiosk, booth, and networking at Conexión Inteligente (SETI × Corficolombiana). MCP Apps capture: Excalidraw demo, modelcontextprotocol/ext-apps.",
  items: [
    {
      title: "SETI",
      body: "Internal commercial voice agent: voice discovery, proposal generated as UI, meeting booked, and follow-up email.",
      media: [
        {
          alt: "SETI voice agent listening: red mic and audio waveform"
        }
      ]
    },
    {
      title: "Huella Digital",
      client: "SETI × Corficolombiana",
      body: "AI experience to explore your own digital footprint — built with LiveKit, LangGraph, and CopilotKit on AWS. Live with leaders and executives at Conexión Inteligente.",
      media: [
        {
          alt: "Huella Digital kiosk at Conexión Inteligente: someone with headphones at the profile screen",
          caption: "LIVE"
        },
        {
          alt: "Angel at the Tu Huella Digital booth during Conexión Inteligente",
          caption: "THE BOOTH"
        },
        {
          alt: "Angel with a guest at the SETI booth during Conexión Inteligente",
          caption: "CONEXIÓN INTELIGENTE"
        }
      ]
    },
    {
      title: "MCP-UI chat for Copilot Enterprise",
      body: "A Microsoft Teams agent that queries company-wide resources and answers with components — not paragraphs.",
      media: [
        {
          alt: "MCP Apps rendering an interface inside chat"
        }
      ]
    }
  ]
};

const architectureEs = {
  eyebrow: "06 · Arquitectura · Patrón “Orchestrator-workers” + “Augmented LLM” — Anthropic, Building effective agents",
  title: "LiveKit orquesta,",
  accent: "ADK piensa, CopilotKit muestra.",
  viewCanvas: "Ver canvas",
  viewShot: "Ver captura",
  diagramAlt: "Diagrama: Google ADK, A2UI, AG-UI, CopilotKit Runtime, app Next.js y LiveKit Voice",
  layers: {
    voz: "Voz",
    interfaz: "Interfaz",
    cerebro: "Cerebro"
  },
  nodeText: {
    custom: {
      eyebrow: "Pipeline",
      title: "LiveKit Custom",
      sub: "Voz por piezas: eliges cada proveedor."
    },
    cloud: {
      eyebrow: "Infra",
      title: "LiveKit Cloud",
      sub: "Audio en tiempo real, escalable."
    },
    voice: {
      eyebrow: "Voz",
      title: "LiveKit Voice",
      sub: "Conversa, entiende y decide cuándo consultar al cerebro.",
      badge: "Orquestador"
    },
    ck: {
      eyebrow: "Middleware",
      title: "CopilotKit Runtime",
      sub: "Renderiza según la respuesta de ADK + frontend tools.",
      badge: "Middleware"
    },
    app: {
      eyebrow: "Next.js",
      title: "App Client",
      sub: "La interfaz que ve el usuario, con las funciones de CopilotKit."
    },
    f4: {
      title: "Catálogo A2UI"
    },
    a2ui: {
      eyebrow: "Formato",
      title: "A2UI",
      sub: "UI declarativa como JSON."
    },
    adk: {
      eyebrow: "Backend",
      title: "Google ADK",
      sub: "LlmAgent · Gemini. Piensa y responde con texto + A2UI JSON.",
      badge: "Cerebro"
    },
    catalog: {
      eyebrow: "Catálogo A2UI",
      title: "Componentes permitidos",
      sub: "Lo único que el agente puede pintar."
    },
    com: {
      title: "Comunidad"
    },
    agent: {
      eyebrow: "Agent",
      title: "LLM + tools",
      sub: "Elige qué tool usar en cada turno."
    },
    t4: {
      title: "+ más tools"
    }
  },
  edgeLabels: {
    voz: "voz"
  }
};

const architectureEn = {
  eyebrow: "06 · Architecture · “Orchestrator-workers” + “Augmented LLM” pattern — Anthropic, Building effective agents",
  title: "LiveKit orchestrates,",
  accent: "ADK thinks, CopilotKit shows.",
  viewCanvas: "View canvas",
  viewShot: "View capture",
  diagramAlt: "Diagram: Google ADK, A2UI, AG-UI, CopilotKit Runtime, Next.js app, and LiveKit Voice",
  layers: {
    voz: "Voice",
    interfaz: "Interface",
    cerebro: "Brain"
  },
  nodeText: {
    custom: {
      eyebrow: "Pipeline",
      title: "LiveKit Custom",
      sub: "Voice in pieces: you pick each provider."
    },
    cloud: {
      eyebrow: "Infra",
      title: "LiveKit Cloud",
      sub: "Realtime audio, built to scale."
    },
    voice: {
      eyebrow: "Voice",
      title: "LiveKit Voice",
      sub: "Talks, understands, and decides when to ask the brain.",
      badge: "Orchestrator"
    },
    ck: {
      eyebrow: "Middleware",
      title: "CopilotKit Runtime",
      sub: "Renders from the ADK response + frontend tools.",
      badge: "Middleware"
    },
    app: {
      eyebrow: "Next.js",
      title: "App Client",
      sub: "The UI the user sees, powered by CopilotKit."
    },
    f4: {
      title: "A2UI catalog"
    },
    a2ui: {
      eyebrow: "Format",
      title: "A2UI",
      sub: "Declarative UI as JSON."
    },
    adk: {
      eyebrow: "Backend",
      title: "Google ADK",
      sub: "LlmAgent · Gemini. Thinks and replies with text + A2UI JSON.",
      badge: "Brain"
    },
    catalog: {
      eyebrow: "A2UI catalog",
      title: "Allowed components",
      sub: "The only things the agent can paint."
    },
    com: {
      title: "Community"
    },
    agent: {
      eyebrow: "Agent",
      title: "LLM + tools",
      sub: "Picks which tool to use each turn."
    },
    t4: {
      title: "+ more tools"
    }
  },
  edgeLabels: {
    voz: "voice"
  }
};

const adkEs = {
  eyebrow: "09 · Google ADK",
  title: "El asesor",
  accent: "que está en la llamada.",
  tablist: "Piezas de Google ADK",
  resources: [
    {
      label: "ADK · Integraciones",
      url: "https://adk.dev/integrations/"
    },
    {
      label: "ADK + AG-UI",
      url: "https://adk.dev/integrations/ag-ui/"
    },
    {
      label: "Runner",
      url: "https://adk.dev/api-reference/typescript/classes/Runner.html"
    },
    {
      label: "Event loop",
      url: "https://adk.dev/runtime/event-loop/"
    }
  ],
  parts: [
    {
      id: "agent",
      body: "Modelo + instrucciones + tools = el “cerebro”.",
      note: "Mismo constructor que en la doc de ADK para TypeScript: name, model, instruction y tools."
    },
    {
      id: "instruction",
      body: "Persona, reglas, límites, formato y ejemplos. El estado va al final.",
      note: "ADK pide objetivo, persona, restricciones, cuándo usar cada tool y el formato. En voz, Live API las ordena así. El contexto variable va al final para dejar un prefijo estable."
    },
    {
      id: "tool",
      body: "Hechos reales: productos, cotización, CRM, agenda.",
      note: "FunctionTool + Zod, como en la guía de tools: name, description, parameters y execute."
    },
    {
      id: "runner",
      body: "Orquesta usuario ↔ agente ↔ sesión ↔ eventos.",
      note: "El Runner carga la sesión, corre el agente y entrega cada Event. InMemoryRunner basta para probar en local."
    },
    {
      id: "sessions",
      body: "Cada turno, tool y resultado queda auditado.",
      note: "Cada yield es un evento: content, tool_call, tool_result o finished. ADK Web los muestra en vivo."
    }
  ]
};

const adkEn = {
  eyebrow: "09 · Google ADK",
  title: "The advisor",
  accent: "on the call.",
  tablist: "Google ADK building blocks",
  resources: [
    {
      label: "ADK · Integrations",
      url: "https://adk.dev/integrations/"
    },
    {
      label: "ADK + AG-UI",
      url: "https://adk.dev/integrations/ag-ui/"
    },
    {
      label: "Runner",
      url: "https://adk.dev/api-reference/typescript/classes/Runner.html"
    },
    {
      label: "Event loop",
      url: "https://adk.dev/runtime/event-loop/"
    }
  ],
  parts: [
    {
      id: "agent",
      body: "Model + instructions + tools = the “brain”.",
      note: "Same constructor as the ADK TypeScript docs: name, model, instruction, and tools."
    },
    {
      id: "instruction",
      body: "Persona, rules, limits, format, and examples. State goes last.",
      note: "ADK wants goal, persona, constraints, when to use each tool, and format. For voice, Live API orders them this way. Variable context goes last so the prefix stays cacheable."
    },
    {
      id: "tool",
      body: "Real facts: products, quotes, CRM, calendar.",
      note: "FunctionTool + Zod, as in the tools guide: name, description, parameters, and execute."
    },
    {
      id: "runner",
      body: "Orchestrates user ↔ agent ↔ session ↔ events.",
      note: "The Runner loads the session, runs the agent, and yields each Event. InMemoryRunner is enough for local testing."
    },
    {
      id: "sessions",
      body: "Every turn, tool, and result stays audited.",
      note: "Each yield is an event: content, tool_call, tool_result, or finished. ADK Web shows them live."
    }
  ]
};

const productIntrosEs = {
  livekit: {
    eyebrow: "10 · ¿Qué es LiveKit?",
    lead: "Framework open source + plataforma para construir, desplegar, escalar y observar agentes en producción.",
    points: [
      "Millones de llamadas concurrentes",
      "Detección de turnos e interrupciones",
      "LiveKit Cloud"
    ],
    shotAlt: "Inicio de LiveKit: Build voice, video, and physical AI agents"
  },
  copilotkit: {
    eyebrow: "12 · ¿Qué es CopilotKit?",
    lead: "Apps agénticas que aprenden de cada interacción. Self-hostable y hechas para escalar con tu organización.",
    points: [
      "Web · iOS · Android",
      "Slack · Teams · WhatsApp",
      "Google ADK, LangGraph…"
    ],
    shotAlt: "CopilotKit conecta agentes como Google ADK con Web, iOS, Android, Slack, Teams y WhatsApp"
  },
  anthropic: {
    eyebrow: "09.1 · Patrones de agentes",
    lead: "La guía de Anthropic: patrones simples y componibles (Augmented LLM, routing, orchestrator-workers…) en vez de frameworks complejos. Es el mapa mental detrás de nuestra arquitectura.",
    points: [
      "Augmented LLM",
      "Orchestrator-workers",
      "Evaluator-optimizer"
    ],
    shotAlt: "Artículo de Anthropic: Building effective agents — portada y tabla de contenidos"
  }
};

const productIntrosEn = {
  livekit: {
    eyebrow: "10 · What is LiveKit?",
    lead: "Open-source framework + platform to build, deploy, scale, and observe agents in production.",
    points: [
      "Millions of concurrent calls",
      "Turn detection & barge-in",
      "LiveKit Cloud"
    ],
    shotAlt: "LiveKit homepage: Build voice, video, and physical AI agents"
  },
  copilotkit: {
    eyebrow: "12 · What is CopilotKit?",
    lead: "Agentic apps that learn from every interaction. Self-hostable and built to scale with your org.",
    points: [
      "Web · iOS · Android",
      "Slack · Teams · WhatsApp",
      "Google ADK, LangGraph…"
    ],
    shotAlt: "CopilotKit connects agents like Google ADK to Web, iOS, Android, Slack, Teams, and WhatsApp"
  },
  anthropic: {
    eyebrow: "09.1 · Agent patterns",
    lead: "Anthropic’s guide: simple, composable patterns (Augmented LLM, routing, orchestrator-workers…) instead of complex frameworks. It’s the mental model behind our architecture.",
    points: [
      "Augmented LLM",
      "Orchestrator-workers",
      "Evaluator-optimizer"
    ],
    shotAlt: "Anthropic article: Building effective agents — cover and table of contents"
  }
};

const livekitEs = {
  eyebrow: "10 · LiveKit",
  title: "La llamada telefónica.",
  accent: "ADK es el asesor en ella.",
  tablist: "Piezas de LiveKit",
  resources: [
    {
      label: "LiveKit · Overview",
      url: "https://docs.livekit.io/intro/overview/"
    },
    {
      label: "AgentSession",
      url: "https://docs.livekit.io/agents/logic/sessions/"
    },
    {
      label: "Jobs",
      url: "https://docs.livekit.io/agents/server/job/"
    },
    {
      label: "Prompting guide",
      url: "https://docs.livekit.io/agents/start/prompting/"
    },
    {
      label: "ADK + LiveKit",
      url: "https://adk.dev/integrations/livekit/"
    }
  ],
  parts: [
    {
      id: "room",
      body: "Espacio virtual donde viven usuario y agente.",
      note: "El worker entra al room con ctx.connect(). LiveKit lleva el WebRTC, los permisos y la observabilidad."
    },
    {
      id: "participant",
      body: "El agente es un participante más, no un “bot aparte”.",
      note: "Quien llama y el agente son participantes del mismo room. El RPC sale del participante local hacia el del navegador."
    },
    {
      id: "tracks",
      body: "Audio (y video / data) en tiempo real.",
      note: "Cada participante publica tracks. El micrófono del usuario entra como audio; session.say publica la voz del agente."
    },
    {
      id: "worker",
      body: "Proceso que se une al room, escucha y responde.",
      note: "AgentServer espera un job y despacha la sesión. En local: python agent.py dev."
    },
    {
      id: "session",
      body: "Une STT, LLM, TTS, turnos e interrupciones en un solo objeto.",
      note: "Pipeline (STT → LLM → TTS) cuando quieres elegir la voz. Realtime cuando un solo modelo escucha y habla."
    },
    {
      id: "instructions",
      body: "Identity → output → flow → tools → guardrails → user info. Markdown, como en ADK.",
      note: "Misma lógica que ADK instruction.ts, con el vocabulario de LiveKit. Los detalles de cada tool viven en su definición; el prompt solo dice cuándo y cómo hablar el resultado. Datos del usuario al final."
    }
  ]
};

const livekitEn = {
  eyebrow: "10 · LiveKit",
  title: "The phone call.",
  accent: "ADK is the advisor on it.",
  tablist: "LiveKit building blocks",
  resources: [
    {
      label: "LiveKit · Overview",
      url: "https://docs.livekit.io/intro/overview/"
    },
    {
      label: "AgentSession",
      url: "https://docs.livekit.io/agents/logic/sessions/"
    },
    {
      label: "Jobs",
      url: "https://docs.livekit.io/agents/server/job/"
    },
    {
      label: "Prompting guide",
      url: "https://docs.livekit.io/agents/start/prompting/"
    },
    {
      label: "ADK + LiveKit",
      url: "https://adk.dev/integrations/livekit/"
    }
  ],
  parts: [
    {
      id: "room",
      body: "Virtual space where user and agent live.",
      note: "The worker joins the room with ctx.connect(). LiveKit handles WebRTC, permissions, and observability."
    },
    {
      id: "participant",
      body: "The agent is just another participant — not a “bot on the side”.",
      note: "Caller and agent are participants in the same room. RPC goes from the local participant to the browser one."
    },
    {
      id: "tracks",
      body: "Realtime audio (and video / data).",
      note: "Each participant publishes tracks. The user’s mic arrives as audio; session.say publishes the agent’s voice."
    },
    {
      id: "worker",
      body: "Process that joins the room, listens, and replies.",
      note: "AgentServer waits for a job and dispatches the session. Locally: python agent.py dev."
    },
    {
      id: "session",
      body: "STT, LLM, TTS, turns, and barge-in in one object.",
      note: "Pipeline (STT → LLM → TTS) when you want to pick the voice. Realtime when one model listens and speaks."
    },
    {
      id: "instructions",
      body: "Identity → output → flow → tools → guardrails → user info. Markdown, like ADK.",
      note: "Same logic as ADK instruction.ts, with LiveKit vocabulary. Tool details live in their definitions; the prompt only says when and how to speak the result. User data last."
    }
  ]
};

const costsEs = {
  perSessionSuffix: "/ sesión",
  allIn: "por sesión (todo incluido)",
  times100: "× 100 sesiones",
  plansEyebrow: "Planes LiveKit Cloud",
  metering: [
    {
      label: "Sesión de agente",
      note: "Agente conectado al room"
    },
    {
      label: "Room · WebRTC",
      note: "Usuario entra al room (Ship)"
    },
    {
      label: "Join → agente",
      note: "Agente + WebRTC (sin modelo)"
    }
  ],
  options: [
    {
      bills: "1 factura · LiveKit (agente + room + Inference)"
    },
    {
      bills: "2 facturas · LiveKit + ElevenLabs"
    }
  ]
};

const costsEn = {
  perSessionSuffix: "/ session",
  allIn: "per session (all-in)",
  times100: "× 100 sessions",
  plansEyebrow: "LiveKit Cloud plans",
  metering: [
    {
      label: "Agent session",
      note: "Agent connected to the room"
    },
    {
      label: "Room · WebRTC",
      note: "User joins the room (Ship)"
    },
    {
      label: "Join → agent",
      note: "Agent + WebRTC (no model)"
    }
  ],
  options: [
    {
      bills: "1 bill · LiveKit (agent + room + Inference)"
    },
    {
      bills: "2 bills · LiveKit + ElevenLabs"
    }
  ]
};

const securityEs = {
  eyebrow: "10.2 · LiveKit · Seguridad",
  title: "Seguro por defecto.",
  accent: "Datos que sí sirven.",
  dataLabel: "Recolección de datos:",
  dataBody: " grabación, transcripción y trazas de cada sesión → el equipo comercial ve qué preguntó el cliente y recibe feedback al instante.",
  points: [
    {
      title: "Cifrado extremo a extremo",
      body: "Audio y datos cifrados en tránsito.",
      plan: "Todos los planes"
    },
    {
      title: "Zero data retention",
      body: "La inferencia no guarda ni entrena con tu audio o tus prompts.",
      plan: "Todos los planes"
    },
    {
      title: "Redacción de PII",
      body: "Las transcripciones se limpian antes de guardarse.",
      plan: "Observabilidad"
    },
    {
      title: "SOC 2 Type II · pentest",
      body: "Reportes de seguridad para tu equipo legal.",
      plan: "Scale"
    },
    {
      title: "HIPAA · DPA",
      body: "HIPAA para salud; DPA estándar para todos.",
      plan: "Scale · todos"
    },
    {
      title: "Region pinning · roles · SSO",
      body: "Los datos se quedan en tu región y con tu gente.",
      plan: "Scale · Enterprise"
    }
  ]
};

const securityEn = {
  eyebrow: "10.2 · LiveKit · Security",
  title: "Secure by default.",
  accent: "Data that actually helps.",
  dataLabel: "Data collection:",
  dataBody: " recording, transcription, and traces per session → sales sees what the customer asked and gets feedback instantly.",
  points: [
    {
      title: "End-to-end encryption",
      body: "Audio and data encrypted in transit.",
      plan: "All plans"
    },
    {
      title: "Zero data retention",
      body: "Inference doesn’t store or train on your audio or prompts.",
      plan: "All plans"
    },
    {
      title: "PII redaction",
      body: "Transcripts are cleaned before they’re stored.",
      plan: "Observability"
    },
    {
      title: "SOC 2 Type II · pentest",
      body: "Security reports for your legal team.",
      plan: "Scale"
    },
    {
      title: "HIPAA · DPA",
      body: "HIPAA for healthcare; standard DPA for everyone.",
      plan: "Scale · all"
    },
    {
      title: "Region pinning · roles · SSO",
      body: "Data stays in your region and with your people.",
      plan: "Scale · Enterprise"
    }
  ]
};

const emotionEs = {
  eyebrow: "11 · Voz y emoción",
  title: "Dos formas de hablar.",
  accent: "Pipeline o realtime.",
  serLabel: "SER.",
  ser: " Estima la emoción expresada: enojo, tristeza, alegría o neutral. No el estado interno.",
  hoyLabel: "Hoy.",
  hoy: " wav2vec 2.0 aprende la onda, auto-supervisado. Un clasificador supervisado pone la etiqueta.",
  tiempoLabel: "Tiempo.",
  tiempo: " Ventanas de unos segundos se juntan en la emoción de la conversación.",
  flows: [
    {
      id: "pipeline",
      summary: "Tres piezas. Más control. La emoción entra en el TTS.",
      stepNames: [
        "Tú",
        "STT",
        "LLM",
        "TTS"
      ]
    },
    {
      id: "realtime",
      summary: "Un modelo escucha y habla. La emoción va en el audio.",
      stepNames: [
        "Tú",
        "Modelo",
        "Voz"
      ]
    }
  ]
};

const emotionEn = {
  eyebrow: "11 · Voice & emotion",
  title: "Two ways to speak.",
  accent: "Pipeline or realtime.",
  serLabel: "SER.",
  ser: " Estimates expressed emotion: anger, sadness, joy, or neutral — not inner state.",
  hoyLabel: "Today.",
  hoy: " wav2vec 2.0 learns the waveform, self-supervised. A supervised classifier applies the label.",
  tiempoLabel: "Time.",
  tiempo: " Windows of a few seconds roll up into the conversation’s emotion.",
  flows: [
    {
      id: "pipeline",
      summary: "Three pieces. More control. Emotion lands in the TTS.",
      stepNames: [
        "You",
        "STT",
        "LLM",
        "TTS"
      ]
    },
    {
      id: "realtime",
      summary: "One model listens and speaks. Emotion rides in the audio.",
      stepNames: [
        "You",
        "Model",
        "Voice"
      ]
    }
  ]
};

const copilotkitEs = {
  eyebrow: "12 · CopilotKit + AG-UI",
  title: "El puente",
  accent: "entre el agente y la interfaz.",
  tablist: "Conceptos de CopilotKit",
  jsonEvents: "{ } Eventos JSON",
  channels: "Canales",
  resources: [
    {
      label: "AG-UI",
      url: "https://www.copilotkit.ai/ag-ui"
    },
    {
      label: "Dojo · demos en vivo",
      url: "https://dojo.ag-ui.com/"
    },
    {
      label: "Docs",
      url: "https://docs.copilotkit.ai/"
    },
    {
      label: "Build with agents",
      url: "https://docs.copilotkit.ai/build-with-agents"
    }
  ],
  concepts: [
    {
      term: "AG-UI protocol",
      body: "Eventos SSE entre tu app y cualquier agente: mensajes, tool calls, state y lifecycle.",
      note: "El bridge traduce cada evento de ADK a un evento AG-UI por SSE. CopilotKit los consume igual venga de ADK, LangGraph u otro runtime."
    },
    {
      term: "CopilotRuntime + shared state",
      body: "Middleware frontend ↔ agente (aquí, ADK vía @ag-ui/adk). Chat y app leen y escriben el mismo estado.",
      note: "CopilotRuntime vive en Next.js. El agente default es ADKAgent apuntando a /ag-ui, y a2ui deja pasar el estado compartido."
    },
    {
      term: "Tool rendering",
      body: "toolCallName → componente React. El mismo resultado, como texto y como tarjeta.",
      note: "useRenderTool engancha el nombre de la tool. Mientras corre, skeleton; al terminar, la tarjeta."
    },
    {
      term: "Frontend tools",
      body: "Acciones que el agente dispara en el navegador (useFrontendTool): abrir el calendario y ofrecer horarios.",
      note: "useFrontendTool corre en el navegador. El agente llama open_calendar y el handler abre los horarios de Bogotá."
    },
    {
      term: "Generative UI",
      body: "Display-only (solo muestra) vs. interactiva (el usuario responde y el agente continúa).",
      note: "La UI generativa viaja como ACTIVITY_SNAPSHOT. El catálogo de la app dibuja la tarjeta y el usuario puede aprobar.",
      shotLabels: [
        "Display-only · A2UI",
        "Interactiva · human-in-the-loop"
      ]
    }
  ]
};

const copilotkitEn = {
  eyebrow: "12 · CopilotKit + AG-UI",
  title: "The bridge",
  accent: "between agent and UI.",
  tablist: "CopilotKit concepts",
  jsonEvents: "{ } JSON events",
  channels: "Channels",
  resources: [
    {
      label: "AG-UI",
      url: "https://www.copilotkit.ai/ag-ui"
    },
    {
      label: "Dojo · live demos",
      url: "https://dojo.ag-ui.com/"
    },
    {
      label: "Docs",
      url: "https://docs.copilotkit.ai/"
    },
    {
      label: "Build with agents",
      url: "https://docs.copilotkit.ai/build-with-agents"
    }
  ],
  concepts: [
    {
      term: "AG-UI protocol",
      body: "SSE events between your app and any agent: messages, tool calls, state, and lifecycle.",
      note: "The bridge maps each ADK event to an AG-UI SSE event. CopilotKit consumes them the same whether they come from ADK, LangGraph, or another runtime."
    },
    {
      term: "CopilotRuntime + shared state",
      body: "Frontend ↔ agent middleware (here, ADK via @ag-ui/adk). Chat and app read and write the same state.",
      note: "CopilotRuntime lives in Next.js. The default agent is ADKAgent pointing at /ag-ui, and a2ui lets shared state through."
    },
    {
      term: "Tool rendering",
      body: "toolCallName → React component. Same result as text and as a card.",
      note: "useRenderTool hooks the tool name. While it runs, a skeleton; when done, the card."
    },
    {
      term: "Frontend tools",
      body: "Actions the agent fires in the browser (useFrontendTool): open the calendar and offer slots.",
      note: "useFrontendTool runs in the browser. The agent calls open_calendar and the handler opens Bogotá time slots."
    },
    {
      term: "Generative UI",
      body: "Display-only (just shows) vs interactive (user responds and the agent continues).",
      note: "Generative UI travels as ACTIVITY_SNAPSHOT. The app catalog draws the card and the user can approve.",
      shotLabels: [
        "Display-only · A2UI",
        "Interactive · human-in-the-loop"
      ]
    }
  ]
};

const stackEs: DevFestCopy['stack'] = {
  eyebrow: "14 · Tecnologías",
  title: "Lo que uso hoy",
  accent: "para construir agentes de voz.",
  groups: [
    {
      group: "Agente",
      itemNotes: {
        Qwen: "modelo local"
      }
    },
    {
      group: "Voz",
      itemNotes: {
        Chatterbox: "Resemble AI",
        "Google Realtime": "Gemini Live"
      }
    },
    {
      group: "UI agéntica"
    },
    {
      group: "Motion y diseño"
    },
    {
      group: "Flujo de trabajo",
      itemNotes: {
        "ADK Web": "dev UI"
      }
    },
    {
      group: "Lenguajes"
    }
  ]
};

const stackEn: DevFestCopy['stack'] = {
  eyebrow: "14 · Stack",
  title: "What I use today",
  accent: "to build voice agents.",
  groups: [
    {
      group: "Agent",
      itemNotes: {
        Qwen: "local model"
      }
    },
    {
      group: "Voice",
      itemNotes: {
        Chatterbox: "Resemble AI",
        "Google Realtime": "Gemini Live"
      }
    },
    {
      group: "Agentic UI"
    },
    {
      group: "Motion & design"
    },
    {
      group: "Workflow",
      itemNotes: {
        "ADK Web": "dev UI"
      }
    },
    {
      group: "Languages"
    }
  ]
};

const skillEs = {
  eyebrow: "14.1 · Mi skill · AI Design Framework",
  title: "De pins de Pinterest",
  accent: "a código que funciona.",
  youPill: "Tú: pegar links + aprobar 2 veces",
  edgeLabels: {
    top5: "top 5 aprobado",
    proposal: "propuesta aprobada"
  },
  nodeText: {
    s1: {
      eyebrow: "01 · Tú · ~1 min",
      title: "Pegas los pins",
      sub: "Brief + stack + 10–15 links de Pinterest.",
      badge: "Tú"
    },
    brief: {
      title: "brief: calma, premium"
    },
    links: {
      title: "10–15 links de Pinterest"
    },
    s2: {
      eyebrow: "02 · Auto · ~1 min",
      title: "Recolecta",
      sub: "Descarga los pins, extrae colores y escribe el alma del proyecto."
    },
    colors: {
      title: "Colores por imagen"
    },
    skip: {
      title: "Pin privado → se salta"
    },
    s3: {
      eyebrow: "03 · Se detiene ⏸",
      title: "Califica",
      sub: "Top 5 de 14 pins según el brief. Rechaza lo que no encaja.",
      badge: "Tú eliges"
    },
    c1: {
      title: "Jerarquía"
    },
    c4: {
      title: "Tipografía"
    },
    c5: {
      title: "Originalidad"
    },
    r1: {
      title: "“ok, reemplaza 4 por 9”"
    },
    s4: {
      eyebrow: "04 · Auto",
      title: "Mood board",
      sub: "Una página para mostrarle al cliente."
    },
    m1: {
      title: "5 imágenes"
    },
    m2: {
      title: "Paleta de color"
    },
    m3: {
      title: "Fuentes sugeridas"
    },
    s5: {
      eyebrow: "05 · Se detiene ⏸",
      title: "Propuesta",
      sub: "Dirección “Tidal Calm”: arena + teal profundo, mucho espacio.",
      badge: "Tú apruebas"
    },
    p1: {
      title: "Tokens de color"
    },
    p4: {
      title: "Motion = respiración"
    },
    p5: {
      title: "Interacciones"
    },
    p6: {
      title: "Accesibilidad · reduced motion"
    },
    r2: {
      title: "“acento más cálido, aprobado”"
    },
    s6: {
      eyebrow: "06 · Auto · ~10–20 min",
      title: "Construye",
      sub: "Código real en tu proyecto, listo para npm run dev."
    },
    b5: {
      title: "Check responsive"
    }
  }
};

const skillEn = {
  eyebrow: "14.1 · My skill · AI Design Framework",
  title: "From Pinterest pins",
  accent: "to working code.",
  youPill: "You: paste links + approve twice",
  edgeLabels: {
    top5: "top 5 approved",
    proposal: "proposal approved"
  },
  nodeText: {
    s1: {
      eyebrow: "01 · You · ~1 min",
      title: "Paste the pins",
      sub: "Brief + stack + 10–15 Pinterest links.",
      badge: "You"
    },
    brief: {
      title: "brief: calm, premium"
    },
    links: {
      title: "10–15 Pinterest links"
    },
    s2: {
      eyebrow: "02 · Auto · ~1 min",
      title: "Collect",
      sub: "Downloads pins, extracts colors, writes the project’s soul."
    },
    colors: {
      title: "Colors per image"
    },
    skip: {
      title: "Private pin → skipped"
    },
    s3: {
      eyebrow: "03 · Pauses ⏸",
      title: "Score",
      sub: "Top 5 of 14 pins vs the brief. Rejects what doesn’t fit.",
      badge: "You choose"
    },
    c1: {
      title: "Hierarchy"
    },
    c4: {
      title: "Typography"
    },
    c5: {
      title: "Originality"
    },
    r1: {
      title: "“ok, swap 4 for 9”"
    },
    s4: {
      eyebrow: "04 · Auto",
      title: "Mood board",
      sub: "One page to show the client."
    },
    m1: {
      title: "5 images"
    },
    m2: {
      title: "Color palette"
    },
    m3: {
      title: "Suggested fonts"
    },
    s5: {
      eyebrow: "05 · Pauses ⏸",
      title: "Proposal",
      sub: "“Tidal Calm” direction: sand + deep teal, lots of air.",
      badge: "You approve"
    },
    p1: {
      title: "Color tokens"
    },
    p4: {
      title: "Motion = breath"
    },
    p5: {
      title: "Interactions"
    },
    p6: {
      title: "Accessibility · reduced motion"
    },
    r2: {
      title: "“warmer accent, approved”"
    },
    s6: {
      eyebrow: "06 · Auto · ~10–20 min",
      title: "Build",
      sub: "Real code in your project, ready for npm run dev."
    },
    b5: {
      title: "Responsive check"
    }
  }
};

const moodboardEs = {
  eyebrow: "14.2 · Output del skill",
  title: "mood board ametoion",
  alt: "Mood board ametoion — collage editorial de spreads de moda"
};

const moodboardEn = {
  eyebrow: "14.2 · Skill output",
  title: "mood board ametoion",
  alt: "Mood board ametoion — editorial collage of fashion spreads"
};

const stepsEs = {
  eyebrow: "15 · Constrúyelo tú",
  title: "Siete pasos",
  accent: "para tu propio agente de voz.",
  allCode: "Todo el código",
  quickstart: "Quickstart en 5 minutos · docs/guides",
  items: [
    {
      t: "Crea el agente ADK",
      b: "LlmAgent con instrucción en español y tus primeras tools con Zod.",
      linkLabel: "adk.dev"
    },
    {
      t: "Pruébalo en ADK Web",
      b: "npx adk web: chat, eventos y estado antes de tocar el frontend.",
      linkLabel: "Guía ADK"
    },
    {
      t: "Expónlo por AG-UI",
      b: "Servidor con @ag-ui/adk para que el frontend reciba eventos SSE.",
      linkLabel: "ADK + AG-UI"
    },
    {
      t: "Conecta CopilotKit",
      b: "CopilotRuntime en /api/copilotkit + useRenderTool por cada tool visible.",
      linkLabel: "Guía CopilotKit"
    },
    {
      t: "Agrega UI generativa",
      b: "Catálogo A2UI propio: plan, tarjetas de comunidad, aprobación humana.",
      linkLabel: "A2UI"
    },
    {
      t: "Suma la voz con LiveKit",
      b: "Worker Python con AgentSession; habla con la app por RPC.",
      linkLabel: "Guía LiveKit"
    },
    {
      t: "Despliega",
      b: "Agente en Cloud Run, web en Vercel, voz en LiveKit Cloud.",
      linkLabel: "Guía deploy"
    }
  ]
};

const stepsEn = {
  eyebrow: "15 · Build it yourself",
  title: "Seven steps",
  accent: "to your own voice agent.",
  allCode: "All the code",
  quickstart: "5-minute quickstart · docs/guides",
  items: [
    {
      t: "Create the ADK agent",
      b: "LlmAgent with Spanish instructions and your first Zod tools.",
      linkLabel: "adk.dev"
    },
    {
      t: "Try it in ADK Web",
      b: "npx adk web: chat, events, and state before touching the frontend.",
      linkLabel: "ADK guide"
    },
    {
      t: "Expose it via AG-UI",
      b: "Server with @ag-ui/adk so the frontend gets SSE events.",
      linkLabel: "ADK + AG-UI"
    },
    {
      t: "Connect CopilotKit",
      b: "CopilotRuntime at /api/copilotkit + useRenderTool for each visible tool.",
      linkLabel: "CopilotKit guide"
    },
    {
      t: "Add generative UI",
      b: "Your own A2UI catalog: plan, community cards, human approval.",
      linkLabel: "A2UI"
    },
    {
      t: "Add voice with LiveKit",
      b: "Python worker with AgentSession; talks to the app over RPC.",
      linkLabel: "LiveKit guide"
    },
    {
      t: "Deploy",
      b: "Agent on Cloud Run, web on Vercel, voice on LiveKit Cloud.",
      linkLabel: "Deploy guide"
    }
  ]
};

const audienceEs = {
  eyebrow: "16 · Tu turno",
  title: "Gracias.",
  accent: "No tengas miedo de aparecer.",
  lead: "Muéstrate. El trabajo ya está. Falta que te vean. Escanea para conocer el trabajo y las comunidades.",
  siteSub: "Sitio y trabajo",
  communities: "Comunidades",
  communitiesSub: "Visible Builders · AI Hub",
  photoAlt: "Angel Arrieta"
};

const audienceEn = {
  eyebrow: "16 · Your turn",
  title: "Thank you.",
  accent: "Don’t be afraid to show up.",
  lead: "Show yourself. The work is done — people just need to see you. Scan to explore the work and the communities.",
  siteSub: "Site & work",
  communities: "Communities",
  communitiesSub: "Visible Builders · AI Hub",
  photoAlt: "Angel Arrieta"
};

export const devfestCopy: Record<DevFestLang, DevFestCopy> = {
  es: {
    chrome: chromeEs,
    slides: slidesEs,
    intro: introEs,
    hook: hookEs,
    people: peopleEs,
    repo: repoEs,
    who: whoEs,
    future: futureEs,
    today: todayEs,
    problem: problemEs,
    cases: casesEs,
    architecture: architectureEs,
    adk: adkEs,
    productIntros: productIntrosEs,
    livekit: livekitEs,
    costs: costsEs,
    security: securityEs,
    emotion: emotionEs,
    copilotkit: copilotkitEs,
    stack: stackEs,
    skill: skillEs,
    moodboard: moodboardEs,
    steps: stepsEs,
    audience: audienceEs,
  },
  en: {
    chrome: chromeEn,
    slides: slidesEn,
    intro: introEn,
    hook: hookEn,
    people: peopleEn,
    repo: repoEn,
    who: whoEn,
    future: futureEn,
    today: todayEn,
    problem: problemEn,
    cases: casesEn,
    architecture: architectureEn,
    adk: adkEn,
    productIntros: productIntrosEn,
    livekit: livekitEn,
    costs: costsEn,
    security: securityEn,
    emotion: emotionEn,
    copilotkit: copilotkitEn,
    stack: stackEn,
    skill: skillEn,
    moodboard: moodboardEn,
    steps: stepsEn,
    audience: audienceEn,
  },
};
