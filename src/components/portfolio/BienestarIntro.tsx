"use client";

/**
 * Lightweight cinematic intro for /bienestar — same visual language as the
 * DevFest IntroSequence (intro.css), but with wellness copy and no sales journey/audio.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import "@/components/devfest-intro/intro.css";

const SPHERES = [
  { x: 8, y: 14, s: 34, d: 1 },
  { x: 86, y: 8, s: 40, d: 1 },
  { x: 94, y: 78, s: 30, d: 0.9 },
  { x: 6, y: 86, s: 26, d: 0.85 },
  { x: 50, y: 104, s: 30, d: 0.8 },
  { x: 27, y: 26, s: 9, d: 0.3 },
  { x: 74, y: 30, s: 7, d: 0.25 },
  { x: 70, y: 74, s: 11, d: 0.35 },
];

type Beat = { kicker?: string; text: string; sub?: string };

type Props = {
  beats: Beat[];
  skipLabel: string;
  onDone: () => void;
};

export function BienestarIntro({ beats, skipLabel, onDone }: Props) {
  const [beat, setBeat] = useState(0);
  const [active, setActive] = useState(true);
  const doneRef = useRef(false);
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timers.current.forEach((id) => window.clearTimeout(id));
    document.documentElement.removeAttribute("data-intro");
    setActive(false);
    onDone();
  }, [onDone]);

  useEffect(() => {
    document.documentElement.setAttribute("data-intro", "1");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      timers.current.push(window.setTimeout(finish, 600));
      return () => {
        timers.current.forEach((id) => window.clearTimeout(id));
        document.documentElement.removeAttribute("data-intro");
      };
    }

    beats.forEach((_, i) => {
      if (i === 0) return;
      timers.current.push(window.setTimeout(() => setBeat(i), i * 2200));
    });
    timers.current.push(window.setTimeout(finish, beats.length * 2200 + 400));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("keydown", onKey);
      document.documentElement.removeAttribute("data-intro");
    };
  }, [beats, finish]);

  if (!active || typeof document === "undefined") return null;

  const current = beats[beat] ?? beats[0]!;

  return createPortal(
    <div
      className="intro fixed inset-0 z-[80] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Introducción"
      style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
        ["--ease-out-soft" as string]: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
    >
      <div className="intro-bg absolute inset-0" aria-hidden="true">
        <div className="intro-rays absolute inset-[-50%]" />
      </div>

      {SPHERES.map((b, i) => {
        const dx = b.x - 50;
        const dy = b.y - 50;
        const len = Math.hypot(dx, dy) || 1;
        return (
          <span
            key={i}
            className="intro-sphere absolute rounded-full"
            aria-hidden="true"
            style={
              {
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.s}vmin`,
                height: `${b.s}vmin`,
                filter: b.d > 0.5 ? `blur(${(b.d - 0.5) * 18}px)` : undefined,
                "--delay": `${200 + i * 70}ms`,
                "--drift": `${4 + i * 0.7}s`,
                "--out-x": `${(dx / len) * 70}vw`,
                "--out-y": `${(dy / len) * 70}vh`,
              } as CSSProperties
            }
          />
        );
      })}

      <div className="intro-grid seti-texture absolute inset-0" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center text-white">
        <div
          key={beat}
          className="transition-opacity duration-500"
          style={{ animation: "bienestar-beat-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both" }}
        >
          {current.kicker ? (
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.3em] text-white/75 md:text-base">
              {current.kicker}
            </p>
          ) : null}
          <h2 className="text-[clamp(44px,11vw,140px)] font-medium leading-[0.95] tracking-[-0.05em]">
            {current.text}
          </h2>
          {current.sub ? (
            <p className="mx-auto mt-6 max-w-[28ch] text-lg text-white/80 md:text-2xl">{current.sub}</p>
          ) : null}
        </div>
      </div>
      {/* Local keyframes — keep out of DevFest phase CSS */}
      <style>{`@keyframes bienestar-beat-in{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}`}</style>

      <button
        type="button"
        onClick={finish}
        className="intro-skip absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] rounded-full bg-white/12 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20"
        autoFocus
      >
        {skipLabel}
      </button>
    </div>,
    document.body,
  );
}
