import type { Metadata } from "next";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { BienestarPage } from "@/components/portfolio/BienestarPage";

export const metadata: Metadata = pageMetadata({
  title: "IA para coaches de bienestar: fitness, yoga y nutrición",
  description:
    "Página clara para coaches de fitness, yoga, nutrición y wellness que quieren usar IA sin jerga técnica: asistentes, contenido, reservas y ejemplos reales como The School of Breath.",
  path: "/bienestar",
  locale: "es_CO",
  keywords: [
    "IA para coaches",
    "inteligencia artificial wellness",
    "AI fitness coach",
    "asistente WhatsApp yoga",
    "IA nutrición",
    "Angel Mateus",
  ],
});

const jsonLd = serviceJsonLd({
  name: "IA para negocios de bienestar",
  description: metadata.description!,
  path: "/bienestar",
  serviceType: "AI consulting and solutions for wellness businesses",
});

export default function BienestarRoute() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <BienestarPage />
    </>
  );
}
