import { useCallback, useEffect, type FormEvent } from "react"
import { BattleForm } from "./components/BattleForm"
import { BattleSkeleton } from "./components/BattleSkeleton"
import { ErrorBanner } from "./components/ErrorBanner"
import { PresetRow } from "./components/PresetRow"
import { RecentBattles } from "./components/RecentBattles"
import { Scoreboard } from "./components/Scoreboard"
import { TopBar } from "./components/TopBar"
import { useBattle } from "./hooks/useBattle"
import { useTheme } from "./hooks/useTheme"

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable
}

function App() {
  const {
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
  } = useBattle("torvalds", "dan-abramov")

  const { theme, toggleTheme } = useTheme()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void startBattle(leftUser, rightUser)
  }

  const handlePreset = useCallback(
    (left: string, right: string) => {
      setLeftUser(left)
      setRightUser(right)
      void startBattle(left, right)
    },
    [setLeftUser, setRightUser, startBattle],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.toLowerCase() !== "s") return
      if (isTypingTarget(event.target)) return
      event.preventDefault()
      swapPlayers()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [swapPlayers])

  return (
    <main className="relative z-[1] mx-auto w-[min(1080px,calc(100%-32px))] py-9 pb-18">
      <TopBar theme={theme} onToggleTheme={toggleTheme} />

      <BattleForm
        leftUser={leftUser}
        rightUser={rightUser}
        loading={loading}
        onLeftChange={setLeftUser}
        onRightChange={setRightUser}
        onSwap={swapPlayers}
        onSubmit={handleSubmit}
      />

      <PresetRow onSelect={handlePreset} />

      <RecentBattles
        bouts={bouts}
        onSelect={handlePreset}
        onClear={resetHistory}
      />

      {error && <ErrorBanner message={error} />}

      {loading && !result && <BattleSkeleton />}

      {result && <Scoreboard result={result} />}
    </main>
  )
}

export default App
