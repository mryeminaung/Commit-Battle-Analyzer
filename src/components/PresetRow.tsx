import { presetBattles } from "../data/presets"

type PresetRowProps = {
  onSelect: (left: string, right: string) => void
}

export function PresetRow({ onSelect }: PresetRowProps) {
  return (
    <div className="mb-4.5 flex flex-wrap gap-2">
      {presetBattles.map((battle) => (
        <button
          key={battle.label}
          type="button"
          onClick={() => onSelect(battle.left, battle.right)}
          className="min-h-10 cursor-pointer rounded-[2px] border border-line bg-transparent px-3.5 py-2 font-display text-[0.82rem] font-semibold tracking-[0.1em] text-ink-dim uppercase transition-colors hover:border-amber hover:bg-amber/10 hover:text-amber sm:text-[0.88rem]"
        >
          {battle.label}
        </button>
      ))}
    </div>
  )
}
