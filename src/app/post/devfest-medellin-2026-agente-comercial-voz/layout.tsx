import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Agente comercial de voz con Google ADK, LiveKit y CopilotKit — DevFest Medellín 2026",
  description:
    "Charla de Angel Mateus en DevFest Medellín 2026 (GDG Medellín): un agente comercial que escucha, entiende y actúa con Google ADK, AG-UI, A2UI, CopilotKit y LiveKit.",
  path: "/post/devfest-medellin-2026-agente-comercial-voz",
  type: "article",
  locale: "es_CO",
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
