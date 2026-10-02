import { useCallback, useMemo, useState } from "react"
import { runBattle } from "../lib/battle"
import { toBattleError, type BattleErrorState } from "../lib/errors"
import {
  applyMatchResult,
  buildTournament,
  findPlayableMatch,
  isTournamentComplete,
  MAX_TOURNAMENT_PLAYERS,
  MIN_TOURNAMENT_PLAYERS,
  parsePlayerLogins,
  resolveTournamentWinner,
  type PlayableMatch,
  type TournamentState,
} from "../lib/tournament"
import type { BattleResult } from "../lib/types"

export type TournamentPhase = "setup" | "preview" | "result" | "champion"

type TournamentOptions = {
  /** Prefill setup text (e.g. from `?players=`). */
  initialLogins?: string
}

export function useTournament(options?: TournamentOptions) {
  const [phase, setPhase] = useState<TournamentPhase>("setup")
  const [loginsText, setLoginsText] = useState(options?.initialLogins ?? "")
  const [bracketSize, setBracketSize] = useState(8)
  const [setupError, setSetupError] = useState<string | null>(null)
  const [tournament, setTournament] = useState<TournamentState | null>(null)
  const [currentMatch, setCurrentMatch] = useState<PlayableMatch | null>(null)
  const [lastResult, setLastResult] = useState<BattleResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<BattleErrorState | null>(null)

  const playable = useMemo(
    () => (tournament ? findPlayableMatch(tournament) : null),
    [tournament],
  )

  const startTournament = useCallback((rawLogins: string, size: number) => {
    const logins = parsePlayerLogins(rawLogins)
    if (logins.length < MIN_TOURNAMENT_PLAYERS) {
      setSetupError(`Enter at least ${MIN_TOURNAMENT_PLAYERS} GitHub usernames.`)
      return
    }
    if (logins.length > MAX_TOURNAMENT_PLAYERS) {
      setSetupError(`Tournaments are capped at ${MAX_TOURNAMENT_PLAYERS} players.`)
      return
    }

    const nextSize = Math.min(
      MAX_TOURNAMENT_PLAYERS,
      Math.max(MIN_TOURNAMENT_PLAYERS, size),
    )
    if (logins.length > nextSize) {
      setSetupError(
        `You entered ${logins.length} players — pick a larger bracket or remove some.`,
      )
      return
    }

    const state = buildTournament(logins, nextSize)
    setSetupError(null)
    setTournament(state)
    setLastResult(null)
    setError(null)
    setPhase("preview")
    setCurrentMatch(findPlayableMatch(state))
  }, [])

  const playCurrentMatch = useCallback(async () => {
    if (!tournament || !currentMatch || loading) return

    setLoading(true)
    setError(null)

    try {
      const result = await runBattle(currentMatch.left, currentMatch.right)
      const winnerLogin = resolveTournamentWinner(result.left, result.right)
      const next = applyMatchResult(
        tournament,
        currentMatch.id,
        winnerLogin,
        result.left,
        result.right,
      )

      setTournament(next)
      setLastResult(result)
      setCurrentMatch(findPlayableMatch(next))
      setPhase("result")
    } catch (battleError) {
      setError(toBattleError(battleError))
    } finally {
      setLoading(false)
    }
  }, [tournament, currentMatch, loading])

  const continueAfterResult = useCallback(() => {
    if (!tournament) return

    if (isTournamentComplete(tournament)) {
      setPhase("champion")
      setLastResult(null)
      setCurrentMatch(null)
      return
    }

    const next = findPlayableMatch(tournament)
    if (!next) {
      setPhase("champion")
      setCurrentMatch(null)
      setLastResult(null)
      return
    }

    setCurrentMatch(next)
    setLastResult(null)
    setPhase("preview")
  }, [tournament])

  const retryMatch = useCallback(() => {
    void playCurrentMatch()
  }, [playCurrentMatch])

  const resetToSetup = useCallback(() => {
    setPhase("setup")
    setTournament(null)
    setCurrentMatch(null)
    setLastResult(null)
    setError(null)
    setSetupError(null)
    setLoading(false)
  }, [])

  return {
    phase,
    loginsText,
    setLoginsText,
    bracketSize,
    setBracketSize,
    setupError,
    tournament,
    currentMatch,
    lastResult,
    loading,
    error,
    playable,
    startTournament,
    playCurrentMatch,
    continueAfterResult,
    retryMatch,
    resetToSetup,
  }
}
