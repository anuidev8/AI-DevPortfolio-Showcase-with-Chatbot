# Visible Builders — Build Weekend · Nov 26–28, 2026

_Community: Visible Builders · Medellín · Status: proposal_

Two connected days. Thursday fills the room. Saturday turns attendees into builders who can ship with cloud AI tools.

| Day | Format | Price |
|---|---|---|
| **Thu 26 Nov** | AI After Hours — 3 speakers + networking | **Free** |
| **Sat 28 Nov** | Hands-on workshop (private cowork) | **Free for Thursday check-ins** · **USD 25** for public seats |

---

## 1. Positioning (one line)

> **Thursday:** hear what builders are shipping.  
> **Saturday:** leave with a live site or app using Vercel, Lovable, connectors and MCPs.

---

## 2. Thursday 26 — Speakers night (same format as usual)

**Goal:** community + soft invite to Saturday workshop.

### Run of show (suggested)

| Time | What | Who |
|---|---|---|
| 5:45 PM | Setup — room, mic, screen, QR | Angel |
| 6:45 PM | Doors + check-in (QR) | Host + Angel |
| 7:20 PM | Welcome + community goals | Host |
| 7:30 – 7:50 | Talk 1 (20 min) | Speaker 1 — TBD |
| 7:50 – 8:00 | Networking break | Host |
| 8:00 – 8:25 | Talk 2 (25 min) | Speaker 2 — TBD |
| 8:25 – 8:35 | Networking break | Host |
| 8:35 – 8:55 | Talk 3 (20 min) | Speaker 3 — TBD |
| 8:55 – close | Open networking + **Saturday workshop pitch** | Angel |

### Thursday CTA (end of night)

- Announce Saturday private workshop
- Thursday check-ins get a **free Saturday seat** (RSVP that night, cap 12–15)
- Remaining seats: **USD 25** (~COP 100.000)
- QR → RSVP / payment page

### Speakers (fill before publishing)

| # | Name | Topic angle (suggested) |
|---|---|---|
| 1 | TBD | Shipping with AI tools in production |
| 2 | TBD | Design / product / workflows |
| 3 | TBD | Connectors, agents or go-to-market |

Keep the usual Visible Builders rules: real talks, demos when possible, never cut speakers to protect breaks.

---

## 3. Saturday 28 — Workshop (private cowork)

**Title:** Build with Cloud AI — Vercel, Lovable, MCPs & Workflows (+ ElevenLabs bonus)  
**Duration:** 3–4 hours  
**Cap:** 12–15 people (laptop required)  
**Outcome:** each person ships (or nearly ships) a website or custom app, with at least one connector / MCP / workflow wired — plus optional voice with ElevenLabs.

### What you teach

1. **Cloud build stack** — Lovable (or similar) for UI speed + Vercel for deploy  
2. **Find & connect tools** — connectors, APIs, account tools  
3. **MCPs & power connections** — how agents talk to real systems  
4. **Design help** — prompts, layout, polish that looks shippable  
5. **Workflows** — from idea → prototype → live URL  
6. **Coding extras** — when to drop into code, env vars, second accounts / keys safely  
7. **Bonus · ElevenLabs** — create a voice, TTS, and plug voice into the build

### Agenda

| Block | Time | Focus |
|---|---|---|
| 0 | 0:00–0:20 | Welcome, outcome, accounts checklist |
| 1 | 0:20–0:50 | Idea → scope a site or custom app |
| 2 | 0:50–1:40 | Build UI with Lovable / AI builder |
| 3 | 1:40–1:55 | Break |
| 4 | 1:55–2:35 | Connectors + MCPs + workflows |
| 5 | 2:35–3:05 | Deploy on Vercel + polish design |
| 6 | 3:05–3:30 | **Bonus · ElevenLabs** — add voice to your build |
| 7 | 3:30–3:55 | Demo circle + next steps (mentorship / community) |
| 8 | 3:55–4:00 | Close + WhatsApp group / resources pack |

### Bring / accounts (send Friday)

- Laptop + charger  
- GitHub account  
- Vercel account  
- Lovable (or chosen builder) account  
- Optional: API keys for tools they want to connect  

### Pricing

| Seat | Price |
|---|---|
| Thursday check-in + RSVP | **Free** |
| Public / no Thursday | **USD 25** (~COP 100.000) |
| Door / last seats | USD 30–35 if almost full |

---

## 4. Funnel

```
Thu free night (3 speakers)
        ↓ check-in QR
Free Sat seat (capped)  OR  USD 25 public seat
        ↓ workshop
Working deploy + resource pack
        ↓ soft offer
Mentorship cohort / company workshop / next AI After Hours
```

---

## 5. Page + assets

- Landing: `/workshop/visible-builders-build-weekend`
- Thursday speaker apply: `/workshop/visible-builders-build-weekend/register-speaker`
- Saturday session apply: `/workshop/visible-builders-build-weekend/register-saturday`
- API: `POST /api/event-applications` (admin list: `GET` + `x-admin-key`)
- Poster: Thu + Sat dates, free / USD 25
- Luma (or WhatsApp) RSVP for both days
- Friday reminder for Saturday RSVPs

### Application fields

| Field | Thu speaker | Sat session |
|---|---|---|
| Name, profile/bio | ✓ | ✓ |
| Instagram, LinkedIn, GitHub | ✓ | ✓ |
| Email, phone/WhatsApp | ✓ | ✓ |
| Session title + description | ✓ | ✓ |
| Deck: Google Slides / PDF / web URL | ✓ | ✓ |
| Video proposal URL | — | ✓ required |
| Examples (links / past work) | — | ✓ |

---

## 6. Open checklist

- [ ] Confirm private cowork room + capacity for Sat 28
- [ ] Lock 3 Thursday speakers + titles (review `event_applications` where kind = thursday_speaker)
- [ ] Confirm workshop tool stack (Lovable vs Cursor/v0 — pick one primary)
- [ ] Publish landing page + RSVP link
- [ ] Share speaker + Saturday apply links
- [ ] Print Thursday QR (check-in + Saturday free RSVP)
- [ ] Prepare accounts checklist PDF / Notion
