import { useEffect, useState } from 'react'

import type { ItemCategory } from '../domain/inventoryItem'
import { listCategories } from '../infrastructure/inventoryCategoryApi'

export function useCategories() {
  const [categories, setCategories] = useState<ItemCategory[]>([])

  useEffect(() => {
    const load = async () => {
      setCategories(await listCategories())
    }
    void load()
  }, [])

  return { categories, setCategories }
}
