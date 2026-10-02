import { APP_MODES, MODE_LABELS, type AppMode } from "@/lib/modes"

type ModeSwitcherProps = {
  mode: AppMode
  onChange: (mode: AppMode) => void
}

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <nav
      className="mb-4.5 flex flex-wrap gap-2"
      aria-label="Game mode"
    >
      {APP_MODES.map((item) => {
        const active = item === mode
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={active ? "page" : undefined}
            className={`min-h-10 cursor-pointer rounded-[2px] border px-4 font-display text-[0.82rem] font-bold tracking-[0.14em] uppercase transition-colors sm:text-[0.88rem] ${
              active
                ? "border-amber bg-amber-fill text-on-amber"
                : "border-line bg-transparent text-ink-dim hover:border-amber hover:text-amber"
            }`}
          >
            {MODE_LABELS[item]}
          </button>
        )
      })}
    </nav>
  )
}
