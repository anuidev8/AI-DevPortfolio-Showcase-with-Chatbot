import type { Metadata } from "next";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ServicePage } from "@/components/portfolio/ServicePage";
import { voiceAiPage } from "@/components/portfolio/service-pages";
import { container, eyebrow, sectionTitle } from "@/components/portfolio/styles";

export const metadata: Metadata = pageMetadata({
  title: "Voice AI Agents & Apps",
  description:
    "Voice agents and voice apps: an AI receptionist for calls and WhatsApp, support and sales calls, real-time voice coaching in your app, connected to your CRM. English and Spanish, built on LiveKit.",
  path: "/voice-ai",
});

const jsonLd = serviceJsonLd({
  name: "Voice AI agents & apps",
  description: metadata.description!,
  path: "/voice-ai",
  serviceType: "AI voice agent development",
});

const transcript = [
  { from: "patient", text: "Hola, ¿tienen cita para limpieza dental este sábado?" },
  { from: "agent", text: "¡Hola! Sí, el sábado tengo 10:00 am o 11:30 am. ¿Cuál prefieres?" },
  { from: "patient", text: "11:30 please. Can we continue in English?" },
  { from: "agent", text: "Of course! You’re booked for Saturday at 11:30 am. I’ll send a reminder the day before." },
] as const;

const industries = [
  { name: "Clinics & medical tourism", line: "Answers foreign patients at night and books consultations." },
  { name: "Real estate", line: "Qualifies buyers and schedules viewings while agents are out." },
  { name: "Hotels", line: "Handles availability, check-in questions and direct bookings." },
  { name: "Restaurants", line: "Takes reservations and answers menu and hours questions." },
];

const capabilities = [
  {
    title: "AI receptionist",
    desc: "Answers calls and WhatsApp 24/7 for clinics, hotels, real estate and events. Replies in under 10 seconds and books straight into your calendar.",
    proof: "Live in 14 days · see the package below",
    href: "#offer",
    wave: [12, 24, 16, 28],
  },
  {
    title: "Customer support by voice",
    desc: "Resolves the common questions, checks orders and bookings, and hands off to a person with the full context when it should.",
    proof: "Huella Digital · SETI × Corficolombiana",
    href: "#cases",
    wave: [20, 10, 28, 16],
  },
  {
    title: "Sales & follow-up calls",
    desc: "Calls new leads within minutes, qualifies them, confirms appointments and sends reminders, so no lead goes cold.",
    proof: "Inbound and outbound calling",
    wave: [10, 22, 28, 18],
  },
  {
    title: "Voice coaching in your app",
    desc: "A real-time voice that guides your users through a session, listens and adapts, on web and mobile.",
    proof: "The School of Breath · breathwork voice agent",
    href: "#cases",
    wave: [26, 14, 20, 10],
  },
  {
    title: "Custom voice apps with LiveKit",
    desc: "Real-time voice features built into your product: voice UI, in-app calls, agents that see context and take actions.",
    proof: "Real-time voice AI on React Native",
    href: "#cases",
    wave: [16, 28, 12, 22],
  },
  {
    title: "Connected to your CRM",
    desc: "Every call logged, summarized and synced to your CRM, calendar and WhatsApp, with leads and bookings tracked each month.",
    proof: "HubSpot, calendars, WhatsApp, your own API",
    wave: [22, 12, 26, 14],
  },
];

// Hover: the card fills, its border turns accent, it lifts 2 px and the wave "speaks" once (a voice that talks).
const WhatIBuild = () => (
  <>
    <section className={`${container} pt-8 pb-24`}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className={eyebrow}>WHAT I BUILD</div>
          <h2 className={`${sectionTitle} mt-2.5 max-w-[720px] text-[clamp(32px,4.5vw,44px)]`}>
            One voice layer, wherever your customers talk to you.
          </h2>
        </div>
        <div className="font-plex-mono text-[13px] text-pf-muted [overflow-wrap:anywhere]">
          LIVEKIT · AWS · GOOGLE CLOUD · WHATSAPP · YOUR CRM
        </div>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((c) => (
          <div
            key={c.title}
            className="group rounded-[20px] border border-pf-border p-6 transition-[border-color,background-color,transform] duration-200 ease-[cubic-bezier(.16,1,.3,1)] hover:border-pf-accent hover:bg-pf-surface motion-safe:hover:-translate-y-0.5"
          >
            <div className="flex h-7 items-center gap-1" aria-hidden="true">
              {c.wave.map((h, i) => (
                <i
                  key={i}
                  style={{ height: h, animationDelay: `${i * 40}ms` }}
                  className="block w-[5px] rounded-[3px] bg-pf-accent motion-safe:group-hover:animate-pf-speak"
                />
              ))}
            </div>
            <h3 className="m-0 mt-4 font-display text-[22px] font-bold leading-[1.2]">{c.title}</h3>
            <p className="mt-2 text-base text-pf-body">{c.desc}</p>
            {c.href ? (
              <a href={c.href} className="mt-4 inline-block border-b border-dotted border-pf-ok/50 font-plex-mono text-[12.5px] text-pf-ok no-underline">
                → {c.proof}
              </a>
            ) : (
              <div className="mt-4 font-plex-mono text-[12.5px] text-pf-faint">→ {c.proof}</div>
            )}
          </div>
        ))}
      </div>
    </section>

    <section className={`${container} pb-24`}>
      <div className="flex flex-wrap items-center gap-10 rounded-3xl border border-pf-border bg-pf-surface p-[clamp(24px,4vw,40px)]">
        <video
          src="/videos/voice-ai-9x16.mp4"
          poster="/videos/voice-ai-poster.jpg"
          controls
          playsInline
          preload="none"
          className="aspect-[9/16] w-full max-w-[300px] rounded-[18px] border border-pf-border bg-black"
        />
        <div className="min-w-0 flex-[1_1_360px]">
          <div className={eyebrow}>WATCH · 45 S</div>
          <h2 className="mt-2.5 font-display text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.1] tracking-[-0.8px]">
            9:42 pm. The clinic is closed. The patient still gets booked.
          </h2>
          <p className="mt-3 text-[17px] text-pf-body">
            See the receptionist answer, switch to English and book the appointment, then everything else the same voice layer does.
          </p>
        </div>
      </div>
    </section>
  </>
);

const ReceptionistCard = () => (
  <div className="rounded-[22px] border border-pf-border bg-pf-surface p-[22px]">
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="font-semibold">Clinic receptionist</div>
        <div className="font-plex-mono text-xs text-pf-muted">WhatsApp · 9:42 pm</div>
      </div>
      <div className="inline-flex items-center gap-1.5 font-plex-mono text-xs text-pf-ok">
        <span className="inline-block h-2 w-2 rounded-full bg-pf-ok motion-safe:animate-pulse" />
        REPLIES IN &lt;10 S
      </div>
    </div>
    <div className="mt-5 flex flex-col gap-2.5 text-[15px]">
      {transcript.map((m, i) =>
        m.from === "patient" ? (
          <div key={i} className="max-w-[85%] self-end rounded-[14px_14px_4px_14px] bg-pf-bubble px-3.5 py-2.5">
            {m.text}
          </div>
        ) : (
          <div key={i} className="max-w-[85%] self-start rounded-[14px_14px_14px_4px] border border-pf-border bg-pf-bg px-3.5 py-2.5 text-pf-soft">
            {m.text}
          </div>
        ),
      )}
    </div>
    <div className="mt-[18px] border-t border-pf-border pt-3.5 text-[13px] text-pf-muted">
      Booked in the calendar · Summary sent to the clinic
    </div>
  </div>
);

export default function VoiceAiPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ServicePage content={voiceAiPage} lead={<WhatIBuild />} showcase={<ReceptionistCard />}>
        <section className={`${container} pt-24`}>
          <div className={eyebrow}>USE CASES</div>
          <h2 className={`${sectionTitle} mt-2.5 text-[clamp(32px,4.5vw,44px)]`}>Built for businesses that live on bookings.</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind) => (
              <div key={ind.name} className="rounded-[20px] border border-pf-border p-6">
                <div className="text-lg font-semibold">{ind.name}</div>
                <p className="mt-1.5 text-[15px] text-pf-body">{ind.line}</p>
              </div>
            ))}
          </div>
        </section>
      </ServicePage>
    </>
  );
}
