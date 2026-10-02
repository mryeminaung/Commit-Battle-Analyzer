import { useCallback, useEffect, useMemo, useState } from "react"
import { runBattle } from "../lib/battle"
import { clearBouts, loadBouts, pushBout } from "../lib/history"
import { readBattleFromUrl, writeBattleToUrl } from "../lib/url"
import type { BattleResult, BoutRecord } from "../lib/types"

export function useBattle(defaultLeft: string, defaultRight: string) {
  const initialPair = useMemo(
    () => readBattleFromUrl() ?? { left: defaultLeft, right: defaultRight },
    [defaultLeft, defaultRight],
  )

  const [leftUser, setLeftUser] = useState(initialPair.left)
  const [rightUser, setRightUser] = useState(initialPair.right)
  const [result, setResult] = useState<BattleResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [bouts, setBouts] = useState<BoutRecord[]>(() => loadBouts())

  const startBattle = useCallback(
    async (firstUser: string, secondUser: string) => {
      setLoading(true)
      setError(null)

      try {
        const battleResult = await runBattle(firstUser, secondUser)
        setResult(battleResult)
        writeBattleToUrl(battleResult.left.login, battleResult.right.login)
        setBouts(
          pushBout({
            leftLogin: battleResult.left.login,
            rightLogin: battleResult.right.login,
            leftName: battleResult.left.name,
            rightName: battleResult.right.name,
            leftScore: battleResult.left.powerScore,
            rightScore: battleResult.right.powerScore,
            winner: battleResult.winner,
          }),
        )
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
    },
    [],
  )

  const swapPlayers = useCallback(() => {
    const nextLeft = rightUser
    const nextRight = leftUser
    setLeftUser(nextLeft)
    setRightUser(nextRight)
    void startBattle(nextLeft, nextRight)
  }, [leftUser, rightUser, startBattle])

  const resetHistory = useCallback(() => {
    setBouts(clearBouts())
  }, [])

  useEffect(() => {
    void startBattle(initialPair.left, initialPair.right)
  }, [initialPair.left, initialPair.right, startBattle])

  return {
    leftUser,
    rightUser,
    setLeftUser,
    setRightUser,
    result,
    error,
    loading,
    bouts,
    startBattle,
    swapPlayers,
    resetHistory,
  }
}
