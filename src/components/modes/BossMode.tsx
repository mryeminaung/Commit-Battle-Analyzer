import { useCallback, useState } from "react"
import { runBattle } from "@/lib/battle"
import { toBattleError, type BattleErrorState } from "@/lib/errors"
import { MOCK_LOGINS, MOCK_PROFILES } from "@/lib/mocks"
import type { BattleResult } from "@/lib/types"
import { BattleSkeleton } from "@/components/BattleSkeleton"
import { ErrorBanner } from "@/components/ErrorBanner"
import { Scoreboard } from "@/components/Scoreboard"

const BOSS_LOGINS = MOCK_LOGINS

type BossModeProps = {
  getAvatarSrc: (login: string, fallbackUrl: string) => string
  hasCustomAvatar: (login: string) => boolean
  onSelectAvatar: (login: string, path: string) => void
  onResetAvatar: (login: string) => void
}

/**
 * Single-player mode: your handle vs a roster legend (boss).
 * Thin wrapper around the same battle pipeline as Duel.
 */
export function BossMode({
  getAvatarSrc,
  hasCustomAvatar,
  onSelectAvatar,
  onResetAvatar,
}: BossModeProps) {
  const [playerLogin, setPlayerLogin] = useState("")
  const [bossLogin, setBossLogin] = useState(BOSS_LOGINS[0] ?? "torvalds")
  const [result, setResult] = useState<BattleResult | null>(null)
  const [error, setError] = useState<BattleErrorState | null>(null)
  const [loading, setLoading] = useState(false)

  const startBossBattle = useCallback(async () => {
    const player = playerLogin.trim()
    const boss = bossLogin.trim()
    if (!player || !boss) {
      setError({
        message: "Enter your GitHub username and pick a boss.",
        rateLimited: false,
      })
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Player on the left, boss on the right
      const battleResult = await runBattle(player, boss)
      setResult(battleResult)
    } catch (battleError) {
      setError(toBattleError(battleError))
    } finally {
      setLoading(false)
    }
  }, [playerLogin, bossLogin])

  return (
    <>
      <section className="mb-5 border border-line bg-panel p-3.5 sm:p-4.5">
        <h2 className="font-display text-[1.45rem] leading-tight font-extrabold tracking-[0.04em] text-ink uppercase sm:text-[1.65rem]">
          Boss battle
        </h2>
        <p className="mt-1.5 mb-4 text-[0.92rem] text-ink-dim">
          Enter your GitHub username and challenge a legend from the roster.
        </p>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <label className="flex min-w-0 flex-col gap-2">
            <span className="font-display text-[0.78rem] font-bold tracking-[0.16em] text-dim uppercase">
              Your handle
            </span>
            <input
              value={playerLogin}
              onChange={(event) => setPlayerLogin(event.target.value)}
              placeholder="github-handle"
              autoComplete="off"
              spellCheck={false}
              className="h-12 w-full rounded-[2px] border border-line-strong bg-deep px-3.5 font-display text-[1.1rem] font-semibold tracking-[0.04em] text-ink lowercase outline-none transition-colors placeholder:text-dim/70 focus:border-amber"
            />
          </label>

          <div className="flex items-center justify-center font-display text-[1.25rem] font-extrabold tracking-[0.1em] text-score-red uppercase">
            vs
          </div>

          <label className="flex min-w-0 flex-col gap-2">
            <span className="font-display text-[0.78rem] font-bold tracking-[0.16em] text-dim uppercase">
              Boss
            </span>
            <select
              value={bossLogin}
              onChange={(event) => setBossLogin(event.target.value)}
              className="h-12 w-full cursor-pointer rounded-[2px] border border-line-strong bg-deep px-3 font-display text-[1.05rem] font-semibold tracking-[0.04em] text-ink outline-none transition-colors focus:border-amber"
            >
              {BOSS_LOGINS.map((login) => (
                <option key={login} value={login}>
                  {MOCK_PROFILES[login]?.name ?? login} (@{login})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => void startBossBattle()}
            disabled={loading}
            className="min-h-11 cursor-pointer rounded-[2px] bg-amber-fill px-7 font-display text-[0.98rem] font-extrabold tracking-[0.16em] text-on-amber uppercase transition-colors hover:bg-amber-fill-hover active:bg-amber-fill-active disabled:cursor-wait disabled:bg-line-strong disabled:text-dim"
          >
            {loading ? "Battle…" : "Fight"}
          </button>
        </div>
      </section>

      {error && (
        <ErrorBanner
          message={error.message}
          rateLimited={error.rateLimited}
          onRetry={() => void startBossBattle()}
          retrying={loading}
        />
      )}

      {loading && !result && <BattleSkeleton />}

      {result && (
        <Scoreboard
          result={result}
          weekId={null}
          getAvatarSrc={getAvatarSrc}
          hasCustomAvatar={hasCustomAvatar}
          onSelectAvatar={onSelectAvatar}
          onResetAvatar={onResetAvatar}
        />
      )}
    </>
  )
}
