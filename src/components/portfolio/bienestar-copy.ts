import { whatsapp } from "./content";

export type BienestarLang = "es" | "en";

export const BIENESTAR_LANG_KEY = "am-bienestar-lang";

type Copy = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  forLabel: string;
  audience: string[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutAccent: string;
  aboutLead: string;
  promiseTitle: string;
  promise: { title: string; desc: string }[];
  useCasesEyebrow: string;
  useCasesTitle: string;
  useCases: { title: string; desc: string }[];
  stepsEyebrow: string;
  stepsTitle: string;
  steps: { label: string; title: string; desc: string }[];
  packagesTitle: string;
  packages: { name: string; price: string; note: string; highlight?: boolean }[];
  packagesNote: string;
  proofEyebrow: string;
  proofTitle: string;
  proof: {
    tag: string;
    title: string;
    body: string;
    result: string;
    linkLabel: string;
    linkHref: string;
  };
  ctaTitle: string;
  ctaLabel: string;
  ctaHref: string;
  ctaNote: string;
  introSkip: string;
  introBeats: { kicker?: string; text: string; sub?: string }[];
};

export const bienestarCopy: Record<BienestarLang, Copy> = {
  es: {
    eyebrow: "IA PARA BIENESTAR",
    title: "IA clara",
    titleAccent: "para tu negocio de bienestar.",
    intro: "Sin jerga. Para coaches de fitness, yoga y nutrición que quieren usar IA ya.",
    primaryCta: {
      label: "Agendar llamada",
      href: whatsapp(
        "Hola Angel, vi la página de Bienestar. Quiero saber cómo la IA puede ayudar mi negocio. No soy técnica.",
      ),
    },
    secondaryCta: { label: "Ver video →", href: "#video" },
    forLabel: "PARA",
    audience: ["Fitness", "Yoga", "Nutrición", "Wellness", "Contenido"],
    aboutEyebrow: "QUIÉN TE AYUDA",
    aboutTitle: "Soy Angel.",
    aboutAccent: "Wellness + IA.",
    aboutLead:
      "Consultor en ingeniería hace casi 7 años. Construyo productos con voz e IA, y he liderado trabajo con negocios de wellness. Fundador de Visible Builders · The AI Hub · Medellín.",
    promiseTitle: "Qué ganas",
    promise: [
      { title: "Responder más rápido", desc: "WhatsApp o voz con tu tono, incluso en clase." },
      { title: "Crear contenido", desc: "Posts, Reels y menús — tú editas, la IA escribe el borrador." },
      { title: "Acompañar clientas", desc: "Check-ins y guías entre sesiones, con tu método." },
    ],
    useCasesEyebrow: "EJEMPLOS",
    useCasesTitle: "Así se ve en tu día a día.",
    useCases: [
      { title: "Fitness", desc: "Rutinas, progreso y dudas de forma entre clases." },
      { title: "Yoga", desc: "Secuencias cortas por voz según energía y tiempo." },
      { title: "Nutrición", desc: "Menús, lista de mercado y swaps con tus reglas." },
      { title: "Contenido", desc: "De un tip → carrusel + caption + CTA." },
      { title: "Reservas", desc: "Agenda y FAQs a las 9 pm, sin que tú estés online." },
      { title: "Breathwork", desc: "Guías de voz en vivo — como The School of Breath." },
    ],
    stepsEyebrow: "CÓMO",
    stepsTitle: "Tres pasos. Sin rodeos.",
    steps: [
      { label: "01", title: "Hablamos", desc: "Cómo atiendes hoy. Qué te quita más tiempo." },
      { label: "02", title: "Propuesta clara", desc: "Qué hacemos, cuánto tarda, cuánto cuesta." },
      { label: "03", title: "Lo usas", desc: "Asistente o piloto listo para tus clientas." },
    ],
    packagesTitle: "Empezar",
    packages: [
      { name: "Taller", price: "1:1 o grupo", note: "ChatGPT y herramientas en tu negocio." },
      {
        name: "Asistente",
        price: "Desde USD 2,500",
        note: "WhatsApp o voz. Yo lo construyo.",
        highlight: true,
      },
      { name: "Producto", price: "A medida", note: "App o agente de voz wellness." },
    ],
    packagesNote: "La IA refuerza tu método. No diagnostica ni prescribe.",
    proofEyebrow: "PRUEBA",
    proofTitle: "Ya en wellness.",
    proof: {
      tag: "VOICE AI · WELLNESS",
      title: "The School of Breath",
      body: "Agente de voz que guía breathwork en tiempo real.",
      result: "2.000+ usuarias activas en 3 meses · 10.000+ requests / mes",
      linkLabel: "Ver la app →",
      linkHref: "https://play.google.com/store/apps/details?id=com.meditatewithabhi.theschoolofbreath",
    },
    ctaTitle: "¿Listas para probar?",
    ctaLabel: "WhatsApp",
    ctaHref: whatsapp(
      "Hola Angel, vi Bienestar. Quiero una llamada clara sobre IA para mi negocio de coaching.",
    ),
    ctaNote: "Respuesta en 24 h · ES / EN · Colombia (UTC−5)",
    introSkip: "Saltar intro",
    introBeats: [
      { text: "Bienvenida" },
      { text: "IA para bienestar", sub: "Sin código. Sin jerga." },
      {
        kicker: "Para coaches",
        text: "Fitness · Yoga · Nutrición",
        sub: "Atención, contenido y acompañamiento — con tu voz.",
      },
    ],
  },
  en: {
    eyebrow: "AI FOR WELLNESS",
    title: "Plain AI",
    titleAccent: "for your wellness business.",
    intro: "No jargon. For fitness, yoga and nutrition coaches who want AI now.",
    primaryCta: {
      label: "Book a call",
      href: whatsapp(
        "Hi Angel, I saw the Wellness page. I want to know how AI can help my business. I am not technical.",
      ),
    },
    secondaryCta: { label: "Watch video →", href: "#video" },
    forLabel: "FOR",
    audience: ["Fitness", "Yoga", "Nutrition", "Wellness", "Content"],
    aboutEyebrow: "WHO HELPS YOU",
    aboutTitle: "I'm Angel.",
    aboutAccent: "Wellness + AI.",
    aboutLead:
      "Engineering consultant for almost 7 years. I build voice and AI products, and I have led work with wellness businesses. Founder of Visible Builders · The AI Hub · Medellín.",
    promiseTitle: "What you get",
    promise: [
      { title: "Reply faster", desc: "WhatsApp or voice in your tone, even in class." },
      { title: "Create content", desc: "Posts, Reels, menus — you edit, AI drafts." },
      { title: "Support clients", desc: "Check-ins between sessions, your method." },
    ],
    useCasesEyebrow: "EXAMPLES",
    useCasesTitle: "How it shows up day to day.",
    useCases: [
      { title: "Fitness", desc: "Routines, progress and form Q&A between classes." },
      { title: "Yoga", desc: "Short voice sequences by energy and time." },
      { title: "Nutrition", desc: "Menus, groceries and swaps with your rules." },
      { title: "Content", desc: "One tip → carousel + caption + CTA." },
      { title: "Bookings", desc: "FAQs and slots at 9 pm without you online." },
      { title: "Breathwork", desc: "Live voice guides — like The School of Breath." },
    ],
    stepsEyebrow: "HOW",
    stepsTitle: "Three steps. No fluff.",
    steps: [
      { label: "01", title: "We talk", desc: "How you serve today. What steals time." },
      { label: "02", title: "Clear offer", desc: "What we build, timeline, price." },
      { label: "03", title: "You use it", desc: "Assistant or pilot ready for clients." },
    ],
    packagesTitle: "Start",
    packages: [
      { name: "Workshop", price: "1:1 or group", note: "ChatGPT and tools in your business." },
      {
        name: "Assistant",
        price: "From USD 2,500",
        note: "WhatsApp or voice. I build it.",
        highlight: true,
      },
      { name: "Product", price: "Custom", note: "App or wellness voice agent." },
    ],
    packagesNote: "AI supports your method. It does not diagnose or prescribe.",
    proofEyebrow: "PROOF",
    proofTitle: "Already in wellness.",
    proof: {
      tag: "VOICE AI · WELLNESS",
      title: "The School of Breath",
      body: "A real-time voice agent that guides breathwork.",
      result: "2,000+ active users in 3 months · 10,000+ requests / month",
      linkLabel: "See the app →",
      linkHref: "https://play.google.com/store/apps/details?id=com.meditatewithabhi.theschoolofbreath",
    },
    ctaTitle: "Ready to try?",
    ctaLabel: "WhatsApp",
    ctaHref: whatsapp(
      "Hi Angel, I saw Wellness. I want a plain call about AI for my coaching business.",
    ),
    ctaNote: "Reply in 24 h · EN / ES · Colombia (UTC−5)",
    introSkip: "Skip intro",
    introBeats: [
      { text: "Welcome" },
      { text: "AI for wellness", sub: "No code. No jargon." },
      {
        kicker: "For coaches",
        text: "Fitness · Yoga · Nutrition",
        sub: "Care, content and follow-up — in your voice.",
      },
    ],
  },
};
