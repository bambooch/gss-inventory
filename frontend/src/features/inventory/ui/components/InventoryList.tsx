import { useState, useMemo } from 'react'
import type { ItemCategory, InventoryItem, InventoryItemDraft } from '../../domain/inventoryItem'
import { inputClasses, primaryButtonClasses, secondaryButtonClasses } from '../../../../ui/theme'
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const filteredItems = useMemo(() => {
    let filtered = items

    const query = searchQuery.toLowerCase().trim()
    if (query) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(query))
    }

    if (selectedCategoryId !== null) {
      filtered = filtered.filter((item) => item.categories.some((cat) => cat.id === selectedCategoryId))
    }

    return filtered
  }, [items, searchQuery, selectedCategoryId])

  async function handleDelete(itemId: number) {
    await onDelete(itemId)
    setConfirmDeleteId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-col sm:flex-row">
        <input
          type="text"
          className={inputClasses}
          placeholder="Pretraži opremu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className={inputClasses}
          value={selectedCategoryId ?? ''}
          onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Sve kategorije</option>
          {availableCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

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
            onDelete={async (itemId) => setConfirmDeleteId(itemId)}
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

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0" onClick={() => setConfirmDeleteId(null)}>
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_40px_120px_rgba(15,23,42,0.3)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-slate-950">Obriši opremu?</h3>
            <p className="mt-3 text-sm text-slate-600">Ova akcija se ne može poništiti. Svi podaci opreme će biti trajno obrisani.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className={primaryButtonClasses}
                onClick={() => handleDelete(confirmDeleteId)}
              >
                Obriši
              </button>
              <button
                type="button"
                className={secondaryButtonClasses}
                onClick={() => setConfirmDeleteId(null)}
              >
                Otkaži
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
