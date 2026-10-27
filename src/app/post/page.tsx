import type { Metadata } from "next";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";
import { CtaBanner, PageHeader, SitePage } from "@/components/portfolio/SiteChrome";
import { container } from "@/components/portfolio/styles";

export const metadata: Metadata = pageMetadata({
  title: "Articles on Voice AI & Agentic UI",
  description:
    "Notes by Angel Mateus on voice agents, agentic UIs, generative UI and running AI tech events in Medellín.",
  path: "/post",
});

const jsonLd = { "@context": "https://schema.org", ...breadcrumbJsonLd([{ name: "Articles on Voice AI & Agentic UI", path: "/post" }]) };

const posts = [
  {
    href: "/post/voice-agents-generative-ui-enterprise",
    tag: "VOICE AI · ES",
    title: "Voice agents and generative UI for the enterprise",
  },
  {
    href: "/post/google-a2ui-in-action-copilotkit",
    tag: "AGENTIC UI · ES",
    title: "Google A2UI in action with CopilotKit",
  },
  {
    href: "/post/how-i-desing-from-static-uis-to-agentic-uis-my-real-world-workflow",
    tag: "DESIGN · ES",
    title: "From static UIs to agentic UIs: my real-world workflow",
  },
  { href: "/post/my-professional-experience", tag: "CAREER", title: "My professional experience" },
  { href: "/post/ai-after-hours", tag: "EVENT", title: "AI After Hours by Visible Builders" },
  { href: "/post/medellin-voice-wellness-hackathon", tag: "HACKATHON", title: "Agentic Voice Wellness Hackathon" },
  { href: "/post/ai-marketing-networking-night", tag: "EVENT", title: "AI Marketing Networking Night" },
];

export default function PostsPage() {
  return (
    <SitePage>
      <JsonLd data={jsonLd} />
      <PageHeader
        eyebrow="ARTICLES"
        title="Notes from"
        accent="the build."
        intro="Talks, workflows and events: what I’m learning building voice agents and agentic UIs."
      />
      <section className={container}>
        <ul className="m-0 list-none border-t border-pf-line p-0">
          {posts.map((p) => (
            <li key={p.href} className="border-b border-pf-line">
              <Link
                href={p.href}
                className="group flex flex-wrap items-baseline gap-x-6 gap-y-1 py-6 text-pf-text no-underline hover:text-pf-text"
              >
                <span className="flex-[0_0_200px] font-plex-mono text-[13px] tracking-[0.5px] text-pf-muted">{p.tag}</span>
                <span className="min-w-0 flex-[1_1_300px] font-display text-[clamp(22px,3vw,28px)] font-bold leading-[1.2]">
                  {p.title}
                </span>
                <span aria-hidden="true" className="text-pf-accent transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBanner title="Want me to speak at your team or event?" />
    </SitePage>
  );
}
