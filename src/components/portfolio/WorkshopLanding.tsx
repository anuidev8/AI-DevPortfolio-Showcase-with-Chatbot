"use client";

import { useEffect, useState } from "react";
import { SitePage } from "./SiteChrome";
import { container, primaryButton } from "./styles";
import { MobileSeatBar, RevealList, SeatForm, SeatLink } from "./WorkshopSeat";
import { WORKSHOP_LANG_KEY, workshopCopy, type WorkshopLang } from "./workshop-copy";

const mono = "font-plex-mono text-[13px] tracking-[1px]";
const h3 = "m-0 mt-2 font-display text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.8px]";

/** ES/EN pill, same pattern as /bienestar. */
const LangToggle = ({ lang, onChange, label }: { lang: WorkshopLang; onChange: (l: WorkshopLang) => void; label: string }) => (
  <div
    role="group"
    aria-label={label}
    className="inline-flex shrink-0 rounded-full border border-pf-border p-1"
    data-interaction="tap ES/EN → whole page swaps language instantly, choice is remembered → active pill stays filled blue"
  >
    {(["es", "en"] as const).map((code) => (
      <button
        key={code}
        type="button"
        onClick={() => onChange(code)}
        aria-pressed={lang === code}
        className={`min-h-[32px] rounded-full px-3 text-[13px] font-semibold tracking-[0.5px] transition-colors ${
          lang === code ? "bg-pf-accent text-pf-bg" : "text-pf-soft hover:text-white"
        }`}
      >
        {code.toUpperCase()}
      </button>
    ))}
  </div>
);

export const WorkshopLanding = () => {
  const [lang, setLang] = useState<WorkshopLang>("es");

  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("lang");
      const saved = localStorage.getItem(WORKSHOP_LANG_KEY);
      const pick = fromUrl === "es" || fromUrl === "en" ? fromUrl : saved;
      if (pick === "es" || pick === "en") setLang(pick);
    } catch {
      /* storage unavailable: keep default */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const change = (next: WorkshopLang) => {
    setLang(next);
    try {
      localStorage.setItem(WORKSHOP_LANG_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const c = workshopCopy[lang];

  return (
    <SitePage>
      <div className="sticky top-0 z-30 border-b border-pf-line bg-pf-bg/90 backdrop-blur">
        <div className={`${container} flex h-16 items-center justify-between gap-3`}>
          <span className={`${mono} hidden text-[12px] text-pf-text sm:inline`}>{c.bar.name}</span>
          <span className={`${mono} hidden text-[12px] text-pf-muted lg:inline`}>{c.bar.when}</span>
          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
            <LangToggle lang={lang} onChange={change} label={c.langLabel} />
            <SeatLink className={`${primaryButton} min-h-[40px] px-4 py-2 text-[14px]`}>{c.bar.cta}</SeatLink>
          </div>
        </div>
      </div>

      <header id="workshop-hero" className={`${container} pt-[72px] pb-6`}>
        <div className={`${mono} text-pf-accent`}>{c.eyebrow}</div>
        <h1 className="m-0 mt-3.5 font-display text-[clamp(48px,10vw,112px)] font-extrabold leading-[1.02] tracking-[-2.5px]">
          {c.title}
          <br />
          <span className="text-pf-accent">{c.titleAccent}</span>
        </h1>
        <div className={`${mono} mt-5 text-pf-soft`}>{c.date}</div>
        <p className="m-0 mt-10 max-w-[780px] font-display text-[clamp(24px,3.4vw,36px)] font-bold leading-[1.15] tracking-[-0.6px]">
          {c.lead}
        </p>
        <p className="m-0 mt-4 max-w-[640px] text-lg text-pf-body">{c.body}</p>
        <SeatLink className={`${primaryButton} mt-8 px-6 py-3.5 text-[16px]`}>{c.heroCta}</SeatLink>
      </header>

      <section className={`${container} pt-[88px]`}>
        <div className={`${mono} text-pf-accent`}>01</div>
        <h2 className={h3}>{c.leaveTitle}</h2>
        <RevealList className="m-0 mt-7 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {c.leave.map(([t, d], i) => (
            <li
              key={i}
              style={{ transitionDelay: `${i * 80}ms` }}
              className="flex translate-y-2 items-start gap-3.5 rounded-2xl border border-pf-border p-[18px] opacity-0 transition-[opacity,transform,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:border-pf-strong group-data-[on=true]/reveal:translate-y-0 group-data-[on=true]/reveal:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100"
            >
              <span className="mt-0.5 font-plex-mono text-pf-ok" aria-hidden>
                ✓
              </span>
              <span className="text-pf-soft">
                <b className="block text-[17px] text-pf-text">{t}</b>
                {d}
              </span>
            </li>
          ))}
        </RevealList>
      </section>

      <section className={`${container} pt-[88px]`}>
        <div className={`${mono} text-pf-accent`}>02</div>
        <h2 className={h3}>{c.flowTitle}</h2>
        <ol className="m-0 mt-7 list-none border-t border-pf-line p-0">
          {c.flow.map((row) => (
            <li key={row.t} className="grid gap-1.5 border-b border-pf-line py-5 md:grid-cols-[120px_minmax(0,1fr)] md:gap-5">
              <time className={`font-plex-mono text-sm md:pt-1 ${row.d ? "text-pf-accent" : "text-pf-faint"}`}>{row.t}</time>
              {row.d ? (
                <div>
                  <div className="font-display text-[22px] font-bold">{row.title}</div>
                  <p className="m-0 mt-1 text-[15.5px] text-pf-body">{row.d}</p>
                </div>
              ) : (
                <div className="font-plex-mono text-base text-pf-faint">{row.title}</div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className={`${container} pt-[88px]`}>
        <div className={`${mono} text-pf-accent`}>03</div>
        <h2 className={h3}>{c.forTitle}</h2>
        <p className="m-0 mt-3 max-w-[640px] text-pf-body">{c.forLead}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {c.audience.map((a) => (
            <span key={a} className="rounded-full border border-pf-chip px-3.5 py-2 text-sm text-pf-soft">
              {a}
            </span>
          ))}
        </div>
      </section>

      <section className={`${container} pt-[88px]`}>
        <div className={`${mono} text-pf-accent`}>04</div>
        <h2 className={h3}>{c.bringTitle}</h2>
        <ul className="m-0 mt-6 grid list-none gap-2.5 p-0 sm:grid-cols-2">
          {c.bring.map((b) => (
            <li key={b} className="flex gap-3 text-pf-soft">
              <span className="font-bold text-pf-ok" aria-hidden>
                ✓
              </span>
              {b}
            </li>
          ))}
        </ul>
      </section>

      <section id="seat" className={`${container} scroll-mt-20 pt-[88px] pb-32`}>
        <div className={`${mono} text-pf-accent`}>05</div>
        <h2 className={h3}>{c.seatTitle}</h2>
        <div className="mt-7 grid items-start gap-9 rounded-3xl border border-pf-border bg-[radial-gradient(120%_120%_at_0%_0%,#5B8CFF1F,transparent_55%)] bg-pf-surface p-[clamp(24px,4vw,44px)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <p className="m-0 text-pf-body">{c.seatLead}</p>
            <dl className="m-0 mt-5 grid gap-2 text-[15px] text-pf-soft">
              {c.facts.map(([k, v]) => (
                <div key={k} className="flex">
                  <dt className="w-16 shrink-0 pt-0.5 font-plex-mono text-[12px] text-pf-faint">{k}</dt>
                  <dd className="m-0">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <SeatForm key={lang} copy={c.form} />
        </div>
      </section>

      <MobileSeatBar label={c.mobileCta} />
    </SitePage>
  );
};
