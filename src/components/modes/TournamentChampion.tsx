import { buildStandings, type TournamentState } from "../../lib/tournament"
import { ShareBattleButton } from "../ShareBattleButton"

type TournamentChampionProps = {
  tournament: TournamentState
  onNewTournament: () => void
  getAvatarSrc: (login: string, fallbackUrl: string) => string
}

const statusLabel: Record<string, string> = {
  champion: "Champion",
  "runner-up": "Runner-up",
  eliminated: "Out",
  pending: "—",
}

export function TournamentChampion({
  tournament,
  onNewTournament,
  getAvatarSrc,
}: TournamentChampionProps) {
  const standings = buildStandings(tournament)
  const champion =
    standings.find((row) => row.status === "champion") ??
    (tournament.championLogin
      ? {
          rank: 1,
          login: tournament.championLogin,
          name: tournament.championLogin,
          avatarUrl: "",
          powerScore: 0,
          followers: 0,
          publicRepos: 0,
          status: "champion" as const,
        }
      : null)

  const runnerUp = standings.find((row) => row.status === "runner-up")
  const finalMatch = tournament.rounds[tournament.rounds.length - 1]?.[0]

  return (
    <section className="mb-5 border-2 border-amber bg-panel">
      <div className="border-b border-line bg-amber-fill/15 px-3.5 py-4 sm:px-4.5">
        <p className="font-display text-[0.72rem] font-bold tracking-[0.18em] text-on-amber uppercase">
          Tournament complete
        </p>
        {champion ? (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <img
              src={getAvatarSrc(champion.login, champion.avatarUrl || "/avatars/user-1.webp")}
              alt=""
              className="size-14 rounded-[2px] border border-line-strong object-cover sm:size-16"
            />
            <div className="min-w-0">
              <p className="font-display text-[0.68rem] font-bold tracking-[0.16em] text-amber uppercase">
                Champion
              </p>
              <h2 className="font-display text-[1.6rem] leading-tight font-extrabold tracking-[0.04em] text-ink uppercase sm:text-[2rem]">
                {champion.name || champion.login}
              </h2>
              <p className="font-display text-[0.95rem] font-semibold tracking-[0.08em] text-amber">
                @{champion.login}
              </p>
            </div>
            <span className="ml-auto font-display text-[2.4rem] leading-none font-extrabold tabular-nums text-amber">
              {champion.powerScore}
            </span>
          </div>
        ) : (
          <h2 className="mt-2 font-display text-[1.6rem] font-extrabold text-ink uppercase">
            Champion
          </h2>
        )}

        {finalMatch && finalMatch.left && finalMatch.right && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.9rem] text-ink-dim">
            <span className="font-display tracking-[0.1em] uppercase">
              Final
            </span>
            <strong className="font-display text-[1rem] font-bold tracking-[0.06em] text-ink uppercase">
              {finalMatch.left}
            </strong>
            <span className="font-display font-bold text-score-red">
              {finalMatch.leftScore ?? 0}:{finalMatch.rightScore ?? 0}
            </span>
            <strong className="font-display text-[1rem] font-bold tracking-[0.06em] text-ink uppercase">
              {finalMatch.right}
            </strong>
            {champion && runnerUp && (
              <span className="max-sm:ml-auto">
                <ShareBattleButton
                  leftLogin={champion.login}
                  rightLogin={runnerUp.login}
                />
              </span>
            )}
          </div>
        )}
      </div>

      <div className="px-3.5 py-4 sm:px-4.5">
        <h3 className="mb-3 font-display text-[0.78rem] font-bold tracking-[0.16em] text-dim uppercase">
          Final scoreboard
        </h3>
        <ul className="border border-line">
          {standings.map((row) => (
            <li
              key={row.login}
              className="flex items-center gap-3 border-b border-line px-3 py-2.5 last:border-b-0"
            >
              <span className="w-8 shrink-0 font-display text-[0.85rem] font-bold tabular-nums text-dim">
                #{row.rank}
              </span>
              {row.avatarUrl ? (
                <img
                  src={getAvatarSrc(row.login, row.avatarUrl)}
                  alt=""
                  className="size-8 shrink-0 rounded-[2px] object-cover"
                />
              ) : (
                <span className="size-8 shrink-0 rounded-[2px] bg-line" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[0.95rem] font-bold tracking-[0.04em] text-ink uppercase">
                  {row.name || row.login}
                </span>
                <span className="block truncate font-display text-[0.72rem] tracking-[0.1em] text-dim uppercase">
                  @{row.login} · {statusLabel[row.status] ?? row.status}
                </span>
              </span>
              <span
                className={`font-display text-[1.25rem] font-extrabold tabular-nums ${
                  row.status === "champion" ? "text-amber" : "text-ink"
                }`}
              >
                {row.powerScore}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onNewTournament}
            className="min-h-11 cursor-pointer rounded-[2px] bg-amber-fill px-5 font-display text-[0.9rem] font-extrabold tracking-[0.14em] text-on-amber uppercase transition-colors hover:bg-amber-fill-hover active:bg-amber-fill-active"
          >
            New tournament
          </button>
        </div>
      </div>
    </section>
  )
}
