import type { Metadata } from "next";
import { siteDescription, siteName } from "@/lib/seo";
import { PortfolioHome } from "@/components/portfolio/PortfolioHome";
import { SitePage } from "@/components/portfolio/SiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Angel Mateus — AI Voice Agents, Software, Mentorship & Events" },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: { url: "/", siteName, type: "website", locale: "en_US" },
};

export default function Home() {
  return (
    <SitePage>
      <PortfolioHome />
    </SitePage>
  );
}
