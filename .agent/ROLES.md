# Roles & Models

## Planner

- Role: Break down features into tasks, create/update TASKS.md plans, high-level QA and prioritisation.
- Default model: Claude (latest, web or API).
- Where it works:
  - Claude web chat with repo files attached.
  - Any chat tool that can read `.agent/` files.
- Inputs:
  - `.agent/PROJECT.md`
  - `.agent/KNOWLEDGE.md` + relevant `knowledge/*.md`
  - User's request / feature description.

## Designer

- Role: UX/UI layout, copy, micro-interactions, component structure decisions.
- Default model: Claude or Gemini (via web).
- Inputs:
  - `.agent/knowledge/ux.md`
  - `.agent/knowledge/ui-elements.md`
  - Relevant Task section from TASKS.md (role='designer').
- Output: Detailed design instructions, component specs, copy, animation specs – written back into TASKS.md step notes or a separate design doc.

## Executor

- Role: Write and edit code; move tasks through todo → doing → done/blocked.
- Recommended tools:
  - Claude Code (primary)
  - Cursor (Claude/OpenAI backend)
  - OpenCode / Windsurf
- Behaviour:
  - Must read `CLAUDE.md` and `.agent/TASKS.md` before touching code.
  - Only execute steps where `role='executor'`.
  - After each step: mark `[x]`, add a one-line note, update board row status.
- Forbidden:
  - Inventing new business/UX rules not in `knowledge/*.md`.
  - Moving a task to Done before all steps are marked `[x]`.

## QA

- Role: Review diffs vs knowledge files, flag regressions, suggest follow-up tasks.
- Default model: Claude (latest).
- Inputs:
  - Git diff or changed files.
  - Relevant `knowledge/*.md` for the topic.
- Output: Bullet list of issues or ✅ sign-off, added to the task's Step Log.
