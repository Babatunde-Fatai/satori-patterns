export class CssParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CssParseError"
  }
}

export function splitAtDepthZero(input: string): string[] {
  const str = (input ?? "").trim()
  if (!str) return []

  const parts: string[] = []
  let current = ""
  let depth = 0

  for (const ch of str) {
    if (ch === "(") depth++
    else if (ch === ")") depth--

    if (depth < 0) {
      throw new CssParseError("parse-error: negative depth while splitting")
    }

    if (ch === "," && depth === 0) {
      if (current.trim()) parts.push(current.trim())
      current = ""
      continue
    }

    current += ch
  }

  if (depth !== 0) {
    throw new CssParseError("parse-error: unbalanced parentheses while splitting")
  }

  if (current.trim()) parts.push(current.trim())
  return parts
}

export function normalizeLayerValues(
  imageLayers: string[],
  rawValues: string[]
): { values: string[]; normalized: boolean } {
  const target = imageLayers.length
  if (target === 0) return { values: [], normalized: false }

  if (rawValues.length === 0) {
    return { values: Array.from({ length: target }, () => "auto"), normalized: true }
  }

  if (rawValues.length === target) {
    return { values: rawValues, normalized: false }
  }

  if (rawValues.length === 1) {
    return { values: Array.from({ length: target }, () => rawValues[0]), normalized: true }
  }

  if (rawValues.length < target) {
    const out = [...rawValues]
    const last = rawValues[rawValues.length - 1]
    while (out.length < target) out.push(last)
    return { values: out, normalized: true }
  }

  return { values: rawValues.slice(0, target), normalized: true }
}