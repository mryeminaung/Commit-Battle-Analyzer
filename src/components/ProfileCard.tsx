import { useState } from "react"
import { DEFAULT_FALLBACK_AVATAR } from "@/lib/avatars"
import type { BattleProfile, BattleSide, ScoreBreakdown } from "@/lib/types"
import { AvatarPicker } from "@/components/AvatarPicker"

type ProfileCardProps = {
  profile: BattleProfile
  side: BattleSide
  isWinner: boolean
  avatarSrc: string
  hasCustomAvatar: boolean
  onSelectAvatar: (path: string) => void
  onResetAvatar: () => void
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-b border-line px-2.5 py-2.5 last:border-r-0 [&:nth-child(2n)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0 sm:px-3">
      <span className="mb-1 block font-display text-[0.62rem] font-semibold tracking-[0.12em] text-dim uppercase sm:text-[0.72rem] sm:tracking-[0.16em]">
        {label}
      </span>
      <strong className="font-display text-[1.15rem] font-bold tabular-nums text-ink sm:text-[1.25rem]">
        {value}
      </strong>
    </div>
  )
}

function MetricBar({
  label,
  value,
  muted,
}: {
  label: string
  value: number
  muted?: boolean
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1.5 flex items-baseline justify-between gap-2.5">
        <span className="font-display text-[0.72rem] font-semibold tracking-[0.16em] text-dim uppercase">
          {label}
        </span>
        <strong className="font-display text-[1rem] font-bold tabular-nums text-ink">
          {value}
        </strong>
      </div>
      <div className="h-2.5 overflow-hidden border border-line bg-deep">
        <div
          className={`h-full ${muted ? "bg-line-strong" : "bg-amber-fill"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function MathRow({
  label,
  weight,
  score,
}: {
  label: string
  weight: number
  score: number
}) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-line pb-1.5 last:border-b-0 last:pb-0">
      <span className="font-display text-[0.78rem] font-semibold tracking-[0.1em] text-dim uppercase">
        {label}{" "}
        <span className="text-ink-dim/70 normal-case tracking-normal">
          ({Math.round(weight * 100)}%)
        </span>
      </span>
      <strong className="font-display text-[1rem] font-bold tabular-nums text-ink">
        {score}
      </strong>
    </li>
  )
}

function ScoreMath({ breakdown }: { breakdown: ScoreBreakdown }) {
  return (
    <div className="mb-4 border border-line bg-deep p-3">
      <p className="mb-2 font-display text-[0.72rem] font-bold tracking-[0.16em] text-dim uppercase">
        How power was calculated
      </p>
      <ul className="space-y-1.5">
        <MathRow
          label="Repos"
          weight={breakdown.repoWeight}
          score={breakdown.repoScore}
        />
        <MathRow
          label="Followers"
          weight={breakdown.followerWeight}
          score={breakdown.followerScore}
        />
        <MathRow
          label="Activity"
          weight={breakdown.activityWeight}
          score={breakdown.activityScore}
        />
      </ul>
      <p className="mt-2.5 font-display text-[0.82rem] font-semibold tracking-[0.04em] text-ink-dim">
        repos×{breakdown.repoWeight.toFixed(2)} + followers×
        {breakdown.followerWeight.toFixed(2)} + activity×
        {breakdown.activityWeight.toFixed(2)}
      </p>
    </div>
  )
}

export function ProfileCard({
  profile,
  side,
  isWinner,
  avatarSrc,
  hasCustomAvatar,
  onSelectAvatar,
  onResetAvatar,
}: ProfileCardProps) {
  const [showMath, setShowMath] = useState(false)

  return (
    <article
      className={`flex-1 bg-panel p-3.5 sm:p-4.5 ${
        isWinner ? "border-2 border-amber p-[15px] sm:p-[17px]" : "border border-line"
      }`}
    >
      <div className="mb-3.5 flex items-start gap-3 border-b border-line pb-3.5 sm:gap-3.5">
        <AvatarPicker
          login={profile.login}
          avatarSrc={avatarSrc}
          fallbackUrl={profile.avatarUrl || DEFAULT_FALLBACK_AVATAR}
          hasCustomAvatar={hasCustomAvatar}
          onSelect={onSelectAvatar}
          onReset={onResetAvatar}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-display text-[0.68rem] font-bold tracking-[0.16em] text-dim uppercase sm:text-[0.72rem] sm:tracking-[0.18em]">
              {side === "left" ? "Player One" : "Player Two"}
            </span>
            {isWinner && (
              <span className="inline-block bg-amber-fill px-2 py-0.5 font-display text-[0.62rem] font-extrabold tracking-[0.14em] text-on-amber uppercase sm:text-[0.68rem] sm:tracking-[0.16em]">
                Champion
              </span>
            )}
          </div>

          <h2 className="font-display text-[1.25rem] leading-[1.05] font-extrabold tracking-[0.03em] text-ink uppercase sm:text-[1.55rem]">
            {profile.name}
          </h2>

          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="font-display text-[0.9rem] font-semibold tracking-[0.04em] text-amber hover:underline sm:text-[0.95rem]"
          >
            @{profile.login}
          </a>
        </div>

        <span
          className={`font-display text-[1.75rem] leading-none font-extrabold tabular-nums sm:text-[2.2rem] ${
            isWinner ? "text-amber" : "text-ink"
          }`}
        >
          {profile.powerScore}
        </span>
      </div>

      <p className="mb-4 min-h-11 text-[0.92rem] text-ink-dim">{profile.bio}</p>

      <div className="mb-4 grid grid-cols-2 border border-line">
        <StatCell label="Repos" value={String(profile.publicRepos)} />
        <StatCell label="Followers" value={profile.followers.toLocaleString()} />
        <StatCell label="Following" value={String(profile.following)} />
        <StatCell label="Power" value={String(profile.powerScore)} />
      </div>

      <MetricBar label="Power rating" value={profile.powerScore} />
      <MetricBar label="Activity" value={profile.activityScore} muted />

      <button
        type="button"
        onClick={() => setShowMath((open) => !open)}
        aria-expanded={showMath}
        className="mt-3 min-h-10 w-full cursor-pointer rounded-[2px] border border-line bg-transparent px-3 py-2 font-display text-[0.78rem] font-bold tracking-[0.14em] text-dim uppercase transition-colors hover:border-amber hover:text-amber"
      >
        {showMath ? "Hide score breakdown" : "Explain score"}
      </button>

      {showMath && <ScoreMath breakdown={profile.scoreBreakdown} />}
    </article>
  )
}
