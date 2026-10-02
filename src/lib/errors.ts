export class RateLimitError extends Error {
  constructor(message?: string) {
    super(
      message ??
        "GitHub API rate limit hit. Add VITE_GITHUB_TOKEN to .env and restart the dev server.",
    )
    this.name = "RateLimitError"
  }
}

export const isRateLimitError = (error: unknown): error is RateLimitError =>
  error instanceof RateLimitError ||
  (typeof error === "object" &&
    error !== null &&
    (error as { name?: string }).name === "RateLimitError")

export type BattleErrorState = {
  message: string
  rateLimited: boolean
}

export const toBattleError = (error: unknown): BattleErrorState => {
  if (isRateLimitError(error)) {
    return { message: error.message, rateLimited: true }
  }

  return {
    message:
      error instanceof Error
        ? error.message
        : "Something went wrong while loading the battle data.",
    rateLimited: false,
  }
}
