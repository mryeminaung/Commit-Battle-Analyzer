import type { FormEvent } from "react"

type BattleFormProps = {
  leftUser: string
  rightUser: string
  loading: boolean
  onLeftChange: (value: string) => void
  onRightChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function BattleForm({
  leftUser,
  rightUser,
  loading,
  onLeftChange,
  onRightChange,
  onSubmit,
}: BattleFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-3.5 grid grid-cols-1 items-end gap-3.5 border border-line bg-panel p-4.5 sm:grid-cols-[1fr_auto_1fr]"
    >
      <label className="flex min-w-0 flex-col gap-2">
        <span className="font-display text-[0.82rem] font-bold tracking-[0.16em] text-dim uppercase">
          Player One
        </span>
        <input
          value={leftUser}
          onChange={(event) => onLeftChange(event.target.value)}
          placeholder="github-handle"
          className="h-12 w-full rounded-[2px] border border-line-strong bg-deep px-3.5 font-display text-[1.15rem] font-semibold tracking-[0.04em] text-ink lowercase outline-none transition-colors placeholder:text-dim/70 focus:border-amber"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full min-w-35 cursor-pointer rounded-[2px] bg-amber px-7 font-display text-[1.05rem] font-extrabold tracking-[0.18em] text-charcoal uppercase transition-colors hover:bg-amber-hot active:bg-amber-deep disabled:cursor-wait disabled:bg-line-strong disabled:text-dim sm:w-auto"
      >
        {loading ? "Loading…" : "Battle"}
      </button>

      <label className="flex min-w-0 flex-col gap-2">
        <span className="font-display text-[0.82rem] font-bold tracking-[0.16em] text-dim uppercase">
          Player Two
        </span>
        <input
          value={rightUser}
          onChange={(event) => onRightChange(event.target.value)}
          placeholder="github-handle"
          className="h-12 w-full rounded-[2px] border border-line-strong bg-deep px-3.5 font-display text-[1.15rem] font-semibold tracking-[0.04em] text-ink lowercase outline-none transition-colors placeholder:text-dim/70 focus:border-amber"
        />
      </label>
    </form>
  )
}
