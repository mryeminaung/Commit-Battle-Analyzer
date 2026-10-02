import { useCallback } from "react"
import { useStandings } from "../../hooks/useStandings"
import { readPlayersFromUrl } from "../../lib/modes"
import { ErrorBanner } from "../ErrorBanner"
import { PlayerSetupForm } from "./PlayerSetupForm"

const DEMO_ROSTER = [
  "torvalds",
  "dan-abramov",
  "yyx990803",
  "rich-harris",
  "microsoft",
  "gaearon",
].join("\n")

type StandingsModeProps = {
  getAvatarSrc: (login: string, fallbackUrl: string) => string
}

export function StandingsMode({ getAvatarSrc }: StandingsModeProps) {
  const standings = useStandings({ initialLogins: readPlayersFromUrl() })

  const handleSubmit = useCallback(
    (text: string) => {
      void standings.loadStandings(text)
    },
    [standings],
  )

  if (standings.phase === "board" && standings.entries.length > 0) {
    return (
      <section className="mb-5 border border-line bg-panel p-3.5 sm:p-4.5">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h2 className="font-display text-[1.45rem] font-extrabold tracking-[0.04em] text-ink uppercase">
            Standings
          </h2>
          <button
            type="button"
            onClick={standings.resetToSetup}
            className="min-h-9 ml-auto cursor-pointer rounded-[2px] border border-line-strong bg-deep px-4 font-display text-[0.82rem] font-bold tracking-[0.14em] text-ink-dim uppercase transition-colors hover:border-amber hover:text-amber"
          >
            New board
          </button>
        </div>

        <ul className="border border-line">
          {standings.entries.map((entry) => (
            <li
              key={entry.login}
              className="flex items-center gap-3 border-b border-line px-3 py-2.5 last:border-b-0"
            >
              <span
                className={`w-8 shrink-0 font-display text-[0.95rem] font-extrabold tabular-nums ${
                  entry.rank === 1 && !entry.error ? "text-amber" : "text-dim"
                }`}
              >
                #{entry.rank}
              </span>
              {entry.avatarUrl ? (
                <img
                  src={getAvatarSrc(entry.login, entry.avatarUrl)}
                  alt=""
                  className="size-9 shrink-0 rounded-[2px] object-cover"
                />
              ) : (
                <span className="size-9 shrink-0 rounded-[2px] bg-line" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[1rem] font-bold tracking-[0.04em] text-ink uppercase">
                  {entry.name || entry.login}
                </span>
                <span className="block truncate font-display text-[0.72rem] tracking-[0.1em] text-dim uppercase">
                  @{entry.login}
                  {entry.error
                    ? ` · ${entry.error}`
                    : ` · repos ${entry.publicRepos} · followers ${entry.followers.toLocaleString()}`}
                </span>
              </span>
              {!entry.error && (
                <span
                  className={`font-display text-[1.35rem] font-extrabold tabular-nums ${
                    entry.rank === 1 ? "text-amber" : "text-ink"
                  }`}
                >
                  {entry.powerScore}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <>
      <PlayerSetupForm
        heading="Multiplayer standings"
        description="Enter any lineup. Everyone is scored once on public GitHub signals and ranked on the board — no bracket, just the leaderboard."
        ctaLabel="Score lineup"
        loginsText={standings.loginsText}
        onLoginsChange={standings.setLoginsText}
        error={standings.setupError}
        busy={standings.loading}
        onSubmit={handleSubmit}
        onDemoFill={() => standings.setLoginsText(DEMO_ROSTER)}
      />

      {standings.error && (
        <ErrorBanner
          message={standings.error.message}
          rateLimited={standings.error.rateLimited}
          onRetry={() => void standings.loadStandings(standings.loginsText)}
          retrying={standings.loading}
        />
      )}

      {standings.phase === "loading" && (
        <p
          role="status"
          className="mb-4 font-display text-[0.9rem] font-semibold tracking-[0.12em] text-dim uppercase"
        >
          Scoring fighters…
        </p>
      )}
    </>
  )
}
