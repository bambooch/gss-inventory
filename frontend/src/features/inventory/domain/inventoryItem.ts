export type ItemCategory = {
  id: number
  name: string
  label: string
  sortOrder: number
}

export type ItemImage = {
  id: number
  url: string
}

export type InventoryItem = {
  id: number
  name: string
  categories: ItemCategory[]
  description: string | null
  location: string | null
  totalQuantity: number
  availableQuantity: number
  images: ItemImage[]
}

export type InventoryItemDraft = {
  name: string
  categoryIds: number[]
  description: string
  location: string
  totalQuantity: number
}

export const emptyInventoryItemDraft: InventoryItemDraft = {
  name: '',
  categoryIds: [],
  description: '',
  location: '',
  totalQuantity: 1,
}
