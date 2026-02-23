---
name: frontend-design
description: Agent execution system for frontend/product design direction. Use when an agent must design or redesign a website/web app, improve an existing codebase UI/UX, create implementation-ready design guidance, or produce scoped page-level design specs while preserving brand intent, accessibility, and product coherence.
---

# Senior Product Designer

This skill is for coding/design agents. It is not a generic user-facing prompt-generation script.

The output target is the agent's implementation workflow: discovery, decision capture, design system definition, and implementation-ready direction.

## For Coding Agents: Start Here

Before generating any design direction, you MUST read:

**[Agent Execution Spec](references/AGENT_EXECUTION_SPEC.md)**

This file defines intake order, required discovery fields, and decision gates.

## Table of Contents (all contained in `references/`)

0. [Agent Execution Spec](references/AGENT_EXECUTION_SPEC.md) - READ FIRST
1. [Color Palettes](references/color-palettes.md)
2. [Font Pairings](references/font-pairings.md)
3. [Output Structure](references/prompt-structure.md)
4. [Subpage Patterns](references/subpage-patterns.md)

---

## File Selection Decision Tree (quick)

- If starting discovery or information is incomplete -> read [references/AGENT_EXECUTION_SPEC.md](references/AGENT_EXECUTION_SPEC.md)
- If user needs palette options or accessibility-safe palette validation -> read [references/color-palettes.md](references/color-palettes.md)
- If user needs font recommendations or pairing alternatives -> read [references/font-pairings.md](references/font-pairings.md)
- If producing full-site implementation direction -> read [references/prompt-structure.md](references/prompt-structure.md)
- If producing only page-level specs -> read [references/subpage-patterns.md](references/subpage-patterns.md)
- If existing codebase refresh (not rebuild) -> read [references/AGENT_EXECUTION_SPEC.md](references/AGENT_EXECUTION_SPEC.md) first, then preserve system constraints while applying `references/prompt-structure.md`

## Execution Phases

### Phase 1: Discovery (mandatory)

Run `references/AGENT_EXECUTION_SPEC.md` intake process fully before design output.

Discovery must explicitly capture:
- Starting mode: from scratch vs existing codebase
- Preserve vs replace decisions (for existing products)
- Audience, desired emotional outcome, and primary objective
- Page and content inventory
- Color and typography decisions with role mapping
- Navigation and mobile behavior
- Reference tension resolution if references conflict

If required fields are missing, keep discovering.

### Phase 2: Synthesis

Create a concise design intent statement (3-5 sentences) that defines:
- Product identity
- Interaction/visual feel
- Memorable core impression
- Key design tension

Do not move forward if this is not internally coherent with discovery inputs.

### Phase 3: Implementation Direction

Generate implementation-ready direction using `references/prompt-structure.md` as the output contract.

This output is for agent execution and should be actionable for build tools or handoff docs. Avoid generic language. Every CTA, data surface, and behavior must be wired.

Output must include a token block for implementation portability:
- Color tokens (background/surface/text/accent states)
- Typography tokens (font families, sizes, line heights, weights)
- Spacing/radius/shadow tokens
- Motion tokens (duration/easing/entry rules)

### Phase 4: Existing Codebase Mode

For visual refreshes on existing codebases:
- Preserve architecture unless replacement is explicitly approved
- Express changes as: Keep X, replace Y with Z, add W
- Maintain continuity with existing routes/components unless a migration path is provided
- Include wiring and UX integrity checks (links, CTA destinations, navigation state)

### Phase 5: Subpage-Only Mode

When scope is only specific pages, use `references/subpage-patterns.md` and output only scoped page specs.

Every subpage spec must include:
- Data architecture
- Section/layout map
- Integration points
- Content update instructions
- Wiring rules

### Phase 6: Verification Gate

Before final delivery, run validation against `references/AGENT_EXECUTION_SPEC.md`:
- Accessibility checks (WCAG-oriented contrast, keyboard/focus, non-text contrast)
- UX heuristic checks (feedback, consistency, error prevention, recognition over recall)
- Responsive acceptance checks (desktop/tablet/mobile)
- Interaction-state checks (hover/focus/active/disabled/loading)

## Critical Quality Standards

- No generic style output; all decisions must be tied to brand/product intent.
- No orphan actions; every interaction requires destination/behavior.
- No decorative-only motion; effects must communicate hierarchy or state.
- No vague content guidance; include concrete copy direction examples.
- No hardcoded dynamic content where ongoing updates are expected.
- Mobile behavior must be explicitly defined.

## Conflict and Pushback Rules

- If user preference harms usability/accessibility, flag tradeoff explicitly and ask for decision.
- If references conflict, force a priority decision before synthesis.
- Never silently override explicit user constraints.
