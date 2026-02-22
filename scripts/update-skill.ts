import fs from "node:fs"
import path from "node:path"
import { readManifest } from "./utils/manifest"

interface LearnedEntry {
  date: string
  runId: string
  finding: string
  action: string
  affectedPatternIds: string[]
  overridesRule: string | null
}

const SKILL_PATH = path.join(process.cwd(), ".babs-memo", "skills", "pattern-conversion", "SKILL.md")
const START = "<!-- LEARNED_PATTERNS_START -->"
const END = "<!-- LEARNED_PATTERNS_END -->"

function normalizeKey(entry: Pick<LearnedEntry, "finding" | "action" | "overridesRule">): string {
  return `${entry.finding.trim().toLowerCase()}|${entry.action.trim().toLowerCase()}|${
    entry.overridesRule ?? "null"
  }`
}

function parseExistingEntries(skillText: string): LearnedEntry[] {
  const startIdx = skillText.indexOf(START)
  const endIdx = skillText.indexOf(END)
  if (startIdx < 0 || endIdx < 0 || endIdx <= startIdx) return []

  const section = skillText.slice(startIdx, endIdx)
  const entries: LearnedEntry[] = []

  const regex = /```json\s*([\s\S]*?)```/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(section))) {
    try {
      const parsed = JSON.parse(match[1]) as LearnedEntry
      if (parsed.finding && parsed.action) entries.push(parsed)
    } catch {
      // ignore malformed old entry blocks
    }
  }
  return entries
}

function buildCandidateEntries(): LearnedEntry[] {
  const manifest = readManifest()
  const runId = process.env.GIT_COMMIT_SHA || "unknown-run"
  const today = new Date().toISOString().slice(0, 10)

  const failed = manifest.patterns.filter((p) => p.status === "FAIL" || p.status === "SILENT_FAIL")
  if (!failed.length) return []

  // Group by a simple signature from status + top feature + note
  const groups = new Map<string, typeof failed>()
  for (const p of failed) {
    const topFeature = p.features[0] ?? "unknown"
    const signature = `${p.status}|${topFeature}`
    if (!groups.has(signature)) groups.set(signature, [])
    groups.get(signature)!.push(p)
  }

  const entries: LearnedEntry[] = []
  for (const [signature, group] of groups) {
    const [status, feature] = signature.split("|")
    const ids = group.map((g) => g.id)

    const finding =
      status === "SILENT_FAIL"
        ? `Patterns with feature ${feature} produced silent-fail outputs in current render batch`
        : `Patterns with feature ${feature} threw render pipeline errors in current render batch`

    const action =
      status === "SILENT_FAIL"
        ? `Flag ${feature} patterns for stricter silent-fail variance checks and manual review`
        : `Capture and classify ${feature} render errors earlier; consider fallback or skip rule if repeated`

    entries.push({
      date: today,
      runId,
      finding,
      action,
      affectedPatternIds: ids,
      overridesRule: "D"
    })
  }

  return entries
}

function appendEntries(skillText: string, newEntries: LearnedEntry[]): string {
  const endIdx = skillText.indexOf(END)
  if (endIdx < 0) throw new Error("LEARNED_PATTERNS_END marker not found")

  const blocks = newEntries
    .map((entry) => `\n\`\`\`json\n${JSON.stringify(entry, null, 2)}\n\`\`\`\n`)
    .join("")

  return skillText.slice(0, endIdx) + blocks + skillText.slice(endIdx)
}

function main(): void {
  const skillText = fs.readFileSync(SKILL_PATH, "utf8")
  const existing = parseExistingEntries(skillText)
  const existingKeys = new Set(existing.map((e) => normalizeKey(e)))

  const candidates = buildCandidateEntries()
  const unique = candidates.filter((c) => !existingKeys.has(normalizeKey(c)))

  if (!unique.length) {
    console.log("[update-skill] No new learned patterns to append.")
    return
  }

  const updated = appendEntries(skillText, unique)
  fs.writeFileSync(SKILL_PATH, updated, "utf8")

  console.log(`[update-skill] Appended ${unique.length} learned pattern entr${unique.length === 1 ? "y" : "ies"}.`)
}

main()