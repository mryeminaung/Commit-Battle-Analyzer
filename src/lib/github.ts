import { githubToken } from "./env"
import { MOCK_PROFILES } from "./mocks"
import { buildScoreBreakdown, computePowerScore } from "./scores"
import type {
  BattleProfile,
  GitHubUserResponse,
  RepoResponse,
} from "./types"

const githubHeaders: Record<string, string> = {
  Accept: "application/vnd.github+json",
}

if (githubToken) {
  githubHeaders.Authorization = `Bearer ${githubToken}`
}

export const normalizeLogin = (input: string): string =>
  input.trim().replace(/^@/, "").replace(/\s+/g, "")

export const getAccountAgeDays = (isoDate: string): number => {
  const createdAt = new Date(isoDate).getTime()
  const today = Date.now()
  return Math.max(1, Math.round((today - createdAt) / 86_400_000))
}

export const buildBattleProfile = (
  user: GitHubUserResponse,
  repoCount: number,
): BattleProfile => {
  const accountAgeDays = getAccountAgeDays(user.created_at)
  const activityScore = Math.min(
    100,
    Math.round(
      (repoCount * 5 + user.followers * 0.02 + accountAgeDays / 40) / 1.6,
    ),
  )
  const repoScore = Math.min(100, Math.round((user.public_repos / 40) * 100))
  const followerScore = Math.min(
    100,
    Math.round((user.followers / 150000) * 100),
  )
  const powerScore = computePowerScore(
    repoScore,
    followerScore,
    activityScore,
  )

  return {
    login: user.login,
    name: user.name ?? user.login,
    avatarUrl: user.avatar_url,
    profileUrl: user.html_url,
    bio: user.bio ?? "No bio available.",
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    accountAgeDays,
    activityScore,
    powerScore,
    scoreBreakdown: buildScoreBreakdown(
      repoScore,
      followerScore,
      activityScore,
    ),
  }
}

export const fetchBattleProfile = async (
  login: string,
): Promise<BattleProfile> => {
  const normalized = normalizeLogin(login)

  if (!normalized) {
    throw new Error("Please enter a GitHub username.")
  }

  const key = normalized.toLowerCase()
  if (MOCK_PROFILES[key]) {
    return MOCK_PROFILES[key]
  }

  try {
    const [userResponse, repoResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${normalized}`, {
        headers: githubHeaders,
      }),
      fetch(`https://api.github.com/users/${normalized}/repos?per_page=100`, {
        headers: githubHeaders,
      }),
    ])

    if (!userResponse.ok) {
      throw new Error(`GitHub user "${normalized}" could not be found.`)
    }

    const user = (await userResponse.json()) as GitHubUserResponse
    const repoData = repoResponse.ok
      ? ((await repoResponse.json()) as RepoResponse[])
      : []

    return buildBattleProfile(user, repoData.length)
  } catch (error) {
    const fallback = MOCK_PROFILES[key]
    if (fallback) {
      return fallback
    }

    throw new Error(
      error instanceof Error
        ? error.message
        : "GitHub data could not be loaded. Please try another username.",
    )
  }
}
