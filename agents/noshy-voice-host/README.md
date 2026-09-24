# NoShy Voice Host

LiveKit voice agent (Deepgram STT → Inference LLM → ElevenLabs TTS) that interviews
event guests with the 3 NoShy questions and drives the full-screen match UI over RPC.

Companion UI: Next.js page `/noshy-voice` in this monorepo.

## Setup

```bash
cd agents/noshy-voice-host
uv sync
cp .env.example .env.local
# Fill LIVEKIT_* and ELEVEN_* keys
```

Next.js app `.env.local` (same LiveKit project):

```
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_NOSHY_AGENT_NAME=noshy-voice-host
DATABASE_URL=        # saves profiles + loads members to match against
OPENAI_API_KEY=      # AI talking points on the confirmed screen
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

Open `/noshy-voice` and tap **Start talking**. Without the agent running the page
falls back to typed answers.

## Deploy to LiveKit Cloud

```bash
lk agent create --region us-east --secrets-file .env.cloud   # first time, from this folder
lk agent deploy   # after changes
lk agent update-secrets --secrets-file .env.cloud
```

## How the UI control works

1. Browser mints a token via `POST /api/livekit/token` with `{ product: "noshy-voice" }`,
   which dispatches this agent (`RoomAgentDispatch`).
2. The agent calls frontend RPC methods registered by the page:

| Method | What it does on screen |
| --- | --- |
| `show_question` | Shows question `index` (0 = name, 1–3 = the NoShy questions) |
| `save_answer` | Saves `field` (`name` · `business` · `lookingFor` · `canHelp`), returns the next question |
| `find_matches` | Saves the profile (`/api/join`), shows the globe, returns top 3 matches (~6 s) |
| `focus_match` | Opens one match's swipe card (`index`), or back to the circles (`null`) |
| `confirm_match` | Celebration screen + AI talking points and motivation lines |
| `get_flow_state` | Current phase, question, answers, matches |
| `restart_flow` | Clears everything and starts over |

3. Taps and typed answers are sent to the agent as `[screen] …` chat messages on
   `lk.chat`, so it keeps talking in sync with the UI.

See LiveKit docs: [Forwarding tools to the frontend](https://docs.livekit.io/agents/logic/tools/forwarding/).
