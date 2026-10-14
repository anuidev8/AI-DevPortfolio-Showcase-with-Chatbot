'use client'

import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CaseMedia } from "./content";

type Props = { media: CaseMedia[]; label: string; className?: string };

export const MediaCarousel = ({ media, label, className = "aspect-video border-b border-pf-border" }: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion() ?? false;
  const multiple = media.length > 1;

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([i, video]) => {
      if (!video) return;
      if (Number(i) === active && !reduceMotion) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, reduceMotion]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = (index + media.length) % media.length;
    track.scrollTo({ left: next * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <div
      className={`relative bg-pf-raised ${className}`}
      role={multiple ? "region" : undefined}
      aria-roledescription={multiple ? "carousel" : undefined}
      aria-label={multiple ? `${label} media` : undefined}
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        tabIndex={multiple ? 0 : undefined}
        className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pf-accent [&::-webkit-scrollbar]:hidden"
      >
        {media.map((m, i) => (
          <div
            key={m.src}
            className="relative h-full w-full flex-none snap-center overflow-hidden"
            role={multiple ? "group" : undefined}
            aria-roledescription={multiple ? "slide" : undefined}
            aria-label={multiple ? `${i + 1} of ${media.length}` : undefined}
          >
            {m.type === "video" ? (
              <>
                <Image src={m.poster} alt="" fill sizes="560px" className="scale-110 object-cover opacity-40 blur-2xl" />
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={m.src}
                  poster={m.poster}
                  muted
                  loop
                  playsInline
                  controls={reduceMotion}
                  preload="metadata"
                  aria-label={m.alt}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </>
            ) : (
              <Image
                src={m.src}
                alt={m.alt}
                fill
                sizes="(min-width: 1100px) 560px, 100vw"
                className={m.fit === "cover" ? "object-cover" : "object-contain py-4"}
              />
            )}
            {m.caption && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-pf-bg/80 px-2.5 py-1 font-plex-mono text-[11px] tracking-[0.5px] text-pf-live backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-pf-live" />
                {m.caption}
              </span>
            )}
          </div>
        ))}
      </div>

      {multiple && (
        <>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-pf-bg/70 text-pf-text backdrop-blur transition-colors hover:bg-pf-bg"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-pf-bg/70 text-pf-text backdrop-blur transition-colors hover:bg-pf-bg"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-pf-bg/60 px-1 backdrop-blur">
            {media.map((m, i) => (
              <button
                key={m.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === active}
                className="flex h-6 w-6 items-center justify-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-pf-text" : "w-1.5 bg-pf-text/40"}`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
