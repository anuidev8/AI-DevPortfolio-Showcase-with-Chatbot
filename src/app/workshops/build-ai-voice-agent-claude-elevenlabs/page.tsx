import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { SitePage } from "@/components/portfolio/SiteChrome";
import { container, primaryButton } from "@/components/portfolio/styles";
import { MobileSeatBar, RevealList, SeatForm, SeatLink } from "@/components/portfolio/WorkshopSeat";
import { getWorkshop } from "@/data/workshops";

const workshop = getWorkshop("build-ai-voice-agent-claude-elevenlabs");

export const metadata: Metadata = pageMetadata({
  title: "Build an AI Voice Agent with Claude + ElevenLabs — Workshop in Medellín",
  description:
    "No-code workshop: create your custom AI voice and voice agent with ElevenLabs, plus a lead-capture landing page built with Claude. Sat Nov 28, 1:30–5:30 PM, Medellín.",
  path: "/workshops/build-ai-voice-agent-claude-elevenlabs",
});

const mono = "font-plex-mono text-[13px] tracking-[1px]";
const h3 = "m-0 mt-2 font-display text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.8px]";

const leave = [
  ["A 30-day content plan", "Hooks, scripts and captions for your offer."],
  ["A live landing page", "Built with Claude, mobile-ready, with your URL."],
  ["Lead capture", "Form, WhatsApp button, FAQ and booking link."],
  ["Your custom AI voice", "Made in ElevenLabs, for Reels, ads and courses."],
  ["A voice assistant", "Answers visitors in your voice and collects their contact."],
  ["A next-30-days plan", "What to post, test and improve after Saturday."],
];

const flow: { t: string; title: string; d?: string }[] = [
  { t: "1:30", title: "Plan", d: "Your audience, your offer and a 30-day content plan." },
  { t: "2:30", title: "Build", d: "Your landing page built with Claude, with form, WhatsApp and booking." },
  { t: "3:15", title: "Break · 15 min" },
  { t: "3:30", title: "Voice", d: "Your custom brand voice and an assistant that uses it, embedded on your page." },
  { t: "4:50", title: "Ship", d: "Publish, show what you built, and leave with your plan." },
];

const audience = [
  "Entrepreneurs",
  "Creators",
  "Coaches & courses",
  "Marketers",
  "Clinics & wellness",
  "Real estate",
  "Restaurants & hotels",
];

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

      <div className="sticky top-0 z-30 border-b border-pf-line bg-pf-bg/90 backdrop-blur">
        <div className={`${container} flex h-16 items-center justify-between gap-4`}>
          <span className={`${mono} text-[12px] text-pf-text`}>AI VOICE AGENT WORKSHOP</span>
          <span className={`${mono} hidden text-[12px] text-pf-muted md:inline`}>SAT NOV 28 · 1:30–5:30 PM · MEDELLÍN</span>
          <SeatLink className={`${primaryButton} min-h-[40px] px-4 py-2 text-[14px]`}>Save my seat</SeatLink>
        </div>
      </div>

      <header id="workshop-hero" className={`${container} pt-[72px] pb-6`}>
        <div className={`${mono} text-pf-accent`}>AI VOICE AGENT WORKSHOP · CLAUDE + ELEVENLABS · NO CODE</div>
        <h1 className="m-0 mt-3.5 font-display text-[clamp(48px,10vw,112px)] font-extrabold leading-[1.02] tracking-[-2.5px]">
          MORE CLIENTS
          <br />
          <span className="text-pf-accent">WITH AI</span>
        </h1>
        <div className={`${mono} mt-5 text-pf-soft`}>SATURDAY NOV 28 · 1:30 PM – 5:30 PM · MEDELLÍN</div>
        <p className="m-0 mt-10 max-w-[780px] font-display text-[clamp(24px,3.4vw,36px)] font-bold leading-[1.15] tracking-[-0.6px]">
          One afternoon. A page, your own AI voice, and an assistant that answers your customers.
        </p>
        <p className="m-0 mt-4 max-w-[640px] text-lg text-pf-body">
          No code. Bring your laptop and your business. At 5:30 you leave with a live page that captures leads,
          plus a voice assistant that talks like you.
        </p>
        <SeatLink className={`${primaryButton} mt-8 px-6 py-3.5 text-[16px]`}>Save my seat →</SeatLink>
      </header>

      <section className={`${container} pt-[88px]`}>
        <div className={`${mono} text-pf-accent`}>01</div>
        <h2 className={h3}>What you walk out with</h2>
        <RevealList className="m-0 mt-7 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {leave.map(([t, d], i) => (
            <li
              key={t}
              style={{ transitionDelay: `${i * 80}ms` }}
              className="flex translate-y-2 items-start gap-3.5 rounded-2xl border border-pf-border p-[18px] opacity-0 transition-[opacity,transform,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:border-pf-strong group-data-[on=true]/reveal:translate-y-0 group-data-[on=true]/reveal:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100"
            >
              <span className="mt-0.5 font-plex-mono text-pf-ok" aria-hidden>
                ✓
              </span>
              <span className="text-pf-soft">
                <b className="block text-[17px] text-pf-text">{t}</b>
                {d}
              </span>
            </li>
          ))}
        </RevealList>
      </section>

      <section className={`${container} pt-[88px]`}>
        <div className={`${mono} text-pf-accent`}>02</div>
        <h2 className={h3}>How the afternoon goes</h2>
        <ol className="m-0 mt-7 list-none border-t border-pf-line p-0">
          {flow.map((row) => (
            <li key={row.t} className="grid gap-1.5 border-b border-pf-line py-5 md:grid-cols-[120px_minmax(0,1fr)] md:gap-5">
              <time className={`font-plex-mono text-sm md:pt-1 ${row.d ? "text-pf-accent" : "text-pf-faint"}`}>{row.t}</time>
              {row.d ? (
                <div>
                  <div className="font-display text-[22px] font-bold">{row.title}</div>
                  <p className="m-0 mt-1 text-[15.5px] text-pf-body">{row.d}</p>
                </div>
              ) : (
                <div className="font-plex-mono text-base text-pf-faint">{row.title}</div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className={`${container} pt-[88px]`}>
        <div className={`${mono} text-pf-accent`}>03</div>
        <h2 className={h3}>Who it&apos;s for</h2>
        <p className="m-0 mt-3 max-w-[640px] text-pf-body">
          People who sell something and want more leads without learning to code.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {audience.map((a) => (
            <span key={a} className="rounded-full border border-pf-chip px-3.5 py-2 text-sm text-pf-soft">
              {a}
            </span>
          ))}
        </div>
      </section>

      <section className={`${container} pt-[88px]`}>
        <div className={`${mono} text-pf-accent`}>04</div>
        <h2 className={h3}>Bring</h2>
        <ul className="m-0 mt-6 grid list-none gap-2.5 p-0 sm:grid-cols-2">
          {workshop.bring.map((b) => (
            <li key={b} className="flex gap-3 text-pf-soft">
              <span className="font-bold text-pf-ok" aria-hidden>
                ✓
              </span>
              {b}
            </li>
          ))}
        </ul>
      </section>

      <section id="seat" className={`${container} scroll-mt-20 pt-[88px] pb-32`}>
        <div className={`${mono} text-pf-accent`}>05</div>
        <h2 className={h3}>Save your seat</h2>
        <div className="mt-7 grid items-start gap-9 rounded-3xl border border-pf-border bg-[radial-gradient(120%_120%_at_0%_0%,#5B8CFF1F,transparent_55%)] bg-pf-surface p-[clamp(24px,4vw,44px)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <p className="m-0 text-pf-body">
              Seats are limited so everyone gets help. Send this and I&apos;ll reply on WhatsApp with price, address
              and the prep checklist.
            </p>
            <dl className="m-0 mt-5 grid gap-2 text-[15px] text-pf-soft">
              {[
                ["WHEN", "Sat Nov 28 · 1:30–5:30 PM"],
                ["WHERE", workshop.location],
                ["LEVEL", workshop.level],
              ].map(([k, v]) => (
                <div key={k} className="flex">
                  <dt className="w-16 shrink-0 pt-0.5 font-plex-mono text-[12px] text-pf-faint">{k}</dt>
                  <dd className="m-0">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <SeatForm workshopLine="the AI Voice Agent workshop with Claude + ElevenLabs (Sat Nov 28, 1:30–5:30 PM)" />
        </div>
      </section>

      <MobileSeatBar label="Save my seat" />
    </SitePage>
  );
}
