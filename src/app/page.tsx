import type { Metadata } from "next";
import { AppLayout } from "@/layout/AppLayout";
import { PortfolioHome } from "@/components/portfolio/PortfolioHome";

export const metadata: Metadata = {
  title: "Angel Arrieta — AI & Full-Stack Engineer",
  description:
    "I build AI products people actually talk to: real-time voice agents, agentic web apps and AI-powered storefronts with Next.js, LiveKit, LangGraph and AWS. 7+ years from first prototype to real users.",
};

export default function Home() {
  return (
    <AppLayout bare>
      <PortfolioHome />
    </AppLayout>
  );
}
