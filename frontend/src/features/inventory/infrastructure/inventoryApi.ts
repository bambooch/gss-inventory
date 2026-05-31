import type { InventoryItem, InventoryItemDraft } from '../domain/inventoryItem'

export async function listItems(): Promise<InventoryItem[]> {
  const response = await fetch('/api/inventory')
  return (await response.json()) as InventoryItem[]
}

export async function createItem(draft: InventoryItemDraft): Promise<InventoryItem> {
  const response = await fetch('/api/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  })
  if (!response.ok) throw new Error('Could not create item.')
  return (await response.json()) as InventoryItem
}

export async function updateItem(itemId: number, draft: InventoryItemDraft): Promise<InventoryItem> {
  const response = await fetch(`/api/inventory/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  })
  if (!response.ok) throw new Error('Could not update item.')
  return (await response.json()) as InventoryItem
}

export async function deleteItem(itemId: number): Promise<void> {
  const response = await fetch(`/api/inventory/${itemId}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Could not delete item.')
}
