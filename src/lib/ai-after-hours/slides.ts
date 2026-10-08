export const SLIDE_IDS = ['intro', 'purpose', 'talks', 'benefits', 'community'] as const;
export type SlideId = (typeof SLIDE_IDS)[number];

export const SLIDE_SUMMARIES: Record<SlideId, string> = {
  intro:
    'Title slide: AI After Hours by Visible Builders.',
  purpose:
    'Why we gather: Real Talks, Real Experiences, New Connections for Medellín AI builders.',
  talks:
    'Speakers: Daniel Domínguez (Founder @ Braina IA) on how an AI company works from the inside, with a live audit; Emily Ruiz Testa (Growth @wallib.app) on the AI tools she built to organize her finances; Carlos Garcia (The Godfather of Traffic) on digital marketing, paid media and business growth.',
  benefits:
    'Benefits: Community & Connections, Networking, Grow. Testimonials: a friend got a job at a hotel here; David Elias got a new client.',
  community:
    'Join the build — WhatsApp QR for Medellín AI Visible Builders community.',
};

export function isSlideId(value: string): value is SlideId {
  return (SLIDE_IDS as readonly string[]).includes(value);
}
