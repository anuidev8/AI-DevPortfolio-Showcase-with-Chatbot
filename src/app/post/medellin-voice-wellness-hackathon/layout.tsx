import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Agentic Voice Wellness Hackathon Medellín",
  description:
    "A hackathon in Medellín to build voice agents that help people breathe, move, focus and rest, from a voice AI prep workshop to demo day.",
  path: "/post/medellin-voice-wellness-hackathon",
  type: "article",
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
