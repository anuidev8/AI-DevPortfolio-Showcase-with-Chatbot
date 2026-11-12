"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RefreshCw, Search, Users } from "lucide-react";
import guestsPayload from "@/data/vip-night-guests.json";

type Line = "paid" | "vip" | "general";
type Lang = "en" | "es";
type View = "checkin" | "lists";
type Filter = "all" | "vip" | "general";

type Guest = {
  id: string;
  name: string;
  role: string;
  line: Line;
  phoneLast4: string | null;
  phone: string | null;
  paidLabel: string;
  access: string;
  also: string[];
};

const EVENT = guestsPayload.event;
const GUESTS = guestsPayload.guests as Guest[];

const copy = {
  en: {
    back: "VIP Night",
    title: "DOOR CHECK-IN",
    subtitle: "Thursday Nov 12 · VIP Night",
    checkedOf: (n: number, total: number) =>
      `${n} checked in of ${total} approved`,
    lines: (vipIn: number, vipTotal: number, genIn: number, genTotal: number) =>
      `VIP line ${vipIn}/${vipTotal} · General line ${genIn}/${genTotal}`,
    checkin: "Check-in",
    lists: "Lists",
    search: "Search name, last 4 of phone or seat code",
    refresh: "REFRESH",
    all: "All",
    vip: "VIP",
    general: "General",
    checkIn: "CHECK IN",
    undo: "UNDO CHECK-IN",
    empty: "No guests match this search.",
    paidSection: "1. PAID",
    vipSection: "2. MEMBERS + BUILDERS + SPEAKERS",
    generalSection: "3. FREE (APPROVED)",
    paidAccess: "VIP line · VIP bracelet + seat",
    vipAccess: "VIP line · VIP bracelet + seat · front section",
    generalAccess: "General line · standing",
    nobody: "Nobody yet",
    syncError: "Could not sync",
    saveError: "Save failed — try again",
    foot: "Private door list. Do not share. Synced for door staff.",
    role: {
      Builder: "Builder",
      Member: "Member",
      Speaker: "Speaker",
      Approved: "Approved",
    } as Record<string, string>,
    paid: {
      "Paid: yes (membership)": "Paid: yes (membership)",
      "Paid: no (on the house)": "Paid: no (on the house)",
      "Paid: no (free)": "Paid: no (free)",
    } as Record<string, string>,
  },
  es: {
    back: "VIP Night",
    title: "LISTA DE PUERTA",
    subtitle: "Jueves 12 nov · VIP Night",
    checkedOf: (n: number, total: number) =>
      `${n} registrados de ${total} aprobados`,
    lines: (vipIn: number, vipTotal: number, genIn: number, genTotal: number) =>
      `Fila VIP ${vipIn}/${vipTotal} · Fila general ${genIn}/${genTotal}`,
    checkin: "Registro",
    lists: "Listas",
    search: "Buscar nombre, últimos 4 del tel. o código",
    refresh: "ACTUALIZAR",
    all: "Todos",
    vip: "VIP",
    general: "General",
    checkIn: "REGISTRAR",
    undo: "DESHACER",
    empty: "Nadie coincide con esta búsqueda.",
    paidSection: "1. PAGADOS",
    vipSection: "2. MIEMBROS + BUILDERS + SPEAKERS",
    generalSection: "3. GRATIS APROBADOS",
    paidAccess: "Fila VIP · manilla VIP + silla",
    vipAccess: "Fila VIP · manilla VIP + silla, sección del frente",
    generalAccess: "Fila general · de pie",
    nobody: "Nadie todavía",
    syncError: "No se pudo sincronizar",
    saveError: "Error al guardar — intenta de nuevo",
    foot: "Lista privada de puerta. No la compartas. Sincronizada para el staff.",
    role: {
      Builder: "Builder",
      Member: "Miembro",
      Speaker: "Speaker",
      Approved: "Aprobado",
    } as Record<string, string>,
    paid: {
      "Paid: yes (membership)": "Pagado: sí (membresía)",
      "Paid: no (on the house)": "Pagado: no (cortesía)",
      "Paid: no (free)": "Pagado: no (gratis)",
    } as Record<string, string>,
  },
};

function slugifyAccess(line: Line, t: (typeof copy)["en"]) {
  if (line === "paid") return t.paidAccess;
  if (line === "vip") return t.vipAccess;
  return t.generalAccess;
}

export default function VipNightDoorPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [view, setView] = useState<View>("checkin");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [syncError, setSyncError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const t = copy[lang];

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
      setSyncError(t.syncError);
    }
  }, [applyCheckedList, t.syncError]);

  useEffect(() => {
    void loadCheckins();
    const timer = window.setInterval(() => void loadCheckins(), 5000);
    return () => window.clearInterval(timer);
  }, [loadCheckins]);

  const vipGuests = useMemo(
    () => GUESTS.filter((g) => g.line === "vip" || g.line === "paid"),
    []
  );
  const generalGuests = useMemo(
    () => GUESTS.filter((g) => g.line === "general"),
    []
  );
  const paidGuests = useMemo(
    () => GUESTS.filter((g) => g.line === "paid"),
    []
  );

  const vipChecked = vipGuests.filter((g) => checked[g.id]).length;
  const generalChecked = generalGuests.filter((g) => checked[g.id]).length;
  const checkedCount = vipChecked + generalChecked;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\.+/, "");
    return GUESTS.filter((g) => {
      if (filter === "vip" && g.line === "general") return false;
      if (filter === "general" && g.line !== "general") return false;
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        (g.phoneLast4 && g.phoneLast4.includes(q)) ||
        (g.phone && g.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""))) ||
        g.role.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

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
          email: guest.phone || guest.phoneLast4 || "",
          status: guest.line,
        }),
      });
      if (!res.ok) throw new Error("save failed");
      setSyncError("");
    } catch {
      setChecked((prev) => ({ ...prev, [guest.id]: !next }));
      setSyncError(t.saveError);
    } finally {
      setSavingId(null);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCheckins();
    window.setTimeout(() => setRefreshing(false), 400);
  };

  const filterTabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: t.all, count: GUESTS.length },
    { id: "vip", label: t.vip, count: vipGuests.length },
    { id: "general", label: t.general, count: generalGuests.length },
  ];

  const renderCard = (g: Guest) => {
    const isIn = !!checked[g.id];
    const roleLabel = t.role[g.role] ?? g.role;
    const paid = t.paid[g.paidLabel] ?? g.paidLabel;
    const isMembership = g.paidLabel.includes("yes");

    return (
      <li key={g.id} className={`vn-card${isIn ? " is-in" : ""}`}>
        <div className="vn-card-top">
          <strong>{g.name}</strong>
          {g.phoneLast4 ? (
            <span className="vn-phone">•••• {g.phoneLast4}</span>
          ) : null}
        </div>
        <div className="vn-tags">
          <span className="vn-tag">{roleLabel}</span>
          <span className={`vn-tag${isMembership ? " is-paid" : ""}`}>
            {paid}
          </span>
        </div>
        <div className="vn-access">{slugifyAccess(g.line, t)}</div>
        <button
          type="button"
          className={`vn-check-btn${isIn ? " is-in" : ""}`}
          onClick={() => void toggle(g)}
          disabled={savingId === g.id}
          aria-pressed={isIn}
        >
          {isIn ? t.undo : t.checkIn}
        </button>
      </li>
    );
  };

  const listSection = (
    line: Line,
    title: string,
    accessLabel: string,
    items: Guest[]
  ) => (
    <section className="vn-list-section" key={line}>
      <h2>
        {title} <span>{items.length}</span>
      </h2>
      <p className="vn-list-access">{accessLabel}</p>
      {items.length === 0 ? (
        <p className="vn-nobody">{t.nobody}</p>
      ) : (
        <ol className="vn-plain-list">
          {items.map((g, i) => (
            <li key={g.id}>
              <span className="vn-check-mark" aria-hidden>
                {checked[g.id] ? "☑" : "☐"}
              </span>
              <span className="vn-num">{i + 1}</span>
              <span className="vn-plain-name">
                {g.name}
                <em>
                  {t.role[g.role] ?? g.role}
                  {g.phoneLast4 ? ` · ···${g.phoneLast4}` : ""}
                  {g.phone ? ` · ${g.phone}` : ""}
                </em>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );

  return (
    <main className="vn-page">
      <header className="vn-header">
        <div className="vn-header-row">
          <Link href="/checkin" className="vn-back">
            ← {t.back}
          </Link>
          <div className="vn-lang" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === "en" ? "is-active" : undefined}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === "es" ? "is-active" : undefined}
              onClick={() => setLang("es")}
            >
              ES
            </button>
          </div>
        </div>
        <h1>{t.title}</h1>
        <p className="vn-sub">{t.subtitle}</p>
      </header>

      <div className="vn-stats">
        <p className="vn-stats-main">
          {t.checkedOf(checkedCount, GUESTS.length)}
        </p>
        <p className="vn-stats-sub">
          {t.lines(
            vipChecked,
            vipGuests.length,
            generalChecked,
            generalGuests.length
          )}
          {syncError ? ` · ${syncError}` : ""}
        </p>
      </div>

      <div className="vn-views" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={view === "checkin"}
          className={view === "checkin" ? "is-active" : undefined}
          onClick={() => setView("checkin")}
        >
          {t.checkin}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "lists"}
          className={view === "lists" ? "is-active" : undefined}
          onClick={() => setView("lists")}
        >
          {t.lists}
        </button>
      </div>

      {view === "checkin" ? (
        <>
          <div className="vn-search-row">
            <div className="vn-search">
              <Search size={16} aria-hidden />
              <input
                type="search"
                placeholder={t.search}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
            <button
              type="button"
              className="vn-refresh"
              onClick={() => void onRefresh()}
              disabled={refreshing}
            >
              <RefreshCw size={14} className={refreshing ? "spin" : undefined} />
              {t.refresh}
            </button>
          </div>

          <div className="vn-filters" role="tablist" aria-label="Line filter">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filter === tab.id}
                className={filter === tab.id ? "is-active" : undefined}
                onClick={() => setFilter(tab.id)}
              >
                {tab.label} {tab.count}
              </button>
            ))}
          </div>

          <ul className="vn-cards">{filtered.map(renderCard)}</ul>

          {!filtered.length && (
            <div className="vn-empty">
              <Users size={28} />
              <p>{t.empty}</p>
            </div>
          )}
        </>
      ) : (
        <div className="vn-lists">
          {listSection("paid", t.paidSection, t.paidAccess, paidGuests)}
          {listSection(
            "vip",
            t.vipSection,
            t.vipAccess,
            GUESTS.filter((g) => g.line === "vip")
          )}
          {listSection(
            "general",
            t.generalSection,
            t.generalAccess,
            generalGuests
          )}
        </div>
      )}

      <p className="vn-foot">{t.foot}</p>
    </main>
  );
}
