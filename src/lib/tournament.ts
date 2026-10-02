import { normalizeLogin } from "@/lib/github"
import type { BattleProfile } from "@/lib/types"

/**
 * Pure tournament bracket logic.
 * No React, no network — easy to unit-test and reuse.
 */

export type TournamentMatch = {
  id: string
  round: number
  index: number
  /** Login on the left slot, or null when empty / bye. */
  left: string | null
  right: string | null
  winnerLogin: string | null
  leftScore: number | null
  rightScore: number | null
  isBye: boolean
  played: boolean
}

export type TournamentPlayerStat = {
  login: string
  name: string
  avatarUrl: string
  powerScore: number
  followers: number
  publicRepos: number
  /** Round where the player was eliminated (null = champion / still alive). */
  eliminatedInRound: number | null
}

export type TournamentState = {
  id: string
  /** Bracket size — power of two (2, 4, 8, 16). */
  size: number
  /** Seeded logins in bracket order after shuffle (empty string = BYE). */
  seeds: string[]
  rounds: TournamentMatch[][]
  championLogin: string | null
  runnerUpLogin: string | null
  stats: Record<string, TournamentPlayerStat>
}

export type PlayableMatch = {
  id: string
  round: number
  index: number
  left: string
  right: string
}

export const MIN_TOURNAMENT_PLAYERS = 2
export const MAX_TOURNAMENT_PLAYERS = 16

/** Bracket size sentinel — pick the next power of two from the lineup. */
export const BRACKET_SIZE_AUTO = 0

/** Supported explicit bracket sizes (BYEs pad smaller lineups). */
export const BRACKET_SIZE_OPTIONS = [4, 8, 16] as const

/**
 * Resolve the knockout size for a lineup.
 * - AUTO → next power of two (6 players → 8, with BYEs)
 * - Explicit smaller than the lineup → expand so the field always fits
 */
export const resolveBracketSize = (
  playerCount: number,
  requested: number,
): number => {
  const count = Math.max(MIN_TOURNAMENT_PLAYERS, playerCount)
  const cappedCount = Math.min(MAX_TOURNAMENT_PLAYERS, count)
  const autoSize = nextPowerOfTwo(cappedCount)

  if (!requested || requested === BRACKET_SIZE_AUTO) {
    return autoSize
  }

  const explicit = Math.min(
    MAX_TOURNAMENT_PLAYERS,
    Math.max(MIN_TOURNAMENT_PLAYERS, requested),
  )

  if (explicit < cappedCount) {
    return autoSize
  }

  return explicit
}

/** Split free text into unique normalized GitHub logins. */
export const parsePlayerLogins = (raw: string): string[] => {
  const parts = raw.split(/[\n,;\s]+/)
  const seen = new Set<string>()
  const logins: string[] = []

  for (const part of parts) {
    const login = normalizeLogin(part)
    if (!login) continue
    const key = login.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    logins.push(login)
  }

  return logins
}

export const nextPowerOfTwo = (value: number): number => {
  if (value <= 2) return 2
  let size = 2
  while (size < value) size *= 2
  return size
}

/** Fisher–Yates shuffle. Mutates a copy only. */
export const shuffleLogins = (logins: string[], random = Math.random): string[] => {
  const next = [...logins]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    const tmp = next[i]
    next[i] = next[j]
    next[j] = tmp
  }
  return next
}

const createMatch = (
  id: string,
  round: number,
  index: number,
  left: string | null,
  right: string | null,
  isBye: boolean,
): TournamentMatch => ({
  id,
  round,
  index,
  left,
  right,
  winnerLogin: isBye ? left ?? right : null,
  leftScore: null,
  rightScore: null,
  isBye,
  played: isBye,
})

/**
 * Build a knockout bracket from logins.
 * Pads with BYEs up to `size` (power of two). First-round BYEs auto-advance.
 */
export const buildTournament = (
  logins: string[],
  size: number,
  random: () => number = Math.random,
): TournamentState => {
  const unique = parsePlayerLogins(logins.join(" "))
  const bracketSize = nextPowerOfTwo(Math.max(MIN_TOURNAMENT_PLAYERS, size))
  const shuffled = shuffleLogins(unique, random)

  const seeds: string[] = [...shuffled]
  while (seeds.length < bracketSize) seeds.push("")

  const firstRound: TournamentMatch[] = []
  for (let i = 0; i < bracketSize; i += 2) {
    const left = seeds[i] || null
    const right = seeds[i + 1] || null
    const isBye = !left || !right
    firstRound.push(
      createMatch(`r0-m${i / 2}`, 0, i / 2, left, right, isBye),
    )
  }

  const rounds: TournamentMatch[][] = [firstRound]
  let matchCount = bracketSize / 2
  let round = 1
  while (matchCount >= 1) {
    const matches: TournamentMatch[] = []
    for (let i = 0; i < matchCount; i += 1) {
      matches.push(createMatch(`r${round}-m${i}`, round, i, null, null, false))
    }
    rounds.push(matches)
    if (matchCount === 1) break
    matchCount = Math.floor(matchCount / 2)
    round += 1
  }

  return {
    id: `t-${Date.now().toString(36)}-${Math.floor(random() * 1e6).toString(36)}`,
    size: bracketSize,
    seeds,
    rounds,
    championLogin: null,
    runnerUpLogin: null,
    stats: {},
  }
}

export const findPlayableMatch = (state: TournamentState): PlayableMatch | null => {
  for (const round of state.rounds) {
    for (const match of round) {
      if (!match.played && match.left && match.right) {
        return {
          id: match.id,
          round: match.round,
          index: match.index,
          left: match.left,
          right: match.right,
        }
      }
    }
  }
  return null
}

export const isTournamentComplete = (state: TournamentState): boolean =>
  state.championLogin !== null

const cloneState = (state: TournamentState): TournamentState => ({
  ...state,
  rounds: state.rounds.map((round) =>
    round.map((match) => ({ ...match })),
  ),
  stats: { ...state.stats },
})

const recordStat = (
  state: TournamentState,
  profile: BattleProfile,
  eliminatedInRound: number | null,
): void => {
  const existing = state.stats[profile.login]
  // Keep the best (highest) power seen for a player across rounds.
  if (existing && existing.powerScore >= profile.powerScore && eliminatedInRound === null) {
    return
  }
  if (existing && existing.powerScore > profile.powerScore && eliminatedInRound !== null) {
    // still record elimination once they lose
    state.stats[profile.login] = {
      ...existing,
      eliminatedInRound,
    }
    return
  }

  state.stats[profile.login] = {
    login: profile.login,
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    powerScore: Math.max(existing?.powerScore ?? 0, profile.powerScore),
    followers: profile.followers,
    publicRepos: profile.publicRepos,
    eliminatedInRound:
      eliminatedInRound ?? existing?.eliminatedInRound ?? null,
  }
}

/**
 * Deterministic winner when power scores tie:
 * followers → public repos → activity → left advances.
 */
export const resolveTournamentWinner = (
  left: BattleProfile,
  right: BattleProfile,
): string => {
  if (left.powerScore !== right.powerScore) {
    return left.powerScore > right.powerScore ? left.login : right.login
  }
  if (left.followers !== right.followers) {
    return left.followers > right.followers ? left.login : right.login
  }
  if (left.publicRepos !== right.publicRepos) {
    return left.publicRepos > right.publicRepos ? left.login : right.login
  }
  if (left.activityScore !== right.activityScore) {
    return left.activityScore > right.activityScore ? left.login : right.login
  }
  return left.login
}

/** Apply a finished match: advance winner, record stats, detect champion. */
export const applyMatchResult = (
  state: TournamentState,
  matchId: string,
  winnerLogin: string,
  left: BattleProfile,
  right: BattleProfile,
): TournamentState => {
  const next = cloneState(state)
  let match: TournamentMatch | null = null
  let matchRound = -1
  let matchIndex = -1

  for (const round of next.rounds) {
    for (const candidate of round) {
      if (candidate.id === matchId) {
        match = candidate
        matchRound = candidate.round
        matchIndex = candidate.index
        break
      }
    }
    if (match) break
  }

  if (!match) return state

  const winnerIsLeft =
    winnerLogin.toLowerCase() === (match.left ?? "").toLowerCase()
  const loserRound = matchRound

  match.winnerLogin = winnerLogin
  match.leftScore = left.powerScore
  match.rightScore = right.powerScore
  match.played = true

  recordStat(next, left, winnerIsLeft ? null : loserRound)
  recordStat(next, right, winnerIsLeft ? loserRound : null)

  // Advance into parent match
  const parentRound = next.rounds[matchRound + 1]
  if (parentRound) {
    const parent = parentRound[Math.floor(matchIndex / 2)]
    if (parent) {
      if (matchIndex % 2 === 0) parent.left = winnerLogin
      else parent.right = winnerLogin
    }
  }

  // Champion = winner of the final match once it is played
  const finalRound = next.rounds[next.rounds.length - 1]
  const finalMatch = finalRound[0]
  if (finalMatch?.played && finalMatch.winnerLogin) {
    next.championLogin = finalMatch.winnerLogin
    next.runnerUpLogin =
      finalMatch.winnerLogin.toLowerCase() === (finalMatch.left ?? "").toLowerCase()
        ? finalMatch.right
        : finalMatch.left
  }

  return next
}

/** Standings rows: champion first, then best power score, then seed order. */
export type StandingRow = {
  rank: number
  login: string
  name: string
  avatarUrl: string
  powerScore: number
  followers: number
  publicRepos: number
  status: "champion" | "runner-up" | "eliminated" | "pending"
}

export const buildStandings = (state: TournamentState): StandingRow[] => {
  const rows: StandingRow[] = Object.values(state.stats).map((stat) => {
    let status: StandingRow["status"] = "eliminated"
    if (state.championLogin) {
      if (stat.login.toLowerCase() === state.championLogin.toLowerCase()) {
        status = "champion"
      } else if (
        state.runnerUpLogin &&
        stat.login.toLowerCase() === state.runnerUpLogin.toLowerCase()
      ) {
        status = "runner-up"
      }
    }
    return {
      rank: 0,
      login: stat.login,
      name: stat.name,
      avatarUrl: stat.avatarUrl,
      powerScore: stat.powerScore,
      followers: stat.followers,
      publicRepos: stat.publicRepos,
      status,
    }
  })

  // Players never shown in a match (only BYE placeholders) — nothing to add.

  rows.sort((a, b) => {
    const aChamp = a.status === "champion" ? 1 : 0
    const bChamp = b.status === "champion" ? 1 : 0
    if (aChamp !== bChamp) return bChamp - aChamp
    const aRunner = a.status === "runner-up" ? 1 : 0
    const bRunner = b.status === "runner-up" ? 1 : 0
    if (aRunner !== bRunner) return bRunner - aRunner
    if (b.powerScore !== a.powerScore) return b.powerScore - a.powerScore
    return a.login.localeCompare(b.login)
  })

  return rows.map((row, index) => ({ ...row, rank: index + 1 }))
}

/** Logins that entered the bracket (non-BYE). */
export const getSeededLogins = (state: TournamentState): string[] =>
  state.seeds.filter((seed) => seed.length > 0)

export const getRoundLabel = (round: number, totalRounds: number): string => {
  const remaining = totalRounds - round
  if (remaining === 1) return "Final"
  if (remaining === 2) return "Semifinals"
  if (remaining === 3) return "Quarterfinals"
  return `Round ${round + 1}`
}

/** Snapshot of one bracket node for the details panel. */
export type MatchDetail = {
  matchId: string
  round: number
  roundLabel: string
  left: string | null
  right: string | null
  winnerLogin: string | null
  leftScore: number | null
  rightScore: number | null
  played: boolean
  isBye: boolean
  leftStats: TournamentPlayerStat | null
  rightStats: TournamentPlayerStat | null
}

export const findMatchById = (
  state: TournamentState,
  matchId: string,
): TournamentMatch | null => {
  for (const round of state.rounds) {
    for (const match of round) {
      if (match.id === matchId) return match
    }
  }
  return null
}

export const getMatchDetail = (
  state: TournamentState,
  matchId: string,
): MatchDetail | null => {
  const match = findMatchById(state, matchId)
  if (!match) return null

  return {
    matchId: match.id,
    round: match.round,
    roundLabel: getRoundLabel(match.round, state.rounds.length),
    left: match.left,
    right: match.right,
    winnerLogin: match.winnerLogin,
    leftScore: match.leftScore,
    rightScore: match.rightScore,
    played: match.played,
    isBye: match.isBye,
    leftStats: match.left ? state.stats[match.left] ?? null : null,
    rightStats: match.right ? state.stats[match.right] ?? null : null,
  }
}
