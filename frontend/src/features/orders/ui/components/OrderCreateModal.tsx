import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import type { InventoryItem } from '../../../inventory/domain/inventoryItem'
import type { Member } from '../../../members/domain/member'
import { inputClasses, primaryButtonClasses, secondaryButtonClasses } from '../../../../ui/theme'
import type { OrderDraft } from '../../domain/orderDraft'
import { ItemCombobox } from './ItemCombobox'
import { MemberCombobox } from './MemberCombobox'

type Props = {
  draft: OrderDraft
  members: Member[]
  items: InventoryItem[]
  onDraftChange: (draft: OrderDraft) => void
  onSubmit: () => Promise<boolean>
  error: string
  onClose: () => void
}

export function OrderCreateModal({ draft, members, items, onDraftChange, onSubmit, error, onClose }: Props) {
  const lastLineRef = useRef<HTMLDivElement>(null)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [dateError, setDateError] = useState('')

  useEffect(() => {
    lastLineRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' })
  }, [draft.lines.length])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Validate date if provided
    if (draft.dueDate) {
      const dueDate = new Date(draft.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (dueDate < today) {
        setDateError('Rok za povrat ne može biti u prošlosti')
        return
      }
    }

    setDateError('')
    setShowSubmitConfirm(true)
  }

  async function confirmSubmit() {
    setShowSubmitConfirm(false)
    const success = await onSubmit()
    if (success) onClose()
  }

  function handleClose() {
    if (draft.lines.some((line) => line.itemId !== '')) {
      setShowCancelConfirm(true)
    } else {
      onClose()
    }
  }

  function confirmCancel() {
    setShowCancelConfirm(false)
    onClose()
  }

  function updateLine(index: number, patch: Partial<OrderDraft['lines'][number]>) {
    onDraftChange({
      ...draft,
      lines: draft.lines.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    })
  }

  function addLine() {
    onDraftChange({ ...draft, lines: [...draft.lines, { itemId: '', quantity: 1 }] })
  }

  function removeLine(index: number) {
    onDraftChange({ ...draft, lines: draft.lines.filter((_, i) => i !== index) })
  }

  const hasValidLine = draft.lines.some((line) => line.itemId !== '' && line.quantity > 0)
  const isValid = draft.memberId !== '' && hasValidLine

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

      <div
        className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-[0_-20px_80px_rgba(15,23,42,0.2)] sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:shadow-[0_40px_120px_rgba(15,23,42,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-8">
          {/* Drag handle — visible on mobile only */}
          <div className="mb-5 flex justify-center sm:hidden">
            <div className="h-1 w-10 rounded-full bg-slate-300" />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-700">Kreiranje</p>
              <h2 className="mt-2 font-display text-3xl text-slate-950">Novo zaduženje</h2>
            </div>
            <button
              type="button"
              className="mt-1 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              onClick={handleClose}
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
            <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="order-member">
                  Član (zadužuje)
                </label>
                <MemberCombobox
                  id="order-member"
                  members={members}
                  value={draft.memberId}
                  onChange={(memberId) => onDraftChange({ ...draft, memberId })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="order-due-date">
                  Rok za povrat <span className="font-normal text-slate-400">(opcionalno)</span>
                </label>
                <input
                  className={`${inputClasses} ${dateError ? 'border-rose-300 bg-rose-50' : ''}`}
                  id="order-due-date"
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) => {
                    setDateError('')
                    onDraftChange({ ...draft, dueDate: e.target.value })
                  }}
                />
                {dateError && <p className="text-xs font-semibold text-rose-700">{dateError}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Oprema</span>
              </div>

              {draft.lines.map((line, index) => {
                const selected = items.find((item) => item.id === line.itemId)
                const isLastLine = index === draft.lines.length - 1
                return (
                  <div key={index} ref={isLastLine ? lastLineRef : null} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:space-y-0 sm:border-0 sm:bg-transparent sm:p-0">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600" htmlFor={`order-line-item-${index}`}>
                        Stavka
                      </label>
                      <ItemCombobox
                        id={`order-line-item-${index}`}
                        items={items}
                        value={line.itemId}
                        onChange={(itemId) => updateLine(index, { itemId })}
                      />
                    </div>
                    <div className="flex items-end gap-3 sm:gap-2">
                      <div className="flex-1 space-y-2 sm:flex-none sm:w-24 sm:space-y-1">
                        <label className="text-xs font-semibold text-slate-600" htmlFor={`order-line-qty-${index}`}>
                          Kol.
                        </label>
                        <input
                          className={inputClasses}
                          id={`order-line-qty-${index}`}
                          type="number"
                          min={1}
                          max={selected?.availableQuantity ?? undefined}
                          value={line.quantity}
                          onChange={(e) => updateLine(index, { quantity: Number(e.target.value) })}
                        />
                      </div>
                      {draft.lines.length > 1 ? (
                        <button
                          type="button"
                          className="rounded-lg bg-rose-50 p-2.5 text-rose-600 transition-colors hover:bg-rose-100 sm:rounded-full sm:p-2"
                          onClick={() => removeLine(index)}
                          aria-label="Ukloni stavku"
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      ) : null}
                    </div>
                  </div>
                )
              })}

              <button
                type="button"
                className="w-full rounded-lg border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-red-700 hover:text-red-700 sm:py-2"
                onClick={addLine}
              >
                + Dodaj stavku
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700" htmlFor="order-note">
                Napomena <span className="font-normal text-slate-400">(opcionalno)</span>
              </label>
              <textarea
                className={`${inputClasses} min-h-[4rem] resize-y`}
                id="order-note"
                value={draft.note}
                onChange={(e) => onDraftChange({ ...draft, note: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-3 pb-2 pt-3 sm:flex-row">
              <button type="submit" className={primaryButtonClasses} disabled={!isValid}>
                Kreiraj zaduženje
              </button>
              <button type="button" className={secondaryButtonClasses} onClick={handleClose}>
                Otkaži
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSubmitConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0" onClick={() => setShowSubmitConfirm(false)}>
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_40px_120px_rgba(15,23,42,0.3)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-slate-950">Potvrdi zaduženje</h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Član</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {members.find((m) => m.id === draft.memberId)?.fullName || 'Nije odabrano'}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Rok za povrat</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {draft.dueDate ? new Date(draft.dueDate).toLocaleDateString('sr-RS') : 'Nije odabrano'}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 mb-3">Oprema ({draft.lines.length})</p>
                <ul className="space-y-2">
                  {draft.lines.map((line, index) => {
                    const item = items.find((i) => i.id === line.itemId)
                    return (
                      <li key={index} className="text-sm text-slate-700">
                        <span className="font-semibold">{item?.name || 'Nepoznata stavka'}</span>
                        <span className="text-slate-500"> × {line.quantity}</span>
                      </li>
                    )
                  })}
                </ul>
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
                onClick={() => setShowSubmitConfirm(false)}
              >
                Nazad
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0" onClick={() => setShowCancelConfirm(false)}>
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-[0_40px_120px_rgba(15,23,42,0.3)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-slate-950">Odbaci zaduženje?</h3>
            <p className="mt-3 text-sm text-slate-600">Sve izmene će biti izgubljene.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className={primaryButtonClasses}
                onClick={confirmCancel}
              >
                Odbaci
              </button>
              <button
                type="button"
                className={secondaryButtonClasses}
                onClick={() => setShowCancelConfirm(false)}
              >
                Nastavi uređivanje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
