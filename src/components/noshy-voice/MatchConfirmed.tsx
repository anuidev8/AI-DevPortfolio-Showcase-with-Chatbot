'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Users } from 'lucide-react';
import type { MatchPair } from '@/lib/noshy-match';
import { firstName, motivationLines } from '@/lib/noshy-voice';
import { MatchPill, PersonAvatar } from '@/components/noshy/NoshyUi';

type MatchConfirmedProps = {
  pair: MatchPair;
  aiLoading: boolean;
  onMoreMatches: () => void;
  onRestart: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;
const LINE_MS = 3800;

function Bubble({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <motion.div
      className="rounded-[20px] rounded-tl-md border border-white/[0.08] bg-[#141416] p-4 text-[15px] leading-relaxed text-white/90"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

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
    <div className="relative mx-auto flex min-h-full w-full max-w-md flex-col gap-4 px-5 py-4">
      <Burst />

      <div className="flex items-center gap-4">
        <motion.div
          className="noshy-duo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 0.1 }}
        >
          <PersonAvatar animalId={pair.left.animalId} name={pair.left.name} size={56} shape="circle" />
          <PersonAvatar animalId={pair.right.animalId} name={pair.right.name} size={56} shape="circle" />
        </motion.div>
        <motion.div
          className="flex min-w-0 flex-col items-start gap-1"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.25 }}
        >
          <MatchPill score={pair.brief.score} />
          <h2 className="text-2xl font-bold tracking-tight text-white">Go talk to {them}.</h2>
        </motion.div>
      </div>

      <Bubble delay={0.4}>
        <p>
          You and {them} are a {pair.brief.score}% match.
        </p>
        <div className="mt-1 min-h-[3.25rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={lineIndex}
              className="text-white/70"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease }}
            >
              {lines[lineIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-2 flex gap-1.5" aria-hidden="true">
          {lines.map((_, i) => (
            <motion.i
              key={i}
              className="block h-1 rounded-full"
              animate={{ width: i === lineIndex ? 18 : 6, backgroundColor: i === lineIndex ? '#5b8cff' : 'rgba(255,255,255,0.2)' }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>
      </Bubble>

      <Bubble delay={0.6}>
        <p>{aiLoading ? 'Writing your talking points…' : `Here are ${pair.brief.topics.length} things you could ask ${them}:`}</p>
        {aiLoading ? (
          <div className="mt-3 flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-4 rounded-md bg-white/[0.07]"
                style={{ width: `${90 - i * 15}%` }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        ) : (
          <ol className="noshy-numbered mt-3">
            {pair.brief.topics.map((topic) => <li key={topic}>{topic}</li>)}
          </ol>
        )}
      </Bubble>

      <motion.div
        className="mt-1 flex flex-col gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <button type="button" onClick={onMoreMatches} className="noshy-btn noshy-btn-secondary noshy-btn-full">
          <Users size={16} /> See my other matches
        </button>
        <button type="button" onClick={onRestart} className="noshy-text-btn center">
          <RotateCcw size={15} /> Start over
        </button>
      </motion.div>
    </div>
  );
}

function Burst() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.3;
        const distance = 140 + Math.random() * 200;
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance * 0.7,
          size: 3 + Math.random() * 4,
          color: i % 2 ? '#1f5fff' : '#ffffff',
          delay: 0.3 + Math.random() * 0.25,
        };
      }),
    []
  );

  return (
    <div className="pointer-events-none absolute left-16 top-10" aria-hidden="true">
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: s.size, height: s.size, background: s.color, boxShadow: `0 0 10px ${s.color}` }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: s.x, y: s.y, opacity: [0, 1, 0], scale: [0.4, 1, 0.6] }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: s.delay }}
        />
      ))}
    </div>
  );
}
