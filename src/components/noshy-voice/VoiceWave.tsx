'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import type { VoiceLevels } from './useNoshyVoiceAgent';

export type WaveMode = 'idle' | 'listening' | 'thinking' | 'speaking';

type VoiceWaveProps = {
  levelsRef: MutableRefObject<VoiceLevels>;
  mode: WaveMode;
  className?: string;
};

const CYAN = [0, 242, 255] as const;
const MAGENTA = [255, 0, 122] as const;
const LAYERS = 5;

function mix(a: readonly number[], b: readonly number[], t: number) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

function rgba(c: number[], alpha: number) {
  return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
}

/** Layered sine ribbons + soft core glow, driven by live audio levels. */
export function VoiceWave({ levelsRef, mode, className }: VoiceWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let energy = 0.08;
    let tint = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = (now: number) => {
      const t = now / 1000;
      const { agent, user } = levelsRef.current;
      const currentMode = modeRef.current;

      let target = 0.07 + Math.sin(t * 1.3) * 0.02;
      if (currentMode === 'speaking') target = 0.16 + Math.min(agent * 2.4, 0.85);
      else if (currentMode === 'listening') target = 0.1 + Math.min(user * 2.8, 0.8);
      else if (currentMode === 'thinking') target = 0.18 + Math.sin(t * 4) * 0.06;
      energy += (target - energy) * 0.09;

      const tintTarget = currentMode === 'listening' && user > 0.04 ? 1 : currentMode === 'thinking' ? 0.5 : 0;
      tint += (tintTarget - tint) * 0.05;

      ctx.clearRect(0, 0, width, height);
      const mid = height / 2;
      const base = mix(CYAN, MAGENTA, tint);
      const accent = mix(MAGENTA, CYAN, tint);

      const coreR = Math.min(width, height) * (0.22 + energy * 0.35);
      const core = ctx.createRadialGradient(width / 2, mid, 0, width / 2, mid, coreR);
      core.addColorStop(0, rgba(base, 0.22 + energy * 0.25));
      core.addColorStop(0.45, rgba(accent, 0.08 + energy * 0.08));
      core.addColorStop(1, rgba(base, 0));
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < LAYERS; i += 1) {
        const amp = height * 0.36 * energy * (1 - i * 0.14);
        const freq = 1.4 + i * 0.45;
        const speed = reduceMotion ? 0 : t * (1.1 + i * 0.3);
        const wobble = 0.65 + 0.35 * Math.sin(t * 0.8 + i * 1.7);

        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, rgba(base, 0));
        gradient.addColorStop(0.3, rgba(base, 0.75 - i * 0.1));
        gradient.addColorStop(0.5, rgba(accent, 0.85 - i * 0.12));
        gradient.addColorStop(0.7, rgba(base, 0.75 - i * 0.1));
        gradient.addColorStop(1, rgba(base, 0));

        ctx.beginPath();
        for (let x = 0; x <= width; x += 3) {
          const nx = x / width;
          const envelope = Math.pow(Math.sin(Math.PI * nx), 2.4);
          const y =
            mid +
            Math.sin(nx * freq * Math.PI * 2 + speed + i * 0.9) * amp * envelope * wobble +
            Math.sin(nx * 9 + speed * 1.7) * amp * 0.08 * envelope;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(0.8, 2.6 - i * 0.4);
        ctx.shadowColor = rgba(i % 2 ? accent : base, 0.8);
        ctx.shadowBlur = 16;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [levelsRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
