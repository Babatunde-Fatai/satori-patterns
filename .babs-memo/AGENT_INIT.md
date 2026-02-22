# .babs-memo Agent Protocol (v2.1)

Goal: keep long-running agent work consistent across weeks by forcing state load, explicit task tracking, and durable memory.

Non-negotiables:
1) Do not touch code until Checkpoint 1 is complete.
2) You must maintain an explicit Task Board in the active session file.
3) You must not ignore any MUST items in this protocol.

---

## Checkpoint 1: Load State (before any work)

A. Read the active session file
- Use today's session: `.babs-memo/sessions/YYYY-MM-DD-SESSION.md`
- If missing: create it from `.babs-memo/templates/session-template.md`
- Read: `CONTEXT SNAPSHOT`, `TASK BOARD`, `OPEN QUESTIONS`, `HARD CONSTRAINTS`, `DURABLE DECISIONS`

B. Read standing rules and memory
- `.babs-memo/TASK_RULES.md`
- `.babs-memo/MEMORY_INDEX.md`
- Read the relevant project memory file under `.babs-memo/memory/`

C. Load skills
- Always load: `skills/pattern-conversion/SKILL.md`
- Load others only if relevant (e.g frontend-design, etc.)

D. Must add Learnings in Memory, also update skill as instructed in your prompt

### Required first response: State Receipt (strict format)

Provide exactly these headings, short answers only.

STATE RECEIPT
Session: opened/created `.babs-memo/sessions/YYYY-MM-DD-SESSION.md`
Loaded: TASK_RULES, MEMORY_INDEX, project memory: <file>
Task Board: <count> tasks, <count> active
Open Questions: <count> (list ids only)
Hard Constraints: <count> (list ids only)
Planned files to touch: <list or "unknown yet">

Then continue with: TASK BREAKDOWN (Checkpoint 2).

---

## Checkpoint 2: Task Breakdown (must include tasks and subtasks)

Before editing anything, you must create or update the `TASK BOARD` in the session file.

Required structure:
- T<n>: Title
  - Objective:
  - Acceptance criteria:
  - Subtasks: S1..Sn
  - Files expected:
  - Status: NOT STARTED | IN PROGRESS | BLOCKED | DONE
  - Owner: agent

If the user gave tasks, mirror them as T-items. If not, create the minimum set needed.

Output in chat (brief):
TASK BREAKDOWN
- T1: ...
  - S1 ...
  - S2 ...
- T2: ...

---

## Checkpoint 3: During Work (session updates are mandatory)

You must update the session file when:
- you start a new task or subtask
- you discover a constraint or a gotcha
- you change approach
- you touch more than 3 files, or change any auth, routes, db, payments, or infra

Session updates must include:
- which task/subtask changed
- what changed
- files touched (actual)
- verification done, even if "manual only"

---

## Checkpoint 4: Durable memory rules

Only write to project memory when the decision will matter later:
- API contract, auth/security, roles/permissions
- data model or schema
- folder structure and naming conventions
- dependency add/remove
- irreversible UI pattern or design token decision
- failed approach worth remembering

Memory entry format:
- **[Decision]** (YYYY-MM-DD) Decision. Why. Impact. Status: FINAL/ACTIVE.
- **[Tried and Failed]** (YYYY-MM-DD) Attempt. Why it failed. What to do instead.

Never bloat memory with step-by-step work, keep that in the session file.

---

## Checkpoint 5: Wrap Up (completion contract)

Final response must include:
DONE
- bullets of what shipped

TASK STATUS
- T1: DONE, notes
- T2: BLOCKED, why

FILES TOUCHED
- list

VERIFICATION
- commands run or manual checks

DECISIONS
- list any durable decisions, and confirm they were written to project memory (or "none")

OPEN QUESTIONS
- list ids and what you need from the user
