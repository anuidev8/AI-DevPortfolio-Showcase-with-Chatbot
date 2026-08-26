"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, Search, Users } from "lucide-react";
import guestsData from "@/data/ai-after-hours-guests.json";

type Guest = {
  id: string;
  name: string;
  email: string;
  status: "approved" | "waitlist" | "invited" | string;
};

type StatusFilter = "approved" | "waitlist" | "invited" | "all" | "checked";

const GUESTS = guestsData as Guest[];
const EVENT = "ai-after-hours";

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

  const counts = useMemo(() => {
    const base = {
      approved: 0,
      waitlist: 0,
      invited: 0,
      checked: 0,
      total: GUESTS.length,
    };
    for (const g of GUESTS) {
      if (g.status in base)
        base[g.status as "approved" | "waitlist" | "invited"] += 1;
      if (checked[g.id]) base.checked += 1;
    }
    return base;
  }, [checked]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GUESTS.filter((g) => {
      if (filter === "checked") {
        if (!checked[g.id]) return false;
      } else if (filter !== "all" && g.status !== filter) {
        return false;
      }
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
    { id: "approved", label: "Approved", count: counts.approved },
    { id: "waitlist", label: "Waitlist", count: counts.waitlist },
    { id: "invited", label: "Invited", count: counts.invited },
    { id: "checked", label: "Checked in", count: counts.checked },
    { id: "all", label: "All", count: counts.total },
  ];

  return (
    <main className="checkin-page">
      <header className="checkin-header">
        <div>
          <p className="checkin-eyebrow">Staff · AI After Hours</p>
          <h1>Door check-in</h1>
          <p className="checkin-sub">
            {counts.checked} / {counts.approved} approved checked in
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

      <div className="checkin-tabs" role="tablist" aria-label="Filter by status">
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
                  {g.status}
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
        Check-ins save to Postgres (Railway). All staff phones stay in sync.
        Share only with door staff.
      </p>
    </main>
  );
}
