import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Google A2UI in Action with CopilotKit",
  description:
    "Dynamic generative UI frontends con Google A2UI, CopilotKit y agentes de IA: cómo un agente genera interfaces en tiempo real. Por Angel Mateus.",
  path: "/post/google-a2ui-in-action-copilotkit",
  type: "article",
  locale: "es_CO",
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
