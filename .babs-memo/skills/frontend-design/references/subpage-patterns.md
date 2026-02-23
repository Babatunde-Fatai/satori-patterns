# Subpage Patterns and Data Structures

Common subpage templates with layout patterns and data architecture. Each pattern includes the data file structure (how content is stored and updated) alongside the layout brief.

---

## Pattern 01: Blog / Writing Page

**When to use:** Any page displaying posts from one or multiple platforms.

### Data Structure
Store in `/data/blog.ts`. One object per post. Adding a post = adding one object.

```typescript
export type Platform = "Substack" | "LinkedIn" | "X" | "Dev.to" | "Medium" | "Other";

export interface BlogPost {
  id: string;           // unique slug
  title: string;
  excerpt: string;      // 1-2 sentences
  date: string;         // "YYYY-MM-DD"
  readTime: string;     // "5 min read"
  category: string;     // "AI" | "Design" | custom
  platform: Platform;   // where it was published
  url: string;          // REQUIRED: external URL, clicking leads here
  image?: string;       // path to /public/blog/ or external URL
  featured?: boolean;   // larger card at top
}
```

### Layout Pattern
- Hero: page title + subtext
- Platform filter bar (client-side, no reload)
- Featured post: full-width card if featured: true
- Post grid: 3-column desktop, 2 tablet, 1 mobile
- Each card: image, platform badge, category tag, title, excerpt, date + read time
- Clicking card opens url in new tab
- Footer: newsletter embed

### Key Rules
- url field is required on every post — never hardcode destinations
- Platform badge uses a consistent color per platform (define in design system)
- If no image: use a dark surface with decorative typographic element

---

## Pattern 02: Podcast Page

**When to use:** Any page displaying podcast episodes linked to YouTube or audio platforms.

### Data Structure
Store in `/data/podcast.ts`. One object per episode.

```typescript
export interface Episode {
  id: string;             // "ep-13"
  episodeNumber: number;
  title: string;
  guest: string;          // "with [Name]"
  description: string;
  date: string;
  youtubeVideoId: string; // the part after ?v= in YouTube URL
  youtubeUrl: string;     // full URL for "Watch on YouTube" button
  spotifyUrl?: string;
  applePodcastsUrl?: string;
  thumbnailUrl?: string;  // if empty, auto-generate: 
                          // https://img.youtube.com/vi/{videoId}/maxresdefault.jpg
  featured?: boolean;     // one episode at a time
  tags?: string[];
}
```

### Layout Pattern
- Hero: podcast name, tagline, platform badges linking to listen-on destinations
- Featured episode: 2-column (video left, info right). Click thumbnail plays inline YouTube embed
- Episode grid: thumbnail with episode number overlaid, title, guest, date
- Clicking episode card opens youtubeUrl in new tab
- Tag filter bar

### Key Rules
- Inline play: on thumbnail click, replace image with `<iframe src="youtube.com/embed/{id}?autoplay=1">`
- "Watch on YouTube" button always opens external new tab
- Thumbnail auto-generation from videoId removes need for manual image uploads

---

## Pattern 03: Projects Index Page

**When to use:** A gallery/portfolio page showing multiple projects.

### Data Structure
One file per project in `/data/projects/`. An index file controls order and featured status.

```typescript
// /data/projects/types.ts
export interface Project {
  id: string;                // matches file name and URL slug
  title: string;
  shortTitle: string;        // for cards
  tagline: string;           // one line for card subtext
  category: string[];        // ["INNOVATION", "TELCO"]
  year: string;              // "2022 – Present"
  featured: boolean;         // pinned to top of index + appears on homepage
  featuredOrder?: number;    // 1, 2, 3 for homepage ordering
  coverImage: string;
  heroImage?: string;
  color?: string;            // card background color
  challenge: string;
  role: string;
  outcome: string;
  body?: string;             // longer narrative
  gallery?: { src: string; alt: string; caption?: string }[];
  externalUrl?: string;
  externalLabel?: string;
}
```

```typescript
// /data/projects/index.ts
export const featuredProjects = allProjects
  .filter(p => p.featured)
  .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

export const remainingProjects = allProjects
  .filter(p => !p.featured)
  .sort((a, b) => b.year.localeCompare(a.year));
```

### Layout Pattern
- Hero: page title + subtext
- Featured projects: large hero card (first) + 2-column grid (remaining featured)
- Divider with "MORE WORK" label
- Remaining projects: 3-column grid, smaller cards
- Each card links to `/projects/{id}`

### Adding a New Project
1. Create `/data/projects/newproject.ts` using the Project interface
2. Import and add to `allProjects` in `/data/projects/index.ts`
3. Set `featured: true` if it should appear on homepage
4. Done. No other files change.

---

## Pattern 04: Project Subpage

**When to use:** Individual project detail pages, generated dynamically from project data files.

### Layout Pattern
- Hero: full-bleed image with dark gradient overlay, title and category tags overlaid
- Overview strip: 3 columns (Challenge, My Role, Outcome) — first sentence each with expand
- Body: long-form narrative in 3 sections (Challenge, Role, Outcome) + optional extended body
- Gallery: masonry or even grid with lightbox on click
- External link section: if externalUrl exists
- Next Project: full-width teaser linking to next project (loop)
- Back link: "← All Projects" top-left

---

## Pattern 05: Speaking and Media Page

**When to use:** Any page curating speaking engagements, media appearances, and press mentions.

### Data Structure
Store in `/data/speaking.ts`. Flexible fields — use only what exists for each entry.

```typescript
export type SpeakingType = "speaking" | "media" | "press";

export interface SpeakingEntry {
  id: string;
  type: SpeakingType;
  title: string;
  organization: string;
  role?: string;            // "Panelist" | "Speaker" | "Judge" | "Interviewee"
  date: string;
  location?: string;
  shortDescription: string;
  videoUrl?: string;
  videoId?: string;         // YouTube video ID for inline embed
  images?: string[];
  coverImage?: string;
  externalUrl?: string;     // REQUIRED if there is somewhere to send people
  externalLabel?: string;   // "Watch Recording" | "Read Article" | "View Event"
  publication?: string;     // for press entries
  publicationLogo?: string;
  featured?: boolean;
}
```

### Layout Pattern
- Hero: large quote + booking CTA
- Tab navigation: Speaking | Media | Press (client-side filter)
- Entry grid: 3-column. Featured entry full-width if present.
- Each card: cover image (or decorative fallback), type badge, title, org, role, date
- Clicking card: opens modal with full detail, video embed if available, external link button
- Bottom CTA: booking prompt

### Fallback for missing media
If no coverImage and no videoId: dark surface with first letter of title as large decorative element in accent color at 30% opacity.

---

## Pattern 06: Contact Page

**When to use:** Any contact or booking page.

### Layout Pattern
- Intro: short message (2-3 sentences) before any embed
- cal.com embed: inline calendar (not a button — the full calendar embedded on page)
- Alternative contact options: email (mailto), LinkedIn (external link), location (static)
- Social icons row at bottom

### cal.com Inline Embed (React/Next.js)
```tsx
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export function InlineCalendar() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  return (
    <Cal
      namespace="30min"
      calLink="[USERNAME]/30min"
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
    />
  );
}
```

### cal.com Button Trigger (for nav and other pages)
```tsx
import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export function BookingButton({ label = "Book a Call", className }) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  return (
    <button
      data-cal-namespace="30min"
      data-cal-link="[USERNAME]/30min"
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
      className={className}
    >
      {label}
    </button>
  );
}
```

---

## Common Integration Snippets

### Substack Newsletter Embed
```tsx
<iframe
  src="https://[PUBLICATION].substack.com/embed"
  width="480"
  height="150"
  style={{ border: "1px solid #EEE", background: "white" }}
  frameBorder="0"
  scrolling="no"
/>
```

### YouTube Thumbnail Auto-generation
```
https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg
```

### YouTube Inline Player
```tsx
<iframe
  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
  allow="autoplay; fullscreen"
  allowFullScreen
  style={{ width: "100%", aspectRatio: "16/9" }}
/>
```