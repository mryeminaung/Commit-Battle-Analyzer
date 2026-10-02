import { buildScoreBreakdown } from "@/lib/scores"
import type { BattleProfile } from "@/lib/types"

type DemoPerson = {
  login: string
  name: string
  bio: string
  publicRepos: number
  followers: number
  following: number
  accountAgeDays: number
  activityScore: number
  powerScore: number
  avatarUrl: string
}

/**
 * Mock roster used by presets, weekly battles, Boss mode, and demo tournaments.
 * All logins resolve offline — no GitHub API required.
 */
const DEMO_PEOPLE: DemoPerson[] = [
  {
    login: "torvalds",
    name: "Linus Torvalds",
    bio: "Creator of Linux and Git",
    publicRepos: 18,
    followers: 196000,
    following: 3,
    accountAgeDays: 12000,
    activityScore: 96,
    powerScore: 98,
    avatarUrl: "/avatars/user-1.webp",
  },
  {
    login: "dan-abramov",
    name: "Dan Abramov",
    bio: "Co-author of Redux and React",
    publicRepos: 52,
    followers: 166000,
    following: 303,
    accountAgeDays: 6400,
    activityScore: 91,
    powerScore: 94,
    avatarUrl: "/avatars/user-2.webp",
  },
  {
    login: "yyx990803",
    name: "Evan You",
    bio: "Creator of Vue.js",
    publicRepos: 142,
    followers: 315000,
    following: 245,
    accountAgeDays: 8200,
    activityScore: 94,
    powerScore: 96,
    avatarUrl: "/avatars/user-3.webp",
  },
  {
    login: "rich-harris",
    name: "Rich Harris",
    bio: "Creator of Svelte and Rollup",
    publicRepos: 93,
    followers: 92000,
    following: 526,
    accountAgeDays: 6300,
    activityScore: 88,
    powerScore: 90,
    avatarUrl: "/avatars/user-4.webp",
  },
  {
    login: "microsoft",
    name: "Microsoft",
    bio: "Open source software and tools",
    publicRepos: 2050,
    followers: 230000,
    following: 0,
    accountAgeDays: 15000,
    activityScore: 97,
    powerScore: 99,
    avatarUrl: "/avatars/user-5.webp",
  },
  {
    login: "gaearon",
    name: "Dan Abramov",
    bio: "React core team member",
    publicRepos: 105,
    followers: 185000,
    following: 230,
    accountAgeDays: 6200,
    activityScore: 89,
    powerScore: 92,
    avatarUrl: "/avatars/user-6.webp",
  },
  {
    login: "sindresorhus",
    name: "Sindre Sorhus",
    bio: "Full-time open sourcerer",
    publicRepos: 1200,
    followers: 70000,
    following: 200,
    accountAgeDays: 9000,
    activityScore: 93,
    powerScore: 91,
    avatarUrl: "/avatars/user-7.webp",
  },
  {
    login: "kentcdodds",
    name: "Kent C. Dodds",
    bio: "Teacher, maker of EpicReact",
    publicRepos: 300,
    followers: 40000,
    following: 400,
    accountAgeDays: 7000,
    activityScore: 90,
    powerScore: 86,
    avatarUrl: "/avatars/user-8.webp",
  },
  {
    login: "antfu",
    name: "Anthony Fu",
    bio: "Vue / Vite core team",
    publicRepos: 400,
    followers: 35000,
    following: 150,
    accountAgeDays: 4000,
    activityScore: 95,
    powerScore: 84,
    avatarUrl: "/avatars/user-9.webp",
  },
  {
    login: "tj",
    name: "TJ Holowaychuk",
    bio: "Founder of Apex",
    publicRepos: 250,
    followers: 50000,
    following: 80,
    accountAgeDays: 10000,
    activityScore: 70,
    powerScore: 82,
    avatarUrl: "/avatars/user-10.webp",
  },
  {
    login: "isaacs",
    name: "Isaac Z. Schlueter",
    bio: "npm creator",
    publicRepos: 200,
    followers: 30000,
    following: 100,
    accountAgeDays: 11000,
    activityScore: 72,
    powerScore: 78,
    avatarUrl: "/avatars/user-1.webp",
  },
  {
    login: "defunkt",
    name: "Chris Wanstrath",
    bio: "GitHub co-founder",
    publicRepos: 100,
    followers: 25000,
    following: 50,
    accountAgeDays: 13000,
    activityScore: 40,
    powerScore: 75,
    avatarUrl: "/avatars/user-2.webp",
  },
  {
    login: "mojombo",
    name: "Tom Preston-Werner",
    bio: "GitHub co-founder",
    publicRepos: 80,
    followers: 22000,
    following: 40,
    accountAgeDays: 14000,
    activityScore: 45,
    powerScore: 74,
    avatarUrl: "/avatars/user-3.webp",
  },
  {
    login: "wycats",
    name: "Yehuda Katz",
    bio: "Ember / Rust core",
    publicRepos: 150,
    followers: 20000,
    following: 120,
    accountAgeDays: 12000,
    activityScore: 65,
    powerScore: 72,
    avatarUrl: "/avatars/user-4.webp",
  },
  {
    login: "fabpot",
    name: "Fabien Potencier",
    bio: "Symfony creator",
    publicRepos: 180,
    followers: 18000,
    following: 90,
    accountAgeDays: 12500,
    activityScore: 68,
    powerScore: 70,
    avatarUrl: "/avatars/user-5.webp",
  },
  {
    login: "addyosmani",
    name: "Addy Osmani",
    bio: "Chrome DevRel, author",
    publicRepos: 120,
    followers: 25000,
    following: 70,
    accountAgeDays: 9000,
    activityScore: 75,
    powerScore: 71,
    avatarUrl: "/avatars/user-6.webp",
  },
]

const toProfile = (person: DemoPerson): BattleProfile => ({
  login: person.login,
  name: person.name,
  avatarUrl: person.avatarUrl,
  profileUrl: `https://github.com/${person.login}`,
  bio: person.bio,
  publicRepos: person.publicRepos,
  followers: person.followers,
  following: person.following,
  accountAgeDays: person.accountAgeDays,
  activityScore: person.activityScore,
  powerScore: person.powerScore,
  scoreBreakdown: buildScoreBreakdown(
    Math.min(100, Math.round((person.publicRepos / 40) * 100)),
    Math.min(100, Math.round((person.followers / 150000) * 100)),
    person.activityScore,
  ),
})

export const MOCK_PROFILES: Record<string, BattleProfile> = Object.fromEntries(
  DEMO_PEOPLE.map((person) => [person.login, toProfile(person)]),
)

/** Logins available on the demo roster (offline mocks). */
export const MOCK_LOGINS: string[] = DEMO_PEOPLE.map((person) => person.login)
