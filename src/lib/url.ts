export type BattleUrlPair = {
  left: string
  right: string
}

const clampLogin = (value: string | null): string | null => {
  if (!value) return null
  const cleaned = value.trim().replace(/^@/, "").replace(/\s+/g, "")
  return cleaned.length > 0 ? cleaned : null
}

export const readBattleFromUrl = (): BattleUrlPair | null => {
  if (typeof window === "undefined") return null

  const params = new URLSearchParams(window.location.search)
  const left = clampLogin(params.get("a"))
  const right = clampLogin(params.get("b"))

  if (!left || !right) return null
  return { left, right }
}

export const writeBattleToUrl = (left: string, right: string): void => {
  const url = buildBattleUrl(left, right)
  if (!url || typeof window === "undefined") return
  window.history.replaceState(null, "", url)
}

/** Absolute shareable URL for a matchup, e.g. `…/?a=torvalds&b=dan-abramov`. */
export const buildBattleUrl = (left: string, right: string): string => {
  if (typeof window === "undefined") return ""
  const url = new URL(window.location.href)
  url.search = ""
  url.hash = ""
  url.searchParams.set("a", left.trim())
  url.searchParams.set("b", right.trim())
  return url.toString()
}
