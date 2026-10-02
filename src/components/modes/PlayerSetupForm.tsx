import type { FormEvent, ReactNode } from "react"
import type { DemoLineup } from "@/lib/demos"
import {
  BRACKET_SIZE_AUTO,
  BRACKET_SIZE_OPTIONS,
  MAX_TOURNAMENT_PLAYERS,
  MIN_TOURNAMENT_PLAYERS,
  nextPowerOfTwo,
} from "@/lib/tournament"

type PlayerSetupFormProps = {
  heading: string
  description: string
  ctaLabel: string
  loginsText: string
  onLoginsChange: (value: string) => void
  /** 0 = auto (next power of two). Tournament only. */
  bracketSize?: number
  onBracketSizeChange?: (size: number) => void
  demoLineups?: DemoLineup[]
  onDemoSelect?: (lineup: DemoLineup) => void
  error?: string | null
  busy?: boolean
  onSubmit: (loginsText: string, bracketSize: number) => void
  extraActions?: ReactNode
}

const sizeChipClass = (active: boolean) =>
  `min-h-9 cursor-pointer rounded-[2px] border px-3 font-display text-[0.82rem] font-bold tracking-[0.12em] tabular-nums uppercase transition-colors ${
    active
      ? "border-amber bg-amber-fill/20 text-amber"
      : "border-line bg-transparent text-ink-dim hover:border-amber hover:text-amber"
  }`

export function PlayerSetupForm({
  heading,
  description,
  ctaLabel,
  loginsText,
  onLoginsChange,
  bracketSize,
  onBracketSizeChange,
  demoLineups,
  onDemoSelect,
  error,
  busy,
  onSubmit,
  extraActions,
}: PlayerSetupFormProps) {
  const showBracket = bracketSize !== undefined && onBracketSizeChange

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(loginsText, bracketSize ?? BRACKET_SIZE_AUTO)
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
            placeholder={
              "one handle per line\n\ntorvalds\ndan-abramov\nyyx990803\nrich-harris"
            }
            className="w-full resize-y rounded-[2px] border border-line-strong bg-deep px-3.5 py-3 font-display text-[1.05rem] font-semibold tracking-[0.03em] text-ink outline-none transition-colors placeholder:text-dim/70 focus:border-amber"
          />
        </label>

        {showBracket && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[0.72rem] font-bold tracking-[0.14em] text-dim uppercase">
              Bracket
            </span>
            <button
              type="button"
              onClick={() => onBracketSizeChange!(BRACKET_SIZE_AUTO)}
              className={sizeChipClass(bracketSize === BRACKET_SIZE_AUTO)}
            >
              Auto
            </button>
            {BRACKET_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onBracketSizeChange!(size)}
                className={sizeChipClass(bracketSize === size)}
              >
                {size}
              </button>
            ))}
            <span className="text-[0.8rem] text-dim">
              Auto → 4 / 8 / 16 from your lineup · 6 players = 8 bracket + BYEs
            </span>
          </div>
        )}

        {demoLineups && demoLineups.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[0.72rem] font-bold tracking-[0.14em] text-dim uppercase">
              Demo
            </span>
            {demoLineups.map((lineup) => (
              <button
                key={lineup.id}
                type="button"
                onClick={() => onDemoSelect?.(lineup)}
                className={sizeChipClass(false)}
              >
                {lineup.label}
              </button>
            ))}
            <span className="text-[0.8rem] text-dim">
              {MIN_TOURNAMENT_PLAYERS}–{MAX_TOURNAMENT_PLAYERS} fighters · mock
              roster, no API
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
          {extraActions}
        </div>
      </form>
    </section>
  )
}

/** Convenience: how many players a demo will imply for bracket size UI. */
export const demoBracketHint = (playerCount: number): number =>
  nextPowerOfTwo(Math.max(MIN_TOURNAMENT_PLAYERS, playerCount))
