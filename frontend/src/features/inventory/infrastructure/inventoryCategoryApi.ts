import type { ItemCategory } from '../domain/inventoryItem'

export async function listCategories(): Promise<ItemCategory[]> {
  const response = await fetch('/api/categories')
  return (await response.json()) as ItemCategory[]
}

export async function createCategory(name: string, label: string, sortOrder: number): Promise<ItemCategory> {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, label, sortOrder }),
  })
  if (!response.ok) throw new Error('Could not create category.')
  return (await response.json()) as ItemCategory
}

export async function updateCategory(id: number, name: string, label: string, sortOrder: number): Promise<ItemCategory> {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, label, sortOrder }),
  })
  if (!response.ok) throw new Error('Could not update category.')
  return (await response.json()) as ItemCategory
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Could not delete category.')
}
