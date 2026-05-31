import type { FormEvent } from 'react'

import {
  dangerButtonClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from '../../../../ui/theme'
import { categoryLabel, type InventoryItem, type InventoryItemDraft } from '../../domain/inventoryItem'
import { InventoryFormFields } from './InventoryFormFields'

type Props = {
  item: InventoryItem
  editingItemId: number | null
  editDraft: InventoryItemDraft
  onEditDraftChange: (draft: InventoryItemDraft) => void
  onStartEditing: (item: InventoryItem) => void
  onCancelEditing: () => void
  onSubmitEdit: () => Promise<void>
  onDelete: (itemId: number) => Promise<void>
}

export function InventoryListItem({
  item,
  editingItemId,
  editDraft,
  onEditDraftChange,
  onStartEditing,
  onCancelEditing,
  onSubmitEdit,
  onDelete,
}: Props) {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await onSubmitEdit()
  }

  const inUse = item.totalQuantity - item.availableQuantity
  const lowStock = item.availableQuantity === 0

  return (
    <li className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {editingItemId === item.id ? (
        <form className="space-y-3" onSubmit={(e) => void handleSubmit(e)}>
          <InventoryFormFields draft={editDraft} idPrefix={`edit-item-${item.id}`} onDraftChange={onEditDraftChange} />
          <div className="flex gap-2">
            <button
              className={primaryButtonClasses}
              type="submit"
              disabled={!editDraft.name.trim() || editDraft.category === ''}
            >
              Spremi izmjene
            </button>
            <button className={secondaryButtonClasses} type="button" onClick={onCancelEditing}>
              Otkaži
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-800">{item.name}</span>
              <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                {categoryLabel(item.category)}
              </span>
            </div>
            {item.location ? <p className="mt-1 text-sm text-slate-500">{item.location}</p> : null}
            {item.description ? <p className="mt-1 text-sm text-slate-400">{item.description}</p> : null}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="text-right">
              <p
                className={`text-lg font-bold ${lowStock ? 'text-rose-600' : 'text-slate-900'}`}
              >
                {item.availableQuantity} / {item.totalQuantity}
              </p>
              <p className="text-xs text-slate-400">dostupno{inUse > 0 ? ` · ${inUse} zaduženo` : ''}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button className={secondaryButtonClasses} type="button" onClick={() => onStartEditing(item)}>
                Uredi
              </button>
              <button className={dangerButtonClasses} type="button" onClick={() => void onDelete(item.id)}>
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
