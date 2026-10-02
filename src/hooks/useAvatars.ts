import { useCallback, useState } from "react"
import {
  clearCustomAvatar,
  loadCustomAvatars,
  resolveAvatarSrc,
  setCustomAvatar,
  type CustomAvatarMap,
} from "../lib/avatars"

export function useAvatars() {
  const [avatars, setAvatars] = useState<CustomAvatarMap>(() =>
    loadCustomAvatars(),
  )

  const assignAvatar = useCallback((login: string, path: string) => {
    setAvatars((prev) => setCustomAvatar(prev, login, path))
  }, [])

  const resetAvatar = useCallback((login: string) => {
    setAvatars((prev) => clearCustomAvatar(prev, login))
  }, [])

  const getAvatarSrc = useCallback(
    (login: string, fallbackUrl: string) =>
      resolveAvatarSrc(avatars, login, fallbackUrl),
    [avatars],
  )

  return { avatars, assignAvatar, resetAvatar, getAvatarSrc }
}
