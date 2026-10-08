"use client";

import type { ReactNode } from "react";
import { ArrowLeft, ChevronRight, Home, ListChecks, ScanLine, User, Users } from "lucide-react";
import { getNetworkingAnimal } from "@/lib/community-data";
import type { MatchPair } from "@/lib/noshy-match";

const ANIMAL_TAGS: Record<string, [string, string]> = {
  lion: ["Lead", "Intros"],
  owl: ["Advise", "Mentor"],
  fox: ["Deals", "Partnerships"],
  eagle: ["Strategy", "Vision"],
  dolphin: ["Connect", "Network"],
  bee: ["Build", "Ship"],
  wolf: ["Collaborate", "Build"],
  hummingbird: ["Create", "Design"],
};

export function animalTags(animalId?: string): string[] {
  return (animalId && ANIMAL_TAGS[animalId]) || ["Community"];
}

export function NoshyLogo() {
  return (
    <span className="noshy-logo">
      <svg width="18" height="16" viewBox="0 0 18 16" aria-hidden="true">
        <path d="M0 0h4.2l4.8 10.4L13.8 0H18L10.6 16H7.4z" fill="currentColor" />
        <path d="M11.4 0h3.1l-2.4 5.2-1.6-3.4z" fill="#1f5fff" />
      </svg>
      NoShy
    </span>
  );
}

export function TopBar({ onBack, right, overlay }: { onBack?: () => void; right?: ReactNode; overlay?: boolean }) {
  return (
    <header className={`noshy-topbar${overlay ? " overlay" : ""}`}>
      {onBack ? (
        <button type="button" className="noshy-icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
      ) : (
        <NoshyLogo />
      )}
      {right ? <div className="noshy-topbar-right">{right}</div> : null}
    </header>
  );
}

export function MatchPill({ score }: { score: number }) {
  return <span className="noshy-pill">{score}% match</span>;
}

export function Tags({ items }: { items: string[] }) {
  return <div className="noshy-tags">{items.map((tag) => <span key={tag}>{tag}</span>)}</div>;
}

/** Animal avatar: rounded square in lists, circle with a blue ring as a profile hero. */
export function PersonAvatar({ animalId, name, size = 56, shape = "square", online }: {
  animalId?: string; name: string; size?: number; shape?: "square" | "circle"; online?: boolean;
}) {
  const animal = getNetworkingAnimal(animalId);
  const color = animal?.color ?? "#1f5fff";
  return (
    <div
      className={`noshy-avatar ${shape}`}
      style={{ width: size, height: size, fontSize: size * 0.48, background: `radial-gradient(circle at 30% 25%, ${color}55, #121214 72%)` }}
      role="img"
      aria-label={animal ? `${name}, ${animal.name}` : name}
    >
      <span aria-hidden="true">{animal?.emoji ?? name.slice(0, 1).toUpperCase()}</span>
      {online ? <i /> : null}
    </div>
  );
}

export function MatchCard({ pair, onOpen }: { pair: MatchPair; onOpen: () => void }) {
  const them = pair.right;
  return (
    <button type="button" className="noshy-match-card" onClick={onOpen}>
      <PersonAvatar animalId={them.animalId} name={them.name} size={64} />
      <div>
        <MatchPill score={pair.brief.score} />
        <h3>{them.name}</h3>
        <p>{them.role}</p>
        <Tags items={animalTags(them.animalId)} />
      </div>
      <ChevronRight size={18} />
    </button>
  );
}

export type NavTab = "home" | "people" | "scan" | "missions" | "profile";

export function BottomNav({ active, onSelect }: { active: NavTab; onSelect: (tab: NavTab) => void }) {
  const items: Array<[NavTab, string, ReactNode]> = [
    ["home", "Home", <Home key="home" size={20} />],
    ["people", "People", <Users key="people" size={20} />],
    ["scan", "Scan", <ScanLine key="scan" size={20} />],
    ["missions", "Missions", <ListChecks key="missions" size={20} />],
    ["profile", "Profile", <User key="profile" size={20} />],
  ];
  return (
    <nav className="noshy-bottom-nav" aria-label="NoShy">
      {items.map(([id, label, icon]) => (
        <button key={id} type="button" className={active === id ? "active" : ""} onClick={() => onSelect(id)} aria-current={active === id ? "page" : undefined}>
          {icon}<span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
