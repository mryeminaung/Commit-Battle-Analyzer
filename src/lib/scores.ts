import type { ScoreBreakdown } from "./types"

export const POWER_WEIGHTS = {
  repos: 0.4,
  followers: 0.25,
  activity: 0.35,
} as const

export const buildScoreBreakdown = (
  repoScore: number,
  followerScore: number,
  activityScore: number,
): ScoreBreakdown => ({
  repoScore,
  followerScore,
  activityScore,
  repoWeight: POWER_WEIGHTS.repos,
  followerWeight: POWER_WEIGHTS.followers,
  activityWeight: POWER_WEIGHTS.activity,
})

export const computePowerScore = (
  repoScore: number,
  followerScore: number,
  activityScore: number,
): number =>
  Math.min(
    100,
    Math.round(
      repoScore * POWER_WEIGHTS.repos +
        followerScore * POWER_WEIGHTS.followers +
        activityScore * POWER_WEIGHTS.activity,
    ),
  )
