export const AVATAR_OPTIONS: string[] = [
  "/avatars/user-1.webp",
  "/avatars/user-2.webp",
  "/avatars/user-3.webp",
  "/avatars/user-4.webp",
  "/avatars/user-5.webp",
  "/avatars/user-6.webp",
  "/avatars/user-7.webp",
  "/avatars/user-8.webp",
  "/avatars/user-9.webp",
  "/avatars/user-10.webp",
]

export const DEFAULT_FALLBACK_AVATAR = "/avatars/user-7.webp"

export type CustomAvatarMap = Record<string, string>

const STORAGE_KEY = "cba:avatars"

const isSafeAvatarPath = (value: unknown): value is string =>
  typeof value === "string" &&
  value.startsWith("/avatars/") &&
  !value.includes("..")

export const loadCustomAvatars = (): CustomAvatarMap => {
  if (typeof window === "undefined") return {}

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null) return {}

    const next: CustomAvatarMap = {}
    for (const [login, path] of Object.entries(parsed)) {
      if (login && isSafeAvatarPath(path)) {
        next[login.toLowerCase()] = path
      }
    }
    return next
  } catch {
    return {}
  }
}

const persist = (map: CustomAvatarMap): CustomAvatarMap => {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
    } catch {
      // storage may be blocked — map still applies in memory
    }
  }
  return map
}

export const setCustomAvatar = (
  map: CustomAvatarMap,
  login: string,
  path: string,
): CustomAvatarMap => {
  if (!isSafeAvatarPath(path)) return map
  return persist({ ...map, [login.toLowerCase()]: path })
}

export const clearCustomAvatar = (
  map: CustomAvatarMap,
  login: string,
): CustomAvatarMap => {
  const key = login.toLowerCase()
  if (!(key in map)) return map
  const next = { ...map }
  delete next[key]
  return persist(next)
}

export const resolveAvatarSrc = (
  map: CustomAvatarMap,
  login: string,
  fallbackUrl: string,
): string => map[login.toLowerCase()] ?? fallbackUrl
