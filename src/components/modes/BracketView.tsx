import { Fragment } from "react"
import { getRoundLabel, type TournamentState } from "@/lib/tournament"

type BracketViewProps = {
  tournament: TournamentState
  activeMatchId?: string | null
  selectedMatchId?: string | null
  onSelectMatch?: (matchId: string) => void
}

/** Fixed slot height so connector lines line up with match cards. */
const SLOT_CLASS = "h-[4.75rem]"

function MatchSlot({
  login,
  isWinner,
  score,
}: {
  login: string | null
  isWinner: boolean
  score: number | null
}) {
  if (!login) {
    return (
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 font-display text-[0.78rem] tracking-[0.1em] text-dim/60 uppercase">
        <span>—</span>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-between gap-2 px-2 py-1.5 font-display text-[0.78rem] font-semibold tracking-[0.1em] uppercase ${
        isWinner ? "bg-amber-fill/20 text-amber" : "text-ink-dim"
      }`}
    >
      <span className="truncate">{login}</span>
      {score !== null && (
        <span className="shrink-0 tabular-nums opacity-80">{score}</span>
      )}
    </div>
  )
}

function BracketMatch({
  match,
  isActive,
  isSelected,
  onSelect,
}: {
  match: TournamentState["rounds"][number][number]
  isActive: boolean
  isSelected: boolean
  onSelect?: (matchId: string) => void
}) {
  const winner = match.winnerLogin?.toLowerCase()
  const leftWin =
    match.played && winner !== null && match.left?.toLowerCase() === winner
  const rightWin =
    match.played && winner !== null && match.right?.toLowerCase() === winner
  const clickable = Boolean(onSelect) && !match.isBye

  const borderClass = isSelected
    ? "border-amber"
    : isActive
      ? "border-amber"
      : match.played
        ? "border-line"
        : "border-line-strong"

  return (
    <button
      type="button"
      onClick={() => onSelect?.(match.id)}
      disabled={!clickable}
      title={
        match.isBye
          ? "Bye — auto advance"
          : `Inspect ${match.left ?? "?"} vs ${match.right ?? "?"}`
      }
      className={`flex h-full w-full flex-col border bg-deep text-left ${borderClass} ${
        clickable
          ? "cursor-pointer transition-colors hover:border-amber"
          : "cursor-default"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b px-2 py-1 font-display text-[0.62rem] font-bold tracking-[0.14em] uppercase ${
          isActive || isSelected
            ? "border-amber/40 bg-amber-fill/15 text-amber"
            : "border-line text-dim"
        }`}
      >
        <span>{match.isBye ? "Bye" : `M${match.index + 1}`}</span>
        {isActive && <span>Next</span>}
        {!isActive && isSelected && <span>View</span>}
      </div>
      <div className="divide-y divide-line">
        <MatchSlot login={match.left} isWinner={leftWin} score={match.leftScore} />
        <MatchSlot
          login={match.right}
          isWinner={rightWin}
          score={match.rightScore}
        />
      </div>
    </button>
  )
}

/**
 * Horizontal + vertical brackets between two rounds.
 * `fromCount` matches in the previous round (even); `toCount` in the next.
 */
function BracketConnectors({
  fromCount,
  toCount,
}: {
  fromCount: number
  toCount: number
}) {
  if (fromCount < 2 || toCount < 1) return <div className="w-6 shrink-0" />

  return (
    <div className="relative w-6 shrink-0" aria-hidden="true">
      <div className="flex h-full flex-col justify-around">
        {Array.from({ length: fromCount }).map((_, childIndex) => {
          const isPairStart = childIndex % 2 === 0
          return (
            <div key={childIndex} className={`relative ${SLOT_CLASS}`}>
              <span className="absolute top-1/2 right-0 h-px w-2.5 bg-line" />
              {isPairStart && (
                <span className="absolute top-1/2 right-2.5 bottom-[-50%] w-px bg-line" />
              )}
              {isPairStart && (
                <span className="absolute top-1/2 right-2.5 h-px w-3.5 bg-line" />
              )}
            </div>
          )
        })}
      </div>
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-around">
        {Array.from({ length: toCount }).map((_, parentIndex) => (
          <div key={parentIndex} className={`relative ${SLOT_CLASS}`}>
            <span className="absolute top-1/2 right-0 h-px w-2.5 bg-line" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BracketView({
  tournament,
  activeMatchId,
  selectedMatchId,
  onSelectMatch,
}: BracketViewProps) {
  const totalRounds = tournament.rounds.length

  return (
    <section
      className="mb-5 border border-line bg-panel p-3.5 sm:p-4.5"
      aria-label="Tournament bracket"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="font-display text-[0.78rem] font-bold tracking-[0.16em] text-dim uppercase">
          Bracket · {tournament.size} fighters
        </h3>
        <span className="font-display text-[0.72rem] tracking-[0.12em] text-dim/80 uppercase">
          {tournament.id}
        </span>
        <span className="text-[0.78rem] text-dim">
          Click a match for power details
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-stretch">
          {tournament.rounds.map((round, roundIndex) => (
            <Fragment key={roundIndex}>
              {roundIndex > 0 && (
                <BracketConnectors
                  fromCount={tournament.rounds[roundIndex - 1].length}
                  toCount={round.length}
                />
              )}
              <div className="flex w-44 flex-col">
                <div className="mb-2 h-5 font-display text-[0.72rem] font-bold tracking-[0.14em] text-amber uppercase">
                  {getRoundLabel(roundIndex, totalRounds)}
                </div>
                <div className="flex flex-1 flex-col justify-around gap-3">
                  {round.map((match) => (
                    <div key={match.id} className={SLOT_CLASS}>
                      <BracketMatch
                        match={match}
                        isActive={match.id === activeMatchId}
                        isSelected={match.id === selectedMatchId}
                        onSelect={onSelectMatch}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
