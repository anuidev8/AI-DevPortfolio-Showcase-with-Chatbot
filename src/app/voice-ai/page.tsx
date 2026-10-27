import type { Metadata } from "next";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ServicePage } from "@/components/portfolio/ServicePage";
import { voiceAiPage } from "@/components/portfolio/service-pages";
import { container, eyebrow, sectionTitle } from "@/components/portfolio/styles";

export const metadata: Metadata = pageMetadata({
  title: "AI Receptionist & Voice Agents",
  description:
    "An AI receptionist that answers calls and WhatsApp 24/7 in English and Spanish and books appointments. Live in 14 days, with a 15-appointment guarantee.",
  path: "/voice-ai",
});

const jsonLd = serviceJsonLd({
  name: "AI receptionist & voice agents",
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
      <ServicePage content={voiceAiPage} showcase={<ReceptionistCard />}>
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
