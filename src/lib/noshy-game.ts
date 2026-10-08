/** NoShy game layer shared by the manual app, scan mode, and the voice host: cards, missions, XP. */

export const CONNECTION_XP = 20;

export type Mission = {
  id: string;
  kind: string;
  title: string;
  hint: string;
  xp: number;
};

export const MISSIONS: Mission[] = [
  { id: "outside-industry", kind: "Discover", title: "Find someone outside your industry.", hint: "Ask what problem they solve every day.", xp: 10 },
  { id: "same-animal", kind: "Discover", title: "Find someone with your same animal.", hint: "Ask why they picked it.", xp: 10 },
  { id: "top-match", kind: "Connect", title: "Talk to your #1 match.", hint: "Open with the first topic NoShy gave you.", xp: 15 },
  { id: "give-first", kind: "Give", title: "Help someone without asking for anything.", hint: "An intro, a tool, or 5 minutes of advice.", xp: 15 },
  { id: "next-step", kind: "Close", title: "Leave a conversation with one next step.", hint: "A date, an intro, or a follow-up message.", xp: 15 },
  { id: "introduce", kind: "Host", title: "Introduce two people who should talk.", hint: "Say why in one sentence, then walk away.", xp: 20 },
];

export function getMission(id?: string | null) {
  return MISSIONS.find((mission) => mission.id === id);
}

export type MeetSource = "scan" | "voice" | "manual" | "mission";
export type ConnectionStatus = "confirmed" | "waiting";

export type GameConnection = {
  memberId: number;
  status: ConnectionStatus;
  note?: string;
  at: string;
};

export type LeaderboardRow = {
  memberId: number;
  name: string;
  animalId?: string;
  xp: number;
  connections: number;
  missions: number;
};

export type GameProgress = {
  xp: number;
  /** People you logged: confirmed once they log you back. */
  connections: GameConnection[];
  /** People who logged you and are waiting for you to confirm. */
  incoming: number[];
  missions: Array<{ id: string; targetId: number | null }>;
  leaderboard: LeaderboardRow[];
  rank: number | null;
};

export const EMPTY_PROGRESS: GameProgress = {
  xp: 0,
  connections: [],
  incoming: [],
  missions: [],
  leaderboard: [],
  rank: null,
};

export type NoshyCode = { kind: "meet"; memberId: number } | { kind: "mission"; missionId: string };

/** QR on an attendee card. The member id is public; the username is not (it is the login). */
export function meetUrl(site: string, memberId: number) {
  return `${site.replace(/\/$/, "")}/noshy?meet=${memberId}`;
}

export function missionUrl(site: string, missionId: string) {
  return `${site.replace(/\/$/, "")}/noshy?mission=${missionId}`;
}

/** Read a scanned QR (or the current page query) into a NoShy card or mission. */
export function parseNoshyCode(text: string): NoshyCode | null {
  const raw = text.trim();
  const query = raw.includes("?") ? raw.slice(raw.indexOf("?") + 1) : raw;
  const params = new URLSearchParams(query);
  const meet = Number(params.get("meet"));
  if (params.get("meet") && Number.isInteger(meet) && meet > 0) return { kind: "meet", memberId: meet };
  const mission = getMission(params.get("mission"));
  if (mission) return { kind: "mission", missionId: mission.id };
  return null;
}

export function memberIdOf(profileId: string) {
  const match = /^member-(\d+)$/.exec(profileId);
  return match ? Number(match[1]) : null;
}
