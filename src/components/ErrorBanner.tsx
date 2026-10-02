type ErrorBannerProps = {
  message: string
  rateLimited?: boolean
  onRetry?: () => void
  retrying?: boolean
}

export function ErrorBanner({
  message,
  rateLimited = false,
  onRetry,
  retrying = false,
}: ErrorBannerProps) {
  const accent = rateLimited
    ? "border-l-amber bg-amber-fill/10"
    : "border-l-score-red bg-score-red/12"
  const text = rateLimited ? "text-amber" : "text-score-red"

  return (
    <div
      role="alert"
      className={`mb-4.5 border border-line border-l-4 px-3 py-3 sm:px-4 ${accent} ${text}`}
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold tracking-[0.04em]">{message}</p>

          {rateLimited && (
            <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-dim">
              Unauthenticated GitHub calls are limited to 60/hour. Add{" "}
              <code className="rounded-[2px] bg-deep px-1.5 py-0.5 font-display text-[0.85rem] tracking-[0.04em] text-ink">
                VITE_GITHUB_TOKEN
              </code>{" "}
              to <code className="rounded-[2px] bg-deep px-1.5 py-0.5 font-display text-[0.85rem] tracking-[0.04em] text-ink">.env</code>{" "}
              (see README) and restart the dev server.
            </p>
          )}
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={retrying}
            className="h-9 shrink-0 cursor-pointer rounded-[2px] border border-line-strong bg-deep px-4 font-display text-[0.82rem] font-bold tracking-[0.14em] text-ink-dim uppercase transition-colors hover:border-amber hover:text-amber disabled:cursor-wait disabled:opacity-60 max-sm:w-full max-sm:text-center"
          >
            {retrying ? "Retrying…" : "Retry"}
          </button>
        )}
      </div>
    </div>
  )
}
