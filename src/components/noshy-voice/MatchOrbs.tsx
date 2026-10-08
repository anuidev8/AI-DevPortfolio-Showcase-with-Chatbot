'use client';

import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import type { MatchPair } from '@/lib/noshy-match';
import { firstName } from '@/lib/noshy-voice';
import { MatchCard, MatchPill, PersonAvatar, Tags, animalTags } from '@/components/noshy/NoshyUi';

type MatchOrbsProps = {
  pairs: MatchPair[];
  focusedIndex: number | null;
  onFocus: (index: number | null) => void;
  onConfirm: (index: number) => void;
};

const ease = [0.22, 1, 0.36, 1] as const;
const SWIPE_THRESHOLD = 120;

export function MatchOrbs({ pairs, focusedIndex, onFocus, onConfirm }: MatchOrbsProps) {
  const focused = focusedIndex != null ? pairs[focusedIndex] : null;

  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-md flex-col px-5 py-4">
      <AnimatePresence mode="popLayout">
        {!focused ? (
          <motion.div
            key="list"
            className="flex w-full flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <motion.h2
              className="text-[1.75rem] font-bold leading-tight tracking-tight text-white"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              Your top matches
            </motion.h2>
            <motion.p
              className="mt-2 text-[15px] leading-snug text-[#8e8e93]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              Based on your goals, skills and what you&apos;re looking for. Tap one — or just say their name.
            </motion.p>

            <div className="mt-5 flex flex-col gap-3">
              {pairs.map((pair, index) => (
                <motion.div
                  key={pair.right.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.2 + index * 0.08 }}
                >
                  <MatchCard pair={pair} onOpen={() => onFocus(index)} />
                </motion.div>
              ))}
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
  const rotate = useTransform(x, [-240, 240], [-8, 8]);
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
      className="flex w-full flex-col"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
      transition={{ duration: 0.45, ease }}
    >
      <motion.article
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={onDragEnd}
        style={{ x, rotate }}
        className="relative w-full cursor-grab touch-pan-y rounded-[28px] border border-white/[0.08] bg-[#0e0e10] p-5 pt-7 shadow-[0_30px_80px_rgba(0,0,0,0.6)] active:cursor-grabbing"
      >
        <motion.span
          style={{ opacity: likeOpacity }}
          className="pointer-events-none absolute right-5 top-5 rounded-full border border-[#5b8cff] px-3 py-1 text-xs font-semibold tracking-wide text-[#5b8cff]"
        >
          CONNECT
        </motion.span>
        <motion.span
          style={{ opacity: nopeOpacity }}
          className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/40 px-3 py-1 text-xs font-semibold tracking-wide text-white/60"
        >
          BACK
        </motion.span>

        <div className="noshy-profile-hero">
          <PersonAvatar animalId={them.animalId} name={them.name} size={108} shape="circle" />
          <MatchPill score={pair.brief.score} />
          <h2>{them.name}</h2>
          <p>{them.role}</p>
          <Tags items={animalTags(them.animalId)} />
        </div>

        <motion.div
          className="mt-5 flex flex-col gap-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
        >
          <motion.article
            className="noshy-why"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.45, ease }}
          >
            <h3>Why you should talk</h3>
            <p className="line-clamp-4">{pair.brief.why}</p>
          </motion.article>
          {rows.map((row) => (
            <motion.div
              key={row.label}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.45, ease }}
            >
              <p className="text-[13px] font-medium text-[#8e8e93]">{row.label}</p>
              <p className="mt-0.5 line-clamp-3 text-[15px] leading-snug text-white/90">{row.value}</p>
            </motion.div>
          ))}
          {pair.brief.topics[0] && (
            <motion.div
              className="noshy-start"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.45, ease }}
            >
              <h3>Start with</h3>
              <p>“{pair.brief.topics[0]}”</p>
            </motion.div>
          )}
        </motion.div>
      </motion.article>

      <div className="noshy-btn-row mt-5">
        <button type="button" onClick={onBack} className="noshy-btn noshy-btn-secondary" aria-label="Back to matches">
          Back
        </button>
        <button type="button" onClick={onConfirm} className="noshy-btn noshy-btn-primary" aria-label={`Connect with ${them.name}`}>
          Connect
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-white/40">
        Swipe right to connect · say “yes, {firstName(them.name)}”
      </p>
    </motion.div>
  );
}
