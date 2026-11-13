import { redirect } from "next/navigation";

/** English-friendly alias → Spanish-first landing. */
export default function WellnessAlias() {
  redirect("/bienestar");
}
