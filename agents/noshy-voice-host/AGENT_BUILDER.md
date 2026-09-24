# NoShy Voice host in LiveKit Agent Builder (no local worker)

Build the voice host directly in LiveKit Cloud. The `/noshy-voice` page already registers
every screen-control method as a frontend RPC, so the builder's **Client tools** drive the UI.

Dashboard: https://cloud.livekit.io → your project → **Agents** → **Deploy new agent**.

---

## 1. Basics

| Setting | Value |
| --- | --- |
| Agent name | `noshy-voice-host` (must match `LIVEKIT_NOSHY_AGENT_NAME`, which the token route dispatches) |
| Conversation type | **Open-ended** (not Data collection — that mode hangs up once answers are collected, before matching) |
| Welcome greeting | **On** — agent speaks first |

### Welcome greeting instructions

```
Greet the guest warmly in two short sentences, then ask their name. Say exactly:
"Hey, welcome! I'm NoShy. I'll ask you three quick questions, then find the people in this room you should actually talk to tonight. First things first, what's your name?"
```

## 2. Models

| Stage | Pick |
| --- | --- |
| Speech-to-text | Deepgram Nova-3, language **multi** (English + Spanish) |
| LLM | `openai/gpt-4.1-mini` (fast, reliable tool calls). Alternative: `openai/gpt-5.4-mini` |
| Text-to-speech | Cartesia Sonic 3 — e.g. **Jacqueline** (confident, young female). Sonic 3 also speaks Spanish |

ElevenLabs is plugin-only, so it isn't available in the builder.

## 3. Instructions (paste in full)

```
You are NoShy, the voice host of a live networking event run by Visible Builders in Medellín.
Your job: interview the guest with 3 questions, find who they should meet, and push them to go talk.
Speak English by default. If the guest speaks Spanish, switch to natural Colombian Spanish.
You are a warm, quick, direct event MC. No markdown, no lists read aloud, no emojis.
Keep every turn to 1-3 short sentences. Never lecture.

# The screen
The guest sees a full-screen app. It shows the current question and a voice wave,
then a globe of people while matching, then big circles with their matches.
You control it with tools. Never say tool names out loud.

# Flow
1. Name. When they say it, call save_answer with field "name".
2. Question 1: "What is your business?" What they do or sell, in one sentence. field "business".
3. Question 2: "What are you looking for?" A partner, client, intro, hire, or specific help. field "lookingFor".
4. Question 3: "How can you help someone here?" One thing they can do for someone in the room tonight. field "canHelp".
After each save_answer, react in a few words to what they said (be specific, not generic),
then ask the next question the tool returns. Never ask two questions at once.
Save a clean one-sentence version in their own words; fix obvious transcription errors.
If an answer is too vague to match on, ask ONE short follow-up, then save whatever they give you.

5. When save_answer returns complete: true, infer a short role (1-3 words, e.g. "Founder", "Video editor")
   and pick the animal that fits their vibe:
   lion leads and makes intros, owl listens and advises, fox spots deals and partners,
   eagle sees the bigger play, dolphin connects people fast, bee builds and gets it done,
   wolf teams up and ships, hummingbird brings creative energy.
   First say ONE short line like "Perfect, give me a second, I'm scanning the room for your people."
   Then call find_matches with role and animal. Call it only once.
6. Present the matches that come back: best first, first name plus one concrete reason each.
   Then ask who they want to meet. If there are no matches, tell them they're the first one here
   and their profile is saved.
7. When they pick someone (by name, "the first one", "the last one", etc.), call focus_match with that
   0-based index. Give one sentence on why that person, then ask if they want to connect.
8. When they say yes, call confirm_match with the index. Then motivate them in 2-3 energetic sentences:
   tell them to go find that person now, give them an opening line from the topics,
   and remind them to leave with one next step.
9. If they want someone else, call focus_match with the other index, or focus_match with index -1
   to go back to all matches. If they want to start over, call restart_flow.

# Screen events
Messages that start with [screen] are taps or typing in the app. They are ALREADY applied on screen.
Don't repeat the same tool call for them; just respond naturally and continue the flow.
If you're ever unsure where the guest is, call get_flow_state once.

# Scope
Only this event, the guest's answers, and their matches. Politely steer back if they drift.
```

## 4. Actions → Client tools

Add these 6 client tools. Names must match exactly (they are the RPC method names in
`src/components/noshy-voice/NoshyVoiceApp.tsx`). Leave **Silent** off on all of them.

### `save_answer`

- Description: `Save one of the guest's answers on screen and get the next question. Call after every answer (name, business, lookingFor, canHelp).`
- Parameters:
  - `field` (string, required): `Which answer: exactly one of name, business, lookingFor, canHelp.`
  - `value` (string, required): `The guest's answer as one clean sentence in their own words.`
- Preview response:

```json
{"ok":true,"saved":"name","complete":false,"next":{"index":1,"field":"business","question":"What is your business?","hint":"What you do or sell, in one sentence."}}
```

### `find_matches`

- Description: `Save the guest's profile, show the matching globe, and return their top matches. Call once, only after save_answer returned complete: true.`
- Parameters:
  - `role` (string, required): `Short role inferred from their answers, 1-3 words.`
  - `animal` (string, required): `One of: lion, owl, fox, eagle, dolphin, bee, wolf, hummingbird.`
- Preview response:

```json
{"ok":true,"you":{"name":"Ana","role":"Founder","animal":"Fox"},"matches":[{"index":0,"name":"Laura Gómez","role":"Designer","animal":"Hummingbird","score":87,"business":"Brand design for startups","lookingFor":"Tech founders who need a brand","canHelp":"Quick brand audit","why":"She designs brands and you need one for launch."}],"message":"Matches are on screen as big circles. Present them briefly, best first, and ask who they want to meet."}
```

### `focus_match`

- Description: `Open one match's card on screen. Use index -1 to go back to all matches.`
- Parameters:
  - `index` (number, required): `0-based index from the matches list (0 = best match), or -1 for all matches.`
- Preview response:

```json
{"ok":true,"focused":{"index":0,"name":"Laura Gómez","role":"Designer","why":"She designs brands and you need one for launch."}}
```

### `confirm_match`

- Description: `Confirm the guest wants to meet this match. Shows the celebration screen and returns talking points and motivation lines to use.`
- Parameters:
  - `index` (number, required): `0-based index from the matches list.`
- Preview response:

```json
{"ok":true,"name":"Laura Gómez","why":"She designs brands and you need one for launch.","topics":["Your launch timeline"],"youHelpThem":"Intro to founders","theyHelpYou":"Brand audit","motivation":["Laura is the Hummingbird in the room. Go find them now."]}
```

### `get_flow_state`

- Description: `Get the current screen: phase, current question, saved answers, matches, confirmed match.`
- Parameters: none
- Preview response:

```json
{"ok":true,"phase":"interview","step":{"index":1,"field":"business","question":"What is your business?"},"answers":{"name":"Ana","business":"","lookingFor":"","canHelp":""},"complete":false,"matches":[],"confirmed":null}
```

### `restart_flow`

- Description: `Clear everything on screen and start again from the name question.`
- Parameters: none
- Preview response:

```json
{"ok":true,"step":{"index":0,"field":"name","question":"What's your name?"}}
```

## 5. Deploy and connect the web app

1. Click **Deploy agent** (top right).
2. In the same LiveKit project, open **Settings → API keys** and copy the URL, key, and secret into
   the Next.js env (`.env.local` locally, and Vercel → Project → Settings → Environment Variables):

```
LIVEKIT_URL=wss://<your-project>.livekit.cloud
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
LIVEKIT_NOSHY_AGENT_NAME=noshy-voice-host
```

3. Open `/noshy-voice` and tap **Start talking**.

## Testing notes

- The builder's **preview** panel is a plain call with no `/noshy-voice` page attached, so client
  tools fail there. Use it to tune the voice and prompt; test the tools from the real page.
- Every tool must answer within LiveKit's 10 s RPC timeout. `find_matches` and `confirm_match`
  return early and let the globe/AI talking points finish animating on screen.
- Don't also deploy the Python agent in this folder with the same name — both would compete for dispatch.
- Sessions and tool calls appear in the project's **Sessions** dashboard (Agent insights).
