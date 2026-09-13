'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Room,
  RoomEvent,
  Track,
  type RemoteTrack,
  type RpcInvocationData,
} from 'livekit-client';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import {
  SLIDE_IDS,
  SLIDE_SUMMARIES,
  isSlideId,
  type SlideId,
} from '@/lib/ai-after-hours/slides';

const VB = {
  cyan: '#00f2ff',
  magenta: '#ff007a',
  bg: '#12081f',
  muted: 'rgba(245,245,245,0.45)',
  border: 'rgba(255,255,255,0.1)',
  glow: '0 0 24px rgba(0,242,255,0.45)',
};

type VoiceGuideProps = {
  current: SlideId;
  onSlideChange: (slide: SlideId) => void;
};

type ConnState = 'idle' | 'connecting' | 'listening' | 'error';

/**
 * LiveKit room + agent audio + RPC slide control for AI After Hours.
 * Agent tools call get_slide_state / go_to_slide on this client.
 * @see https://docs.livekit.io/agents/logic/tools/forwarding/
 * @see https://docs.livekit.io/transport/data/rpc/
 */
export function VoiceGuide({ current, onSlideChange }: VoiceGuideProps) {
  const [state, setState] = useState<ConnState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [agentSpeaking, setAgentSpeaking] = useState(false);

  const roomRef = useRef<Room | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const currentRef = useRef(current);
  const onSlideChangeRef = useRef(onSlideChange);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    onSlideChangeRef.current = onSlideChange;
  }, [onSlideChange]);

  useEffect(() => {
    return () => {
      void roomRef.current?.disconnect();
      roomRef.current = null;
      if (audioElRef.current) {
        audioElRef.current.srcObject = null;
        audioElRef.current.remove();
        audioElRef.current = null;
      }
    };
  }, []);

  function attachAgentAudio(track: RemoteTrack) {
    if (track.kind !== Track.Kind.Audio) return;
    let el = audioElRef.current;
    if (!el) {
      el = document.createElement('audio');
      el.autoplay = true;
      el.setAttribute('playsinline', 'true');
      document.body.appendChild(el);
      audioElRef.current = el;
    }
    track.attach(el);
    void el.play().catch(() => {
      /* autoplay may need a user gesture — Voice Tour button already provided one */
    });
  }

  function registerSlideRpc(room: Room) {
    room.registerRpcMethod('get_slide_state', async (_data: RpcInvocationData) => {
      const slide = currentRef.current;
      const index = SLIDE_IDS.indexOf(slide);
      return JSON.stringify({
        ok: true,
        slide,
        index,
        slides: [...SLIDE_IDS],
        summary: SLIDE_SUMMARIES[slide],
        hints: {
          next: index < SLIDE_IDS.length - 1 ? SLIDE_IDS[index + 1] : null,
          prev: index > 0 ? SLIDE_IDS[index - 1] : null,
        },
      });
    });

    room.registerRpcMethod('go_to_slide', async (data: RpcInvocationData) => {
      let slide = '';
      try {
        const payload = JSON.parse(data.payload || '{}') as { slide?: string };
        slide = (payload.slide || '').trim().toLowerCase();
      } catch {
        return JSON.stringify({ ok: false, error: 'Invalid JSON payload' });
      }
      if (!isSlideId(slide)) {
        return JSON.stringify({
          ok: false,
          error: `Unknown slide '${slide}'. Use: ${SLIDE_IDS.join(', ')}`,
        });
      }
      onSlideChangeRef.current(slide);
      currentRef.current = slide;
      return JSON.stringify({
        ok: true,
        slide,
        index: SLIDE_IDS.indexOf(slide),
        summary: SLIDE_SUMMARIES[slide],
      });
    });
  }

  async function start() {
    if (state === 'connecting' || state === 'listening') return;
    setError(null);
    setState('connecting');

    try {
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as {
        token?: string;
        url?: string;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.token || !data.url) {
        throw new Error(data.message || data.error || 'Token request failed');
      }

      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;
      registerSlideRpc(room);

      room.on(RoomEvent.TrackSubscribed, (track) => {
        attachAgentAudio(track);
        if (track.kind === Track.Kind.Audio) setAgentSpeaking(true);
      });
      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach();
        if (track.kind === Track.Kind.Audio) setAgentSpeaking(false);
      });
      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        const agentTalking = speakers.some(
          (p) => p.identity !== room.localParticipant.identity && !p.isLocal
        );
        setAgentSpeaking(agentTalking);
      });
      room.on(RoomEvent.Disconnected, () => {
        setState('idle');
        setAgentSpeaking(false);
      });

      await room.connect(data.url, data.token);
      await room.localParticipant.setMicrophoneEnabled(true);
      setState('listening');
    } catch (err) {
      console.error('[VoiceGuide]', err);
      setError(err instanceof Error ? err.message : 'Could not start voice tour');
      setState('error');
      void roomRef.current?.disconnect();
      roomRef.current = null;
    }
  }

  async function stop() {
    await roomRef.current?.disconnect();
    roomRef.current = null;
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current.remove();
      audioElRef.current = null;
    }
    setAgentSpeaking(false);
    setState('idle');
  }

  const active = state === 'listening' || state === 'connecting';

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => (active ? void stop() : void start())}
        disabled={state === 'connecting'}
        className="flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.18em] transition-all disabled:opacity-60"
        style={{
          border: `1px solid ${active ? VB.magenta : VB.cyan}66`,
          background: active ? `${VB.magenta}22` : `${VB.cyan}14`,
          color: active ? VB.magenta : VB.cyan,
          boxShadow: agentSpeaking ? VB.glow : undefined,
        }}
        aria-label={active ? 'Stop voice tour' : 'Start voice tour'}
      >
        {state === 'connecting' ? (
          <Loader2 size={14} className="animate-spin" />
        ) : active ? (
          <MicOff size={14} />
        ) : (
          <Mic size={14} />
        )}
        {state === 'connecting'
          ? 'Connecting…'
          : active
            ? agentSpeaking
              ? 'Guide speaking — tap to stop'
              : 'Voice on — tap to stop'
            : 'Voice Tour'}
      </button>
      {error && (
        <p className="max-w-xs text-center font-mono text-[10px] leading-snug" style={{ color: VB.magenta }}>
          {error}
        </p>
      )}
      {state === 'idle' && !error && (
        <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: VB.muted }}>
          Auto-guided slides + Q&amp;A
        </p>
      )}
    </div>
  );
}
