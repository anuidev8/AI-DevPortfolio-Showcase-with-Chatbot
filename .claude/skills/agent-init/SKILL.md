---
name: agent-init
description: >
  Initializes the file-based agent system (.agent/ folder + CLAUDE.md) for any role — planner,
  executor, designer, or QA — without needing long manual setup messages. Use this skill whenever
  the user says anything like "plan a task", "I want to build X", "execute task T1", "design T2",
  "QA review", "start working on", "add feature", "fix bug", or asks to generate init prompts for
  another tool (Gemini, Cursor, Codex, Antigravity). Also triggers when the user opens a new
  session and says "let's start", "what should I work on", or just names a task. If the project
  has a CLAUDE.md or .agent/ folder, always use this skill first.
---

# Agent Init Skill

You are booting the file-based agent system for this project. Your job is to:
1. Figure out which **role** the user needs (planner, executor, designer, QA, or prompt-generator).
2. Read the right files from `.agent/` for that role.
3. Either **act in that role directly** (for Claude Code / Cursor / Codex), or **output a ready-to-paste prompt** for the user to use in another tool (Gemini, Claude web, Antigravity).

---

## Step 1 — Detect role and intent

Read the user's message and classify:

| What the user says | Role | Action |
|---|---|---|
| "plan a task", "I want to add X", "create tasks for Y" | **planner** | Read files → act as planner |
| "execute task T1", "work on T2", "implement X" | **executor** | Read files → act as executor |
| "design T2", "UX for X", "what should it look like" | **designer** | Read files → act as designer |
| "QA review", "check my changes", "review the diff" | **qa** | Read files → act as QA |
| "give me prompts for Gemini/Cursor/Claude web/Antigravity" | **prompt-gen** | Output copy-paste prompts |
| Unclear | Ask one short question: "Should I plan, execute, design, or QA?" |

---

## Step 2 — Read the right files

Always read `CLAUDE.md` first (one read, not every message). Then read by role:

**Planner:**
- `.agent/PROJECT.md`
- `.agent/KNOWLEDGE.md`
- `.agent/TASKS.md`
- Any `knowledge/*.md` files relevant to the topic the user mentioned.

**Executor:**
- `.agent/TASKS.md` (find the task row and its Plan JSON)
- `knowledge/<topic>.md` for that task's topic field.
- `knowledge/stack.md` (always, for implementation patterns).

**Designer:**
- `.agent/TASKS.md` (find the task's designer steps)
- `.agent/knowledge/ux.md`
- `.agent/knowledge/ui-elements.md`

**QA:**
- `.agent/TASKS.md` (find the task being reviewed)
- `knowledge/<topic>.md` for that task's topic.

**Prompt-gen:**
- `.agent/PROJECT.md`
- `.agent/TASKS.md`
- Read `references/tool-prompts.md` in this skill folder for the templates.

---

## Step 3 — Act in the role

### Planner behavior

**Phase 1 — Ask clarifying questions before planning anything.**

Reading the files gives you context, but the user's one-line request is almost always underspecified. Before writing a single task, ask up to 4 focused questions to nail down exactly what is needed. Good questions to ask (pick the ones most relevant):

1. **Scope** – "What exactly should this feature do? Any edge cases or things it should NOT do?"
2. **UI/UX needed?** – "Does this need new UI design, or is it purely logic/backend?" (This determines whether designer steps are needed.)
3. **Priority** – "Is this urgent, or can it wait? Should it block other tasks?"
4. **Constraints** – "Any specific libraries, APIs, or patterns you want to use / avoid?"
5. **Success criteria** – "How will you know it's done? Any acceptance criteria?"

Keep your questions short and conversational — you are having a dialogue, not filling out a form. If the user's original message already answered some of these, skip those questions.

Wait for the user's answers before proceeding to Phase 2.

---

**Phase 2 — Write the plan (after the user has answered).**

Now that you have enough context:
- Understand the current state of the board (Todo/Doing/Done tables in TASKS.md).
- Create a new `### Task Tx` section following the existing format exactly:
  - Next sequential ID (check the highest T-number already in the file).
  - A clear **Goal** paragraph (incorporate the user's answers).
  - A **Plan** JSON array with fields: `index`, `role`, `topic`, `file`, `action`, `notes`.
  - A **Step Log** with one unchecked `- [ ] step N – not started` line per step.
- Add a row to the `## Todo` table.
- Do NOT execute code. Do NOT mark steps done. Do NOT modify knowledge files.
- After writing the plan, give the user a plain-language summary and ask: "Does this plan look right, or should I adjust anything?"

**Good planner plan structure:**
- Steps with `role='designer'` come before `role='executor'` steps when UI/UX design is needed.
- Steps with `role='qa'` always come last.
- Each step has one clear `file` target (or `null` for designer/QA steps).

### Executor behavior

After reading the files:
1. Move the task row from `Todo` → `Doing` in TASKS.md.
2. Work through each step in the Plan JSON where `role='executor'`, in order.
3. After completing each step:
   - Mark it `[x]` in the Step Log.
   - Add a one-line note describing what was done.
4. When all executor steps are done:
   - Run `npm run lint` and `npm run build`.
   - If both pass: move task row to `Done`.
   - If either fails: move to `Blocked`, note the error.
5. Do NOT touch steps where `role='designer'` or `role='qa'`.

### Designer behavior

After reading the files:
- For each step where `role='designer'`:
  - Produce detailed design output: layout spec, component breakdown, copy, animation variants, states.
  - Write this output directly into the Step Log for that step (as a nested block under the `[ ]` line).
  - Mark the step `[x]` and summarize what was designed.
- Do NOT write code. Do NOT mark executor steps done.

### QA behavior

After reading the files:
- Review the changed files (ask the user to paste the diff if not accessible).
- Check each change against the rules in the relevant `knowledge/*.md` file.
- For issues found: add a `#### QA Notes` section to the task's Step Log with bullet points.
- If all good: add `✅ QA sign-off – YYYY-MM-DD` to the Step Log.
- If issues: keep task in `Doing` and list what needs fixing.

### Prompt-gen behavior

Read `references/tool-prompts.md` in this skill folder for the exact templates, then:
1. Ask which tool(s) the user needs prompts for (if not stated).
2. Ask which role and which task (if not stated).
3. Fill in the template with:
   - The project name and stack from `PROJECT.md`.
   - The specific task ID and goal from `TASKS.md`.
   - The relevant knowledge file content (inline or referenced).
4. Output formatted, ready-to-paste messages — one block per tool.
5. Tell the user: "Paste the first message at the start of a new session in [tool], then send your follow-up."

---

## Important rules (for all roles)

- Follow `knowledge/*.md` files as the single source of truth for domain rules. Never invent UX patterns, business rules, or tech decisions not documented there.
- Never hardcode API keys or secrets. Always use environment variable names.
- Never modify `knowledge/*.md` files — those require human approval.
- If a knowledge file is missing a rule you need, say so and ask the user to add it before proceeding.
- One role at a time — if you are the executor, do not redesign the UX; if you are the designer, do not write code.
