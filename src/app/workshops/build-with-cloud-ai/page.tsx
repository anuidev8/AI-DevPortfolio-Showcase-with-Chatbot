import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { CtaBanner, PageHeader, SitePage } from "@/components/portfolio/SiteChrome";
import { container, outlineButton, primaryButton } from "@/components/portfolio/styles";
import { getWorkshop } from "@/data/workshops";

const workshop = getWorkshop("build-with-cloud-ai");

export const metadata: Metadata = pageMetadata({
  title: workshop
    ? `${workshop.title} — ${workshop.subtitle}`
    : "Build with Cloud AI Workshop",
  description:
    workshop?.summary ??
    "Hands-on workshop: Vercel, Lovable, connectors, MCPs, design and workflows. Medellín · Nov 28.",
  path: "/workshops/build-with-cloud-ai",
});

export default function BuildWithCloudAiWorkshopPage() {
  if (!workshop) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    ...breadcrumbJsonLd([
      { name: "Workshops", path: "/workshops" },
      { name: workshop.title, path: workshop.href },
    ]),
  };

  return (
    <SitePage>
      <JsonLd data={jsonLd} />
      <PageHeader
        eyebrow={`WORKSHOP · ${workshop.dateLabel.toUpperCase()}`}
        title="Build with"
        accent="Cloud AI."
        intro={workshop.summary}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/workshop/visible-builders-build-weekend"
            className={`${primaryButton} px-5 py-3 text-[16px]`}
          >
            Join via Build Weekend
          </Link>
          <Link
            href="/workshop/visible-builders-build-weekend/register-saturday"
            className={`${outlineButton} px-5 py-3 text-[16px]`}
          >
            Propose a session
          </Link>
          <Link href="/workshops" className={`${outlineButton} px-5 py-3 text-[16px]`}>
            All workshops
          </Link>
        </div>
      </PageHeader>

      <section className={container}>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["When", workshop.dateLabel],
            ["Duration", workshop.duration],
            ["Where", workshop.location],
            ["Price", workshop.price],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-pf-border bg-pf-surface px-4 py-4">
              <dt className="font-plex-mono text-[11px] tracking-[0.8px] text-pf-faint">{k}</dt>
              <dd className="mt-1.5 text-[15px] font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${container} pt-16`}>
        <h2 className="m-0 font-display text-[clamp(24px,3vw,32px)] font-extrabold">What you’ll leave with</h2>
        <ul className="mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
          {workshop.outcomes.map((o) => (
            <li
              key={o}
              className="flex items-start gap-3 rounded-2xl border border-pf-line bg-pf-surface/60 px-4 py-4 text-pf-body"
            >
              <Check className="mt-0.5 shrink-0 text-pf-accent" size={18} aria-hidden />
              {o}
            </li>
          ))}
        </ul>
      </section>

      <section className={`${container} pt-16`}>
        <h2 className="m-0 font-display text-[clamp(24px,3vw,32px)] font-extrabold">You’ll learn</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {workshop.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-pf-strong px-4 py-2 font-plex-mono text-[13px] text-pf-soft"
            >
              {tag}
            </span>
          ))}
        </div>
        <ol className="mt-8 m-0 list-none space-y-0 border-t border-pf-line p-0">
          {[
            {
              n: "01",
              t: "Cloud build stack",
              d: "Lovable (or similar) for UI speed, Vercel for a live deploy.",
            },
            {
              n: "02",
              t: "Connectors & tools",
              d: "Find the right tools, wire connectors, plug in account tools safely.",
            },
            {
              n: "03",
              t: "MCPs & power connections",
              d: "How agents and builders talk to real systems.",
            },
            {
              n: "04",
              t: "Design + workflows",
              d: "Shippable design prompts and an idea → prototype → live flow.",
            },
            {
              n: "05",
              t: "When to code",
              d: "Drop into code for env vars, keys, and multi-account setup.",
            },
            {
              n: "BONUS",
              t: "ElevenLabs voice",
              d: "Create a voice, generate speech, and wire ElevenLabs into your site or agent so the build talks back.",
            },
          ].map((b) => (
            <li key={b.n} className="flex gap-5 border-b border-pf-line py-5">
              <span className="w-10 shrink-0 font-plex-mono text-[13px] text-pf-accent">{b.n}</span>
              <div>
                <div className="font-display text-[20px] font-bold">{b.t}</div>
                <p className="mt-1 m-0 text-pf-body">{b.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${container} pt-16`}>
        <h2 className="m-0 font-display text-[clamp(24px,3vw,32px)] font-extrabold">Agenda</h2>
        <ol className="mt-6 m-0 list-none border-t border-pf-line p-0">
          {workshop.agenda.map((row) => (
            <li
              key={row.t + row.l}
              className="flex gap-6 border-b border-pf-line py-3 font-plex-mono text-[14px]"
            >
              <span className="w-12 shrink-0 text-pf-accent">{row.t}</span>
              <span className="text-pf-text">{row.l}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${container} pt-16`}>
        <h2 className="m-0 font-display text-[clamp(24px,3vw,32px)] font-extrabold">Bring / create before</h2>
        <ul className="mt-6 grid list-none gap-2 p-0 sm:grid-cols-2">
          {workshop.bring.map((item) => (
            <li key={item} className="flex items-start gap-2 text-pf-body">
              <Check className="mt-0.5 shrink-0 text-pf-accent" size={16} aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[15px] text-pf-muted">
          Part of{" "}
          <Link href="/workshop/visible-builders-build-weekend" className="text-pf-accent underline">
            Visible Builders Build Weekend
          </Link>
          : free speakers night on Thu 26, then this workshop on Sat 28.
        </p>
      </section>

      <CtaBanner
        title="Ready to ship something live on Saturday?"
        label="See Build Weekend"
        href="/workshop/visible-builders-build-weekend"
      />
    </SitePage>
  );
}
