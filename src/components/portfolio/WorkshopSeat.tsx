"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { whatsapp } from "./content";

const SEAT_ID = "seat";

/** Scrolls to the seat form, then focuses the name field. */
export const SeatLink = ({ className, children }: { className?: string; children: ReactNode }) => (
  <a
    href={`#${SEAT_ID}`}
    className={className}
    data-interaction="click → scrolls to the seat form, name field focused → ready to type"
    onClick={() => setTimeout(() => document.getElementById("seat-name")?.focus({ preventScroll: true }), 500)}
  >
    {children}
  </a>
);

/** Items rise in one after another the first time the list scrolls into view. */
export const RevealList = ({ className, children }: { className?: string; children: ReactNode }) => {
  const ref = useRef<HTMLUListElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <ul
      ref={ref}
      data-on={on}
      data-motion="items rise in one after another on scroll = the pieces you collect during the afternoon"
      className={`group/reveal ${className ?? ""}`}
    >
      {children}
    </ul>
  );
};

/** Mobile-only bar that appears after the hero and hides while the form is on screen. */
export const MobileSeatBar = ({ label }: { label: string }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("workshop-hero");
    const seat = document.getElementById(SEAT_ID);
    if (!hero || !seat) return;
    let pastHero = false;
    let atForm = false;
    const sync = () => setShow(pastHero && !atForm);
    const a = new IntersectionObserver(([e]) => {
      pastHero = !e.isIntersecting;
      sync();
    });
    const b = new IntersectionObserver(
      ([e]) => {
        atForm = e.isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    );
    a.observe(hero);
    b.observe(seat);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, []);
  return (
    <div
      data-motion="slides up from the bottom = signing up is always one tap away"
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-pf-line bg-pf-bg/95 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none md:hidden ${
        show ? "translate-y-0" : "translate-y-[110%]"
      }`}
    >
      <SeatLink className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-pf-accent font-semibold text-pf-bg no-underline">
        {label}
      </SeatLink>
    </div>
  );
};

const roles = [
  "Entrepreneur / small business",
  "Creator",
  "Coach or course creator",
  "Marketer / agency",
  "Clinic or wellness",
  "Real estate",
  "Restaurant or hotel",
  "Other",
];

const field =
  "min-h-[50px] w-full rounded-xl border bg-pf-bg px-3.5 py-3 text-base text-pf-text outline-none transition-[border-color,box-shadow] placeholder:text-pf-faint focus:border-pf-accent focus:shadow-[0_0_0_3px_#5B8CFF33]";
const label = "mb-1.5 block font-plex-mono text-[12px] font-medium tracking-[0.8px] text-pf-muted";

/** Seat request form: validates, then opens WhatsApp with a pre-filled message. Nothing is stored. */
export const SeatForm = ({ workshopLine }: { workshopLine: string }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({ name: false, phone: false });
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = { name: !name.trim(), phone: phone.replace(/\D/g, "").length < 7 };
    setErrors(next);
    if (next.name || next.phone) return;
    const msg =
      `Hi Angel! I want a seat at ${workshopLine}.\n\nName: ${name.trim()}\nWhatsApp: ${phone.trim()}` +
      (role ? `\nI am: ${role}` : "");
    const url = whatsapp(msg);
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-3.5"
      data-interaction="submit → empty fields turn red with a hint; when valid WhatsApp opens with a pre-filled message → button reads 'Sent to WhatsApp ✓' with a fallback link"
    >
      <div>
        <label htmlFor="seat-name" className={label}>
          NAME
        </label>
        <input
          id="seat-name"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={errors.name}
          aria-describedby={errors.name ? "seat-name-err" : undefined}
          className={`${field} ${errors.name ? "border-[#FF6B6B]" : "border-pf-strong"}`}
        />
        {errors.name && (
          <p id="seat-name-err" className="m-0 mt-1.5 text-[13px] text-[#FF8A8A]">
            Add your name
          </p>
        )}
      </div>
      <div>
        <label htmlFor="seat-phone" className={label}>
          WHATSAPP
        </label>
        <input
          id="seat-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+57 300 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={errors.phone}
          aria-describedby={errors.phone ? "seat-phone-err" : undefined}
          className={`${field} ${errors.phone ? "border-[#FF6B6B]" : "border-pf-strong"}`}
        />
        {errors.phone && (
          <p id="seat-phone-err" className="m-0 mt-1.5 text-[13px] text-[#FF8A8A]">
            Add a WhatsApp number
          </p>
        )}
      </div>
      <div>
        <label htmlFor="seat-role" className={label}>
          WHAT DO YOU DO?
        </label>
        <select
          id="seat-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={`${field} border-pf-strong`}
        >
          <option value="">Choose one (optional)</option>
          {roles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className={`inline-flex min-h-[54px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border-0 text-[17px] font-semibold text-[#062B14] transition-[background-color,transform] hover:-translate-y-px ${
          sentUrl ? "bg-pf-ok" : "bg-[#25D366] hover:bg-[#3BE37A]"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 flex-none">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.4.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.1.3.7 1.1 1.4 1.8 1 .9 1.8 1.1 2.1 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.4Z" />
        </svg>
        {sentUrl ? "Sent to WhatsApp ✓" : "Save my seat on WhatsApp"}
      </button>
      <p className="m-0 text-center text-[13px] leading-normal text-pf-faint" aria-live="polite">
        {sentUrl ? (
          <>
            Didn&apos;t open?{" "}
            <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="text-pf-soft underline">
              Tap here to open WhatsApp
            </a>
          </>
        ) : (
          "Opens WhatsApp with your message ready to send. No payment yet."
        )}
      </p>
    </form>
  );
};
