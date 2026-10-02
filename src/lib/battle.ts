import { fetchBattleProfile } from "@/lib/github"
import type { BattleProfile, BattleResult, BattleSide } from "@/lib/types"

const pickWinner = (
  left: BattleProfile,
  right: BattleProfile,
): BattleSide | "draw" => {
  if (left.powerScore === right.powerScore) return "draw"
  return left.powerScore > right.powerScore ? "left" : "right"
}

const buildSummary = (
  left: BattleProfile,
  right: BattleProfile,
  winner: BattleSide | "draw",
): string => {
  if (winner === "draw") {
    return `${left.name} and ${right.name} are evenly matched on this quick public-profile snapshot.`
  }

  const winnerName = winner === "left" ? left.name : right.name
  return `${winnerName} takes the round with a stronger public signal across repos, audience reach, and activity.`
}

export const runBattle = async (
  firstUser: string,
  secondUser: string,
): Promise<BattleResult> => {
  const [left, right] = await Promise.all([
    fetchBattleProfile(firstUser),
    fetchBattleProfile(secondUser),
  ])

  const winner = pickWinner(left, right)

  return {
    left,
    right,
    winner,
    summary: buildSummary(left, right, winner),
  }
}
