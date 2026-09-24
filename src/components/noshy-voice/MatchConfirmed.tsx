'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Sparkles, Users } from 'lucide-react';
import type { MatchPair } from '@/lib/noshy-match';
import { firstName, motivationLines } from '@/lib/noshy-voice';
import { AnimalOrb } from './AnimalOrb';

type MatchConfirmedProps = {
  pair: MatchPair;
  aiLoading: boolean;
  onMoreMatches: () => void;
  onRestart: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;
const LINE_MS = 3800;

export function MatchConfirmed({ pair, aiLoading, onMoreMatches, onRestart }: MatchConfirmedProps) {
  const lines = useMemo(() => motivationLines(pair), [pair]);
  const [lineIndex, setLineIndex] = useState(0);
  const them = firstName(pair.right.name);

  useEffect(() => {
    setLineIndex(0);
    const timer = window.setInterval(() => setLineIndex((i) => (i + 1) % lines.length), LINE_MS);
    return () => window.clearInterval(timer);
  }, [lines]);

  return (
    <div className="relative flex min-h-full w-full flex-col items-center justify-center px-6 py-6">
      <Burst />

      <div className="relative flex items-center justify-center">
        <motion.div
          initial={{ x: -140, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.1 }}
        >
          <AnimalOrb animalId={pair.left.animalId} name={pair.left.name} size={120} glow />
        </motion.div>
        <motion.div
          className="mx-2 h-[3px] w-16 rounded-full bg-gradient-to-r from-[#00f2ff] to-[#ff007a] md:w-28"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.55 }}
          style={{ boxShadow: '0 0 18px rgba(255,0,122,0.6)' }}
        />
        <motion.div
          initial={{ x: 140, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.1 }}
        >
          <AnimalOrb animalId={pair.right.animalId} name={pair.right.name} size={120} glow />
        </motion.div>
      </div>

      <motion.p
        className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[#ff007a]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        It&apos;s a match · {pair.brief.score}% fit
      </motion.p>
      <motion.h2
        className="mt-3 text-center text-4xl font-bold text-white md:text-6xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.8 }}
      >
        Go talk to {them}.
      </motion.h2>

      <div className="mt-8 flex h-28 w-full max-w-2xl items-center justify-center md:h-24" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={lineIndex}
            className="text-center text-xl leading-snug text-white/80 md:text-2xl"
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.6, ease }}
          >
            {lines[lineIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
        {lines.map((_, i) => (
          <motion.i
            key={i}
            className="block h-1 rounded-full bg-white/20"
            animate={{ width: i === lineIndex ? 22 : 6, backgroundColor: i === lineIndex ? '#00f2ff' : 'rgba(255,255,255,0.2)' }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>

      <motion.div
        className="mt-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 1.1 }}
      >
        <p className="flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
          <Sparkles size={12} />
          {aiLoading ? 'AI is writing your talking points…' : 'Talk about'}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {aiLoading
            ? [0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-9 w-40 rounded-full bg-white/[0.06]"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                />
              ))
            : pair.brief.topics.map((topic, i) => (
                <motion.span
                  key={topic}
                  className="line-clamp-2 max-w-xl rounded-full border border-[#00f2ff]/25 bg-[#00f2ff]/[0.06] px-4 py-2 text-sm text-white/80"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease }}
                >
                  {topic}
                </motion.span>
              ))}
        </div>
      </motion.div>

      <motion.div
        className="mt-10 flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <button
          type="button"
          onClick={onMoreMatches}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/80 transition hover:bg-white/10"
        >
          <Users size={16} /> See my other matches
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-full px-5 py-3 text-sm text-white/45 transition hover:text-white/80"
        >
          <RotateCcw size={16} /> Start over
        </button>
      </motion.div>
    </div>
  );
}

function Burst() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const angle = (i / 26) * Math.PI * 2 + Math.random() * 0.3;
        const distance = 180 + Math.random() * 260;
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance * 0.7,
          size: 3 + Math.random() * 5,
          color: i % 2 ? '#00f2ff' : '#ff007a',
          delay: 0.45 + Math.random() * 0.25,
        };
      }),
    []
  );

  return (
    <div className="pointer-events-none absolute left-1/2 top-[30%]" aria-hidden="true">
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: s.size, height: s.size, background: s.color, boxShadow: `0 0 10px ${s.color}` }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: s.x, y: s.y, opacity: [0, 1, 0], scale: [0.4, 1, 0.6] }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: s.delay }}
        />
      ))}
    </div>
  );
}
