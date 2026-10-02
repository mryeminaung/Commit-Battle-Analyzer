import { useCallback, useEffect, useState } from "react"
import { runBattle } from "../lib/battle"
import type { BattleResult } from "../lib/types"

export function useBattle(initialLeft: string, initialRight: string) {
  const [leftUser, setLeftUser] = useState(initialLeft)
  const [rightUser, setRightUser] = useState(initialRight)
  const [result, setResult] = useState<BattleResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const startBattle = useCallback(async (firstUser: string, secondUser: string) => {
    setLoading(true)
    setError(null)

    try {
      const battleResult = await runBattle(firstUser, secondUser)
      setResult(battleResult)
    } catch (battleError) {
      setResult(null)
      setError(
        battleError instanceof Error
          ? battleError.message
          : "Something went wrong while loading the battle data.",
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void startBattle(initialLeft, initialRight)
  }, [initialLeft, initialRight, startBattle])

  return {
    leftUser,
    rightUser,
    setLeftUser,
    setRightUser,
    result,
    error,
    loading,
    startBattle,
  }
}
