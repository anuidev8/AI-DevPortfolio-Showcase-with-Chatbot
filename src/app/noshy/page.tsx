"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight, BookOpen, ChevronRight, Compass,
  Handshake, Heart, MapPin, MessageSquare, QrCode, Sparkles, Users, X,
} from "lucide-react";
import {
  COMMUNITY_CIRCLES, NETWORKING_ANIMALS, NOSHY_QUESTIONS,
  getNetworkingAnimal, type CommunityProfile,
} from "@/lib/community-data";
import { fetchAiMatch } from "@/lib/noshy-ai";
import { matchesFor, rankPairs, type MatchPair } from "@/lib/noshy-match";

const cardEase = [0.22, 1, 0.36, 1] as const;
const SESSION_KEY = "noshy-session";
type Screen = "welcome" | "login" | "onboarding" | "home" | "connect" | "match";
type HomeTab = "nearby" | "matched" | "circles";
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

function AnimalAvatar({ animalId, name, className, online }: {
  animalId?: string; name: string; className?: string; online?: boolean;
}) {
  const animal = getNetworkingAnimal(animalId);
  return (
    <div className={`noshy-animal-avatar ${className ?? ""}`} style={{ background: animal?.color ?? "#00f2ff" }} aria-label={animal ? `${name}, ${animal.name}` : name}>
      <span aria-hidden="true">{animal?.emoji ?? name.slice(0, 1).toUpperCase()}</span>
      {online ? <i /> : null}
    </div>
  );
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
  const matchRequest = useRef(0);

  const selectedAnimal = getNetworkingAnimal(animalId);
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
    setScreen("home");
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
          body: JSON.stringify({ memberId: session.memberId }),
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

  const loadMembers = async () => {
    try {
      const res = await fetch("/api/members");
      if (!res.ok) return;
      const data = (await res.json()) as { members?: DeskPerson[] };
      setDbMembers(data.members ?? []);
    } catch { /* keep local */ }
  };

  useEffect(() => {
    if (screen !== "home" && screen !== "connect" && !isAdmin) return;
    void loadMembers();
    const timer = window.setInterval(() => void loadMembers(), 8000);
    return () => window.clearInterval(timer);
  }, [isAdmin, screen]);

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

  const openPair = (pair: MatchPair) => {
    const requestId = matchRequest.current + 1; matchRequest.current = requestId;
    setMatchPair(pair); setAiLoading(true); setScreen("match");
    void (async () => {
      try {
        const brief = await fetchAiMatch(pair);
        if (matchRequest.current !== requestId) return;
        setMatchPair({ ...pair, brief });
      } catch { if (matchRequest.current !== requestId) return; }
      finally { if (matchRequest.current === requestId) setAiLoading(false); }
    })();
  };

  const connectPerson = () => {
    if (!currentConnect || !currentBrief) return;
    void saveConnection(currentConnect.id, "connect");
    setPassedIds((prev) => [...prev, currentConnect.id]); openPair(currentBrief);
  };

  return (
    <main className="noshy-page">
      <div className="noshy-shell">
        <header className="noshy-topbar">
          <div className="noshy-brand"><span className="noshy-brand-mark">VB</span><span>Visible Builders</span></div>
          <span className="noshy-top-label">{isAdmin ? "Admin" : "NoShy"}</span>
        </header>
        <div className="noshy-stage">
          <AnimatePresence mode="wait">

            {screen === "welcome" && (
              <motion.section key="welcome" className="noshy-panel noshy-welcome"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: cardEase }}>
                <div className="noshy-logo-stack">
                  <div className="noshy-qr" aria-label="Scan to open NoShy">
                    {joinUrl ? (
                      <QRCodeSVG
                        value={joinUrl}
                        size={168}
                        level="M"
                        bgColor="#0b011d"
                        fgColor="#00f2ff"
                        marginSize={1}
                      />
                    ) : (
                      <QrCode size={72} />
                    )}
                  </div>
                  <div className="noshy-logo-accent"><Sparkles size={18} /></div>
                </div>
                {joinUrl ? <p className="noshy-qr-url">{joinUrl.replace(/^https?:\/\//, "")}</p> : null}
                <p className="noshy-eyebrow">NoShy Networking App</p>
                <h1>Scan. Match. Talk.</h1>
                <p>Name, animal, 3 questions. We match people by business — who to talk to, why, and what to say. Direct. No BS.</p>
                <ul className="noshy-welcome-steps">
                  <li><QrCode size={16} />Scan QR</li>
                  <li><span aria-hidden="true">🦁</span>Animal avatar</li>
                  <li><MessageSquare size={16} />3 questions</li>
                </ul>
                <button type="button" className="noshy-btn noshy-btn-primary noshy-btn-full" onClick={() => { setSaveError(""); setStep(0); setScreen("onboarding"); }}>
                  Start NoShy<ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  className="noshy-btn noshy-btn-secondary noshy-btn-full"
                  onClick={() => { setSaveError(""); setLoginUsername(username); setScreen("login"); }}
                >
                  I already registered
                </button>
              </motion.section>
            )}

            {screen === "login" && (
              <motion.section key="login" className="noshy-panel noshy-onboarding"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: cardEase }}>
                <div className="noshy-step">
                  <h2>Welcome back</h2>
                  <p>Enter your username to open your matches.</p>
                  <div className="noshy-fields">
                    <label>
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
                  </div>
                </div>
                {saveError && <p className="noshy-error">{saveError}</p>}
                <div className="noshy-nav-row">
                  <button type="button" className="noshy-btn noshy-btn-secondary" onClick={() => { setSaveError(""); setScreen("welcome"); }}>
                    Back
                  </button>
                  <button
                    type="button"
                    className="noshy-btn noshy-btn-primary noshy-btn-grow"
                    disabled={loggingIn}
                    onClick={() => void loginByUsername(loginUsername)}
                  >
                    {loggingIn ? "Opening…" : "Open my matches"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.section>
            )}

            {screen === "onboarding" && (
              <motion.section key="onboarding" className="noshy-panel noshy-onboarding"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: cardEase }}>
                <div className="noshy-progress">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <i key={i} className={i === step ? "active" : i < step ? "done" : ""} />
                  ))}
                </div>

                {step === 0 && (
                  <div className="noshy-step">
                    <h2>Username, name & role</h2>
                    <p>Username is for login. Name is what people see when we match you.</p>
                    <div className="noshy-fields">
                      <label>
                        Username
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                          placeholder="e.g. camila.r"
                          autoComplete="username"
                          autoCapitalize="none"
                        />
                      </label>
                      <label>
                        Name
                        <input
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="e.g. Camila Restrepo"
                          autoComplete="name"
                        />
                      </label>
                      <label>
                        Role
                        <input
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. Founder, developer, marketer"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="noshy-step">
                    <h2>Choose your animal</h2>
                    <p>This is your avatar. Wear it, remember it, find your match by it.</p>
                    {selectedAnimal && (
                      <div className="noshy-animal-avatar xl" style={{ background: selectedAnimal.color }}>
                        <span aria-hidden="true">{selectedAnimal.emoji}</span>
                      </div>
                    )}
                    <div className="noshy-animal-grid">
                      {NETWORKING_ANIMALS.map((animal) => (
                        <button key={animal.id} type="button"
                          className={`noshy-animal${animalId === animal.id ? " selected" : ""}`}
                          onClick={() => setAnimalId(animal.id)}>
                          <span className="noshy-animal-emoji" aria-hidden="true">{animal.emoji}</span>
                          <strong>{animal.name}</strong>
                          <span>{animal.vibe}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="noshy-step">
                    <h2>Answer 3 questions</h2>
                    <p>Only these. We match people from these answers — no categories.</p>
                    <div className="noshy-fields noshy-fields-wide">
                      {NOSHY_QUESTIONS.map((q) => {
                        const value = q.id === "business" ? business : q.id === "lookingFor" ? lookingFor : canHelp;
                        const onChange = q.id === "business" ? setBusiness : q.id === "lookingFor" ? setLookingFor : setCanHelp;
                        return (
                          <label key={q.id}>{q.label}
                            <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={q.placeholder} rows={3} />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {saveError && <p className="noshy-error">{saveError}</p>}
                <div className="noshy-nav-row">
                  {step > 0 && <button type="button" className="noshy-btn noshy-btn-secondary" onClick={() => setStep(step - 1)}>Back</button>}
                  <button type="button" className="noshy-btn noshy-btn-primary noshy-btn-grow" onClick={nextStep} disabled={saving}>
                    {step === lastStep ? (saving ? "Saving…" : "See my matches") : "Next"}<ArrowRight size={16} />
                  </button>
                </div>
              </motion.section>
            )}

            {screen === "home" && (
              <motion.section key="home" className="noshy-panel noshy-home"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: cardEase }}>
                <div className="noshy-home-head">
                  <div>
                    <p className="noshy-eyebrow">{isAdmin ? "Event admin · NoShy" : "Community desk · NoShy"}</p>
                    <h2>{attendees.length ? (isAdmin ? "Find matches in the room." : "People are already gathering.") : "Waiting for check-ins."}</h2>
                    <p className="noshy-muted"><MapPin size={14} /> Medellín · {attendees.length} registered{selectedAnimal ? <> · {selectedAnimal.emoji} {selectedAnimal.name}</> : null}</p>
                  </div>
                  <div className="noshy-home-actions">
                    <button type="button" className="noshy-btn noshy-btn-primary" onClick={() => setScreen("connect")}><Compass size={16} />Meet people</button>
                  </div>
                </div>

                <div className="noshy-tabs">
                  {([["nearby", "Nearby"], ["matched", "Event matches"], ["circles", "Circles"]] as const).map(([id, label]) => (
                    <button key={id} type="button" className={homeTab === id ? "active" : ""} onClick={() => setHomeTab(id)}>{label}</button>
                  ))}
                </div>

                {homeTab === "nearby" && (
                  <div className="noshy-list">
                    {nearby.length === 0 && (
                      <div className="noshy-empty compact"><Users size={28} /><h3>No one checked in yet</h3><p>Scan the event QR, pick an animal, and answer the 3 questions.</p></div>
                    )}
                    {nearby.map((profile) => {
                      const isYou = memberId != null && profile.id === `member-${memberId}`;
                      return (
                        <article key={profile.id} className={`noshy-person${isYou ? " you" : ""}`}>
                          <AnimalAvatar animalId={profile.animalId} name={profile.name} className="noshy-person-avatar" online={profile.online} />
                          <div>
                            <h3>{profile.name}</h3><p>{profile.role}</p>
                            <div className="noshy-mini-tags">
                              {profile.lookingFor ? <span>{profile.lookingFor.slice(0, 42)}</span> : profile.skills.slice(0, 2).length ? profile.skills.slice(0, 2).map((s) => <span key={s}>{s}</span>) : <span>Community</span>}
                            </div>
                          </div>
                          <ChevronRight size={16} />
                        </article>
                      );
                    })}
                  </div>
                )}

                {homeTab === "matched" && (
                  <div className="noshy-list">
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
                    {pickedBrief && (
                      <article className="noshy-pair" onClick={() => openPair(pickedBrief)}>
                        <div className="noshy-pair-people"><AnimalAvatar animalId={pickedBrief.left.animalId} name={pickedBrief.left.name} /><Handshake size={18} /><AnimalAvatar animalId={pickedBrief.right.animalId} name={pickedBrief.right.name} /></div>
                        <div><h3>{pickedBrief.left.name} × {pickedBrief.right.name} <em>{pickedBrief.brief.score}%</em></h3><p className="noshy-why-line">{pickedBrief.brief.why}</p></div>
                      </article>
                    )}
                    {pickLeft && !pickRight && pickedMatches.map((pair) => (
                      <article key={`${pair.left.id}-${pair.right.id}`} className="noshy-pair" onClick={() => openPair(pair)}>
                        <AnimalAvatar animalId={pair.right.animalId} name={pair.right.name} className="noshy-person-avatar" />
                        <div><h3>{pair.right.name} <em>{pair.brief.score}%</em></h3><p>{pair.right.role}</p><p className="noshy-why-line">{pair.brief.why}</p></div>
                        <ChevronRight size={16} />
                      </article>
                    ))}
                    {!pickLeft && yourMatches.length > 0 && <>
                      <p className="noshy-section-label">Your matches</p>
                      {yourMatches.map((pair) => (
                        <article key={`${pair.left.id}-${pair.right.id}`} className="noshy-pair" onClick={() => openPair(pair)}>
                          <AnimalAvatar animalId={pair.right.animalId} name={pair.right.name} className="noshy-person-avatar" />
                          <div><h3>{pair.right.name} <em>{pair.brief.score}%</em></h3><p>{pair.right.role}</p><p className="noshy-why-line">{pair.brief.why}</p></div>
                          <ChevronRight size={16} />
                        </article>
                      ))}
                    </>}
                    {!pickLeft && eventPairs.length > 0 && <>
                      <p className="noshy-section-label">Best pairs in the room</p>
                      {eventPairs.map((pair) => (
                        <article key={`${pair.left.id}-${pair.right.id}`} className="noshy-pair" onClick={() => openPair(pair)}>
                          <div className="noshy-pair-people"><AnimalAvatar animalId={pair.left.animalId} name={pair.left.name} /><Handshake size={16} /><AnimalAvatar animalId={pair.right.animalId} name={pair.right.name} /></div>
                          <div><h3>{pair.left.name} × {pair.right.name} <em>{pair.brief.score}%</em></h3><p className="noshy-why-line">{pair.brief.why}</p></div>
                          <ChevronRight size={16} />
                        </article>
                      ))}
                    </>}
                  </div>
                )}

                {homeTab === "circles" && (
                  <div className="noshy-circles">
                    {COMMUNITY_CIRCLES.map((circle) => (
                      <article key={circle.id} className="noshy-circle">
                        <div className="noshy-circle-avatars">{circle.avatars.map((a) => <img key={a} src={a} alt="" />)}</div>
                        <h3>{circle.name}</h3><p>{circle.description}</p>
                        <span style={{ color: circle.accent }}><Users size={13} /> {circle.active} active · {circle.members} members</span>
                      </article>
                    ))}
                  </div>
                )}
              </motion.section>
            )}

            {screen === "connect" && (
              <motion.section key="connect" className="noshy-panel noshy-connect"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: cardEase }}>
                <div className="noshy-home-head">
                  <div><p className="noshy-eyebrow">Meet people</p><h2>Connect with intention.</h2></div>
                  <button type="button" className="noshy-btn noshy-btn-secondary" onClick={() => setScreen("home")}>Back</button>
                </div>
                {currentConnect ? (
                  <article className="noshy-connect-card">
                    <AnimalAvatar animalId={currentConnect.animalId} name={currentConnect.name} className="noshy-connect-photo" />
                    <h3>{getNetworkingAnimal(currentConnect.animalId)?.emoji} {currentConnect.name}</h3>
                    <p className="noshy-muted">{currentConnect.role}</p>
                    <div className="noshy-mini-tags center">
                      {currentConnect.business && <span>{currentConnect.business}</span>}
                      {currentConnect.lookingFor && <span>Wants: {currentConnect.lookingFor}</span>}
                    </div>
                    <p className="noshy-bio">{currentConnect.bio || currentConnect.canHelp}</p>
                    {currentBrief && <div className="noshy-connect-why"><strong>Why talk now</strong><p>{currentBrief.brief.why}</p></div>}
                    <div className="noshy-connect-actions">
                      <button type="button" className="noshy-round pass" onClick={passPerson} aria-label="Pass"><X size={22} /></button>
                      <button type="button" className="noshy-round connect" onClick={connectPerson} aria-label="Connect"><Heart size={22} /></button>
                    </div>
                  </article>
                ) : (
                  <div className="noshy-empty">
                    <BookOpen size={28} />
                    <h3>{dbMembers.length < 2 ? "Waiting for check-ins" : "You've seen everyone for now"}</h3>
                    <p>{dbMembers.length < 2 ? "Matches start when at least two people register." : "Come back after the next check-in."}</p>
                    <button type="button" className="noshy-btn noshy-btn-primary" onClick={() => setScreen("home")}>Back to desk</button>
                  </div>
                )}
              </motion.section>
            )}

            {screen === "match" && matchPair && (
              <motion.section key={`match-${matchPair.left.id}-${matchPair.right.id}`} className="noshy-panel noshy-match"
                initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.5, ease: cardEase }}>
                <motion.p className="noshy-eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>NoShy match</motion.p>
                <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: cardEase }}>
                  {matchPair.left.name} × {matchPair.right.name}
                </motion.h2>
                <motion.div className="noshy-match-avatars" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.16, duration: 0.4, ease: cardEase }}>
                  <AnimalAvatar animalId={matchPair.left.animalId} name={matchPair.left.name} />
                  <Handshake size={24} className="noshy-match-icon" />
                  <AnimalAvatar animalId={matchPair.right.animalId} name={matchPair.right.name} />
                </motion.div>
                <p className="noshy-match-score">{matchPair.brief.score}% business fit · skip the small talk</p>
                <span className={`noshy-ai-pill${aiLoading ? " loading" : ""}`}>
                  <Sparkles size={13} />{aiLoading ? "AI is writing this match…" : "Written by AI from their 3 answers"}
                </span>
                <motion.article className="noshy-brief" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.4, ease: cardEase }}>
                  <h3>Why this match</h3>
                  {aiLoading ? <div className="noshy-skeleton-stack"><i /><i /><i className="short" /></div> : <p>{matchPair.brief.why}</p>}
                </motion.article>
                <motion.article className="noshy-brief" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4, ease: cardEase }}>
                  <h3>Topics to discuss</h3>
                  {aiLoading ? <div className="noshy-skeleton-stack"><i /><i /><i /></div> : <ol>{matchPair.brief.topics.map((t) => <li key={t}>{t}</li>)}</ol>}
                </motion.article>
                <motion.div className="noshy-help-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.4, ease: cardEase }}>
                  <article className="noshy-brief">
                    <h3>{matchPair.left.name.split(" ")[0]} helps</h3>
                    {aiLoading ? <div className="noshy-skeleton-stack"><i /><i className="short" /></div> : <p>{matchPair.brief.youHelpThem}</p>}
                  </article>
                  <article className="noshy-brief">
                    <h3>{matchPair.right.name.split(" ")[0]} helps</h3>
                    {aiLoading ? <div className="noshy-skeleton-stack"><i /><i className="short" /></div> : <p>{matchPair.brief.theyHelpYou}</p>}
                  </article>
                </motion.div>
                <div className="noshy-nav-row">
                  <button type="button" className="noshy-btn noshy-btn-secondary" onClick={() => setScreen("connect")}>Keep meeting</button>
                  <button type="button" className="noshy-btn noshy-btn-primary" onClick={() => { setHomeTab("matched"); setScreen("home"); }}>All matches</button>
                </div>
              </motion.section>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
