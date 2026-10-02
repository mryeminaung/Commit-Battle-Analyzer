import { useCallback, useMemo, useState } from "react"
import { runBattle } from "@/lib/battle"
import { toBattleError, type BattleErrorState } from "@/lib/errors"
import {
  applyMatchResult,
  BRACKET_SIZE_AUTO,
  buildTournament,
  findPlayableMatch,
  getMatchDetail,
  isTournamentComplete,
  MAX_TOURNAMENT_PLAYERS,
  MIN_TOURNAMENT_PLAYERS,
  parsePlayerLogins,
  resolveBracketSize,
  resolveTournamentWinner,
  type MatchDetail,
  type PlayableMatch,
  type TournamentState,
} from "@/lib/tournament"
import type { BattleResult } from "@/lib/types"

export type TournamentPhase = "setup" | "preview" | "result" | "champion"

type TournamentOptions = {
  /** Prefill setup text (e.g. from `?players=`). */
  initialLogins?: string
}

/** Safety cap so auto-simulate cannot loop forever on bad state. */
const AUTO_SIMULATE_MAX_MATCHES = 64

export function useTournament(options?: TournamentOptions) {
  const [phase, setPhase] = useState<TournamentPhase>("setup")
  const [loginsText, setLoginsText] = useState(options?.initialLogins ?? "")
  const [bracketSize, setBracketSize] = useState(BRACKET_SIZE_AUTO)
  const [setupError, setSetupError] = useState<string | null>(null)
  const [tournament, setTournament] = useState<TournamentState | null>(null)
  const [currentMatch, setCurrentMatch] = useState<PlayableMatch | null>(null)
  const [lastResult, setLastResult] = useState<BattleResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [simulating, setSimulating] = useState(false)
  const [error, setError] = useState<BattleErrorState | null>(null)
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)

  const playable = useMemo(
    () => (tournament ? findPlayableMatch(tournament) : null),
    [tournament],
  )

  const selectedDetail: MatchDetail | null = useMemo(() => {
    if (!tournament || !selectedMatchId) return null
    return getMatchDetail(tournament, selectedMatchId)
  }, [tournament, selectedMatchId])

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

    // Auto (or undersized explicit) expands to the next power of two.
    const nextSize = resolveBracketSize(logins.length, size)
    const state = buildTournament(logins, nextSize)
    setSetupError(null)
    setTournament(state)
    setLastResult(null)
    setError(null)
    setSelectedMatchId(null)
    setPhase("preview")
    setCurrentMatch(findPlayableMatch(state))
  }, [])

  const playCurrentMatch = useCallback(async () => {
    if (!tournament || !currentMatch || loading || simulating) return

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
      setSelectedMatchId(currentMatch.id)
      setCurrentMatch(findPlayableMatch(next))
      setPhase("result")
    } catch (battleError) {
      setError(toBattleError(battleError))
    } finally {
      setLoading(false)
    }
  }, [tournament, currentMatch, loading, simulating])

  /** Run every remaining match without pausing, then show the champion. */
  const autoSimulateAll = useCallback(async () => {
    if (!tournament || loading || simulating) return

    setSimulating(true)
    setError(null)
    setLastResult(null)

    let state = tournament
    try {
      let guard = 0
      while (!isTournamentComplete(state) && guard < AUTO_SIMULATE_MAX_MATCHES) {
        guard += 1
        const match = findPlayableMatch(state)
        if (!match) break

        const result = await runBattle(match.left, match.right)
        const winnerLogin = resolveTournamentWinner(result.left, result.right)
        state = applyMatchResult(
          state,
          match.id,
          winnerLogin,
          result.left,
          result.right,
        )
        // Refresh bracket while simulating so progress is visible
        setTournament(state)
        setCurrentMatch(findPlayableMatch(state))
      }

      setTournament(state)
      setCurrentMatch(null)

      if (isTournamentComplete(state)) {
        setPhase("champion")
      } else {
        setPhase("preview")
        setCurrentMatch(findPlayableMatch(state))
      }
    } catch (battleError) {
      setError(toBattleError(battleError))
      setPhase("preview")
      setCurrentMatch(findPlayableMatch(state))
    } finally {
      setSimulating(false)
    }
  }, [tournament, loading, simulating])

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

  const selectMatch = useCallback((matchId: string) => {
    setSelectedMatchId((current) => (current === matchId ? null : matchId))
  }, [])

  const clearMatchSelection = useCallback(() => {
    setSelectedMatchId(null)
  }, [])

  const resetToSetup = useCallback(() => {
    setPhase("setup")
    setTournament(null)
    setCurrentMatch(null)
    setLastResult(null)
    setError(null)
    setSetupError(null)
    setLoading(false)
    setSimulating(false)
    setSelectedMatchId(null)
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
    simulating,
    error,
    playable,
    selectedMatchId,
    selectedDetail,
    startTournament,
    playCurrentMatch,
    autoSimulateAll,
    continueAfterResult,
    retryMatch,
    selectMatch,
    clearMatchSelection,
    resetToSetup,
  }
}
