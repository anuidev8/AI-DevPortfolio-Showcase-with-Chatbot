# Topic: chatbot

## Concepts

- Assistant:
  - An AI-powered chat widget that lets visitors interact with the portfolio owner via text or voice.
- Chat Mode:
  - `text` – user types a message, receives a text reply rendered in the chat interface.
  - `voice` – user speaks or the response is read aloud via ElevenLabs TTS.
- Floating Assistant:
  - The persistent widget (`FloatingAssistant.tsx`) that can be opened/closed from any page.
- Chat Interface:
  - Full chat UI (`ChatInterface.tsx`) with message history, input, and mode toggle.
- Audio Response:
  - Component (`AudioResponse.tsx`) that handles playback of TTS audio from ElevenLabs.

## Rules

- The assistant must always have a clear toggle between text and voice modes.
- Voice responses use ElevenLabs API only – do not use browser's built-in `SpeechSynthesis`.
- API key for ElevenLabs must be read from environment variable `ELEVENLABS_API_KEY` (never hardcoded).
- Chat messages are not persisted beyond the current browser session (no backend storage yet).
- The floating assistant should not block important page content on mobile.
- Loading/streaming states must be visually indicated (spinner or animated dots).
- Errors (API failures, network issues) must be caught and shown as an inline error message in the chat.
- Do not silently swallow errors.

## Flows

### Text Chat Flow

1. User types a message and submits (Enter or button click).
2. Message is added to chat history as a `user` message.
3. A loading indicator appears in the assistant's message slot.
4. API call is made to the AI backend (via `src/utils/api.ts`).
5. On success:
   - Response text is added to chat history as an `assistant` message.
   - Loading indicator is removed.
6. On failure:
   - Show an inline error message in the chat: "Something went wrong. Please try again."

### Voice Chat Flow

1. User activates voice mode.
2. Text response is generated (same as text flow, steps 1–5).
3. Response text is sent to ElevenLabs TTS API.
4. Audio is played back via `AudioResponse.tsx`.
5. Audio visualisation is shown while audio plays.
6. On ElevenLabs error: fall back to displaying text only; show a subtle warning.

### Floating Assistant Open/Close

1. Widget starts collapsed (icon visible, chat hidden).
2. User clicks the icon → chat opens with a welcome message.
3. User clicks close (X) or outside → chat collapses; history is preserved during the session.

## Edge Cases

- ElevenLabs API returns non-200:
  - Fall back to text-only mode; do not crash.
- Very long responses:
  - Truncate or paginate within the chat bubble; do not overflow the container.
- User submits empty message:
  - Ignore / keep submit button disabled.
- Rapid re-submissions:
  - Disable input while a response is in flight.

## References

- ElevenLabs TTS docs: `https://docs.elevenlabs.io/`
- Component files:
  - `src/components/assistant/ChatInterface.tsx`
  - `src/components/assistant/AudioResponse.tsx`
  - `src/components/floatingAssistant/FloatingAssistant.tsx`
- API util: `src/utils/api.ts`
