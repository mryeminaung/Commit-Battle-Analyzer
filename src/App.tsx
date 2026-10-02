import { useCallback, useEffect, useState, type FormEvent } from "react"
import { BattleForm } from "@/components/BattleForm"
import { BattleSkeleton } from "@/components/BattleSkeleton"
import { ErrorBanner } from "@/components/ErrorBanner"
import { BossMode } from "@/components/modes/BossMode"
import { ModeSwitcher } from "@/components/modes/ModeSwitcher"
import { StandingsMode } from "@/components/modes/StandingsMode"
import { TournamentMode } from "@/components/modes/TournamentMode"
import { PresetRow } from "@/components/PresetRow"
import { RecentBattles } from "@/components/RecentBattles"
import { Scoreboard } from "@/components/Scoreboard"
import { TopBar } from "@/components/TopBar"
import { WeeklyBattle } from "@/components/WeeklyBattle"
import { useAvatars } from "@/hooks/useAvatars"
import { useBattle } from "@/hooks/useBattle"
import { useTheme } from "@/hooks/useTheme"
import {
  readModeFromUrl,
  writeModeToUrl,
  type AppMode,
} from "@/lib/modes"

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable
}

function App() {
  const [mode, setMode] = useState<AppMode>(() => readModeFromUrl())

  // Only Duel auto-fetches on mount — other modes own their own data loading.
  const duelActive = mode === "duel"

  const {
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
  } = useBattle("torvalds", "dan-abramov", { autoStart: duelActive })

  const { theme, toggleTheme } = useTheme()
  const { avatars, assignAvatar, resetAvatar, getAvatarSrc } = useAvatars()

  const handleModeChange = useCallback((next: AppMode) => {
    setMode(next)
    writeModeToUrl(next)
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void startBattle(leftUser, rightUser, null)
  }

  const handlePreset = useCallback(
    (left: string, right: string) => {
      setLeftUser(left)
      setRightUser(right)
      void startBattle(left, right, null)
    },
    [setLeftUser, setRightUser, startBattle],
  )

  const handleWeekly = useCallback(
    (left: string, right: string, battleWeekId: string) => {
      setLeftUser(left)
      setRightUser(right)
      void startBattle(left, right, battleWeekId)
    },
    [setLeftUser, setRightUser, startBattle],
  )

  const hasCustomAvatar = useCallback(
    (login: string) => login.toLowerCase() in avatars,
    [avatars],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (mode !== "duel") return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.toLowerCase() !== "s") return
      if (isTypingTarget(event.target)) return
      event.preventDefault()
      swapPlayers()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [mode, swapPlayers])

  // Persist mode in the URL once on first paint
  useEffect(() => {
    writeModeToUrl(mode)
  }, [mode])

  return (
    <main className="relative z-[1] mx-auto w-[min(1080px,calc(100%-24px))] py-7 pb-18 sm:py-9 sm:w-[min(1080px,calc(100%-32px))]">
      <TopBar theme={theme} onToggleTheme={toggleTheme} />

      <ModeSwitcher mode={mode} onChange={handleModeChange} />

      {mode === "duel" && (
        <>
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

          <WeeklyBattle activeWeekId={weekId} onSelect={handleWeekly} />

          <RecentBattles
            bouts={bouts}
            onSelect={handlePreset}
            onClear={resetHistory}
          />

          {error && (
            <ErrorBanner
              message={error.message}
              rateLimited={error.rateLimited}
              onRetry={retryLastBattle}
              retrying={loading}
            />
          )}

          {loading && !result && <BattleSkeleton />}

          {result && (
            <Scoreboard
              result={result}
              weekId={weekId}
              getAvatarSrc={getAvatarSrc}
              hasCustomAvatar={hasCustomAvatar}
              onSelectAvatar={assignAvatar}
              onResetAvatar={resetAvatar}
            />
          )}
        </>
      )}

      {mode === "tournament" && (
        <TournamentMode
          getAvatarSrc={getAvatarSrc}
          hasCustomAvatar={hasCustomAvatar}
          onSelectAvatar={assignAvatar}
          onResetAvatar={resetAvatar}
        />
      )}

      {mode === "standings" && <StandingsMode getAvatarSrc={getAvatarSrc} />}

      {mode === "boss" && (
        <BossMode
          getAvatarSrc={getAvatarSrc}
          hasCustomAvatar={hasCustomAvatar}
          onSelectAvatar={assignAvatar}
          onResetAvatar={resetAvatar}
        />
      )}
    </main>
  )
}

export default App
