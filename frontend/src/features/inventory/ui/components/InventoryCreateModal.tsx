import type { FormEvent } from 'react'
import { useState } from 'react'

import type { ItemCategory, InventoryItemDraft } from '../../domain/inventoryItem'
import { primaryButtonClasses, secondaryButtonClasses } from '../../../../ui/theme'
import { InventoryFormFields } from './InventoryFormFields'

type Props = {
  draft: InventoryItemDraft
  availableCategories: ItemCategory[]
  onDraftChange: (draft: InventoryItemDraft) => void
  onSubmit: () => Promise<void>
  onClose: () => void
  error: string
}

export function InventoryCreateModal({ draft, availableCategories, onDraftChange, onSubmit, onClose, error }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setShowConfirm(true)
  }

  async function confirmSubmit() {
    setShowConfirm(false)
    await onSubmit()
    onClose()
  }

  const isValid = draft.name.trim() !== ''

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

      <div
        className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-[0_-20px_80px_rgba(15,23,42,0.2)] sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:shadow-[0_40px_120px_rgba(15,23,42,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-8">
          <div className="mb-5 flex justify-center sm:hidden">
            <div className="h-1 w-10 rounded-full bg-slate-300" />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-700">Kreiranje</p>
              <h2 className="mt-2 font-display text-3xl text-slate-950">Nova oprema</h2>
            </div>
            <button
              type="button"
              className="mt-1 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              onClick={onClose}
              aria-label="Zatvori"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {error ? (
            <div className="sticky top-0 z-20 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700" role="alert">
              {error}
            </div>
          ) : null}

          <form className="mt-6 space-y-5" onSubmit={(e) => void handleSubmit(e)}>
            <InventoryFormFields
              draft={draft}
              idPrefix="create-item"
              availableCategories={availableCategories}
              onDraftChange={onDraftChange}
            />

            <div className="flex flex-col gap-3 pb-2 pt-3 sm:flex-row">
              <button type="submit" className={primaryButtonClasses} disabled={!isValid}>
                Dodaj opremu
              </button>
              <button type="button" className={secondaryButtonClasses} onClick={onClose}>
                Otkaži
              </button>
            </div>
          </form>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0" onClick={() => setShowConfirm(false)}>
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_40px_120px_rgba(15,23,42,0.3)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-slate-950">Potvrdi dodavanje</h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Oprema</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{draft.name || 'Nije navedeno'}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className={primaryButtonClasses}
                onClick={confirmSubmit}
              >
                Potvrdi
              </button>
              <button
                type="button"
                className={secondaryButtonClasses}
                onClick={() => setShowConfirm(false)}
              >
                Nazad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
