import type { FormEvent, ReactNode } from "react"
import { MAX_TOURNAMENT_PLAYERS, MIN_TOURNAMENT_PLAYERS } from "../../lib/tournament"

const BRACKET_SIZES = [4, 8, 16] as const

const DEMO_ROSTER = [
  "torvalds",
  "dan-abramov",
  "yyx990803",
  "rich-harris",
  "microsoft",
  "gaearon",
].join("\n")

type PlayerSetupFormProps = {
  heading: string
  description: string
  ctaLabel: string
  loginsText: string
  onLoginsChange: (value: string) => void
  /** When provided, show bracket-size chips (tournament). */
  bracketSize?: number
  onBracketSizeChange?: (size: number) => void
  error?: string | null
  busy?: boolean
  onSubmit: (loginsText: string, bracketSize: number) => void
  onDemoFill?: () => void
  extraActions?: ReactNode
}

export function PlayerSetupForm({
  heading,
  description,
  ctaLabel,
  loginsText,
  onLoginsChange,
  bracketSize,
  onBracketSizeChange,
  error,
  busy,
  onSubmit,
  onDemoFill,
  extraActions,
}: PlayerSetupFormProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(loginsText, bracketSize ?? MIN_TOURNAMENT_PLAYERS)
  }

  return (
    <section className="mb-5 border border-line bg-panel p-3.5 sm:p-4.5">
      <h2 className="font-display text-[1.45rem] leading-tight font-extrabold tracking-[0.04em] text-ink uppercase sm:text-[1.65rem]">
        {heading}
      </h2>
      <p className="mt-1.5 mb-4 text-[0.92rem] text-ink-dim">{description}</p>

      <form onSubmit={submit} className="space-y-4">
        <label className="flex flex-col gap-2">
          <span className="font-display text-[0.78rem] font-bold tracking-[0.16em] text-dim uppercase">
            GitHub usernames
          </span>
          <textarea
            value={loginsText}
            onChange={(event) => onLoginsChange(event.target.value)}
            rows={6}
            spellCheck={false}
            placeholder={"one handle per line\n\n" + DEMO_ROSTER.split("\n").slice(0, 3).join("\n")}
            className="w-full resize-y rounded-[2px] border border-line-strong bg-deep px-3.5 py-3 font-display text-[1.05rem] font-semibold tracking-[0.03em] text-ink outline-none transition-colors placeholder:text-dim/70 focus:border-amber"
          />
        </label>

        {bracketSize !== undefined && onBracketSizeChange && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[0.72rem] font-bold tracking-[0.14em] text-dim uppercase">
              Bracket size
            </span>
            {BRACKET_SIZES.map((size) => {
              const active = size === bracketSize
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onBracketSizeChange(size)}
                  className={`min-h-9 cursor-pointer rounded-[2px] border px-3 font-display text-[0.82rem] font-bold tracking-[0.12em] tabular-nums uppercase transition-colors ${
                    active
                      ? "border-amber bg-amber-fill/20 text-amber"
                      : "border-line bg-transparent text-ink-dim hover:border-amber hover:text-amber"
                  }`}
                >
                  {size}
                </button>
              )
            })}
            <span className="text-[0.8rem] text-dim">
              {MIN_TOURNAMENT_PLAYERS}–{MAX_TOURNAMENT_PLAYERS} fighters · BYEs pad
              the bracket
            </span>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="border-l-4 border-score-red bg-score-red/12 px-3 py-2 font-display text-[0.88rem] font-semibold tracking-[0.04em] text-score-red"
          >
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={busy}
            className="min-h-11 shrink-0 cursor-pointer rounded-[2px] bg-amber-fill px-6 font-display text-[0.95rem] font-extrabold tracking-[0.16em] text-on-amber uppercase transition-colors hover:bg-amber-fill-hover active:bg-amber-fill-active disabled:cursor-wait disabled:bg-line-strong disabled:text-dim"
          >
            {busy ? "Loading…" : ctaLabel}
          </button>

          {onDemoFill && (
            <button
              type="button"
              onClick={onDemoFill}
              className="min-h-11 cursor-pointer rounded-[2px] border border-line-strong bg-deep px-4 font-display text-[0.85rem] font-bold tracking-[0.12em] text-ink-dim uppercase transition-colors hover:border-amber hover:text-amber"
            >
              Fill demo roster
            </button>
          )}

          {extraActions}
        </div>
      </form>
    </section>
  )
}
