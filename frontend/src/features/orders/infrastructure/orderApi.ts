import type { OrderDetail } from '../domain/orderDetail'
import type { OrderDraft } from '../domain/orderDraft'
import type { OrderSummary } from '../domain/orderSummary'

export async function listOrders(): Promise<OrderSummary[]> {
  const response = await fetch('/api/orders')
  return (await response.json()) as OrderSummary[]
}

export async function getOrderDetail(orderId: number): Promise<OrderDetail> {
  const response = await fetch(`/api/orders/${orderId}`)
  if (!response.ok) {
    throw new Error('Could not load order detail.')
  }
  return (await response.json()) as OrderDetail
}

export async function createOrder(draft: OrderDraft): Promise<OrderDetail> {
  const payload = {
    memberId: draft.memberId,
    dueDate: draft.dueDate,
    note: draft.note.trim() === '' ? null : draft.note,
    lines: draft.lines
      .filter((line) => line.itemId !== '' && line.quantity > 0)
      .map((line) => ({ itemId: line.itemId, quantity: line.quantity })),
  }

  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Could not create order.')
  }

  return (await response.json()) as OrderDetail
}

export async function returnOrder(orderId: number): Promise<OrderDetail> {
  const response = await fetch(`/api/orders/${orderId}/return`, { method: 'POST' })
  if (!response.ok) {
    throw new Error('Could not return order.')
  }
  return (await response.json()) as OrderDetail
}

export async function deleteOrder(orderId: number): Promise<void> {
  const response = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' })
  if (!response.ok) {
    throw new Error('Could not delete order.')
  }
}
