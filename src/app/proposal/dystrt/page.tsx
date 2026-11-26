import { Barlow_Condensed, DM_Sans, JetBrains_Mono } from "next/font/google";
import DystrtProposal from "@/components/dystrt-proposal/DystrtProposal";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800", "900"], variable: "--font-dy-display" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-dy-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dy-mono" });

export default function DystrtProposalPage() {
  return <DystrtProposal fontClassName={`${display.variable} ${body.variable} ${mono.variable}`} />;
}
