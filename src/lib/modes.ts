/** Game modes for Commit Battle Analyzer. */

export type AppMode = "duel" | "tournament" | "standings" | "boss"

export const APP_MODES: readonly AppMode[] = [
  "duel",
  "tournament",
  "standings",
  "boss",
] as const

export const MODE_LABELS: Record<AppMode, string> = {
  duel: "Duel",
  tournament: "Tournament",
  standings: "Standings",
  boss: "Boss",
}

export const MODE_STORAGE_KEY = "cba:mode"

const isAppMode = (value: string | null): value is AppMode =>
  value === "duel" ||
  value === "tournament" ||
  value === "standings" ||
  value === "boss"

/** Read `?mode=` (and sessionStorage fallback). Defaults to duel. */
export const readModeFromUrl = (): AppMode => {
  if (typeof window === "undefined") return "duel"

  const fromUrl = new URLSearchParams(window.location.search).get("mode")
  if (isAppMode(fromUrl)) return fromUrl

  try {
    const stored = window.sessionStorage.getItem(MODE_STORAGE_KEY)
    if (isAppMode(stored)) return stored
  } catch {
    // sessionStorage may be blocked
  }

  return "duel"
}

/** Keep mode in the URL + sessionStorage so refresh / share stays on the mode. */
export const writeModeToUrl = (mode: AppMode, players?: string[]): void => {
  if (typeof window === "undefined") return

  try {
    window.sessionStorage.setItem(MODE_STORAGE_KEY, mode)
  } catch {
    // ignore
  }

  const url = new URL(window.location.href)
  url.hash = ""

  if (mode === "duel") {
    url.searchParams.delete("mode")
    url.searchParams.delete("players")
  } else {
    url.searchParams.set("mode", mode)
    url.searchParams.delete("a")
    url.searchParams.delete("b")
    url.searchParams.delete("week")

    const list = players?.map((p) => p.trim()).filter(Boolean) ?? []
    if (list.length > 0) {
      url.searchParams.set("players", list.join(","))
    } else {
      url.searchParams.delete("players")
    }
  }

  window.history.replaceState(null, "", url.toString())
}

/** Prefill lineup from `?players=` when present. */
export const readPlayersFromUrl = (): string => {
  if (typeof window === "undefined") return ""
  return new URLSearchParams(window.location.search).get("players") ?? ""
}
