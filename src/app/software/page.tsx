import type { Metadata } from "next";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ServicePage } from "@/components/portfolio/ServicePage";
import { softwarePage } from "@/components/portfolio/service-pages";

export const metadata: Metadata = pageMetadata({
  title: "Enterprise AI Software & AI Agents",
  description:
    "Custom AI platforms, internal tools, integrations and AI agents connected to your company’s data. Discovery, build, launch and support for LatAm and US teams.",
  path: "/software",
});

const jsonLd = serviceJsonLd({
  name: "Enterprise AI software",
  description: metadata.description!,
  path: "/software",
  serviceType: "Custom software development",
});

export default function SoftwarePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ServicePage content={softwarePage} />
    </>
  );
}
