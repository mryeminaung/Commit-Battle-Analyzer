export type WeeklyMatchup = {
  left: string
  right: string
  title: string
  weekId: string
}

/** Fixed weekly matchups — deterministic for everyone in the same ISO week. */
const WEEKLY_CARD: Array<{ left: string; right: string; title: string }> = [
  { left: "torvalds", right: "dan-abramov", title: "Linux vs React" },
  { left: "yyx990803", right: "rich-harris", title: "Vue vs Svelte" },
  { left: "microsoft", right: "gaearon", title: "Org vs Dan" },
  { left: "torvalds", right: "yyx990803", title: "Linus vs Evan" },
  { left: "dan-abramov", right: "rich-harris", title: "Dan vs Rich" },
  { left: "microsoft", right: "torvalds", title: "Microsoft vs Linus" },
  { left: "yyx990803", right: "gaearon", title: "Evan vs Dan" },
  { left: "gaearon", right: "dan-abramov", title: "Two Dans" },
]

export type IsoWeekInfo = {
  isoYear: number
  week: number
  id: string
}

export const getISOWeekInfo = (date: Date = new Date()): IsoWeekInfo => {
  const utc = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  )
  const dayNum = utc.getUTCDay() || 7
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum)
  const isoYear = utc.getUTCFullYear()
  const yearStart = new Date(Date.UTC(isoYear, 0, 1))
  const week = Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  )

  return {
    isoYear,
    week,
    id: `${isoYear}-W${String(week).padStart(2, "0")}`,
  }
}

export const getCurrentWeeklyMatchup = (
  date: Date = new Date(),
): WeeklyMatchup => {
  const { id, week, isoYear } = getISOWeekInfo(date)
  const index =
    (isoYear * 53 + week) % WEEKLY_CARD.length
  const card = WEEKLY_CARD[index]

  return { ...card, weekId: id }
}

export const parseWeekId = (
  raw: string | null | undefined,
): IsoWeekInfo | null => {
  if (!raw) return null
  const value = raw.trim().toUpperCase()
  if (value === "CURRENT" || value === "THIS") {
    return getISOWeekInfo()
  }

  const match = /^(\d{4})-W(\d{1,2})$/.exec(value)
  if (!match) return null

  const isoYear = Number(match[1])
  const week = Number(match[2])
  if (!Number.isFinite(isoYear) || week < 1 || week > 53) return null

  return { isoYear, week, id: `${isoYear}-W${String(week).padStart(2, "0")}` }
}

export const getWeeklyMatchupForWeekId = (
  weekId: string,
): WeeklyMatchup | null => {
  const info = parseWeekId(weekId)
  if (!info) return null

  const index = (info.isoYear * 53 + info.week) % WEEKLY_CARD.length
  const card = WEEKLY_CARD[index]
  return { ...card, weekId: info.id }
}
