import type { OrderSummary } from './orderSummary'

export const orderStatusOptions = ['AKTIVNO', 'VRACENO'] as const

export const orderStatusLabels: Record<string, string> = {
  AKTIVNO: 'Aktivno',
  VRACENO: 'Vraćeno',
}

export const statusBadgeClasses: Record<string, string> = {
  AKTIVNO: 'bg-sky-100 text-sky-900 ring-1 ring-inset ring-sky-200',
  VRACENO: 'bg-slate-200 text-slate-700 ring-1 ring-inset ring-slate-300',
}

export type OrderAttention = 'RETURNED' | 'LATE' | 'DUE_SOON' | 'ACTIVE'

export const attentionLabels: Record<OrderAttention, string> = {
  RETURNED: 'Vraćeno',
  LATE: 'Istekao rok',
  DUE_SOON: 'Rok uskoro',
  ACTIVE: 'U toku',
}

export const attentionBadgeClasses: Record<OrderAttention, string> = {
  RETURNED: 'bg-slate-200 text-slate-700 ring-1 ring-inset ring-slate-300',
  LATE: 'bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200',
  DUE_SOON: 'bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200',
  ACTIVE: 'bg-emerald-100 text-emerald-900 ring-1 ring-inset ring-emerald-200',
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function parseDueDate(dueDate: string): number {
  const [year, month, day] = dueDate.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1).getTime()
}

/** Derive how urgent an order is from its status and return deadline. */
export function orderAttention(order: Pick<OrderSummary, 'status' | 'dueDate'>, now: Date = new Date()): OrderAttention {
  if (order.status === 'VRACENO') {
    return 'RETURNED'
  }

  if (!order.dueDate) {
    return 'ACTIVE'
  }

  const due = parseDueDate(order.dueDate)
  const today = startOfDay(now)
  const dayMs = 24 * 60 * 60 * 1000

  if (due < today) {
    return 'LATE'
  }
  if (due - today <= 3 * dayMs) {
    return 'DUE_SOON'
  }
  return 'ACTIVE'
}

export function summarizeOrders(orders: OrderSummary[], now: Date = new Date()) {
  let pending = 0
  let late = 0
  let returned = 0

  for (const order of orders) {
    const attention = orderAttention(order, now)
    if (attention === 'RETURNED') {
      returned += 1
    } else {
      pending += 1
      if (attention === 'LATE') {
        late += 1
      }
    }
  }

  return { total: orders.length, pending, late, returned }
}

export function formatDate(value: string | null): string {
  if (!value) {
    return '—'
  }
  const datePart = value.includes('T') ? value.slice(0, 10) : value
  const [year, month, day] = datePart.split('-')
  if (!year || !month || !day) {
    return value
  }
  return `${day}.${month}.${year}.`
}
