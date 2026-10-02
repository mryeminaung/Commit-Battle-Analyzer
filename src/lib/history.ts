import type { BoutRecord } from "@/lib/types"

const STORAGE_KEY = "cba:bouts"
const MAX_BOUTS = 6

export const loadBouts = (): BoutRecord[] => {
  if (typeof window === "undefined") return []

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isBoutRecord).slice(0, MAX_BOUTS)
  } catch {
    return []
  }
}

export const pushBout = (
  record: Omit<BoutRecord, "id" | "at">,
): BoutRecord[] => {
  const bout: BoutRecord = {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: Date.now(),
  }
  const next = [bout, ...loadBouts()].slice(0, MAX_BOUTS)

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // storage may be full or blocked — history stays in-memory
    }
  }

  return next
}

export const clearBouts = (): BoutRecord[] => {
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }
  return []
}

function isBoutRecord(value: unknown): value is BoutRecord {
  if (typeof value !== "object" || value === null) return false
  const bout = value as Partial<BoutRecord>
  return (
    typeof bout.id === "string" &&
    typeof bout.leftLogin === "string" &&
    typeof bout.rightLogin === "string" &&
    typeof bout.leftScore === "number" &&
    typeof bout.rightScore === "number"
  )
}
