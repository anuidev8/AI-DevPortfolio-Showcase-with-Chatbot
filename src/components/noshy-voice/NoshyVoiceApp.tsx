'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Keyboard, Loader2, Mic, MicOff, PhoneOff, Search } from 'lucide-react';
import { getNetworkingAnimal, type CommunityProfile } from '@/lib/community-data';
import { fetchAiMatch } from '@/lib/noshy-ai';
import { matchesFor, type MatchPair } from '@/lib/noshy-match';
import {
  ANIMAL_IDS,
  EMPTY_ANSWERS,
  VOICE_STEPS,
  firstName,
  guessAnimal,
  guessRole,
  makeUsername,
  motivationLines,
  type VoiceAnswers,
  type VoiceField,
  type VoicePhase,
} from '@/lib/noshy-voice';
import { ConnectionGlobe, type GlobeNode } from './ConnectionGlobe';
import { MatchConfirmed } from './MatchConfirmed';
import { MatchOrbs } from './MatchOrbs';
import { VoiceWave, type WaveMode } from './VoiceWave';
import { useNoshyVoiceAgent, type RpcHandlers } from './useNoshyVoiceAgent';

type Member = CommunityProfile & { memberId?: number };

const ease = [0.22, 1, 0.36, 1] as const;
const SESSION_KEY = 'noshy-session';
const MAX_MATCHES = 3;
const GLOBE_MIN_MS = 4800;
const GLOBE_REVEAL_MS = 1400;
const AI_BRIEF_TIMEOUT_MS = 8000;
const AGENT_JOIN_TIMEOUT_MS = 12000;

const FIELD_ALIASES: Record<string, VoiceField> = {
  name: 'name',
  business: 'business',
  lookingfor: 'lookingFor',
  looking_for: 'lookingFor',
  canhelp: 'canHelp',
  can_help: 'canHelp',
};

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

function nextOpenStep(answers: VoiceAnswers) {
  return VOICE_STEPS.findIndex((step) => !answers[step.id].trim());
}

function stepInfo(index: number) {
  const step = VOICE_STEPS[index];
  return step ? { index, field: step.id, question: step.label, hint: step.hint } : null;
}

function summarize(pairs: MatchPair[]) {
  return pairs.map((pair, index) => ({
    index,
    name: pair.right.name,
    role: pair.right.role,
    animal: getNetworkingAnimal(pair.right.animalId)?.name,
    score: pair.brief.score,
    business: pair.right.business,
    lookingFor: pair.right.lookingFor,
    canHelp: pair.right.canHelp,
    why: pair.brief.why,
  }));
}

const sectionMotion = {
  initial: { opacity: 0, scale: 0.98, filter: 'blur(10px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(10px)' },
  transition: { duration: 0.7, ease },
};

export function NoshyVoiceApp() {
  const [phase, setPhase] = useState<VoicePhase>('intro');
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<VoiceAnswers>(EMPTY_ANSWERS);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [highlightIds, setHighlightIds] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [confirmedPair, setConfirmedPair] = useState<MatchPair | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const [muted, setMutedState] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const latest = useRef({ phase, stepIndex, answers, pairs, memberId, members, confirmedPair });
  latest.current = { phase, stepIndex, answers, pairs, memberId, members, confirmedPair };
  const matchingRef = useRef<Promise<unknown> | null>(null);
  const connectedIdsRef = useRef(new Set<string>());

  const loadMembers = useCallback(async () => {
    try {
      const res = await fetch('/api/members');
      if (!res.ok) return latest.current.members;
      const data = (await res.json()) as { members?: Member[] };
      const list = data.members ?? [];
      setMembers(list);
      latest.current.members = list;
      return list;
    } catch {
      return latest.current.members;
    }
  }, []);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const youProfile = useMemo<CommunityProfile>(
    () => ({
      id: memberId != null ? `member-${memberId}` : 'you',
      name: answers.name.trim() || 'You',
      role: answers.role || 'Guest',
      avatar: '',
      location: 'Medellín',
      skills: [],
      intent: '',
      bio: answers.business,
      animalId: answers.animalId,
      business: answers.business,
      lookingFor: answers.lookingFor,
      canHelp: answers.canHelp,
      online: true,
    }),
    [answers, memberId]
  );

  /* ── Flow actions (shared by voice RPC and on-screen controls) ── */

  const saveAnswer = useCallback((rawField: string, rawValue: string) => {
    const field = FIELD_ALIASES[rawField.replace(/\s+/g, '').toLowerCase()];
    const value = rawValue.replace(/\s+/g, ' ').trim().slice(0, field === 'name' ? 60 : 280);
    if (!field) return { ok: false, error: `Unknown field '${rawField}'. Use name, business, lookingFor, canHelp.` };
    if (!value) return { ok: false, error: 'Empty answer. Ask again.' };

    const next = { ...latest.current.answers, [field]: value };
    latest.current.answers = next;
    setAnswers(next);

    const open = nextOpenStep(next);
    if (open === -1) {
      return { ok: true, saved: field, complete: true, message: 'All answers saved. Call find_matches next.' };
    }
    latest.current.stepIndex = open;
    setStepIndex(open);
    return { ok: true, saved: field, complete: false, next: stepInfo(open) };
  }, []);

  const runMatching = useCallback(
    (extras: { role?: string; animal?: string } = {}) => {
      if (matchingRef.current) return matchingRef.current;

      const job = (async () => {
        const current = latest.current.answers;
        const animalId =
          extras.animal && (ANIMAL_IDS as readonly string[]).includes(extras.animal.toLowerCase())
            ? extras.animal.toLowerCase()
            : current.animalId || guessAnimal(current);
        const role = extras.role?.trim().slice(0, 40) || current.role || guessRole(current.business);
        const finalAnswers = { ...current, animalId, role };
        latest.current.answers = finalAnswers;
        setAnswers(finalAnswers);
        setHighlightIds([]);
        setFocusedIndex(null);
        setPhase('matching');
        const startedAt = performance.now();

        let id = latest.current.memberId;
        if (id == null) {
          try {
            const res = await fetch('/api/join', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: makeUsername(finalAnswers.name),
                displayName: finalAnswers.name,
                role,
                animalId,
                business: finalAnswers.business,
                lookingFor: finalAnswers.lookingFor,
                canHelp: finalAnswers.canHelp,
              }),
            });
            const data = (await res.json()) as { memberId?: number; member?: { username?: string } };
            if (res.ok && data.memberId) {
              id = data.memberId;
              setMemberId(id);
              latest.current.memberId = id;
              try {
                localStorage.setItem(
                  SESSION_KEY,
                  JSON.stringify({ memberId: id, username: data.member?.username, name: finalAnswers.name, role, animalId,
                    business: finalAnswers.business, lookingFor: finalAnswers.lookingFor, canHelp: finalAnswers.canHelp })
                );
              } catch { /* ignore */ }
            }
          } catch {
            /* keep matching locally even if saving fails */
          }
        }

        const everyone = await loadMembers();
        const selfId = id != null ? `member-${id}` : 'you';
        const me: CommunityProfile = {
          ...youProfile,
          id: selfId,
          name: finalAnswers.name,
          role,
          animalId,
          business: finalAnswers.business,
          lookingFor: finalAnswers.lookingFor,
          canHelp: finalAnswers.canHelp,
          bio: finalAnswers.business,
        };
        const top = matchesFor(me, everyone.filter((m) => m.id !== selfId)).slice(0, MAX_MATCHES);

        const wait = GLOBE_MIN_MS - (performance.now() - startedAt);
        if (wait > 0) await sleep(wait);
        setHighlightIds(top.map((p) => p.right.id));
        await sleep(GLOBE_REVEAL_MS);

        latest.current.pairs = top;
        setPairs(top);
        setPhase('matches');
        return {
          ok: true,
          you: { name: finalAnswers.name, role, animal: getNetworkingAnimal(animalId)?.name },
          matches: summarize(top),
          message: top.length
            ? 'Matches are on screen as big circles. Present them briefly, best first, and ask who they want to meet.'
            : 'Nobody else has checked in yet. Tell them they are first in the room and to come back in a few minutes.',
        };
      })();

      matchingRef.current = job;
      job.finally(() => {
        matchingRef.current = null;
      });
      return job;
    },
    [loadMembers, youProfile]
  );

  const focusMatch = useCallback((index: number | null) => {
    const list = latest.current.pairs;
    if (index != null && !list[index]) return { ok: false, error: `No match at index ${index}` };
    setFocusedIndex(index);
    if (latest.current.phase !== 'matches') setPhase('matches');
    return { ok: true, focused: index != null ? summarize(list)[index] : null };
  }, []);

  const confirmMatch = useCallback(async (index: number) => {
    const pair = latest.current.pairs[index];
    if (!pair) return { ok: false, error: `No match at index ${index}` };

    setConfirmedPair(pair);
    latest.current.confirmedPair = pair;
    setPhase('confirmed');

    if (!connectedIdsRef.current.has(pair.right.id)) {
      connectedIdsRef.current.add(pair.right.id);
      void fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: latest.current.memberId, profileId: pair.right.id, action: 'connect' }),
      }).catch(() => undefined);
    }

    setAiLoading(true);
    let finalPair = pair;
    try {
      const brief = await Promise.race([
        fetchAiMatch(pair),
        sleep(AI_BRIEF_TIMEOUT_MS).then(() => null),
      ]);
      if (brief) {
        finalPair = { ...pair, brief };
        if (latest.current.confirmedPair?.right.id === pair.right.id) setConfirmedPair(finalPair);
      }
    } catch {
      /* local brief is already on screen */
    } finally {
      setAiLoading(false);
    }

    return {
      ok: true,
      name: finalPair.right.name,
      why: finalPair.brief.why,
      topics: finalPair.brief.topics,
      youHelpThem: finalPair.brief.youHelpThem,
      theyHelpYou: finalPair.brief.theyHelpYou,
      motivation: motivationLines(finalPair),
    };
  }, []);

  const resetFlow = useCallback(() => {
    latest.current.answers = EMPTY_ANSWERS;
    latest.current.pairs = [];
    latest.current.stepIndex = 0;
    latest.current.confirmedPair = null;
    latest.current.memberId = null;
    setAnswers(EMPTY_ANSWERS);
    setStepIndex(0);
    setPairs([]);
    setHighlightIds([]);
    setFocusedIndex(null);
    setConfirmedPair(null);
    setMemberId(null);
    setDraft('');
    connectedIdsRef.current.clear();
  }, []);

  /* ── RPC tools the agent calls (see agents/noshy-voice-host) ── */

  const handlers = useMemo<RpcHandlers>(
    () => ({
      get_flow_state: () => {
        const s = latest.current;
        const open = nextOpenStep(s.answers);
        return {
          ok: true,
          phase: s.phase,
          step: open === -1 ? null : stepInfo(open),
          answers: s.answers,
          complete: open === -1,
          matches: summarize(s.pairs),
          confirmed: s.confirmedPair?.right.name ?? null,
        };
      },
      show_question: (payload) => {
        const index = Number(payload.index ?? 0);
        if (!VOICE_STEPS[index]) return { ok: false, error: 'index must be 0-3' };
        setStepIndex(index);
        latest.current.stepIndex = index;
        if (latest.current.phase === 'intro') setPhase('interview');
        return { ok: true, step: stepInfo(index) };
      },
      save_answer: (payload) => saveAnswer(String(payload.field ?? ''), String(payload.value ?? '')),
      find_matches: (payload) =>
        runMatching({
          role: typeof payload.role === 'string' ? payload.role : undefined,
          animal: typeof payload.animal === 'string' ? payload.animal : undefined,
        }),
      focus_match: (payload) => focusMatch(payload.index == null ? null : Number(payload.index)),
      confirm_match: (payload) => confirmMatch(Number(payload.index ?? 0)),
      restart_flow: () => {
        resetFlow();
        setPhase('interview');
        return { ok: true, step: stepInfo(0) };
      },
    }),
    [confirmMatch, focusMatch, resetFlow, runMatching, saveAnswer]
  );

  const voice = useNoshyVoiceAgent(handlers);
  const connected = voice.connection === 'connected';
  const hostLive = connected && voice.agentJoined;

  useEffect(() => {
    if (!connected || voice.agentJoined) return;
    const timer = window.setTimeout(() => {
      setTyping(true);
      setNotice("NoShy's voice host didn't join — type your answers instead.");
    }, AGENT_JOIN_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [connected, voice.agentJoined]);

  useEffect(() => {
    if (voice.connection === 'error' && mode === 'voice') {
      setMode('text');
      setTyping(true);
      setNotice('Voice host is offline — type your answers instead.');
    }
  }, [mode, voice.connection]);

  useEffect(() => {
    if (!voice.micBlocked) return;
    setTyping(true);
    setNotice('Microphone is blocked — NoShy will still talk, type your answers below.');
  }, [voice.micBlocked]);

  /* ── On-screen controls ── */

  const { sendText } = voice;
  const tellAgent = useCallback(
    (text: string) => {
      if (hostLive) void sendText(text);
    },
    [hostLive, sendText]
  );

  const startVoice = () => {
    setNotice(null);
    setMode('voice');
    setTyping(false);
    setPhase('interview');
    void voice.connect();
  };

  const startTyping = () => {
    setNotice(null);
    setMode('text');
    setTyping(true);
    setPhase('interview');
  };

  const submitDraft = (event: FormEvent) => {
    event.preventDefault();
    const step = VOICE_STEPS[stepIndex];
    if (!step || !draft.trim()) return;
    const value = draft.trim();
    const result = saveAnswer(step.id, value);
    if (!result.ok) return;
    setDraft('');
    tellAgent(`[screen] I typed my answer to "${step.label}": ${value}. It is already saved — continue.`);
    if (result.complete && !hostLive) void runMatching();
  };

  const findMatchesNow = () => {
    tellAgent('[screen] I tapped "Find my matches". Matching is running now — talk me through it.');
    void runMatching();
  };

  const onFocusFromScreen = (index: number | null) => {
    focusMatch(index);
    if (index != null) tellAgent(`[screen] I opened ${pairs[index]?.right.name}'s card.`);
  };

  const onConfirmFromScreen = (index: number) => {
    const name = pairs[index]?.right.name;
    void confirmMatch(index);
    tellAgent(`[screen] I confirmed ${name}. It is already on screen — motivate me to go talk to them now.`);
  };

  const restart = () => {
    resetFlow();
    setPhase('interview');
    tellAgent('[screen] I tapped "Start over". Everything is cleared — start again from my name.');
  };

  const endSession = () => {
    void voice.disconnect();
    resetFlow();
    setPhase('intro');
    setMode('voice');
    setTyping(false);
  };

  const toggleMute = () => {
    const next = !muted;
    setMutedState(next);
    void voice.setMuted(next);
  };

  const waveMode: WaveMode = !connected
    ? 'idle'
    : voice.agentState === 'speaking'
      ? 'speaking'
      : voice.agentState === 'thinking'
        ? 'thinking'
        : voice.agentState === 'listening'
          ? 'listening'
          : 'idle';

  const statusLabel =
    mode === 'text' && !connected
      ? 'Typing mode'
      : voice.connection === 'connecting'
        ? 'Connecting to NoShy…'
        : !connected
          ? 'Voice off'
          : !voice.agentJoined
            ? 'NoShy is joining…'
            : voice.agentState === 'speaking'
            ? 'NoShy is speaking'
            : voice.agentState === 'thinking'
              ? 'Thinking…'
              : voice.agentState === 'listening'
                ? muted
                  ? 'Mic muted'
                  : 'Listening — just talk'
                : 'NoShy is joining…';

  const step = VOICE_STEPS[stepIndex];
  const complete = nextOpenStep(answers) === -1;
  const savedAnswer = step ? answers[step.id] : '';
  const you: GlobeNode = {
    id: youProfile.id,
    emoji: getNetworkingAnimal(answers.animalId)?.emoji ?? '✨',
    color: getNetworkingAnimal(answers.animalId)?.color ?? '#00f2ff',
  };
  const globePeople: GlobeNode[] = members
    .filter((m) => m.id !== youProfile.id)
    .slice(0, 30)
    .map((m) => ({
      id: m.id,
      emoji: getNetworkingAnimal(m.animalId)?.emoji ?? '•',
      color: getNetworkingAnimal(m.animalId)?.color ?? '#00f2ff',
    }));

  return (
    <main
      className="fixed inset-0 overflow-clip bg-[#0b011d] text-white"
      style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
    >
      <Backdrop />

      <header className="absolute inset-x-0 top-0 z-30 flex min-h-[4.5rem] items-center justify-end px-5 py-4 md:min-h-[5.5rem] md:px-10 md:py-6">
        {phase === 'interview' && (
          <div className="absolute left-1/2 flex -translate-x-1/2 gap-2" aria-label={`Step ${stepIndex + 1} of ${VOICE_STEPS.length}`}>
            {VOICE_STEPS.map((s, i) => (
              <motion.i
                key={s.id}
                className="block h-1.5 rounded-full"
                animate={{
                  width: i === stepIndex ? 28 : 8,
                  backgroundColor: answers[s.id] ? '#00f2ff' : i === stepIndex ? '#ff007a' : 'rgba(255,255,255,0.18)',
                }}
                transition={{ duration: 0.45, ease }}
              />
            ))}
          </div>
        )}

        {phase !== 'intro' && (
          <div className="flex items-center gap-2">
            {connected && (
              <button
                type="button"
                onClick={toggleMute}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"
                aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {muted ? <MicOff size={17} /> : <Mic size={17} />}
              </button>
            )}
            <button
              type="button"
              onClick={endSession}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-[#ff007a]/50 hover:text-[#ff007a]"
              aria-label="End session"
            >
              <PhoneOff size={17} />
            </button>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.section key="intro" {...sectionMotion} className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <VoiceWave levelsRef={voice.levelsRef} mode="idle" className="pointer-events-none absolute inset-x-0 top-1/2 h-[46vh] w-full -translate-y-1/2 opacity-80" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.p
                className="font-mono text-xs uppercase tracking-[0.35em] text-[#00f2ff]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease }}
              >
                NoShy Networking · Voice
              </motion.p>
              <motion.h1
                className="mt-5 text-5xl font-extrabold leading-[1.02] tracking-tight md:text-8xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9, ease }}
              >
                Talk. Match.
                <br />
                <span className="bg-gradient-to-r from-[#00f2ff] via-white to-[#ff007a] bg-clip-text text-transparent">Meet.</span>
              </motion.h1>
              <motion.p
                className="mt-6 max-w-md text-base text-white/55 md:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.8 }}
              >
                Answer 3 quick questions out loud. NoShy finds the people in this room you should talk to tonight.
              </motion.p>
              <motion.div
                className="mt-10 flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.7, ease }}
              >
                <motion.button
                  type="button"
                  onClick={startVoice}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative flex items-center gap-3 rounded-full bg-gradient-to-r from-[#00f2ff] to-[#ff007a] px-9 py-4 text-base font-bold text-[#0b011d] shadow-[0_0_50px_rgba(0,242,255,0.35)]"
                >
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-[#00f2ff]"
                    animate={{ scale: [1, 1.18], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <Mic size={20} /> Start talking
                </motion.button>
                <button
                  type="button"
                  onClick={startTyping}
                  className="flex items-center gap-2 text-sm text-white/45 transition hover:text-white/80"
                >
                  <Keyboard size={15} /> I&apos;d rather type
                </button>
              </motion.div>
            </div>
          </motion.section>
        )}

        {phase === 'interview' && step && (
          <motion.section key="interview" {...sectionMotion} className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-28 pt-24">
            <div className="relative z-10 flex min-h-[9.5rem] w-full max-w-4xl flex-col items-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
                  transition={{ duration: 0.7, ease }}
                  className="flex flex-col items-center"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#00f2ff]">{step.eyebrow}</p>
                  <h2 className="mt-4 text-4xl font-bold leading-tight md:text-7xl">{step.label}</h2>
                  <p className="mt-4 text-base text-white/45 md:text-xl">{step.hint}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative my-4 h-[30vh] min-h-[180px] w-full max-w-6xl md:h-[34vh]">
              <VoiceWave levelsRef={voice.levelsRef} mode={waveMode} className="absolute inset-0 h-full w-full" />
            </div>

            <div className="relative z-10 flex min-h-[5rem] w-full max-w-3xl flex-col items-center text-center">
              <AnimatePresence mode="wait">
                {savedAnswer ? (
                  <motion.p
                    key={`saved-${step.id}`}
                    className="flex items-start gap-2 text-xl text-white/85 md:text-2xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <Check className="mt-1.5 shrink-0 text-[#00f2ff]" size={20} /> {savedAnswer}
                  </motion.p>
                ) : connected && voice.userTranscript && waveMode === 'listening' ? (
                  <motion.p
                    key="live"
                    className="text-xl italic text-white/60 md:text-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    “{voice.userTranscript}”
                  </motion.p>
                ) : null}
              </AnimatePresence>

              {complete && (
                <motion.button
                  type="button"
                  onClick={findMatchesNow}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.3 }}
                  className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00f2ff] to-[#ff007a] px-7 py-3.5 font-bold text-[#0b011d] shadow-[0_0_40px_rgba(255,0,122,0.35)]"
                >
                  <Search size={18} /> Find my matches
                </motion.button>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 px-5 pb-6 md:pb-8">
              {notice && <p className="text-sm text-[#ff007a]/90">{notice}</p>}
              {connected && voice.agentTranscript && (
                <p className="line-clamp-2 max-w-2xl text-center text-sm text-white/40">{voice.agentTranscript}</p>
              )}
              <div className="flex w-full max-w-2xl items-center justify-center gap-3">
                <StatusPill label={statusLabel} busy={voice.connection === 'connecting' || waveMode === 'thinking'} />
                {!typing && (
                  <button
                    type="button"
                    onClick={() => setTyping(true)}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 transition hover:text-white"
                  >
                    <Keyboard size={14} /> Type instead
                  </button>
                )}
              </div>
              <AnimatePresence>
                {typing && !complete && (
                  <motion.form
                    onSubmit={submitDraft}
                    className="flex w-full max-w-2xl items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] p-1.5 pl-5 backdrop-blur-xl focus-within:border-[#00f2ff]/50"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <input
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={step.hint}
                      aria-label={step.label}
                      className="flex-1 bg-transparent text-base text-white placeholder:text-white/30 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim()}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#00f2ff] to-[#ff007a] text-[#0b011d] transition disabled:opacity-40"
                      aria-label="Save answer"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {phase === 'matching' && (
          <motion.section key="matching" {...sectionMotion} className="absolute inset-0">
            <ConnectionGlobe you={you} people={globePeople} highlightIds={highlightIds} className="absolute inset-0 h-full w-full" />
            <div className="pointer-events-none absolute inset-x-0 top-24 flex flex-col items-center px-6 text-center md:top-28">
              <motion.p
                className="font-mono text-xs uppercase tracking-[0.35em] text-[#00f2ff]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {highlightIds.length ? 'Found them' : 'Scanning the room'}
              </motion.p>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={highlightIds.length ? 'found' : 'scan'}
                  className="mt-3 text-3xl font-bold md:text-5xl"
                  initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                  transition={{ duration: 0.6, ease }}
                >
                  {highlightIds.length
                    ? `${highlightIds.length} ${highlightIds.length === 1 ? 'person fits' : 'people fit'} what you need.`
                    : `Connecting you with ${globePeople.length || 'the'} builders here…`}
                </motion.h2>
              </AnimatePresence>
            </div>
            <motion.p
              className="pointer-events-none absolute inset-x-0 bottom-24 text-center text-base text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {getNetworkingAnimal(answers.animalId)
                ? `You're the ${getNetworkingAnimal(answers.animalId)!.emoji} ${getNetworkingAnimal(answers.animalId)!.name} tonight, ${firstName(answers.name)}.`
                : null}
            </motion.p>
          </motion.section>
        )}

        {phase === 'matches' && (
          <motion.section key="matches" {...sectionMotion} className="absolute inset-0 overflow-y-auto pb-28 pt-24">
            {pairs.length ? (
              <MatchOrbs pairs={pairs} focusedIndex={focusedIndex} onFocus={onFocusFromScreen} onConfirm={onConfirmFromScreen} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#00f2ff]">You&apos;re early</p>
                <h2 className="mt-4 text-4xl font-bold md:text-6xl">You&apos;re the first one here.</h2>
                <p className="mt-4 max-w-md text-white/50">Your profile is saved. As people check in, your matches will show up.</p>
                <button
                  type="button"
                  onClick={() => void runMatching()}
                  className="mt-8 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-white/80 transition hover:bg-white/10"
                >
                  Scan again
                </button>
              </div>
            )}
          </motion.section>
        )}

        {phase === 'confirmed' && confirmedPair && (
          <motion.section key="confirmed" {...sectionMotion} className="absolute inset-0 overflow-y-auto pb-28 pt-24">
            <MatchConfirmed
              pair={confirmedPair}
              aiLoading={aiLoading}
              onMoreMatches={() => {
                setFocusedIndex(null);
                setPhase('matches');
                tellAgent('[screen] I went back to see my other matches.');
              }}
              onRestart={restart}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {connected && phase !== 'intro' && phase !== 'interview' && (
        <motion.div
          className="absolute inset-x-0 bottom-6 z-30 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#12081f]/80 py-1.5 pl-2 pr-4 backdrop-blur-xl">
            <VoiceWave levelsRef={voice.levelsRef} mode={waveMode} className="h-9 w-28" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">{statusLabel}</span>
          </div>
        </motion.div>
      )}
    </main>
  );
}

function StatusPill({ label, busy }: { label: string; busy: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 backdrop-blur-xl">
      {busy ? (
        <Loader2 size={13} className="animate-spin text-[#00f2ff]" />
      ) : (
        <motion.span
          className="h-2 w-2 rounded-full bg-[#00f2ff]"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}
      {label}
    </div>
  );
}

function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <motion.div
        className="absolute -left-[20%] -top-[25%] h-[70vh] w-[70vh] rounded-full bg-[#00f2ff]/[0.10] blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-[25%] -right-[15%] h-[75vh] w-[75vh] rounded-full bg-[#ff007a]/[0.11] blur-[130px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
    </div>
  );
}
