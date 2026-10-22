export const SLIDE_IDS = ['intro', 'purpose', 'talks', 'benefits', 'community'] as const;
export type SlideId = (typeof SLIDE_IDS)[number];

export const SLIDE_SUMMARIES: Record<SlideId, string> = {
  intro:
    'Title slide: AI After Hours by Visible Builders.',
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
