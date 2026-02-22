import { describe, it, expect } from "vitest"
import { splitAtDepthZero, normalizeLayerValues, CssParseError } from "./cssParser"

describe("splitAtDepthZero", () => {
  it("splits a 3-layer backgroundImage with comma-heavy radial gradients", () => {
    const input = [
      "radial-gradient(circle at 20% 50%, rgba(120, 0, 255, 0.3), transparent 50%)",
      "radial-gradient(circle at 80% 50%, rgba(0, 200, 255, 0.3), transparent 50%)",
      "radial-gradient(circle at 50% 80%, rgba(255, 100, 0, 0.2), transparent 60%)",
    ].join(", ")

    const result = splitAtDepthZero(input)
    expect(result).toHaveLength(3)
    expect(result[0]).toContain("radial-gradient")
    expect(result[1]).toContain("80% 50%")
    expect(result[2]).toContain("60%)")
  })

  it("splits repeating-linear-gradient with calc() in size", () => {
    const input =
      "repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent calc(50% - 1px))"
    const result = splitAtDepthZero(input)
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(input)
  })

  it("splits a 4+ layer pattern with backgroundPosition", () => {
    const input = "0 0, 25px 25px, 50px 0, 0 50px"
    const result = splitAtDepthZero(input)
    expect(result).toEqual(["0 0", "25px 25px", "50px 0", "0 50px"])
  })

  it("handles nested functions with spaces", () => {
    const input =
      "linear-gradient(to right, rgb(255, 0, 0), rgb(0, 255, 0)), radial-gradient(circle, hsl(200, 100%, 50%), transparent)"
    const result = splitAtDepthZero(input)
    expect(result).toHaveLength(2)
    expect(result[0]).toContain("rgb(255, 0, 0)")
    expect(result[1]).toContain("hsl(200, 100%, 50%)")
  })

  it("guards against malformed input: unbalanced open parens", () => {
    expect(() => splitAtDepthZero("linear-gradient(to right, red")).toThrow(CssParseError)
    expect(() => splitAtDepthZero("linear-gradient(to right, red")).toThrow(
      /unbalanced parentheses/
    )
  })

  it("guards against malformed input: unbalanced close parens", () => {
    expect(() => splitAtDepthZero("gradient) red")).toThrow(CssParseError)
    expect(() => splitAtDepthZero("gradient) red")).toThrow(/negative depth/)
  })

  it("handles empty and whitespace-only input", () => {
    expect(splitAtDepthZero("")).toEqual([])
    expect(splitAtDepthZero("   ")).toEqual([])
    expect(splitAtDepthZero(null as unknown as string)).toEqual([])
  })

  it("handles single value with no commas", () => {
    expect(splitAtDepthZero("linear-gradient(to right, red, blue)")).toEqual([
      "linear-gradient(to right, red, blue)",
    ])
  })
})

describe("normalizeLayerValues", () => {
  it("replicates a single value across all image layers", () => {
    const result = normalizeLayerValues(["a", "b", "c"], ["50px 50px"])
    expect(result.values).toEqual(["50px 50px", "50px 50px", "50px 50px"])
    expect(result.normalized).toBe(true)
  })

  it("returns unchanged when counts match", () => {
    const result = normalizeLayerValues(["a", "b"], ["10px", "20px"])
    expect(result.values).toEqual(["10px", "20px"])
    expect(result.normalized).toBe(false)
  })

  it("repeats last value when fewer than image layers", () => {
    const result = normalizeLayerValues(["a", "b", "c"], ["10px", "20px"])
    expect(result.values).toEqual(["10px", "20px", "20px"])
    expect(result.normalized).toBe(true)
  })

  it("truncates when more values than image layers", () => {
    const result = normalizeLayerValues(["a"], ["10px", "20px", "30px"])
    expect(result.values).toEqual(["10px"])
    expect(result.normalized).toBe(true)
  })

  it("returns auto-filled array when no raw values provided", () => {
    const result = normalizeLayerValues(["a", "b"], [])
    expect(result.values).toEqual(["auto", "auto"])
    expect(result.normalized).toBe(true)
  })
})
