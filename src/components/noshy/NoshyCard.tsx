"use client";

import { CalendarCheck, Compass, Gift, MessageCircle, Users, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getNetworkingAnimal } from "@/lib/community-data";
import { parseNoshyCode, type Mission } from "@/lib/noshy-game";

type NoshyCardProps = {
  name: string;
  role?: string;
  animalId?: string;
  lookingFor?: string;
  url: string;
};

const KIND_ICON: Record<string, LucideIcon> = {
  Discover: Users,
  Connect: MessageCircle,
  Give: Gift,
  Close: CalendarCheck,
  Host: Compass,
};

/** How many words of each mission title stay white before the blue accent starts. */
const TITLE_SPLIT: Record<string, number> = {
  "outside-industry": 2,
  "same-animal": 2,
  "top-match": 2,
  "give-first": 2,
  "next-step": 3,
  introduce: 3,
};

function clip(text: string | undefined, max: number) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}…` : clean;
}

export function BrandMark() {
  return (
    <span className="noshy-card-brand">
      <svg viewBox="0 0 18 16" aria-hidden="true">
        <path d="M0 0h4.2l4.8 10.4L13.8 0H18L10.6 16H7.4z" fill="currentColor" />
      </svg>
      <span>Visible<br />Builders</span>
    </span>
  );
}

function CardQr({ url, label }: { url: string; label: string }) {
  return (
    <div className="noshy-card-qr">
      <QRCodeSVG value={url} size={128} level="M" bgColor="#ffffff" fgColor="#000000" marginSize={1} />
      <span>{label}</span>
    </div>
  );
}

/** The physical identity card: mascot, name, role, and the QR others scan. */
export function NoshyCard({ name, role, animalId, url }: NoshyCardProps) {
  const animal = getNetworkingAnimal(animalId);
  const code = parseNoshyCode(url);
  const memberId = code?.kind === "meet" ? code.memberId : null;
  return (
    <article className="noshy-card">
      <img className="noshy-card-art" src={`/noshy/mascots/${animal?.id ?? "fox"}.jpg`} alt="" loading="eager" />
      <BrandMark />
      <div className="noshy-card-body">
        <span className="noshy-card-bar" aria-hidden="true" />
        <h3>
          {name}
          {role ? <em>{clip(role, 44)}</em> : null}
        </h3>
      </div>
      <footer className="noshy-card-foot">
        <span className="noshy-card-pill">
          {memberId != null ? <><b>#{memberId}</b>code</> : <b>{animal?.name ?? "NoShy"}</b>}
        </span>
        <span className="noshy-card-divider" aria-hidden="true" />
        <CardQr url={url} label="Scan to meet" />
      </footer>
    </article>
  );
}

type MissionFaceProps = {
  kind: string;
  title: string;
  /** Words of the title that stay white before the blue accent. */
  split: number;
  hint: string;
  xp: number;
  scene: string;
  aside?: ReactNode;
  className?: string;
};

/** Mission-style card face: kind, two-tone title, hint, mascot scene, XP footer. */
export function MissionFace({ kind, title, split, hint, xp, scene, aside, className }: MissionFaceProps) {
  const Icon = KIND_ICON[kind] ?? Users;
  const words = title.split(" ");
  return (
    <article className={`noshy-card noshy-card-mission${className ? ` ${className}` : ""}`}>
      <span className="noshy-card-glow" aria-hidden="true" />
      <BrandMark />
      <p className="noshy-card-kind"><Icon size={15} />{kind}</p>
      <h3>
        {words.slice(0, split).join(" ")} <em>{words.slice(split).join(" ")}</em>
      </h3>
      <p className="noshy-card-hint">{hint}</p>
      <img className="noshy-card-scene" src={scene} alt="" loading="eager" />
      <footer className="noshy-card-foot">
        <span className="noshy-card-pill"><b>{xp}</b>XP</span>
        <span className="noshy-card-divider" aria-hidden="true" />
        {aside}
      </footer>
    </article>
  );
}

export function MissionCard({ mission, url }: { mission: Mission; url: string }) {
  return (
    <MissionFace
      kind={mission.kind}
      title={mission.title}
      split={TITLE_SPLIT[mission.id] ?? 2}
      hint={mission.hint}
      xp={mission.xp}
      scene={`/noshy/missions/${mission.id}.jpg`}
      aside={<CardQr url={url} label="Scan when done" />}
    />
  );
}

/** Front face of the icebreaker card: the fox, the cocktail, and the event line. */
export function ChallengeFront({ className }: { className?: string }) {
  return (
    <article className={`noshy-card noshy-card-front${className ? ` ${className}` : ""}`}>
      <img className="noshy-card-art" src="/noshy/challenge/front.jpg" alt="" loading="eager" />
      <BrandMark />
      <div className="noshy-card-body">
        <span className="noshy-card-bar" aria-hidden="true" />
        <h3>
          Surround<br />with people
          <em>who inspire you.</em>
        </h3>
      </div>
    </article>
  );
}
