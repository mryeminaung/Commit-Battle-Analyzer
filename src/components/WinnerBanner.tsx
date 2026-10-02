import type { BattleResult } from "../lib/types"
import { ShareBattleButton } from "./ShareBattleButton"

type WinnerBannerProps = {
  result: BattleResult
}

export function WinnerBanner({ result }: WinnerBannerProps) {
  const winnerName =
    result.winner === "draw"
      ? "Draw game"
      : result.winner === "left"
        ? result.left.name
        : result.right.name

  return (
    <div className="border-b border-line">
      <div className="flex flex-wrap items-center gap-3 px-4.5 pt-3.5 pb-2">
        <span className="inline-flex items-center gap-2 bg-amber-fill px-3 py-1.5 font-display text-[0.78rem] font-extrabold tracking-[0.18em] text-on-amber uppercase">
          <span className="size-1.5 bg-on-amber" aria-hidden="true" />
          Winner
        </span>
        <strong className="font-display text-[1.35rem] font-extrabold tracking-[0.04em] text-ink uppercase">
          {winnerName}
        </strong>

        <span className="ml-auto">
          <ShareBattleButton
            leftLogin={result.left.login}
            rightLogin={result.right.login}
          />
        </span>
      </div>
      <p className="px-4.5 pt-0 pb-4 text-[0.95rem] text-ink-dim">
        {result.summary}
      </p>
    </div>
  )
}
