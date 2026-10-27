import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI After Hours — Medellín AI Builder Talks",
  description:
    "AI After Hours by Visible Builders: Medellín builders share what they ship with AI. Real talks, live demos and the AI builder community, hosted by Angel Mateus.",
  path: "/post/ai-after-hours",
  type: "article",
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
