'use client'

import { useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

type Props = { src: string; poster: string; alt: string; caption: string };

export const CommunityReel = ({ src, poster, alt, caption }: Props) => {
  const [muted, setMuted] = useState(true);
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <figure className="relative m-0 aspect-[9/16] w-full overflow-hidden rounded-[22px] border border-pf-border bg-pf-raised">
      <video
        src={src}
        poster={poster}
        autoPlay={!reduceMotion}
        controls={reduceMotion}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <figcaption className="absolute left-3 top-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-pf-bg/80 px-2.5 py-1 font-plex-mono text-[11px] tracking-[0.5px] text-pf-live backdrop-blur">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-pf-live" />
        {caption}
      </figcaption>
      {!reduceMotion && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          aria-pressed={!muted}
          className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-pf-bg/70 text-pf-text backdrop-blur transition-colors hover:bg-pf-bg"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}
    </figure>
  );
};
