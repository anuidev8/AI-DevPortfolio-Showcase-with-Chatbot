import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { WorkshopLanding } from "@/components/portfolio/WorkshopLanding";
import { getWorkshop } from "@/data/workshops";

const workshop = getWorkshop("build-ai-voice-agent-claude-elevenlabs");

export const metadata: Metadata = pageMetadata({
  title: "Taller: crea tu agente de voz con IA (Claude + ElevenLabs) · AI Voice Agent Workshop Medellín",
  description:
    "Taller práctico sin código en Medellín: tu página, tu propia voz con IA y un asistente que atiende a tus clientes, con Claude + ElevenLabs. Sáb 28 nov, 1:30–5:30 PM. Also in English.",
  path: "/workshops/build-ai-voice-agent-claude-elevenlabs",
});

export default function BuildAiVoiceAgentWorkshopPage() {
  if (!workshop) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    ...breadcrumbJsonLd([
      { name: "Workshops", path: "/workshops" },
      { name: workshop.title, path: workshop.href },
    ]),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <WorkshopLanding />
    </>
  );
}
