import type { BattleProfile, BattleSide } from "../lib/types"

type ProfileCardProps = {
  profile: BattleProfile
  side: BattleSide
  isWinner: boolean
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-b border-line px-3 py-2.5 last:border-r-0 [&:nth-child(2n)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0">
      <span className="mb-1 block font-display text-[0.72rem] font-semibold tracking-[0.16em] text-dim uppercase">
        {label}
      </span>
      <strong className="font-display text-[1.25rem] font-bold tabular-nums text-ink">
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
          className={`h-full ${muted ? "bg-ink-dim" : "bg-amber"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export function ProfileCard({ profile, side, isWinner }: ProfileCardProps) {
  return (
    <article
      className={`flex-1 bg-panel p-4.5 ${
        isWinner ? "border-2 border-amber p-[17px]" : "border border-line"
      }`}
    >
      <div className="mb-3.5 flex items-start gap-3.5 border-b border-line pb-3.5">
        <img
          src={profile.avatarUrl}
          alt={`${profile.name} avatar`}
          className="size-[72px] shrink-0 rounded-[2px] border border-line-strong bg-deep object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="mb-1">
            <span className="font-display text-[0.72rem] font-bold tracking-[0.18em] text-dim uppercase">
              {side === "left" ? "Player One" : "Player Two"}
            </span>
            {isWinner && (
              <span className="ml-2 inline-block bg-amber px-2 py-0.5 font-display text-[0.68rem] font-extrabold tracking-[0.16em] text-charcoal uppercase align-middle">
                Champion
              </span>
            )}
          </div>

          <h2 className="font-display text-[1.55rem] leading-[1.05] font-extrabold tracking-[0.03em] text-ink uppercase">
            {profile.name}
          </h2>

          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="font-display text-[0.95rem] font-semibold tracking-[0.04em] text-amber hover:underline"
          >
            @{profile.login}
          </a>
        </div>

        <span
          className={`font-display text-[2.2rem] leading-none font-extrabold tabular-nums ${
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
    </article>
  )
}
