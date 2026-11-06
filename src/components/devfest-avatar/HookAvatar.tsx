'use client';

import dynamic from 'next/dynamic';

const SetiHologram = dynamic(() => import('./SetiHologram').then((m) => m.SetiHologram), { ssr: false });

/** SETI hologram from the commercial voice agent. Particles assemble her; no loading orb. */
export function HookAvatar() {
  return (
    <div className="arch relative aspect-[4/5]" aria-label="Avatar holográfico del agente SETI">
      <div className="holo-beam" aria-hidden="true" />
      <div className="holo-base" aria-hidden="true">
        <span className="holo-ring" />
        <span className="holo-ring holo-ring-2" />
      </div>
      <div className="absolute inset-x-0 -top-[2%] bottom-[-6%]">
        <div className="relative h-full w-full">
          <SetiHologram build talking />
        </div>
      </div>
    </div>
  );
}
