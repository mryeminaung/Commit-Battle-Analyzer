import type { BattleProfile } from "@/lib/types"

/**
 * In-memory profile cache for the session.
 * Keeps tournaments / standings from refetching the same GitHub user.
 */

const TTL_MS = 15 * 60 * 1000

type CacheEntry = {
  profile: BattleProfile
  at: number
}

const memory = new Map<string, CacheEntry>()

const cacheKey = (login: string): string => login.trim().toLowerCase()

export const readCachedProfile = (login: string): BattleProfile | null => {
  const entry = memory.get(cacheKey(login))
  if (!entry) return null
  if (Date.now() - entry.at > TTL_MS) {
    memory.delete(cacheKey(login))
    return null
  }
  return entry.profile
}

export const writeCachedProfile = (profile: BattleProfile): void => {
  memory.set(cacheKey(profile.login), { profile, at: Date.now() })
}

export const clearProfileCache = (): void => {
  memory.clear()
}
