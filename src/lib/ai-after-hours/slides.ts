export const SLIDE_IDS = ['intro', 'purpose', 'talks', 'benefits', 'community'] as const;
export type SlideId = (typeof SLIDE_IDS)[number];

export const SLIDE_SUMMARIES: Record<SlideId, string> = {
  intro:
    'Title slide: AI After Hours by Visible Builders. Sponsors: The AI Hub, La Rock Medellín.',
  purpose:
    'Why we gather: Real Talks, Real Experiences, New Connections for Medellín AI builders.',
  talks:
    'Speakers: Marylin Alarcon (Lead R&D Engineer) — “AI Lowered The Floor, Our Work Is Now The Ceiling”; Salome Arboleda (Software Developer & Tech Enthusiast) — “Build real-time quantum apps with AI — use cases”; Jacobo Blandón (XR / Blockchain & Digital Product Builder) — “Turn complex ideas into digital products that actually work.” Thu Oct 22, 7:00 PM, Rooftop La Rock, El Poblado, Medellín.',
  benefits:
    'Benefits: Community & Connections, Networking, Grow. Testimonials: a friend got a job at a hotel here; David Elias got a new client.',
  community:
    'Join the build — WhatsApp QR for Medellín AI Visible Builders community.',
};

export function isSlideId(value: string): value is SlideId {
  return (SLIDE_IDS as readonly string[]).includes(value);
}

/**
 * Tonight's lineup (Oct 22) — local images only, no DB.
 * The talks slide renders this list directly so the deck works
 * even if the speakers API/DB is down or returns duplicates.
 * Keep in sync with FALLBACK_SPEAKERS in src/lib/speakers.ts.
 */
export type TalkSpeaker = {
  id: string;
  name: string;
  role: string;
  image: string;
  initials: string;
  accent: string;
  imageFit: 'cover' | 'contain';
};

export const TALK_SPEAKERS: TalkSpeaker[] = [
  {
    id: 'marylin-alarcon',
    name: 'Marylin Alarcon',
    role: 'Lead R&D Engineer — AI Lowered The Floor, Our Work Is Now The Ceiling',
    image: '/social/ai-after-hours/speakers/marylin-alarcon.jpg',
    initials: 'MA',
    accent: '#00f2ff',
    imageFit: 'cover',
  },
  {
    id: 'salome-arboleda',
    name: 'Salome Arboleda',
    role: 'Software Developer & Tech Enthusiast — Build real-time quantum apps with AI — use cases',
    image: '/social/ai-after-hours/speakers/salome-arboleda.jpg',
    initials: 'SA',
    accent: '#b44aff',
    imageFit: 'cover',
  },
  {
    id: 'jacobo-blandon',
    name: 'Jacobo Blandón',
    role: 'XR / Blockchain & Digital Product Builder — Turn complex ideas into digital products that actually work',
    image: '/social/ai-after-hours/speakers/jacobo-blandon.jpg',
    initials: 'JB',
    accent: '#ff007a',
    imageFit: 'cover',
  },
];
