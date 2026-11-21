export type WorkshopLang = "es" | "en";

export const WORKSHOP_LANG_KEY = "am-workshop-lang";

type Row = { t: string; title: string; d?: string };

export type WorkshopCopy = {
  langLabel: string;
  bar: { name: string; when: string; cta: string };
  eyebrow: string;
  title: string;
  titleAccent: string;
  date: string;
  lead: string;
  body: string;
  heroCta: string;
  leaveTitle: string;
  leave: [string, string][];
  flowTitle: string;
  flow: Row[];
  forTitle: string;
  forLead: string;
  audience: string[];
  bringTitle: string;
  bring: string[];
  seatTitle: string;
  seatLead: string;
  facts: [string, string][];
  form: {
    name: string;
    namePlaceholder: string;
    nameError: string;
    phone: string;
    phoneError: string;
    role: string;
    rolePlaceholder: string;
    roles: string[];
    submit: string;
    sent: string;
    fine: string;
    notOpened: string;
    openLink: string;
    message: (v: { name: string; phone: string; role: string }) => string;
  };
  mobileCta: string;
};

export const workshopCopy: Record<WorkshopLang, WorkshopCopy> = {
  es: {
    langLabel: "Idioma",
    bar: { name: "TALLER DE AGENTES DE VOZ CON IA", when: "SÁB 28 NOV · 1:30–5:30 PM · MEDELLÍN", cta: "Reserva tu cupo" },
    eyebrow: "TALLER PRÁCTICO · CLAUDE + ELEVENLABS · SIN CÓDIGO",
    title: "MÁS CLIENTES",
    titleAccent: "CON IA",
    date: "SÁBADO 28 DE NOVIEMBRE · 1:30 PM – 5:30 PM · MEDELLÍN",
    lead: "Una tarde. Tu página, tu propia voz con IA, un asistente que atiende a tus clientes y contenido para tus redes.",
    body: "Sin código. Trae tu portátil y tu negocio. Usamos Claude y ElevenLabs para crear tu contenido de redes, tu página y tu asistente. A las 5:30 sales con todo publicado y listo para usar.",
    heroCta: "Reserva tu cupo →",
    leaveTitle: "Con qué sales",
    leave: [
      ["Contenido para tus redes", "Plan de 30 días con hooks, guiones y textos para Instagram, TikTok y LinkedIn, hechos con Claude."],
      ["Una landing publicada", "Creada con Claude, lista para móvil, con tu enlace."],
      ["Captación de clientes", "Formulario, botón de WhatsApp, preguntas frecuentes y agenda."],
      ["Tu propia voz con IA", "Creada en ElevenLabs, para la voz en off de tus Reels, anuncios y cursos."],
      ["Un asistente de voz", "Responde a tus visitantes con tu voz y guarda sus datos."],
      ["Plan para los próximos 30 días", "Qué publicar, probar y mejorar después del sábado."],
    ],
    flowTitle: "Cómo es la tarde",
    flow: [
      { t: "1:30", title: "Contenido", d: "Tu cliente ideal, tu oferta y 30 días de contenido para tus redes con Claude." },
      { t: "2:30", title: "Construye", d: "Tu landing creada con Claude, con formulario, WhatsApp y agenda." },
      { t: "3:15", title: "Descanso · 15 min" },
      { t: "3:30", title: "Voz", d: "Tu voz de marca y un asistente que la usa, integrado en tu página." },
      { t: "4:50", title: "Publica", d: "Publica, muestra lo que construiste y sal con tu plan." },
    ],
    forTitle: "Para quién es",
    forLead: "Para quien vende algo y quiere más clientes sin aprender a programar.",
    audience: [
      "Emprendedores",
      "Creadores de contenido",
      "Coaches y cursos",
      "Marketers",
      "Clínicas y bienestar",
      "Inmobiliarias",
      "Restaurantes y hoteles",
    ],
    bringTitle: "Trae",
    bring: [
      "Portátil + cargador, y audífonos",
      "Cuentas de Claude y ElevenLabs",
      "Una grabación de voz de 2 minutos (te enviamos el guion por WhatsApp)",
      "Tu oferta, 5–10 preguntas frecuentes de tus clientes y tu WhatsApp",
    ],
    seatTitle: "Reserva tu cupo",
    seatLead:
      "Los cupos son limitados para que todos reciban ayuda. Envía esto y te respondo por WhatsApp con el precio, la dirección y la lista de preparación.",
    facts: [
      ["CUÁNDO", "Sáb 28 Nov · 1:30–5:30 PM"],
      ["DÓNDE", "Cowork privado · Medellín"],
      ["NIVEL", "Para principiantes · sin código"],
    ],
    form: {
      name: "NOMBRE",
      namePlaceholder: "Tu nombre",
      nameError: "Escribe tu nombre",
      phone: "WHATSAPP",
      phoneError: "Escribe un número de WhatsApp",
      role: "¿A QUÉ TE DEDICAS?",
      rolePlaceholder: "Elige una (opcional)",
      roles: [
        "Emprendedor / pequeño negocio",
        "Creador de contenido",
        "Coach o creador de cursos",
        "Marketer / agencia",
        "Clínica o bienestar",
        "Inmobiliaria",
        "Restaurante u hotel",
        "Otro",
      ],
      submit: "Reservar mi cupo por WhatsApp",
      sent: "Enviado a WhatsApp ✓",
      fine: "Abre WhatsApp con tu mensaje listo para enviar. Aún no pagas nada.",
      notOpened: "¿No se abrió?",
      openLink: "Toca aquí para abrir WhatsApp",
      message: ({ name, phone, role }) =>
        `¡Hola Angel! Quiero un cupo en el taller de agentes de voz con IA (Claude + ElevenLabs), sáb 28 nov, 1:30–5:30 PM.\n\nNombre: ${name}\nWhatsApp: ${phone}` +
        (role ? `\nMe dedico a: ${role}` : ""),
    },
    mobileCta: "Reserva tu cupo",
  },
  en: {
    langLabel: "Language",
    bar: { name: "AI VOICE AGENT WORKSHOP", when: "SAT NOV 28 · 1:30–5:30 PM · MEDELLÍN", cta: "Save my seat" },
    eyebrow: "AI VOICE AGENT WORKSHOP · CLAUDE + ELEVENLABS · NO CODE",
    title: "MORE CLIENTS",
    titleAccent: "WITH AI",
    date: "SATURDAY NOV 28 · 1:30 PM – 5:30 PM · MEDELLÍN",
    lead: "One afternoon. A page, your own AI voice, an assistant that answers your customers, and content for your social media.",
    body: "No code. Bring your laptop and your business. We use Claude and ElevenLabs to create your social content, your page and your assistant. At 5:30 you leave with everything live and ready to use.",
    heroCta: "Save my seat →",
    leaveTitle: "What you walk out with",
    leave: [
      ["Content for your social media", "A 30-day plan with hooks, scripts and captions for Instagram, TikTok and LinkedIn, made with Claude."],
      ["A live landing page", "Built with Claude, mobile-ready, with your URL."],
      ["Lead capture", "Form, WhatsApp button, FAQ and booking link."],
      ["Your custom AI voice", "Made in ElevenLabs, for voiceovers on your Reels, ads and courses."],
      ["A voice assistant", "Answers visitors in your voice and collects their contact."],
      ["A next-30-days plan", "What to post, test and improve after Saturday."],
    ],
    flowTitle: "How the afternoon goes",
    flow: [
      { t: "1:30", title: "Content", d: "Your audience, your offer and 30 days of social media content with Claude." },
      { t: "2:30", title: "Build", d: "Your landing page built with Claude, with form, WhatsApp and booking." },
      { t: "3:15", title: "Break · 15 min" },
      { t: "3:30", title: "Voice", d: "Your custom brand voice and an assistant that uses it, embedded on your page." },
      { t: "4:50", title: "Ship", d: "Publish, show what you built, and leave with your plan." },
    ],
    forTitle: "Who it's for",
    forLead: "People who sell something and want more leads without learning to code.",
    audience: [
      "Entrepreneurs",
      "Creators",
      "Coaches & courses",
      "Marketers",
      "Clinics & wellness",
      "Real estate",
      "Restaurants & hotels",
    ],
    bringTitle: "Bring",
    bring: [
      "Laptop + charger, and headphones",
      "Claude and ElevenLabs accounts",
      "A 2-minute voice recording (script sent on WhatsApp)",
      "Your offer, 5–10 customer FAQs and your WhatsApp",
    ],
    seatTitle: "Save your seat",
    seatLead:
      "Seats are limited so everyone gets help. Send this and I'll reply on WhatsApp with price, address and the prep checklist.",
    facts: [
      ["WHEN", "Sat Nov 28 · 1:30–5:30 PM"],
      ["WHERE", "Private cowork · Medellín"],
      ["LEVEL", "Beginner friendly · no code"],
    ],
    form: {
      name: "NAME",
      namePlaceholder: "Your name",
      nameError: "Add your name",
      phone: "WHATSAPP",
      phoneError: "Add a WhatsApp number",
      role: "WHAT DO YOU DO?",
      rolePlaceholder: "Choose one (optional)",
      roles: [
        "Entrepreneur / small business",
        "Creator",
        "Coach or course creator",
        "Marketer / agency",
        "Clinic or wellness",
        "Real estate",
        "Restaurant or hotel",
        "Other",
      ],
      submit: "Save my seat on WhatsApp",
      sent: "Sent to WhatsApp ✓",
      fine: "Opens WhatsApp with your message ready to send. No payment yet.",
      notOpened: "Didn't open?",
      openLink: "Tap here to open WhatsApp",
      message: ({ name, phone, role }) =>
        `Hi Angel! I want a seat at the AI Voice Agent workshop with Claude + ElevenLabs (Sat Nov 28, 1:30–5:30 PM).\n\nName: ${name}\nWhatsApp: ${phone}` +
        (role ? `\nI am: ${role}` : ""),
    },
    mobileCta: "Save my seat",
  },
};
