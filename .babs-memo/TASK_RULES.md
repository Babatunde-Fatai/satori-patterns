# Task Rules (v2.1)

These rules exist because agents love to:
- refactor for fun
- ignore constraints
- forget what they already tried
- skip verification
This file prevents that.

---

## Hard rules
- No unrelated refactors. Ever.
- No drive-by formatting.
- Do not rename files, routes, or folders unless asked or required by the task.
- If you must break a rule, stop and ask.

---

## Task sizing
Small change: <= 3 files, no auth, no routes, no db
Medium change: 4-15 files, or routes, or significant UI flow changes
Large change: > 15 files, auth/security, db/schema, payments, infra

Review requirement:
- Medium: self-review using `.babs-memo/review-prompts.md`
- Large: self-review plus a second pass (sub-agent if available)

---

## Standard flow for features
1) Define tasks and subtasks in the session TASK BOARD.
2) Implement smallest working slice.
3) Add tests or provide a written verification plan.
4) Update session: task status, files touched, verification.

---

## Standard flow for bugfixes
1) Reproduce and write repro steps in the session.
2) Identify root cause (be specific).
3) Apply narrow fix.
4) Verify.
5) Add regression test if feasible.

---

## Documentation rules
Session files are the working log.
Project memory is for durable decisions only.
Do not dump long notes into memory.

---

## Security and privacy
- Validate inputs, especially anything coming from user-controlled sources.
- Avoid leaking tokens to URLs.
- Prefer HTTP-only cookies for sessions where applicable.
- Be explicit about role checks and 403 behavior.

---

## Output format to the user (every time)

DONE
TASK STATUS
FILES TOUCHED
VERIFICATION
DECISIONS
OPEN QUESTIONS
