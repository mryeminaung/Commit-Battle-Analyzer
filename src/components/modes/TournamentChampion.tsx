import { buildStandings, type StandingRow, type TournamentState } from "@/lib/tournament"
import { ShareBattleButton } from "@/components/ShareBattleButton"

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

function PodiumBlock({
  row,
  place,
  getAvatarSrc,
}: {
  row: StandingRow | undefined
  place: 1 | 2 | 3
  getAvatarSrc: (login: string, fallbackUrl: string) => string
}) {
  if (!row) {
    return (
      <div className="w-28 border border-line bg-deep p-3 text-center sm:w-36">
        <p className="font-display text-[0.68rem] font-bold tracking-[0.14em] text-dim uppercase">
          #{place}
        </p>
        <p className="mt-2 font-display text-[0.85rem] text-dim/60 uppercase">
          —
        </p>
        <div className="mt-3 h-12 border border-line bg-line/40" />
      </div>
    )
  }

  const isChampion = place === 1
  const pedestal =
    place === 1
      ? "h-28 border-2 border-amber bg-amber-fill/35"
      : place === 2
        ? "h-20 border border-line-strong bg-line-strong/40"
        : "h-14 border border-line bg-line/40"

  return (
    <div
      className={`w-28 p-3 text-center sm:w-36 ${
        isChampion
          ? "border-2 border-amber bg-amber-fill/12"
          : "border border-line bg-deep"
      }`}
    >
      <p
        className={`font-display text-[0.68rem] font-bold tracking-[0.16em] uppercase ${
          isChampion ? "text-on-amber" : "text-dim"
        }`}
      >
        {isChampion ? "Champion" : `#${place}`}
      </p>
      {row.avatarUrl ? (
        <img
          src={getAvatarSrc(row.login, row.avatarUrl)}
          alt=""
          className={`mx-auto mt-2 rounded-[2px] border object-cover ${
            isChampion
              ? "size-14 border-amber sm:size-16"
              : "size-11 border-line-strong sm:size-12"
          }`}
        />
      ) : (
        <div
          className={`mx-auto mt-2 rounded-[2px] ${
            isChampion
              ? "size-14 border-2 border-amber bg-amber-fill/30 sm:size-16"
              : "size-11 border border-line-strong bg-line sm:size-12"
          }`}
        />
      )}
      <p
        className={`mt-2 truncate font-display font-bold tracking-[0.04em] uppercase ${
          isChampion
            ? "text-[1rem] text-amber sm:text-[1.15rem]"
            : "text-[0.82rem] text-ink sm:text-[0.9rem]"
        }`}
      >
        {row.name || row.login}
      </p>
      <p className="truncate font-display text-[0.68rem] tracking-[0.1em] text-dim uppercase">
        @{row.login}
      </p>
      <p
        className={`mt-1 font-display font-extrabold tabular-nums ${
          isChampion
            ? "text-[1.8rem] text-amber"
            : "text-[1.25rem] text-ink"
        }`}
      >
        {row.powerScore}
      </p>
      <div className={`mt-3 border ${pedestal}`} aria-hidden="true" />
    </div>
  )
}

export function TournamentChampion({
  tournament,
  onNewTournament,
  getAvatarSrc,
}: TournamentChampionProps) {
  const standings = buildStandings(tournament)
  const champion = standings.find((row) => row.status === "champion")
  const runnerUp = standings.find((row) => row.status === "runner-up")
  const third = standings.find(
    (row) => row.status !== "champion" && row.status !== "runner-up",
  )
  const finalMatch = tournament.rounds[tournament.rounds.length - 1]?.[0]

  return (
    <section className="mb-5 border-2 border-amber bg-panel">
      <div className="border-b border-line bg-amber-fill/15 px-3.5 py-5 sm:px-4.5">
        <p className="font-display text-[0.72rem] font-bold tracking-[0.18em] text-on-amber uppercase">
          Tournament complete
        </p>

        {/* Scoreboard podium — no particles, hard edges */}
        <div className="mt-4 flex items-end justify-center gap-2 sm:gap-4">
          <PodiumBlock
            row={runnerUp}
            place={2}
            getAvatarSrc={getAvatarSrc}
          />
          <PodiumBlock
            row={champion}
            place={1}
            getAvatarSrc={getAvatarSrc}
          />
          <PodiumBlock row={third} place={3} getAvatarSrc={getAvatarSrc} />
        </div>

        {champion && (
          <div className="mt-4 text-center">
            <h2 className="font-display text-[1.6rem] leading-tight font-extrabold tracking-[0.04em] text-ink uppercase sm:text-[2rem]">
              {champion.name || champion.login}
            </h2>
            <p className="font-display text-[0.95rem] font-semibold tracking-[0.08em] text-amber">
              takes the board · power {champion.powerScore}
            </p>
          </div>
        )}

        {finalMatch && finalMatch.left && finalMatch.right && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[0.9rem] text-ink-dim">
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
          </div>
        )}

        {champion && runnerUp && (
          <div className="mt-3 flex justify-center">
            <ShareBattleButton
              leftLogin={champion.login}
              rightLogin={runnerUp.login}
            />
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
