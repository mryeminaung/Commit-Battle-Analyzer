export type GitHubUserResponse = {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export type RepoResponse = {
  id: number
}

export type ScoreBreakdown = {
  repoScore: number
  followerScore: number
  activityScore: number
  repoWeight: number
  followerWeight: number
  activityWeight: number
}

export type BattleProfile = {
  login: string
  name: string
  avatarUrl: string
  profileUrl: string
  bio: string
  publicRepos: number
  followers: number
  following: number
  accountAgeDays: number
  activityScore: number
  powerScore: number
  scoreBreakdown: ScoreBreakdown
}

export type BattleSide = "left" | "right"

export type BattleResult = {
  left: BattleProfile
  right: BattleProfile
  winner: BattleSide | "draw"
  summary: string
}

export type BoutRecord = {
  id: string
  leftLogin: string
  rightLogin: string
  leftName: string
  rightName: string
  leftScore: number
  rightScore: number
  winner: BattleSide | "draw"
  at: number
}
