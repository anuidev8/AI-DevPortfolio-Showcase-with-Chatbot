import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "My Professional Experience",
  description:
    "How Angel Mateus built a wellness product with The School of Breath: an app with 5K+ downloads and a channel with 175K+ users, plus AI and full-stack work.",
  path: "/post/my-professional-experience",
  type: "article",
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
