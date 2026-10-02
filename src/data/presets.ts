export type PresetBattle = {
  label: string
  left: string
  right: string
}

export const presetBattles: PresetBattle[] = [
  { label: "Linus vs. Dan", left: "torvalds", right: "dan-abramov" },
  { label: "Evan vs. Rich", left: "yyx990803", right: "rich-harris" },
  { label: "Microsoft vs. Dan", left: "microsoft", right: "gaearon" },
]
