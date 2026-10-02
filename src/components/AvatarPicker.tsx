import { useEffect, useRef, useState } from "react"
import {
  AVATAR_OPTIONS,
  DEFAULT_FALLBACK_AVATAR,
} from "../lib/avatars"

type AvatarPickerProps = {
  login: string
  avatarSrc: string
  fallbackUrl: string
  hasCustomAvatar: boolean
  onSelect: (path: string) => void
  onReset: () => void
}

/** w-56 panel + gap — used to flip alignment near the viewport edge. */
const PANEL_WIDTH_PX = 224
const VIEWPORT_MARGIN_PX = 12

export function AvatarPicker({
  login,
  avatarSrc,
  fallbackUrl,
  hasCustomAvatar,
  onSelect,
  onReset,
}: AvatarPickerProps) {
  const [open, setOpen] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const [align, setAlign] = useState<"left" | "right">("left")
  const panelRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    setImgFailed(false)
  }, [avatarSrc])

  useEffect(() => {
    if (!open) return

    const place = () => {
      const trigger = triggerRef.current
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()
      const roomOnRight = window.innerWidth - rect.left
      setAlign(roomOnRight >= PANEL_WIDTH_PX + VIEWPORT_MARGIN_PX ? "left" : "right")
    }

    place()

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    window.addEventListener("resize", place)
    window.addEventListener("scroll", place, true)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("resize", place)
      window.removeEventListener("scroll", place, true)
    }
  }, [open])

  const shownSrc = imgFailed ? DEFAULT_FALLBACK_AVATAR : avatarSrc

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={`Change ${login}'s avatar`}
        className="group relative block min-h-11 min-w-11 cursor-pointer rounded-[2px] border border-line-strong bg-deep p-0 transition-colors hover:border-amber"
      >
        <img
          src={shownSrc}
          alt={`${login} avatar`}
          onError={() => setImgFailed(true)}
          className="size-14 rounded-[2px] object-cover sm:size-[72px]"
        />
        <span
          className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-charcoal/80 py-0.5 font-display text-[0.62rem] font-bold tracking-[0.12em] text-ink uppercase transition-opacity ${
            open
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Edit
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={`Choose avatar for ${login}`}
          className={`absolute top-full z-20 mt-2 w-56 max-w-[min(14rem,calc(100vw-1.5rem))] border border-line-strong bg-panel p-2.5 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <p className="mb-2 font-display text-[0.7rem] font-bold tracking-[0.14em] text-dim uppercase">
            Local avatars
          </p>

          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
            {AVATAR_OPTIONS.map((path) => {
              const active = path === avatarSrc
              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => {
                    onSelect(path)
                    setOpen(false)
                  }}
                  title={path}
                  className={`cursor-pointer rounded-[2px] border p-0.5 transition-colors ${
                    active
                      ? "border-amber bg-amber-fill/20"
                      : "border-line hover:border-amber"
                  }`}
                >
                  <img
                    src={path}
                    alt=""
                    className="size-9 rounded-[2px] object-cover sm:size-8"
                  />
                </button>
              )
            })}
          </div>

          <div className="mt-2.5 flex flex-col gap-1.5 border-t border-line pt-2.5">
            {fallbackUrl !== DEFAULT_FALLBACK_AVATAR && (
              <button
                type="button"
                onClick={() => {
                  onSelect(DEFAULT_FALLBACK_AVATAR)
                  setOpen(false)
                }}
                className="cursor-pointer rounded-[2px] border border-line px-2 py-2 text-left font-display text-[0.72rem] font-semibold tracking-[0.08em] text-ink-dim uppercase transition-colors hover:border-amber hover:text-amber"
              >
                Use fallback
              </button>
            )}

            {hasCustomAvatar && (
              <button
                type="button"
                onClick={() => {
                  onReset()
                  setOpen(false)
                }}
                className="cursor-pointer rounded-[2px] border border-line px-2 py-2 text-left font-display text-[0.72rem] font-semibold tracking-[0.08em] text-ink-dim uppercase transition-colors hover:border-score-red hover:text-score-red"
              >
                Reset to default
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
