import type { Metadata } from "next";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ServicePage } from "@/components/portfolio/ServicePage";
import { mentorshipPage } from "@/components/portfolio/service-pages";

export const metadata: Metadata = pageMetadata({
  title: "AI Engineer Mentorship for Developers",
  description:
    "An 8-week program for LatAm developers to build and sell AI agents: LLMs, RAG, LiveKit voice agents, production, pricing and international clients. Plus AI workshops for companies.",
  path: "/mentorship",
});

const jsonLd = serviceJsonLd({
  name: "AI Engineer mentorship",
  description: metadata.description!,
  path: "/mentorship",
  serviceType: "Technical mentorship and training",
});

export default function MentorshipPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ServicePage content={mentorshipPage} />
    </>
  );
}
