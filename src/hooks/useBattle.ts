import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { runBattle } from "../lib/battle"
import { toBattleError, type BattleErrorState } from "../lib/errors"
import { clearBouts, loadBouts, pushBout } from "../lib/history"
import { readBattleFromUrl, writeBattleToUrl } from "../lib/url"
import type { BattleResult, BoutRecord } from "../lib/types"

type UseBattleOptions = {
  /** When false, skip the auto-start effect (mode switchers / lazy duel). */
  autoStart?: boolean
}

export function useBattle(
  defaultLeft: string,
  defaultRight: string,
  options?: UseBattleOptions,
) {
  const autoStart = options?.autoStart ?? true

  const initialPair = useMemo(
    () => readBattleFromUrl() ?? { left: defaultLeft, right: defaultRight },
    [defaultLeft, defaultRight],
  )

  const [leftUser, setLeftUser] = useState(initialPair.left)
  const [rightUser, setRightUser] = useState(initialPair.right)
  const [weekId, setWeekId] = useState<string | null>(
    () => initialPair.weekId ?? null,
  )
  const [result, setResult] = useState<BattleResult | null>(null)
  const [error, setError] = useState<BattleErrorState | null>(null)
  const [loading, setLoading] = useState(false)
  const [bouts, setBouts] = useState<BoutRecord[]>(() => loadBouts())
  const lastPairRef = useRef<{
    left: string
    right: string
    weekId: string | null
  } | null>(null)

  const startBattle = useCallback(
    async (
      firstUser: string,
      secondUser: string,
      battleWeekId: string | null = null,
    ) => {
      lastPairRef.current = {
        left: firstUser,
        right: secondUser,
        weekId: battleWeekId,
      }
      setWeekId(battleWeekId)
      setLoading(true)
      setError(null)

      try {
        const battleResult = await runBattle(firstUser, secondUser)
        setResult(battleResult)
        writeBattleToUrl({
          left: battleResult.left.login,
          right: battleResult.right.login,
          weekId: battleWeekId,
        })
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
        setError(toBattleError(battleError))
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const retryLastBattle = useCallback(() => {
    const pair = lastPairRef.current
    if (!pair) return
    void startBattle(pair.left, pair.right, pair.weekId)
  }, [startBattle])

  const swapPlayers = useCallback(() => {
    const nextLeft = rightUser
    const nextRight = leftUser
    setLeftUser(nextLeft)
    setRightUser(nextRight)
    void startBattle(nextLeft, nextRight, null)
  }, [leftUser, rightUser, startBattle])

  const resetHistory = useCallback(() => {
    setBouts(clearBouts())
  }, [])

  useEffect(() => {
    if (!autoStart) return
    void startBattle(
      initialPair.left,
      initialPair.right,
      initialPair.weekId ?? null,
    )
  }, [
    autoStart,
    initialPair.left,
    initialPair.right,
    initialPair.weekId,
    startBattle,
  ])

  return {
    leftUser,
    rightUser,
    setLeftUser,
    setRightUser,
    weekId,
    result,
    error,
    loading,
    bouts,
    startBattle,
    retryLastBattle,
    swapPlayers,
    resetHistory,
  }
}
