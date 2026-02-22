# Scripts Overview

## Required scripts
- `translate.ts`: Translate PatternCraft styles into Satori-compatible styles
- `render-all.ts`: Render thumbnails for CSS and SVG fallback patterns
- `classify.ts`: Feature scanner and preliminary routing
- `update-skill.ts`: Append learned render findings to Section G
- `build-index.ts`: Generate package exports from compatibility manifest
- `validate-manifest.ts`: Schema validation for compatibility.json

## Rules
- All scripts must validate `compatibility.json` before and after writes
- All scripts must exit non-zero on failure
- `--only-changed` must use `scripts/diff-report.json`
- Do not rewrite files when no logical changes exist