import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/voice-ai", priority: 0.9, changeFrequency: "monthly" },
  { path: "/software", priority: 0.9, changeFrequency: "monthly" },
  { path: "/mentorship", priority: 0.9, changeFrequency: "monthly" },
  { path: "/events", priority: 0.9, changeFrequency: "weekly" },
  { path: "/work", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/post", priority: 0.7, changeFrequency: "weekly" },
  { path: "/post/ai-after-hours", priority: 0.7, changeFrequency: "weekly" },
  { path: "/post/voice-agents-generative-ui-enterprise", priority: 0.6, changeFrequency: "yearly" },
  { path: "/post/google-a2ui-in-action-copilotkit", priority: 0.6, changeFrequency: "yearly" },
  { path: "/post/how-i-desing-from-static-uis-to-agentic-uis-my-real-world-workflow", priority: 0.6, changeFrequency: "yearly" },
  { path: "/post/my-professional-experience", priority: 0.5, changeFrequency: "yearly" },
  { path: "/post/medellin-voice-wellness-hackathon", priority: 0.6, changeFrequency: "monthly" },
  { path: "/post/ai-marketing-networking-night", priority: 0.5, changeFrequency: "monthly" },
  { path: "/noshy-voice", priority: 0.4, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.map((p) => ({
    url: `${siteUrl}${p.path === "/" ? "" : p.path}`,
    lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
