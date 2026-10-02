import type { BoutRecord } from "@/lib/types"

type RecentBattlesProps = {
  bouts: BoutRecord[]
  onSelect: (left: string, right: string) => void
  onClear: () => void
}

const formatTime = (at: number): string => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(at))
  } catch {
    return ""
  }
}

export function RecentBattles({ bouts, onSelect, onClear }: RecentBattlesProps) {
  if (bouts.length === 0) return null

  return (
    <section className="mb-5" aria-label="Recent battles">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="font-display text-[0.78rem] font-bold tracking-[0.16em] text-dim uppercase">
          Recent bouts
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer border border-line bg-transparent px-2.5 py-1 font-display text-[0.72rem] font-semibold tracking-[0.12em] text-dim uppercase transition-colors hover:border-score-red hover:text-score-red"
        >
          Clear
        </button>
      </div>

      <ul className="flex flex-wrap gap-2">
        {bouts.map((bout) => {
          const leftWon = bout.winner === "left"
          const rightWon = bout.winner === "right"

          return (
            <li key={bout.id}>
              <button
                type="button"
                onClick={() => onSelect(bout.leftLogin, bout.rightLogin)}
                title={`${formatTime(bout.at)} — ${bout.leftName} vs ${bout.rightName}`}
                className="cursor-pointer rounded-[2px] border border-line bg-panel px-3 py-1.5 font-display text-[0.85rem] font-semibold tracking-[0.06em] text-ink-dim uppercase transition-colors hover:border-amber hover:text-amber"
              >
                <span className={leftWon ? "text-amber" : undefined}>
                  {bout.leftLogin}
                </span>
                <span className="mx-1.5 tabular-nums text-dim">
                  {bout.leftScore}:{bout.rightScore}
                </span>
                <span className={rightWon ? "text-amber" : undefined}>
                  {bout.rightLogin}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
