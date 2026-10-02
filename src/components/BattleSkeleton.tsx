export function BattleSkeleton() {
  return (
    <div
      className="animate-pulse space-y-5.5"
      role="status"
      aria-busy="true"
      aria-label="Loading battle"
    >
      <div className="border border-line bg-panel">
        {/* Mirrors ScoreStrip: stacks on small screens, 3-col on sm+ */}
        <div className="grid grid-cols-1 items-center gap-1.5 border-b border-line bg-deep px-3.5 py-3.5 max-sm:text-center sm:grid-cols-[1fr_auto_1fr] sm:gap-3 sm:px-4.5">
          <div className="flex flex-col gap-0.5 max-sm:items-center">
            <div className="h-3 w-24 bg-line" />
            <div className="h-9 w-16 bg-line-strong" />
          </div>
          <div className="h-6 w-3 bg-line mx-auto" />
          <div className="flex flex-col items-end gap-2 max-sm:items-center">
            <div className="h-3 w-24 bg-line" />
            <div className="h-9 w-16 bg-line-strong" />
          </div>
        </div>

        <div className="space-y-3 px-4.5 pt-3.5 pb-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="h-8 w-28 bg-amber-fill/70" />
            <div className="h-6 w-40 bg-line-strong" />
          </div>
          <div className="h-4 w-full max-w-xl bg-line" />
        </div>
      </div>

      <div className="flex flex-col gap-3.5 md:flex-row">
        {[0, 1].map((side) => (
          <div
            key={side}
            className="flex-1 border border-line bg-panel p-3.5 sm:p-4.5"
            aria-hidden="true"
          >
            <div className="mb-3.5 flex items-start gap-3 border-b border-line pb-3.5 sm:gap-3.5">
              <div className="size-14 shrink-0 bg-line sm:size-[72px]" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-20 bg-line" />
                <div className="h-6 w-full max-w-40 bg-line-strong" />
                <div className="h-3 w-24 bg-line" />
              </div>
              <div className="h-9 w-12 bg-line-strong" />
            </div>

            <div className="mb-4 h-4 w-full bg-line" />

            <div className="mb-4 grid grid-cols-2 border border-line">
              {[0, 1, 2, 3].map((cell) => (
                <div
                  key={cell}
                  className="space-y-2 border-r border-b border-line p-2.5 sm:p-3"
                >
                  <div className="h-3 w-16 bg-line" />
                  <div className="h-5 w-20 bg-line-strong" />
                </div>
              ))}
            </div>

            <div className="mb-3 space-y-2">
              <div className="h-3 w-full bg-line" />
              <div className="h-2.5 w-full bg-deep" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-line" />
              <div className="h-2.5 w-full bg-deep" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
