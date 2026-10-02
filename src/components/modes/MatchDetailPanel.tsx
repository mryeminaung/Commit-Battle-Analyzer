import type { MatchDetail } from "@/lib/tournament"

type MatchDetailPanelProps = {
  detail: MatchDetail
  onClose: () => void
}

function FighterRow({
  login,
  score,
  followers,
  publicRepos,
  isWinner,
  hasStats,
}: {
  login: string | null
  score: number | null
  followers?: number
  publicRepos?: number
  isWinner: boolean
  hasStats: boolean
}) {
  if (!login) {
    return (
      <div className="border-b border-line px-3 py-2.5 font-display text-[0.85rem] tracking-[0.1em] text-dim/60 uppercase last:border-b-0">
        —
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-3 border-b border-line px-3 py-2.5 last:border-b-0 ${
        isWinner ? "bg-amber-fill/15" : ""
      }`}
    >
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate font-display text-[1rem] font-bold tracking-[0.04em] uppercase ${
            isWinner ? "text-amber" : "text-ink"
          }`}
        >
          {login}
        </span>
        <span className="block font-display text-[0.72rem] tracking-[0.1em] text-dim uppercase">
          {hasStats
            ? `followers ${(followers ?? 0).toLocaleString()} · repos ${publicRepos ?? 0}`
            : "awaiting match"}
        </span>
      </span>
      {score !== null && (
        <span
          className={`font-display text-[1.35rem] font-extrabold tabular-nums ${
            isWinner ? "text-amber" : "text-ink"
          }`}
        >
          {score}
        </span>
      )}
      {isWinner && (
        <span className="shrink-0 bg-amber-fill px-2 py-0.5 font-display text-[0.62rem] font-extrabold tracking-[0.14em] text-on-amber uppercase">
          Win
        </span>
      )}
    </div>
  )
}

export function MatchDetailPanel({ detail, onClose }: MatchDetailPanelProps) {
  const winner = detail.winnerLogin?.toLowerCase()
  const leftWin =
    detail.played && winner !== null && detail.left?.toLowerCase() === winner
  const rightWin =
    detail.played && winner !== null && detail.right?.toLowerCase() === winner

  return (
    <section
      className="mb-5 border border-amber bg-panel"
      aria-label="Match details"
    >
      <div className="flex items-center gap-3 border-b border-line bg-amber-fill/10 px-3.5 py-2.5">
        <span className="font-display text-[0.72rem] font-bold tracking-[0.16em] text-amber uppercase">
          {detail.isBye ? "Bye" : detail.roundLabel}
        </span>
        <span className="font-display text-[0.72rem] tracking-[0.12em] text-dim uppercase">
          {detail.isBye
            ? "Auto-advance"
            : detail.played
              ? "Result"
              : "Upcoming"}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto min-h-8 cursor-pointer rounded-[2px] border border-line-strong bg-deep px-3 font-display text-[0.72rem] font-bold tracking-[0.12em] text-ink-dim uppercase transition-colors hover:border-amber hover:text-amber"
        >
          Close
        </button>
      </div>

      <div>
        <FighterRow
          login={detail.left}
          score={detail.leftScore}
          followers={detail.leftStats?.followers}
          publicRepos={detail.leftStats?.publicRepos}
          isWinner={leftWin}
          hasStats={detail.leftStats !== null}
        />
        <FighterRow
          login={detail.right}
          score={detail.rightScore}
          followers={detail.rightStats?.followers}
          publicRepos={detail.rightStats?.publicRepos}
          isWinner={rightWin}
          hasStats={detail.rightStats !== null}
        />
      </div>

      {detail.played && detail.winnerLogin && (
        <p className="border-t border-line px-3.5 py-2.5 font-display text-[0.82rem] font-semibold tracking-[0.06em] text-ink-dim">
          <span className="text-amber uppercase">{detail.winnerLogin}</span>{" "}
          advances · power {detail.leftScore ?? 0}–{detail.rightScore ?? 0}
        </p>
      )}
    </section>
  )
}
