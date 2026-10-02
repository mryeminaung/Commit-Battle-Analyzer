import { useCountUp } from "@/hooks/useCountUp"
import type { BattleProfile, BattleResult } from "@/lib/types"

type ScoreStripProps = {
  result: BattleResult
}

function ScoreSide({
  profile,
  isWinner,
  align,
}: {
  profile: BattleProfile
  isWinner: boolean
  align: "left" | "right"
}) {
  const animatedScore = useCountUp(profile.powerScore)

  return (
    <div
      className={`flex min-w-0 flex-col gap-0.5 ${
        align === "right"
          ? "items-end text-right max-sm:items-center max-sm:text-center"
          : "max-sm:items-center max-sm:text-center"
      }`}
    >
      <span className="max-w-full truncate font-display text-[0.75rem] font-semibold tracking-[0.18em] text-dim uppercase">
        {profile.login}
      </span>
      <span
        className={`font-display text-[clamp(1.75rem,5vw,2.8rem)] leading-none font-extrabold tabular-nums ${
          isWinner ? "text-amber" : "text-ink"
        }`}
      >
        {animatedScore}
      </span>
    </div>
  )
}

export function ScoreStrip({ result }: ScoreStripProps) {
  return (
    <div className="grid grid-cols-1 items-center gap-1.5 border-b border-line bg-deep px-3.5 py-3.5 max-sm:text-center sm:grid-cols-[1fr_auto_1fr] sm:gap-3 sm:px-4.5">
      <ScoreSide
        profile={result.left}
        isWinner={result.winner === "left"}
        align="left"
      />
      <span className="font-display text-[1.6rem] leading-none font-bold text-score-red">
        :
      </span>
      <ScoreSide
        profile={result.right}
        isWinner={result.winner === "right"}
        align="right"
      />
    </div>
  )
}
