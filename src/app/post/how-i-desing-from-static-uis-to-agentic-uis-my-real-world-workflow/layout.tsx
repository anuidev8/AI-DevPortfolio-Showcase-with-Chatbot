import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "From Static UIs to Agentic UIs: My Real-World Workflow",
  description:
    "De UIs estáticas a UIs agénticas: el flujo de trabajo real de Angel Mateus para diseñar interfaces con IA para salud y mindfulness.",
  path: "/post/how-i-desing-from-static-uis-to-agentic-uis-my-real-world-workflow",
  type: "article",
  locale: "es_CO",
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
