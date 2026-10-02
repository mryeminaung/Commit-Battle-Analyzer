/** Demo lineups for Tournament / Standings setup. */

export type DemoLineup = {
  id: "4" | "6" | "16"
  label: string
  logins: string[]
}

export const DEMO_LINEUPS: DemoLineup[] = [
  {
    id: "4",
    label: "Demo 4",
    logins: [
      "torvalds",
      "dan-abramov",
      "yyx990803",
      "rich-harris",
    ],
  },
  {
    id: "6",
    label: "Demo 6",
    logins: [
      "torvalds",
      "dan-abramov",
      "yyx990803",
      "rich-harris",
      "microsoft",
      "gaearon",
    ],
  },
  {
    id: "16",
    label: "Demo 16",
    logins: [
      "torvalds",
      "dan-abramov",
      "yyx990803",
      "rich-harris",
      "microsoft",
      "gaearon",
      "sindresorhus",
      "kentcdodds",
      "antfu",
      "tj",
      "isaacs",
      "defunkt",
      "mojombo",
      "wycats",
      "fabpot",
      "addyosmani",
    ],
  },
]

export const getDemoLineup = (id: DemoLineup["id"]): DemoLineup | undefined =>
  DEMO_LINEUPS.find((lineup) => lineup.id === id)
