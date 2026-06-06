import type { FormEvent } from 'react'

import { primaryButtonClasses } from '../../../../ui/theme'
import type { ItemCategory, InventoryItemDraft } from '../../domain/inventoryItem'
import { InventoryFormFields } from './InventoryFormFields'

type Props = {
  draft: InventoryItemDraft
  availableCategories: ItemCategory[]
  onDraftChange: (draft: InventoryItemDraft) => void
  onSubmit: () => Promise<void>
}

export function InventoryCreateForm({ draft, availableCategories, onDraftChange, onSubmit }: Props) {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await onSubmit()
  }

  const isValid = draft.name.trim() !== ''

  return (
    <form className="space-y-3" onSubmit={(e) => void handleSubmit(e)}>
      <InventoryFormFields
        draft={draft}
        idPrefix="create-item"
        availableCategories={availableCategories}
        onDraftChange={onDraftChange}
      />
      <button className={primaryButtonClasses} type="submit" disabled={!isValid}>
        Dodaj opremu
      </button>
    </form>
  )
}
