# CLAUDE.md – Agent Guide

This file is the entry point for any AI coding agent (Claude Code, Cursor, OpenCode, etc.) working in this repo.

**Read this file first, then follow the instructions for your role.**

---

## Files to Read at Start

| File | Purpose |
|------|---------|
| `.agent/PROJECT.md` | Project identity, folder structure, conventions |
| `.agent/ROLES.md` | Which model/tool handles which role |
| `.agent/KNOWLEDGE.md` | Index of all domain knowledge topics |
| `.agent/TASKS.md` | Task board + detailed plans + step logs |
| `.agent/TOOLS.md` | What tools to use and when |
| `.agent/BOARD.md` | Current focus, decisions, open questions |

**Domain knowledge files** (read only the ones relevant to your current task):

| File | When to read |
|------|-------------|
| `.agent/knowledge/chatbot.md` | Any work on the AI assistant or chat |
| `.agent/knowledge/portfolio.md` | Any work on portfolio sections or content |
| `.agent/knowledge/ux.md` | Any UI/UX behaviour, layout, interaction |
| `.agent/knowledge/ui-elements.md` | Components, animations, colours, typography |
| `.agent/knowledge/stack.md` | Tech decisions, libraries, patterns, conventions |
| `.agent/knowledge/references.md` | External links, API docs, Figma, deploy |

---

## Role Behaviour

### Planner

You are creating or updating task plans.

1. Read `.agent/PROJECT.md`, `.agent/KNOWLEDGE.md`, and any relevant `knowledge/*.md` files.
2. Read `.agent/TASKS.md` to understand current state.
3. Create a new `### Task Tx` section in `TASKS.md` following the template exactly.
4. Add a row to the `## Todo` table.
5. Write a clear Goal, a JSON steps array with `index`, `role`, `topic`, `file`, `action`, `notes`.
6. Do not execute any code. Do not mark steps done.

### Executor

You are applying code changes.

1. Read `CLAUDE.md` (this file).
2. Read `.agent/TASKS.md` – find your assigned task and steps where `role='executor'`.
3. Read the relevant `knowledge/*.md` files for that task's topic.
4. Move the task row from `Todo` → `Doing` in the board tables.
5. Execute each step in order:
   - Work on the file specified in the step.
   - Follow the knowledge files – do not invent rules.
   - After completing a step: mark it `[x]` in the Step Log and add a one-line note.
6. After all executor steps are done: move the row to `Done` (or `Blocked` if stuck).
7. Before marking Done: run `npm run lint` and `npm run build` and confirm they pass.
8. Do not touch steps with `role='designer'` or `role='qa'`.

### Designer

You are creating UX/UI specifications or design decisions.

1. Read `.agent/knowledge/ux.md` and `.agent/knowledge/ui-elements.md`.
2. Read the relevant Task section from `.agent/TASKS.md` (steps with `role='designer'`).
3. Produce detailed design output: component specs, copy, animation variants, layout notes.
4. Write your output back into the Step Log of the task (or a linked design doc).
5. Do not write code. Do not mark executor steps done.

### QA

You are reviewing completed work.

1. Read the relevant `knowledge/*.md` files for the task's topic.
2. Review the git diff or changed files against the knowledge rules.
3. For each issue: add a bullet to the task's Step Log under a `#### QA Notes` heading.
4. If all checks pass: add `✅ QA sign-off – [date]` to the Step Log.
5. If issues found: keep the task in `Doing` and note what needs fixing.

---

## Conventions (Quick Reference)

- Language: TypeScript. Strict mode preferred.
- Styling: Tailwind CSS utility classes only (no inline styles, no CSS modules).
- Animations: Framer Motion. Use `whileInView` for scroll-triggered, `AnimatePresence` for mount/unmount.
- Icons: Lucide React.
- All API calls go through `src/utils/api.ts`.
- All portfolio content comes from `src/mocks/` – never hardcode in components.
- All types go in `src/types/project.types.ts`.
- Environment variables: read from `process.env.VARIABLE_NAME`; never hardcode secrets.
- New components: place in the appropriate `src/components/<domain>/` subfolder.
- Before marking any task Done: `npm run lint` ✅ and `npm run build` ✅.

---

## Do Not

- Do not invent new UX rules, business rules, or design decisions not in `knowledge/*.md`.
- Do not hardcode API keys, tokens, or secrets.
- Do not mark a task Done if lint or build fails.
- Do not modify `.agent/knowledge/*.md` files without human approval.
- Do not execute steps assigned to a different role.
