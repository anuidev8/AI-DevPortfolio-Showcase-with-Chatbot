export const SLIDE_IDS = ['intro', 'purpose', 'talks', 'community'] as const;
export type SlideId = (typeof SLIDE_IDS)[number];

export const SLIDE_SUMMARIES: Record<SlideId, string> = {
  intro:
    'Title slide: AI After Hours by Visible Builders. Tagline The Power of Being Visible. Sponsors School of Breath and Vivus La Martina.',
  purpose:
    'Why we gather: Real Talks, Real Experiences, New Connections for Medellín AI builders.',
  talks:
    'Speakers: Oscar Barajas on AI legal tech, Jennifer Salazar Duke on AI workflows, Hector Cantillo on going from consumer to creator.',
  community:
    'Join the build — WhatsApp QR for Medellín AI Visible Builders community.',
};

export function isSlideId(value: string): value is SlideId {
  return (SLIDE_IDS as readonly string[]).includes(value);
}
