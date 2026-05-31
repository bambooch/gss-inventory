import { describe, expect, it } from 'vitest'

import { orderAttention, summarizeOrders } from './orderPresentation'
import type { OrderSummary } from './orderSummary'

function order(partial: Partial<OrderSummary>): OrderSummary {
  return {
    id: 1,
    memberId: 1,
    memberName: 'Adnan Kovač',
    status: 'AKTIVNO',
    issuedAt: '2026-05-01T10:00:00Z',
    dueDate: '2026-06-15',
    returnedAt: null,
    itemCount: 3,
    ...partial,
  }
}

describe('orderAttention', () => {
  const now = new Date(2026, 4, 31) // 2026-05-31

  it('marks returned orders as RETURNED regardless of date', () => {
    expect(orderAttention(order({ status: 'VRACENO', dueDate: '2026-05-01' }), now)).toBe('RETURNED')
  })

  it('marks an active order past its due date as LATE', () => {
    expect(orderAttention(order({ status: 'AKTIVNO', dueDate: '2026-05-20' }), now)).toBe('LATE')
  })

  it('marks an order due within three days as DUE_SOON', () => {
    expect(orderAttention(order({ status: 'AKTIVNO', dueDate: '2026-06-02' }), now)).toBe('DUE_SOON')
  })

  it('marks an order due further out as ACTIVE', () => {
    expect(orderAttention(order({ status: 'AKTIVNO', dueDate: '2026-06-30' }), now)).toBe('ACTIVE')
  })
})

describe('summarizeOrders', () => {
  const now = new Date(2026, 4, 31)

  it('counts total, pending, late and returned orders', () => {
    const orders: OrderSummary[] = [
      order({ id: 1, status: 'AKTIVNO', dueDate: '2026-05-20' }), // late
      order({ id: 2, status: 'AKTIVNO', dueDate: '2026-06-30' }), // pending, not late
      order({ id: 3, status: 'VRACENO', dueDate: '2026-05-01' }), // returned
    ]

    expect(summarizeOrders(orders, now)).toEqual({
      total: 3,
      pending: 2,
      late: 1,
      returned: 1,
    })
  })
})
