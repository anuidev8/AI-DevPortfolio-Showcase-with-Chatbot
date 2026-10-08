"use client";

import { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import type { CommunityProfile } from "@/lib/community-data";
import { MISSIONS, meetUrl, missionUrl } from "@/lib/noshy-game";
import { MissionCard, NoshyCard } from "@/components/noshy/NoshyCard";

type Member = CommunityProfile & { memberId?: number };

/** Print sheet: one attendee card per registered member, plus the mission cards. */
export default function NoshyCardsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [site, setSite] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSite(process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || window.location.origin);
    void (async () => {
      try {
        const res = await fetch("/api/members");
        const data = (await res.json()) as { members?: Member[] };
        setMembers((data.members ?? []).filter((m) => m.memberId != null));
      } catch { /* show the empty state */ }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <main className="noshy-print">
      <div className="noshy-print-bar">
        <h1>NoShy cards</h1>
        <span className="noshy-muted">{loading ? "Loading…" : `${members.length} attendees · ${MISSIONS.length} missions`}</span>
        <button type="button" className="noshy-btn noshy-btn-primary" onClick={() => window.print()}>
          <Printer size={16} />Print
        </button>
      </div>

      <h2>Attendee cards</h2>
      {!loading && members.length === 0 && <p className="noshy-muted">No one has registered yet.</p>}
      <div className="noshy-print-grid">
        {site && members.map((m) => (
          <NoshyCard key={m.id} name={m.name} role={m.role} animalId={m.animalId} lookingFor={m.lookingFor} url={meetUrl(site, m.memberId!)} />
        ))}
      </div>

      <h2>Mission cards</h2>
      <div className="noshy-print-grid">
        {site && MISSIONS.map((mission) => (
          <MissionCard key={mission.id} mission={mission} url={missionUrl(site, mission.id)} />
        ))}
      </div>
    </main>
  );
}
