# Agent Execution Spec

Use this file first for frontend-design tasks. It defines required discovery order, decision gates, and output readiness checks for coding agents.

## Mandatory Start (No Design Output Yet)

1. Confirm mode: from scratch vs existing codebase.
2. If existing codebase, capture preserve vs replace constraints before proposing changes.
3. Run intake in rounds (maximum 3 questions per message).
4. Do not produce implementation direction until required discovery fields are complete.

## Discovery Intake Workflow

### Step 1: Starting Point

Ask:
- Are you starting from scratch, or improving an existing website/codebase?

If existing codebase:
- Request screenshot, URL, or detailed description.
- Ask what must be preserved and what can change.
- Confirm stack (Next.js, React, etc.) so output stays implementation-compatible.

### Step 2: Identity and Audience

Run in three rounds.

Round 1: Core identity
- What does this platform/person/brand do in one sentence?
- Who is the primary visitor and what should they feel or do immediately?
- What is the single thing they should remember after visiting?

Round 2: Tone and energy
- Visual direction: dark/bold/editorial vs light/clean/airy vs dark base with light moments vs custom
- Energy: calm authority vs energetic/future-facing vs warm/human vs bold/provocative
- Primary goal: thought leadership vs community vs storytelling vs conversion vs mixed

Round 3: Content inventory
- Required pages/sections
- Content types (blog, podcast, projects, speaking, shop, etc.)
- Existing external tools/platforms (Substack, cal.com, YouTube, Spotify, etc.)

### Step 3: Visual Identity Inputs

#### Color intake
Tell the user:
"Provide your color palette by either (a) giving existing hex colors, (b) describing mood for suggestions, or (c) selecting from curated palettes."

Rules:
- If user supplies colors, accept and map explicit roles.
- If user needs options, read `references/color-palettes.md` and offer 3 curated options.
- Minimum set: background, primary accent, secondary surface, primary text.
- Maximum recommended: 5 core colors.
- Every color must have a role.

#### Typography intake
Tell the user:
"Provide font choices by either (a) naming fonts, (b) describing personality for suggestions, or (c) selecting from curated pairings."

Rules:
- If user needs options, read `references/font-pairings.md` and offer 3 pairings.
- Minimum: display + body.
- Maximum: display + body + accent.
- Never use Arial, Inter, Roboto, or system-ui as primary display font.
- Ensure legibility and clear display/body contrast.

### Step 4: Navigation and Structure

Ask:
- Main nav pages?
- Nav behavior (sticky/fixed/scroll-away)?
- Mobile nav behavior preference?

### Step 5: Reference Aesthetic

Ask for references (sites/images/screenshots).

If provided:
- Extract structure and interaction principles, not just visual imitation.
- If references conflict, surface conflict and ask for priority decision.

## Discovery Completion Gate

Do not proceed to synthesis until all are present:
- Mode and constraints (including preserve/replace when relevant)
- Audience + primary objective
- Page/content inventory
- Color role mapping
- Typography mapping
- Navigation behavior
- Reference conflict resolution (if applicable)

## Synthesis Gate

Produce a 3-5 sentence design intent statement that resolves:
- Product identity
- Intended feel
- Memorable differentiator
- Core design tension

Only then proceed to implementation direction using `references/prompt-structure.md`.

## Implementation Output Contract

When producing implementation direction, include:

1. System intent summary
2. Tokenized design system:
- colors
- typography
- spacing and sizing
- radii and elevation
- motion/easing
3. Page and component behavior map
4. CTA wiring map (destination/action for each CTA)
5. Responsive behavior contract
6. Interaction-state contract (hover/focus/active/disabled/loading)

## Final Verification Gate (Required)

Before sign-off, verify all of the following:

### Accessibility checks
- Text contrast target met for primary text on primary surfaces.
- Non-text contrast considered for UI controls and focus indicators.
- Keyboard navigation path is defined for key journeys.
- Focus-visible behavior is specified for interactive elements.

### UX heuristic checks (NN/g style)
- Visibility of system status (loading/success/error states)
- Match between system and real-world language
- User control and freedom (clear exit/back/reset patterns)
- Consistency and standards across navigation/components
- Error prevention (guardrails and confirmations where needed)
- Recognition over recall (clear labels, predictable navigation)

### Responsive and interaction checks
- Desktop/tablet/mobile behavior is explicitly defined.
- Critical interactions include all required states.
- No orphan CTA or undefined destination remains.
