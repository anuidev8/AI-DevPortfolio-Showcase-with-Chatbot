# Agent Board

## Current Focus

- Ongoing build – portfolio is actively under development.
- Core assistant (text + voice chat) is the primary feature.
- Portfolio sections (Hero, Projects, Services, Techs, GitHub Snippet) are being refined.

## Decisions

- 2026-04-05:
  - Agent system set up with Markdown-based planning/execution workflow.
  - Knowledge files tailored to this project (no billing/auth topics).
  - Executor tools: Claude Code (primary), Cursor as backup.
  - ElevenLabs for TTS; voice ID and model stored in `.env.local`.

## Open Questions

- Should the floating assistant support conversation history across page navigations?
- Which voice ID / ElevenLabs model is the current default?
- Is there a Figma file for the UI? (Add link to `knowledge/references.md` when available.)
- Will GitHub snippet section pull live data from the GitHub API, or stay as mock data?
