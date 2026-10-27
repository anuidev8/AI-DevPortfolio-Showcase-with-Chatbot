'use client'

import { useState } from "react";
import { whatsapp } from "./content";
import { primaryButton } from "./styles";

const topics = ["Enterprise software", "AI voice agent", "AI Engineer mentorship", "Company AI workshop", "Event or sponsorship", "Something else"];

const field =
  "mt-1.5 block w-full rounded-xl border border-pf-strong bg-pf-bg px-3.5 py-3 text-base text-pf-text placeholder:text-pf-faint focus:border-pf-accent focus:outline-none";

// No backend: the form composes a WhatsApp message so every lead lands in one inbox.
export const ContactForm = () => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `Hi Angel, I'm ${name.trim()}${company.trim() ? ` from ${company.trim()}` : ""}.`,
      `Topic: ${topic}`,
      message.trim(),
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsapp(text), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 rounded-[22px] border border-pf-border bg-pf-surface p-[clamp(20px,3vw,32px)]">
      <div className="flex flex-wrap gap-5">
        <label className="min-w-0 flex-[1_1_220px] text-[15px] font-semibold">
          Name
          <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} />
        </label>
        <label className="min-w-0 flex-[1_1_220px] text-[15px] font-semibold">
          Company <span className="font-normal text-pf-muted">(optional)</span>
          <input value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" className={field} />
        </label>
      </div>
      <label className="text-[15px] font-semibold">
        What can I help with?
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={field}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="text-[15px] font-semibold">
        Message
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="A few lines about your project, team or event."
          className={field}
        />
      </label>
      <button type="submit" className={`${primaryButton} px-[26px] py-4 text-[17px]`}>
        Send on WhatsApp
      </button>
      <p className="m-0 text-[13px] text-pf-muted">Opens WhatsApp with your message ready to send.</p>
    </form>
  );
};
