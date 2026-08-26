import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check-in · AI After Hours",
  description: "Door staff check-in list for AI After Hours.",
  robots: { index: false, follow: false },
};

export default function CheckinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
