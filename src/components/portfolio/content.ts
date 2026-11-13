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
  { href: "/bienestar", label: "Bienestar" },
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
  | { type: "video"; src: string; poster?: string; alt: string; caption?: string };

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
        type: "video",
        src: "/events/speaking/linkedin-speaking.mp4",
        poster: "/events/speaking/linkedin-speaking-poster.jpg",
        alt: "Angel speaking on stage at a recent Medellín tech event",
        caption: "ON STAGE",
      },
      {
        type: "image",
        src: "/events/speaking/gdg-medellin.jpg",
        alt: "Speakers on stage at GDG Medellín",
        fit: "cover",
        caption: "GDG MEDELLÍN",
      },
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
        caption: "HOSTING",
      },
    ],
    built:
      "A monthly AI talk night plus the tech behind it: QR check-in, Noshy (a voice host that matches attendees by answering three questions out loud) and icebreaker challenge cards.",
    result: "129 builders registered and 12 speakers and demos on stage.",
    stack: ["LiveKit", "Next.js", "PostgreSQL", "Voice AI"],
    link: { href: "/post/ai-after-hours", label: "See the event →" },
  },
];

/** Older portfolio projects shown after the curated cases, with pagination on /work. */
export const archiveCases: CaseStudy[] = [
  {
    tag: "VOICE AI · FITNESS",
    client: "Personal build",
    title: "Fitness AI Dashboard",
    category: "Voice AI",
    media: [
      {
        type: "video",
        src: "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1772649648/videos%20anuidev/V%C3%ADdeo_sin_t%C3%ADtulo_Hecho_con_Clipchamp-2_djxir7.mp4",
        alt: "Fitness AI dashboard with voice-powered health and progress tracking",
      },
    ],
    built:
      "AI fitness dashboard that tracks workouts, goals and nutrition, with a voice assistant and real-time analytics for personalized training plans.",
    stack: ["Next.js", "OpenAI", "Voice Interface", "Data Visualization"],
  },
  {
    tag: "VOICE AI · HIRING",
    client: "Personal build",
    title: "Marketing AI talent matching",
    category: "Voice AI",
    media: [
      {
        type: "video",
        src: "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1772649393/videos%20anuidev/video-2_il1cdn.mp4",
        alt: "Voice-driven marketing talent matching platform demo",
      },
    ],
    built:
      "Voice-driven hiring assistant where business owners speak their needs and AI matches and ranks digital marketing freelancers by intent, budget and channels.",
    stack: ["Next.js", "OpenAI", "WebRTC", "Vercel AI SDK"],
    link: {
      href: "https://github.com/anuidev8/conversational-event-flow.git",
      label: "View on GitHub →",
    },
  },
  {
    tag: "VOICE AI · MOBILE",
    client: "Personal build",
    title: "Real-time voice AI on React Native",
    category: "Voice AI",
    media: [
      {
        type: "video",
        src: "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1758061704/videos%20anuidev/Copia_de_video_example_Hecho_con_Clipchamp_wefai9.mp4",
        alt: "Real-time voice AI mobile app demo with OpenAI Realtime",
      },
    ],
    built:
      "Mobile demo streaming live audio with OpenAI Realtime, WebRTC and Expo — the same protocol pattern works with Google and ElevenLabs.",
    stack: ["React Native", "Expo", "OpenAI Realtime", "WebRTC"],
  },
  {
    tag: "AI AGENT",
    client: "Colombia · Public tenders",
    title: "SECOP AI Agent",
    category: "Platforms",
    media: [
      {
        type: "video",
        src: "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1758061155/videos%20anuidev/secop_Hecho_con_Clipchamp_etzgrp.mp4",
        alt: "SECOP AI agent helping find and win public tenders in Colombia",
      },
    ],
    built:
      "Agentic chat that helps find and win Colombian public tenders, with Next.js + CopilotKit on the frontend and a CrewAI Flask backend on datos.gov.co.",
    stack: ["Next.js", "CopilotKit", "CrewAI", "Python", "OpenAI"],
  },
  {
    tag: "VOICE AI · DEMO",
    client: "Tribu IA",
    title: "Real-time meditation demo",
    category: "Voice AI",
    media: [
      {
        type: "video",
        src: "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1758059434/videos%20anuidev/Copia_de_video-media-ai-protocl_Hecho_con_Clipchamp_vvfpkp.mp4",
        alt: "Real-time meditation demo presented at Tribu IA",
      },
    ],
    built:
      "Live meditation demo combining Google Live voice and camera, exploring WebSocket vs WebRTC for real-time multimodal agents.",
    stack: ["Google Live API", "WebSocket", "WebRTC"],
  },
  {
    tag: "AI INTERFACES",
    client: "Exploration",
    title: "Google Voice & Camera Vision Live",
    category: "Voice AI",
    media: [
      {
        type: "video",
        src: "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1758059335/videos%20anuidev/V%C3%ADdeo_sin_t%C3%ADtulo_Hecho_con_Clipchamp_1_ziopjg.mp4",
        alt: "Google Voice and Camera Vision Live API exploration",
      },
    ],
    built:
      "Small use case integrating Google Voice and Camera Vision Live with Next.js, exploring how AI reshapes frontend interfaces.",
    stack: ["Next.js", "Google Voice API", "Camera Vision", "Vercel"],
  },
  {
    tag: "AUTOMATION",
    client: "Marketing ops",
    title: "n8n data analysis & automation",
    category: "Platforms",
    media: [
      {
        type: "video",
        src: "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1758057664/videos%20anuidev/n8n-ads_wyekk0.mp4",
        alt: "n8n data analysis and marketing automation workflows",
      },
    ],
    built:
      "Interactive n8n workflows for digital marketing automation — turning complex process data into clear, actionable insights.",
    stack: ["n8n", "Data Analysis", "Automation"],
  },
  {
    tag: "WELLNESS · WEB",
    client: "Meditate With Abhi",
    title: "Sleep music web app",
    category: "Platforms",
    built: "Web app with expertly designed tools and resources for sleep and well-being.",
    stack: ["React", "React Query", "TypeScript", "Tailwind"],
    link: { href: "https://www.meditatewithabhi.com/app", label: "Visit the app →" },
  },
  {
    tag: "FRONTEND",
    client: "UI experiment",
    title: "SONY DualSense wireless control UI",
    category: "Platforms",
    built: "Interactive DualSense controller UI built with React, CSS and SVG.",
    stack: ["React", "CSS", "SVG"],
    link: { href: "https://sony-wireless-control-ui.vercel.app", label: "See live →" },
  },
  {
    tag: "FRONTEND",
    client: "Podcast site",
    title: "At The Cusp Of Freedom",
    category: "Platforms",
    built: "Podcast site for At The Cusp Of Freedom, built with Next.js.",
    stack: ["Next.js", "CSS"],
    link: { href: "https://at-the-cusp-of-freedom-podcast.vercel.app/", label: "Visit site →" },
  },
  {
    tag: "FRONTEND",
    client: "Personal",
    title: "Briefcase",
    category: "Platforms",
    built: "Personal web briefcase to share knowledge, projects and people I’ve worked with.",
    stack: ["Next.js", "GSAP"],
    link: { href: "https://briefcase-lilac.vercel.app", label: "See live →" },
  },
  {
    tag: "ANIMATION",
    client: "Education",
    title: "Anatomy of a Neuron",
    category: "Platforms",
    built: "SVG animation that explains how a neuron works, built with GSAP.",
    stack: ["SVG", "GSAP"],
    link: { href: "https://neuron-anatomy-animation.vercel.app", label: "See animation →" },
  },
  {
    tag: "FRONTEND",
    client: "Retail",
    title: "Vista Verde Mall",
    category: "Platforms",
    built:
      "Mall landing page with 360° store imagery, events and featured shops, built with Next.js and Three.js.",
    stack: ["Next.js", "React", "Three.js", "Tailwind"],
    link: { href: "https://mall-landing-page.vercel.app/", label: "Visit site →" },
  },
  {
    tag: "PLATFORM",
    client: "Medellín",
    title: "Events Medellín",
    category: "Events",
    built:
      "Language-exchange and culture platform for Medellín — unlock languages, culture and rewards while exploring the city.",
    stack: ["WordPress"],
    link: { href: "https://www.events-medellin.com", label: "Visit site →" },
  },
];

/** Curated case studies first, then the older archive — used by /work pagination. */
export const allCases: CaseStudy[] = [...cases, ...archiveCases];

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
    desc: "An 8-week program to build AI agents, grow as a leader and connect with the right people, plus AI workshops for teams.",
    idealFor: "LatAm developers and company teams",
    timeline: "8-week cohorts",
    price: "1:1 or group",
  },
  {
    num: "04",
    href: "/events",
    title: "Community host & connector",
    desc: "Events that put the right people in one room, strategic introductions, and a host and MC who makes sure they meet.",
    idealFor: "companies, brands, startups, coworkings, universities",
    timeline: "Events, intros, communities",
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
      alt: "Builders posing together at AI After Hours with the event screen behind them",
      fit: "cover",
    },
    {
      type: "image",
      src: "/community/visible-builders-5.jpg",
      alt: "A conversation during a Visible Builders night in Medellín",
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

export const speakingHighlights = {
  eyebrow: "ON STAGE",
  title: "Recent events where I spoke and hosted.",
  media: [
    {
      type: "video",
      src: "/events/speaking/linkedin-speaking.mp4",
      poster: "/events/speaking/linkedin-speaking-poster.jpg",
      alt: "Angel speaking on stage at a recent Medellín tech event",
      caption: "SPEAKING",
    },
    {
      type: "image",
      src: "/events/speaking/gdg-medellin.jpg",
      alt: "Speakers lined up on stage at GDG Medellín",
      fit: "cover",
      caption: "GDG MEDELLÍN",
    },
    {
      type: "image",
      src: "/community/visible-builders-1.jpg",
      alt: "Builders posing together at AI After Hours",
      fit: "cover",
      caption: "AI AFTER HOURS",
    },
    {
      type: "image",
      src: "/community/visible-builders-2.jpg",
      alt: "Angel on the mic during a Visible Builders night",
      fit: "cover",
      caption: "HOST & MC",
    },
  ] satisfies CaseMedia[],
  events: [
    {
      tag: "SPEAKER · GDG MEDELLÍN",
      title: "Google Developer Group Medellín",
      desc: "On stage with the GDG community — talks, demos and builders shipping in public.",
      image: { src: "/events/speaking/gdg-medellin.jpg", alt: "GDG Medellín speakers on stage" },
    },
    {
      tag: "HOST · VISIBLE BUILDERS",
      title: "AI After Hours",
      desc: "Monthly AI talk night: speakers, live demos, Noshy voice host and real introductions.",
      image: { src: "/community/visible-builders-1.jpg", alt: "AI After Hours group photo" },
      href: "/post/ai-after-hours",
    },
    {
      tag: "SPEAKER · INVITE",
      title: "Invite me to speak",
      desc: "Workshops, keynotes and AI nights in English or Spanish — Medellín, LatAm and remote.",
      href: "mailto:contact@angelmateus.com?subject=Speaking%20invitation",
    },
  ],
};

export const testimonial: { quote: string; name: string; role: string } | null = null;
