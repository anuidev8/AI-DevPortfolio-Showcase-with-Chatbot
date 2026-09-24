'use client';

import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { Heart, Sparkles, X } from 'lucide-react';
import { getNetworkingAnimal } from '@/lib/community-data';
import type { MatchPair } from '@/lib/noshy-match';
import { firstName } from '@/lib/noshy-voice';
import { AnimalOrb } from './AnimalOrb';

type MatchOrbsProps = {
  pairs: MatchPair[];
  focusedIndex: number | null;
  onFocus: (index: number | null) => void;
  onConfirm: (index: number) => void;
};

const ease = [0.22, 1, 0.36, 1] as const;
const SWIPE_THRESHOLD = 120;

/** Best match sits in the middle and is the biggest. */
function displayOrder(count: number) {
  if (count >= 3) return [1, 0, 2];
  return Array.from({ length: count }, (_, i) => i);
}

export function MatchOrbs({ pairs, focusedIndex, onFocus, onConfirm }: MatchOrbsProps) {
  const focused = focusedIndex != null ? pairs[focusedIndex] : null;

  return (
    <div className="relative flex min-h-full w-full flex-col items-center justify-center px-6 py-6">
      <AnimatePresence mode="popLayout">
        {!focused ? (
          <motion.div
            key="orbs"
            className="flex w-full flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <motion.p
              className="font-mono text-xs uppercase tracking-[0.3em] text-[#00f2ff]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              Your matches tonight
            </motion.p>
            <motion.h2
              className="mt-3 max-w-2xl text-center text-3xl font-bold leading-tight text-white md:text-5xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.08 }}
            >
              {pairs.length === 1 ? 'One person you should meet.' : `${pairs.length} people you should meet.`}
            </motion.h2>
            <motion.p
              className="mt-3 text-center text-sm text-white/50 md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Tap a circle — or just say their name.
            </motion.p>

            <div className="mt-10 flex flex-col items-center gap-8 md:mt-14 md:flex-row md:items-end md:gap-14">
              {displayOrder(pairs.length).map((index, position) => {
                const pair = pairs[index];
                const isBest = index === 0;
                const animal = getNetworkingAnimal(pair.right.animalId);
                return (
                  <motion.button
                    key={pair.right.id}
                    type="button"
                    onClick={() => onFocus(index)}
                    className="group flex flex-col items-center gap-4 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#00f2ff]/70"
                    initial={{ opacity: 0, scale: 0.4, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.25 + position * 0.12 }}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.96 }}
                    aria-label={`${pair.right.name}, ${pair.brief.score}% fit`}
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4 + position, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <AnimalOrb
                        layoutId={`orb-${pair.right.id}`}
                        animalId={pair.right.animalId}
                        name={pair.right.name}
                        size={isBest ? 200 : 150}
                        score={pair.brief.score}
                        glow={isBest}
                      />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-white md:text-xl">{pair.right.name}</p>
                      <p className="text-sm text-white/45">
                        {animal ? `${animal.emoji} ${animal.name} · ` : ''}
                        {pair.right.role}
                      </p>
                      <p className="mt-1 font-mono text-xs tracking-widest text-[#ff007a]">
                        {pair.brief.score}% FIT
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <SwipeCard
            key={`card-${focused.right.id}`}
            pair={focused}
            onBack={() => onFocus(null)}
            onConfirm={() => onConfirm(focusedIndex!)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SwipeCard({ pair, onBack, onConfirm }: { pair: MatchPair; onBack: () => void; onConfirm: () => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-10, 10]);
  const likeOpacity = useTransform(x, [30, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, -30], [1, 0]);
  const them = pair.right;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 700) onConfirm();
    else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -700) onBack();
  };

  const rows = [
    { label: 'Business', value: them.business || them.bio },
    { label: 'Looking for', value: them.lookingFor },
    { label: 'Can help with', value: them.canHelp },
  ].filter((row) => row.value);

  return (
    <motion.div
      className="flex w-full max-w-md flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
    >
      <motion.article
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={onDragEnd}
        style={{ x, rotate }}
        className="relative w-full cursor-grab touch-pan-y rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 pt-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl active:cursor-grabbing"
      >
        <motion.span
          style={{ opacity: likeOpacity }}
          className="pointer-events-none absolute right-6 top-6 rounded-full border border-[#ff007a] px-3 py-1 font-mono text-xs tracking-widest text-[#ff007a]"
        >
          CONNECT
        </motion.span>
        <motion.span
          style={{ opacity: nopeOpacity }}
          className="pointer-events-none absolute left-6 top-6 rounded-full border border-white/40 px-3 py-1 font-mono text-xs tracking-widest text-white/60"
        >
          BACK
        </motion.span>

        <div className="flex flex-col items-center text-center">
          <AnimalOrb
            layoutId={`orb-${them.id}`}
            animalId={them.animalId}
            name={them.name}
            size={120}
            score={pair.brief.score}
            glow
          />
          <motion.h3
            className="mt-4 text-3xl font-bold text-white"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease }}
          >
            {them.name}
          </motion.h3>
          <p className="mt-1 text-sm text-white/50">
            {them.role} · <span className="text-[#ff007a]">{pair.brief.score}% fit</span>
          </p>
        </div>

        <motion.div
          className="mt-6 space-y-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
        >
          {rows.map((row) => (
            <motion.div
              key={row.label}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.45, ease }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00f2ff]/80">{row.label}</p>
              <p className="mt-1 line-clamp-3 text-[15px] leading-snug text-white/85">{row.value}</p>
            </motion.div>
          ))}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="rounded-2xl border border-[#ff007a]/25 bg-[#ff007a]/[0.07] p-4"
          >
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#ff007a]">
              <Sparkles size={12} /> Why talk to {firstName(them.name)}
            </p>
            <p className="mt-1.5 line-clamp-4 text-sm leading-relaxed text-white/80">{pair.brief.why}</p>
          </motion.div>
        </motion.div>
      </motion.article>

      <div className="mt-8 flex items-center gap-8">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70"
          aria-label="Back to matches"
        >
          <X size={26} />
        </motion.button>
        <motion.button
          type="button"
          onClick={onConfirm}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#ff007a] to-[#ff4da6] text-white shadow-[0_0_40px_rgba(255,0,122,0.45)]"
          aria-label={`Connect with ${them.name}`}
        >
          <Heart size={30} fill="currentColor" />
        </motion.button>
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
        Swipe right to connect · say “yes, {firstName(them.name)}”
      </p>
    </motion.div>
  );
}
