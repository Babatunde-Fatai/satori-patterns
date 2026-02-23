# Design Prompt Structure Template

Use this template when generating the full design prompt. Every section is required. Fill each with content specific to the user — never use generic placeholders.

---

# [BRAND NAME] — Website Design & Development Prompt

**For use with:** Figma Make, v0.dev, Framer AI, or as a developer handoff brief
**Built with:** [TECH STACK — e.g., Next.js App Router, Tailwind CSS]

---

## 01. DESIGN PHILOSOPHY

[3-5 sentences. Answer: What is this platform? What should it feel like? What is the single unforgettable thing about it? What design tension does it hold?

Example: "This is not a portfolio. It is a manifesto in motion. The website should feel like walking into the future of Africa — bold, intentional, precise. It should carry the weight of someone who builds things, leads things, and thinks ten years ahead. The single thing a visitor should remember: 'This is someone who is shaping what comes next.'"]

---

## 02. BRAND IDENTITY

### Color Palette

| Role | Name | Hex |
|---|---|---|
| Background (dominant) | [NAME] | `#XXXXXX` |
| Primary Accent | [NAME] | `#XXXXXX` |
| Secondary Surface | [NAME] | `#XXXXXX` |
| Tertiary / Warmth | [NAME] | `#XXXXXX` |
| Text (primary) | [NAME] | `#XXXXXX` |
| Text (muted) | [NAME] | `#XXXXXX` |

**Palette logic:** [Explain the role of each color and how they interact. Which is dominant? Where does the accent appear? Which color provides warmth vs. coolness?]

### Typography

**Display / Headlines:** [Font name] ([Weight]) — [brief description of use]
**Body / UI Labels:** [Font name] ([Weight]) — [brief description of use]
**Accent (optional):** [Font name] [Style] — [where it appears]

**Type scale:**
- Hero headline: [size], [tracking]
- Section heading: [size]
- Subheading / card title: [size]
- Body: [size], [line-height]
- Label / caption: [size], [case], [tracking]

---

## 03. DESIGN SYSTEM PRINCIPLES

[6 to 8 specific, actionable rules. Not vague aesthetics — concrete decisions.]

Example rules:
- Dark base, light moments: [specify which sections break to light and why]
- Accent as punctuation: [specify exactly where the accent color appears and where it does not]
- Typography architecture: [how headlines interact with layout — overlap, bleed, scale]
- Spacing rhythm: [minimum section padding, card padding, etc.]
- Photography treatment: [how images are treated, cropped, overlaid]
- Texture and atmosphere: [grain overlay, gradients, shadows]
- Motion philosophy: [what animates, what does not]
- Mobile-first rule: [specific mobile consideration for this design]

---

## 04. NAVIGATION

**Style:** [Sticky / Fixed / Scroll-away] — [background behavior on scroll]
**Logo (left):** [description of logo treatment, font, size, any signature mark]
**Links (right):** [font, size, spacing, active state, hover state]
**Mobile:** [hamburger behavior, overlay style, animation]

---

## 05. PAGE-BY-PAGE DESIGN BRIEF

### PAGE: HOME

#### [Section Name] (e.g., Hero)
**Layout:** [describe the layout grid and composition]
**[Left/Right/Top] side:** [content description with actual copy direction]
**CTAs:** [primary and secondary, with label text and destinations]
**Background:** [color and any texture/treatment]
**Micro-details:** [any small but important design moments]

[Repeat for each section on the home page]

#### [Next Section]
...

### PAGE: [PAGE NAME]
[Same structure for each page]

---

## 06. INTERACTION AND ANIMATION PRINCIPLES

- **Page load:** [describe entrance animation, timing, easing]
- **Scroll reveals:** [describe scroll-triggered animations]
- **Hover states:** [for cards, buttons, links — be specific]
- **CTA buttons:** [hover behavior for filled and ghost buttons]
- **Navigation:** [hover and active animations]
- **Image treatment:** [any parallax or scale effects]
- **What NOT to animate:** [explicit list of things that should stay static]

---

## 07. RESPONSIVE BEHAVIOR

- **Desktop ([breakpoint]+):** [full layout description]
- **Tablet ([range]):** [how grids and layouts adapt]
- **Mobile (< [breakpoint]):** [specific mobile treatments, font size changes, stacked layouts]

---

## 08. TECHNICAL NOTES

[Stack-specific implementation details]

For Next.js projects include:
- Router version (App Router vs Pages Router)
- Font loading strategy (next/font/google vs localFont)
- Image handling (next/image, priority flags)
- Data fetching patterns (ISR, SSG, SSR) per page
- External integrations (APIs, embeds, third-party tools)
- Analytics recommendation
- SEO (next/metadata, OpenGraph, structured data)
- Deployment recommendation

---

## 09. COPY VOICE AND TONE GUIDE

**Personality:** [3 adjectives]
**Rules:**
- [Specific rule about sentence length or structure]
- [Specific rule about person/voice]
- [Specific rule about how the brand/person talks about their work]
- [Specific rule about how they talk about their audience or context]
- [CTA philosophy: what CTAs sound like]
**Words to use:** [3-5 specific words or phrases that belong in this voice]
**Words to avoid:** [3-5 specific words or phrases that feel wrong for this brand]

---

## 10. SITEMAP

```
/                    → Home
/about               → About
/[page]              → [description]
...
```

---

*Prompt generated for [BRAND NAME] · [URL] · [DATE]*