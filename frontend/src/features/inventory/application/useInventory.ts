import { useEffect, useState } from 'react'

import {
  emptyInventoryItemDraft,
  type InventoryItem,
  type InventoryItemDraft,
} from '../domain/inventoryItem'
import {
  createItem,
  deleteImage,
  deleteItem,
  listItems,
  updateItem,
  uploadImages,
} from '../infrastructure/inventoryApi'

type InventoryErrors = { create: string; edit: string; delete: string }
const emptyErrors: InventoryErrors = { create: '', edit: '', delete: '' }

function toDraft(item: InventoryItem): InventoryItemDraft {
  return {
    name: item.name,
    categoryIds: item.categories.map((c) => c.id),
    description: item.description ?? '',
    location: item.location ?? '',
    totalQuantity: item.totalQuantity,
  }
}

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [createDraft, setCreateDraft] = useState<InventoryItemDraft>(emptyInventoryItemDraft)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState<InventoryItemDraft>(emptyInventoryItemDraft)
  const [errors, setErrors] = useState<InventoryErrors>(emptyErrors)

  useEffect(() => {
    const load = async () => {
      setItems(await listItems())
    }
    void load()
  }, [])

  async function submitCreate() {
    setErrors((e) => ({ ...e, create: '' }))
    try {
      const item = await createItem(createDraft)
      setItems((prev) => [...prev, item])
      setCreateDraft(emptyInventoryItemDraft)
    } catch {
      setErrors((e) => ({ ...e, create: 'Nije moguće kreirati opremu.' }))
    }
  }

  function startEditing(item: InventoryItem) {
    setEditingItemId(item.id)
    setEditDraft(toDraft(item))
    setErrors((e) => ({ ...e, edit: '' }))
  }

  function cancelEditing() {
    setEditingItemId(null)
    setEditDraft(emptyInventoryItemDraft)
  }

  async function submitEdit() {
    if (editingItemId === null) return
    setErrors((e) => ({ ...e, edit: '' }))
    try {
      const updated = await updateItem(editingItemId, editDraft)
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
      cancelEditing()
    } catch {
      setErrors((e) => ({ ...e, edit: 'Nije moguće ažurirati opremu.' }))
    }
  }

  async function removeItem(itemId: number) {
    setErrors((e) => ({ ...e, delete: '' }))
    try {
      await deleteItem(itemId)
      setItems((prev) => prev.filter((i) => i.id !== itemId))
      if (editingItemId === itemId) cancelEditing()
    } catch {
      setErrors((e) => ({ ...e, delete: 'Nije moguće obrisati opremu.' }))
    }
  }

  async function uploadItemImages(itemId: number, files: File[]) {
    try {
      const updated = await uploadImages(itemId, files)
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    } catch {
      setErrors((e) => ({ ...e, edit: 'Nije moguće učitati fotografije.' }))
    }
  }

  async function deleteItemImage(itemId: number, imageId: number) {
    try {
      const updated = await deleteImage(itemId, imageId)
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    } catch {
      setErrors((e) => ({ ...e, edit: 'Nije moguće obrisati fotografiju.' }))
    }
  }

  return {
    items,
    createDraft,
    setCreateDraft,
    editingItemId,
    editDraft,
    setEditDraft,
    errors,
    submitCreate,
    startEditing,
    cancelEditing,
    submitEdit,
    removeItem,
    uploadItemImages,
    deleteItemImage,
  }
}
