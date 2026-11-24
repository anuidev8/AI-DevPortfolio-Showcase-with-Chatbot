import { devfestCopy, type DevFestCopy, type DevFestLang } from './devfest-copy';

/** English-first services deck — same CVA design, value-led narrative. */
const servicesEn: DevFestCopy = {
  ...devfestCopy.en,
  chrome: {
    ...devfestCopy.en.chrome,
    title: 'ALTURA Medellín · Voice, agentic UI & wellness',
  },
  intro: {
    aria: 'Introduction',
    welcome: 'Welcome',
    event: 'ALTURA Medellín · AI, Startups & Networking',
    kicker: 'Happy birthday, Carlos · Victoria Rooftop',
    hello: 'Hello',
    sub: 'I build voice agents, agentic UI, and wellness products that ship — glad you’re here tonight. And happy birthday, Carlos.',
    skip: 'Skip intro',
    tapSound: 'Tap anywhere for sound',
  },
  hook: {
    title: 'What are you looking for',
    accent: 'in this room?',
    lead: 'What are you building with AI?',
    demo: 'See work',
    code: 'Contact',
    byline: 'Angel Arrieta · Frontend, voice AI & agentic UI · ALTURA Medellín',
  },
  who: {
    ...devfestCopy.en.who,
    eyebrow: '03 · Who’s speaking',
    lead: 'Almost 7 years in software, focused on frontend. I build voice-interface products with my agency, lead enterprise agent work, and ship wellness experiences. Founder of Visible Builders and organizer of The AI Hub — bilingual, based in Medellín.',
  },
  people: {
    ...devfestCopy.en.people,
    eyebrow: '02 · Everyday voice',
  },
  future: {
    ...devfestCopy.en.future,
    eyebrow: '05 · Where interfaces go',
  },
  today: {
    ...devfestCopy.en.today,
    eyebrow: '02 · What I’m doing with AI',
    title: 'What I’m building',
    accent: 'with AI right now.',
  },
  problem: {
    ...devfestCopy.en.problem,
    eyebrow: '06 · Selling with AI',
  },
  cases: {
    ...devfestCopy.en.cases,
    eyebrow: '07 · Products in production',
  },
  architecture: {
    ...devfestCopy.en.architecture,
    eyebrow: '08 · Architecture · Orchestrator-workers + Augmented LLM — Anthropic',
  },
  productIntros: {
    ...devfestCopy.en.productIntros,
    livekit: {
      ...devfestCopy.en.productIntros.livekit,
      eyebrow: '09 · Voice infrastructure',
    },
  },
  livekit: {
    ...devfestCopy.en.livekit,
    eyebrow: '09.1 · LiveKit',
  },
  stack: {
    ...devfestCopy.en.stack,
    eyebrow: '10 · Stack',
    title: 'What I use today',
    accent: 'to build voice agents.',
  },
  skill: {
    ...devfestCopy.en.skill,
    eyebrow: '12 · Design process',
  },
  moodboard: {
    ...devfestCopy.en.moodboard,
    eyebrow: '12.1 · Skill output',
  },
  audience: {
    ...devfestCopy.en.audience,
    eyebrow: '15 · Your turn',
    title: 'Thank you.',
    accent: 'Let’s build something real.',
    lead: 'Voice agents, agentic UI, enterprise demos, wellness products. Scan to see the work and the communities I run.',
    siteSub: 'Site & work',
    communities: 'Communities',
    communitiesSub: 'Visible Builders · AI Hub',
    photoAlt: 'Angel Arrieta',
  },
  slides: {
    room: 'This room',
    'voz-para-todos': 'Everyday voice',
    'quien-soy': 'About me',
    value: 'Value',
    futuro: 'Future of UI',
    problema: 'Selling with AI',
    casos: 'In production',
    arquitectura: 'Architecture',
    'que-es-livekit': 'LiveKit',
    livekit: 'LiveKit deep dive',
    tecnologias: 'Stack',
    wellness: 'Wellness',
    'ai-design-framework': 'Design skill',
    'mood-board-ametoion': 'Mood board',
    community: 'Community',
    workshop: 'Workshop',
    close: 'Close',
    'looking-for': 'Looking for',
  },
};

/** Same English content for ES toggle so the services deck stays English-first. */
export const servicesCopy: Record<DevFestLang, DevFestCopy> = {
  en: servicesEn,
  es: servicesEn,
};

export const SERVICES_EXTRA = {
  value: {
    eyebrow: '04 · The value',
    title: 'The value I bring:',
    accent: 'voice, agents, and products that ship.',
    lead: 'Enterprise voice agents and call experiences. Course and product voice apps. Agentic UI for real teams. Wellness products people actually use. Built for founders, nomads, and teams connecting at ALTURA.',
    demo: 'See work',
    contact: 'Contact',
    byline: 'Angel Arrieta · Frontend, voice AI & agentic UI · ALTURA Medellín',
  },
  lookingFor: {
    eyebrow: '16 · This room',
    title: 'What are you',
    accent: 'looking for?',
    lead: 'One conversation can open a product, a partnership, or a new chapter.',
    prompts: [
      { label: 'Enterprise voice', body: 'Agent calls, concierge demos, sales copilots that prove AI live.' },
      { label: 'Product & courses', body: 'Voice apps for courses, onboarding, and day-to-day product flows.' },
      { label: 'Agentic UI', body: 'Interfaces the agent generates — AG-UI, A2UI, CopilotKit.' },
      { label: 'Wellness', body: 'Breath, yoga, coaching products with voice that feels calm and real.' },
    ],
  },
  wellness: {
    eyebrow: '11 · Wellness product',
    title: 'Voice for',
    accent: 'breath & practice.',
    lead: 'The School of Breath — a wellness product with voice guidance, diaphragmatic sessions, and a calm agentic layer. Built for real users, not demos.',
    stats: [
      { label: 'Active users', value: '2,000+' },
      { label: 'Requests / month', value: '10,000+' },
      { label: 'Channel', value: 'YouTube + app' },
    ],
    points: [
      { title: 'Value lives in simplicity', body: 'Real value is making the user’s life simpler — not adding more features.' },
      { title: 'Fewer decisions', body: 'In wellness, people don’t want overload. Guide them. Don’t overwhelm them.' },
      { title: 'Respond fast', body: 'Answer quickly and offer alternatives when energy or time is low.' },
    ],
    quote: 'Leading a wellness product is, first of all, taking care of people: the team that builds and the user who breathes.',
    playStore: 'https://play.google.com/store/apps/details?id=com.meditatewithabhi.theschoolofbreath',
    site: 'https://www.angelmateus.com/bienestar',
  },
  community: {
    eyebrow: '13 · Community',
    title: 'Spaces I',
    accent: 'build and run.',
    lead: 'Visible Builders and The AI Hub — rooms where builders learn, ship, and show their work. Talent for every need; community for the pitch and the follow-up.',
    cards: [
      { title: 'Visible Builders', body: 'Builders shipping in public. Product weekends, demos, peer pressure that helps.' },
      { title: 'The AI Hub', body: 'AI builders in Medellín. Talks, workshops, and people who actually code.' },
    ],
    url: 'https://www.angelmateus.com/community',
  },
  workshop: {
    eyebrow: '14 · Hands-on workshop',
    title: 'Build the AI tools',
    accent: 'your business needs.',
    lead: 'No coding. In one afternoon. Claude + ElevenLabs — your voice, your landing, your assistant.',
    when: 'Sat, Nov 28 · 1:30 – 5:30 PM · Medellín',
    cta: 'Reserve your spot',
    url: 'https://www.angelmateus.com/workshops/build-ai-voice-agent-claude-elevenlabs',
    stack: ['Lovable', 'ElevenLabs', 'Claude'],
    note: 'Limited seats · link in bio / workshops page',
  },
} as const;
