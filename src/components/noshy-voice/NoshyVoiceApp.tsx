'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Keyboard, LayoutGrid, Loader2, Mic, MicOff, ScanLine, Search, X } from 'lucide-react';
import { getNetworkingAnimal, type CommunityProfile } from '@/lib/community-data';
import { fetchAiMatch } from '@/lib/noshy-ai';
import { CONNECTION_XP, memberIdOf, parseNoshyCode, type NoshyCode } from '@/lib/noshy-game';
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
import { CardScanner } from '@/components/noshy/CardScanner';
import { NoshyLogo } from '@/components/noshy/NoshyUi';
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
  const [scanKey, setScanKey] = useState(0);
  const [scanError, setScanError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const scanReturnRef = useRef<VoicePhase>('matches');
  const meetParamRef = useRef<number | null>(null);

  // Guests who already registered at /noshy skip the interview; ?meet= comes from a scanned card.
  useEffect(() => {
    const code = parseNoshyCode(window.location.search);
    if (code?.kind === 'meet') meetParamRef.current = code.memberId;
    try {
      const saved = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as
        | (Partial<VoiceAnswers> & { memberId?: number })
        | null;
      if (!saved?.memberId || !saved.name || !saved.business || !saved.lookingFor || !saved.canHelp) return;
      const restored: VoiceAnswers = {
        name: saved.name,
        business: saved.business,
        lookingFor: saved.lookingFor,
        canHelp: saved.canHelp,
        role: saved.role ?? '',
        animalId: saved.animalId ?? '',
      };
      latest.current.answers = restored;
      latest.current.memberId = saved.memberId;
      setAnswers(restored);
      setMemberId(saved.memberId);
    } catch { /* start fresh */ }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 6000);
    return () => window.clearTimeout(timer);
  }, [toast]);

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

  /** Open a scanned attendee card as the focused match (index 0). */
  const scanPerson = useCallback(
    async (targetId: number) => {
      const s = latest.current;
      if (nextOpenStep(s.answers) !== -1) return { ok: false, error: 'Finish the 3 questions first.' };
      if (s.memberId === targetId) return { ok: false, error: "That's your own card. Scan someone else's." };
      const person =
        s.members.find((m) => m.memberId === targetId) ?? (await loadMembers()).find((m) => m.memberId === targetId);
      if (!person) return { ok: false, error: "That card isn't registered at this event yet." };

      const me: CommunityProfile = {
        id: s.memberId != null ? `member-${s.memberId}` : 'you',
        name: s.answers.name,
        role: s.answers.role || guessRole(s.answers.business),
        avatar: '',
        location: 'Medellín',
        skills: [],
        intent: '',
        bio: s.answers.business,
        animalId: s.answers.animalId,
        business: s.answers.business,
        lookingFor: s.answers.lookingFor,
        canHelp: s.answers.canHelp,
      };
      const pair = matchesFor(me, [person])[0];
      const next = [pair, ...latest.current.pairs.filter((p) => p.right.id !== person.id)];
      latest.current.pairs = next;
      latest.current.confirmedPair = null;
      setPairs(next);
      setConfirmedPair(null);
      setFocusedIndex(0);
      setScanError(null);
      setPhase('matches');
      return {
        ok: true,
        scanned: summarize(next)[0],
        topics: pair.brief.topics,
        message:
          'Their card is open on screen at index 0 (the matches list was re-indexed). Say you found them, the score, ' +
          'one concrete reason, and one opening question. Then send the guest to talk to them.',
      };
    },
    [loadMembers]
  );

  /** Record "we actually talked". Confirmed (+XP) once the other person logs it too. */
  const logConnection = useCallback(async (index: number, note?: string) => {
    const pair = latest.current.pairs[index] ?? latest.current.confirmedPair;
    const targetId = pair ? memberIdOf(pair.right.id) : null;
    if (!pair || targetId == null) return { ok: false, error: `No match at index ${index}` };
    if (latest.current.memberId == null) return { ok: false, error: 'The guest has no saved profile yet.' };
    try {
      const res = await fetch('/api/noshy/meet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: latest.current.memberId, targetId, source: 'voice', note }),
      });
      const data = (await res.json()) as { status?: 'confirmed' | 'waiting'; progress?: { xp: number }; error?: string };
      if (!res.ok) return { ok: false, error: data.error || 'Could not save the connection.' };
      const them = firstName(pair.right.name);
      const confirmed = data.status === 'confirmed';
      setToast(
        confirmed
          ? `🤝 Connection confirmed with ${them} · +${CONNECTION_XP} XP`
          : `Connection recorded. Ask ${them} to scan your card for +${CONNECTION_XP} XP.`
      );
      return {
        ok: true,
        name: pair.right.name,
        status: data.status,
        xp: data.progress?.xp ?? 0,
        message: confirmed
          ? `Both confirmed. Celebrate: connection made, plus ${CONNECTION_XP} XP.`
          : `Recorded. It counts for ${CONNECTION_XP} XP when ${them} scans the guest's card too; tell them to ask for it.`,
      };
    } catch {
      return { ok: false, error: 'Could not save the connection.' };
    }
  }, []);

  const openScanner = useCallback(() => {
    if (nextOpenStep(latest.current.answers) !== -1) return { ok: false, error: 'Finish the 3 questions first.' };
    if (latest.current.phase !== 'scan') scanReturnRef.current = latest.current.phase;
    setScanError(null);
    setScanKey((key) => key + 1);
    setPhase('scan');
    return { ok: true, message: 'The camera is open. Tell the guest to point it at the QR on the other person\'s NoShy card.' };
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
          registered: s.memberId != null,
          scannedMemberId: meetParamRef.current,
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
      find_matches: (payload) => {
        const s = latest.current;
        // Returning guests: matches may already be on screen when the host joins.
        if (!matchingRef.current && s.phase === 'matches' && s.pairs.length) {
          return { ok: true, matches: summarize(s.pairs), message: 'Matches are already on screen. Present them briefly, best first.' };
        }
        return runMatching({
          role: typeof payload.role === 'string' ? payload.role : undefined,
          animal: typeof payload.animal === 'string' ? payload.animal : undefined,
        });
      },
      show_scanner: () => openScanner(),
      scan_card: (payload) => scanPerson(Number(payload.memberId)),
      log_connection: (payload) =>
        logConnection(Number(payload.index ?? 0), typeof payload.note === 'string' ? payload.note : undefined),
      focus_match: (payload) => focusMatch(payload.index == null ? null : Number(payload.index)),
      confirm_match: (payload) => confirmMatch(Number(payload.index ?? 0)),
      restart_flow: () => {
        resetFlow();
        setPhase('interview');
        return { ok: true, step: stepInfo(0) };
      },
    }),
    [confirmMatch, focusMatch, logConnection, openScanner, resetFlow, runMatching, saveAnswer, scanPerson]
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
    if (nextOpenStep(latest.current.answers) === -1) {
      // Already registered: the host picks this up from get_flow_state.
      if (meetParamRef.current != null) void scanPerson(meetParamRef.current).then((r) => { if (!r.ok) void runMatching(); });
      else void runMatching();
    } else {
      setPhase('interview');
    }
    void voice.connect();
  };

  const onScanned = async (code: NoshyCode) => {
    if (code.kind === 'mission') {
      window.location.href = `/noshy?mission=${code.missionId}`;
      return;
    }
    const result = await scanPerson(code.memberId);
    if (!result.ok) {
      setScanError(result.error ?? 'Could not read that card.');
      setScanKey((key) => key + 1);
      return;
    }
    tellAgent(
      `[screen] I scanned a NoShy card: ${JSON.stringify(result.scanned)}. Their card is open at index 0. ` +
        'Tell me why I should talk to them and how to open.'
    );
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
    // Keep a registered guest's profile so the next session doesn't re-interview them.
    const { answers: savedAnswers, memberId: savedId } = latest.current;
    void voice.disconnect();
    resetFlow();
    if (savedId != null) {
      latest.current.answers = savedAnswers;
      latest.current.memberId = savedId;
      setAnswers(savedAnswers);
      setMemberId(savedId);
    }
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
    color: getNetworkingAnimal(answers.animalId)?.color ?? '#1f5fff',
  };
  const globePeople: GlobeNode[] = members
    .filter((m) => m.id !== youProfile.id)
    .slice(0, 30)
    .map((m) => ({
      id: m.id,
      emoji: getNetworkingAnimal(m.animalId)?.emoji ?? '•',
      color: getNetworkingAnimal(m.animalId)?.color ?? '#1f5fff',
    }));

  const showScanInHeader = !connected && (phase === 'matches' || phase === 'confirmed');
  const scanFromScreen = () => {
    openScanner();
    tellAgent('[screen] I opened the card scanner.');
  };

  return (
    <main
      className="noshy-voice fixed inset-0 overflow-clip bg-black text-white"
      style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
    >
      <Backdrop />

      <header className="absolute inset-x-0 top-0 z-30 flex min-h-[4rem] items-center justify-between px-4 py-3 md:min-h-[5rem] md:px-10">
        <a href="/noshy" aria-label="NoShy home" className="text-white">
          <NoshyLogo />
        </a>

        {phase === 'interview' && (
          <div className="absolute left-1/2 flex -translate-x-1/2 gap-1.5" aria-label={`Step ${stepIndex + 1} of ${VOICE_STEPS.length}`}>
            {VOICE_STEPS.map((s, i) => (
              <motion.i
                key={s.id}
                className="block h-1.5 rounded-full"
                animate={{
                  width: i === stepIndex ? 24 : 8,
                  backgroundColor: i === stepIndex ? '#ffffff' : answers[s.id] ? '#5b8cff' : 'rgba(255,255,255,0.18)',
                }}
                transition={{ duration: 0.45, ease }}
              />
            ))}
          </div>
        )}

        {phase !== 'intro' && (
          <div className="flex items-center gap-2">
            {showScanInHeader && (
              <button
                type="button"
                onClick={scanFromScreen}
                className="flex h-9 items-center gap-1.5 rounded-full bg-white/10 px-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <ScanLine size={15} /> Scan
              </button>
            )}
            {memberId != null && (
              <a
                href="/noshy"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/15"
                aria-label="Open NoShy home: missions, connections, your card"
              >
                <LayoutGrid size={16} />
              </a>
            )}
            <button
              type="button"
              onClick={endSession}
              className="flex h-9 items-center rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              End
            </button>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.section key="intro" {...sectionMotion} className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-40 pt-20">
            <VoiceOrb mode="idle" className="h-52 w-52 md:h-64 md:w-64" />
            <motion.h1
              className="mt-10 text-center text-[2rem] font-bold leading-tight tracking-tight md:text-5xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease }}
            >
              Talk to NoShy.
            </motion.h1>
            <motion.p
              className="mt-3 max-w-xs text-center text-[15px] leading-snug text-white/60 md:max-w-sm md:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.8 }}
            >
              {complete
                ? `Welcome back, ${firstName(answers.name)}. I'll find who you should meet next.`
                : "I'll ask you a few questions and find the people you should meet tonight."}
            </motion.p>
            <VoiceWave levelsRef={voice.levelsRef} mode="idle" className="pointer-events-none mt-6 h-16 w-full max-w-sm" />
            <a href="/noshy" className="mt-2 text-sm text-white/45 transition hover:text-white/80">
              Scan cards or explore manually
            </a>

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-8 md:pb-10">
              <p className="text-xs text-white/40">Tap the mic to start</p>
              <div className="flex items-center gap-7">
                {!complete ? (
                  <RoundButton onClick={startTyping} label="Type instead">
                    <Keyboard size={20} />
                  </RoundButton>
                ) : (
                  <span className="w-14" aria-hidden="true" />
                )}
                <MicButton onClick={startVoice} label="Start talking" pulse />
                <RoundButton href="/noshy" label="Close voice host">
                  <X size={20} />
                </RoundButton>
              </div>
            </div>
          </motion.section>
        )}

        {phase === 'interview' && step && (
          <motion.section key="interview" {...sectionMotion} className="absolute inset-0 flex flex-col items-center px-6 pb-48 pt-20 md:pt-24">
            <VoiceOrb mode={waveMode} className="h-28 w-28 shrink-0 md:h-36 md:w-36" />

            <div className="relative z-10 mt-6 flex min-h-[8.5rem] w-full max-w-2xl flex-col items-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                  transition={{ duration: 0.6, ease }}
                  className="flex flex-col items-center"
                >
                  <p className="text-sm font-medium text-[#5b8cff]">{step.eyebrow}</p>
                  <h2 className="mt-2 text-[1.85rem] font-bold leading-tight tracking-tight md:text-5xl">{step.label}</h2>
                  <p className="mt-2 text-[15px] text-white/50 md:text-lg">{step.hint}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative my-2 h-24 w-full max-w-xl md:h-32">
              <VoiceWave levelsRef={voice.levelsRef} mode={waveMode} className="absolute inset-0 h-full w-full" />
            </div>

            <div className="relative z-10 flex min-h-[4.5rem] w-full max-w-xl flex-col items-center text-center">
              <AnimatePresence mode="wait">
                {savedAnswer ? (
                  <motion.p
                    key={`saved-${step.id}`}
                    className="flex items-start gap-2 rounded-2xl border border-white/[0.08] bg-[#141416] px-4 py-3 text-left text-[15px] text-white/90 md:text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <Check className="mt-0.5 shrink-0 text-[#5b8cff]" size={18} /> {savedAnswer}
                  </motion.p>
                ) : connected && voice.userTranscript && waveMode === 'listening' ? (
                  <motion.p
                    key="live"
                    className="text-lg italic text-white/60 md:text-xl"
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
                  className="noshy-btn noshy-btn-primary mt-5 px-7"
                >
                  <Search size={18} /> Find my matches
                </motion.button>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 px-5 pb-7 md:pb-9">
              {notice && <p className="text-center text-sm text-[#ff6b6b]">{notice}</p>}
              {connected && voice.agentTranscript && (
                <p className="line-clamp-2 max-w-xl text-center text-sm text-white/40">{voice.agentTranscript}</p>
              )}
              <StatusPill label={statusLabel} busy={voice.connection === 'connecting' || waveMode === 'thinking'} />
              <AnimatePresence>
                {typing && !complete && (
                  <motion.form
                    onSubmit={submitDraft}
                    className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-white/[0.14] bg-[#0e0e10] p-1.5 pl-4 focus-within:border-[#1f5fff]"
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
                      className="min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-white/30 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim()}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1f5fff] text-white transition disabled:opacity-40"
                      aria-label="Save answer"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
              <div className="flex items-center gap-7">
                <RoundButton onClick={() => setTyping((t) => !t)} label={typing ? 'Hide keyboard' : 'Type instead'} active={typing}>
                  <Keyboard size={20} />
                </RoundButton>
                <MicButton
                  onClick={connected ? toggleMute : startVoice}
                  label={connected ? (muted ? 'Unmute microphone' : 'Mute microphone') : 'Start talking'}
                  muted={connected && muted}
                />
                <RoundButton onClick={endSession} label="End session">
                  <X size={20} />
                </RoundButton>
              </div>
            </div>
          </motion.section>
        )}

        {phase === 'matching' && (
          <motion.section key="matching" {...sectionMotion} className="absolute inset-0">
            <ConnectionGlobe you={you} people={globePeople} highlightIds={highlightIds} className="absolute inset-0 h-full w-full" />
            <div className="pointer-events-none absolute inset-x-0 top-20 flex flex-col items-center px-6 text-center md:top-28">
              <motion.p
                className="text-sm font-medium text-[#5b8cff]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {highlightIds.length ? 'Found them' : 'Scanning the room'}
              </motion.p>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={highlightIds.length ? 'found' : 'scan'}
                  className="mt-2 max-w-md text-[1.75rem] font-bold leading-tight tracking-tight md:text-5xl"
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
              className="pointer-events-none absolute inset-x-0 bottom-28 px-6 text-center text-[15px] text-white/50"
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
          <motion.section key="matches" {...sectionMotion} className="absolute inset-0 overflow-y-auto pb-48 pt-16 md:pt-20">
            {pairs.length ? (
              <MatchOrbs pairs={pairs} focusedIndex={focusedIndex} onFocus={onFocusFromScreen} onConfirm={onConfirmFromScreen} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <p className="text-sm font-medium text-[#5b8cff]">You&apos;re early</p>
                <h2 className="mt-2 text-[1.85rem] font-bold tracking-tight md:text-5xl">You&apos;re the first one here.</h2>
                <p className="mt-3 max-w-sm text-[15px] text-white/50">Your profile is saved. As people check in, your matches will show up.</p>
                <button type="button" onClick={() => void runMatching()} className="noshy-btn noshy-btn-secondary mt-7">
                  Scan again
                </button>
              </div>
            )}
          </motion.section>
        )}

        {phase === 'confirmed' && confirmedPair && (
          <motion.section key="confirmed" {...sectionMotion} className="absolute inset-0 overflow-y-auto pb-48 pt-16 md:pt-20">
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

        {phase === 'scan' && (
          <motion.section key="scan" {...sectionMotion} className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-5 pb-28 pt-20 text-center">
            <h2 className="text-[1.6rem] font-bold tracking-tight md:text-4xl">Scan their NoShy card.</h2>
            <CardScanner key={scanKey} onCode={(code) => void onScanned(code)} className="w-full max-w-sm" />
            {scanError && <p className="text-sm text-[#ff6b6b]">{scanError}</p>}
            <button type="button" onClick={() => setPhase(scanReturnRef.current)} className="noshy-btn noshy-btn-secondary">
              <X size={16} /> Cancel
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.p
            key={toast}
            role="status"
            className="absolute inset-x-4 top-16 z-40 mx-auto max-w-md rounded-2xl border border-[#1f5fff]/50 bg-[#0e0e10]/95 px-5 py-3 text-center text-sm text-white backdrop-blur-xl md:top-20"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease }}
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>

      {connected && phase !== 'intro' && phase !== 'interview' && (
        <motion.div
          className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 bg-gradient-to-t from-black via-black/90 to-transparent px-5 pb-7 pt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <VoiceWave levelsRef={voice.levelsRef} mode={waveMode} className="h-10 w-56" />
          <span className="text-xs text-white/50">{statusLabel}</span>
          <div className="mt-1 flex items-center gap-7">
            <RoundButton onClick={scanFromScreen} label="Scan a card" disabled={phase === 'scan' || phase === 'matching'}>
              <ScanLine size={20} />
            </RoundButton>
            <MicButton onClick={toggleMute} label={muted ? 'Unmute microphone' : 'Mute microphone'} muted={muted} />
            <RoundButton onClick={endSession} label="End session">
              <X size={20} />
            </RoundButton>
          </div>
        </motion.div>
      )}
    </main>
  );
}

function StatusPill({ label, busy }: { label: string; busy: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/60">
      {busy ? (
        <Loader2 size={13} className="animate-spin text-[#5b8cff]" />
      ) : (
        <motion.span
          className="h-2 w-2 rounded-full bg-[#1f5fff]"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}
      {label}
    </div>
  );
}

function RoundButton({ children, label, onClick, href, active, disabled }: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  disabled?: boolean;
}) {
  const className = `flex h-14 w-14 items-center justify-center rounded-full border transition disabled:opacity-35 ${
    active ? 'border-white/40 bg-white/15 text-white' : 'border-white/[0.12] bg-[#141416] text-white/85 hover:bg-[#1c1c1f]'
  }`;
  if (href) {
    return <a href={href} className={className} aria-label={label}>{children}</a>;
  }
  return (
    <button type="button" onClick={onClick} className={className} aria-label={label} aria-pressed={active} disabled={disabled}>
      {children}
    </button>
  );
}

function MicButton({ onClick, label, muted, pulse }: { onClick: () => void; label: string; muted?: boolean; pulse?: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className={`relative flex h-[72px] w-[72px] items-center justify-center rounded-full text-white ${
        muted ? 'bg-[#2c2c30]' : 'bg-[#1f5fff] shadow-[0_0_40px_rgba(31,95,255,0.55)]'
      }`}
      aria-label={label}
    >
      {pulse && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-[#1f5fff]"
          animate={{ scale: [1, 1.3], opacity: [0.7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      {muted ? <MicOff size={26} /> : <Mic size={26} />}
    </motion.button>
  );
}

/** Glowing blue planet: the voice host. Breathes faster while NoShy talks. */
function VoiceOrb({ mode, className }: { mode: WaveMode; className?: string }) {
  const speed = mode === 'speaking' ? 1.1 : mode === 'listening' ? 1.8 : mode === 'thinking' ? 1.4 : 3.2;
  const scale = mode === 'speaking' ? 1.07 : mode === 'listening' ? 1.04 : 1.02;
  return (
    <motion.div
      className={`relative ${className ?? ''}`}
      animate={{ scale: [1, scale, 1] }}
      transition={{ duration: speed, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      <div className="absolute -inset-[35%] rounded-full bg-[#1f5fff]/25 blur-3xl" />
      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          background: 'radial-gradient(circle at 34% 28%, #b9cfff 0%, #3a74ff 18%, #1446d6 42%, #061a6b 70%, #01061f 100%)',
          boxShadow: '0 0 70px rgba(31,95,255,0.6), inset -18px -26px 60px rgba(0,0,0,0.65), inset 8px 10px 40px rgba(170,200,255,0.35)',
        }}
      >
        <motion.svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <g fill="none" stroke="#c7d8ff" strokeWidth="0.35">
            <ellipse cx="50" cy="50" rx="49" ry="16" />
            <ellipse cx="50" cy="50" rx="49" ry="34" />
            <ellipse cx="50" cy="50" rx="16" ry="49" />
            <ellipse cx="50" cy="50" rx="34" ry="49" />
            <line x1="1" y1="50" x2="99" y2="50" />
            <line x1="50" y1="1" x2="50" y2="99" />
          </g>
        </motion.svg>
      </div>
      <div className="absolute inset-0 rounded-full ring-1 ring-[#8fb0ff]/40" />
    </motion.div>
  );
}

function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <motion.div
        className="absolute left-1/2 top-[30%] h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1f5fff]/[0.12] blur-[120px]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
