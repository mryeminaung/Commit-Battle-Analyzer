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
}

export type BattleSide = "left" | "right"

export type BattleResult = {
  left: BattleProfile
  right: BattleProfile
  winner: BattleSide | "draw"
  summary: string
}
