# Tools & Skills

## Strategy

- Default: use local files (`.agent/`, `src/`) and reasoning only.
- Use external tools only when:
  - You need to call a live API (ElevenLabs, GitHub, etc.).
  - You must run tests, lint, or build scripts.
  - You must read/write files beyond what is open in context.

## Tools

### Filesystem / Repo

- Purpose: search repo, open files, run build/lint/tests.
- Use for:
  - `npm run dev` – local dev server.
  - `npm run build` – production build check.
  - `npm run lint` – lint before marking a task done.
  - Finding related files by name or content.

### HTTP / API

- Purpose: call external APIs (ElevenLabs, GitHub REST API, etc.).
- Use for:
  - Verifying ElevenLabs voice IDs or model names.
  - Fetching GitHub data for the GitHub snippet section.
- Avoid for:
  - Things already documented in `.agent/knowledge/*.md`.

### Code Execution / Sandbox

- Purpose: run small scripts, data transforms, prototype algorithms.
- Use for:
  - Generating or transforming mock data in `src/mocks/`.
  - Performance checks on animation logic.
- Avoid for:
  - Simple reasoning you can do in plain text.

## Environment Variables

- Store all secrets in `.env.local` (never commit).
- Known variables:
  - `ELEVENLABS_API_KEY` – TTS API access.
  - Add others here as they are introduced.
