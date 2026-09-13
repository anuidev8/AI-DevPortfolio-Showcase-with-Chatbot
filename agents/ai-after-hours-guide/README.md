# AI After Hours Voice Guide

LiveKit voice agent (Deepgram STT → Inference LLM → ElevenLabs TTS) that narrates
[AI After Hours](https://visiblebuilders.io) and drives the slide deck over RPC.

Companion UI: Next.js page `/post/ai-after-hours` in this monorepo.

## Setup

```bash
cd agents/ai-after-hours-guide
uv sync
cp .env.example .env.local
# Fill LIVEKIT_* and ELEVEN_* keys
```

Also set the same LiveKit keys in the Next.js app `.env.local`:

```
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_AGENT_NAME=ai-after-hours-guide
NEXT_PUBLIC_LIVEKIT_URL=
```

## Run locally

Terminal 1 — agent worker:

```bash
uv run src/agent.py dev
```

Terminal 2 — Next.js:

```bash
npm run dev
```

Open `/post/ai-after-hours` and tap **Voice Tour**.

## How slide control works

1. Browser mints a token via `POST /api/livekit/token` with `RoomAgentDispatch`.
2. Agent joins and calls frontend RPC tools:
   - `get_slide_state` — current slide
   - `go_to_slide` — move deck (`intro` | `purpose` | `talks` | `community`)
3. Agent narrates each slide after changing it.

See LiveKit docs: [Forwarding tools to the frontend](https://docs.livekit.io/agents/logic/tools/forwarding/).
