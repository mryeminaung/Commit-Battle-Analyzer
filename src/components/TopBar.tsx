export function TopBar() {
  return (
    <header className="mb-7">
      <div className="mb-4 flex items-center gap-3 border border-line bg-panel px-3.5 py-2 font-display text-[0.78rem] font-semibold tracking-[0.14em] text-dim uppercase">
        <span className="size-2 shrink-0 bg-score-red" aria-hidden="true" />
        <span className="text-ink-dim">GitHub Public Profile Battle</span>
        <span className="ml-auto hidden sm:inline">PUBLIC DATA</span>
      </div>

      <h1 className="font-display text-[clamp(2.4rem,6vw,4.2rem)] leading-[0.92] font-extrabold tracking-[0.02em] text-ink uppercase">
        Commit Battle Analyzer
      </h1>

      <p className="mt-2.5 max-w-[46ch] text-[0.98rem] text-dim">
        Put two GitHub profiles head-to-head. Power, activity, reach —
        settled on the board.
      </p>
    </header>
  )
}
