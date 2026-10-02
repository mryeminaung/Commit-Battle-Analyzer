type ErrorBannerProps = {
  message: string
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="mb-4.5 border border-line border-l-4 border-l-score-red bg-score-red/12 px-4 py-3 font-display font-semibold tracking-[0.04em] text-[#f0b4b4]"
    >
      {message}
    </div>
  )
}
