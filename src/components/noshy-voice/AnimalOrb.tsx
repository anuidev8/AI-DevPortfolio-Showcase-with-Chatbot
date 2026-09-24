'use client';

import { motion } from 'framer-motion';
import { getNetworkingAnimal } from '@/lib/community-data';

type AnimalOrbProps = {
  animalId?: string;
  name: string;
  size: number;
  score?: number;
  glow?: boolean;
  layoutId?: string;
};

/** Animal avatar in a glowing circle, with an optional score ring. */
export function AnimalOrb({ animalId, name, size, score, glow, layoutId }: AnimalOrbProps) {
  const animal = getNetworkingAnimal(animalId);
  const color = animal?.color ?? '#00f2ff';
  const ring = size + 18;
  const radius = ring / 2 - 3;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      layoutId={layoutId}
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: ring, height: ring }}
      transition={{ type: 'spring', stiffness: 170, damping: 24 }}
    >
      {score != null && (
        <svg className="absolute inset-0 -rotate-90" width={ring} height={ring} aria-hidden="true">
          <circle cx={ring / 2} cy={ring / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
          <motion.circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke="url(#noshy-orb-ring)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
          <defs>
            <linearGradient id="noshy-orb-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00f2ff" />
              <stop offset="100%" stopColor="#ff007a" />
            </linearGradient>
          </defs>
        </svg>
      )}
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 30% 25%, ${color}ee, ${color}88 55%, #12081f 100%)`,
          boxShadow: glow
            ? `0 0 ${size * 0.35}px ${color}66, inset 0 0 ${size * 0.2}px rgba(255,255,255,0.15)`
            : `inset 0 0 ${size * 0.2}px rgba(255,255,255,0.12)`,
        }}
        aria-label={animal ? `${name}, ${animal.name}` : name}
        role="img"
      >
        <span style={{ fontSize: size * 0.46, lineHeight: 1 }} aria-hidden="true">
          {animal?.emoji ?? name.slice(0, 1).toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
}
