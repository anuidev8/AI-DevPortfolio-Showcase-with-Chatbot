import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "DY//STRT Launch Proposal",
  description:
    "Shopify + Printful launch proposal for DY//STRT / No Signal Club: the store build, timeline, investment and the vision after launch.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/proposal/dystrt" },
};

export const viewport: Viewport = {
  themeColor: "#101010",
};

export default function DystrtProposalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
