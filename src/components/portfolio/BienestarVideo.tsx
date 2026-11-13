"use client";

import { useEffect, useRef, useState } from "react";

type Chapter = { t: number; es: string; en: string };

const CHAPTERS: Chapter[] = [
  { t: 0, es: "Intro", en: "Intro" },
  { t: 7.7, es: "Responder más rápido", en: "Reply faster" },
  { t: 19.1, es: "Crear contenido", en: "Create content" },
  { t: 32.1, es: "Acompañar clientas", en: "Support clients" },
  { t: 41.4, es: "YouTube · 190k", en: "YouTube · 190k" },
  { t: 47.7, es: "App de voz", en: "Voice app" },
  { t: 58.4, es: "Probar", en: "Try it" },
];

export const BienestarVideo = ({ lang }: { lang: "es" | "en" }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onTime = () => setNow(v.currentTime);
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  const play = (t?: number) => {
    const v = ref.current;
    if (!v) return;
    if (typeof t === "number") v.currentTime = t;
    v.muted = false;
    setStarted(true);
    void v.play().catch(() => {});
  };

  const active = CHAPTERS.reduce((acc, c, i) => (now >= c.t ? i : acc), 0);

  return (
    <div>
      <div className="relative aspect-video bg-pf-surface">
        <video
          ref={ref}
          src="/work/bienestar-explainer.mp4"
          poster="/work/bienestar-explainer-poster.jpg"
          playsInline
          preload="metadata"
          controls={started}
          className="h-full w-full object-cover"
          aria-label={lang === "es" ? "Video: cómo la IA ayuda a coaches de bienestar" : "Video: how AI helps wellness coaches"}
        />
        {!started && (
          <button
            type="button"
            onClick={() => play(0)}
            className="group absolute inset-0 flex items-center justify-center bg-pf-bg/30 transition-colors hover:bg-pf-bg/10"
            aria-label={lang === "es" ? "Reproducir video con voz" : "Play video with voice"}
          >
            <span className="flex items-center gap-3 rounded-full bg-pf-accent px-7 py-4 text-lg font-semibold text-pf-bg shadow-[0_12px_40px_rgba(91,140,255,0.45)] transition-transform group-hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5 3.5v13l11-6.5z" fill="currentColor" />
              </svg>
              {lang === "es" ? "Ver en 1 minuto" : "Watch in 1 minute"}
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-pf-line px-5 py-4 sm:px-7">
        {CHAPTERS.map((c, i) => (
          <button
            key={c.t}
            type="button"
            onClick={() => play(c.t)}
            aria-pressed={started && active === i}
            className={`min-h-[40px] rounded-full border px-4 text-[15px] transition-colors ${
              started && active === i
                ? "border-pf-accent bg-pf-accent text-pf-bg"
                : "border-pf-chip text-pf-soft hover:border-pf-accent hover:text-white"
            }`}
          >
            {lang === "es" ? c.es : c.en}
          </button>
        ))}
      </div>
    </div>
  );
};
