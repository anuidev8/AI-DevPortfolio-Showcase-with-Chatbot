'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Room,
  RoomEvent,
  Track,
  createAudioAnalyser,
  type LocalAudioTrack,
  type Participant,
  type RemoteAudioTrack,
  type RemoteTrack,
  type RpcInvocationData,
} from 'livekit-client';

export type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error';
export type AgentState = 'initializing' | 'listening' | 'thinking' | 'speaking';

export type RpcHandler = (payload: Record<string, unknown>) => Promise<unknown> | unknown;
export type RpcHandlers = Record<string, RpcHandler>;

export type VoiceLevels = { agent: number; user: number };

type Analyser = ReturnType<typeof createAudioAnalyser>;

const AGENT_STATE_ATTR = 'lk.agent.state';
const TRANSCRIPTION_TOPIC = 'lk.transcription';
const CHAT_TOPIC = 'lk.chat';

/**
 * LiveKit room for the NoShy voice host.
 * The agent drives the UI by calling the RPC methods in `handlers`
 * (see agents/noshy-voice-host). Levels are exposed as a ref so the
 * canvas wave can read them every frame without re-rendering React.
 * @see https://docs.livekit.io/agents/logic/tools/forwarding/
 */
export function useNoshyVoiceAgent(handlers: RpcHandlers) {
  const [connection, setConnection] = useState<ConnectionState>('idle');
  const [agentState, setAgentState] = useState<AgentState>('initializing');
  const [error, setError] = useState<string | null>(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [agentTranscript, setAgentTranscript] = useState('');
  const [micBlocked, setMicBlocked] = useState(false);
  const [agentJoined, setAgentJoined] = useState(false);

  const roomRef = useRef<Room | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const handlersRef = useRef(handlers);
  const levelsRef = useRef<VoiceLevels>({ agent: 0, user: 0 });
  const agentAnalyserRef = useRef<Analyser | null>(null);
  const userAnalyserRef = useRef<Analyser | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const stopMeters = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    void agentAnalyserRef.current?.cleanup();
    void userAnalyserRef.current?.cleanup();
    agentAnalyserRef.current = null;
    userAnalyserRef.current = null;
    levelsRef.current = { agent: 0, user: 0 };
  }, []);

  const startMeterLoop = useCallback(() => {
    if (rafRef.current != null) return;
    const tick = () => {
      const agent = agentAnalyserRef.current?.calculateVolume() ?? 0;
      const user = userAnalyserRef.current?.calculateVolume() ?? 0;
      const prev = levelsRef.current;
      levelsRef.current = {
        agent: prev.agent + (agent - prev.agent) * 0.35,
        user: prev.user + (user - prev.user) * 0.35,
      };
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const teardown = useCallback(() => {
    stopMeters();
    roomRef.current = null;
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current.remove();
      audioElRef.current = null;
    }
  }, [stopMeters]);

  useEffect(() => {
    return () => {
      void roomRef.current?.disconnect();
      teardown();
    };
  }, [teardown]);

  const attachAgentAudio = useCallback(
    (track: RemoteTrack) => {
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
        /* the start button already provided a user gesture */
      });
      void agentAnalyserRef.current?.cleanup();
      agentAnalyserRef.current = createAudioAnalyser(track as RemoteAudioTrack, {
        cloneTrack: true,
        smoothingTimeConstant: 0.7,
      });
      startMeterLoop();
    },
    [startMeterLoop]
  );

  const readAgentState = useCallback((participant: Participant) => {
    if (!participant.isAgent) return;
    setAgentJoined(true);
    const next = participant.attributes[AGENT_STATE_ATTR] as AgentState | undefined;
    if (next) setAgentState(next);
  }, []);

  const registerRpc = useCallback((room: Room) => {
    const methods = Object.keys(handlersRef.current);
    for (const method of methods) {
      room.registerRpcMethod(method, async (data: RpcInvocationData) => {
        let payload: Record<string, unknown> = {};
        try {
          payload = data.payload ? (JSON.parse(data.payload) as Record<string, unknown>) : {};
        } catch {
          return JSON.stringify({ ok: false, error: 'Invalid JSON payload' });
        }
        try {
          const handler = handlersRef.current[method];
          const result = await handler(payload);
          return JSON.stringify(result ?? { ok: true });
        } catch (err) {
          console.error(`[noshy-voice] rpc ${method}`, err);
          return JSON.stringify({
            ok: false,
            error: err instanceof Error ? err.message : 'Client error',
          });
        }
      });
    }
  }, []);

  const connect = useCallback(async () => {
    if (roomRef.current) return;
    setError(null);
    setMicBlocked(false);
    setAgentJoined(false);
    setConnection('connecting');
    setAgentState('initializing');

    try {
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'noshy-voice' }),
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
      registerRpc(room);

      room.registerTextStreamHandler(TRANSCRIPTION_TOPIC, async (reader, participantInfo) => {
        const fromUser = participantInfo.identity === room.localParticipant.identity;
        const setText = fromUser ? setUserTranscript : setAgentTranscript;
        let text = '';
        for await (const chunk of reader) {
          text += chunk;
          setText(text);
        }
      });

      room.on(RoomEvent.TrackSubscribed, (track) => attachAgentAudio(track));
      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach();
      });
      room.on(RoomEvent.ParticipantConnected, readAgentState);
      room.on(RoomEvent.ParticipantAttributesChanged, (_changed, participant) =>
        readAgentState(participant)
      );
      room.on(RoomEvent.ParticipantDisconnected, (participant) => {
        if (participant.isAgent) setAgentJoined(false);
      });
      room.on(RoomEvent.Disconnected, () => {
        teardown();
        setAgentJoined(false);
        setConnection('idle');
      });

      await room.connect(data.url, data.token);
      room.remoteParticipants.forEach(readAgentState);
      setConnection('connected');

      try {
        // Browser echo/noise processing only: the agent runs voice isolation server-side,
        // and stacking a second ML noise model here degrades it.
        await room.localParticipant.setMicrophoneEnabled(true, {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        });
        const mic = room.localParticipant.getTrackPublication(Track.Source.Microphone)?.track;
        if (mic) {
          userAnalyserRef.current = createAudioAnalyser(mic as LocalAudioTrack, {
            cloneTrack: true,
            smoothingTimeConstant: 0.7,
          });
          startMeterLoop();
        }
      } catch (micErr) {
        // Stay connected: the host still speaks and typed answers go over lk.chat.
        console.warn('[noshy-voice] microphone unavailable', micErr);
        setMicBlocked(true);
      }
    } catch (err) {
      console.error('[noshy-voice]', err);
      setError(err instanceof Error ? err.message : 'Could not start the voice host');
      setConnection('error');
      void roomRef.current?.disconnect();
      teardown();
    }
  }, [attachAgentAudio, readAgentState, registerRpc, startMeterLoop, teardown]);

  const disconnect = useCallback(async () => {
    await roomRef.current?.disconnect();
    teardown();
    setConnection('idle');
    setUserTranscript('');
    setAgentTranscript('');
  }, [teardown]);

  /** Forward a typed answer or UI event to the agent as a user turn. */
  const sendText = useCallback(async (text: string) => {
    const room = roomRef.current;
    if (!room) return false;
    await room.localParticipant.sendText(text, { topic: CHAT_TOPIC });
    return true;
  }, []);

  const setMuted = useCallback(async (muted: boolean) => {
    await roomRef.current?.localParticipant.setMicrophoneEnabled(!muted);
  }, []);

  return {
    connection,
    agentState,
    error,
    userTranscript,
    agentTranscript,
    micBlocked,
    agentJoined,
    levelsRef,
    connect,
    disconnect,
    sendText,
    setMuted,
    clearUserTranscript: () => setUserTranscript(''),
  };
}
