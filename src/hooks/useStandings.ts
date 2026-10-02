import { useCallback, useState } from "react"
import { toBattleError, type BattleErrorState } from "../lib/errors"
import { fetchBattleProfile } from "../lib/github"
import {
  MAX_TOURNAMENT_PLAYERS,
  MIN_TOURNAMENT_PLAYERS,
  parsePlayerLogins,
} from "../lib/tournament"

export type StandingsPhase = "setup" | "loading" | "board"

export type StandingEntry = {
  rank: number
  login: string
  name: string
  avatarUrl: string
  powerScore: number
  followers: number
  publicRepos: number
  activityScore: number
  error?: string
}

type StandingsOptions = {
  initialLogins?: string
}

/**
 * Multiplayer mode: score every fighter once and show a standings board.
 * Shares parse/cap rules with tournaments via lib/tournament.
 */
export function useStandings(options?: StandingsOptions) {
  const [phase, setPhase] = useState<StandingsPhase>("setup")
  const [loginsText, setLoginsText] = useState(options?.initialLogins ?? "")
  const [setupError, setSetupError] = useState<string | null>(null)
  const [entries, setEntries] = useState<StandingEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<BattleErrorState | null>(null)

  const loadStandings = useCallback(async (rawLogins: string) => {
    const logins = parsePlayerLogins(rawLogins)
    if (logins.length < MIN_TOURNAMENT_PLAYERS) {
      setSetupError(
        `Enter at least ${MIN_TOURNAMENT_PLAYERS} GitHub usernames.`,
      )
      return
    }
    if (logins.length > MAX_TOURNAMENT_PLAYERS) {
      setSetupError(
        `Standings are capped at ${MAX_TOURNAMENT_PLAYERS} players.`,
      )
      return
    }

    setSetupError(null)
    setPhase("loading")
    setLoading(true)
    setError(null)

    try {
      const settled = await Promise.allSettled(
        logins.map((login) => fetchBattleProfile(login)),
      )

      const ok: StandingEntry[] = []
      const failed: StandingEntry[] = []

      settled.forEach((outcome, index) => {
        const login = logins[index]
        if (outcome.status === "fulfilled") {
          const profile = outcome.value
          ok.push({
            rank: 0,
            login: profile.login,
            name: profile.name,
            avatarUrl: profile.avatarUrl,
            powerScore: profile.powerScore,
            followers: profile.followers,
            publicRepos: profile.publicRepos,
            activityScore: profile.activityScore,
          })
        } else {
          failed.push({
            rank: 0,
            login,
            name: login,
            avatarUrl: "",
            powerScore: 0,
            followers: 0,
            publicRepos: 0,
            activityScore: 0,
            error:
              outcome.reason instanceof Error
                ? outcome.reason.message
                : "Could not load profile",
          })
        }
      })

      ok.sort((a, b) => {
        if (b.powerScore !== a.powerScore) return b.powerScore - a.powerScore
        if (b.followers !== a.followers) return b.followers - a.followers
        return a.login.localeCompare(b.login)
      })

      const ranked: StandingEntry[] = [
        ...ok.map((entry, index) => ({ ...entry, rank: index + 1 })),
        ...failed.map((entry, index) => ({
          ...entry,
          rank: ok.length + index + 1,
        })),
      ]

      setEntries(ranked)
      setPhase("board")
    } catch (boardError) {
      setError(toBattleError(boardError))
      setPhase("setup")
    } finally {
      setLoading(false)
    }
  }, [])

  const resetToSetup = useCallback(() => {
    setPhase("setup")
    setEntries([])
    setSetupError(null)
    setError(null)
  }, [])

  return {
    phase,
    loginsText,
    setLoginsText,
    setupError,
    entries,
    loading,
    error,
    loadStandings,
    resetToSetup,
  }
}
