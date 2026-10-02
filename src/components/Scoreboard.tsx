import type { BattleResult } from "../lib/types"
import { ProfileCard } from "./ProfileCard"
import { ScoreStrip } from "./ScoreStrip"
import { WinnerBanner } from "./WinnerBanner"

type ScoreboardProps = {
  result: BattleResult
}

export function Scoreboard({ result }: ScoreboardProps) {
  return (
    <>
      <section className="mb-5.5 border border-line bg-panel" aria-live="polite">
        <ScoreStrip result={result} />
        <WinnerBanner result={result} />
      </section>

      <section className="flex flex-col gap-3.5 md:flex-row md:items-stretch">
        <ProfileCard
          profile={result.left}
          side="left"
          isWinner={result.winner === "left"}
        />

        <div className="flex items-center justify-center self-center font-display text-[clamp(1.8rem,3vw,2.4rem)] font-extrabold tracking-[0.08em] text-score-red uppercase md:self-center">
          VS
        </div>

        <ProfileCard
          profile={result.right}
          side="right"
          isWinner={result.winner === "right"}
        />
      </section>
    </>
  )
}
