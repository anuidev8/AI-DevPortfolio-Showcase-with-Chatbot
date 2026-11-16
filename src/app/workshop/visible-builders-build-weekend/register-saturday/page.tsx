"use client";

import { ApplicationForm } from "@/components/build-weekend/ApplicationForm";

export default function RegisterSaturdayPage() {
  return (
    <ApplicationForm
      kind="saturday_session"
      eyebrow="SAT 28 NOV · SESSION APPLICATION"
      title="Propose a Saturday session"
      intro="Apply to lead or co-lead a hands-on block. Same profile fields as speakers, plus a video proposal, examples of your work, and a deck link (Google Slides, PDF, or web)."
      accent="#ff007a"
      submitLabel="Submit Saturday application"
    />
  );
}
