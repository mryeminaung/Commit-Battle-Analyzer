const rawToken = import.meta.env.VITE_GITHUB_TOKEN as string | undefined

/** Optional GitHub token from .env (see .env.example). */
export const githubToken: string | undefined =
  rawToken && rawToken.trim().length > 0 ? rawToken.trim() : undefined

export const hasGitHubToken = githubToken !== undefined
