# COMMANDS.md

Single reference for all commands. Run from the repo root unless noted otherwise.

---

## First time setup

```bash
npm install
cd apps/browser && npm install && cd ../..
cd apps/review && npm install && cd ../..
```

---

## Running the apps

```bash
# Public catalogue (Vercel app, runs on port 3000):
npm run dev:browser
# → http://localhost:3000

# Review tool (local only, runs on port 3001):
npm run dev:review
# → http://localhost:3001
# Note: run dev:browser first so thumbnails are available at localhost:3000/thumbnails
```

---

## Full pipeline (from scratch)

```bash
npm run pipeline:full
# Runs: init → translate → render → fallbacks → patch → score → review-queue → build:index
```

---

## Individual pipeline steps

```bash
npm run pipeline:init            # Re-initialize manifest from upstream patterns
npm run pipeline:translate       # CSS → satoriStyle translation
npm run pipeline:render          # Satori render + thumbnail generation + SILENT_FAIL detection
npm run pipeline:add-fallbacks   # Register SVG fallback patterns in manifest
npm run pipeline:render-fallbacks  # Render SVG fallback thumbnails
npm run pipeline:patch-silent-fails  # Recovery only — fixes missed SILENT_FAIL from old runs
npm run pipeline:score-social    # Auto-score suitableForSocialBg (narrowing review queue)
npm run pipeline:review-queue    # Generate scripts/review-queue.txt
npm run build:index              # Build packages/satori-patterns/src/index.ts from approved.json
npm run skill:update             # Append learned patterns to skill file Section G
```

---

## Incremental pipeline (after upstream changes or reconversion)

```bash
npm run pipeline:diff-upstream
npm run pipeline:translate -- --only-changed
npm run pipeline:render -- --only-changed
npm run build:index
```

---

## Validation and testing

```bash
npm run validate:manifest        # Validate compatibility.json against schema
npm run typecheck                # TypeScript check on the package
npm run test:css-parser          # CSS parser unit tests
cd apps/browser && npm run build  # Build the public app (catches Vercel build issues)
```

---

## NPM package publishing

```bash
cd packages/satori-patterns && npm pack --dry-run   # Preview what will ship
npm login                                            # Login to npm registry
cd packages/satori-patterns && npm publish --access public
cd packages/satori-patterns && npm version patch    # Bump patch version (then republish)
cd packages/satori-patterns && npm version minor    # Bump minor version
```

---

## Committing thumbnails (required for Vercel deploy)

```bash
git add apps/browser/public/thumbnails/
git commit -m "chore: commit generated thumbnails for Vercel deploy"
git push
# Vercel will redeploy automatically
```

---

## Vercel deployment

```bash
cd apps/browser && npx vercel                       # Deploy browser app to Vercel
# Or: connect repo to Vercel, set root directory to apps/browser
```

---

## Upstream sync (check for new patterns from PatternCraft)

```bash
npm run pipeline:diff-upstream   # outputs diff-report.json
# If new patterns found, run:
npm run pipeline:translate -- --only-changed
npm run pipeline:render -- --only-changed
npm run build:index
```

---

## Approval workflow summary

```
1. Run: npm run dev:browser  (port 3000 — serves thumbnails)
2. Run: npm run dev:review   (port 3001 — the approval tool)
3. Open http://localhost:3001 and work through the Pending tab
4. Approve good patterns, Reject bad ones, Reconvert visually wrong ones
5. For reconversions: click "Run Reconversion" in the tool
   (or: npm run pipeline:render -- --only-changed)
6. When happy: commit data/approved.json
7. Push to main — Vercel redeploys automatically from approved.json
8. When enough patterns approved for a release:
   npm version + npm publish from packages/satori-patterns/
```
