import type { BattleResult } from "@/lib/types"
import { ShareBattleButton } from "@/components/ShareBattleButton"

type WinnerBannerProps = {
  result: BattleResult
  weekId?: string | null
}

export function WinnerBanner({ result, weekId }: WinnerBannerProps) {
  const winnerName =
    result.winner === "draw"
      ? "Draw game"
      : result.winner === "left"
        ? result.left.name
        : result.right.name

  return (
    <div className="border-b border-line">
      <div className="flex flex-wrap items-center gap-2 px-3.5 pt-3.5 pb-2 sm:gap-3 sm:px-4.5">
        <span className="inline-flex items-center gap-2 bg-amber-fill px-2.5 py-1.5 font-display text-[0.72rem] font-extrabold tracking-[0.16em] text-on-amber uppercase sm:px-3 sm:text-[0.78rem] sm:tracking-[0.18em]">
          <span className="size-1.5 bg-on-amber" aria-hidden="true" />
          Winner
        </span>
        <strong className="font-display text-[1.15rem] font-extrabold tracking-[0.04em] text-ink uppercase sm:text-[1.35rem]">
          {winnerName}
        </strong>

        <span className="max-sm:ml-auto">
          <ShareBattleButton
            leftLogin={result.left.login}
            rightLogin={result.right.login}
            weekId={weekId ?? undefined}
          />
        </span>
      </div>
      <p className="px-3.5 pt-0 pb-4 text-[0.92rem] text-ink-dim sm:px-4.5 sm:text-[0.95rem]">
        {result.summary}
      </p>
    </div>
  )
}
