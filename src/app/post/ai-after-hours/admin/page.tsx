'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Power, PowerOff, RefreshCw, Save } from 'lucide-react';

type Speaker = {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  accent: string;
  initials: string;
  sortOrder: number;
  enabled: boolean;
};

const EMPTY_FORM = {
  name: '',
  role: '',
  imageUrl: '',
  accent: '#00f2ff',
  initials: '',
  enabled: true,
};

export default function AiAfterHoursSpeakersAdmin() {
  const [adminKey, setAdminKey] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (key: string) => {
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('/api/speakers?admin=1', {
        headers: { 'x-admin-key': key },
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) {
        setUnlocked(false);
        setStatus(data.error || 'Unauthorized — check AI_AFTER_HOURS_ADMIN_KEY');
        return;
      }
      setUnlocked(true);
      setSpeakers(data.speakers ?? []);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('aah-admin-key', key);
      }
    } catch {
      setStatus('Failed to load speakers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('aah-admin-key');
    if (saved) {
      setAdminKey(saved);
      void load(saved);
    }
  }, [load]);

  async function unlock(e: FormEvent) {
    e.preventDefault();
    await load(adminKey.trim());
  }

  async function saveSpeaker(e: FormEvent) {
    e.preventDefault();
    if (!adminKey.trim()) return;
    setLoading(true);
    setStatus('');
    try {
      const payload = {
        name: form.name,
        role: form.role,
        imageUrl: form.imageUrl,
        accent: form.accent,
        initials: form.initials,
        enabled: form.enabled,
      };

      const res = await fetch(editingId == null ? '/api/speakers' : `/api/speakers/${editingId}`, {
        method: editingId == null ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey.trim(),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || 'Save failed');
        return;
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setStatus(editingId == null ? 'Speaker created' : 'Speaker updated');
      await load(adminKey.trim());
    } catch {
      setStatus('Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function toggleEnabled(speaker: Speaker) {
    setLoading(true);
    try {
      const res = await fetch(`/api/speakers/${speaker.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey.trim(),
        },
        body: JSON.stringify({ enabled: !speaker.enabled }),
      });
      if (!res.ok) {
        const data = await res.json();
        setStatus(data.error || 'Toggle failed');
        return;
      }
      await load(adminKey.trim());
    } finally {
      setLoading(false);
    }
  }

  function startEdit(speaker: Speaker) {
    setEditingId(speaker.id);
    setForm({
      name: speaker.name,
      role: speaker.role,
      imageUrl: speaker.imageUrl,
      accent: speaker.accent,
      initials: speaker.initials,
      enabled: speaker.enabled,
    });
  }

  return (
    <main className="min-h-screen bg-[#0b011d] px-5 py-8 font-sans text-white md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/post/ai-after-hours" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/50 hover:text-white">
            <ArrowLeft size={14} />
            Back to slides
          </Link>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00f2ff]">AI After Hours · Speakers Admin</p>
        </div>

        {!unlocked ? (
          <form onSubmit={unlock} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h1 className="text-2xl font-black uppercase">Admin unlock</h1>
            <p className="mt-2 font-mono text-xs text-white/50">
              Enter <code className="text-[#00f2ff]">AI_AFTER_HOURS_ADMIN_KEY</code> from your env.
            </p>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="mt-5 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 font-mono text-sm outline-none focus:border-[#00f2ff]"
              placeholder="Admin key"
            />
            <button
              type="submit"
              className="mt-4 rounded-lg bg-[#00f2ff] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black"
            >
              Unlock
            </button>
            {status ? <p className="mt-3 font-mono text-xs text-[#ff007a]">{status}</p> : null}
          </form>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-black uppercase">Speakers</h1>
              <button
                type="button"
                onClick={() => load(adminKey)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/70 hover:border-[#00f2ff] hover:text-[#00f2ff]"
              >
                <RefreshCw size={12} />
                Refresh
              </button>
            </div>

            <div className="space-y-3">
              {speakers.map((speaker) => (
                <div
                  key={speaker.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  style={{ opacity: speaker.enabled ? 1 : 0.55 }}
                >
                  <div
                    className="h-14 w-14 overflow-hidden rounded-full border-2"
                    style={{ borderColor: speaker.accent }}
                  >
                    {speaker.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={speaker.imageUrl} alt={speaker.name} className="h-full w-full object-cover object-top" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-black" style={{ color: speaker.accent }}>
                        {speaker.initials}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black uppercase">{speaker.name}</p>
                    <p className="mt-1 font-mono text-xs text-white/50">{speaker.role || '—'}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: speaker.enabled ? '#00f2ff' : '#ff007a' }}>
                      {speaker.enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(speaker)}
                      className="rounded-lg border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-wider hover:border-[#00f2ff]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleEnabled(speaker)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-wider hover:border-[#ff007a]"
                    >
                      {speaker.enabled ? <PowerOff size={12} /> : <Power size={12} />}
                      {speaker.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
              {!speakers.length && !loading ? (
                <p className="font-mono text-xs text-white/40">No speakers yet — create one below.</p>
              ) : null}
            </div>

            <form onSubmit={saveSpeaker} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex items-center gap-2">
                {editingId == null ? <Plus size={16} className="text-[#00f2ff]" /> : <Save size={16} className="text-[#00f2ff]" />}
                <h2 className="font-black uppercase">{editingId == null ? 'Create speaker' : `Edit #${editingId}`}</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-white/45">
                  Name
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#00f2ff]"
                  />
                </label>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-white/45">
                  Initials
                  <input
                    value={form.initials}
                    onChange={(e) => setForm((f) => ({ ...f, initials: e.target.value }))}
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#00f2ff]"
                    placeholder="EM"
                  />
                </label>
                <label className="md:col-span-2 block font-mono text-[10px] uppercase tracking-wider text-white/45">
                  Role
                  <input
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#00f2ff]"
                  />
                </label>
                <label className="md:col-span-2 block font-mono text-[10px] uppercase tracking-wider text-white/45">
                  Image URL
                  <input
                    value={form.imageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#00f2ff]"
                    placeholder="/social/ai-after-hours/speakers/name.png"
                  />
                </label>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-white/45">
                  Accent color
                  <input
                    type="color"
                    value={form.accent}
                    onChange={(e) => setForm((f) => ({ ...f, accent: e.target.value }))}
                    className="mt-1.5 h-10 w-full rounded-lg border border-white/15 bg-black/40"
                  />
                </label>
                <label className="flex items-end gap-3 font-mono text-[10px] uppercase tracking-wider text-white/45">
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  Enabled on slides
                </label>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#00f2ff] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black disabled:opacity-50"
                >
                  {editingId == null ? 'Create' : 'Save changes'}
                </button>
                {editingId != null ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm(EMPTY_FORM);
                    }}
                    className="rounded-lg border border-white/15 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white/70"
                  >
                    Cancel edit
                  </button>
                ) : null}
              </div>
              {status ? <p className="mt-3 font-mono text-xs text-[#00f2ff]">{status}</p> : null}
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
