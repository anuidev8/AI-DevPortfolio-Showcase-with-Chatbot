import type { Metadata } from 'next';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = pageMetadata({
  title: 'Communities — Visible Builders & The AI Hub',
  description:
    'Visible Builders and The AI Hub in Medellín: AI talk nights, live system openings, hackathons, and Colombia’s AI Week (INMERXIA).',
  path: '/community',
});

const jsonLd = {
  '@context': 'https://schema.org',
  ...breadcrumbJsonLd([{ name: 'Communities', path: '/community' }]),
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
