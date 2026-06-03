export const itemCategoryOptions = [
  'UZAD_I_TRAKE',
  'KARABINERI',
  'SPUSTALICE',
  'KOLOTURE',
  'HVATALJKE',
  'POJASEVI',
  'KACIGE',
  'NOSILA',
  'MEDICINSKA',
  'SIDRISTA',
  'LAVINSKA',
  'RASVJETA',
  'RAZNO',
] as const

export type ItemCategory = (typeof itemCategoryOptions)[number]

export const itemCategoryLabels: Record<ItemCategory, string> = {
  UZAD_I_TRAKE: 'Užad i trake',
  KARABINERI: 'Karabineri i spojnice',
  SPUSTALICE: 'Spuštalice',
  KOLOTURE: 'Koloture',
  HVATALJKE: 'Hvataljke',
  POJASEVI: 'Pojasevi',
  KACIGE: 'Kacige',
  NOSILA: 'Nosila i imobilizacija',
  MEDICINSKA: 'Medicinska oprema',
  SIDRISTA: 'Sidrišta i klinovi',
  LAVINSKA: 'Lavinska oprema',
  RASVJETA: 'Rasvjeta',
  RAZNO: 'Razno',
}

export function categoryLabel(category: string): string {
  return itemCategoryLabels[category as ItemCategory] ?? category
}

export type ItemImage = {
  id: number
  url: string
}

export type InventoryItem = {
  id: number
  name: string
  category: string
  description: string | null
  location: string | null
  totalQuantity: number
  availableQuantity: number
  images: ItemImage[]
}

export type InventoryItemDraft = {
  name: string
  category: '' | ItemCategory
  description: string
  location: string
  totalQuantity: number
}

export const emptyInventoryItemDraft: InventoryItemDraft = {
  name: '',
  category: '',
  description: '',
  location: '',
  totalQuantity: 1,
}
