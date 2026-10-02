import type { BattleResult } from "@/lib/types"
import { ProfileCard } from "@/components/ProfileCard"
import { ScoreStrip } from "@/components/ScoreStrip"
import { WinnerBanner } from "@/components/WinnerBanner"

type ScoreboardProps = {
  result: BattleResult
  weekId: string | null
  getAvatarSrc: (login: string, fallbackUrl: string) => string
  hasCustomAvatar: (login: string) => boolean
  onSelectAvatar: (login: string, path: string) => void
  onResetAvatar: (login: string) => void
}

export function Scoreboard({
  result,
  weekId,
  getAvatarSrc,
  hasCustomAvatar,
  onSelectAvatar,
  onResetAvatar,
}: ScoreboardProps) {
  return (
    <>
      <section className="mb-5.5 border border-line bg-panel" aria-live="polite">
        <ScoreStrip result={result} />

        {weekId && (
          <div className="border-b border-line bg-amber-fill/10 px-3.5 py-2 sm:px-4.5">
            <span className="font-display text-[0.7rem] font-bold tracking-[0.14em] text-amber uppercase sm:text-[0.75rem] sm:tracking-[0.16em]">
              Battle of the week · {weekId}
            </span>
          </div>
        )}

        <WinnerBanner result={result} weekId={weekId} />
      </section>

      <section className="flex flex-col gap-3.5 md:flex-row md:items-stretch">
        <ProfileCard
          profile={result.left}
          side="left"
          isWinner={result.winner === "left"}
          avatarSrc={getAvatarSrc(result.left.login, result.left.avatarUrl)}
          hasCustomAvatar={hasCustomAvatar(result.left.login)}
          onSelectAvatar={(path) => onSelectAvatar(result.left.login, path)}
          onResetAvatar={() => onResetAvatar(result.left.login)}
        />

        <div className="flex items-center justify-center self-center py-0.5 font-display text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold tracking-[0.08em] text-score-red uppercase md:self-center">
          VS
        </div>

        <ProfileCard
          profile={result.right}
          side="right"
          isWinner={result.winner === "right"}
          avatarSrc={getAvatarSrc(result.right.login, result.right.avatarUrl)}
          hasCustomAvatar={hasCustomAvatar(result.right.login)}
          onSelectAvatar={(path) => onSelectAvatar(result.right.login, path)}
          onResetAvatar={() => onResetAvatar(result.right.login)}
        />
      </section>
    </>
  )
}
