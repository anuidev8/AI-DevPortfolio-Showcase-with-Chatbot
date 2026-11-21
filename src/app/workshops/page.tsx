import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { CtaBanner, PageHeader, SitePage } from "@/components/portfolio/SiteChrome";
import { container, outlineButton, primaryButton } from "@/components/portfolio/styles";
import { workshops } from "@/data/workshops";

export const metadata: Metadata = pageMetadata({
  title: "AI Workshops in Medellín",
  description:
    "Hands-on AI workshops in Medellín with Angel Mateus. First up: Build Your AI Voice Agent with Claude + ElevenLabs · Sat Nov 28, 1:30–5:30 PM.",
  path: "/workshops",
});

const jsonLd = {
  "@context": "https://schema.org",
  ...breadcrumbJsonLd([{ name: "Workshops", path: "/workshops" }]),
};

export default function WorkshopsPage() {
  const featured = workshops[0];

  return (
    <SitePage>
      <JsonLd data={jsonLd} />
      <PageHeader
        eyebrow="WORKSHOPS"
        title="Learn by"
        accent="shipping."
        intro="Hands-on sessions for builders in Medellín. Leave with a live URL, not just slides."
      />

      {featured && (
        <section className={container}>
          <article className="overflow-hidden rounded-[28px] border border-pf-border bg-pf-surface">
            <div className="border-b border-pf-line px-[clamp(20px,3vw,36px)] py-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-pf-accent/15 px-3 py-1 font-plex-mono text-[12px] tracking-[0.5px] text-pf-accent">
                  FEATURED · {featured.status === "open" ? "OPEN" : featured.status.toUpperCase()}
                </span>
                <span className="font-plex-mono text-[13px] text-pf-muted">{featured.dateLabel}</span>
              </div>
            </div>
            <div className="px-[clamp(20px,3vw,36px)] py-[clamp(28px,4vw,40px)]">
              <h2 className="m-0 font-display text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.08] tracking-[-1px]">
                {featured.title}
              </h2>
              <p className="mt-2 text-lg text-pf-accent">{featured.subtitle}</p>
              <p className="mt-4 max-w-[640px] text-pf-body">{featured.summary}</p>
              <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["When", featured.dateLabel],
                  ["Duration", featured.duration],
                  ["Where", featured.location],
                  ["Level", featured.level],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-pf-line bg-pf-bg/40 px-4 py-3">
                    <dt className="font-plex-mono text-[11px] tracking-[0.8px] text-pf-faint">{k}</dt>
                    <dd className="mt-1 text-[15px] font-semibold text-pf-text">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-pf-line px-3 py-1 font-plex-mono text-[12px] text-pf-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={featured.href} className={`${primaryButton} px-5 py-3 text-[16px]`}>
                  {featured.ctaLabel}
                </Link>
                <Link
                  href="/workshop/visible-builders-build-weekend"
                  className={`${outlineButton} px-5 py-3 text-[16px]`}
                >
                  Full Build Weekend
                </Link>
                {featured.secondaryHref && (
                  <Link href={featured.secondaryHref} className={`${outlineButton} px-5 py-3 text-[16px]`}>
                    {featured.secondaryLabel}
                  </Link>
                )}
              </div>
            </div>
          </article>
        </section>
      )}

      <section className={`${container} pt-16`}>
        <h2 className="m-0 font-display text-[clamp(24px,3vw,32px)] font-extrabold tracking-[-0.8px]">
          All workshops
        </h2>
        <ul className="mt-6 m-0 list-none border-t border-pf-line p-0">
          {workshops.map((w) => (
            <li key={w.slug} className="border-b border-pf-line">
              <Link
                href={w.href}
                className="group flex flex-wrap items-baseline gap-x-6 gap-y-2 py-6 text-pf-text no-underline hover:text-white"
              >
                <span className="flex-[0_0_180px] font-plex-mono text-[13px] tracking-[0.5px] text-pf-muted">
                  {w.dateLabel}
                </span>
                <span className="min-w-0 flex-[1_1_280px]">
                  <span className="block font-display text-[clamp(20px,2.5vw,26px)] font-bold leading-[1.2]">
                    {w.title}
                  </span>
                  <span className="mt-1 block text-[15px] text-pf-body">{w.subtitle}</span>
                </span>
                <span aria-hidden="true" className="text-pf-accent transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[15px] text-pf-muted">
          Want to lead a block?{" "}
          <Link href="/workshop/visible-builders-build-weekend/register-saturday" className="text-pf-accent underline">
            Propose a Saturday session
          </Link>
          {" · "}
          <Link href="/workshop/visible-builders-build-weekend/register-speaker" className="text-pf-accent underline">
            Apply as Thursday speaker
          </Link>
        </p>
      </section>

      <CtaBanner
        title="Need a private workshop for your team?"
        label="Book a company workshop"
        href="/contact"
      />
    </SitePage>
  );
}
