"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EMPTY_PROGRESS, type ConnectionStatus, type GameProgress, type MeetSource } from "@/lib/noshy-game";

const POLL_MS = 5000;

type MeetResult = { ok: true; status: ConnectionStatus } | { ok: false; error: string };
type MissionResult = { ok: true; alreadyDone: boolean; xp: number } | { ok: false; error: string };

async function post<T>(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

/** XP, connections, missions, and leaderboard for the signed-in member, polled while `live`. */
export function useNoshyProgress(memberId: number | null, live = true) {
  const [progress, setProgress] = useState<GameProgress>(EMPTY_PROGRESS);
  const memberRef = useRef(memberId);
  memberRef.current = memberId;

  const refresh = useCallback(async () => {
    const id = memberRef.current;
    try {
      const res = await fetch(`/api/noshy/progress?memberId=${id ?? 0}`);
      if (!res.ok) return;
      const data = (await res.json()) as { progress?: GameProgress };
      if (data.progress && memberRef.current === id) setProgress(data.progress);
    } catch { /* keep the last known progress */ }
  }, []);

  useEffect(() => {
    if (!live) return;
    void refresh();
    const timer = window.setInterval(() => void refresh(), POLL_MS);
    return () => window.clearInterval(timer);
  }, [live, memberId, refresh]);

  const meet = useCallback(async (targetId: number, source: MeetSource, note?: string): Promise<MeetResult> => {
    if (memberRef.current == null) return { ok: false, error: "Register first." };
    try {
      const data = await post<{ status: ConnectionStatus; progress: GameProgress }>("/api/noshy/meet", {
        memberId: memberRef.current, targetId, source, note,
      });
      setProgress(data.progress);
      return { ok: true, status: data.status };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Could not save the connection." };
    }
  }, []);

  const completeMission = useCallback(async (missionId: string, targetId: number): Promise<MissionResult> => {
    if (memberRef.current == null) return { ok: false, error: "Register first." };
    try {
      const data = await post<{ alreadyDone: boolean; xp: number; progress: GameProgress }>("/api/noshy/missions", {
        memberId: memberRef.current, missionId, targetId,
      });
      setProgress(data.progress);
      return { ok: true, alreadyDone: data.alreadyDone, xp: data.xp };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Could not save the mission." };
    }
  }, []);

  return { progress, refresh, meet, completeMission };
}
