import type { InventoryItem, InventoryItemDraft } from '../domain/inventoryItem'

export async function listItems(): Promise<InventoryItem[]> {
  const response = await fetch('/api/inventory')
  return (await response.json()) as InventoryItem[]
}

export async function createItem(draft: InventoryItemDraft): Promise<InventoryItem> {
  const response = await fetch('/api/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: draft.name,
      categoryIds: draft.categoryIds,
      description: draft.description,
      location: draft.location,
      totalQuantity: draft.totalQuantity,
    }),
  })
  if (!response.ok) throw new Error('Could not create item.')
  return (await response.json()) as InventoryItem
}

export async function updateItem(itemId: number, draft: InventoryItemDraft): Promise<InventoryItem> {
  const response = await fetch(`/api/inventory/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: draft.name,
      categoryIds: draft.categoryIds,
      description: draft.description,
      location: draft.location,
      totalQuantity: draft.totalQuantity,
    }),
  })
  if (!response.ok) throw new Error('Could not update item.')
  return (await response.json()) as InventoryItem
}

export async function deleteItem(itemId: number): Promise<void> {
  const response = await fetch(`/api/inventory/${itemId}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Could not delete item.')
}

export async function uploadImages(itemId: number, files: File[]): Promise<InventoryItem> {
  const form = new FormData()
  files.forEach((f) => form.append('files', f))
  const response = await fetch(`/api/inventory/${itemId}/images`, {
    method: 'POST',
    body: form,
  })
  if (!response.ok) throw new Error('Could not upload images.')
  return (await response.json()) as InventoryItem
}

export async function deleteImage(itemId: number, imageId: number): Promise<InventoryItem> {
  const response = await fetch(`/api/inventory/${itemId}/images/${imageId}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Could not delete image.')
  return (await response.json()) as InventoryItem
}
