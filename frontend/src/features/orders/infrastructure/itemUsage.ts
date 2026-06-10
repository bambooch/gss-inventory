const ITEM_KEY = 'gss-item-usage'
const MEMBER_KEY = 'gss-member-usage'

function readCounts(key: string): Record<number, number> {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '{}') as Record<number, number>
  } catch {
    return {}
  }
}

function writeCounts(key: string, ids: number[]): void {
  const counts = readCounts(key)
  for (const id of ids) counts[id] = (counts[id] ?? 0) + 1
  localStorage.setItem(key, JSON.stringify(counts))
}

export const getItemUsageCounts = (): Record<number, number> => readCounts(ITEM_KEY)
export const incrementItemUsageCounts = (ids: number[]): void => writeCounts(ITEM_KEY, ids)
export const getMemberUsageCounts = (): Record<number, number> => readCounts(MEMBER_KEY)
export const incrementMemberUsageCounts = (ids: number[]): void => writeCounts(MEMBER_KEY, ids)
