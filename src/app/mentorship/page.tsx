import type { Metadata } from "next";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ServicePage } from "@/components/portfolio/ServicePage";
import { mentorshipPage } from "@/components/portfolio/service-pages";

export const metadata: Metadata = pageMetadata({
  title: "AI Engineer Mentorship: Skills, Leadership & Network",
  description:
    "An 8-week mentorship for LatAm developers: build AI agents (LLMs, RAG, LiveKit voice agents), grow as a leader, build a builder mindset and get warm intros to Medellín’s AI network.",
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
