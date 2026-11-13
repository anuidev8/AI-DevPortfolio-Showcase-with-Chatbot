"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BIENESTAR_LANG_KEY, bienestarCopy, type BienestarLang } from "./bienestar-copy";
import { BienestarIntro } from "./BienestarIntro";
import { BienestarVideo } from "./BienestarVideo";
import { links } from "./content";
import { SitePage, external } from "./SiteChrome";
import { container, eyebrow, outlineButton, primaryButton, sectionTitle } from "./styles";

const INTRO_SEEN_KEY = "am-bienestar-intro-seen";

export const BienestarPage = () => {
  const [lang, setLang] = useState<BienestarLang>("es");
  const [introOpen, setIntroOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BIENESTAR_LANG_KEY) as BienestarLang | null;
      if (saved === "es" || saved === "en") setLang(saved);
      if (!sessionStorage.getItem(INTRO_SEEN_KEY)) setIntroOpen(true);
    } catch {
      setIntroOpen(true);
    }
  }, []);

  const setAndPersist = (next: BienestarLang) => {
    setLang(next);
    try {
      localStorage.setItem(BIENESTAR_LANG_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const closeIntro = () => {
    setIntroOpen(false);
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const c = bienestarCopy[lang];

  return (
    <SitePage>
      {introOpen && (
        <BienestarIntro beats={c.introBeats} skipLabel={c.introSkip} onDone={closeIntro} />
      )}

      <section className={`${container} pb-20 pt-[72px]`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="font-plex-mono text-[13px] tracking-[1px] text-pf-accent">{c.eyebrow}</div>
          <div
            role="group"
            aria-label={lang === "es" ? "Idioma" : "Language"}
            className="inline-flex rounded-full border border-pf-border p-1"
          >
            {(["es", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setAndPersist(code)}
                aria-pressed={lang === code}
                className={`min-h-[40px] rounded-full px-4 text-[14px] font-semibold tracking-[0.5px] transition-colors ${
                  lang === code ? "bg-pf-accent text-pf-bg" : "text-pf-soft hover:text-white"
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <h1 className="mt-5 max-w-[920px] font-display text-[clamp(48px,7.5vw,88px)] font-extrabold leading-[0.98] tracking-[-2.5px]">
          {c.title} <span className="text-pf-accent">{c.titleAccent}</span>
        </h1>
        <p className="mt-7 max-w-[520px] text-[clamp(20px,2.4vw,26px)] leading-snug text-pf-body">{c.intro}</p>
        <div className="mt-10 flex flex-wrap gap-3.5">
          <a href={c.primaryCta.href} {...external} className={`${primaryButton} px-8 py-4 text-lg`}>
            {c.primaryCta.label}
          </a>
          <a href={c.secondaryCta.href} className={`${outlineButton} px-8 py-4 text-lg`}>
            {c.secondaryCta.label}
          </a>
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-2">
          <span className="mr-1 font-plex-mono text-[13px] tracking-[1px] text-pf-faint">{c.forLabel}</span>
          {c.audience.map((a) => (
            <span key={a} className="rounded-full border border-pf-chip px-3.5 py-1.5 text-base text-pf-soft">
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* Wellness “Soy Angel” intro — same idea as DevFest WhoSlide */}
      <section className={`${container} border-t border-pf-line pt-20`}>
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_minmax(240px,380px)]">
          <div className="min-w-0">
            <div className={eyebrow}>{c.aboutEyebrow}</div>
            <h2 className={`${sectionTitle} mt-3 text-[clamp(40px,5.5vw,64px)]`}>
              {c.aboutTitle} <span className="text-pf-accent">{c.aboutAccent}</span>
            </h2>
            <p className="mt-6 max-w-[540px] text-[clamp(18px,2vw,22px)] leading-snug text-pf-body">{c.aboutLead}</p>
          </div>
          <div className="relative mx-auto w-full max-w-[340px] lg:mx-0 lg:justify-self-end">
            <Image
              src="/devfest-2026/avatar-yoga.png"
              alt={lang === "es" ? "Angel en postura de yoga" : "Angel in a yoga pose"}
              width={680}
              height={900}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>
      </section>

      <section id="video" className={`${container} scroll-mt-6 pt-24`}>
        <div className={eyebrow}>{c.promiseTitle.toUpperCase()}</div>
        <div className="mt-8 overflow-hidden rounded-[24px] border border-pf-border">
          <BienestarVideo lang={lang} />
        </div>
      </section>

      <section className={`${container} pt-24`}>
        <div className={eyebrow}>{c.useCasesEyebrow}</div>
        <h2 className={`${sectionTitle} mt-3 max-w-[640px] text-[clamp(36px,5vw,56px)]`}>{c.useCasesTitle}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.useCases.map((u) => (
            <article key={u.title} className="rounded-[22px] border border-pf-border bg-pf-surface p-7">
              <h3 className="m-0 font-display text-[26px] font-bold leading-[1.2]">{u.title}</h3>
              <p className="mt-3 text-lg text-pf-body">{u.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${container} pt-24`}>
        <div className="rounded-3xl border border-pf-border bg-pf-surface p-[clamp(28px,4vw,48px)]">
          <div className={eyebrow}>{c.stepsEyebrow}</div>
          <h2 className="mt-3 max-w-[640px] font-display text-[clamp(32px,4.5vw,48px)] font-extrabold leading-[1.05] tracking-[-1px]">
            {c.stepsTitle}
          </h2>
          <ol className="mt-10 grid list-none gap-8 p-0 sm:grid-cols-3">
            {c.steps.map((step) => (
              <li key={step.label}>
                <div className="font-plex-mono text-sm text-pf-live">{step.label}</div>
                <div className="mt-2 text-[24px] font-semibold">{step.title}</div>
                <p className="mt-2 text-lg text-pf-body">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${container} pt-24`}>
        <h2 className={`${sectionTitle} text-[clamp(36px,5vw,56px)]`}>{c.packagesTitle}</h2>
        <div className="mt-10 flex flex-wrap gap-5">
          {c.packages.map((p) => (
            <div
              key={p.name}
              className={`flex min-w-0 flex-[1_1_240px] flex-col gap-2 rounded-[22px] border p-7 ${
                p.highlight ? "border-pf-accent bg-pf-surface" : "border-pf-border"
              }`}
            >
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="font-display text-[clamp(28px,3vw,34px)] font-extrabold tracking-[-0.5px]">{p.price}</div>
              <p className="m-0 text-base text-pf-muted">{p.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-[560px] text-base text-pf-muted">{c.packagesNote}</p>
      </section>

      <section id="ejemplo" className={`${container} scroll-mt-6 pt-24`}>
        <div className={eyebrow}>{c.proofEyebrow}</div>
        <h2 className={`${sectionTitle} mt-3 text-[clamp(36px,5vw,56px)]`}>{c.proofTitle}</h2>
        <article className="mt-10 overflow-hidden rounded-[24px] border border-pf-border">
          <div className="relative aspect-[16/10] bg-pf-surface sm:aspect-[21/9]">
            <Image
              src="/work/school-of-breath-app.png"
              alt={c.proof.title}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
          <div className="border-t border-pf-line p-7 sm:p-9">
            <div className="font-plex-mono text-[12px] tracking-[1px] text-pf-accent">{c.proof.tag}</div>
            <h3 className="mt-2 font-display text-[clamp(28px,3.5vw,40px)] font-extrabold tracking-[-0.5px]">
              {c.proof.title}
            </h3>
            <p className="mt-3 max-w-[520px] text-lg text-pf-body">{c.proof.body}</p>
            <p className="mt-3 text-base font-medium text-pf-soft">{c.proof.result}</p>
            <a
              href={c.proof.linkHref}
              {...external}
              className="mt-5 inline-flex text-base font-semibold text-pf-accent no-underline hover:text-white"
            >
              {c.proof.linkLabel}
            </a>
          </div>
        </article>
      </section>

      <section id="contact" className={`${container} scroll-mt-6 pb-6 pt-28`}>
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-[28px] bg-pf-accent px-[clamp(24px,4vw,48px)] py-[clamp(36px,5vw,56px)] text-pf-bg">
          <div className="min-w-0 flex-[1_1_520px]">
            <h2 className="m-0 font-display text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[1.02] tracking-[-1.4px]">
              {c.ctaTitle}
            </h2>
            <p className="mt-4 text-xl text-pf-on-accent">{c.ctaNote}</p>
          </div>
          <div className="flex flex-[0_1_340px] flex-col gap-3">
            <a
              href={c.ctaHref}
              {...external}
              className="flex min-h-[48px] items-center justify-center rounded-xl bg-pf-bg px-[22px] py-4 text-lg font-semibold text-pf-text no-underline hover:bg-pf-surface hover:text-white"
            >
              {c.ctaLabel}
            </a>
            <a
              href={`mailto:${links.email}`}
              className="flex min-h-[48px] items-center justify-center break-all rounded-xl border-2 border-pf-bg px-[22px] py-3.5 text-base font-semibold text-pf-bg no-underline hover:bg-pf-bg/10 hover:text-pf-bg"
            >
              {links.email}
            </a>
          </div>
        </div>
      </section>
    </SitePage>
  );
};
