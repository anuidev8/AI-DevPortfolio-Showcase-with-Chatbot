import type { Metadata } from "next";
import { NoshyVoiceApp } from "@/components/noshy-voice/NoshyVoiceApp";

export const metadata: Metadata = {
  title: "NoShy Voice — Talk. Match. Meet.",
  description: "Answer 3 questions out loud. NoShy finds the people in the room you should talk to tonight.",
};

export default function NoshyVoicePage() {
  return <NoshyVoiceApp />;
}
