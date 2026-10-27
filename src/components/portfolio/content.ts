export const brand = {
  name: "Angel Mateus",
  positioning:
    "I build AI voice agents and enterprise software, mentor developers into AI engineers, and host Medellín’s tech community.",
};

const whatsappNumber = "573206456179";

export const whatsapp = (text: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

export const links = {
  github: "https://github.com/anuidev8",
  linkedin: "https://linkedin.com/in/angel-mateus-arrieta-morelo-739623123",
  youtube: "https://youtube.com/@anuidev",
  email: "contact@angelmateus.com",
  booking: whatsapp("Hi Angel, I'd like to book a 20-min call about an AI product."),
  cv: "/Angel_Arrieta_CV.pdf",
};

export const navItems = [
  { href: "/software", label: "Software" },
  { href: "/voice-ai", label: "Voice AI" },
  { href: "/mentorship", label: "Mentorship" },
  { href: "/events", label: "Events" },
  { href: "/work", label: "Work" },
  { href: "/post", label: "Articles" },
];

export const stats = [
  { value: "7+ yrs", label: "shipping web, mobile and AI products" },
  { value: "2,000+", label: "active users in 3 months · The School of Breath" },
  { value: "+35%", label: "qualified leads · Academia del Estratega" },
  { value: "<200 ms", label: "median API response · Meditate With Abhi" },
];

export const clients = [
  "SETI",
  "QSmiley",
  "Palenke · PCN",
  "The School of Breath",
  "Academia del Estratega",
  "ISA Company",
];

export const sponsors = [
  { name: "The AI Hub", logo: "/sponsors/the-ai-hub.png", width: 790, height: 228 },
  { name: "La Rock Medellín", logo: "/sponsors/la-rock-medellin.png", width: 432, height: 114 },
  { name: "The School of Breath", logo: "/sponsors/the schoolofbretah.png", width: 394, height: 308 },
  { name: "The Credle Group", logo: "/sponsors/thecredlegroup.png", width: 220, height: 170 },
  { name: "GOAT", logo: "/sponsors/goat.png", width: 194, height: 162 },
];

export type CaseCategory = "Voice AI" | "E-commerce" | "Platforms" | "Events";

export const caseCategories: CaseCategory[] = ["Voice AI", "E-commerce", "Platforms", "Events"];

export type CaseMedia =
  | { type: "image"; src: string; alt: string; fit: "cover" | "contain"; caption?: string }
  | { type: "video"; src: string; poster: string; alt: string; caption?: string };

export type CaseStudy = {
  tag: string;
  client: string;
  title: string;
  category: CaseCategory;
  media?: CaseMedia[];
  brand?: { logo: string; name: string; handle: string; meta: string };
  built: string;
  result?: string;
  stack: string[];
  link?: { href: string; label: string };
};

export const cases: CaseStudy[] = [
  {
    tag: "VOICE AI · EVENT",
    client: "SETI × Corficolombiana",
    title: "Huella Digital",
    category: "Voice AI",
    media: [
      {
        type: "video",
        src: "/work/seti-huella-digital.mp4",
        poster: "/work/seti-huella-digital-poster.jpg",
        alt: "Guests using the Huella Digital kiosks at the SETI stand",
        caption: "LIVE AT THE EVENT",
      },
      {
        type: "image",
        src: "/events/conexion-inteligente/huella-digital.jpg",
        alt: "Angel at the Huella Digital stand during Conexión Inteligente",
        fit: "cover",
        caption: "THE STAND",
      },
      {
        type: "image",
        src: "/work/seti-conexion-inteligente.jpg",
        alt: "Angel with a guest at the SETI stand during Conexión Inteligente",
        fit: "contain",
        caption: "CONEXIÓN INTELIGENTE",
      },
    ],
    built:
      "An AI experience that lets people explore their own digital profile, built on the AI and frontend side with LiveKit, LangGraph and CopilotKit on AWS.",
    result: "Used live by leaders and executives at Corficolombiana’s Conexión Inteligente forum.",
    stack: ["LiveKit", "LangGraph", "CopilotKit", "AWS", "Next.js"],
    link: { href: "/post/voice-agents-generative-ui-enterprise", label: "Read the case study →" },
  },
  {
    tag: "AI E-COMMERCE",
    client: "QSmiley · Australia",
    title: "A Shopify store with a built-in AI sales assistant",
    category: "E-commerce",
    media: [
      {
        type: "video",
        src: "/work/qsmiley-storefront.mp4",
        poster: "/work/qsmiley-storefront-poster.jpg",
        alt: "Scrolling the QSmiley Quad Vita product page, with the AI support assistant docked at the bottom",
      },
    ],
    built:
      "Designed and built the full custom Shopify storefront and integrated an AI assistant that answers pre-purchase questions and guides shoppers to the right product.",
    stack: ["Shopify", "AI assistant", "Frontend"],
    link: { href: "https://qsmiley.com.au", label: "Visit qsmiley.com.au →" },
  },
  {
    tag: "VOICE AI · WELLNESS",
    client: "The School of Breath",
    title: "A real-time voice agent that guides breathwork",
    category: "Voice AI",
    media: [
      {
        type: "image",
        src: "/work/school-of-breath-app.png",
        alt: "The School of Breath app home screen with daily breathing, courses, meditation, sleep music and mantras",
        fit: "contain",
      },
    ],
    brand: {
      logo: "/logo.png",
      name: "The School of Breath",
      handle: "@TheSchoolofBreath",
      meta: "175K subscribers",
    },
    built:
      "A voice agent that talks users through breathwork and meditation in real time, backed by Node.js and Python services.",
    result: "2,000+ active users within three months of launch; 10,000+ monthly requests.",
    stack: ["Voice AI", "Node.js", "Python", "React Native"],
    link: {
      href: "https://play.google.com/store/apps/details?id=com.meditatewithabhi.theschoolofbreath",
      label: "See the app →",
    },
  },
  {
    tag: "PLATFORM",
    client: "Palenke · PCN",
    title: "Digital infrastructure for Afro-Colombian self-governance",
    category: "Platforms",
    media: [
      {
        type: "video",
        src: "/work/palenke-mediateca.mp4",
        poster: "/work/palenke-mediateca-poster.jpg",
        alt: "Browsing Mediateca Ubuntu, the Palenke audiovisual memory archive, through its collection wheel, photo wall and album views",
      },
    ],
    built:
      "A Next.js and NestJS platform for territorial memory, community governance, advocacy and a searchable knowledge library, with a geoportal for the Colombian Pacific.",
    stack: ["Next.js", "NestJS", "Geoportal"],
    link: { href: "https://palenke.org", label: "Visit palenke.org →" },
  },
  {
    tag: "EVENTS · COMMUNITY",
    client: "Visible Builders · Medellín",
    title: "AI After Hours, with an AI host in the room",
    category: "Events",
    media: [
      {
        type: "image",
        src: "/social/ai-after-hours/ai-after-hours-oct-22-poster.jpg",
        alt: "AI After Hours event poster for October 22",
        fit: "contain",
        caption: "AI AFTER HOURS",
      },
      {
        type: "image",
        src: "/community/visible-builders-2.jpg",
        alt: "A speaker on the mic during a Visible Builders talk",
        fit: "cover",
        caption: "ON STAGE",
      },
    ],
    built:
      "A monthly AI talk night plus the tech behind it: QR check-in, Noshy (a voice host that matches attendees by answering three questions out loud) and icebreaker challenge cards.",
    result: "129 builders registered and 12 speakers and demos on stage.",
    stack: ["LiveKit", "Next.js", "PostgreSQL", "Voice AI"],
    link: { href: "/post/ai-after-hours", label: "See the event →" },
  },
];

const caseByTitle = (title: string) => cases.find((c) => c.title === title)!;

export const featuredCases: CaseStudy[] = [
  caseByTitle("Huella Digital"),
  caseByTitle("A real-time voice agent that guides breathwork"),
  caseByTitle("AI After Hours, with an AI host in the room"),
];

export type Service = {
  num: string;
  href: string;
  title: string;
  desc: string;
  idealFor: string;
  timeline?: string;
  price?: string;
};

export const services: Service[] = [
  {
    num: "01",
    href: "/software",
    title: "Enterprise software",
    desc: "Custom AI platforms, internal tools and agents connected to your own data, from roadmap to production.",
    idealFor: "mid-size and enterprise teams in LatAm and the US",
    timeline: "Discovery in 2 weeks",
    price: "Projects from USD 15k",
  },
  {
    num: "02",
    href: "/voice-ai",
    title: "AI voice agents",
    desc: "An AI receptionist that answers calls and WhatsApp 24/7 in English and Spanish and books appointments.",
    idealFor: "clinics, real estate, hotels, restaurants",
    timeline: "Live in 14 days",
    price: "Results guaranteed",
  },
  {
    num: "03",
    href: "/mentorship",
    title: "AI Engineer mentorship",
    desc: "An 8-week program to build and sell AI agents, plus hands-on AI workshops for company teams.",
    idealFor: "LatAm developers and company teams",
    timeline: "8-week cohorts",
    price: "1:1 or group",
  },
  {
    num: "04",
    href: "/events",
    title: "Events & community",
    desc: "Tech events designed and hosted end to end, with interactive tech no other host brings: voice host, QR check-in, challenge cards.",
    idealFor: "companies, coworkings, universities, brands",
    timeline: "Meetups to hackathons",
    price: "Sponsorships open",
  },
];

export const processSteps = [
  { num: "01", title: "Clarify", desc: "One call to map the user journey and the smallest version worth testing." },
  { num: "02", title: "Prototype", desc: "A working interface with the AI wired in, so you react to something real." },
  { num: "03", title: "Ship", desc: "Hardened, deployed on AWS or Vercel, with analytics so we know it works." },
];

export const jobs = [
  {
    when: "2026",
    role: "AI Expert & Frontend Engineer",
    org: "SETI",
    note: "Voice agents and AI experiences with LiveKit, LangGraph, CopilotKit and AWS.",
  },
  {
    when: "2025 – 2026",
    role: "Full-stack & AI Developer",
    org: "The School of Breath",
    note: "Real-time breathwork voice agent; 2,000+ active users in 3 months.",
  },
  {
    when: "2025",
    role: "Full-stack Developer & Tech Lead",
    org: "Academia del Estratega",
    note: "Agent-driven lead platform; +35% qualified leads.",
  },
  {
    when: "Freelance",
    role: "E-commerce & AI Developer",
    org: "QSmiley",
    note: "Custom Shopify storefront for an Australian family-wellness brand, with an AI shopping assistant.",
  },
  {
    when: "Freelance",
    role: "Full-stack Developer",
    org: "Palenke · PCN",
    note: "palenke.org on Next.js and NestJS, with the SIG-A geoportal for the Colombian Pacific.",
  },
  {
    when: "2024 – 2025",
    role: "Full-stack & AI Agent Developer",
    org: "Meditate With Abhi",
    note: "Sleep and mindfulness platform; 1,000+ active users in its first quarter, sub-200 ms median responses.",
  },
  {
    when: "2022 – 2024",
    role: "Frontend & Lead Developer",
    org: "ISA Company",
    note: "Engineering calculation tool; CI/CD from 2 hours to under 20 minutes.",
  },
  {
    when: "2019 – 2022",
    role: "Early experience",
    org: "Startupslab, University of Córdoba, Mipiggybag Ita",
    note: "Web, research data tools and first product launches.",
  },
];

export const community = {
  name: "Visible Builders",
  site: "https://visiblebuilders.io",
  speakInvite:
    "mailto:contact@angelmateus.com?subject=Speaking%20invitation%20%E2%80%94%20Visible%20Builders",
  stats: [
    { value: "129", label: "builders registered for AI After Hours" },
    { value: "12", label: "speakers and demos on stage" },
    { value: "3", label: "formats: talk nights, dinners, hackathons" },
  ],
  reel: {
    src: "/community/visible-builders-reel.mp4",
    poster: "/community/visible-builders-reel-poster.jpg",
    alt: "Rooftop venue during a Visible Builders night in Medellín",
    caption: "VISIBLE BUILDERS · MEDELLÍN",
  },
  photos: [
    {
      type: "image",
      src: "/community/visible-builders-1.jpg",
      alt: "A builder sharing what he's working on, mic in hand",
      fit: "cover",
    },
    {
      type: "image",
      src: "/community/visible-builders-2.jpg",
      alt: "A speaker on the mic during a Visible Builders talk",
      fit: "cover",
    },
    {
      type: "image",
      src: "/community/visible-builders-3.jpg",
      alt: "A builder presenting to the room at a Visible Builders night",
      fit: "cover",
    },
    {
      type: "image",
      src: "/community/visible-builders-4.jpg",
      alt: "Attendees listening during a Visible Builders talk night",
      fit: "cover",
    },
  ] satisfies CaseMedia[],
  events: [
    {
      tag: "TALK NIGHT",
      title: "AI After Hours",
      desc: "Builders share what they’re shipping: AI workflows, products and lessons from the field. Live demos, not panels.",
      image: { src: "/social/ai-after-hours/ai-after-hours-slide-1-intro.png", alt: "AI After Hours by Visible Builders Medellín" },
      href: "/post/ai-after-hours",
    },
    {
      tag: "DINNER · AUGUST 2026",
      title: "AI Marketing Networking Night",
      desc: "A private dinner for founders and marketers: AI, growth and high-value conversations, backed by partner brands.",
      href: "/post/ai-marketing-networking-night",
    },
    {
      tag: "HACKATHON",
      title: "Agentic Voice Wellness Hackathon",
      desc: "Teams build voice agents that help people breathe, move, focus and rest, from a prep workshop to demo day.",
      href: "/post/medellin-voice-wellness-hackathon",
    },
  ],
};

export const testimonial: { quote: string; name: string; role: string } | null = null;
