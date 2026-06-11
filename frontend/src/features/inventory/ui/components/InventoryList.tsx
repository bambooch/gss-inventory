import { useState, useMemo } from 'react'
import type { ItemCategory, InventoryItem, InventoryItemDraft } from '../../domain/inventoryItem'
import { inputClasses } from '../../../../ui/theme'
import { InventoryListItem } from './InventoryListItem'

type Props = {
  items: InventoryItem[]
  editingItemId: number | null
  editDraft: InventoryItemDraft
  availableCategories: ItemCategory[]
  onEditDraftChange: (draft: InventoryItemDraft) => void
  onStartEditing: (item: InventoryItem) => void
  onCancelEditing: () => void
  onSubmitEdit: () => Promise<void>
  onDelete: (itemId: number) => Promise<void>
  onUploadImages: (itemId: number, files: File[]) => Promise<void>
  onDeleteImage: (itemId: number, imageId: number) => Promise<void>
  errors: { create: string; edit: string; delete: string }
}

export function InventoryList({
  items,
  editingItemId,
  editDraft,
  availableCategories,
  onEditDraftChange,
  onStartEditing,
  onCancelEditing,
  onSubmitEdit,
  onDelete,
  onUploadImages,
  onDeleteImage,
  errors,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return items
    return items.filter((item) => item.name.toLowerCase().includes(query))
  }, [items, searchQuery])

  return (
    <div className="space-y-4">
      <input
        type="text"
        className={inputClasses}
        placeholder="Pretraži opremu..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {errors.edit ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">
          {errors.edit}
        </p>
      ) : null}
      {errors.delete ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">
          {errors.delete}
        </p>
      ) : null}

      <ul className="space-y-3 list-none p-0 m-0">
        {filteredItems.map((item) => (
          <InventoryListItem
            key={item.id}
            item={item}
            editingItemId={editingItemId}
            editDraft={editDraft}
            availableCategories={availableCategories}
            onEditDraftChange={onEditDraftChange}
            onStartEditing={onStartEditing}
            onCancelEditing={onCancelEditing}
            onSubmitEdit={onSubmitEdit}
            onDelete={onDelete}
            onUploadImages={onUploadImages}
            onDeleteImage={onDeleteImage}
          />
        ))}
      </ul>

      {filteredItems.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
          {items.length === 0 ? 'Nema opreme u inventaru. Dodajte prvu stavku iznad.' : 'Nema rezultata pretrage.'}
        </div>
      ) : null}
    </div>
  )
}
