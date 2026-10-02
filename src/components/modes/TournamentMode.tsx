import { useCallback } from "react"
import { useTournament } from "@/hooks/useTournament"
import { DEMO_LINEUPS, type DemoLineup } from "@/lib/demos"
import { readPlayersFromUrl } from "@/lib/modes"
import { BRACKET_SIZE_AUTO } from "@/lib/tournament"
import { BattleSkeleton } from "@/components/BattleSkeleton"
import { ErrorBanner } from "@/components/ErrorBanner"
import { Scoreboard } from "@/components/Scoreboard"
import { BracketView } from "@/components/modes/BracketView"
import { MatchDetailPanel } from "@/components/modes/MatchDetailPanel"
import { PlayerSetupForm } from "@/components/modes/PlayerSetupForm"
import { TournamentChampion } from "@/components/modes/TournamentChampion"

type AvatarHandlers = {
  getAvatarSrc: (login: string, fallbackUrl: string) => string
  hasCustomAvatar: (login: string) => boolean
  onSelectAvatar: (login: string, path: string) => void
  onResetAvatar: (login: string) => void
}

type TournamentModeProps = AvatarHandlers

export function TournamentMode({
  getAvatarSrc,
  hasCustomAvatar,
  onSelectAvatar,
  onResetAvatar,
}: TournamentModeProps) {
  const tournament = useTournament({
    initialLogins: readPlayersFromUrl(),
  })

  const {
    phase,
    loginsText,
    setLoginsText,
    bracketSize,
    setBracketSize,
    setupError,
    tournament: state,
    currentMatch,
    lastResult,
    loading,
    simulating,
    error,
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
  } = tournament

  const handleSubmit = useCallback(
    (text: string, size: number) => {
      startTournament(text, size)
    },
    [startTournament],
  )

  const handleDemoSelect = useCallback(
    (lineup: DemoLineup) => {
      setLoginsText(lineup.logins.join("\n"))
      setBracketSize(BRACKET_SIZE_AUTO)
    },
    [setLoginsText, setBracketSize],
  )

  if (phase === "setup" || !state) {
    return (
      <PlayerSetupForm
        heading="Tournament"
        description="Enter fighters or pick a demo (4 / 6 / 16), draw a random knockout bracket, then play match by match — or auto-simulate to the champion."
        ctaLabel="Draw bracket"
        loginsText={loginsText}
        onLoginsChange={setLoginsText}
        bracketSize={bracketSize}
        onBracketSizeChange={setBracketSize}
        demoLineups={DEMO_LINEUPS}
        onDemoSelect={handleDemoSelect}
        error={setupError}
        onSubmit={handleSubmit}
      />
    )
  }

  if (phase === "champion") {
    return (
      <TournamentChampion
        tournament={state}
        onNewTournament={resetToSetup}
        getAvatarSrc={getAvatarSrc}
      />
    )
  }

  const busy = loading || simulating

  return (
    <>
      <BracketView
        tournament={state}
        activeMatchId={phase === "preview" ? currentMatch?.id : null}
        selectedMatchId={selectedMatchId}
        onSelectMatch={selectMatch}
      />

      {selectedDetail && (
        <MatchDetailPanel
          detail={selectedDetail}
          onClose={clearMatchSelection}
        />
      )}

      {error && (
        <ErrorBanner
          message={error.message}
          rateLimited={error.rateLimited}
          onRetry={retryMatch}
          retrying={loading}
        />
      )}

      {simulating && (
        <p
          role="status"
          className="mb-4 font-display text-[0.88rem] font-semibold tracking-[0.12em] text-amber uppercase"
        >
          Auto-simulating remaining matches…
        </p>
      )}

      {phase === "preview" && currentMatch && !simulating && (
        <section className="mb-5 border border-line bg-panel p-3.5 sm:p-4.5">
          <p className="mb-1 font-display text-[0.72rem] font-bold tracking-[0.16em] text-dim uppercase">
            Up next
          </p>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <strong className="font-display text-[1.35rem] font-extrabold tracking-[0.04em] text-ink uppercase">
              {currentMatch.left}
            </strong>
            <span className="font-display text-[1.1rem] font-extrabold text-score-red uppercase">
              vs
            </span>
            <strong className="font-display text-[1.35rem] font-extrabold tracking-[0.04em] text-ink uppercase">
              {currentMatch.right}
            </strong>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void playCurrentMatch()}
              disabled={busy}
              className="min-h-11 cursor-pointer rounded-[2px] bg-amber-fill px-6 font-display text-[0.95rem] font-extrabold tracking-[0.16em] text-on-amber uppercase transition-colors hover:bg-amber-fill-hover active:bg-amber-fill-active disabled:cursor-wait disabled:bg-line-strong disabled:text-dim"
            >
              {loading ? "Battle…" : "Play match"}
            </button>
            <button
              type="button"
              onClick={() => void autoSimulateAll()}
              disabled={busy}
              className="min-h-11 cursor-pointer rounded-[2px] border border-line-strong bg-deep px-5 font-display text-[0.9rem] font-bold tracking-[0.14em] text-ink-dim uppercase transition-colors hover:border-amber hover:text-amber disabled:cursor-wait disabled:opacity-60"
            >
              Auto-simulate all
            </button>
          </div>
        </section>
      )}

      {loading && phase === "preview" && <BattleSkeleton />}

      {phase === "result" && lastResult && (
        <>
          <Scoreboard
            result={lastResult}
            weekId={null}
            getAvatarSrc={getAvatarSrc}
            hasCustomAvatar={hasCustomAvatar}
            onSelectAvatar={onSelectAvatar}
            onResetAvatar={onResetAvatar}
          />
          <div className="mt-4 mb-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={continueAfterResult}
              className="min-h-11 w-full cursor-pointer rounded-[2px] border border-amber bg-amber-fill/15 px-6 font-display text-[0.95rem] font-extrabold tracking-[0.16em] text-amber uppercase transition-colors hover:bg-amber-fill/25 sm:w-auto"
            >
              {state.championLogin ? "See champion" : "Next match"}
            </button>
            {!state.championLogin && (
              <button
                type="button"
                onClick={() => void autoSimulateAll()}
                disabled={busy}
                className="min-h-11 w-full cursor-pointer rounded-[2px] border border-line-strong bg-deep px-5 font-display text-[0.9rem] font-bold tracking-[0.14em] text-ink-dim uppercase transition-colors hover:border-amber hover:text-amber disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              >
                Auto-simulate rest
              </button>
            )}
          </div>
        </>
      )}
    </>
  )
}
