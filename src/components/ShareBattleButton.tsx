import { useCallback, useEffect, useRef, useState } from "react"
import { buildBattleUrl } from "../lib/url"

type ShareBattleButtonProps = {
  leftLogin: string
  rightLogin: string
  /** When set, share URL uses `?week=` instead of `?a=&b=`. */
  weekId?: string
}

type CopyState = "idle" | "copied" | "failed"

export function ShareBattleButton({
  leftLogin,
  rightLogin,
  weekId,
}: ShareBattleButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle")
  const resetTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) {
        window.clearTimeout(resetTimer.current)
      }
    }
  }, [])

  const flash = useCallback((state: CopyState) => {
    setCopyState(state)
    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current)
    }
    resetTimer.current = window.setTimeout(() => setCopyState("idle"), 2000)
  }, [])

  const handleShare = useCallback(async () => {
    const url = buildBattleUrl({
      left: leftLogin,
      right: rightLogin,
      weekId: weekId ?? null,
    })
    if (!url) {
      flash("failed")
      return
    }

    const shareData = {
      title: "Commit Battle Analyzer",
      text: weekId
        ? `Battle of the week (${weekId}): ${leftLogin} vs ${rightLogin}`
        : `${leftLogin} vs ${rightLogin}`,
      url,
    }

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData)
        flash("copied")
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const input = document.createElement("input")
        input.value = url
        input.setAttribute("readonly", "")
        input.style.position = "fixed"
        input.style.opacity = "0"
        document.body.appendChild(input)
        input.select()
        document.execCommand("copy")
        document.body.removeChild(input)
      }
      flash("copied")
    } catch {
      flash("failed")
    }
  }, [leftLogin, rightLogin, weekId, flash])

  const label =
    copyState === "copied"
      ? "Link copied"
      : copyState === "failed"
        ? "Copy failed"
        : "Share"

  return (
    <button
      type="button"
      onClick={() => {
        void handleShare()
      }}
      title={`Share ${leftLogin} vs ${rightLogin}`}
      className={`inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-2 rounded-[2px] border px-2.5 font-display text-[0.72rem] font-bold tracking-[0.14em] uppercase transition-colors ${
        copyState === "copied"
          ? "border-amber bg-amber-fill/15 text-amber"
          : copyState === "failed"
            ? "border-score-red text-score-red"
            : "border-line-strong bg-deep text-ink-dim hover:border-amber hover:text-amber"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
    </button>
  )
}
