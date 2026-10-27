import type { Metadata } from "next";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Experience } from "@/components/portfolio/Experience";
import { CtaBanner, PageHeader, SitePage } from "@/components/portfolio/SiteChrome";
import { WorkSection } from "@/components/portfolio/WorkSection";

export const metadata: Metadata = pageMetadata({
  title: "Work & Case Studies",
  description:
    "Voice AI agents, AI e-commerce, platforms and events shipped for SETI, The School of Breath, QSmiley, Palenke and Medellín’s AI community.",
  path: "/work",
});

const jsonLd = { "@context": "https://schema.org", ...breadcrumbJsonLd([{ name: "Work & Case Studies", path: "/work" }]) };

export default function WorkPage() {
  return (
    <SitePage>
      <JsonLd data={jsonLd} />
      <PageHeader
        eyebrow="SELECTED WORK"
        title="Shipped, used,"
        accent="measured."
        intro="Voice agents, AI storefronts, platforms and community events, each one in front of real users."
      />
      <WorkSection />
      <Experience />
      <CtaBanner title="Want results like these for your company?" />
    </SitePage>
  );
}
