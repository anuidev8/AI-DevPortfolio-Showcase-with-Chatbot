"use client";

import { ApplicationForm } from "@/components/build-weekend/ApplicationForm";

export default function RegisterSpeakerPage() {
  return (
    <ApplicationForm
      kind="thursday_speaker"
      eyebrow="THU 26 NOV · SPEAKER APPLICATION"
      title="Apply to speak Thursday"
      intro="Three speaker slots for AI After Hours-style talks. Tell us who you are, your session, and share a deck link (Google Slides, PDF, or web)."
      accent="#00f2ff"
      submitLabel="Submit speaker application"
    />
  );
}
