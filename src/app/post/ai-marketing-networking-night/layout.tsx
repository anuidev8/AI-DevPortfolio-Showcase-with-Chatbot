import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI Marketing Networking Night Medellín",
  description:
    "A private dinner in Medellín for founders and marketers on AI, websites, CRM and automation for lead generation, with partner brands.",
  path: "/post/ai-marketing-networking-night",
  type: "article",
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
