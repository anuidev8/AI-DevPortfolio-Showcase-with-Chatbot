import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Apply as Thursday Speaker — Visible Builders Build Weekend",
  description:
    "Apply to speak at Visible Builders on Thursday Nov 26 in Medellín. Share your profile, socials, session title and deck (Google Slides, PDF or web).",
  path: "/workshop/visible-builders-build-weekend/register-speaker",
  type: "article",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
