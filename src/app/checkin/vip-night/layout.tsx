import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Door check-in · VIP Night",
  description: "Door staff check-in for Thursday Nov 12 · VIP Night · La Roca.",
  robots: { index: false, follow: false },
};

export default function VipNightCheckinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
