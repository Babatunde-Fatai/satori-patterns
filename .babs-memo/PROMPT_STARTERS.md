# Prompt Starters (copy/paste)

## Default (recommended)

Before doing anything:
1) Follow `.babs-memo/AGENT_INIT.md` Checkpoint 1.
2) Output the required STATE RECEIPT.
3) Create or update the session TASK BOARD, then output TASK BREAKDOWN.
4) Only then start implementation.
5) After every implementation run a sub-agent to review your work and make corrections where necessary

### TASKS
- <write tasks here>

### CONSTRAINTS (must obey)
- Do not refactor unrelated code.
- Confirm planned files to touch before editing.
- Keep durable decisions in `.babs-memo/memory/<project>.md`.

---

## Feature build

Before doing anything:
1) Follow `.babs-memo/AGENT_INIT.md` Checkpoint 1.
2) STATE RECEIPT.
3) TASK BREAKDOWN.

### FEATURE
Build: <feature>

### ACCEPTANCE CRITERIA
- …
- …

### OUT OF SCOPE
- …

### REQUIRED OUTPUT
DONE
TASK STATUS
FILES TOUCHED
VERIFICATION
DECISIONS
OPEN QUESTIONS

---

## Bugfix

Before doing anything:
1) Follow `.babs-memo/AGENT_INIT.md` Checkpoint 1.
2) STATE RECEIPT.
3) TASK BREAKDOWN (include repro as T1 subtasks).

### BUG
Symptom:
Repro steps:
Expected:
Actual:

### REQUIRED OUTPUT
DONE
TASK STATUS
FILES TOUCHED
VERIFICATION
DECISIONS
OPEN QUESTIONS

---

## Refactor (only when requested)

Before doing anything:
1) Follow `.babs-memo/AGENT_INIT.md` Checkpoint 1.
2) STATE RECEIPT.
3) TASK BREAKDOWN.

### GOAL
Metric or pain:
Must not change:

### SCOPE LIMITS
- Touch max <N> files unless you ask first.
- No behavior changes unless explicitly approved.

### REQUIRED OUTPUT
DONE
TASK STATUS
FILES TOUCHED
VERIFICATION
DECISIONS
OPEN QUESTIONS
