import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Voice Agents & Generative UI for the Enterprise",
  description:
    "Cómo los agentes de voz con IA escuchan, entienden, deciden, actúan y generan la UI correcta en empresas. Charla de Angel Mateus sobre LiveKit, LangGraph y UI generativa.",
  path: "/post/voice-agents-generative-ui-enterprise",
  type: "article",
  locale: "es_CO",
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
