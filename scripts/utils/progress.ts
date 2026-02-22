import fs from "node:fs"
import path from "node:path"

type ProgressStatus = "todo" | "in_progress" | "done" | "blocked"

interface ProgressItem {
  id: string
  status: ProgressStatus
  filesTouched: string[]
  commandsRun: string[]
  artifactOutputs: string[]
  notes: string[]
  updatedAt: string | null
}

interface ProgressFile {
  version: string
  updatedAt: string
  items: ProgressItem[]
}

const FILE_PATH = path.join(process.cwd(), "scripts", "progress.json")

export function updateProgress(
  id: string,
  patch: Partial<Omit<ProgressItem, "id">>
): void {
  const raw = fs.readFileSync(FILE_PATH, "utf8")
  const data = JSON.parse(raw) as ProgressFile

  const item = data.items.find((x) => x.id === id)
  if (!item) {
    throw new Error(`progress item not found: ${id}`)
  }

  if (patch.status) item.status = patch.status
  if (patch.filesTouched) item.filesTouched = [...new Set(patch.filesTouched)]
  if (patch.commandsRun) item.commandsRun = [...new Set(patch.commandsRun)]
  if (patch.artifactOutputs) item.artifactOutputs = [...new Set(patch.artifactOutputs)]
  if (patch.notes) item.notes = [...new Set(patch.notes)]

  item.updatedAt = new Date().toISOString()
  data.updatedAt = item.updatedAt

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2) + "\n", "utf8")
}