import {
  getCurrentWeeklyMatchup,
  getWeeklyMatchupForWeekId,
  parseWeekId,
} from "./weekly"

export type BattleUrlPair = {
  left: string
  right: string
  weekId?: string
}

export type BattleUrlTarget = {
  left: string
  right: string
  weekId?: string | null
}

const clampLogin = (value: string | null): string | null => {
  if (!value) return null
  const cleaned = value.trim().replace(/^@/, "").replace(/\s+/g, "")
  return cleaned.length > 0 ? cleaned : null
}

/** Read matchup from `?a=&b=` or weekly `?week=`. Weekly wins when present. */
export const readBattleFromUrl = (): BattleUrlPair | null => {
  if (typeof window === "undefined") return null

  const params = new URLSearchParams(window.location.search)
  const weekRaw = params.get("week")
  const weekInfo = parseWeekId(weekRaw)

  if (weekInfo) {
    const weekly = getWeeklyMatchupForWeekId(weekInfo.id)
    if (weekly) {
      return { left: weekly.left, right: weekly.right, weekId: weekly.weekId }
    }
  }

  // ?week with no/invalid value → treat as this week
  if (weekRaw !== null && weekRaw.trim() !== "") {
    const weekly = getCurrentWeeklyMatchup()
    return { left: weekly.left, right: weekly.right, weekId: weekly.weekId }
  }

  const left = clampLogin(params.get("a"))
  const right = clampLogin(params.get("b"))
  if (!left || !right) return null
  return { left, right }
}

export const writeBattleToUrl = (target: BattleUrlTarget): void => {
  const url = buildBattleUrl(target)
  if (!url || typeof window === "undefined") return
  window.history.replaceState(null, "", url)
}

/**
 * Shareable URL.
 * Weekly battles use `?week=2026-W40`; normal matchups use `?a=&b=`.
 */
export const buildBattleUrl = (target: BattleUrlTarget): string => {
  if (typeof window === "undefined") return ""

  const url = new URL(window.location.href)
  url.search = ""
  url.hash = ""

  if (target.weekId) {
    url.searchParams.set("week", target.weekId)
    return url.toString()
  }

  url.searchParams.set("a", target.left.trim())
  url.searchParams.set("b", target.right.trim())
  return url.toString()
}

export const getCanonicalOrigin = (): string => {
  const fromEnv = import.meta.env.VITE_SITE_URL
  if (typeof fromEnv === "string" && fromEnv.trim().length > 0) {
    return fromEnv.trim().replace(/\/$/, "")
  }
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  return ""
}
