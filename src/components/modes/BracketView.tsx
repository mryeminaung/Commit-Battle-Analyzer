import { getRoundLabel, type TournamentState } from "../../lib/tournament"

type BracketViewProps = {
  tournament: TournamentState
  activeMatchId?: string | null
}

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
}: {
  match: TournamentState["rounds"][number][number]
  isActive: boolean
}) {
  const winner = match.winnerLogin?.toLowerCase()
  const leftWin =
    match.played && winner !== null && match.left?.toLowerCase() === winner
  const rightWin =
    match.played && winner !== null && match.right?.toLowerCase() === winner

  return (
    <div
      className={`w-44 border bg-deep ${
        isActive
          ? "border-amber"
          : match.played
            ? "border-line"
            : "border-line-strong"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b px-2 py-1 font-display text-[0.62rem] font-bold tracking-[0.14em] uppercase ${
          isActive
            ? "border-amber/40 bg-amber-fill/15 text-amber"
            : "border-line text-dim"
        }`}
      >
        <span>{match.isBye ? "Bye" : `M${match.index + 1}`}</span>
        {isActive && <span>Next</span>}
      </div>
      <div className="divide-y divide-line">
        <MatchSlot login={match.left} isWinner={leftWin} score={match.leftScore} />
        <MatchSlot
          login={match.right}
          isWinner={rightWin}
          score={match.rightScore}
        />
      </div>
    </div>
  )
}

export function BracketView({ tournament, activeMatchId }: BracketViewProps) {
  const totalRounds = tournament.rounds.length

  return (
    <section className="mb-5 border border-line bg-panel p-3.5 sm:p-4.5" aria-label="Tournament bracket">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="font-display text-[0.78rem] font-bold tracking-[0.16em] text-dim uppercase">
          Bracket · {tournament.size} fighters
        </h3>
        <span className="font-display text-[0.72rem] tracking-[0.12em] text-dim/80 uppercase">
          {tournament.id}
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-4">
          {tournament.rounds.map((round, roundIndex) => (
            <div key={roundIndex} className="flex w-44 flex-col gap-3">
              <div className="font-display text-[0.72rem] font-bold tracking-[0.14em] text-amber uppercase">
                {getRoundLabel(roundIndex, totalRounds)}
              </div>
              <div className="flex flex-1 flex-col justify-around gap-3">
                {round.map((match) => (
                  <BracketMatch
                    key={match.id}
                    match={match}
                    isActive={match.id === activeMatchId}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
