"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, Search, Users } from "lucide-react";
import guestsData from "@/data/ai-after-hours-guests.json";

type Guest = {
  id: string;
  name: string;
  email: string;
  status: string;
};

type StatusFilter = "all" | "going" | "waitlist" | "invited" | "checked";

const GUESTS = guestsData as Guest[];
const EVENT = "ai-after-hours-rooftop";

const STATUS_LABEL: Record<string, string> = {
  approved: "going",
  waitlist: "waitlist",
  invited: "invited",
  declined: "declined",
};

const countStatus = (status: string) =>
  GUESTS.filter((g) => g.status === status).length;

export default function CheckinAdminPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [syncError, setSyncError] = useState("");

  const applyCheckedList = useCallback((ids: string[]) => {
    const next: Record<string, boolean> = {};
    for (const id of ids) next[id] = true;
    setChecked(next);
  }, []);

  const loadCheckins = useCallback(async () => {
    try {
      const res = await fetch(`/api/checkin?event=${EVENT}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("load failed");
      const data = (await res.json()) as { checked?: string[] };
      applyCheckedList(data.checked ?? []);
      setSyncError("");
    } catch {
      setSyncError("Could not sync with database");
    }
  }, [applyCheckedList]);

  useEffect(() => {
    void loadCheckins();
    const timer = window.setInterval(() => void loadCheckins(), 5000);
    return () => window.clearInterval(timer);
  }, [loadCheckins]);

  const checkedCount = useMemo(
    () => GUESTS.filter((g) => checked[g.id]).length,
    [checked]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GUESTS.filter((g) => {
      if (filter === "checked" && !checked[g.id]) return false;
      if (filter === "going" && g.status !== "approved") return false;
      if (filter === "waitlist" && g.status !== "waitlist") return false;
      if (filter === "invited" && g.status !== "invited") return false;
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q)
      );
    });
  }, [checked, filter, query]);

  const toggle = async (guest: Guest) => {
    const next = !checked[guest.id];
    setChecked((prev) => ({ ...prev, [guest.id]: next }));
    setSavingId(guest.id);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: EVENT,
          guestId: guest.id,
          checked: next,
          name: guest.name,
          email: guest.email,
          status: guest.status,
        }),
      });
      if (!res.ok) throw new Error("save failed");
      setSyncError("");
    } catch {
      setChecked((prev) => ({ ...prev, [guest.id]: !next }));
      setSyncError("Save failed — try again");
    } finally {
      setSavingId(null);
    }
  };

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/checkin`
      : "/checkin";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const tabs: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: GUESTS.length },
    { id: "going", label: "Going", count: countStatus("approved") },
    { id: "waitlist", label: "Waitlist", count: countStatus("waitlist") },
    { id: "invited", label: "Invited", count: countStatus("invited") },
    { id: "checked", label: "Checked in", count: checkedCount },
  ];

  return (
    <main className="checkin-page">
      <header className="checkin-header">
        <div>
          <p className="checkin-eyebrow">Staff · AI After Hours Rooftop</p>
          <h1>Door check-in</h1>
          <p className="checkin-sub">
            {checkedCount} / {GUESTS.length} checked in
            {syncError ? ` · ${syncError}` : " · synced to Railway DB"}
          </p>
        </div>
        <button type="button" className="checkin-share" onClick={copyLink}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </header>

      <div className="checkin-search">
        <Search size={18} aria-hidden />
        <input
          type="search"
          placeholder="Search name or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      <div className="checkin-tabs" role="tablist" aria-label="Filter list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filter === tab.id}
            className={filter === tab.id ? "is-active" : undefined}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
            <span>{tab.count}</span>
          </button>
        ))}
      </div>

      <ul className="checkin-list">
        {filtered.map((g) => {
          const isIn = !!checked[g.id];
          return (
            <li key={g.id}>
              <button
                type="button"
                className={`checkin-row${isIn ? " is-in" : ""}${
                  savingId === g.id ? " is-saving" : ""
                }`}
                onClick={() => void toggle(g)}
                aria-pressed={isIn}
                disabled={savingId === g.id}
              >
                <span className="checkin-box" aria-hidden>
                  {isIn ? <Check size={14} strokeWidth={3} /> : null}
                </span>
                <span className="checkin-meta">
                  <strong>{g.name}</strong>
                  <em>{g.email || "—"}</em>
                </span>
                <span className={`checkin-status status-${g.status}`}>
                  {STATUS_LABEL[g.status] ?? g.status}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {!filtered.length && (
        <div className="checkin-empty">
          <Users size={28} />
          <p>No guests match this search.</p>
        </div>
      )}

      <p className="checkin-foot">
        All Luma registrations. Check-ins save to Postgres (Railway).
        Share only with door staff.
      </p>
    </main>
  );
}
