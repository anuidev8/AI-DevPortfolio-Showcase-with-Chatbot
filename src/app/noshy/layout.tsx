import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoShy Event Game",
  robots: { index: false, follow: false },
};

export default function NoIndexLayout({ children }: { children: React.ReactNode }) {
  return children;
}
