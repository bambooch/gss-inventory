import { useState, type FormEvent } from 'react'

import {
  cardClasses,
  dangerButtonClasses,
  inputClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from '../../../ui/theme'
import type { ItemCategory } from '../domain/inventoryItem'
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '../infrastructure/inventoryCategoryApi'
import { useCategories } from '../application/useCategories'

type DraftCategory = { name: string; label: string; sortOrder: string }
const emptyDraft: DraftCategory = { name: '', label: '', sortOrder: '' }

export function CategoryManagementPage() {
  const { categories, setCategories } = useCategories()
  const [draft, setDraft] = useState<DraftCategory>(emptyDraft)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState<DraftCategory>(emptyDraft)
  const [error, setError] = useState('')

  function toDraft(cat: ItemCategory): DraftCategory {
    return { name: cat.name, label: cat.label, sortOrder: String(cat.sortOrder) }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const created = await createCategory(draft.name, draft.label, Number(draft.sortOrder) || 0)
      setCategories((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder))
      setDraft(emptyDraft)
    } catch {
      setError('Nije moguće kreirati kategoriju.')
    }
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault()
    if (editingId === null) return
    setError('')
    try {
      const updated = await updateCategory(editingId, editDraft.name, editDraft.label, Number(editDraft.sortOrder) || 0)
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)).sort((a, b) => a.sortOrder - b.sortOrder),
      )
      setEditingId(null)
    } catch {
      setError('Nije moguće ažurirati kategoriju.')
    }
  }

  async function handleDelete(id: number) {
    setError('')
    try {
      await deleteCategory(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch {
      setError('Nije moguće obrisati kategoriju. Možda ima opreme vezane za nju.')
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className={cardClasses}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-red-700">Podešavanja</p>
          <h1 className="font-display text-4xl leading-tight">Kategorije</h1>
          <p className="mt-2 text-slate-600">
            Upravljajte kategorijama opreme. Oprema može imati više kategorija ili nijednu.
          </p>
        </div>

        <div className={cardClasses}>
          <h2 className="font-display text-2xl text-slate-950">Nova kategorija</h2>
          <form className="mt-4 space-y-3" onSubmit={(e) => void handleCreate(e)}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Ključ (npr. ALATI)</label>
                <input
                  className={inputClasses}
                  placeholder="NAZIV_KATEGORIJE"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Naziv za prikaz</label>
                <input
                  className={inputClasses}
                  placeholder="Alati"
                  value={draft.label}
                  onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <div className="w-36 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Redoslijed</label>
                <input
                  className={inputClasses}
                  type="number"
                  min={0}
                  placeholder="0"
                  value={draft.sortOrder}
                  onChange={(e) => setDraft({ ...draft, sortOrder: e.target.value })}
                />
              </div>
              <button className={primaryButtonClasses} type="submit" disabled={!draft.name || !draft.label}>
                Dodaj kategoriju
              </button>
            </div>
          </form>
          {error ? (
            <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              {error}
            </p>
          ) : null}
        </div>

        <div className={cardClasses}>
          <h2 className="font-display text-2xl text-slate-950">Sve kategorije</h2>
          <div className="mt-4 space-y-2">
            {categories.length === 0 && (
              <p className="text-sm text-slate-500">Nema definisanih kategorija.</p>
            )}
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
              >
                {editingId === cat.id ? (
                  <form className="space-y-3" onSubmit={(e) => void handleUpdate(e)}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Ključ</label>
                        <input
                          className={inputClasses}
                          value={editDraft.name}
                          onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value.toUpperCase() })}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Naziv za prikaz</label>
                        <input
                          className={inputClasses}
                          value={editDraft.label}
                          onChange={(e) => setEditDraft({ ...editDraft, label: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-36 space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Redoslijed</label>
                        <input
                          className={inputClasses}
                          type="number"
                          min={0}
                          value={editDraft.sortOrder}
                          onChange={(e) => setEditDraft({ ...editDraft, sortOrder: e.target.value })}
                        />
                      </div>
                      <button className={primaryButtonClasses} type="submit">Spremi</button>
                      <button
                        className={secondaryButtonClasses}
                        type="button"
                        onClick={() => setEditingId(null)}
                      >
                        Otkaži
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-800">{cat.label}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{cat.name}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        className={secondaryButtonClasses}
                        type="button"
                        onClick={() => { setEditingId(cat.id); setEditDraft(toDraft(cat)) }}
                      >
                        Uredi
                      </button>
                      <button
                        className={dangerButtonClasses}
                        type="button"
                        onClick={() => void handleDelete(cat.id)}
                      >
                        Obriši
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
