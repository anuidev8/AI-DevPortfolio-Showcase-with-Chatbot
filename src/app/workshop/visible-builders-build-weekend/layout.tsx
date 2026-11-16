import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Visible Builders Build Weekend — Nov 26 & 28 Medellín",
  description:
    "Thursday: free AI After Hours with three speakers. Saturday: hands-on workshop with Vercel, Lovable, MCPs, plus a bonus ElevenLabs voice session. Free for Thursday attendees · USD 25 public.",
  path: "/workshop/visible-builders-build-weekend",
  type: "article",
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
