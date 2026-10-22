"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight, Bell, BookOpen, ChevronRight, Compass, Handshake, Heart, Mic,
  QrCode, ScanLine, Search, Sparkles, Trash2, Trophy, Users, X,
} from "lucide-react";
import {
  COMMUNITY_CIRCLES, NETWORKING_ANIMALS, NOSHY_QUESTIONS,
  getNetworkingAnimal, type CommunityProfile,
} from "@/lib/community-data";
import { fetchAiMatch } from "@/lib/noshy-ai";
import { CONNECTION_XP, meetUrl, memberIdOf, parseNoshyCode, type NoshyCode } from "@/lib/noshy-game";
import { matchesFor, rankPairs, type MatchPair } from "@/lib/noshy-match";
import {
  CardScreen, ConnectionsScreen, Leaderboard, MissionsScreen, NightScreen, PersonScreen, ScanScreen,
} from "@/components/noshy/NoshyGameScreens";
import {
  BottomNav, MatchCard, MatchPill, PersonAvatar, Tags, TopBar, animalTags, type NavTab,
} from "@/components/noshy/NoshyUi";
import { useNoshyProgress } from "@/components/noshy/useNoshyProgress";

const cardEase = [0.22, 1, 0.36, 1] as const;
const SESSION_KEY = "noshy-session";
const ADMIN_KEY_STORAGE = "noshy-admin-key";
type Screen =
  | "welcome" | "mode" | "login" | "onboarding" | "home" | "people" | "connect" | "match"
  | "scan" | "person" | "missions" | "connections" | "night" | "card";
type HomeTab = "nearby" | "matched" | "board" | "circles";
type DeskPerson = CommunityProfile & { fromDatabase?: boolean; memberId?: number };

type SessionMember = {
  memberId: number;
  username?: string;
  name: string;
  role?: string;
  animalId?: string;
  business?: string;
  lookingFor?: string;
  canHelp?: string;
};

function saveSession(member: SessionMember) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(member));
  } catch { /* ignore */ }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
}

function readSession(): SessionMember | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SessionMember;
    if (!data?.memberId || !data?.name) return null;
    return data;
  } catch {
    return null;
  }
}

export default function NoshyPage() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [animalId, setAnimalId] = useState("");
  const [business, setBusiness] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [canHelp, setCanHelp] = useState("");
  const [homeTab, setHomeTab] = useState<HomeTab>("nearby");
  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [matchPair, setMatchPair] = useState<MatchPair | null>(null);
  const [connectIndex, setConnectIndex] = useState(0);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [dbMembers, setDbMembers] = useState<DeskPerson[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pickLeftId, setPickLeftId] = useState("");
  const [pickRightId, setPickRightId] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const matchRequest = useRef(0);
  const [activeMission, setActiveMission] = useState<string | null>(null);
  const [missionEarned, setMissionEarned] = useState<number | null>(null);
  const [gameBusy, setGameBusy] = useState(false);
  const [gameError, setGameError] = useState("");
  const [scanNotice, setScanNotice] = useState("");
  // A card or mission QR opened before the profile was ready (deep link from the phone camera).
  const [pendingCode, setPendingCode] = useState<NoshyCode | null>(null);
  const afterJoin = useRef<"home" | "scan">("home");
  const [showJoinQr, setShowJoinQr] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [peopleQuery, setPeopleQuery] = useState("");

  const totalSteps = 3;
  const lastStep = totalSteps - 1;

  useEffect(() => {
    const site =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://anuidev8-porfolio.vercel.app";
    setJoinUrl(`${site}/noshy`);
  }, []);

  const applyProfile = (member: SessionMember) => {
    setMemberId(member.memberId);
    setUsername(member.username ?? "");
    setDisplayName(member.name);
    setRole(member.role ?? "");
    setAnimalId(member.animalId ?? "");
    setBusiness(member.business ?? "");
    setLookingFor(member.lookingFor ?? "");
    setCanHelp(member.canHelp ?? "");
    saveSession(member);
    setHomeTab("matched");
    setScreen(afterJoin.current);
    afterJoin.current = "home";
    void loadMembers();
  };

  const loginByUsername = async (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) {
      setSaveError("Enter your username.");
      return;
    }
    setLoggingIn(true);
    setSaveError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });
      const data = (await res.json()) as {
        error?: string;
        memberId?: number;
        member?: SessionMember & { name: string; username?: string };
      };
      if (!res.ok || !data.member || data.memberId == null) {
        setSaveError(data.error || "No profile found with that username.");
        return;
      }
      applyProfile({
        memberId: data.memberId,
        username: data.member.username,
        name: data.member.name,
        role: data.member.role,
        animalId: data.member.animalId,
        business: data.member.business,
        lookingFor: data.member.lookingFor,
        canHelp: data.member.canHelp,
      });
    } catch {
      setSaveError("Could not log in. Check your connection and try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const youProfile = useMemo<DeskPerson>(() => ({
    id: memberId != null ? `member-${memberId}` : "you",
    name: displayName.trim() || "You",
    role: role.trim() || "Guest",
    avatar: "", location: "Event", skills: [], intent: "",
    bio: business, animalId, business, lookingFor, canHelp, online: true,
  }), [animalId, business, canHelp, displayName, lookingFor, memberId, role]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPendingCode(parseNoshyCode(window.location.search));
    if (params.get("admin") === "1") {
      setIsAdmin(true);
      setScreen("home");
      setHomeTab("matched");
      return;
    }

    const session = readSession();
    if (!session) return;

    void (async () => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberId: session.memberId, username: session.username }),
        });
        if (!res.ok) {
          clearSession();
          return;
        }
        const data = (await res.json()) as { memberId?: number; member?: SessionMember & { name: string } };
        if (!data.member || data.memberId == null) {
          clearSession();
          return;
        }
        applyProfile({
          memberId: data.memberId,
          username: data.member.username,
          name: data.member.name,
          role: data.member.role,
          animalId: data.member.animalId,
          business: data.member.business,
          lookingFor: data.member.lookingFor,
          canHelp: data.member.canHelp,
        });
      } catch {
        // Keep welcome if restore fails
      }
    })();
  }, []);

  // Welcome screen stays until the user taps "Start NoShy"

  const loadMembers = async (): Promise<DeskPerson[] | null> => {
    try {
      const res = await fetch("/api/members");
      if (!res.ok) return null;
      const data = (await res.json()) as { members?: DeskPerson[] };
      setDbMembers(data.members ?? []);
      return data.members ?? [];
    } catch { return null; }
  };

  useEffect(() => {
    if (memberId == null && !isAdmin) return;
    void loadMembers();
    const timer = window.setInterval(() => void loadMembers(), 8000);
    return () => window.clearInterval(timer);
  }, [isAdmin, memberId]);

  const registered = useMemo(() => dbMembers.filter((p) => p.id !== youProfile.id), [dbMembers, youProfile.id]);
  const attendees = useMemo(() => {
    const seen = new Set<string>(); const list: DeskPerson[] = [];
    for (const person of [youProfile, ...dbMembers]) {
      if (!person.name.trim() || seen.has(person.id)) continue;
      if (person.id === "you" && memberId == null && !displayName.trim()) continue;
      seen.add(person.id); list.push(person);
    }
    return list;
  }, [dbMembers, displayName, memberId, youProfile]);

  const nearby = dbMembers;
  const eventPairs = useMemo(() => rankPairs(attendees).slice(0, 12), [attendees]);
  const yourMatches = useMemo(() => {
    if (!displayName.trim() && memberId == null) return [];
    return matchesFor(youProfile, registered).slice(0, 8);
  }, [displayName, memberId, registered, youProfile]);

  const pickLeft = attendees.find((p) => p.id === pickLeftId) ?? null;
  const pickRight = attendees.find((p) => p.id === pickRightId) ?? null;
  const pickedBrief = pickLeft && pickRight && pickLeft.id !== pickRight.id ? matchesFor(pickLeft, [pickRight])[0] : null;
  const pickedMatches = pickLeft ? matchesFor(pickLeft, attendees.filter((p) => p.id !== pickLeft.id)).slice(0, 6) : [];

  const connectPool = registered;
  const remaining = connectPool.filter((p) => !passedIds.includes(p.id));
  const currentConnect = remaining[connectIndex] ?? remaining[0];
  const currentBrief = currentConnect && (displayName.trim() || memberId != null) ? matchesFor(youProfile, [currentConnect])[0] : null;

  const game = useNoshyProgress(memberId, memberId != null || isAdmin);
  const { progress } = game;
  const peopleById = useMemo(() => {
    const map = new Map<number, DeskPerson>();
    for (const person of dbMembers) if (person.memberId != null) map.set(person.memberId, person);
    return map;
  }, [dbMembers]);
  const myCard = memberId != null && joinUrl
    ? { name: displayName, role, animalId, lookingFor, url: meetUrl(joinUrl.replace(/\/noshy$/, ""), memberId) }
    : null;
  const personId = matchPair ? memberIdOf(matchPair.right.id) : null;
  const strongest = useMemo(() => {
    const confirmed = new Set(progress.connections.filter((c) => c.status === "confirmed").map((c) => `member-${c.memberId}`));
    return yourMatches.find((pair) => confirmed.has(pair.right.id)) ?? null;
  }, [progress.connections, yourMatches]);

  const [personScanned, setPersonScanned] = useState(false);

  const openPerson = (person: DeskPerson, viaScan = false) => {
    const pair = matchesFor(youProfile, [person])[0];
    if (!pair) return;
    setGameError("");
    setPersonScanned(viaScan);
    openPair(pair, "person");
  };

  const handleCode = async (code: NoshyCode) => {
    setScanNotice("");
    if (code.kind === "mission") {
      setMissionEarned(null); setGameError(""); setActiveMission(code.missionId); setScreen("missions");
      return;
    }
    if (code.memberId === memberId) { setScanNotice("That's your own profile QR. Scan someone else's."); setScreen("scan"); return; }
    const person = peopleById.get(code.memberId)
      ?? (await loadMembers())?.find((p) => p.memberId === code.memberId);
    if (!person) { setScanNotice("That profile QR isn't registered at this event yet."); setScreen("scan"); return; }
    openPerson(person, true);
  };

  useEffect(() => {
    if (!pendingCode || memberId == null) return;
    if (pendingCode.kind === "meet" && dbMembers.length === 0) return;
    setPendingCode(null);
    window.history.replaceState(null, "", window.location.pathname);
    void handleCode(pendingCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCode, memberId, dbMembers]);

  const connectWith = async (targetId: number, note: string) => {
    setGameBusy(true); setGameError("");
    const result = await game.meet(targetId, "scan", note || undefined);
    if (!result.ok) setGameError(result.error);
    setGameBusy(false);
  };

  const completeMission = async (missionId: string, targetId: number) => {
    setGameBusy(true); setGameError("");
    const result = await game.completeMission(missionId, targetId);
    if (result.ok) { setMissionEarned(result.alreadyDone ? null : result.xp); setActiveMission(null); }
    else setGameError(result.error);
    setGameBusy(false);
  };

  const startOnboarding = (then: "home" | "scan") => {
    afterJoin.current = then;
    setSaveError(""); setStep(0); setScreen("onboarding");
  };

  const finishOnboarding = async () => {
    setSaving(true); setSaveError("");
    try {
      const res = await fetch("/api/join", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          displayName: displayName.trim(),
          role: role.trim(),
          animalId,
          business: business.trim(),
          lookingFor: lookingFor.trim(),
          canHelp: canHelp.trim(),
        }),
      });
      const data = (await res.json()) as {
        memberId?: number;
        error?: string;
        member?: SessionMember & { name: string; username?: string };
      };
      if (!res.ok) { setSaveError(data.error || "Could not save your profile. Try again."); return; }
      if (data.memberId && data.member) {
        applyProfile({
          memberId: data.memberId,
          username: data.member.username || username.trim(),
          name: data.member.name || displayName.trim(),
          role: data.member.role || role.trim(),
          animalId: data.member.animalId || animalId,
          business: data.member.business || business.trim(),
          lookingFor: data.member.lookingFor || lookingFor.trim(),
          canHelp: data.member.canHelp || canHelp.trim(),
        });
        return;
      }
      if (data.memberId) {
        applyProfile({
          memberId: data.memberId,
          username: username.trim(),
          name: displayName.trim(),
          role: role.trim(),
          animalId,
          business: business.trim(),
          lookingFor: lookingFor.trim(),
          canHelp: canHelp.trim(),
        });
      }
    } catch { setSaveError("Could not save your profile. Check your connection and try again."); }
    finally { setSaving(false); }
  };

  const nextStep = () => {
    if (step === 0 && !username.trim()) { setSaveError("Create a username to continue."); return; }
    if (step === 0 && username.trim().length < 3) { setSaveError("Username needs at least 3 characters."); return; }
    if (step === 0 && !displayName.trim()) { setSaveError("Add your name — that’s what people will see."); return; }
    if (step === 0 && !role.trim()) { setSaveError("Add your role to continue."); return; }
    if (step === 1 && !animalId) { setSaveError("Pick an animal — that is your avatar in the room."); return; }
    if (step === 2 && !business.trim()) { setSaveError("Answer question 1: what is your business?"); return; }
    if (step === 2 && !lookingFor.trim()) { setSaveError("Answer question 2: what are you looking for?"); return; }
    if (step === 2 && !canHelp.trim()) { setSaveError("Answer question 3: how can you help someone here?"); return; }
    setSaveError("");
    if (step < lastStep) setStep(step + 1);
    else void finishOnboarding();
  };

  const saveConnection = async (profileId: string, action: "connect" | "pass") => {
    try {
      await fetch("/api/connections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ memberId, profileId, action }) });
    } catch { /* keep local UX */ }
  };

  const passPerson = () => {
    if (!currentConnect) return;
    void saveConnection(currentConnect.id, "pass");
    setPassedIds((prev) => [...prev, currentConnect.id]); setConnectIndex(0);
  };

  const openPair = (pair: MatchPair, target: "match" | "person" = "match") => {
    const requestId = matchRequest.current + 1; matchRequest.current = requestId;
    setMatchPair(pair); setAiLoading(true); setScreen(target);
    void (async () => {
      try {
        const brief = await fetchAiMatch(pair);
        if (matchRequest.current !== requestId) return;
        setMatchPair({ ...pair, brief });
      } catch { if (matchRequest.current !== requestId) return; }
      finally { if (matchRequest.current === requestId) setAiLoading(false); }
    })();
  };

  const deleteMember = async (target: { memberId: number; username?: string; name: string }, self: boolean) => {
    if (deletingId != null) return;
    const ok = window.confirm(
      self
        ? "Delete your NoShy profile? Your matches and connections will be removed. This cannot be undone."
        : `Delete ${target.name} from the event? This removes their profile and connections.`
    );
    if (!ok) return;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (!self) {
      let key = sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
      if (!key) {
        key = window.prompt("Admin key")?.trim() ?? "";
        if (!key) return;
      }
      headers["x-admin-key"] = key;
    }

    setDeletingId(target.memberId);
    setDeleteError("");
    try {
      const res = await fetch("/api/members", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ memberId: target.memberId, username: target.username }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        if (!self && res.status === 401) sessionStorage.removeItem(ADMIN_KEY_STORAGE);
        setDeleteError(data.error || "Could not delete the profile.");
        return;
      }
      if (!self && headers["x-admin-key"]) sessionStorage.setItem(ADMIN_KEY_STORAGE, headers["x-admin-key"]);
      setDbMembers((prev) => prev.filter((p) => p.id !== `member-${target.memberId}`));
      if (self) {
        clearSession();
        setMemberId(null);
        setUsername(""); setDisplayName(""); setRole(""); setAnimalId("");
        setBusiness(""); setLookingFor(""); setCanHelp("");
        setPassedIds([]); setStep(0);
        setScreen("welcome");
      }
    } catch {
      setDeleteError("Could not delete the profile. Check your connection and try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const connectPerson = () => {
    if (!currentConnect || !currentBrief) return;
    void saveConnection(currentConnect.id, "connect");
    setPassedIds((prev) => [...prev, currentConnect.id]); openPair(currentBrief);
  };

  const navTo = (tab: NavTab) => {
    if (tab === "home") setScreen("home");
    else if (tab === "people") setScreen("people");
    else if (tab === "scan") { setScanNotice(""); setScreen("scan"); }
    else if (tab === "missions") { setMissionEarned(null); setActiveMission(null); setScreen("missions"); }
    else setScreen("card");
  };
  const navActive: NavTab | null =
    screen === "home" ? "home" : screen === "people" ? "people" : screen === "card" ? "profile" : null;
  const showNav = !isAdmin && memberId != null && navActive != null;

  const query = peopleQuery.trim().toLowerCase();
  const matchesQuery = (p: { name: string; role: string }) => !query || `${p.name} ${p.role}`.toLowerCase().includes(query);
  const confirmedCount = progress.connections.filter((c) => c.status === "confirmed").length;
  const motionProps = {
    initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 },
    transition: { duration: 0.35, ease: cardEase },
  };

  const pairRow = (pair: MatchPair) => (
    <button key={`${pair.left.id}-${pair.right.id}`} type="button" className="noshy-row" onClick={() => openPair(pair)}>
      <div className="noshy-pair-avatars">
        <PersonAvatar animalId={pair.left.animalId} name={pair.left.name} size={40} shape="circle" />
        <PersonAvatar animalId={pair.right.animalId} name={pair.right.name} size={40} shape="circle" />
      </div>
      <div>
        <MatchPill score={pair.brief.score} />
        <h3>{pair.left.name} × {pair.right.name}</h3>
        <p className="noshy-why-line">{pair.brief.why}</p>
      </div>
      <ChevronRight size={18} />
    </button>
  );

  const peoplePanel = (
    <>
      <div className="noshy-chips" role="tablist">
        {([["matched", "Top matches"], ["nearby", "All attendees"], ["board", "Leaderboard"], ["circles", "Circles"]] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={homeTab === id} className={homeTab === id ? "active" : ""} onClick={() => setHomeTab(id)}>{label}</button>
        ))}
      </div>

      {homeTab === "nearby" && (
        <div className="noshy-list">
          {nearby.length === 0 && (
            <div className="noshy-empty compact"><Users size={28} /><h3>No one checked in yet</h3><p>Scan the event QR, pick an animal, and answer the 3 questions.</p></div>
          )}
          {nearby.filter(matchesQuery).map((profile) => {
            const isYou = memberId != null && profile.id === `member-${memberId}`;
            const canOpen = !isYou && !isAdmin && memberId != null;
            return (
              <article key={profile.id} className={`noshy-row${isYou ? " you" : ""}`} onClick={canOpen ? () => openPerson(profile) : undefined}>
                <PersonAvatar animalId={profile.animalId} name={profile.name} size={52} online={profile.online} />
                <div>
                  <h3>{profile.name}{isYou ? <small> · You</small> : null}</h3>
                  <p>{profile.role}</p>
                  <Tags items={profile.lookingFor ? [profile.lookingFor.slice(0, 32)] : animalTags(profile.animalId)} />
                </div>
                {isAdmin && profile.memberId != null ? (
                  <button
                    type="button"
                    className="noshy-delete-btn"
                    aria-label={`Delete ${profile.name}`}
                    disabled={deletingId === profile.memberId}
                    onClick={() => void deleteMember({ memberId: profile.memberId!, name: profile.name }, false)}
                  >
                    <Trash2 size={15} />
                  </button>
                ) : (
                  <ChevronRight size={18} />
                )}
              </article>
            );
          })}
        </div>
      )}

      {homeTab === "matched" && (
        <div className="noshy-list">
          {!pickLeft && yourMatches.filter((pair) => matchesQuery(pair.right)).map((pair) => (
            <MatchCard key={pair.right.id} pair={pair} onOpen={() => openPair(pair)} />
          ))}
          <p className="noshy-section-label">Match two people</p>
          <div className="noshy-note"><Sparkles size={15} />Pick two people. AI writes why they should talk, the topics, and how they help each other.</div>
          <div className="noshy-admin-pick">
            <label>Person A
              <select value={pickLeftId} onChange={(e) => setPickLeftId(e.target.value)}>
                <option value="">Select attendee</option>
                {attendees.map((p) => <option key={p.id} value={p.id}>{getNetworkingAnimal(p.animalId)?.emoji ?? "•"} {p.name}</option>)}
              </select>
            </label>
            <label>Person B
              <select value={pickRightId} onChange={(e) => setPickRightId(e.target.value)}>
                <option value="">Best matches for A</option>
                {attendees.filter((p) => p.id !== pickLeftId).map((p) => <option key={p.id} value={p.id}>{getNetworkingAnimal(p.animalId)?.emoji ?? "•"} {p.name}</option>)}
              </select>
            </label>
            <button type="button" className="noshy-btn noshy-btn-primary" disabled={!pickedBrief} onClick={() => pickedBrief && openPair(pickedBrief)}>Show match</button>
          </div>
          {attendees.length < 2 && <div className="noshy-empty compact"><Users size={28} /><h3>Waiting for check-ins</h3><p>Matches appear when at least two people register.</p></div>}
          {pickedBrief && pairRow(pickedBrief)}
          {pickLeft && !pickRight && pickedMatches.map((pair) => (
            <MatchCard key={`${pair.left.id}-${pair.right.id}`} pair={pair} onOpen={() => openPair(pair)} />
          ))}
          {!pickLeft && eventPairs.length > 0 && <>
            <p className="noshy-section-label">Best pairs in the room</p>
            {eventPairs.map(pairRow)}
          </>}
        </div>
      )}

      {homeTab === "board" && <Leaderboard rows={progress.leaderboard} memberId={memberId} />}

      {homeTab === "circles" && (
        <div className="noshy-list">
          {COMMUNITY_CIRCLES.map((circle) => (
            <article key={circle.id} className="noshy-circle">
              <div className="noshy-circle-avatars">{circle.avatars.map((a) => <img key={a} src={a} alt="" />)}</div>
              <h3>{circle.name}</h3><p>{circle.description}</p>
              <span><Users size={13} /> {circle.active} active · {circle.members} members</span>
            </article>
          ))}
        </div>
      )}
    </>
  );

  return (
    <main className="noshy-page">
      <div className="noshy-shell">
        <div className="noshy-stage">
          <AnimatePresence mode="wait">

            {screen === "welcome" && (
              <motion.section key="welcome" className="noshy-panel noshy-welcome" {...motionProps}>
                <div className="noshy-welcome-bg" aria-hidden="true" />
                <TopBar
                  right={joinUrl ? (
                    <button type="button" className="noshy-icon-btn" onClick={() => setShowJoinQr((v) => !v)} aria-label={showJoinQr ? "Hide join QR" : "Show join QR"} aria-pressed={showJoinQr}>
                      {showJoinQr ? <X size={18} /> : <QrCode size={18} />}
                    </button>
                  ) : undefined}
                />
                {showJoinQr && joinUrl ? (
                  <div className="noshy-join-qr">
                    <QRCodeSVG value={joinUrl} size={180} level="M" bgColor="#ffffff" fgColor="#000000" marginSize={2} />
                    <p>Scan to join NoShy</p>
                    <span>{joinUrl.replace(/^https?:\/\//, "")}</span>
                  </div>
                ) : (
                  <div className="noshy-welcome-copy">
                    <h1>Meet<br />people<br /><span>worth<br />meeting.</span></h1>
                    <p>AI-powered networking<br />for real builders.</p>
                  </div>
                )}
                <div className="noshy-welcome-actions">
                  {pendingCode && <div className="noshy-note"><Sparkles size={15} />{pendingCode.kind === "meet" ? "You scanned a profile QR. Register and we'll instantly show your match + icebreaker card with them." : "You scanned a mission. Register to complete it."}</div>}
                  <button type="button" className="noshy-btn noshy-btn-white noshy-btn-full" onClick={() => setScreen("mode")}>
                    Get started<ArrowRight size={18} />
                  </button>
                  <button type="button" className="noshy-text-btn" onClick={() => { setSaveError(""); setLoginUsername(username); setScreen("login"); }}>
                    I already have a profile
                  </button>
                  <p className="noshy-powered">Powered by <strong>VisibleBuilders</strong></p>
                </div>
              </motion.section>
            )}

            {screen === "mode" && (
              <motion.section key="mode" className="noshy-panel" {...motionProps}>
                <TopBar right={<button type="button" className="noshy-text-btn" onClick={() => startOnboarding("home")}>Skip</button>} />
                <div className="noshy-title">
                  <h2>How do you want<br />to connect?</h2>
                  <p>You can always switch later.</p>
                </div>
                <div className="noshy-modes">
                  <a className="noshy-mode featured" href="/noshy-voice">
                    <span className="noshy-mode-icon"><Mic size={22} /></span>
                    <div><strong>Talk to NoShy</strong><span>Let the AI host guide you. Answer with your voice.</span></div>
                    <ChevronRight size={20} />
                  </a>
                  <button type="button" className="noshy-mode" onClick={() => startOnboarding("scan")}>
                    <span className="noshy-mode-icon"><ScanLine size={22} /></span>
                    <div><strong>Scan &amp; Discover</strong><span>Use NoShy cards to find people around you.</span></div>
                    <ChevronRight size={20} />
                  </button>
                </div>
                <button type="button" className="noshy-btn noshy-btn-secondary noshy-btn-full" onClick={() => startOnboarding("home")}>
                  Explore manually<ArrowRight size={16} />
                </button>
                <button type="button" className="noshy-text-btn center" onClick={() => setScreen("welcome")}>Back</button>
              </motion.section>
            )}

            {screen === "login" && (
              <motion.section key="login" className="noshy-panel" {...motionProps}>
                <TopBar onBack={() => { setSaveError(""); setScreen("welcome"); }} />
                <div className="noshy-title">
                  <h2>Welcome back.</h2>
                  <p>Enter your username to open your matches.</p>
                </div>
                <label className="noshy-field">
                  Username
                  <input
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="e.g. camila.r"
                    autoComplete="username"
                    autoCapitalize="none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void loginByUsername(loginUsername);
                    }}
                  />
                </label>
                {saveError && <p className="noshy-error">{saveError}</p>}
                <div className="noshy-spacer" />
                <button
                  type="button"
                  className="noshy-btn noshy-btn-primary noshy-btn-full"
                  disabled={loggingIn}
                  onClick={() => void loginByUsername(loginUsername)}
                >
                  {loggingIn ? "Opening…" : "Open my matches"}
                  <ArrowRight size={16} />
                </button>
              </motion.section>
            )}

            {screen === "onboarding" && (
              <motion.section key="onboarding" className="noshy-panel" {...motionProps}>
                <TopBar right={<span className="noshy-counter">{step + 1}/{totalSteps}</span>} />

                {step === 0 && (
                  <>
                    <div className="noshy-title">
                      <h2>Let&apos;s get to know you.</h2>
                      <p>Answer a few questions so we can find the right people for you.</p>
                    </div>
                    <div className="noshy-fields">
                      <label className="noshy-field">
                        Username
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                          placeholder="e.g. camila.r"
                          autoComplete="username"
                          autoCapitalize="none"
                        />
                      </label>
                      <label className="noshy-field">
                        Name
                        <input
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="e.g. Camila Restrepo"
                          autoComplete="name"
                        />
                      </label>
                      <label className="noshy-field">
                        What do you do?
                        <input
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. Founder, developer, marketer"
                        />
                      </label>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="noshy-title">
                      <h2>Pick your animal.</h2>
                      <p>This is your avatar in the room. Wear it, remember it, find your match by it.</p>
                    </div>
                    <div className="noshy-animal-grid">
                      {NETWORKING_ANIMALS.map((animal) => (
                        <button key={animal.id} type="button"
                          className={`noshy-animal${animalId === animal.id ? " selected" : ""}`}
                          aria-pressed={animalId === animal.id}
                          onClick={() => setAnimalId(animal.id)}>
                          <span className="noshy-animal-emoji" aria-hidden="true">{animal.emoji}</span>
                          <strong>{animal.name}</strong>
                          <span>{animal.vibe}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="noshy-title">
                      <h2>What brings you here?</h2>
                      <p>We match people from these 3 answers. No categories.</p>
                    </div>
                    <div className="noshy-fields">
                      {NOSHY_QUESTIONS.map((q) => {
                        const value = q.id === "business" ? business : q.id === "lookingFor" ? lookingFor : canHelp;
                        const onChange = q.id === "business" ? setBusiness : q.id === "lookingFor" ? setLookingFor : setCanHelp;
                        return (
                          <label key={q.id} className="noshy-field">{q.label}
                            <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={q.placeholder} rows={3} />
                          </label>
                        );
                      })}
                    </div>
                  </>
                )}

                {saveError && <p className="noshy-error">{saveError}</p>}
                <div className="noshy-spacer" />
                <div className="noshy-btn-row">
                  <button type="button" className="noshy-btn noshy-btn-secondary noshy-btn-narrow" onClick={() => (step > 0 ? setStep(step - 1) : setScreen("mode"))}>Back</button>
                  <button type="button" className="noshy-btn noshy-btn-primary" onClick={nextStep} disabled={saving}>
                    {step === lastStep ? (saving ? "Saving…" : "See my matches") : "Continue"}<ArrowRight size={16} />
                  </button>
                </div>
              </motion.section>
            )}

            {screen === "home" && isAdmin && (
              <motion.section key="home-admin" className="noshy-panel" {...motionProps}>
                <TopBar right={<span className="noshy-counter">Admin</span>} />
                <div className="noshy-title">
                  <h2>{attendees.length ? "Find matches in the room." : "Waiting for check-ins."}</h2>
                  <p>Medellín · {attendees.length} registered</p>
                </div>
                {deleteError && <p className="noshy-error">{deleteError}</p>}
                {peoplePanel}
              </motion.section>
            )}

            {screen === "home" && !isAdmin && (
              <motion.section key="home" className="noshy-panel" {...motionProps}>
                <TopBar
                  right={memberId != null ? (
                    <button type="button" className="noshy-icon-btn" onClick={() => setScreen("connections")} aria-label={`Connections${progress.incoming.length ? `, ${progress.incoming.length} waiting` : ""}`}>
                      <Bell size={19} />
                      {progress.incoming.length > 0 && <i className="noshy-badge">{progress.incoming.length}</i>}
                    </button>
                  ) : undefined}
                />
                <div className="noshy-title">
                  <h2>Your top matches</h2>
                  <p>Based on your goals, skills and what you&apos;re looking for.</p>
                </div>

                {memberId != null && (
                  <button type="button" className="noshy-xp" onClick={() => setScreen("night")}>
                    <Trophy size={17} /><strong>{progress.xp} XP</strong>
                    <span>{confirmedCount} connections · {progress.missions.length} missions{progress.rank ? ` · #${progress.rank}` : ""}</span>
                    <ChevronRight size={16} />
                  </button>
                )}
                {progress.incoming.map((id) => {
                  const person = peopleById.get(id);
                  return person ? (
                    <button key={id} type="button" className="noshy-note noshy-note-action" onClick={() => openPerson(person)}>
                      <Handshake size={15} />{person.name} says you two talked. Confirm for +{CONNECTION_XP} XP.
                    </button>
                  ) : null;
                })}

                <div className="noshy-list">
                  {yourMatches.length === 0 && (
                    <div className="noshy-empty compact"><Users size={28} /><h3>No matches yet</h3><p>Your matches show up here as people check in.</p></div>
                  )}
                  {yourMatches.slice(0, 5).map((pair) => (
                    <MatchCard key={pair.right.id} pair={pair} onOpen={() => openPerson(pair.right)} />
                  ))}
                </div>

                <div className="noshy-quick">
                  <a href="/noshy-voice"><Mic size={18} />Talk to NoShy</a>
                  <button type="button" onClick={() => setScreen("connect")}><Compass size={18} />Meet people</button>
                </div>
              </motion.section>
            )}

            {screen === "people" && (
              <motion.section key="people" className="noshy-panel" {...motionProps}>
                <TopBar
                  right={
                    <button type="button" className="noshy-icon-btn" onClick={() => { setSearchOpen((v) => !v); setPeopleQuery(""); }} aria-label={searchOpen ? "Close search" : "Search people"} aria-pressed={searchOpen}>
                      {searchOpen ? <X size={19} /> : <Search size={19} />}
                    </button>
                  }
                />
                <div className="noshy-title"><h2>People</h2></div>
                {searchOpen && (
                  <input className="noshy-search" value={peopleQuery} onChange={(e) => setPeopleQuery(e.target.value)} placeholder="Search by name or role" aria-label="Search people" autoFocus />
                )}
                {deleteError && <p className="noshy-error">{deleteError}</p>}
                {peoplePanel}
              </motion.section>
            )}

            {screen === "connect" && (
              <motion.section key="connect" className="noshy-panel" {...motionProps}>
                <TopBar onBack={() => setScreen("home")} />
                {currentConnect ? (
                  <>
                    <div className="noshy-profile-hero">
                      <PersonAvatar animalId={currentConnect.animalId} name={currentConnect.name} size={116} shape="circle" />
                      {currentBrief && <MatchPill score={currentBrief.brief.score} />}
                      <h2>{currentConnect.name}</h2>
                      <p>{currentConnect.role}</p>
                      <Tags items={animalTags(currentConnect.animalId)} />
                    </div>
                    <div className="noshy-about">
                      <h3>About</h3>
                      <p>{currentConnect.bio || currentConnect.business || currentConnect.canHelp}</p>
                      {currentConnect.lookingFor && <p><b>Looking for:</b> {currentConnect.lookingFor}</p>}
                    </div>
                    {currentBrief && <article className="noshy-why"><h3>Why talk now</h3><p>{currentBrief.brief.why}</p></article>}
                    <div className="noshy-spacer" />
                    <div className="noshy-btn-row">
                      <button type="button" className="noshy-btn noshy-btn-secondary" onClick={passPerson}><X size={16} />Skip</button>
                      <button type="button" className="noshy-btn noshy-btn-primary" onClick={connectPerson}><Heart size={16} />Connect</button>
                    </div>
                  </>
                ) : (
                  <div className="noshy-empty">
                    <BookOpen size={28} />
                    <h3>{dbMembers.length < 2 ? "Waiting for check-ins" : "You've seen everyone for now"}</h3>
                    <p>{dbMembers.length < 2 ? "Matches start when at least two people register." : "Come back after the next check-in."}</p>
                    <button type="button" className="noshy-btn noshy-btn-primary" onClick={() => setScreen("home")}>Back home</button>
                  </div>
                )}
              </motion.section>
            )}

            {screen === "match" && matchPair && (
              <motion.section key={`match-${matchPair.left.id}-${matchPair.right.id}`} className="noshy-panel"
                initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.5, ease: cardEase }}>
                <TopBar onBack={() => setScreen(isAdmin ? "home" : "people")} />
                <div className="noshy-profile-hero">
                  <motion.div className="noshy-duo" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12, duration: 0.4, ease: cardEase }}>
                    <PersonAvatar animalId={matchPair.left.animalId} name={matchPair.left.name} size={92} shape="circle" />
                    <PersonAvatar animalId={matchPair.right.animalId} name={matchPair.right.name} size={92} shape="circle" />
                  </motion.div>
                  <MatchPill score={matchPair.brief.score} />
                  <h2>{matchPair.left.name} × {matchPair.right.name}</h2>
                  <span className={`noshy-ai-pill${aiLoading ? " loading" : ""}`}>
                    <Sparkles size={13} />{aiLoading ? "AI is writing this match…" : "Written by AI from their 3 answers"}
                  </span>
                </div>
                <article className="noshy-why">
                  <h3>Why this match</h3>
                  {aiLoading ? <div className="noshy-skeleton-stack"><i /><i /><i className="short" /></div> : <p>{matchPair.brief.why}</p>}
                </article>
                <div className="noshy-start">
                  <h3>Topics to discuss</h3>
                  {aiLoading ? <div className="noshy-skeleton-stack"><i /><i /><i /></div> : <ol className="noshy-numbered">{matchPair.brief.topics.map((t) => <li key={t}>{t}</li>)}</ol>}
                </div>
                <div className="noshy-help-row">
                  <article className="noshy-about">
                    <h3>{matchPair.left.name.split(" ")[0]} helps</h3>
                    {aiLoading ? <div className="noshy-skeleton-stack"><i /><i className="short" /></div> : <p>{matchPair.brief.youHelpThem}</p>}
                  </article>
                  <article className="noshy-about">
                    <h3>{matchPair.right.name.split(" ")[0]} helps</h3>
                    {aiLoading ? <div className="noshy-skeleton-stack"><i /><i className="short" /></div> : <p>{matchPair.brief.theyHelpYou}</p>}
                  </article>
                </div>
                <div className="noshy-btn-row">
                  <button type="button" className="noshy-btn noshy-btn-secondary" onClick={() => setScreen("connect")}>Keep meeting</button>
                  <button type="button" className="noshy-btn noshy-btn-primary" onClick={() => { setHomeTab("matched"); setScreen(isAdmin ? "home" : "people"); }}>All matches</button>
                </div>
              </motion.section>
            )}

            {screen === "scan" && (
              <motion.section key="scan" className="noshy-panel flush" {...motionProps}>
                <ScanScreen
                  notice={scanNotice}
                  onCode={(code) => void handleCode(code)}
                  onExplore={() => { setHomeTab("nearby"); setScreen("people"); }}
                  onBack={() => setScreen("home")}
                />
              </motion.section>
            )}

            {screen === "person" && matchPair && personId != null && (
              <motion.section key={`person-${personId}`} className="noshy-panel" {...motionProps}>
                <PersonScreen
                  pair={matchPair}
                  scanned={personScanned}
                  aiLoading={aiLoading}
                  status={progress.connections.find((c) => c.memberId === personId)?.status}
                  theyLoggedYou={progress.incoming.includes(personId)}
                  card={myCard}
                  voiceHref={`/noshy-voice?meet=${personId}`}
                  busy={gameBusy}
                  error={gameError}
                  onConnect={(note) => void connectWith(personId, note)}
                  onBack={() => setScreen("home")}
                />
              </motion.section>
            )}

            {screen === "missions" && (
              <motion.section key="missions" className="noshy-panel" {...motionProps}>
                <MissionsScreen
                  progress={progress}
                  people={registered}
                  activeId={activeMission}
                  busy={gameBusy}
                  error={gameError}
                  earned={missionEarned}
                  onPick={(id) => { setGameError(""); setMissionEarned(null); setActiveMission(id); }}
                  onComplete={(missionId, targetId) => void completeMission(missionId, targetId)}
                  onBack={() => setScreen("home")}
                />
              </motion.section>
            )}

            {screen === "connections" && (
              <motion.section key="connections" className="noshy-panel" {...motionProps}>
                <ConnectionsScreen
                  progress={progress}
                  people={peopleById}
                  onOpen={(id) => { const person = peopleById.get(id); if (person) openPerson(person); }}
                  onBack={() => setScreen("home")}
                />
              </motion.section>
            )}

            {screen === "night" && (
              <motion.section key="night" className="noshy-panel" {...motionProps}>
                <NightScreen progress={progress} memberId={memberId} strongest={strongest} onBack={() => setScreen("home")} />
              </motion.section>
            )}

            {screen === "card" && myCard && (
              <motion.section key="card" className="noshy-panel" {...motionProps}>
                <CardScreen card={myCard}>
                  <button type="button" className="noshy-xp" onClick={() => setScreen("night")}>
                    <Trophy size={17} /><strong>{progress.xp} XP</strong>
                    <span>See your night</span>
                    <ChevronRight size={16} />
                  </button>
                  <button type="button" className="noshy-row" onClick={() => setScreen("connections")}>
                    <span className="noshy-mission-icon"><Handshake size={20} /></span>
                    <div><h3>Connections</h3><p>{confirmedCount} confirmed · {progress.incoming.length} waiting for you</p></div>
                    <ChevronRight size={18} />
                  </button>
                  {joinUrl && (
                    <div className="noshy-invite">
                      <div className="noshy-invite-qr">
                        <QRCodeSVG value={joinUrl} size={84} level="M" bgColor="#ffffff" fgColor="#000000" marginSize={1} />
                      </div>
                      <div>
                        <strong>Invite someone</strong>
                        <p>Show this QR so others can join and get matched.</p>
                      </div>
                    </div>
                  )}
                  {deleteError && <p className="noshy-error">{deleteError}</p>}
                  {memberId != null && (
                    <button
                      type="button"
                      className="noshy-link-danger"
                      disabled={deletingId === memberId}
                      onClick={() => void deleteMember({ memberId, username, name: displayName }, true)}
                    >
                      <Trash2 size={13} />{deletingId === memberId ? "Deleting…" : "Delete my profile"}
                    </button>
                  )}
                </CardScreen>
              </motion.section>
            )}

          </AnimatePresence>
        </div>
        {showNav && navActive && <BottomNav active={navActive} onSelect={navTo} />}
      </div>
    </main>
  );
}
