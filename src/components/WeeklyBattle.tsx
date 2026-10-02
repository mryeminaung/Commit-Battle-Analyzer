import { useEffect, useState } from "react"
import { getCurrentWeeklyMatchup, type WeeklyMatchup } from "@/lib/weekly"
import { ShareBattleButton } from "@/components/ShareBattleButton"

type WeeklyBattleProps = {
  activeWeekId: string | null
  onSelect: (left: string, right: string, weekId: string) => void
}

export function WeeklyBattle({ activeWeekId, onSelect }: WeeklyBattleProps) {
  const [matchup, setMatchup] = useState<WeeklyMatchup>(() =>
    getCurrentWeeklyMatchup(),
  )

  useEffect(() => {
    setMatchup(getCurrentWeeklyMatchup())
  }, [])

  const isActive = activeWeekId === matchup.weekId

  return (
    <section
      className="mb-5 border-2 border-amber bg-panel"
      aria-label="Battle of the week"
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-amber-fill/10 px-3.5 py-2.5 sm:gap-3 sm:px-4.5">
        <span className="inline-flex items-center gap-2 bg-amber-fill px-2.5 py-1 font-display text-[0.68rem] font-extrabold tracking-[0.14em] text-on-amber uppercase sm:text-[0.72rem] sm:tracking-[0.16em]">
          <span className="size-1.5 bg-on-amber" aria-hidden="true" />
          Battle of the week
        </span>
        <span className="font-display text-[0.72rem] font-semibold tracking-[0.12em] text-dim uppercase sm:text-[0.78rem] sm:tracking-[0.14em]">
          {matchup.weekId}
        </span>
        <span className="max-sm:ml-auto">
          <ShareBattleButton
            leftLogin={matchup.left}
            rightLogin={matchup.right}
            weekId={matchup.weekId}
          />
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-3.5 py-4 sm:gap-4 sm:px-4.5">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[1.25rem] leading-tight font-extrabold tracking-[0.04em] text-ink uppercase sm:text-[1.45rem]">
            {matchup.title}
          </p>
          <p className="mt-1 font-display text-[0.95rem] font-semibold tracking-[0.08em] text-dim uppercase">
            {matchup.left} <span className="text-score-red">vs</span>{" "}
            {matchup.right}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelect(matchup.left, matchup.right, matchup.weekId)}
          className={`h-11 shrink-0 cursor-pointer rounded-[2px] px-6 font-display text-[0.95rem] font-extrabold tracking-[0.16em] uppercase transition-colors ${
            isActive
              ? "border border-amber bg-amber-fill/15 text-amber"
              : "bg-amber-fill text-on-amber hover:bg-amber-fill-hover active:bg-amber-fill-active"
          }`}
        >
          {isActive ? "This week's battle" : "Play this matchup"}
        </button>
      </div>
    </section>
  )
}
