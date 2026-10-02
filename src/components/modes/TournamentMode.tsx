import { useCallback } from "react"
import { useTournament } from "../../hooks/useTournament"
import { readPlayersFromUrl } from "../../lib/modes"
import { BattleSkeleton } from "../BattleSkeleton"
import { ErrorBanner } from "../ErrorBanner"
import { Scoreboard } from "../Scoreboard"
import { BracketView } from "./BracketView"
import { PlayerSetupForm } from "./PlayerSetupForm"
import { TournamentChampion } from "./TournamentChampion"

type AvatarHandlers = {
  getAvatarSrc: (login: string, fallbackUrl: string) => string
  hasCustomAvatar: (login: string) => boolean
  onSelectAvatar: (login: string, path: string) => void
  onResetAvatar: (login: string) => void
}

type TournamentModeProps = AvatarHandlers

const DEMO_ROSTER = [
  "torvalds",
  "dan-abramov",
  "yyx990803",
  "rich-harris",
  "microsoft",
  "gaearon",
].join("\n")

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
    error,
    startTournament,
    playCurrentMatch,
    continueAfterResult,
    retryMatch,
    resetToSetup,
  } = tournament

  const handleSubmit = useCallback(
    (text: string, size: number) => {
      startTournament(text, size)
    },
    [startTournament],
  )

  if (phase === "setup" || !state) {
    return (
      <PlayerSetupForm
        heading="Tournament"
        description="Enter fighters, draw a random knockout bracket, then play match by match until one champion remains."
        ctaLabel="Draw bracket"
        loginsText={loginsText}
        onLoginsChange={setLoginsText}
        bracketSize={bracketSize}
        onBracketSizeChange={setBracketSize}
        error={setupError}
        onSubmit={handleSubmit}
        onDemoFill={() => setLoginsText(DEMO_ROSTER)}
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

  return (
    <>
      <BracketView
        tournament={state}
        activeMatchId={phase === "preview" ? currentMatch?.id : null}
      />

      {error && (
        <ErrorBanner
          message={error.message}
          rateLimited={error.rateLimited}
          onRetry={retryMatch}
          retrying={loading}
        />
      )}

      {phase === "preview" && currentMatch && (
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
          <button
            type="button"
            onClick={() => void playCurrentMatch()}
            disabled={loading}
            className="min-h-11 cursor-pointer rounded-[2px] bg-amber-fill px-6 font-display text-[0.95rem] font-extrabold tracking-[0.16em] text-on-amber uppercase transition-colors hover:bg-amber-fill-hover active:bg-amber-fill-active disabled:cursor-wait disabled:bg-line-strong disabled:text-dim"
          >
            {loading ? "Battle…" : "Play match"}
          </button>
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
          <div className="mt-4 mb-2">
            <button
              type="button"
              onClick={continueAfterResult}
              className="min-h-11 w-full cursor-pointer rounded-[2px] border border-amber bg-amber-fill/15 px-6 font-display text-[0.95rem] font-extrabold tracking-[0.16em] text-amber uppercase transition-colors hover:bg-amber-fill/25 sm:w-auto"
            >
              {state.championLogin ? "See champion" : "Next match"}
            </button>
          </div>
        </>
      )}
    </>
  )
}
