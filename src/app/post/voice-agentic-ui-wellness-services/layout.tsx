import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "ALTURA Medellín — Voice agents, agentic UI & wellness · Angel Mateus",
    description:
      "Services deck for ALTURA Medellín (AI, startups & international networking): enterprise voice agents, agentic UI, and wellness products by Angel Mateus.",
    path: "/post/voice-agentic-ui-wellness-services",
    type: "article",
    locale: "en_US",
  }),
  alternates: {
    canonical: "/post/voice-agentic-ui-wellness-services",
    languages: {
      en: "/post/voice-agentic-ui-wellness-services",
      "x-default": "/post/voice-agentic-ui-wellness-services",
    },
  },
};

export default function ServicesDeckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
