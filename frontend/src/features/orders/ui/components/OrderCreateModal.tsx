import type { FormEvent } from 'react'

import type { InventoryItem } from '../../../inventory/domain/inventoryItem'
import type { Member } from '../../../members/domain/member'
import { inputClasses, primaryButtonClasses, secondaryButtonClasses } from '../../../../ui/theme'
import type { OrderDraft } from '../../domain/orderDraft'

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
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const success = await onSubmit()
    if (success) onClose()
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
  const isValid = draft.memberId !== '' && draft.dueDate !== '' && hasValidLine

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

      <div
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-[0_40px_120px_rgba(15,23,42,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-700">Kreiranje</p>
              <h2 className="mt-2 font-display text-3xl text-slate-950">Novo zaduženje</h2>
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
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">
              {error}
            </p>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="order-member">
                  Član (zadužuje)
                </label>
                <select
                  className={inputClasses}
                  id="order-member"
                  value={draft.memberId}
                  onChange={(e) =>
                    onDraftChange({ ...draft, memberId: e.target.value === '' ? '' : Number(e.target.value) })
                  }
                >
                  <option value="" disabled>
                    Odaberite člana
                  </option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.fullName}
                      {member.team ? ` (${member.team})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="order-due-date">
                  Rok za povrat
                </label>
                <input
                  className={inputClasses}
                  id="order-due-date"
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) => onDraftChange({ ...draft, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Oprema</span>
                <button
                  type="button"
                  className="text-sm font-semibold text-red-700 underline hover:text-red-900"
                  onClick={addLine}
                >
                  + Dodaj stavku
                </button>
              </div>

              {draft.lines.map((line, index) => {
                const selected = items.find((item) => item.id === line.itemId)
                return (
                  <div key={index} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-semibold text-slate-600" htmlFor={`order-line-item-${index}`}>
                        Stavka
                      </label>
                      <select
                        className={inputClasses}
                        id={`order-line-item-${index}`}
                        value={line.itemId}
                        onChange={(e) =>
                          updateLine(index, { itemId: e.target.value === '' ? '' : Number(e.target.value) })
                        }
                      >
                        <option value="" disabled>
                          Odaberite opremu
                        </option>
                        {items.map((item) => (
                          <option key={item.id} value={item.id} disabled={item.availableQuantity === 0}>
                            {item.name} (dostupno: {item.availableQuantity})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24 space-y-1">
                      <label className="text-xs font-semibold text-slate-600" htmlFor={`order-line-qty-${index}`}>
                        Količina
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
                        className="mb-1 rounded-full p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        onClick={() => removeLine(index)}
                        aria-label="Ukloni stavku"
                      >
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                          <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                )
              })}
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

            <div className="flex gap-3 pt-2">
              <button type="submit" className={primaryButtonClasses} disabled={!isValid}>
                Kreiraj zaduženje
              </button>
              <button type="button" className={secondaryButtonClasses} onClick={onClose}>
                Otkaži
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
