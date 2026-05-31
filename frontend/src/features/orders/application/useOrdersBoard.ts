import { useEffect, useState } from 'react'

import type { InventoryItem } from '../../inventory/domain/inventoryItem'
import { listItems } from '../../inventory/infrastructure/inventoryApi'
import type { Member } from '../../members/domain/member'
import { listMembers } from '../../members/infrastructure/memberApi'
import { emptyOrderDraft, type OrderDraft } from '../domain/orderDraft'
import type { OrderSummary } from '../domain/orderSummary'
import {
  createOrder,
  deleteOrder,
  listOrders,
  returnOrder,
} from '../infrastructure/orderApi'

type OrderErrors = { create: string; action: string }
const emptyErrors: OrderErrors = { create: '', action: '' }

export function useOrdersBoard() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [items, setItems] = useState<InventoryItem[]>([])
  const [createDraft, setCreateDraft] = useState<OrderDraft>(emptyOrderDraft)
  const [errors, setErrors] = useState<OrderErrors>(emptyErrors)

  async function reloadOrdersAndItems() {
    const [loadedOrders, loadedItems] = await Promise.all([listOrders(), listItems()])
    setOrders(loadedOrders)
    setItems(loadedItems)
  }

  useEffect(() => {
    const load = async () => {
      const [loadedOrders, loadedMembers, loadedItems] = await Promise.all([
        listOrders(),
        listMembers(),
        listItems(),
      ])
      setOrders(loadedOrders)
      setMembers(loadedMembers)
      setItems(loadedItems)
    }
    void load()
  }, [])

  async function submitCreate(): Promise<boolean> {
    setErrors((e) => ({ ...e, create: '' }))
    try {
      await createOrder(createDraft)
      await reloadOrdersAndItems()
      setCreateDraft(emptyOrderDraft)
      return true
    } catch {
      setErrors((e) => ({ ...e, create: 'Nije moguće kreirati zaduženje. Provjerite dostupne količine.' }))
      return false
    }
  }

  async function markReturned(orderId: number) {
    setErrors((e) => ({ ...e, action: '' }))
    try {
      await returnOrder(orderId)
      await reloadOrdersAndItems()
    } catch {
      setErrors((e) => ({ ...e, action: 'Nije moguće označiti zaduženje kao vraćeno.' }))
    }
  }

  async function removeOrder(orderId: number) {
    setErrors((e) => ({ ...e, action: '' }))
    try {
      await deleteOrder(orderId)
      await reloadOrdersAndItems()
    } catch {
      setErrors((e) => ({ ...e, action: 'Nije moguće obrisati zaduženje.' }))
    }
  }

  return {
    orders,
    members,
    items,
    createDraft,
    setCreateDraft,
    errors,
    submitCreate,
    markReturned,
    removeOrder,
  }
}
