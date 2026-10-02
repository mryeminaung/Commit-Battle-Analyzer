import { useEffect, useRef, useState } from "react"

/** Animate a number from its previous value to `target` (starts at 0 on mount). */
export function useCountUp(target: number, durationMs = 750): number {
  const [display, setDisplay] = useState(0)
  const currentRef = useRef(0)

  useEffect(() => {
    const from = currentRef.current
    const delta = target - from

    if (delta === 0) {
      currentRef.current = target
      setDisplay(target)
      return
    }

    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = Math.round(from + delta * eased)
      currentRef.current = next
      setDisplay(next)

      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        currentRef.current = target
        setDisplay(target)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])

  return display
}
