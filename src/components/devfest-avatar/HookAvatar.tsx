'use client';

import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState, useSyncExternalStore, type MutableRefObject } from 'react';
import { AVATAR_BUILD_EVENT, REPLAY_INTRO_EVENT } from '@/components/devfest-intro/IntroSequence';
import '@/components/devfest-intro/intro.css';

const SetiHologram = dynamic(() => import('./SetiHologram').then((m) => m.SetiHologram), { ssr: false });

const noop = () => () => {};
const introPending = () => typeof document !== 'undefined' && document.documentElement.getAttribute('data-intro') === '1';

/**
 * SETI hologram — same one-avatar pattern as commercial-voice-agent CharacterStage:
 * hidden until the intro fires AVATAR_BUILD_EVENT, then particles assemble her big in the
 * centre; at handoff the same canvas glides into the arch.
 */
export function HookAvatar({ talking = true }: { talking?: boolean }) {
  const [avatar, setAvatar] = useState<'loading' | 'ready' | 'failed'>('loading');
  // Start false so she never assembles behind the intro; the build event (or a no-intro mount) turns her on.
  const [build, setBuild] = useState(false);
  const archRef = useRef<HTMLDivElement | null>(null);
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  useEffect(() => {
    if (!introPending()) setBuild(true);
    const onBuild = () => setBuild(true);
    const onReplay = () => setBuild(false);
    window.addEventListener(AVATAR_BUILD_EVENT, onBuild);
    window.addEventListener(REPLAY_INTRO_EVENT, onReplay);
    return () => {
      window.removeEventListener(AVATAR_BUILD_EVENT, onBuild);
      window.removeEventListener(REPLAY_INTRO_EVENT, onReplay);
    };
  }, []);

  const layer =
    mounted && avatar !== 'failed'
      ? createPortal(
          <AvatarLayer archRef={archRef}>
            <SetiHologram
              build={build}
              talking={talking}
              onReady={() => setAvatar('ready')}
              onError={() => setAvatar('failed')}
            />
          </AvatarLayer>,
          document.body,
        )
      : null;

  return (
    <>
      <div ref={archRef} className="arch relative aspect-[4/5]" aria-label="Avatar holográfico del agente SETI">
        <div className={`arch-avatar absolute inset-0 transition-opacity duration-[900ms] ${avatar === 'ready' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="holo-beam" aria-hidden="true" />
          <div className="holo-base" aria-hidden="true">
            <span className="holo-ring" />
            <span className="holo-ring holo-ring-2" />
          </div>
        </div>
      </div>
      {layer}
    </>
  );
}

/**
 * Fixed layer holding the one avatar canvas. Big in the centre during the intro; glides onto
 * the arch at handoff. Same approach as commercial-voice-agent CharacterStage.
 */
function AvatarLayer({ archRef, children }: { archRef: MutableRefObject<HTMLDivElement | null>; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let last = '';
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const h = Math.min(vh * 0.66, (vw * 0.95) / 0.82);
      const w = h * 0.82;
      const left = (vw - w) / 2;
      const top = vh * 0.57 - h / 2;
      const mode = document.documentElement.getAttribute('data-intro') ?? '';
      let transform = 'none';
      const arch = archRef.current;
      // Centre while the intro owns her (`data-intro="1"`); otherwise track the arch (incl. handoff glide).
      if (mode !== '1' && arch) {
        const r = arch.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          const s = (r.height / h) * 1.12;
          const dx = r.left + r.width / 2 - (left + w / 2);
          const dy = r.top + r.height * 0.6 - (top + h / 2);
          transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
        }
      }
      const key = `${left}|${top}|${w}|${h}|${transform}|${mode}`;
      if (key === last) return;
      last = key;
      Object.assign(el.style, { left: `${left}px`, top: `${top}px`, width: `${w}px`, height: `${h}px`, transform });
      el.dataset.mode = mode || 'app';
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [archRef]);

  return (
    <div ref={ref} className="avatar-layer" aria-hidden="true">
      {children}
    </div>
  );
}
