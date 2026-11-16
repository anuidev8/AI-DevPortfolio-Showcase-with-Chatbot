import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Apply for Saturday Session — Visible Builders Build Weekend",
  description:
    "Propose a Saturday Nov 28 workshop session: profile, socials, video proposal, examples, and deck (Google Slides, PDF or web).",
  path: "/workshop/visible-builders-build-weekend/register-saturday",
  type: "article",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
